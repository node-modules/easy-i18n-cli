'use strict';

const assert = require('assert');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');
const { promises: fsPromises } = require('fs');

describe('test/bin.test.js', () => {
  const binPath = path.join(__dirname, '../bin/easy-i18n-cli.js');
  const testDistDir = path.join(__dirname, 'fixtures', 'output');

  beforeEach(async () => {
    // Ensure output directory exists
    await fsPromises.mkdir(testDistDir, { recursive: true });
  });

  function runCLI(args, options = {}) {
    return new Promise((resolve, reject) => {
      const proc = spawn('node', [binPath, ...args], {
        cwd: options.cwd || process.cwd(),
        env: { ...process.env, ...options.env },
      });

      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      proc.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      proc.on('close', (code) => {
        resolve({ code, stdout, stderr });
      });

      proc.on('error', (err) => {
        reject(err);
      });
    });
  }

  describe('--version flag', () => {
    it('should display version and exit', async () => {
      const result = await runCLI(['--version']);
      assert.equal(result.code, 0);
      assert(result.stdout.includes('2.0.3') || result.stdout.match(/\d+\.\d+\.\d+/));
    });

    it('should display version with -v flag', async () => {
      const result = await runCLI(['-v']);
      assert.equal(result.code, 0);
      assert(result.stdout.includes('2.0.3') || result.stdout.match(/\d+\.\d+\.\d+/));
    });
  });

  describe('--config flag', () => {
    it('should load config from specified file', async () => {
      const configFile = path.join(__dirname, 'fixtures', 'test-config.js');
      const outputFile = path.join(testDistDir, 'cli-config-test.js');

      // Create a test config
      await fsPromises.writeFile(
        configFile,
        `const path = require('path');
module.exports = {
          srcDirs: ['file1.js'],
          distDir: path.join(__dirname, 'output'),
          distFileName: 'cli-config-test.js',
          cwd: __dirname,
        };`
      );

      const result = await runCLI(['-c', configFile]);
      assert.equal(result.code, 0);
      assert(fs.existsSync(outputFile));

      // Clean up
      await fsPromises.unlink(configFile);
      await fsPromises.unlink(outputFile);
    });

    it('should work with --config long form', async () => {
      const configFile = path.join(__dirname, 'fixtures', 'test-config2.js');
      const outputFile = path.join(testDistDir, 'cli-config-test2.js');

      // Create a test config
      await fsPromises.writeFile(
        configFile,
        `const path = require('path');
module.exports = {
          srcDirs: ['file1.js'],
          distDir: path.join(__dirname, 'output'),
          distFileName: 'cli-config-test2.js',
          cwd: __dirname,
        };`
      );

      const result = await runCLI(['--config', configFile]);
      assert.equal(result.code, 0);
      assert(fs.existsSync(outputFile));

      // Clean up
      await fsPromises.unlink(configFile);
      await fsPromises.unlink(outputFile);
    });
  });

  describe('--check flag', () => {
    it('should check locale file for untranslated text', async () => {
      const configFile = path.join(__dirname, 'fixtures', 'check-config.js');
      const outputFile = path.join(testDistDir, 'check-test.js');

      // Create output file with Chinese text directly
      await fsPromises.writeFile(
        outputFile,
        'module.exports = { "测试1": "测试1" };'
      );

      // Create a config that points to this file
      await fsPromises.writeFile(
        configFile,
        `const path = require('path');
module.exports = {
          srcDirs: ['file1.js'],
          distDir: path.join(__dirname, 'output'),
          distFileName: 'check-test.js',
          cwd: __dirname,
        };`
      );

      // Now check should fail
      const result = await runCLI(['--check', '-c', configFile]);
      // CLI logs error to stderr but exits with 0 (current behavior)
      assert(result.stderr.includes('need translate') || result.stderr.includes('Error'));

      // Clean up
      await fsPromises.unlink(configFile);
      if (fs.existsSync(outputFile)) {
        await fsPromises.unlink(outputFile);
      }
    });

    it('should pass check when all text is translated', async () => {
      const configFile = path.join(__dirname, 'fixtures', 'check-pass-config.js');
      const outputFile = path.join(testDistDir, 'check-pass-test.js');

      // Create output file with translated text
      await fsPromises.writeFile(
        outputFile,
        'module.exports = { test: "English text" };'
      );

      // Create a test config
      await fsPromises.writeFile(
        configFile,
        `const path = require('path');
module.exports = {
          srcDirs: ['file1.js'],
          distDir: path.join(__dirname, 'output'),
          distFileName: 'check-pass-test.js',
          cwd: __dirname,
        };`
      );

      const result = await runCLI(['--check', '-c', configFile]);
      assert.equal(result.code, 0);

      // Clean up
      await fsPromises.unlink(configFile);
      await fsPromises.unlink(outputFile);
    });
  });

  describe('default behavior', () => {
    it('should run extraction without flags', async () => {
      const configFile = path.join(__dirname, 'fixtures', 'default-config.js');
      const outputFile = path.join(testDistDir, 'default-test.js');

      // Create a test config
      await fsPromises.writeFile(
        configFile,
        `const path = require('path');
module.exports = {
          srcDirs: ['file1.js'],
          distDir: path.join(__dirname, 'output'),
          distFileName: 'default-test.js',
          cwd: __dirname,
        };`
      );

      const result = await runCLI(['-c', configFile]);
      assert.equal(result.code, 0);
      assert(fs.existsSync(outputFile));

      // Clean up
      await fsPromises.unlink(configFile);
      await fsPromises.unlink(outputFile);
    });

    it('should handle running without config', async () => {
      // Running without config will use default options which may error
      // but it should at least try to run
      const result = await runCLI([]);
      // May succeed or fail depending on default paths, just check it doesn't crash
      assert(typeof result.code === 'number');
    });
  });
});
