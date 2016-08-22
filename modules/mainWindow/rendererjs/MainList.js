/**
* @Overview
*
* @Author: Daniel Goberitz
* @Date:               2016-08-21 23:40:37
* @Last Modified time: 2016-08-22 17:58:43
*/

'use strict';

const $ = require('jquery'),
	{ipcRenderer, remote} = require('electron'),
	currentWindow = remote.getCurrentWindow(),
	PAGE_SIZE = 4
;

class MainList {
	constructor() {
		this._$element = $('#list');
		ipcRenderer.on('searchResults', (e,docs)=>{
			this._onResults(docs);
		});
		this._docs = [];
		this._items = [];
		this.hide();
		this.setBaseHeight(42);

		// setTimeout(()=>{

		// 	this._onResults([
		// 		{_id: 1, name: 'window'},
		// 		{_id: 2, name: 'window 2'},
		// 		{_id: 3, name: 'window 3'},
		// 		{_id: 4, name: 'window 4'},
		// 	]);
		// }, 5000)
	}

	hide() {
		this._$element.hide();
		$('.list-container').hide();
	}

	show() {
		$('.list-container').show();
		this._$element.show();
	}
	setBaseHeight(h){
		this._baseHeight = h;
	}
	addElement(elm) {
		var $li = $('<li>');
		elm.result = elm.result
			.replace(/\[/g, '<strong>')
			.replace(/\]/g, '</strong>')
		;

		$li
			.html(elm.result)
		;
		$li.appendTo(this._$element);
		var ix = this._items.push($li) - 1;
		this._docs.push(elm);


		$li.hover(
			this._uiselect.bind(this, ix)
		);

		return $li;
	}

	_onResults(docs) {
		this._ix = 0;
		this._items.splice(0);
		this._docs.splice(0);
		$('li', this._$element).remove();

		if(docs.length > 0) {
			docs.forEach((item) => {
				this.addElement(item);
			});

			this._select();

			this.show();
			var winSize = currentWindow.getSize();
			winSize[1] = this._baseHeight + this._items[0].height();
			for(var i = 1; i < PAGE_SIZE; i++) {
				if(!!this._items[i]) {
					winSize[1] += this._items[i].height();
				} else {
					break;
				}
			}

			currentWindow.setSize(winSize[0], winSize[1],true);
		}
	}

	_uiselect(ix) {
		$('li', this._$element).removeClass('is-selected');
		this._select(ix);
	}

	_unselect(ix) {
		if(ix !== undefined) {
			this._ix = ix;
		}
		this._items[this._ix].removeClass('is-selected');
		// if(ix) {
		// 	this._ix = -1;
		// }
	}
	_select(ix) {
		if(ix !== undefined) {
			this._ix = ix;
		}
		this._items[this._ix].addClass('is-selected');

		const viewPortZero = this._$element[0].scrollTop,
			viewPortBottom = this._$element.outerHeight() + this._$element[0].scrollTop,
			elementZero = this._items[this._ix][0].offsetTop,
			elementBottom = this._items[this._ix][0].offsetTop + this._items[this._ix].outerHeight()
		;
		if(!(viewPortZero <= elementZero && elementBottom <= viewPortBottom)) {
			// element offscreen
			if(viewPortZero > elementZero) {
				// element above the view zone
				this._$element[0].scrollTop = elementZero;
			} else if (elementBottom > viewPortBottom) {
				// element below the view zone
				this._$element[0].scrollTop = elementBottom - this._$element.outerHeight();
			}
		}

	}

	prev() {
		if(this._ix !== 0) {
			this._unselect();
			this._ix--;
			this._select();
		}
	}
	next() {
		if((this._ix+1) < this._items.length) {
			this._unselect();
			this._ix++;
			this._select();
		}
	}
	getElement() {
		return this._docs[this._ix];
	}


	goToHome () {
		this._unselect();
		this._ix = 0;
		this._select();
	}
	goToEnd () {
		this._unselect();
		this._ix = this._docs.length-1;
		this._select();
	}
	pageUp () {
		this._unselect();
		var ix = this._ix - PAGE_SIZE;
		if(ix < 0) {
			ix = 0;
		}
		this._ix = ix;
		this._select();
	}
	pageDown () {
		this._unselect();
		var ix = this._ix + PAGE_SIZE;
		if(ix >= this._docs.length) {
			ix = this._docs.length-1;
		}
		this._ix = ix;
		this._select();
	}
}

module.exports = MainList;