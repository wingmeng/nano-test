function runTest(testCases, fn) {
  testCases.forEach((testCase, index) => {
    const { it, expect, name } = testCase;
    const params = Array.isArray(it) ? it : [it];
    const paramStr = params.reduce((str, item, i) => {
      const param = JSON.stringify(item);
      str += (i > 0 ? ', ' : '') + param;
      return str;
    }, '');

    
  });
}

