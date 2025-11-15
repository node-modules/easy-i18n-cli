'use strict';

const assert = require('assert');
const en = require('./fixtures/locale/en-US');
const locale = require('../src/locale');

describe('test/locale.test.js', () => {
  let __i18n;
  let result;
  describe('zh', () => {
    beforeEach(() => {
      __i18n = locale({
        en,
        useEn: () => false,
        transferFilter: (text) => {
          return text;
        },
      });
    });

    it('general text', () => {
      result = __i18n('这是一段普通的文本');
      assert.equal(result, '这是一段普通的文本');
    });

    it('text include interpolation string value', () => {
      result = __i18n('这段文本里含有{value}插值', {
        value: __i18n('特殊'),
      });
      assert.equal(result, '这段文本里含有特殊插值');
    });
  });

  describe('en', () => {
    beforeEach(() => {
      __i18n = locale({
        en,
        useEn: () => true,
        transferFilter: (text) => {
          return text;
        },
      });
    });

    it('general text', () => {
      result = __i18n('这是一段普通的文本');
      assert.equal(result, 'This is a normal text');
    });

    it('text include interpolation string value', () => {
      result = __i18n('这段文本里含有{value}插值', {
        value: __i18n('特殊'),
      });
      assert.equal(result, 'This text contains special interpolation');
    });

    it('should fallback to original text when translation missing', () => {
      result = __i18n('未翻译的文本');
      assert.equal(result, '未翻译的文本');
    });
  });

  describe('edge cases', () => {
    it('should use default options when none provided', () => {
      __i18n = locale();
      result = __i18n('test text');
      assert.equal(result, 'test text');
    });

    it('should handle text with multi-scene ending (e.g. #sceneA)', () => {
      __i18n = locale({
        en: {},
        useEn: () => false,
      });
      result = __i18n('测试文本#sceneA');
      assert.equal(result, '测试文本');
    });

    it('should handle empty key in interpolation', () => {
      __i18n = locale({
        en: {},
        useEn: () => false,
      });
      result = __i18n('Text with {} empty key', {});
      // Empty key is skipped, so {} is removed
      assert.equal(result, 'Text with  empty key');
    });

    it('should handle numeric key in interpolation', () => {
      __i18n = locale({
        en: {},
        useEn: () => false,
      });
      result = __i18n('Item {0} and {1}', { 0: 'first', 1: 'second' });
      assert.equal(result, 'Item first and second');
    });

    it('should handle undefined value in interpolation', () => {
      __i18n = locale({
        en: {},
        useEn: () => false,
      });
      result = __i18n('Text with {undefined} value', {});
      assert.equal(result, 'Text with {undefined} value');
    });

    it('should use custom outputFilter', () => {
      __i18n = locale({
        en: {},
        useEn: () => false,
        outputFilter: (list) => list.join('-'),
      });
      result = __i18n('Hello {name}!', { name: 'World' });
      // result array: ['Hello ', 'World', '!']
      assert.equal(result, 'Hello -World-!');
    });

    it('should use custom transferFilter', () => {
      __i18n = locale({
        en: {},
        useEn: () => false,
        transferFilter: (text) => text.toUpperCase(),
      });
      result = __i18n('hello world');
      assert.equal(result, 'HELLO WORLD');
    });

    it('should handle text with no interpolation at the end', () => {
      __i18n = locale({
        en: {},
        useEn: () => false,
      });
      result = __i18n('Start {middle} end', { middle: 'CENTER' });
      assert.equal(result, 'Start CENTER end');
    });
  });
});
