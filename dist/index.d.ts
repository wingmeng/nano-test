/** 单个测试用例定义 */
interface TestCase {
    /** 传入被测试函数的参数（非数组时视为单参数） */
    it: unknown;
    /** 期望结果。传入 Error 类则表示期望抛出该类型异常 */
    expect: unknown;
    /** 可选：用例名称 */
    name?: string;
}
interface TestResult {
    index: number;
    name: string;
    passed: boolean;
    input: unknown;
    expected: unknown;
    actual: unknown;
    error?: string;
}
type TestableFunction = (...args: unknown[]) => unknown;
/**
 * 运行一组测试用例
 * @param tests   - 测试用例数组
 * @param fn      - 被测试函数
 * @returns       测试结果汇总（包含通过数 / 失败数 / 详细结果）
 */
declare function runTest(tests: TestCase[], fn: TestableFunction): {
    passed: number;
    failed: number;
    results: TestResult[];
};
declare const _default: {
    runTest: typeof runTest;
};

export { type TestCase, type TestResult, _default as default, runTest };
