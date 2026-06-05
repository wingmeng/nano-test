// =========================================
// 示例：测试数组 / 字符串工具函数
//
// 注意：nano-test 当前使用 Object.is 做值对比，
// 因此数组/对象等引用类型的新旧对象会被判为不等。
// 适合测试返回基本类型或可序列化值的函数。
// =========================================
import { runTest } from '../dist/index.js';

// ---- 数组工具 ----
function first(arr) {
  return arr[0];
}

function isEmpty(arr) {
  return arr.length === 0;
}

function includes(arr, item) {
  return arr.indexOf(item) !== -1;
}

console.log('── first ──');
runTest([
  { it: [[10, 20, 30]], expect: 10, name: '第一个元素' },
  { it: [[]], expect: undefined, name: '空数组' },
], first);

console.log('── isEmpty ──');
runTest([
  { it: [[]], expect: true, name: '空数组' },
  { it: [[1]], expect: false, name: '非空数组' },
], isEmpty);

console.log('── includes ──');
runTest([
  { it: [[1, 2, 3], 2], expect: true, name: '包含' },
  { it: [[1, 2, 3], 4], expect: false, name: '不包含' },
], includes);

// ---- 字符串工具 ----
function capitalize(str) {
  if (!str) return '';
  return str[0].toUpperCase() + str.slice(1);
}

function countChar(str, ch) {
  let count = 0;
  for (const c of str) {
    if (c === ch) count++;
  }
  return count;
}

console.log('── capitalize ──');
runTest([
  { it: ['hello'], expect: 'Hello', name: '首字母大写' },
  { it: [''], expect: '', name: '空字符串' },
  { it: ['a'], expect: 'A', name: '单字符' },
], capitalize);

console.log('── countChar ──');
runTest([
  { it: ['hello', 'l'], expect: 2, name: '计数' },
  { it: ['hello', 'x'], expect: 0, name: '无匹配' },
], countChar);
