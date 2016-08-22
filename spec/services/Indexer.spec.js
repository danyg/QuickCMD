/**
* @Overview
*
* @Author: Daniel Goberitz
* @Date:               2016-08-20 16:03:42
* @Last Modified time: 2016-08-22 00:53:50
*/

'use strict';

require('modulesLoader');
const sinon = require('sinon');
const path = require('path');

var Indexer;

describe('Indexer Specs', () => {

	beforeEach(() => {
		Indexer = include('service!Indexer');
		sinon.stub(Indexer.prototype, '_getDirectoriesToBeScanned').returns([
			path.resolve(__dirname + '/../assets/indexer/simple')
		]);
	});

	afterEach(() => {
		Indexer.prototype._getDirectoriesToBeScanned.restore();
	});

	it('should be able to index a folder', (done) => {
		Indexer.prototype._getDirectoriesToBeScanned.returns([
			path.resolve(__dirname + '/../assets/indexer/simple')
		]);

		var testee = new Indexer();
		testee.on('scan-done', () => {
			testee.find('test').then((docs) => {
				expect(docs.length).toBe(2);
				console.info(docs);
				done();
			});
		});
	});

	it('should be able to index several folders', (done) => {
		Indexer.prototype._getDirectoriesToBeScanned.returns([
			path.resolve(__dirname + '/../assets/indexer/sib'),
			path.resolve(__dirname + '/../assets/indexer/sib2'),
		]);

		var testee = new Indexer();
		testee.on('scan-done', () => {
			testee.find('Stest').then((docs) => {
				expect(docs.length).toBe(3);
				console.info(docs);
				done();
			});
		});
	});

	it('should be able to index several folders and nested ones', (done) => {
		Indexer.prototype._getDirectoriesToBeScanned.returns([
			path.resolve(__dirname + '/../assets/indexer/a'),
			path.resolve(__dirname + '/../assets/indexer/sib'),
			path.resolve(__dirname + '/../assets/indexer/sib2')
		]);

		var testee = new Indexer();
		testee.on('scan-done', () => {
			testee.find('S').then((docs) => {
				expect(docs.length).toBe(4);
				console.info(docs);
				done();
			});
		});
	});

	it('should return nothing when there is no match', (done) => {
		Indexer.prototype._getDirectoriesToBeScanned.returns([
			path.resolve(__dirname + '/../assets/indexer/a'),
			path.resolve(__dirname + '/../assets/indexer/sib'),
			path.resolve(__dirname + '/../assets/indexer/sib2')
		]);
		var testee = new Indexer();
		testee.on('scan-done', () => {
			testee.find('?£$').then((docs) => {
				expect(docs.length).toBe(0);
				console.info(docs);
				done();
			});
		});
	});

	it('should be able to add a new element to the index', () => {
		IMPLEMENT_ME();
	});

	it('should be able to remember user choises', () => {
		IMPLEMENT_ME();
	});

});