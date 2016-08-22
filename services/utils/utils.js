/**
* @Overview
*
* @Author: Daniel Goberitz
* @Date:               2016-08-19 23:07:48
* @Last Modified time: 2016-08-22 14:38:01
*/

'use strict';

module.exports = {
	camelize: function(str) {
		// console.log('CAMELIZE: ' + str)
		str = str
			.replace(/[\s-_]/g, ' ')
			.replace(/[\s\s]/g, ' ')
			.trim()
		;
		var tmp = str.toLowerCase().split(' ');
		var res = '';
		tmp.forEach((item, ix) => {
			if(ix === 0) {
				res += item;
			} else {
				res += item.charAt(0).toUpperCase() + item.substring(1);
			}
		});

		// console.log('CAMELIZE: ' + res)
		return res;
	},

	dfd: function(executor) {
		var dfd = {
			_promise: null,
			reject: function() {},
			resolve: function() {},
			promise: function() {
				return this._promise;
			}
		};
		if(!executor) {
			executor = ()=>{};
		}
		dfd._promise = new Promise((resolve, reject) => {
			dfd.resolve = resolve;
			dfd.reject = reject;
			executor(resolve, reject, dfd);
		});
		return dfd;
	},

	regexpQuote: function(str) {
		return (str+'').replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
	}
};
