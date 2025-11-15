# easy-i18n-cli

[![NPM version][npm-image]][npm-url]
[![CI][ci-image]][ci-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/easy-i18n-cli.svg
[npm-url]: https://npmjs.org/package/easy-i18n-cli
[ci-image]: https://github.com/node-modules/easy-i18n-cli/actions/workflows/ci.yml/badge.svg
[ci-url]: https://github.com/node-modules/easy-i18n-cli/actions/workflows/ci.yml
[node-image]: https://img.shields.io/badge/node.js-%3E=_8-green.svg
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/easy-i18n-cli.svg
[download-url]: https://npmjs.org/package/easy-i18n-cli

> i18n cli

## Installment

```bash
$ npm i easy-i18n-cli --save-dev
```

## Configuraion

```javascript
// i18n.config.js
module.exports = {
  srcDirs: [
    'test/fixtures/**/*.*',
  ],
  distDir: __dirname,
  tokenName: '__i18n',
};
```

```
...
  "translate": "easy-i18n-cli -c ./i18n.config.js",
  "translate:check": "npm run translate -- --check",
...
```
## Use web modules

```javascript
import locale from 'easy-i18n-cli/src/locale';
import enObj from './en-US';

export const __i18n = locale({
  en: enObj,
  useEn: () => true,
});
```

## Use APIS

```bash
$ ./bin/easy-i18n-cli.js -c ./google-translate.config.js
```

## Testing

This project has comprehensive test coverage with **100% code coverage** across all metrics.

### Run tests
```bash
npm test
```

### Run tests with HTML coverage report
```bash
npm run test:coverage
```

### Check coverage thresholds
```bash
npm run test:check-coverage
```

For detailed testing documentation, see [TEST_DOCUMENTATION.md](./TEST_DOCUMENTATION.md).

<!-- GITCONTRIBUTOR_START -->

## Contributors

|[<img src="https://avatars.githubusercontent.com/u/1011681?v=4" width="100px;"/><br/><sub><b>xudafeng</b></sub>](https://github.com/xudafeng)<br/>|[<img src="https://avatars.githubusercontent.com/u/52845048?v=4" width="100px;"/><br/><sub><b>snapre</b></sub>](https://github.com/snapre)<br/>|[<img src="https://avatars.githubusercontent.com/u/61226209?v=4" width="100px;"/><br/><sub><b>yangkeni</b></sub>](https://github.com/yangkeni)<br/>|[<img src="https://avatars.githubusercontent.com/u/11213298?v=4" width="100px;"/><br/><sub><b>WynterDing</b></sub>](https://github.com/WynterDing)<br/>|[<img src="https://avatars.githubusercontent.com/u/12947068?v=4" width="100px;"/><br/><sub><b>ilimei</b></sub>](https://github.com/ilimei)<br/>|
| :---: | :---: | :---: | :---: | :---: |


This project follows the git-contributor [spec](https://github.com/xudafeng/git-contributor), auto updated at `Mon Apr 07 2025 21:05:31 GMT+0800`.

<!-- GITCONTRIBUTOR_END -->

## License

The MIT License (MIT)
