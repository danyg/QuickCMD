/**
* @Overview
*
* @Author: Daniel Goberitz
* @Date:               2016-08-20 00:29:05
* @Last Modified time: 2016-08-20 10:42:47
*/

'use strict';

describe('Utils Specs', function() {
	var utils;

	beforeEach(() => {
		utils = include('service!utils');
	});

	describe('Camelize', () => {
		it('should work with spaces', () => {
			expect(utils.camelize('on close')).toBe('onClose');
		});

		it('should work with underscores', () => {
			expect(utils.camelize('an_underscored_text')).toBe('anUnderscoredText');
		});

		it('should work with dashes', () => {
			expect(utils.camelize('a-dashed-text')).toBe('aDashedText');
		});

		it('should work with a mix of spaces, underscored and dashes', () => {
			expect(utils.camelize('a-mixed_separated text')).toBe('aMixedSeparatedText');
		});

		it('should work with a mix of spaces, underscored, dashes and case', () => {
			expect(utils.camelize('A-Really_- mix____StRiNg To     Be ConVerTed')).toBe('aReallyMixStringToBeConverted');
		});

		it('should work real case', () => {
			expect(utils.camelize('on enter-full-screen')).toBe('onEnterFullScreen');
		});
	});

});