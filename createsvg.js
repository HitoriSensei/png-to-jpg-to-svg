#!/usr/bin/env node
const gm = require('gm')
const fs = require('fs')
const Mustache = require('mustache')

const sourcePath = process.argv[2]
const RGBquality = process.argv[3] || 80
const Alphaquality = process.argv[4] || 90

const AlphaMatrix = [
	0,0,0,0,
  	0,0,0,0,
  	0,0,0,1,
  	1,1,1,1
]

const RGBMatrix = [
	1,0,0,0,
  	0,1,0,0,
  	0,0,1,0,
  	1,1,1,1
]

/**
 * create alpha image
 */
const Alpha = new Promise(
	(y, n) => gm(sourcePath)
	.recolor(AlphaMatrix)
	.quality(Alphaquality)
	.toBuffer(`JPEG`, (err, Alphabuffer) => {
		if(err) {
			return n(err)
		}
		y(Alphabuffer)
	})
)


/**
 * create rgb image
 */
const RGB = new Promise(
	(y, n) => gm(sourcePath)
		.recolor(RGBMatrix)
		.quality(RGBquality)
		.toBuffer(`JPEG`, (err, RGBbuffer) => {
			if(err) {
				return n(err)
			}
			y(RGBbuffer)
		})
)


const Dimensions = new Promise(
	(y, n) => gm(sourcePath)
		.size((err, data) => {
			if(err) {
				return n(err)
			}
			y(data)
		})
)


Promise.all([
	Alpha,
	RGB,
	Dimensions
])
	.then(([
		Alpha,
		RGB,
		Dimensions
	]) => {
		const RGBUrl = `${sourcePath}.rgb.jpg`
		const AlphaURL = `${sourcePath}.a.jpg`

		const Data = {
			width: String(Dimensions.width),
			height: String(Dimensions.height),
			RGB: RGB.toString('base64'),
			Alpha: Alpha.toString('base64'),
			RGBUrl: `./${RGBUrl}`,
			AlphaUrl: `./${AlphaURL}`,
		}

		fs.writeFileSync(
			RGBUrl,
			RGB	
		)

		fs.writeFileSync(
			AlphaURL,
			Alpha	
		)

		fs.writeFileSync(
			`${sourcePath}.svg`,
			Mustache.render(
				fs.readFileSync('template.svg').toString(),
				Data
			)	
		)

		fs.writeFileSync(
			`${sourcePath}.embed.svg`,
			Mustache.render(
				fs.readFileSync('template.embed.svg').toString(),
				Data
			)	
		)
	})
