// =========================================
// 示例：对一个 sum 函数进行单元测试
// =========================================
// import { runTest } from '../dist/index.umd.js';

function sum(a, b) {
  return a + b;
}

const tests = [
  { it: [1, 2], expect: 3, name: '正数相加' },
  { it: [0, -2], expect: -2, name: '含负数' },
  { it: [-1, 1], expect: 0, name: '正负抵消' },
  { it: [-Infinity, Infinity], expect: NaN, name: 'Infinity 抵消' },
  { it: ['hello', ' '], expect: 'hello ', name: '字符串拼接' },
];

NanoTest.runTest(tests, sum);
