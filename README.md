# @wingmeng/nano-test

A minimalist JavaScript function testing library.

极简 JS 函数测试库。

## Installation

```bash
npm install @wingmeng/nano-test
```

## Usage

```js
import { runTest } from '@wingmeng/nano-test';

// write the test cases
const tests = [
  { it: [1, 2], expect: 3 },
  { it: [0, -2], expect: -2 },
  { it: 2, expect: Error },
  { it: [-Infinity, Infinity], expect: NaN },
];

// your function
function sum(a, b) {
  return a + b;
}

// run batch tests, the result will display in browser console tab.
runTest(tests, sum);
```

## License

MIT