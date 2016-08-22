/**
* @Overview
*
* @Author: Daniel Goberitz
* @Date:               2016-08-20 10:02:00
* @Last Modified time: 2016-08-21 18:28:28
*/

'use strict';

var electron,
	mainWindow,
	sinon = require('sinon')
;

describe('MainWindow Specs', function() {
	beforeEach(function() {
		mainWindow = include('module!mainWindow');
		electron = require('electron');

		sinon.spy(mainWindow, 'create');
		sinon.spy(mainWindow, 'show');
		sinon.spy(mainWindow, 'hide');

		electron.app.___resetAll();
		if(!!mainWindow._win) {
			mainWindow._win.___resetAll();
		}
	});

	afterEach(function() {
		mainWindow.create.restore();
		mainWindow.show.restore();
		mainWindow.hide.restore();
	});

	describe('Basic app event listening', function() {

		it('should follow the `window-all-closed` event', function() {
			expect(electron.app.quit.called).toBe(false);

			electron.app.emit('window-all-closed');

			expect(electron.app.quit.called).toBe(true);
		});

		it('should follow the `activate` event', function() {
			expect(mainWindow.create.called).toBe(false);
			expect(mainWindow.show.called).toBe(false);

			electron.app.emit('activate');

			expect(mainWindow.create.called).toBe(true);
			expect(mainWindow.show.called).toBe(true);
		});

		it('should follow the `ready` event', function() {
			expect(mainWindow.create.called).toBe(false);
			expect(mainWindow.show.called).toBe(false);

			electron.app.emit('ready');

			expect(mainWindow.create.called).toBe(true);
			expect(mainWindow.show.called).toBe(true);
		});
	});

	it('show should show the window', function() {
		expect(mainWindow._win.show.called).toBe(false);

		mainWindow.show();

		expect(mainWindow._win.show.called).toBe(true);
	});

	it('hide should hide the window', function() {
		expect(mainWindow._win.hide.called).toBe(false);

		mainWindow.hide();

		expect(mainWindow._win.hide.called).toBe(true);
	});

	it('should register the global hotkey for activation', function() {
		IMPLEMENT_ME();
	});

	it('should hide the mainWindow once it is rendered', function() {
		IMPLEMENT_ME();
	});
});