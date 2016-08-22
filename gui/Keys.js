/**
* @Overview
*
* @Author: Daniel Goberitz
* @Date:               2016-08-20 16:53:52
* @Last Modified time: 2016-08-21 23:31:43
*/

'use strict';

const EventEmmiter = require('events');

module.exports = class Keys extends EventEmmiter{
	constructor() {
		super();
		this._keyPressed = [];
	}
	keyDown(key) {
		if(this._keyPressed.indexOf(key) === -1){
			this._keyPressed.push(key);
		}
	}
	keyUp(key) {
		if(this._keyPressed.indexOf(key) !== -1){
			this._keyPressed.splice(this._keyPressed.indexOf(key), 1);
		}
	}
	get(){
		return this._keyPressed.join('+');
	}
	setElement(elm) {
		elm = !!elm.jquery ? elm[0] : elm;
		elm.addEventListener('keydown', (e) => {
			this.keyDown(e.key);
		});
		elm.addEventListener('keyup', (e) => {
			this.emit('keyPress', e);
			this.keyUp(e.key);
		});
	}
};