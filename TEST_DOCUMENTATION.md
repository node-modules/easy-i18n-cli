# Test Documentation

This document describes the test suite for easy-i18n-cli and how to run tests and generate coverage reports.

## Test Framework

- **Framework**: Mocha
- **Assertion Library**: Node.js built-in `assert`
- **Coverage Tool**: nyc (Istanbul)

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests with coverage report
```bash
npm test
```

This will automatically generate:
- Text coverage report in the terminal
- LCOV report in `coverage/` directory

### Run specific test files
```bash
npx mocha test/utils.test.js
npx mocha test/locale.test.js
npx mocha test/easy-i18n-cli.test.js
npx mocha test/bin.test.js
```

## Coverage Requirements

The project has achieved **100% code coverage** across all metrics:

- **Statement Coverage**: 100%
- **Branch Coverage**: 100%
- **Function Coverage**: 100%
- **Line Coverage**: 100%

### Coverage by File

| File | Statements | Branches | Functions | Lines |
|------|------------|----------|-----------|-------|
| bin/easy-i18n-cli.js | 100% | 100% | 100% | 100% |
| src/easy-i18n.js | 100% | 100% | 100% | 100% |
| src/locale.js | 100% | 100% | 100% | 100% |
| src/utils.js | 100% | 100% | 100% | 100% |

## Test Files

### 1. test/utils.test.js
Tests for utility functions.

**Test Coverage:**
- `noCacheRequire()`: Module loading without cache
- `extractLocaleFromExport()`: Locale data extraction from various export formats
  - Direct exports
  - Default exports
  - Nested object structures

### 2. test/locale.test.js
Tests for the runtime locale resolution module.

**Test Coverage:**
- Basic text translation (Chinese/English)
- Interpolation with string values
- Multi-scene text handling (e.g., `text#sceneA`)
- Empty key handling in interpolation
- Numeric key handling in interpolation
- Undefined value handling in interpolation
- Custom output filters
- Custom transfer filters
- Default options behavior
- Missing translation fallback

### 3. test/easy-i18n-cli.test.js
Comprehensive tests for the main EasyI18n class.

**Test Coverage:**
- Constructor and initialization
- Debug and info logging
- Token extraction from source files
  - Single quotes, double quotes, template literals
  - Custom token names
  - Ignore keys
  - Custom regex patterns
- File and directory resolution
- Key sorting
- Chinese character detection
- Translation data filtering
- Data initialization from existing files
- Post-resolution merging (append mode vs non-append mode)
- Translation filter execution
- Output file generation
- Complete workflow execution (`run()`)
- Translation checking (`check()`)
- Combined run and check (`runWithCheck()`)
- Line offset calculation
- Error handling for untranslated content

### 4. test/bin.test.js
Tests for the CLI binary entry point.

**Test Coverage:**
- `--version` / `-v` flag
- `--config` / `-c` flag with custom config file
- `--check` flag with translation validation
- Default behavior without flags
- Error handling and output

## Test Structure

Each test file follows this structure:

```javascript
describe('test/filename.test.js', () => {
  describe('Feature/Function Name', () => {
    beforeEach(() => {
      // Setup before each test
    });

    afterEach(() => {
      // Cleanup after each test
    });

    it('should test specific behavior', () => {
      // Test assertions
    });
  });
});
```

## Edge Cases and Error Handling

The test suite includes comprehensive edge case testing:

1. **Empty/Invalid Files**
   - Missing dist files
   - Empty source files
   - Invalid module exports

2. **Different File Formats**
   - JavaScript (.js) files
   - TypeScript (.ts) files (with ts-node registration)
   - JSX (.jsx) files

3. **Command Line Arguments**
   - All flag combinations
   - Missing required config
   - Invalid config paths

4. **Error Scenarios**
   - Network/filesystem errors (handled gracefully)
   - Untranslated content detection
   - Invalid regex patterns

## Continuous Integration

The tests are designed to run in CI environments:

```yaml
# Example CI configuration
- name: Run tests
  run: npm test

- name: Check coverage
  run: npm test && npx nyc check-coverage --lines 100 --branches 100 --functions 100 --statements 100
```

## Coverage Thresholds

To enforce coverage thresholds, you can add to `package.json`:

```json
{
  "nyc": {
    "check-coverage": true,
    "lines": 100,
    "statements": 100,
    "functions": 100,
    "branches": 100
  }
}
```

## Test Best Practices

1. **Isolation**: Each test is independent and doesn't rely on other tests
2. **Cleanup**: Test artifacts are cleaned up after each test
3. **Descriptive Names**: Test names clearly describe what is being tested
4. **Coverage**: All code paths, branches, and edge cases are covered
5. **Maintainability**: Tests are well-organized and easy to understand

## Viewing Coverage Reports

### Terminal Report
The terminal shows a summary table after running tests.

### HTML Report
Generate an HTML coverage report:

```bash
npx nyc report --reporter=html
```

Then open `coverage/index.html` in a browser.

### LCOV Report
The LCOV report (`coverage/lcov.info`) can be used with various tools:
- Code coverage badges
- IDE integrations
- CI/CD pipelines

## Troubleshooting

### Tests Failing
1. Ensure dependencies are installed: `npm install`
2. Check Node.js version compatibility (>= 8)
3. Clear test artifacts: `rm -rf test/fixtures/output/*`

### Coverage Not 100%
1. Check which files/lines are uncovered in the terminal report
2. Review the HTML coverage report for details
3. Add tests for uncovered code paths

## Contributing

When adding new features:
1. Write tests first (TDD approach recommended)
2. Ensure all tests pass: `npm test`
3. Verify 100% coverage is maintained
4. Update this documentation if adding new test files
