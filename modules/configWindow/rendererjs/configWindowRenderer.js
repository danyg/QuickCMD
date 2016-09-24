/**
* @Overview
*
* @Author: Daniel Goberitz
* @Date:               2016-08-24 18:31:24
* @Last Modified time: 2016-09-02 19:36:52
*/

'use strict';
/*
const path = require('path');

var jsonFormPath = require.resolve('json-form');
var jsonFormDepsPath = path.resolve(path.dirname(jsonFormPath) + '/../deps');

window.gui.insertScriptTag(path.resolve(jsonFormDepsPath + '/jquery.min.js'));
// window.gui.insertLinkTag(jsonFormDepsPath + '/opt/bootstrap.css');
window.gui.insertScriptTag(jsonFormDepsPath + '/opt/bootstrap-dropdown.js');
window.gui.insertScriptTag(jsonFormDepsPath + '/underscore.js');
window.gui.insertScriptTag(jsonFormPath);

*/
if(!!window.onloaded){
	setTimeout(window.onloaded, 1000)
	// window.onloaded();
}
/*
window.$ = $;
if(!window.onReady) {
	window.onReady = function(){};
}

$(document).ready(() => {
	window.onReady();
});

*/