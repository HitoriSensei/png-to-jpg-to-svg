#!/usr/bin/env node
const gm = require('gm')
const fs = require('fs')
const Mustache = require('mustache')

const sourcePath = process.argv[2]

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
gm(sourcePath)
	.recolor(AlphaMatrix)
	.quality(70)
	.write(`${sourcePath}.a.jpg`, (err) => {
		if(err) {
			console.error(err)
			process.exit(1)
		}
	})


/**
 * create rgb image
 */
gm(sourcePath)
	.recolor(RGBMatrix)
	.quality(80)
	.write(`${sourcePath}.rgb.jpg`, (err) => {
		if(err) {
			console.error(err)
			process.exit(1)
		}
	})

gm(sourcePath)
	.size((err, data) => {
		if(err) {
			console.error(err)
			process.exit(1)
			return
		}

		fs.writeFileSync(
			`${sourcePath}.svg`,
			Mustache.render(
				fs.readFileSync('template.svg').toString(),
				{
					width: String(data.width),
					height: String(data.height),
					image: sourcePath,
				}
			)	
		)
	})