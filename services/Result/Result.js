/**
* @Overview
*
* @Author: Daniel Goberitz
* @Date:               2016-08-22 04:01:14
* @Last Modified time: 2016-08-22 16:03:53
*/

'use strict';

class Result{
	constructor(type, id, name, match, optional) {
		if(!!type._id) {
			this._id = type._id;
			this.type = type.type;
			this.name = type.name;
			this.result = type.result;
		} else {
			this._id = id;
			this.type = type;
			this.name = !!name ? name : id;
			this.result = !!match ? match : this.name;
		}
		this.optional = optional === undefined ? false : optional;
	}
}

module.exports = Result;
