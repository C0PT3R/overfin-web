// Package web is overfin-web, Overfin's web client, built (dist/) and ready
// to serve. Overfin's official build bundles it; the sources are in src/.
package web

import (
	"embed"
	"io/fs"
)

//go:embed all:dist
var dist embed.FS

// Files are the client's built files, served as they are.
var Files fs.FS = mustSub(dist, "dist")

// SDK is the copy of Overfin's JavaScript SDK the client is built with, so
// Overfin can check it matches its own.
//
//go:embed src/lib/sdk/overfin.js
var SDK []byte

func mustSub(f fs.FS, dir string) fs.FS {
	sub, err := fs.Sub(f, dir)
	if err != nil {
		panic(err)
	}
	return sub
}
