/**
* @Overview
*
* @Author: Daniel Goberitz
* @Date:               2016-08-20 15:51:06
* @Last Modified time: 2016-08-22 17:19:59
*/

'use strict';

const MainInput = require('MainInput');
const MainList = require('MainList');
const Loading = require('Loading');

const mainInput = new MainInput();
const mainList = new MainList();
// const loading = new Loading();
 new Loading();

mainInput.setList(mainList);

/*
var $ = require('jquery');
console.log(test);

var keys = new Keys();
keys.setElement($('.main-input'));
$('.main-input')
	.focus()
	.bind('keydown', function(e) {
		console.log('DOWN', e.key)
		if(e.key === 'Tab') {
			return false;
		}
		keys.keyDown(e.key);
	})
	.bind('keyup', function(e) {
		console.log('UP', e.key, $(this).val())

		if(keyPressed.join('+') === ''

		if(keyPressed.indexOf(e.key) !== -1){
			keyPressed.splice(keyPressed.indexOf(e.key), 1);
		}
	})
;

class Keys {
	constructor() {
		this._keyPressed = [];
	}
	keyDown(key) {
		if(this._keyPressed.indexOf(e.key) === -1){
			this._keyPressed.push(e.key);
		}
	}
	keyUp(key) {
		if(this._keyPressed.indexOf(e.key) !== -1){
			this._keyPressed.splice(this._keyPressed.indexOf(e.key), 1);
		}
	}
	get(){
		return this._keyPressed.join('+');
	}
}

function keyDown(key) {
}
function getKeyPressed() {
	keyPressed.join('+');
}

var oo = $('#oo')[0]
setInterval(()=>{
	oo.innerHTML = keyPressed.join(' + ');
},10)
*/