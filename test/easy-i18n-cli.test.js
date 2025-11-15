'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const { promises: fsPromises } = require('fs');
const EasyI18n = require('../src/easy-i18n');

describe('test/easy-i18n-cli.test.js', () => {
  const testDistDir = path.join(__dirname, 'fixtures', 'output');
  const testDistFile = path.join(testDistDir, 'test-output.js');

  beforeEach(async () => {
    // Clean up test output
    if (fs.existsSync(testDistFile)) {
      await fsPromises.unlink(testDistFile);
    }
  });

  afterEach(async () => {
    // Clean up test output
    if (fs.existsSync(testDistFile)) {
      await fsPromises.unlink(testDistFile);
    }
  });

  describe('Constructor', () => {
    it('should initialize with default options', () => {
      const instance = new EasyI18n({
        srcDirs: ['test/fixtures/**/*.js'],
        distDir: testDistDir,
      });
      assert(instance);
      assert(instance.options.tokenName === '__i18n');
      assert(instance.options.appendMode === true);
    });

    it('should merge custom options with defaults', () => {
      const instance = new EasyI18n({
        srcDirs: ['test/fixtures/**/*.js'],
        distDir: testDistDir,
        tokenName: 'customToken',
        appendMode: false,
        debug: true,
      });
      assert.equal(instance.options.tokenName, 'customToken');
      assert.equal(instance.options.appendMode, false);
      assert.equal(instance.options.debug, true);
    });

    it('should register ts-node for .ts files', () => {
      const instance = new EasyI18n({
        srcDirs: ['test/fixtures/**/*.js'],
        distDir: testDistDir,
        distFileName: 'test.ts',
      });
      assert(instance);
      // ts-node should be registered
    });
  });

  describe('debugLog', () => {
    it('should not log when debug is false', () => {
      const instance = new EasyI18n({
        srcDirs: ['test/fixtures/**/*.js'],
        distDir: testDistDir,
        debug: false,
      });
      // Should not throw
      instance.debugLog('test message');
    });

    it('should log when debug is true', () => {
      const instance = new EasyI18n({
        srcDirs: ['test/fixtures/**/*.js'],
        distDir: testDistDir,
        debug: true,
      });
      // Should not throw
      instance.debugLog('test message');
    });
  });

  describe('infoLog', () => {
    it('should log info message', () => {
      const instance = new EasyI18n({
        srcDirs: ['test/fixtures/**/*.js'],
        distDir: testDistDir,
      });
      // Should not throw
      instance.infoLog('test content', 'arg1');
    });
  });

  describe('getI18nTokens', () => {
    it('should extract i18n tokens from content', () => {
      const instance = new EasyI18n({
        srcDirs: ['test/fixtures/**/*.js'],
        distDir: testDistDir,
      });
      const content = "__i18n('test1') + __i18n('test2')";
      const result = instance.getI18nTokens(content);
      assert.deepStrictEqual(result, { test1: 'test1', test2: 'test2' });
    });

    it('should handle double quotes', () => {
      const instance = new EasyI18n({
        srcDirs: ['test/fixtures/**/*.js'],
        distDir: testDistDir,
      });
      const content = '__i18n("test1")';
      const result = instance.getI18nTokens(content);
      assert.deepStrictEqual(result, { test1: 'test1' });
    });

    it('should handle template literals', () => {
      const instance = new EasyI18n({
        srcDirs: ['test/fixtures/**/*.js'],
        distDir: testDistDir,
      });
      const content = '__i18n(`test1`)';
      const result = instance.getI18nTokens(content);
      assert.deepStrictEqual(result, { test1: 'test1' });
    });

    it('should handle custom token name', () => {
      const instance = new EasyI18n({
        srcDirs: ['test/fixtures/**/*.js'],
        distDir: testDistDir,
        tokenName: '__t',
      });
      const content = "__t('test1')";
      const result = instance.getI18nTokens(content);
      assert.deepStrictEqual(result, { test1: 'test1' });
    });

    it('should handle ignore keys', () => {
      const instance = new EasyI18n({
        srcDirs: ['test/fixtures/**/*.js'],
        distDir: testDistDir,
        ignoreKeys: ['ignored'],
      });
      const content = "__i18n('test1') + __i18n('ignored')";
      const result = instance.getI18nTokens(content);
      assert.deepStrictEqual(result, { test1: 'test1' });
    });

    it('should handle custom regex', () => {
      const instance = new EasyI18n({
        srcDirs: ['test/fixtures/**/*.js'],
        distDir: testDistDir,
        getI18nTokenRegExp: (token) => [
          new RegExp(`${token}\\(\\s*"([^"]+)"\\s*\\)`, 'g'),
        ],
      });
      const content = '__i18n("test1")';
      const result = instance.getI18nTokens(content);
      assert.deepStrictEqual(result, { test1: 'test1' });
    });

    it('should handle single regex (not array)', () => {
      const instance = new EasyI18n({
        srcDirs: ['test/fixtures/**/*.js'],
        distDir: testDistDir,
        getI18nTokenRegExp: (token) => new RegExp(`${token}\\(\\s*"([^"]+)"\\s*\\)`, 'g'),
      });
      const content = '__i18n("test1")';
      const result = instance.getI18nTokens(content);
      assert.deepStrictEqual(result, { test1: 'test1' });
    });
  });

  describe('resolveFileSync', () => {
    it('should resolve file and extract tokens', () => {
      const instance = new EasyI18n({
        srcDirs: ['test/fixtures/**/*.js'],
        distDir: testDistDir,
      });
      const filePath = path.join(__dirname, 'fixtures', 'file1.js');
      instance.resolveFileSync(filePath);
      assert(instance.currentData['测试1']);
    });
  });

  describe('resolveDirSync', () => {
    it('should resolve directory and extract all tokens', () => {
      const instance = new EasyI18n({
        srcDirs: ['fixtures/file*.js'],
        distDir: testDistDir,
        cwd: __dirname,
      });
      instance.resolveDirSync();
      assert(instance.currentData['测试1']);
      assert(instance.currentData['测试4']);
      assert(instance.currentData['测试5']);
    });
  });

  describe('sortKey', () => {
    it('should sort object keys alphabetically', () => {
      const instance = new EasyI18n({
        srcDirs: ['test/fixtures/**/*.js'],
        distDir: testDistDir,
      });
      const data = { c: 3, a: 1, b: 2 };
      const result = instance.sortKey(data);
      const keys = Object.keys(result);
      assert.deepStrictEqual(keys, ['a', 'b', 'c']);
    });
  });

  describe('hasChinese', () => {
    it('should detect Chinese characters', () => {
      const instance = new EasyI18n({
        srcDirs: ['test/fixtures/**/*.js'],
        distDir: testDistDir,
      });
      assert.equal(instance.hasChinese('测试'), true);
      assert.equal(instance.hasChinese('test'), false);
      assert.equal(instance.hasChinese('test测试'), true);
    });
  });

  describe('pickTranslatedData', () => {
    it('should pick only translated (non-Chinese) data', () => {
      const instance = new EasyI18n({
        srcDirs: ['test/fixtures/**/*.js'],
        distDir: testDistDir,
      });
      const data = {
        key1: 'translated text',
        key2: '中文文本',
        key3: 'another translation',
      };
      const result = instance.pickTranslatedData(data);
      assert.deepStrictEqual(result, {
        key1: 'translated text',
        key3: 'another translation',
      });
    });
  });

  describe('initData', () => {
    it('should initialize data from existing file', async () => {
      // Create an existing dist file
      const distFile = path.join(testDistDir, 'existing.js');
      await fsPromises.mkdir(testDistDir, { recursive: true });
      await fsPromises.writeFile(
        distFile,
        'module.exports = { 测试1: "Test 1" };'
      );

      const instance = new EasyI18n({
        srcDirs: ['fixtures/file1.js'],
        distDir: testDistDir,
        distFileName: 'existing.js',
        cwd: __dirname,
      });
      instance.initData();
      assert.deepStrictEqual(instance.existedData, { 测试1: 'Test 1' });
      assert(instance.currentData['测试1']);

      // Clean up
      await fsPromises.unlink(distFile);
    });

    it('should handle missing dist file gracefully', () => {
      const instance = new EasyI18n({
        srcDirs: ['fixtures/file1.js'],
        distDir: testDistDir,
        distFileName: 'non-existent.js',
        cwd: __dirname,
      });
      // Should not throw
      instance.initData();
    });
  });

  describe('postResolve', () => {
    it('should merge current and existing data in append mode', async () => {
      const instance = new EasyI18n({
        srcDirs: ['test/fixtures/**/*.js'],
        distDir: testDistDir,
        appendMode: true,
      });
      instance.currentData = { key1: '中文1', key2: '中文2' };
      instance.existedData = { key1: 'Translated 1', key3: 'Translated 3' };
      
      await instance.postResolve();
      
      // key1: existedData is translated (no Chinese), so it's kept in append mode
      // key2: new key, should be from current
      // key3: should be removed (not in current)
      assert.equal(instance.outputData.key1, 'Translated 1');
      assert.equal(instance.outputData.key2, '中文2');
      assert.equal(instance.outputData.key3, undefined);
    });

    it('should not append in non-append mode', async () => {
      const instance = new EasyI18n({
        srcDirs: ['test/fixtures/**/*.js'],
        distDir: testDistDir,
        appendMode: false,
      });
      instance.currentData = { key1: '中文1' };
      instance.existedData = { key2: 'Translated 2' };
      
      await instance.postResolve();
      
      assert.equal(instance.outputData.key1, '中文1');
      assert.equal(instance.outputData.key2, undefined);
    });

    it('should call translateFilter for new keys', async () => {
      let called = false;
      const instance = new EasyI18n({
        srcDirs: ['test/fixtures/**/*.js'],
        distDir: testDistDir,
        translateFilter: async (value) => {
          called = true;
          return 'TRANSLATED: ' + value;
        },
      });
      instance.currentData = { newKey: '新键' };
      instance.existedData = {};
      
      await instance.postResolve();
      
      assert.equal(called, true);
      assert.equal(instance.outputData.newKey, 'TRANSLATED: 新键');
    });
  });

  describe('output', () => {
    it('should write output file with default filter', async () => {
      const instance = new EasyI18n({
        srcDirs: ['fixtures/file1.js'],
        distDir: testDistDir,
        distFileName: 'output-test.js',
        cwd: __dirname,
      });
      instance.currentData = { test: 'test' };
      instance.existedData = {};
      
      await instance.output();
      
      const outputPath = path.join(testDistDir, 'output-test.js');
      assert(fs.existsSync(outputPath));
      const content = await fsPromises.readFile(outputPath, 'utf-8');
      assert(content.includes('module.exports'));
      
      // Clean up
      await fsPromises.unlink(outputPath);
    });

    it('should write output file with custom filter', async () => {
      const instance = new EasyI18n({
        srcDirs: ['fixtures/file1.js'],
        distDir: testDistDir,
        distFileName: 'output-custom.js',
        cwd: __dirname,
        outputFilter: (json) => `export default ${JSON.stringify(json)};\n`,
      });
      instance.currentData = { test: 'test' };
      instance.existedData = {};
      
      await instance.output();
      
      const outputPath = path.join(testDistDir, 'output-custom.js');
      assert(fs.existsSync(outputPath));
      const content = await fsPromises.readFile(outputPath, 'utf-8');
      assert(content.includes('export default'));
      
      // Clean up
      await fsPromises.unlink(outputPath);
    });
  });

  describe('run', () => {
    it('should run full extraction and output process', async () => {
      const outputFile = path.join(testDistDir, 'run-test.js');
      const instance = new EasyI18n({
        srcDirs: ['fixtures/file1.js'],
        distDir: testDistDir,
        distFileName: 'run-test.js',
        cwd: __dirname,
      });
      
      await instance.run();
      
      assert(fs.existsSync(outputFile));
      const content = await fsPromises.readFile(outputFile, 'utf-8');
      assert(content.includes('测试1'));
      
      // Clean up
      await fsPromises.unlink(outputFile);
    });

    it('should accept runtime options', async () => {
      const outputFile = path.join(testDistDir, 'run-options.js');
      const instance = new EasyI18n({
        srcDirs: ['fixtures/file1.js'],
        distDir: testDistDir,
        distFileName: 'run-options.js',
        cwd: __dirname,
        appendMode: true,
      });
      
      await instance.run({ appendMode: false });
      
      assert.equal(instance.options.appendMode, false);
      
      // Clean up
      if (fs.existsSync(outputFile)) {
        await fsPromises.unlink(outputFile);
      }
    });
  });

  describe('_getLineOffset', () => {
    it('should get line offset for module.exports', async () => {
      const testFile = path.join(testDistDir, 'offset-test.js');
      await fsPromises.mkdir(testDistDir, { recursive: true });
      await fsPromises.writeFile(
        testFile,
        "// Comment\nconst data = {};\nmodule.exports = data;\n"
      );
      
      const instance = new EasyI18n({
        srcDirs: ['test/fixtures/**/*.js'],
        distDir: testDistDir,
        distFileName: 'offset-test.js',
      });
      
      const offset = await instance._getLineOffset();
      assert.equal(offset, 3); // Line 2 (0-indexed) + 1
      
      // Clean up
      await fsPromises.unlink(testFile);
    });
  });

  describe('check', () => {
    it('should pass when all values are translated', async () => {
      const checkFile = path.join(testDistDir, 'check-pass.js');
      await fsPromises.mkdir(testDistDir, { recursive: true });
      await fsPromises.writeFile(
        checkFile,
        'module.exports = { test: "Translated text" };'
      );
      
      const instance = new EasyI18n({
        srcDirs: ['test/fixtures/**/*.js'],
        distDir: testDistDir,
        distFileName: 'check-pass.js',
      });
      
      await instance.check();
      
      // Clean up
      await fsPromises.unlink(checkFile);
    });

    it('should throw error when Chinese characters found', async () => {
      const checkFile = path.join(testDistDir, 'check-fail.js');
      await fsPromises.mkdir(testDistDir, { recursive: true });
      await fsPromises.writeFile(
        checkFile,
        'module.exports = { test: "中文文本" };'
      );
      
      const instance = new EasyI18n({
        srcDirs: ['test/fixtures/**/*.js'],
        distDir: testDistDir,
        distFileName: 'check-fail.js',
      });
      
      try {
        await instance.check();
        assert.fail('Should have thrown error');
      } catch (err) {
        assert.equal(err.message, 'need translate the i18n!');
        assert(err.lines);
        assert(err.linesCount > 0);
      }
      
      // Clean up
      await fsPromises.unlink(checkFile);
    });
  });

  describe('runWithCheck', () => {
    it('should run and then check', async () => {
      const outputFile = path.join(testDistDir, 'run-check.js');
      const instance = new EasyI18n({
        srcDirs: ['fixtures/file1.js'],
        distDir: testDistDir,
        distFileName: 'run-check.js',
        cwd: __dirname,
        translateFilter: async (value) => 'Test1', // No Chinese characters
      });
      
      await instance.runWithCheck();
      
      assert(fs.existsSync(outputFile));
      
      // Clean up
      await fsPromises.unlink(outputFile);
    });

    it('should throw error if check fails', async () => {
      const outputFile = path.join(testDistDir, 'run-check-fail.js');
      const instance = new EasyI18n({
        srcDirs: ['fixtures/file1.js'],
        distDir: testDistDir,
        distFileName: 'run-check-fail.js',
        cwd: __dirname,
        translateFilter: async (value) => value, // Keep Chinese
      });
      
      try {
        await instance.runWithCheck();
        assert.fail('Should have thrown error');
      } catch (err) {
        assert.equal(err.message, 'need translate the i18n!');
      }
      
      // Clean up
      if (fs.existsSync(outputFile)) {
        await fsPromises.unlink(outputFile);
      }
    });
  });

  describe('defaultOptions', () => {
    it('should expose default options', () => {
      assert(EasyI18n.defaultOptions);
      assert.equal(EasyI18n.defaultOptions.tokenName, '__i18n');
      assert.equal(EasyI18n.defaultOptions.appendMode, true);
    });
  });
});

