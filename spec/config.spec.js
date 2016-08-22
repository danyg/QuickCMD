/**
* @Overview
*
* @Author: Daniel Goberitz
* @Date:               2016-08-20 00:38:13
* @Last Modified time: 2016-08-21 19:57:34
*/

'use strict';

var sinon = require('sinon');
var events = require('events');
var util = require('util');

var FAIL_ON_IMPLEMENT_ME = false;

var mock = require('mock-require');
var electron = {
	BrowserWindow: getBrowserWindowStub(),
	app: getAppStub(),

	___resetAll: () => {
		Object.keys(this).forEach((item) => {
			if(!!this[item].___resetAll) {
				this[item].___resetAll();
			}
		});
	}
};
mock('electron', electron);

beforeEach(() => {
	require('modulesLoader');
	const path = require('path');
	include.setBasePath(path.resolve(__dirname + '/..'))
	electron.___resetAll();

	global.IMPLEMENT_ME = function() {
		if(FAIL_ON_IMPLEMENT_ME) {
			expect(false).toBe(true, 'IMPLEMENT ME!');
		}
	};
});

afterEach(() => {
});

function getBrowserWindowStub() {
	var WebContents = stubClass(
		'WebContents',
		['getAllWebContents', 'getFocusedWebContents', 'loadURL','downloadURL','getURL','getTitle','isDestroyed','isFocused','isLoading','isLoadingMainFrame','isWaitingForResponse','stop','reload','reloadIgnoringCache','canGoBack','canGoForward','canGoToOffset','clearHistory','goBack','goForward','goToIndex','goToOffset','isCrashed','setUserAgent','getUserAgent','insertCSS','executeJavaScript','setAudioMuted','isAudioMuted','setZoomFactor','getZoomFactor','setZoomLevel','getZoomLevel','setZoomLevelLimits','undo','redo','cut','copy','paste','pasteAndMatchStyle','delete','selectAll','unselect','replace','replaceMisspelling','insertText','findInPage','stopFindInPage','capturePage','hasServiceWorker','unregisterServiceWorker','print','printToPDF','addWorkSpace','removeWorkSpace','openDevTools','closeDevTools','isDevToolsOpened','isDevToolsFocused','toggleDevTools','inspectElement','inspectServiceWorker','send','enableDeviceEmulation','disableDeviceEmulation','sendInputEvent','beginFrameSubscription','endFrameSubscription','startDrag','savePage','showDefinitionForSelection','isOffscreen','startPainting','stopPainting','isPainting','setFrameRate','getFrameRate'],
		[],
		function() {
			this.id = 'mock_id',
			this.session = {};
		}
	);
	mixEventEmmiter(WebContents);

	var BrowserWindow = stubClass(
		'BrowserWindow',
		['destroy','close','focus','blur','isFocused','isDestroyed','show','showInactive','hide','isVisible','isModal','maximize','unmaximize','isMaximized','minimize','restore','isMinimized','setFullScreen','isFullScreen','setAspectRatio','setBounds','getBounds','setContentBounds','getContentBounds','setSize','getSize','setContentSize','getContentSize','setMinimumSize','getMinimumSize','setMaximumSize','getMaximumSize','setResizable','isResizable','setMovable','isMovable','setMinimizable','isMinimizable','setMaximizable','isMaximizable','setFullScreenable','isFullScreenable','setClosable','isClosable','setAlwaysOnTop','isAlwaysOnTop','center','setPosition','getPosition','setTitle','getTitle','setSheetOffset','flashFrame','setSkipTaskbar','setKiosk','isKiosk','getNativeWindowHandle','hookWindowMessage','isWindowMessageHooked','unhookWindowMessage','unhookAllWindowMessages','setRepresentedFilename','getRepresentedFilename','setDocumentEdited','isDocumentEdited','focusOnWebView','blurWebView','capturePage','loadURL','reload','setMenu','setProgressBar','setOverlayIcon','setHasShadow','hasShadow','setThumbarButtons','setThumbnailClip','setThumbnailToolTip','showDefinitionForSelection','setIcon','setAutoHideMenuBar','isMenuBarAutoHide','setMenuBarVisibility','isMenuBarVisible','setVisibleOnAllWorkspaces','isVisibleOnAllWorkspaces','setIgnoreMouseEvents','setContentProtection','setFocusable','setParentWindow','getParentWindow','getChildWindows'],
		["getAllWindows','getFocusedWindow','fromWebContents','fromId','addDevToolsExtension','removeDevToolsExtension','getDevToolsExtensions"],
		function() {
			this.webContents = new WebContents();
			this.webContents.hostWebContents = new WebContents();
			this.webContents.devToolsWebContents = new WebContents();
			this.webContents.debugger = new WebContents();
			this.id = 'mock_id';
		}
	);
	mixEventEmmiter(BrowserWindow);

	return BrowserWindow;
}
function getAppStub() {
	var CommandLine = stubClass(
		'CommandLine',
		['appendSwitch','appendArgument'],
		[]
	);
	var Dock = stubClass(
		'Dock',
		['bounce','cancelBounce','downloadFinished','setBadge','getBadge','hide','show','isVisible','setMenu','setIcon'],
		[]
	);
	var App = stubClass(
		'BrowserWindow',
		['quit','exit','relaunch','focus','hide','show','getAppPath','getPath','setPath','getVersion','getName','setName','getLocale','addRecentDocument','clearRecentDocuments','setAsDefaultProtocolClient','removeAsDefaultProtocolClient','isDefaultProtocolClient','setUserTasks','makeSingleInstance','releaseSingleInstance','setUserActivity','getCurrentActivityType','setAppUserModelId','importCertificate','disableHardwareAcceleration','setBadgeCount','getBadgeCount','isUnityRunning','getLoginItemSettings','setLoginItemSettings','isAccessibilitySupportEnabled'],
		[],
		function() {
			this.commandLine = new CommandLine();
			this.dock = new Dock();

			var r = this.___resetAll;
			this.___resetAll = () => {
				r.apply(this, arguments);
				this.commandLine.___resetAll();
				this.dock.___resetAll();
			}
		}
	);
	mixEventEmmiter(App);

	return new App();
}

