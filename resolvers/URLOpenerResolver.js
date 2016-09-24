/**
* @Overview
*
* @Author: Daniel Goberitz
* @Date:               2016-08-22 03:41:18
* @Last Modified time: 2016-08-22 16:29:29
*/

'use strict';

require('modulesLoader');
const QuickCMDPlugin = include('service!QuickCMDPlugin');
const {shell} = require('electron');
const Result = include('service!Result');

class URLOpener extends QuickCMDPlugin {

	find(str) {
		return new Promise((resolve) => {
			this._id = 0;
			var results = [];

			if(this._getCommand(str) === 'U') {
				str = this._getArg(str);

				this._addResults(str, results);
			} else if(!this._isCommand(str) && this._isValidUrl(str)) {

				this._addResults(str, results, true);

			}
			resolve(results);
		});
	}

	_addResults(str, results, op) {
		str = str.trim();
		if(this._isValidUrl(str)){
			results.push(this.getResult(str,op));

			if(!this.isCompleteUrl(str)) {
				results.push(this.getResult('www.' + str + '.com', op));
			}
		}
	}

	_isValidUrl(str) {
		return str.match(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.?[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/) !== null;
	}

	isCompleteUrl(str) {
		return str.match(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/) !== null;
	}

	getResult(str, op) {
		this._id++;
		return new Result(
			this.constructor.name,
			'urlOpen_' + this._id,
			str,
			'Go To "http://[' + str + ']"',
			op === true ? 99 : false
		);
	}

	execute(data) {
		shell.openExternal(`http://${data.name}`);
	}

}

module.exports = URLOpener;
