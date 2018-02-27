# png-to-jpg-to-svg
Converts a PNG file to a set of JPG+SVG files making a some kind of "JPG with alpha channel" image using SVG filters.

Allows up to ~85% size decrease of complicated images compared to a PNG file.

IE 10+ support.

When using the created SVG file, browser needs to support SVG filters:
https://caniuse.com/#feat=svg-filters

Usage:

png-to-svg path/to/file.png [color quality 0-100 default:80] [alpha quality 0-100 default:90]

Example:
* https://codepen.io/HitoriSensei/pen/xpXypv
* https://codepen.io/HitoriSensei/pen/QaqVwb
