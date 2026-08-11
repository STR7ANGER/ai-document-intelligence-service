package parser

import (
	"errors"
	"strings"
	"unicode"
)

type Block struct {
	ID         string  `json:"id"`
	Kind       string  `json:"kind"`
	Text       string  `json:"text"`
	Confidence float64 `json:"confidence"`
}
type Page struct {
	Number int     `json:"number"`
	Blocks []Block `json:"blocks"`
}
type OCR interface {
	Extract(image []byte) (string, float64, error)
}

func ParseText(text string) ([]Page, error) {
	if len(text) > 10_000_000 {
		return nil, errors.New("document exceeds parser limit")
	}
	clean := strings.Map(func(r rune) rune {
		if unicode.IsControl(r) && r != '\n' && r != '\t' && r != '\f' {
			return -1
		}
		return r
	}, text)
	parts := strings.Split(clean, "\f")
	pages := make([]Page, 0, len(parts))
	for i, part := range parts {
		lines := strings.Split(strings.TrimSpace(part), "\n")
		blocks := make([]Block, 0, len(lines))
		for j, line := range lines {
			line = strings.TrimSpace(line)
			if line != "" {
				kind := "paragraph"
				if len(line) < 100 && !strings.HasSuffix(line, ".") {
					kind = "heading"
				}
				blocks = append(blocks, Block{ID: strings.Join([]string{"p", itoa(i + 1), "b", itoa(j + 1)}, "-"), Kind: kind, Text: line, Confidence: 1})
			}
		}
		pages = append(pages, Page{Number: i + 1, Blocks: blocks})
	}
	return pages, nil
}
func ParseImage(image []byte, ocr OCR) ([]Page, error) {
	if len(image) == 0 {
		return nil, errors.New("empty image")
	}
	text, confidence, err := ocr.Extract(image)
	if err != nil {
		return nil, err
	}
	return []Page{{Number: 1, Blocks: []Block{{ID: "p-1-b-1", Kind: "ocr", Text: text, Confidence: confidence}}}}, nil
}
func itoa(value int) string {
	digits := "0123456789"
	if value < 10 {
		return string(digits[value])
	}
	return itoa(value/10) + string(digits[value%10])
}
