# React useMemo Performance Optimization Guide

## Overview

This guide demonstrates how to use React's `useMemo` hook to optimize performance when dealing with expensive calculations that don't need to be recomputed on every render.

## The Problem: Expensive Array Operations

### Initial Code (Performance Issue)

```javascript
import { useState } from "react";
import { initialItems } from "../lib/utils";

export default function UseMemo() {
  const [count, setCount] = useState(0);
  const [items] = useState(initialItems);

  const selectedItem = items.find((item) => item.isSelected);
  return (
    <div>
      <h1>Count: {count}</h1>
      <h2>Selected Item: {selectedItem?.id}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### The Data Structure

```javascript
export const initialItems = new Array(29_999_999).fill(0).map((_, index) => {
  return {
    id: index,
    isSelected: index === 29_999_998,
  };
});
```

**Key Points:**

- `initialItems` contains approximately 29 million entries
- Each entry has an `id` property and an `isSelected` property
- Only the last element (`id === 29_999_998`) has `isSelected: true`

## Why This Is Slow

### Performance Issues

Every time the component re-renders (e.g., after clicking "Increment"):

1. `selectedItem = items.find(...)` executes again
2. The `.find()` method loops through millions of items to find the one with `isSelected: true`
3. Even though the `items` array doesn't change, the find operation is recomputed unnecessarily

### Consequences

This wasteful computation causes:

- **Long render times**
- **UI lag or freezing**
- **High CPU usage**

## The Solution: useMemo Hook

### What is useMemo?

`useMemo` is a React Hook that lets you cache (memoize) the result of a calculation between re-renders until the dependencies change.

### Optimized Code

```javascript
import { useMemo, useState } from "react";
import { initialItems } from "../lib/utils";

export default function UseMemo() {
  const [count, setCount] = useState(0);
  const [items] = useState(initialItems);

  const selectedItem = useMemo(
    () => items.find((item) => item.isSelected),
    [items]
  );

  return (
    <div>
      <h1>Count: {count}</h1>
      <h2>Selected Item: {selectedItem?.id}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

### How It Works

1. **First render**: The expensive `find()` operation runs and the result is cached
2. **Subsequent renders**: If `items` hasn't changed, `useMemo` returns the cached result
3. **Only when dependencies change**: The calculation runs again

### Benefits

- ✅ **Significant performance improvement** for expensive operations
- ✅ **Prevents unnecessary recalculations** when dependencies remain the same
- ✅ **Better user experience** with responsive UI
- ✅ **Lower CPU usage** and improved battery life on mobile devices

## Key Takeaways

- Use `useMemo` when you have expensive calculations that don't need to be recomputed on every render
- Always specify the correct dependencies array to ensure the memoization works properly
- In this example, since `items` never changes, the expensive `find()` operation only runs once
- This optimization is particularly valuable with large datasets or complex computations
