'use strict';

const assert = require('assert');
const path = require('path');
const Utils = require('../src/utils');

describe('test/utils.test.js', () => {
  describe('noCacheRequire', () => {
    it('should require module without cache', () => {
      const fixturePath = path.resolve(__dirname, './fixtures/locale/en-US.js');
      const data1 = Utils.noCacheRequire(fixturePath);
      assert(data1);
      assert(data1['这是一段普通的文本']);
      
      // require again should work
      const data2 = Utils.noCacheRequire(fixturePath);
      assert(data2);
      assert.deepStrictEqual(data1, data2);
    });

    it('should clear cache for module', () => {
      const fixturePath = path.resolve(__dirname, './fixtures/locale/en-US.js');
      const initialCache = require.cache[fixturePath];
      
      Utils.noCacheRequire(fixturePath);
      
      // Cache should be cleared then re-added
      assert(require.cache[fixturePath]);
    });
  });

  describe('extractLocaleFromExport', () => {
    it('should extract locale from direct export', () => {
      const data = {
        key1: 'value1',
        key2: 'value2',
      };
      const result = Utils.extractLocaleFromExport(data);
      assert.deepStrictEqual(result, data);
    });

    it('should extract locale from default export', () => {
      const data = {
        default: {
          key1: 'value1',
          key2: 'value2',
        },
      };
      const result = Utils.extractLocaleFromExport(data);
      assert.deepStrictEqual(result, data.default);
    });

    it('should extract locale from nested object structure', () => {
      const data = {
        nested: {
          key1: 'value1',
          key2: 'value2',
        },
      };
      const result = Utils.extractLocaleFromExport(data);
      // When first value is an object, return it
      assert.deepStrictEqual(result, data.nested);
    });

    it('should return export value when first value is not object', () => {
      const data = {
        key1: 'value1',
        key2: 'value2',
      };
      const result = Utils.extractLocaleFromExport(data);
      assert.deepStrictEqual(result, data);
    });

    it('should handle default export with nested structure', () => {
      const data = {
        default: {
          nested: {
            key1: 'value1',
          },
        },
      };
      const result = Utils.extractLocaleFromExport(data);
      // Should extract default.nested since first value of default is object
      assert.deepStrictEqual(result, data.default.nested);
    });
  });
});
