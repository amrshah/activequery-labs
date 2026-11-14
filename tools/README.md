# ActiveQuery source inspection tool

`aq-inspect.mjs` creates a static lexical inventory from upstream source files supplied by the user.

## Usage

```bash
node tools/aq-inspect.mjs --css ./upstream/ActiveQuery.css --js ./upstream/ActiveQuery.js --out ./aq-inventory.json
```

Either `--css` or `--js` can be used independently. The tool reports CSS class selector candidates and media query expressions, plus AQJS named exports and indentation-based method candidates.

## Important limitations

This is a discovery aid, not a CSS parser, JavaScript AST parser, semantic API extractor or compatibility test. It may include selectors from embedded third-party code and it may miss selectors assembled dynamically. Method candidates must be manually checked for class scope, signature, return value, side effects and behavior. Do not publish its output as a verified API reference without source review and browser tests.

The tool reads local files and does not download, modify or redistribute upstream source.
