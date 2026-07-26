# Uploaded Research Pack

This synthetic document is safe to use in automated upload demonstrations.

## File Validation

The upload gateway checks the filename, MIME type, document size, and page
count before accepting a source. A validation result records which policy was
applied and why the document is safe to process.

## PDF and Markdown Parsing

The parser converts PDF pages and Markdown blocks into normalized text while
retaining headings, tables, lists, and page anchors. Parsed blocks keep their
original order and a stable reference back to the uploaded file.

## Metadata Extraction

The metadata extractor identifies the title, author, publication date,
document type, and source label. These fields help the retrieval ranker
distinguish authoritative material from background context.

## Document Chunking

The chunker divides normalized text at semantic boundaries instead of using a
fixed character count. Each chunk overlaps its neighbor just enough to preserve
definitions, dependencies, and multi-step explanations.

## Section Detection

The section detector groups related chunks into named concepts. It recognizes
when a definition, workflow, risk, and decision criterion belong to distinct
sections even when they appear on the same page.

## Source Index

The source index stores embeddings, lexical terms, timestamps, and provenance
for every accepted chunk. Hybrid retrieval combines semantic similarity with
exact keywords and freshness signals.

## Evidence Linking

Evidence linking attaches source excerpts to claims and section notes. A user
can expand a citation to inspect the supporting passage and understand why the
system used it.

## Claim Extraction

The claim extractor separates factual statements, recommendations, trade-offs,
and unresolved questions. Each claim keeps a confidence level and its strongest
supporting evidence.

## Cross-Section Synthesis

Cross-section synthesis records when one section supports, contrasts with, or
depends on another. These relationship notes become the clickable bridges in
the Section Map.

## Citation Map

The citation map verifies that each displayed source supports the nearby claim.
It also identifies unsupported claims, duplicate citations, and disagreements
between sources.

## Query-Ready Memory

After indexing is complete, users can ask questions across the saved knowledge.
The response includes a primary reasoning path and highlights the exact
sections and bridges that contributed to the answer.