function mixEventEmmiter(ctor) {
	var originalInit = ctor.___init;
	ctor.___init = function() {
		originalInit.apply(this, arguments);
		events.EventEmitter.apply(this, arguments);
		Object.keys(events.EventEmitter.prototype).forEach((methodName) => {
			if(typeof this[methodName] === 'function') {
				sinon.spy(this, methodName);
			}
		});
	};
	util.inherits(ctor, events.EventEmitter);
}

function getCtor(ctorName, util, afterInit) {
	var f = new Function(`return function ${ctorName}() {
		${ctorName}.___init.apply(this, arguments);
	}`);
	var ctor = f();
	ctor.___init = function(){
		util.init.apply(this,arguments);
		if(!!afterInit) {
			afterInit.apply(this, arguments);
		}
	};
	ctor.___spy = util.init;
	return ctor;
}

function stubConstructor(ctor, afterInit) {
	var staticMethods = Object.keys(ctor).filter((prop) => {
		return typeof ctor[prop] === 'function';
	});

	return stubClass(
		ctor.name,
		Object.keys(ctor.prototype),
		staticMethods,
		afterInit
	);

	return stubCtor;
}

function stubClass(ctorName, methods, staticMethods, afterInit) {
	var stubs = [];
	var util = {
		init: function(){
			this.___stubs = [];
			methods.forEach((methodName) => {
				this[methodName] = sinon.stub();
				this.___stubs.push(this[methodName]);
			});
			this.___resetAll = () => {
				this.___stubs.forEach((item) => {
					item.reset();
				});
			};
		}
	};
	sinon.spy(util, 'init');
	stubs.push(util.init);

	var stubCtor = getCtor(ctorName, util, afterInit);

	staticMethods.forEach((prop) => {
		stubCtor[prop] = sinon.stub();
		stubs.push(stubCtor[prop]);
	});

	stubCtor.___resetAll = function() {
		stubs.forEach((stub) => {
			stub.reset();
		});
	};

	return stubCtor;
}
