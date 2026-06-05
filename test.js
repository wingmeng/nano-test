// =========================================
// @wingmeng/nano-test 自测文件
// 用库自己测自己，确保基础功能正常
// =========================================

// 注意：这里 import 的是源码 src/ 输出到 dist/ 的产物
import { runTest } from './dist/index.js';

// --- 1. 基本数值测试 ---
function sum(a, b) {
  return a + b;
}

const sumTests = [
  { it: [1, 2], expect: 3, name: '正数相加' },
  { it: [0, -2], expect: -2, name: '含负数' },
  { it: [-Infinity, Infinity], expect: NaN, name: 'Infinity 抵消' },
];

console.log('\n【sum 测试】');
runTest(sumTests, sum);

// --- 2. 错误抛出测试 ---
function throwIfZero(val) {
  if (val === 0) {
    throw new Error('val is zero');
  }
  return val;
}

const throwTests = [
  { it: [1], expect: 1, name: '正常值通过' },
  { it: [0], expect: Error, name: '期望抛 Error' },
  { it: [0], expect: RangeError, name: '期望抛 RangeError 但实际抛 Error' },
];

console.log('【throwIfZero 测试】');
runTest(throwTests, throwIfZero);

// --- 3. 字符串 / 对象测试 ---
function greet(name) {
  return `Hello, ${name}!`;
}

const greetTests = [
  { it: 'world', expect: 'Hello, world!', name: '字符串拼接' },
  { it: '', expect: 'Hello, !', name: '空字符串' },
];

console.log('【greet 测试】');
runTest(greetTests, greet);

// --- 4. 测试汇总预览：故意留一个失败 ---
function isEven(n) {
  return n % 2 === 0;
}

const evenTests = [
  { it: [2], expect: true, name: '2 是偶数' },
  { it: [3], expect: true, name: '3 是偶数（故意失败）' },
];

console.log('【isEven 测试（含故意失败）】');
runTest(evenTests, isEven);
