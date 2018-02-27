#!/usr/bin/env node
const gm = require('gm')
const fs = require('fs')
const Mustache = require('mustache')
const path = require('path')

const sourcePath = process.argv[2]
const RGBquality = process.argv[3] || 80
const Alphaquality = process.argv[4] || 90

if(!sourcePath) {
	console.error('No PNG path provided')
	console.warn(`Usage: ${process.argv[1]} path/to/file.png [color quality 0-100 default:80] [alpha quality 0-100 default:90]`)
	process.exit(1)
	return
}

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
	.catch(console.error)


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
	.catch(console.error)


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
			RGBUrl: `./${path.basename(RGBUrl)}`,
			AlphaUrl: `./${path.basename(AlphaURL)}`,
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
				fs.readFileSync(path.join(__dirname,'template.svg')).toString(),
				Data
			)	
		)

		fs.writeFileSync(
			`${sourcePath}.embed.svg`,
			Mustache.render(
				fs.readFileSync(path.join(__dirname,'template.embed.svg')).toString(),
				Data
			)	
		)
	})
	.catch(console.error)
