package parser

import (
	"errors"
	"testing"
)

type fakeOCR struct{ fail bool }

func (f fakeOCR) Extract(_ []byte) (string, float64, error) {
	if f.fail {
		return "", 0, errors.New("ocr unavailable")
	}
	return "Invoice total 42", .93, nil
}
func TestParsePagesAndBlocks(t *testing.T) {
	pages, err := ParseText("Title\nBody text.\fSecond page")
	if err != nil || len(pages) != 2 || pages[0].Blocks[0].Kind != "heading" {
		t.Fatalf("unexpected parse %#v %v", pages, err)
	}
}
func TestOCRAdapterAndFailure(t *testing.T) {
	pages, err := ParseImage([]byte{1}, fakeOCR{})
	if err != nil || pages[0].Blocks[0].Confidence != .93 {
		t.Fatal("expected OCR result")
	}
	if _, err := ParseImage([]byte{1}, fakeOCR{fail: true}); err == nil {
		t.Fatal("expected adapter error")
	}
}
