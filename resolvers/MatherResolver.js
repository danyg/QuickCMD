/**
* @Overview
*
* @Author: Daniel Goberitz
* @Date:               2016-08-22 02:46:14
* @Last Modified time: 2016-09-10 19:53:19
*/
/*jshint evil: true */
'use strict';

require('modulesLoader');
const Result = include('service!Result');
const {clipboard} = require('electron');
const QuickCMDPlugin = include('service!QuickCMDPlugin');


class Mather extends QuickCMDPlugin {
	find(data) {
		return new Promise((resolve) => {
			var result = [];
			if(data.match(/^[\.\d\+\-\*\/\(\)\^&|epi]*$/)) {
				try {
					(function(){
						var r,
							e = Math.E,
							pi = Math.PI
						;
						r = `jshint sharup ${e} ${pi}`;
						var toEval = data.toLowerCase();

						eval(`r = ${toEval};`);
						if(!isNaN(r)) {
							result.push(new Result(
								'Mather',
								'math',
								data,
								data + ' = [' + r.toString() + ']'
							));
						}
					})();
				}catch(e){
				}
			}
			resolve(result);
		});
	}

	execute(data) {
		clipboard.writeText(data.result);
	}
}

module.exports = Mather;
