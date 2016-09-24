/**
* @Overview
*
* @Author: Daniel Goberitz
* @Date:               2016-08-24 17:48:34
* @Last Modified time: 2016-08-24 18:13:27
*/

'use strict';

require('modulesLoader');

const AbstractWindow = include('service!AbstractWindow');
// const {app, globalShortcut, ipcMain, clipboard, shell} = require('electron');

include('service!resolvers');

class ConfigWindow extends AbstractWindow {
}

module.exports = ConfigWindow;
