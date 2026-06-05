// =========================================
// 示例：测试函数是否正确抛出异常
// =========================================
import { runTest } from '../dist/index.js';

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

function parseJSON(text) {
  if (typeof text !== 'string') {
    throw new TypeError('参数必须是字符串');
  }
  const result = JSON.parse(text);
  if (result.age < 0) {
    throw new ValidationError('age 不能为负数');
  }
  return result;
}

const tests = [
  { it: ['{"name":"wingmeng","age":18}'], expect: { name: 'wingmeng', age: 18 }, name: '正常解析' },
  { it: [42], expect: TypeError, name: '非字符串参数' },
  { it: ['not-json'], expect: SyntaxError, name: '非法 JSON 字符串' },
  { it: ['{"age":-1}'], expect: ValidationError, name: '业务校验失败' },
];

runTest(tests, parseJSON);
