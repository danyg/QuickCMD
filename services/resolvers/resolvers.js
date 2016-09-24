/**
* @Overview
*
* @Author: Daniel Goberitz
* @Date:               2016-08-22 02:44:40
* @Last Modified time: 2016-08-24 03:42:02
*/

'use strict';

const {ipcMain} = require('electron');

require('modulesLoader');

const ResolverStrategy = include('service!ResolverStrategy');

include.registerStrategy(ResolverStrategy);

var types = {};
var resolvers = include('resolvers!');
Object.keys(resolvers).forEach(function(type) {
	types[type] = new resolvers[type]();
});

/*
const types = {
	Mather: new Mather(),
	Indexer: new Indexer(),
	GoogleSearcher: new GoogleSearcher(),
	URLOpener: new URLOpener()
};

console.log(include('resolvers!'));
*/
function promiseAllAlways (promises) {
	var mP = [],
		okValues = [],
		errValues = [],
		thens = [],
		catchs = [],
		ret = {
			then: function(done, fail){
				thens.push(done);
				if(!!fail){
					catchs.push(fail);
				}
				return this;
			},
			catch: function(fail){
				catchs.push(fail);
				return this;
			}
		}
	;

	promises.forEach((promise) => {
		mP.push(new Promise((r) => {
			promise.then(
				val => {
					okValues.push(val);
					r();
				},
				err => {
					errValues.push(err);
					r();
				}
			);
		}));
	});
	Promise.all(mP)
		.then(() => {
			var val = okValues;
			var handler = (cbk) => {
				try {
					ret = cbk(val);
					val = ret !== undefined ? ret : val;
				} catch(e) {
					console.error(e);
				}
			};
			if(okValues.length > 0) {
				val = okValues;
				thens.forEach(handler);
			}

			if(errValues.length > 0){
				val = errValues;
				catchs.forEach(handler);
			}
		})
	;

	return ret;

}

ipcMain.on('search', (event, data) => {
	var promises = [];

	Object.keys(types).forEach((type) => {
		promises.push(
			types[type].find(data)
		);
	});

	promiseAllAlways(promises)
		.then(function(args) {
// console.log('\u001b[32mOK!\u001b[0m', args);
			var results = [];
			// var args = Array.prototype.slice.call(arguments,0);

			args.forEach((arg) => {
				if(arg.length > 0) {
					results = results.concat(arg);
				}
			});

			// indexed at the bottom
			results = results.sort((a,b) => {
				if(!!a.optional && !!b.optional) {
					return (100+(100 - b.optional)) - (100+(100 - a.optional));
				} else if(!!a.optional) {
					return (100+(100 - a.optional));
				}else if(!!b.optional) {
					return (100+(100 - a.optional)) * -1;
				}

				return a.type === 'Indexer' ? 50 :
					b.type === 'Indexer' ? -50 : 0
				;
			});
// console.log(JSON.stringify(results, true,'\t'));
			event.sender.send('searchResults', results);
		})
		.catch((err)=>{
console.log('\u001b[31mKABOOM!\u001b[0m', err);
		})
	;
});

ipcMain.on('execute', (event, data) => {
	if(!!types[data.type]) {
	console.log('execute', data);
		types[data.type].execute(data);
	}
});