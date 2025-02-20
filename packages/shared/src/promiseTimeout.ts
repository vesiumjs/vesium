/**
 * 使用将setTimeout转换成Promise
 */
export function promiseTimeout(ms: number): Promise<void> {
  ms < 0 && (ms = 0);
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}
