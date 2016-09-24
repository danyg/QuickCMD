/**
* @Overview
*
* @Author: Daniel Goberitz
* @Date:               2016-08-24 03:15:07
* @Last Modified time: 2016-08-24 03:40:01
*/

'use strict';
const fs = require('fs'),
	path = require('path')
;
const {AbstractStrategy} = require('modulesLoader');

class Resolver extends AbstractStrategy {
	constructor(handlerOps) {
		super(handlerOps);
		this._baseDir = 'resolvers';
	}

	resolve(kind, moduleName) {
		if(kind === 'resolvers') {
			return this._baseDir + '/';
		}
		return this._baseDir + '/' + moduleName + 'Resolver.js';
	}

	getHandlers() {
		return ['resolver', 'resolvers'];
	}

	load(absolutePath, kind) {
		if(kind === 'resolvers') {
			var files = fs.readdirSync(absolutePath);
			var hash = {};

			files.forEach((file) => {
				var filePath = path.resolve(absolutePath + '/' + file);

				if(file.match(/Resolver.js/) !== null) {
					if(fs.statSync(filePath).isFile()){
						var m = require(filePath);
						if(!m) {
							console.warn(`Error loading Resolver ${filePath} nothing is defined there!`);
						} else if(!m.name) {
							console.warn(`Error loading Resolver ${filePath} doesn't seem to be a constructor`);
						} else {
							hash[m.name] = m;
						}
					}
				}
			});

			return hash;
		} else {
			super.load(path);
		}
	}
}

include.registerStrategy(Resolver);

module.exports = Resolver;
