# overfin-web

The web client of [Overfin](https://github.com/C0PT3R/overfin), served by
Overfin by default: a single-page app in [Svelte](https://svelte.dev) and
TypeScript, on Overfin's
[JavaScript SDK](https://github.com/C0PT3R/overfin/tree/main/sdk/js).

- **Account setup**: start fresh, arrive with an invitation, or bring a
  previous account over.
- **Who's watching?**: profiles, PINs, adding a profile (kids profiles with
  a rating ceiling).
- **Profiles and devices**: renaming, kids limits, setting, changing and
  removing PINs, deleting profiles, signed-in devices; the site asks for a
  PIN or a fresh login when the server wants one.
- **Account**: downloading your data, deleting your account.
- **Home**: continue watching, next up, the watchlist, latest per library.
- **Libraries**: sorting, a repeatable shuffle, infinite scroll.
- **Title pages**: series, seasons, episodes, cast, the watchlist.
- **Player**: Overfin picks direct play, repackaging or transcoding from what
  the browser declares; audio and subtitle choice, "Skip intro", progress,
  resume, and taking playback back from another device.
- **English and French**, following the browser until the person picks one.

Every screen lives in the address (`#/item/…`, `#/play/…`), so a reload
comes back to it.

## How it's built

| | |
| --- | --- |
| `src/App.svelte` | Who's here first (setup, no access, "Who's watching?"), then the screen the address names |
| `src/pages/` | One component per screen |
| `src/components/` | What screens share: cards, rows, the header, dialogs |
| `src/lib/` | The SDK client, the router, translations, the session, the site's dialogs |
| `src/lib/sdk/` | A copy of Overfin's SDK (`overfin.js`, with its types) |
| `src/locales/` | The texts, one file per language |
| `dist/` | The built site, committed: what Overfin embeds |
| `web.go` | The Go package Overfin imports: `web.Files` (dist/) and `web.SDK` |

```sh
npm ci            # install (no install scripts run: see .npmrc)
npm run check     # types
npm test          # tests
npm run build     # dist/, to commit with the sources
```

CI rebuilds the site and fails if `dist/` isn't exactly what the sources
build. Dependencies are pinned to exact versions, and Dependabot proposes
updates.

### Rules the code follows

- **Text from the server is only ever text.** Svelte escapes everything it
  shows; `{@html}` is never used.
- **Everything comes from the site itself,** under a strict
  Content-Security-Policy: no inline scripts or styles, no `eval`, nothing
  from a third party. Styles set from code go through `style:` directives,
  never `style="…"` with values.
- **Every text is translated:** `t('key')`, with the key in every file of
  `src/locales/` (the type check fails otherwise, and a test checks each
  language fills in the same values).
- **Usable with a keyboard or a TV remote:** real buttons and links, visible
  focus, the site's own dialogs instead of the browser's.
- **Never name the software underneath** to the people using the site.
- **hls.js loads only when something plays,** so the site stays light on
  phones and TVs.

## How it's served

overfin-web is its own app, on Overfin's public API like any other client.
Overfin's official build bundles it (`web.Files`, imported as
`github.com/C0PT3R/overfin-web`), and Overfin serves it at the site's root,
to logged-in visitors only. The core never imports it; a build chooses its
site, or none. It needs the `library` and `playback` plugins.

To serve a changed copy instead, point `[site] serve` at your `dist/` in
Overfin's configuration: Overfin serves it the same way, read live.

`src/lib/sdk/overfin.js` is a copy of the SDK: Overfin's tests check that
the version it bundles (`web.SDK`) matches its own, so update both
together.

## Third-party code

[hls.js](https://github.com/video-dev/hls.js), under the Apache License 2.0,
plays HLS streams in browsers without native support. It's bundled into the
site, so browsers never contact a third party; its license is published
with it (`public/licenses/hls.js.txt`).

## License

[MIT](LICENSE).

overfin-web is developed with the help of AI (Claude, by Anthropic), like
Overfin: commits it contributed to carry a `Co-Authored-By: Claude` trailer,
and every change is reviewed by a human maintainer.
