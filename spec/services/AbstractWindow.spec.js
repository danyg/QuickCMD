/**
* @Overview
*
* @Author: Daniel Goberitz
* @Date:               2016-08-20 00:51:26
* @Last Modified time: 2016-08-21 19:15:42
*/

'use strict';

const path = require('path');

describe('AbstractWindow Specs', function() {
	var AbstractWindow,
		BrowserWindow,
		sinon = require('sinon'),
		eventListeners = {
			_onPageTitleUpdated:'page-title-updated',
			_onClose:'close',
			_onClosed:'closed',
			_onUnresponsive:'unresponsive',
			_onResponsive:'responsive',
			_onBlur:'blur',
			_onFocus:'focus',
			_onShow:'show',
			_onHide:'hide',
			_onReadyToShow:'ready-to-show',
			_onMaximize:'maximize',
			_onUnmaximize:'unmaximize',
			_onMinimize:'minimize',
			_onRestore:'restore',
			_onResize:'resize',
			_onMove:'move',
			_onEnterFullScreen:'enter-full-screen',
			_onLeaveFullScreen:'leave-full-screen',
			_onEnterHtmlFullScreen:'enter-html-full-screen',
			_onLeaveHtmlFullScreen:'leave-html-full-screen'
		},
		Testee,
		FullEventsTestee,
		SingleEventTestee
	;

	beforeEach(() => {
		AbstractWindow = include('service!AbstractWindow');

		Testee = class Testee extends AbstractWindow {
			constructor() {
				super();
				this.spies = {};
				Object.keys(eventListeners).forEach((methodName) => {
					this.spies[methodName] = sinon.stub();
				});
			}
		}
		FullEventsTestee = class FullEventsTestee extends Testee {
			constructor() {
				super();
			}
		}
		Object.keys(eventListeners).forEach(function(methodName) {
			FullEventsTestee.prototype[methodName] = function() {
				this.spies[methodName].apply(this, arguments);
			};
		});
		SingleEventTestee = class SingleEventTestee extends Testee {
			constructor() {
				super();
			}
			_onClosed() {
				this.spies['_onClosed'].apply(this, arguments);
			}
		};

		sinon.stub(include, 'resolve').returns('modules/testee/templates/testee');

		BrowserWindow = require('electron').BrowserWindow;
		BrowserWindow.___spy.reset();
	});

	afterEach(() => {
		include.resolve.restore();
	});


	it('should create a new BrowserWindow using the proper template and send the context information', () => {
		expect(BrowserWindow.___spy.called).toBe(false);

		var testee = new Testee();

		// uses BrowserWindow
		expect(BrowserWindow.___spy.called).toBe(true);

		// resolves the template
		var templatePath = include.getBasePath() + '/modules/testee/templates/testee.html';
		expect(testee._win.loadURL.called).toBe(true, 'loadURL has not been called');

		var context = {
			moduleName: 'testee',
			modulePath: path.resolve(include.getBasePath() + '/modules/testee'),
			templatePath: templatePath,
			basePath: include.getBasePath()
		};

		expect(testee._win.loadURL.getCall(0).args[0]).toBe('file://' + templatePath + '?' + JSON.stringify(context));

	});

	it('should prevent to create more than one BrowserWindow', () => {
		expect(BrowserWindow.___spy.called).toBe(false);

		var testee = new Testee();

		testee._init();

		// uses BrowserWindow
		expect(BrowserWindow.___spy.calledOnce).toBe(true, 'BrowserWindow has not been called Once');

		// resolves the template
		expect(testee._win.loadURL.calledOnce).toBe(true, 'loadURL has not been called Once');

	});

	it('should bind the declared eventListeners', () => {
		expect(BrowserWindow.___spy.called).toBe(false);
		var testee = new SingleEventTestee();

		expect(testee.spies._onClosed.called).toBe(false);
		testee._win.emit('closed');
		expect(testee.spies._onClosed.called).toBe(true, 'automatic eventListener _onClosed wasn\'t called');

		expect(testee.spies._onPageTitleUpdated.called).toBe(false);
		testee._win.emit('page-title-updated');
		expect(testee.spies._onPageTitleUpdated.called).toBe(false);
	});

	it('should bind the declared eventListeners all of them', () => {
		expect(BrowserWindow.___spy.called).toBe(false);
		var testee = new FullEventsTestee();
		var exepectations = 0;

		var eventMethodNames = Object.keys(eventListeners)

		eventMethodNames.forEach((methodName) => {
			var eventName = eventListeners[methodName]

			expect(testee.spies[methodName].called).toBe(false);
			testee._win.emit(eventName);
			expect(testee.spies[methodName].called).toBe(true, `automatic eventListener ${methodName} wasn\'t called for event ${eventName}`);

			exepectations++
		});

		expect(exepectations).toBeGreaterThan(0);
		expect(exepectations).toBe(eventMethodNames.length);

	});

	it('should give the availability to bind custom/os-dependent events', () => {
		var testee = new Testee();
		testee._onScrollTouchBegin = sinon.stub();
		testee._bindEvent('scroll-touch-begin');

		expect(testee._onScrollTouchBegin.called).toBe(false);
		testee._win.emit('scroll-touch-begin');
		expect(testee._onScrollTouchBegin.called).toBe(true);

	});


});