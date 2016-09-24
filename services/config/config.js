/**
* @Overview
*
* @Author: Daniel Goberitz
* @Date:               2016-08-24 16:02:11
* @Last Modified time: 2016-08-24 17:46:49
*/

'use strict';

const Datastore = require('nedb'),
	fs = require('fs'),
	path = require('path'),
	os = require('os')
;

function createDir(dirPath) {
	if(!fs.statSync(dirPath).isDirectory()) {
		fs.mkdirSync(dirPath);
	}
}

function getBaseDir() {
	if(os.platform() === 'win32') {
		return path.resolve(os.homedir() + '/' + process.env.npm_package_name);
	} else {
		return path.resolve(os.homedir() + '/.' + process.env.npm_package_name);
	}
}

class Config {
	constructor() {
		this._configForms = {};
		this._baseDir = getBaseDir();
		createDir(this._baseDir);

		this._db = new Datastore({
			file: this._baseDir + '/config.json',
			autoload: true
		});
	}

	addForm(form) {
		if(form instanceof AbstractForm) {
			var name = this._configForms.getName();
			if(this._configForms.hasOwnProperty(name)) {
				throw new Error(`Already registered form with name ${name}`);
			}
			this._configForms[name] = form;
		} else {
			throw new TypeError('The received form is not in the prototype chain of AbstractForm');
		}
	}

	getForms() {
		return this._configForms
			.sort((a,b) => {
				return b.priority - a.priority;
			})
			.filter((form) => {
				return form.hidden !== true;
			})
		;
	}

	getData(formName) {
		return new Promise((resolve, reject) => {
			this._db.findOne({_id: formName}, (err, doc) => {
				if(err){
					reject(err);
					return;
				}
				resolve(doc);
			});
		});
	}

}

class AbstractForm {
	constructor() {
		this.name = '';
		this.title = '';
		this.description = '';
		this.schema = {};
		this.formSchema = ['*'];
		this.priority = 99;
		this.hidden = false;
	}

	onSave(data) {
		return data;
	}
}

class Field {
	constructor(name, type, title) {
		this._name = name;
		this.title = !!title ? title : name;
		this.type = type;
	}

	addField(field) {
		if(this.type === 'object' || this.type === 'array') {
			if(this.type === 'object') {
				if(!this.properties) {
					this.properties = {
					};
				}
				this.properties[field._name] = field;
			} else {
				this.items = field;
			}
		} else {
			throw new TypeError('addItem only works with types object or array');
		}
	}

	toOBJ() {
		var keys = Object.keys(this);
		var obj = {};
		keys.forEach((key) => {
			if(key.charAt(0) !== '_') {
				var val, prop;
				val = prop = this[key];
				if(!!prop.toOBJ) {
					val = prop.toOBJ();
				}
				obj[key] = val;
			}
		});

		return obj;
	}

	setDescription(v) {
		this.description = v;
	}

	setDefault(v) {
		this.default = v;
	}

	setMaxLength(v) {
		this.maxLength = v;
	}

	setMinimum(v) {
		this.minimum = v;
	}

	setMaximum(v) {
		this.maximum = v;
	}

	setExclusiveMinimum(v) {
		this.exclusiveMinimum = v;
	}

	setExclusiveMaximum(v) {
		this.exclusiveMaximum = v;
	}

	setMinItems(v) {
		this.minItems = v;
	}

	setMaxItems(v) {
		this.maxItems = v;
	}

	setReadOnly(v) {
		this.readOnly = !!v;
	}

	setRequired(v) {
		this.required = !!v;
	}
}

module.exports = new Config();
