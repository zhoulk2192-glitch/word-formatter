# Word Formatter

Web-based Word formatting tool for extracting styles from template DOCX files, manually applying styles to selected content, automatically formatting documents, managing reusable style libraries, preserving editable formulas, and exporting formatted DOCX files.

## Tech Stack

- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express, TypeScript
- Formula rendering: KaTeX or MathJax on the frontend, with OMML/LaTeX conversion in the document service
- Shared contracts: TypeScript workspace package

## Project Structure

```text
word-formatter/
  client/    React application and editor UI
  server/    API service for DOCX parsing, style extraction, automation, and export
  shared/    Shared document and style type definitions
  tests/     Cross-package and document fixture tests
  samples/   Local development DOCX fixtures
  .generated/ Local build output
```

## Install

```bash
npm install
```

## Run

```bash
npm run dev:server
npm run dev:client
```

The client runs at `http://127.0.0.1:5173`.
The API runs at `http://127.0.0.1:4173`.

## DOCX Structure Parsing

The first parser pass reads `word/document.xml` from uploaded DOCX files, extracts paragraph nodes, basic paragraph style ids, and OMML formula objects. Formula nodes preserve the raw OMML XML and expose a best-effort LaTeX string for frontend rendering.

## Checks

```bash
npm run type-check
npm run lint
npm run build
```
