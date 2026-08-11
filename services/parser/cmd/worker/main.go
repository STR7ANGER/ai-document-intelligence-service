package main

import (
	"encoding/json"
	"github.com/STR7ANGER/ai-document-intelligence-service/services/parser/internal/parser"
	"os"
)

func main() {
	pages, err := parser.ParseText("Document parser ready")
	if err != nil {
		panic(err)
	}
	json.NewEncoder(os.Stdout).Encode(map[string]any{"status": "ready", "sample": pages})
}
