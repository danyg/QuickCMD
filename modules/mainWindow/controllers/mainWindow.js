/**
* @Overview
*
* @Author: Daniel Goberitz
* @Date:               2016-08-19 22:42:02
* @Last Modified time: 2016-08-22 17:37:25
*/
'use strict';

require('modulesLoader');

const AbstractWindow = include('service!AbstractWindow');
const {app, globalShortcut, ipcMain, clipboard, shell} = require('electron');

include('service!searcherResponsers');

class MainWindow extends AbstractWindow{
	_init() {
		// this._indexer = new Indexer();
		// prevent to create the window on creation
		// mainWindow should wait for app to be ready
	}
	create() {
		this._winOpts = {
			width: 400,
			height: 30,
			frame: false,
			transparent: true
		};
		super._init();

		this._win.on('focus', () => {
			this._win.webContents.send('focus');
		});

		this._win.on('blur', () => {
			this._win.webContents.send('blur');
		});

		// ipcMain.on('execute', (event, data) => {
		// 	console.log('execute', data);
		// 	if(data.type === 'math') {
		// 		clipboard.writeText(data.result);
		// 	} else {
		// 		shell.openItem(data._id);
		// 	}
		// });
	}

	show() {
		this._win.show();
	}

	hide() {
		this._win.hide();
	}
}
var mainWindow = new MainWindow();

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	mainWindow.create();
	mainWindow.show();
});

app.on('ready', () => {
	mainWindow.create();
	// mainWindow.show();

	const ret = globalShortcut.register('Super+Alt+Space', () => {
		mainWindow.show();
	});

	console.log('SuperAltSpace', ret);
});

module.exports = mainWindow;
