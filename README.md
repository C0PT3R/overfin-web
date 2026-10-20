# overfin-web

The web client of [Overfin](https://github.com/C0PT3R/overfin), served by
Overfin by default: plain HTML, CSS and JavaScript on Overfin's
[JavaScript SDK](https://github.com/C0PT3R/overfin/tree/main/sdk/js), with no
framework and no build step. `app.js` is only screens; the SDK does the
rest.

- **Account setup**: start fresh, arrive with an invitation, or bring a
  previous account over.
- **Who's watching?**: profiles, PINs, adding a profile (kids profiles with
  a rating ceiling).
- **Profiles and devices**: renaming, kids limits, setting, changing and
  removing PINs, deleting profiles, signed-in devices; the page asks for a
  PIN or a fresh login when the server wants one.
- **Account**: downloading your data, deleting your account.
- **Home**: continue watching, next up, latest per library.
- **Libraries**: sorting, a repeatable shuffle, infinite scroll with cursors.
- **Item pages**: series, seasons, episodes, cast, the watchlist.
- **Player**: Overfin picks direct play, repackaging or transcoding from what
  the browser declares; audio and subtitle choice, "Skip intro", progress
  reporting, resume, and a clear message when another device takes over.

Every screen lives in the address (`#/item/…`, `#/play/…`), so a reload
comes back to it; playback resumes from the position the player last
reported. Text from the server is only ever set with `textContent`.

## How it's served

overfin-web is its own app, on Overfin's public API like any other client.
Overfin's official build bundles it (`web.Files`, in `web.go`, imported as
`github.com/C0PT3R/overfin-web`), and Overfin serves it at the site's root, to logged-in visitors only, with a
strict Content-Security-Policy: everything comes from the site itself. The
core never imports it; a build chooses its site, or none. It needs the
`library` and `playback` plugins.

To serve a changed copy instead, point `[site] serve` at its folder in
Overfin's configuration: Overfin serves it the same way, read live.

`overfin.js` is a copy of the SDK: Overfin's tests check that the version it
bundles matches its SDK, so update both together.

## Third-party code

`vendor/hls-1.7.3.min.js` is [hls.js](https://github.com/video-dev/hls.js)
1.7.3, unmodified, under the Apache License 2.0 (`vendor/hls.js-LICENSE`).
It plays HLS streams in browsers without native support. It's served from
the site itself, so browsers never contact a third party.

## License

[MIT](LICENSE).

overfin-web is developed with the help of AI (Claude, by Anthropic), like
Overfin: commits it contributed to carry a `Co-Authored-By: Claude` trailer,
and every change is reviewed by a human maintainer.
