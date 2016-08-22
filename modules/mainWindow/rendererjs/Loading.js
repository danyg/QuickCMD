/**
* @Overview
*
* @Author: Daniel Goberitz
* @Date:               2016-08-22 17:11:54
* @Last Modified time: 2016-08-22 17:36:52
*/

'use strict';

const {ipcRenderer} = require('electron'),
	$ = require('jquery')
;

class Loading {
	constructor() {
		this._$element = $('.loading');
		this.hide();

		ipcRenderer.on('Indexer:scan-starting', () => { console.log('scan start'); this.show(); });
		ipcRenderer.on('Indexer:scan-done', () => { console.log('scan stop'); this.hide(); });

		ipcRenderer.on('ping', function() {
			console.log('PING!');
		});
	}

	hide() {
		this._$element.hide();
	}
	show() {
		this._$element.show();
	}
}

module.exports = Loading;
