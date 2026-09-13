# Deck source

`build.js` generates `docs/presentation/nine-ways-to-run-an-agent.pptx` with
pptxgenjs. It is not part of the application and is not an npm dependency of
this repository.

Rebuild from a scratch folder outside the repository:

```bash
mkdir -p /tmp/deckbuild && cd /tmp/deckbuild && npm init -y >/dev/null && npm install pptxgenjs@3
```

```bash
node /path/to/sprintboard-webinar/docs/presentation/deck-source/build.js /path/to/sprintboard-webinar/docs/presentation/nine-ways-to-run-an-agent.pptx
```

Visual check (LibreOffice and Poppler from Homebrew):

```bash
soffice --headless --convert-to pdf nine-ways-to-run-an-agent.pptx && pdftoppm -jpeg -r 110 nine-ways-to-run-an-agent.pdf slide
```

Palette: background `0B1026`, cards `141B3A`/`1B2449`, text `F3F5FB`, muted
`A7B0CE`, Terra `4FD1A5`, Sol `FFB547`, Astra `A78BFA`, Luna `C8D2E8`, danger
`FF6B6B`. Fonts: Calibri and Courier New.
