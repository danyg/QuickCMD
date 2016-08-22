/**
* @Overview
*
* @Author: Daniel Goberitz
* @Date:               2016-08-19 22:36:23
* @Last Modified time: 2016-08-20 16:40:37
*/

'use strict';
require('modulesLoader');
const utils = include('service!utils');

const electron = require('electron');
const app = electron.app;
const path = require('path');

class AbstractWindow {
	constructor() {
		this._init();
	}

	_init() {
		if(!this._win) {
			var opts = Object.assign(
				{},
				{
					width: 640,
					height: 480,
					show: false
				},
				this._winOpts
			);

			this._win = new electron.BrowserWindow(opts);

			const mName = this.constructor.name.charAt(0).toLowerCase() + this.constructor.name.substring(1);
			this.templatePath = include.getBasePath() + '/' + include.resolve('template!' + mName,1) + '.html';
			this.modulePath = path.resolve(path.dirname(this.templatePath) + '/..');
			var context = JSON.stringify({
				moduleName: mName,
				modulePath: this.modulePath,
				templatePath: this.templatePath,
				basePath: include.getBasePath()
			});
			this._win.loadURL(`file://${this.templatePath}?${context}`);
			this._bindEvents();
		}
	}

	_bindEvents() {
		var events = ['page-title-updated','close','closed','unresponsive','responsive','blur','focus','show','hide','ready-to-show','maximize','unmaximize','minimize','restore','resize','move','enter-full-screen','leave-full-screen','enter-html-full-screen','leave-html-full-screen'];
		events.forEach(this._bindEvent.bind(this));
	}

	_bindEvent(eventName) {
		var methodName = '_' + utils.camelize('on ' + eventName);
		if(typeof this[methodName] === 'function') {
			this._win.on(eventName, this[methodName].bind(this));
		}
	}

}

module.exports = AbstractWindow;
