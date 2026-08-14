---
subText: Promise转换
---

# toPromiseValue

类似 Vue 内置的 [toValue](https://vuejs.org/api/reactivity-utilities.html#tovalue)，但支持异步来源：把「取原始值 → 判断是否为 `Promise` → `await`」封装成一步，始终返回 `Promise<T>`。`toValue` 只能同步规范化值 / Ref / getter，遇到异步来源时需要自己写 `await` 和类型判断；配合 VueUse 的 [computedAsync](https://vueuse.org/core/computedAsync/) 即可优雅地驱动异步数据（如从服务端拉取的数据）。

## Usage

```ts
import { computedAsync, ref } from '@vueuse/core';
import { toPromiseValue } from 'vesium';

// Promise 实例、异步函数、普通 Ref 都能直接传入
const data = computedAsync(() => toPromiseValue(ref(Promise.resolve('Hello World'))));
// data.value -> 'Hello World'

// 需要结果时直接 await（返回值始终是 Promise）
const value = await toPromiseValue('Hello World');
// value -> 'Hello World'
```

## 配置项

- `raw` - 解析完成后是否用 `toRaw` 解包为原始值（如 `reactive` 代理对象），默认 `true`。

## 返回值

- `Promise<T>` - 解析后的值；即使数据源是同步的，返回值也始终是 `Promise`。

## Type Definitions

:::dts ./index.ts
:::
