/**
* @Overview
*
* @Author: Daniel Goberitz
* @Date:               2016-08-22 13:57:23
* @Last Modified time: 2016-08-22 17:40:40
*/

'use strict';

const COMMAND_TOKEN = ' \u25b6 ';

class QuickCMDPlugin {
	constructor() {
		if(this.constructor.name === 'QuickCMDPlugin') {
			throw new TypeError('QuickCMDPlugin is an Abstract Class and cannot be instantiated!');
		}
	}

	_isCommand(str) {
		str = typeof(str) === 'string' ? str : '';
		return str.indexOf(COMMAND_TOKEN) !== -1;
	}

	_getCommand(str) {
		str = typeof(str) === 'string' ? str : '';
		return this._getCommands(str)[0].toUpperCase();
	}

	_getArg(str) {
		str = typeof(str) === 'string' ? str : '';
		return this._getCommands(str)[1];
	}

	_getArgs(str) {
		str = typeof(str) === 'string' ? str : '';
		var t = this._getCommands(str);
		t.shift();
		return t;
	}

	_getCommands(str) {
		str = typeof(str) === 'string' ? str : '';
		return str.split(COMMAND_TOKEN);
	}

	_send() {
		return this._emit.apply(this, arguments);
	}

	_emit(eventName, data) {
		return new Promise((resolve, reject) => {
			try {
				var {webContents} = require('electron');

				var receivers = webContents.getAllWebContents();

				receivers.forEach((receiver) => {
					receiver.send (
						this.constructor.name + ':' + eventName,
						data || ''
					);
				});

				resolve();
			} catch(e) {
				console.error('ERROR: ' + this.constructor.name + '._emit \n\t', e);
				reject(e);
			}
		});
	}

	_on(eventName, cbk) {
		var {ipcMain} = require('electron');
		return ipcMain.on(eventName, cbk);
	}

	_debug() {
		if(!!this._DEBUG) {
			var args = Array.prototype.slice.call(arguments, 0);
			args.unshift(`\u001b[35m${this.constructor.name}:`);
			args.push('\u001b[0m');
			return console.log.apply(console, args);
		}
	}

	find(str) {
		str = typeof(str) === 'string' ? str : '';

		return new Promise((/*resolve, reject*/) => {
			throw new Error(`${this.constructor.name}.find is not implemented. Serching for ${str}`);
		});
	}

	execute(data) {
		throw new Error(`${this.constructor.name}.execute is not implemented. Executing ${data._id}`);
	}
}

QuickCMDPlugin.COMMAND_TOKEN = COMMAND_TOKEN;

module.exports = QuickCMDPlugin;
