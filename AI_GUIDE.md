# AI Guide

## Project Intent

Build a web-based Word formatting tool that supports template style extraction, live document preview, manual style application, automatic formatting, reusable style libraries, and DOCX export.

## Engineering Rules

- Keep frontend, backend, and shared type boundaries explicit.
- Prefer structured DOCX/Open XML parsing over ad hoc text extraction.
- Preserve original document structure whenever exporting modified DOCX files.
- Treat Word formulas as structured math. Preserve OMML, expose editable LaTeX to the frontend, render with a math engine, and never convert formulas to images as the primary representation.
- Add focused tests around parsing, style mapping, and export behavior as those modules are introduced.

## Visual Direction

The product is a work-focused document tool. Use a dense, quiet interface with stable panes, clear toolbars, and scan-friendly style controls.
