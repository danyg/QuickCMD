/**
* @Overview
*
* @Author: Daniel Goberitz
* @Date:               2016-08-20 16:13:07
* @Last Modified time: 2016-08-22 18:07:39
*/

'use strict';
require('modulesLoader');
const Datastore = require('nedb'),
	fs = require('fs'),
	path = require('path'),
	utils = include('service!utils'),
	Result = include('service!Result'),
	QuickCMDPlugin = include('service!QuickCMDPlugin'),

	SCAN_INTERVAL = 300000 // 5min;
;

const {shell} = require('electron');

class Indexer extends QuickCMDPlugin {
	constructor() {
		super();

		this._DEBUG = true;

		this._scanDirectories();

		setInterval(
			this._scanDirectories.bind(this),
			this._getScanIntervalTime()
		);

		this._on('refreshCatalog', this._scanDirectories.bind(this));
	}

	find(str) {
		return new Promise((resolve, reject) => {
			if(str === '') {
				resolve([]);
				return;
			}

			if(this._isCommand(str) && this._getCommand(str) === 'D' && this._getArg(str).toLowerCase() === 'dump') {
				this._readDB.find({}, (err, docs) => {
					this._debug('Dumping DB', docs.length, 'records');
					fs.writeFileSync('./dump.log', JSON.stringify(docs,true,'\t'));
					this._debug('DB Dumped');
				});
				resolve([]);
				return;
			}

			var regex = this._searchToRegExp(str);

			this._readDB.find({
				name: regex
			}, (err, docs) => {
				if(err) {
					reject(err);
					return;
				}

				docs.map((item) => {
					item.result = item.name.replace(regex, regex._replacePattern);
					item.type = this.constructor.name;
					return new Result(item);
				});

				resolve(docs);
			});
		});
	}

	execute(data) {
		shell.openItem(data._id);
	}

	_newDB () {
		this._writeDB = new Datastore({
			inMemoryOnly: true,
			autoload: true
		});
		this._writeDB.ensureIndex({
			fieldName: 'name'
		});
	}

	_swapDB() {
		this._readDB = this._writeDB;
		this._writeDB = null;
	}

	_getScanIntervalTime() {
		// TODO to be replaced by user config
		return SCAN_INTERVAL;
	}

	_getDirectoriesToBeScanned() {
		// TODO to be replaced by user config
		var directories = [];
		directories.push(process.env.APPDATA + '\\Microsoft\\Windows\\Start Menu');
		directories.push(process.env.APPDATA + '\\Microsoft\\Internet Explorer\\Quick Launch');
		directories.push(process.env.ALLUSERSPROFILE + '\\Microsoft\\Windows\\Start Menu');

		return directories;
	}

	_getExtensionRegExpByDirectory(/*directory*/) {
		// TODO to be replaced by user config
		// TODO directory is the actual directory where the scanDirectory is passing trought
		// so that means that in the config we might have /d/dir whereas the given directory
		// will be /d/dir/inner/dir and even thought we need to return the data of /d/dir

		// the folowing code should be in the storer of the config

//		var config = [
//			'*.lnk',
//			'*.exe',
//			'*.bat',
//			'*.cmd',
//			'*.com'
//		];
//		var regexp = new RegExp(config.map((item) => {
//			return item
//				.replace(/\*/g, '.*')
//				.replace(/\./g, '\\.')
//				+ '$'
//			;
//		}).join('|'));

		var config = '\.*\.lnk$|\.*\.exe$|\.*\.bat$|\.*\.cmd$|\.*\.com';
		return new RegExp(config);
	}

	_scanDirectories() {
		return new Promise((resolve, reject) => {
			this._debug(`Start Scaning`);

			this._emit('scan-starting');

			this._newDB();

			var directories = this._getDirectoriesToBeScanned(),
				promises = []
			;

			directories.forEach((dirPath) => {
				var allowedExtensions = this._getExtensionRegExpByDirectory(dirPath);
				this._debug(`Scaning ${dirPath}`);
				promises.push(
					this._scanDirectory(dirPath, allowedExtensions)
				);
			});

			Promise.all(promises)
				.then(() => {
					this._compactDB();
					this._swapDB();
					resolve();
					this._emit('scan-done');
					this._debug(`Scaning Finished`);
				})
				.catch(reject)
			;
		});
	}

	_scanDirectory(dirPath, allowedExtensions) {
		return new Promise((resolve, reject) => {
			var promises = [];

			fs.readdir(dirPath, (err, files) => {
				if(err) {
					reject(err);
					return;
				}

				files.forEach((file) => {
					promises.push(
						this._processFile(dirPath, file, allowedExtensions)
					);
				});

				Promise.all(promises)
					.then(
						resolve,
						reject
					)
				;
			});
		});
	}

	_processFile(dirPath, file, allowedExtensions) {
		return new Promise((resolve, reject) => {
			var filePath = dirPath + '/' + file;

			fs.stat(filePath, (err, stats) => {
				if(err) {
					// do something
					reject(err);
					return;
				}

				if( stats.isDirectory() ) {
					this._scanDirectory(filePath, allowedExtensions)
						.then(
							resolve,
							reject
						)
					;
				} else if(stats.isFile()) {
					if(file.match(allowedExtensions) !== null) {
						this._addToIndex(filePath);
					}
					resolve();
				}
			});
		});
	}

	_addToIndex(filePath) {
		var name = path.basename(filePath).split('.');
		name.splice(-1);
		name = name.join('.');

		this._writeDB.insert({_id: path.resolve(filePath), name: name});
	}

	_compactDB() {
		this._writeDB.persistence.compactDatafile();
	}

	// _searchToRegExp(str) {
	// 	var regex = new RegExp('^(' + utils.regexpQuote(str) + '.*)', 'i');
	// 	regex._replacePattern = '$1';
	// 	return regex;
	// }
	_searchToRegExp(str) {
		var regexpStr = '^(.*)',
			replacePattern = '$1'
		;
		var g = 1;
		for(var i = 0; i < str.length; i++) {
			regexpStr += '(' + utils.regexpQuote(str.charAt(i)) + ')(.*)';
			replacePattern += '[$' + (g+1) + ']$' + (g+2);
			g+=2;
		}
		// regexpStr += '(.*)';
		// replacePattern += '$' + (g+1);

		var regex = new RegExp(regexpStr,'i');
		regex._replacePattern = replacePattern;
		return regex;
	}

}


module.exports = Indexer;