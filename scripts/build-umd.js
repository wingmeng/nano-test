/**
 * 将 CJS 产物包装为 UMD 格式（兼容 AMD / CommonJS / 全局变量）
 */
import { readFileSync, writeFileSync } from 'fs';

const CJS_FILE = 'dist/index.cjs';
const UMD_FILE = 'dist/index.umd.js';
const GLOBAL_NAME = 'NanoTest';

const cjsCode = readFileSync(CJS_FILE, 'utf-8');

const umdWrapper = `(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS
    module.exports = factory();
  } else {
    // Browser global
    root.${GLOBAL_NAME} = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var module = { exports: {} };
${cjsCode}
  return module.exports;
}));
`;

writeFileSync(UMD_FILE, umdWrapper, 'utf-8');
console.log(`✓ UMD bundle created: ${UMD_FILE}`);
