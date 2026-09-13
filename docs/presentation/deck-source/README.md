# Deck source

`build.cjs` generates `docs/presentation/nine-ways-to-run-an-agent.pptx` with
pptxgenjs: five light, minimalist slides whose speaker notes follow
`docs/presentation/live-script.pdf`. The presenter uses the Google Slides copy of
this file in Google Drive. It is not part of the application and is not an npm
dependency of this repository.

The file is CommonJS (`.cjs`) because the repository's `package.json` sets
`"type": "module"`. Build from a scratch folder outside the repository:

```bash
mkdir -p /tmp/deckbuild && cd /tmp/deckbuild && npm init -y >/dev/null && npm install pptxgenjs@3
```

```bash
cp /path/to/sprintboard-webinar/docs/presentation/deck-source/build.cjs /tmp/deckbuild/ && node /tmp/deckbuild/build.cjs /path/to/sprintboard-webinar/docs/presentation/nine-ways-to-run-an-agent.pptx
```

Visual check (LibreOffice and Poppler from Homebrew; Inter and JetBrains Mono
fall back to local fonts, so check the final look in Google Slides):

```bash
soffice --headless --convert-to pdf nine-ways-to-run-an-agent.pptx && pdftoppm -png -r 80 nine-ways-to-run-an-agent.pdf slide
```

Palette: background `F7F6F2`, ink `15171F`, muted `6B6F80`, faint `A3A6B3`,
rules `DEDCD5`, accent `1F8A67` (soft `E3F1EA`), danger `C0453A` (soft
`F7E6E2`), lanes Luna `B6C0D6`, Terra `3FB68C`, Sol `F2A93B`, Astra `8E74E8`.
Fonts: Inter and JetBrains Mono (both available in Google Slides).
