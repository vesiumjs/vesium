# toPromiseValue

Similar to Vue's built-in [toValue](https://vuejs.org/api/reactivity-utilities.html#tovalue), but supports asynchronous sources: it wraps "unwrapping the source → checking whether it is a `Promise` → `await`ing it" into a single step and always returns a `Promise<T>`. `toValue` can only normalize values, Refs, and getters synchronously, so async sources require manual `await` and type checks; this pairs naturally with VueUse's [computedAsync](https://vueuse.org/core/computedAsync/) for driving async data (e.g. fetched from a server).

## Usage

```ts
import { computedAsync, ref } from '@vueuse/core';
import { toPromiseValue } from 'vesium';

// Promise instances, async functions, and plain Refs can all be passed in
const data = computedAsync(() => toPromiseValue(ref(Promise.resolve('Hello World'))));
// data.value -> 'Hello World'

// Await directly when you need the result (the return value is always a Promise)
const value = await toPromiseValue('Hello World');
// value -> 'Hello World'
```

## Options

- `raw` - Whether to unwrap the resolved value with `toRaw` after resolution (e.g. `reactive` proxy objects), default `true`.

## Return Value

- `Promise<T>` - the resolved value; always a `Promise`, even when the source is synchronous.

## Type Definitions

:::dts ./index.ts
:::
