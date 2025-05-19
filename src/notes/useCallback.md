# React memo & useCallback: Complete Guide

## Table of Contents

1. [The Problem: Why memo Alone Isn't Enough](#the-problem)
2. [Understanding Function Re-creation](#function-recreation)
3. [How memo Works](#how-memo-works)
4. [The Solution: useCallback](#the-solution)
5. [Code Examples](#code-examples)
6. [Do's and Don'ts](#dos-and-donts)
7. [When to Use What](#when-to-use)

## The Problem: Why memo Alone Isn't Enough {#the-problem}

You might think wrapping a component with `memo` will prevent all unnecessary re-renders. But that's not always true when functions are involved.

### Initial Code (The Problem)

```javascript
// UseCallback.js
import { useState } from "react";
import Search from "./search";
import { shuffle } from "../lib";

const allUsers = ["john", "alex", "george", "simon", "james"];

export default function UseCallback() {
  const [users, setUsers] = useState(allUsers);

  const handleSearch = (text) => {
    const filteredUsers = allUsers.filter((user) => user.includes(text));
    setUsers(filteredUsers);
  };

  return (
    <>
      <div className="flex mb-2 items-center">
        <button onClick={() => setUsers(shuffle(allUsers))}>Shuffle</button>
        <Search onChange={handleSearch} />
      </div>
      <ul>
        {users.map((user) => (
          <li key={user}>{user}</li>
        ))}
      </ul>
    </>
  );
}
```

```javascript
// search.js
import { memo } from "react";

function Search({ onChange }) {
  console.log("Search re-rendered"); // This logs even when we don't want it to!
  return (
    <input
      type="text"
      placeholder="Search Users..."
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export default memo(Search);
```

```javascript
// lib.js
export function shuffle(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
```

**Problem**: Even with `memo`, the Search component re-renders every time you click the shuffle button!

## Understanding Function Re-creation {#function-recreation}

### Why Functions Are Different on Every Render

In React functional components, **every function is recreated on every render by default**.

```javascript
function MyComponent() {
  const [count, setCount] = useState(0);

  // This function is BRAND NEW on every render
  const handleClick = () => {
    console.log("Clicked!");
  };

  // Even though the code looks identical, these are different objects:
  // Render 1: handleClick = function#1
  // Render 2: handleClick = function#2
  // Render 3: handleClick = function#3

  return <button onClick={handleClick}>Count: {count}</button>;
}
```

### Visual Representation

```
Initial Render:
├── handleSearch = function#1
└── Search receives onChange={function#1} → Renders

Shuffle Button Clicked:
├── Component re-renders
├── handleSearch = function#2 (NEW FUNCTION!)
└── Search receives onChange={function#2} → Re-renders (memo sees different prop!)
```

### Proving Functions Are Different

```javascript
function Example() {
  const [count, setCount] = useState(0);

  const func1 = () => console.log("hello");
  const func2 = () => console.log("hello");

  console.log("Same function?", func1 === func2); // false - different objects!

  return (
    <button onClick={() => setCount(count + 1)}>
      Re-render to see console
    </button>
  );
}
```

## How memo Works {#how-memo-works}

`memo` performs a **shallow comparison** of props to decide whether to re-render:

```javascript
// memo does this internally:
function arePropsEqual(prevProps, nextProps) {
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);

  if (prevKeys.length !== nextKeys.length) return false;

  for (let key of prevKeys) {
    if (prevProps[key] !== nextProps[key]) return false; // Strict equality!
  }

  return true;
}
```

**Key Point**: Since functions are different objects on each render, `prevProps.onChange !== nextProps.onChange` is always `true`, causing re-renders.

## The Solution: useCallback {#the-solution}

`useCallback` **memoizes** (caches) a function, returning the same function reference across renders until dependencies change.

### Fixed Code with useCallback

```javascript
// UseCallback.js (FIXED)
import { useCallback, useState } from "react";
import Search from "./search";
import { shuffle } from "../lib";

const allUsers = ["john", "alex", "george", "simon", "james"];

export default function UseCallback() {
  const [users, setUsers] = useState(allUsers);

  const handleSearch = useCallback((text) => {
    const filteredUsers = allUsers.filter((user) => user.includes(text));
    setUsers(filteredUsers);
  }, []); // Empty dependency array = function never changes

  return (
    <>
      <div className="flex mb-2 items-center">
        <button onClick={() => setUsers(shuffle(allUsers))}>Shuffle</button>
        <Search onChange={handleSearch} />
      </div>
      <ul>
        {users.map((user) => (
          <li key={user}>{user}</li>
        ))}
      </ul>
    </>
  );
}
```

### How useCallback Works

```javascript
const handleSearch = useCallback(
  (text) => {
    // Function body
  },
  [dependencies]
);

// React's internal logic:
// 1. Check if dependencies changed
// 2. If yes: create new function
// 3. If no: return cached function
```

### Before vs After useCallback

**Before useCallback:**

```
Render 1: handleSearch = function#1 → Search renders
Shuffle → Re-render
Render 2: handleSearch = function#2 → Search renders again ❌
```

**After useCallback:**

```
Render 1: handleSearch = function#1 → Search renders
Shuffle → Re-render
Render 2: handleSearch = function#1 → Search skips render ✅
```

## Code Examples {#code-examples}

### Example 1: Wrong Usage - Adding Users as Dependency

```javascript
// ❌ WRONG: This defeats the purpose of useCallback
const handleSearch = useCallback(
  (text) => {
    console.log(users[0]); // Using users state
    const filteredUsers = allUsers.filter((user) => user.includes(text));
    setUsers(filteredUsers);
  },
  [users] // Function recreated every time users changes!
);

// Problem: Search will re-render on every change again!
```

### Example 2: Right Usage - No Dependencies

```javascript
// ✅ CORRECT: Function never changes
const handleSearch = useCallback((text) => {
  const filteredUsers = allUsers.filter((user) => user.includes(text));
  setUsers(filteredUsers);
}, []); // No dependencies = stable function
```

### Example 3: When Dependencies Are Necessary

```javascript
// ✅ CORRECT: Only when you actually need changing dependencies
const [searchTerm, setSearchTerm] = useState("");
const [caseSensitive, setCaseSensitive] = useState(false);

const handleSearch = useCallback(
  (text) => {
    const filter = caseSensitive
      ? (user) => user.includes(text)
      : (user) => user.toLowerCase().includes(text.toLowerCase());

    const filteredUsers = allUsers.filter(filter);
    setUsers(filteredUsers);
  },
  [caseSensitive]
); // Only recreate when caseSensitive changes
```

## Do's and Don'ts {#dos-and-donts}

### ✅ DO's

1. **Use useCallback when passing functions to memoized child components**

   ```javascript
   const MemoizedChild = memo(Child);
   const handleClick = useCallback(() => {}, []);
   return <MemoizedChild onClick={handleClick} />;
   ```

2. **Include all dependencies that change over time**

   ```javascript
   const handleClick = useCallback(() => {
     console.log(count);
   }, [count]); // Include count if it's used inside
   ```

3. **Use empty dependency array for functions that don't depend on component state/props**

   ```javascript
   const handleSubmit = useCallback((data) => {
     api.submit(data); // No dependencies on component state
   }, []);
   ```

4. **Trust React's ESLint plugin for dependencies**
   ```javascript
   // Install eslint-plugin-react-hooks
   // It will warn about missing dependencies
   ```

### ❌ DON'Ts

1. **Don't use useCallback everywhere "just in case"**

   ```javascript
   // ❌ Unnecessary if not passing to memo'd components
   const handleClick = useCallback(() => {
     console.log("clicked");
   }, []);
   return <button onClick={handleClick}>Click</button>;
   ```

2. **Don't add frequently changing dependencies**

   ```javascript
   // ❌ This defeats the purpose
   const handleClick = useCallback(() => {
     console.log(everChangingValue);
   }, [everChangingValue]); // Recreated on every change
   ```

3. **Don't forget dependencies that are used inside the function**

   ```javascript
   // ❌ Missing count dependency
   const handleClick = useCallback(() => {
     console.log(count); // Uses count but not in dependencies
   }, []); // This will show stale count!
   ```

4. **Don't overthink it - sometimes re-rendering is fine**

   ```javascript
   // ❌ Over-optimization
   const simpleHandler = useCallback(() => {
     console.log("simple");
   }, []);

   // ✅ Just use regular function if it's simple
   const simpleHandler = () => console.log("simple");
   ```

## When to Use What {#when-to-use}

### Use memo when:

- Child component is expensive to render
- Child receives complex props that don't change often
- Child component renders frequently due to parent re-renders

### Use useCallback when:

- Passing functions to memo'd child components
- Functions are dependencies of other hooks (useEffect, useMemo, etc.)
- Functions are computationally expensive to recreate

### Use both together when:

- You have a child component that should only re-render when its actual data changes
- The child receives function props from the parent

### Don't use either when:

- Component renders are already fast
- Props change frequently anyway
- You're prematurely optimizing

## Performance Testing

To verify your optimizations are working:

```javascript
// Add this to your memo'd component
function Search({ onChange }) {
  console.log("Search re-rendered", Date.now());
  // ... rest of component
}

// Or use React DevTools Profiler:
// 1. Open React DevTools
// 2. Go to Profiler tab
// 3. Start recording
// 4. Interact with your app
// 5. Stop recording and analyze
```

## Summary

1. **Functions are recreated on every render** by default in React
2. **memo prevents re-renders** but fails when function props change
3. **useCallback memoizes functions** to maintain stable references
4. **Use them together** for optimal performance with function props
5. **Don't overuse** - measure and optimize where it matters

Remember: Always measure performance before and after optimization. Sometimes the "optimization" can make things worse!
