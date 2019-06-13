# png-to-jpg-to-svg
Allows to get goodies from both JPG (compression algorithm) and PNG (alpha channel support).

Converts a PNG file to a set of JPG+SVG files making a some kind of "JPG with alpha channel" image using SVG filters.

Allows up to ~85% size decrease of non-trivial images (like semi-transparent photos) compared to a PNG file.

IE 10+ support.

When using the created SVG file, browser needs to support SVG filters:
https://caniuse.com/#feat=svg-filters

Usage:

png-to-svg path/to/file.png [color quality 0-100 default:80] [alpha quality 0-100 default:90]

Example:
* https://codepen.io/HitoriSensei/pen/xpXypv
* https://codepen.io/HitoriSensei/pen/QaqVwb
