// ============================================================
// @wingmeng/nano-test — A minimalist JS function testing library
// ============================================================

/** 单个测试用例定义 */
export interface TestCase {
  /** 传入被测试函数的参数（非数组时视为单参数） */
  it: unknown;
  /** 期望结果。传入 Error 类则表示期望抛出该类型异常 */
  expect: unknown;
  /** 可选：用例名称 */
  name?: string;
}

export interface TestResult {
  index: number;
  name: string;
  passed: boolean;
  input: unknown;
  expected: unknown;
  actual: unknown;
  error?: string;
}

type TestableFunction = (...args: unknown[]) => unknown;

// ---- 环境检测与彩色输出 ----

const isBrowser =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined';

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';

function logGreen(msg: string): void {
  if (isBrowser) {
    console.log(`%c${msg}`, 'color: green');
  } else {
    console.log(`${GREEN}${msg}${RESET}`);
  }
}

function logRed(msg: string): void {
  if (isBrowser) {
    console.log(`%c${msg}`, 'color: red');
  } else {
    console.log(`${RED}${msg}${RESET}`);
  }
}

function logPlain(msg: string): void {
  console.log(msg);
}

function logGray(msg: string): void {
  if (isBrowser) {
    console.log(`%c${msg}`, 'color: gray');
  } else {
    console.log(`\x1b[90m${msg}\x1b[0m`);
  }
}

/** 格式化值为可读字符串 */
function fmtValue(v: unknown): string {
  if (typeof v === 'function') {
    return v.name || '(anonymous)';
  }
  if (typeof v === 'number') {
    if (Number.isNaN(v)) {
      return 'NaN';
    }
    if (v === Infinity) {
      return 'Infinity';
    }
    if (v === -Infinity) {
      return '-Infinity';
    }
  }
  if (v === undefined) {
    return 'undefined';
  }
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

/**
 * 运行一组测试用例
 * @param tests   - 测试用例数组
 * @param fn      - 被测试函数
 * @returns       测试结果汇总（包含通过数 / 失败数 / 详细结果）
 */
export function runTest(tests: TestCase[], fn: TestableFunction) {
  const results: TestResult[] = [];
  let passedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < tests.length; i++) {
    const startTime = performance.now();
    const { it: input, expect: expected, name } = tests[i];
    const paramsStr = Array.isArray(input)
      ? input.map((v) => fmtValue(v)).join(', ')
      : fmtValue(input);
    const label = name || `#${i + 1}`;

    const result: TestResult = {
      index: i,
      name: name || '',
      passed: false,
      input,
      expected,
      actual: undefined,
    };

    try {
      // 将输入转为参数数组
      const args = Array.isArray(input) ? input : [input];
      // 如果期望的是 Error 类，则函数应该抛出
      if (isErrorClass(expected)) {
        try {
          fn(...args);
          // 没有抛异常 -> 失败
          result.actual = 'No exception thrown';
          result.error = `Expected to throw ${expected.name}`;
        } catch (err: unknown) {
          const errObj = err as Error;
          if (err instanceof expected) {
            result.actual = errObj.message || `${expected.name}`;
            result.passed = true;
            passedCount++;
          } else {
            result.actual = errObj.name;
            result.error = `Expected ${expected.name}, but threw ${errObj.name}`;
          }
        }
      } else {
        const actual = fn(...args);
        result.actual = actual;
        if (deepEqual(actual, expected)) {
          result.passed = true;
          passedCount++;
        }
      }
    } catch (err: unknown) {
      const errObj = err as Error;
      result.error = errObj.message || String(err);
    }

    if (!result.passed) {
      failedCount++;
    }
    results.push(result);

    // ---- 实时输出每条用例结果（带颜色） ----
    const elapsed = (performance.now() - startTime).toFixed(2);

    console.group(`${i + 1}. ${label}: ${paramsStr}`);

    if (result.passed) {
      logGreen('✓ Pass');
    } else if (result.error && !result.actual) {
      // 运行异常（函数执行过程中抛出了未预期的错误）
      logRed(`✗ Error: ${result.error}`);
    } else {
      // 结果不匹配
      logRed(
        `✗ Fail: Expect ${fmtValue(result.expected)}, but got ${fmtValue(result.actual)}`
      );
    }

    logGray(`${elapsed}ms`);
    console.groupEnd();
  }

  // 汇总
  if (failedCount > 0) {
    logRed(`\n  Passed: ${passedCount}  |  Failed: ${failedCount}  |  Total: ${results.length}`);
  } else {
    logGreen(`\n  Passed: ${passedCount}  |  Failed: 0  |  Total: ${results.length}`);
  }
  logPlain('');

  return { passed: passedCount, failed: failedCount, results };
}

/** 深度比较两个值是否相等 */
function deepEqual(a: unknown, b: unknown): boolean {
  // NaN 视为相等
  if (Number.isNaN(a) && Number.isNaN(b)) {
    return true;
  }
  // 基本类型或同一引用
  if (Object.is(a, b)) {
    return true;
  }
  // 非对象类型不相等
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    return false;
  }
  // 数组比较
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    return a.every((item, i) => deepEqual(item, b[i]));
  }
  // 一方是数组另一方不是
  if (Array.isArray(a) !== Array.isArray(b)) {
    return false;
  }
  // 普通对象比较
  const keysA = Object.keys(a as object);
  const keysB = Object.keys(b as object);
  if (keysA.length !== keysB.length) {
    return false;
  }
  return keysA.every((key) =>
    deepEqual(
      (a as Record<string, unknown>)[key],
      (b as Record<string, unknown>)[key]
    )
  );
}

/** 判断一个值是否为 Error 构造函数 */
function isErrorClass(value: unknown): value is new (...args: unknown[]) => Error {
  if (typeof value !== 'function') {
    return false;
  }
  return value === Error || value.prototype instanceof Error;
}

export default { runTest };
