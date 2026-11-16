# AQJS Element.sancha interpolation and HTML-safety audit

Source: ActiveQuery.js v25.6.0, pinned SHA `b8ec9e5be8668d048eea3385cd9012dfddb69cf0`.

## Findings

- The data-rendering path interpolates values into an HTML string and passes the result to `insertAdjacentHTML` or assigns it to `innerHTML`.
- Interpolated values are not HTML-escaped. A value containing markup becomes live DOM, rather than a text node.
- The data-rendering implementation also assigns to undeclared loop identifiers (`ii` and `i`), which causes a `ReferenceError` in a strict/module execution context unless those globals already exist. A test fixture can define them to reach and audit the later interpolation behavior; that does not make the API safe.
- Dollar-prefixed placeholders read from a global `variables` object. Treat this as ambient-global coupling, not a scoped template context.
- Static mode directly inserts the supplied template as HTML and is not a safe escaping mechanism either.

## Security and integration guidance

Do not pass user-controlled or otherwise untrusted values into `sancha` templates. The method is an HTML insertion API, not a safe text templating engine. Prefer DOM construction and `textContent`, or use a maintained template engine with contextual output escaping. If rich HTML is a requirement, sanitize with a vetted sanitizer and a narrowly defined allowlist before insertion.

## Validation

`tests/aqjs-sancha-security.spec.js` reaches the data interpolation branch by defining the undeclared loop globals in the isolated fixture, then verifies that a markup value is parsed into an actual image element. It compares source and minified builds. CI evidence will be recorded after the run completes.
