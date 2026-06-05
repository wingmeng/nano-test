// src/index.ts
var isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";
var RESET = "\x1B[0m";
var GREEN = "\x1B[32m";
var RED = "\x1B[31m";
function logGreen(msg) {
  if (isBrowser) {
    console.log(`%c${msg}`, "color: green");
  } else {
    console.log(`${GREEN}${msg}${RESET}`);
  }
}
function logRed(msg) {
  if (isBrowser) {
    console.log(`%c${msg}`, "color: red");
  } else {
    console.log(`${RED}${msg}${RESET}`);
  }
}
function logPlain(msg) {
  console.log(msg);
}
function logGray(msg) {
  if (isBrowser) {
    console.log(`%c${msg}`, "color: gray");
  } else {
    console.log(`\x1B[90m${msg}\x1B[0m`);
  }
}
function fmtValue(v) {
  if (typeof v === "function") {
    return v.name || "(anonymous)";
  }
  if (typeof v === "number") {
    if (Number.isNaN(v)) {
      return "NaN";
    }
    if (v === Infinity) {
      return "Infinity";
    }
    if (v === -Infinity) {
      return "-Infinity";
    }
  }
  if (v === void 0) {
    return "undefined";
  }
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}
function runTest(tests, fn) {
  const results = [];
  let passedCount = 0;
  let failedCount = 0;
  for (let i = 0; i < tests.length; i++) {
    const startTime = performance.now();
    const { it: input, expect: expected, name } = tests[i];
    const paramsStr = Array.isArray(input) ? input.map((v) => fmtValue(v)).join(", ") : fmtValue(input);
    const label = name || `#${i + 1}`;
    const result = {
      index: i,
      name: name || "",
      passed: false,
      input,
      expected,
      actual: void 0
    };
    try {
      const args = Array.isArray(input) ? input : [input];
      if (isErrorClass(expected)) {
        try {
          fn(...args);
          result.actual = "No exception thrown";
          result.error = `Expected to throw ${expected.name}`;
        } catch (err) {
          const errObj = err;
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
    } catch (err) {
      const errObj = err;
      result.error = errObj.message || String(err);
    }
    if (!result.passed) {
      failedCount++;
    }
    results.push(result);
    const elapsed = (performance.now() - startTime).toFixed(2);
    console.group(`${i + 1}. ${label}: ${paramsStr}`);
    if (result.passed) {
      logGreen("\u2713 Pass");
    } else if (result.error && !result.actual) {
      logRed(`\u2717 Error: ${result.error}`);
    } else {
      logRed(
        `\u2717 Fail: Expect ${fmtValue(result.expected)}, but got ${fmtValue(result.actual)}`
      );
    }
    logGray(`${elapsed}ms`);
    console.groupEnd();
  }
  if (failedCount > 0) {
    logRed(`
  Passed: ${passedCount}  |  Failed: ${failedCount}  |  Total: ${results.length}`);
  } else {
    logGreen(`
  Passed: ${passedCount}  |  Failed: 0  |  Total: ${results.length}`);
  }
  logPlain("");
  return { passed: passedCount, failed: failedCount, results };
}
function deepEqual(a, b) {
  if (Number.isNaN(a) && Number.isNaN(b)) {
    return true;
  }
  if (Object.is(a, b)) {
    return true;
  }
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
    return false;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    return a.every((item, i) => deepEqual(item, b[i]));
  }
  if (Array.isArray(a) !== Array.isArray(b)) {
    return false;
  }
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) {
    return false;
  }
  return keysA.every(
    (key) => deepEqual(
      a[key],
      b[key]
    )
  );
}
function isErrorClass(value) {
  if (typeof value !== "function") {
    return false;
  }
  return value === Error || value.prototype instanceof Error;
}
var index_default = { runTest };
export {
  index_default as default,
  runTest
};
//# sourceMappingURL=index.js.map