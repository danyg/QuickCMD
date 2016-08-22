/**
* @Overview
*
* @Author: Daniel Goberitz
* @Date:               2016-08-22 03:41:18
* @Last Modified time: 2016-08-22 16:31:03
*/

'use strict';

require('modulesLoader');
const Result = include('service!Result');
const {shell} = require('electron');
const QuickCMDPlugin = include('service!QuickCMDPlugin');

class GoogleSearcher extends QuickCMDPlugin {

	find(str) {
		return new Promise((resolve) => {

			var results = [];
			if(this._getCommand(str) === 'G') {

				str = this._getArg(str);
				this._addResult(str, results);

			} else if(!this._isCommand(str)) {

				this._addResult(str, results, true);

			}
			resolve(results);

		});
	}

	_getResult(str, op) {
		return new Result(
			this.constructor.name,
			'googleSearch',
			str,
			`Search "[${str}]" on Google`,
			op
		);
	}

	_addResult(str, results, op) {
		str = str.trim();
		if(str.length > 0) {
			results.push(this._getResult(str, op));
		}
	}

	execute(data) {
		shell.openExternal(`https://www.google.com/search?q=${data.name}&oq=${data.name}`);
	}
}

module.exports = GoogleSearcher;
