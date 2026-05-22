# Work Log

## 2026-05-21

- Initialized the project structure for a full-stack Word formatting tool.
- Added React/Vite client scaffold, Express/TypeScript server scaffold, and shared document/style types.
- Added formula fields to the shared document model so OMML and LaTeX can be preserved as editable math.
- The workspace is not currently inside a Git repository, so no atomic commit was created for this step.

## 2026-05-21 Step 2

- Added DOCX upload parsing API.
- Added basic Open XML paragraph extraction and formula node extraction.
- Added frontend DOCX upload control, document structure preview, and KaTeX formula rendering.

## 2026-05-22 Step 3

- Added template style extraction endpoint.
- Extracted paragraph styles, page margins, and formula style placeholders from template DOCX files.
- Connected template upload to the right-side style panel.
