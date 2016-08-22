/**
* @Overview
*
* @Author: Daniel Goberitz
* @Date:               2016-08-21 22:27:07
* @Last Modified time: 2016-08-22 17:58:48
*/

'use strict';

require('modulesLoader');

const Keys = require('Keys'),
	$ = require('jquery'),
	{ipcRenderer, remote} = require('electron'),
	currentWindow = remote.getCurrentWindow(),
	MIN_HEIGHT = 32,
	QuickCMDPlugin = include('service!QuickCMDPlugin')
;

class MainInput {
	constructor() {
		this._$element = $('.main-input');
		this._keys = new Keys();
		this._keys.setElement(this._$element);
		this._$element.bind('keydown', this._onKeyDown.bind(this));
		this._keys.on('keyPress', this._onKeyPress.bind(this));
		this._lastSearch = '';

		ipcRenderer.on('blur', () => {
			this.hide();
		});

		ipcRenderer.on('focus', () => {
			this._onWinFocus();
		});

		ipcRenderer.on('Indexer:scan-done', () => {
			this._lastSearch = '';
			this._search();
		});

		this._$element.focus();
	}

	_onWinFocus() {
		this._$element[0].setSelectionRange(0, this._$element.val().length);
		this._$element.focus();
		currentWindow.setAlwaysOnTop(false);
		currentWindow.setAlwaysOnTop(true);
	}

	setList(list) {
		this._list = list;
	}

	hide() {
		currentWindow.hide();
	}

	clean() {
		this._$element.val('');
		this._list.hide();
		var winSize = currentWindow.getSize();
		// var h = parseInt( this._$element.parent().outerHeight() );
		var h = parseInt( $('.row.main').outerHeight() );
		h = h < MIN_HEIGHT ? MIN_HEIGHT : h;
		currentWindow.setSize(winSize[0], h);
		this._list.setBaseHeight(h);
	}

	_onKeyDown(e) {
		switch(e.key) {
			case 'ArrowUp':
				this._list.prev();
				return false;
			break;
			case 'ArrowDown':
				this._list.next();
				return false;
			break;
			case 'PageDown':
				this._list.pageDown();
			break;
			case 'PageUp':
				this._list.pageUp();
			break;
			case 'Tab':
				return false;
		}
	}

	_onKeyPress() {
		switch(this._keys.get()) {
			case 'Escape':
				this.hide();
			break;
			case 'Control+Backspace':
				this.clean();
			break;
			case 'Tab':
				this._$element.val(this._$element.val() + QuickCMDPlugin.COMMAND_TOKEN);
			break;
			case 'Enter':
				var elm = this._list.getElement();
				ipcRenderer.send('execute', elm);
				currentWindow.hide();
			break;
			case 'ArrowUp':
			case 'ArrowDown':
			case 'PageDown':
			case 'PageUp':
			case 'Tab':
				//noop
			break;
			case 'F5':
				ipcRenderer.send('refreshCatalog');
			break;
			case 'Home':
				this._list.goToHome();
			break;
			case 'End':
				this._list.goToEnd();
			break;
			default:
				this._search();
		}

		if(this._$element.val() === '') {
			this.clean();
		}

	}

	_search() {
		var query = this._$element.val().trim('');
		if(this._lastSearch !== query) {
			if(query !== '') {
				ipcRenderer.send('search', query);
				this._lastSearch = query;
			}
		}
	}
}

module.exports = MainInput;
