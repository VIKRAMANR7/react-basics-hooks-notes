# Complete Guide to useRef Hook in React

## Table of Contents

1. [What is useRef?](#what-is-useref)
2. [useState vs useRef: Key Differences](#usestate-vs-useref-key-differences)
3. [The Console Log Mystery Explained](#the-console-log-mystery-explained)
4. [Common useRef Patterns](#common-useref-patterns)
5. [Best Practices](#best-practices)
6. [Interview Questions & Answers](#interview-questions--answers)

---

## What is useRef?

`useRef` is a React Hook that returns a **mutable ref object** whose `.current` property is initialized to the passed argument. The returned object will persist for the full lifetime of the component.

### Basic Syntax

```javascript
import { useRef } from "react";

const myRef = useRef(initialValue);
```

### Key Characteristics

- **Mutable**: You can change `ref.current` directly
- **Persistent**: Value persists between re-renders
- **No Re-renders**: Changing ref doesn't trigger component re-render
- **Immediate Updates**: Changes happen synchronously

---

## useState vs useRef: Key Differences

Let's compare them side by side:

| Feature                  | useState                  | useRef                         |
| ------------------------ | ------------------------- | ------------------------------ |
| Triggers Re-render       | ✅ Yes                    | ❌ No                          |
| Mutable                  | ❌ No (immutable updates) | ✅ Yes (direct mutation)       |
| Update Timing            | Asynchronous/Batched      | Immediate/Synchronous          |
| Used in JSX              | ✅ Yes                    | ✅ Yes (but won't auto-update) |
| Persists between renders | ✅ Yes                    | ✅ Yes                         |

### Example Code with Console Logs

```javascript
import { useRef, useState } from "react";

export default function StateVsRef() {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);

  console.log("🔄 Component rendered with count:", count);

  const handleIncrement = () => {
    console.log("🔘 Button clicked!");
    console.log("📊 Before updates - State:", count, "Ref:", countRef.current);

    // Update state (asynchronous, triggers re-render)
    setCount(count + 1);
    console.log("📊 After setState - State:", count, "Ref:", countRef.current);

    // Update ref (synchronous, no re-render)
    countRef.current++;
    console.log(
      "📊 After ref update - State:",
      count,
      "Ref:",
      countRef.current
    );

    console.log("✅ Function execution complete");
    console.log("-------------------");
  };

  return (
    <div>
      <h1>Count: {count}</h1>
      <h2>Ref: {countRef.current}</h2>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
}
```

### What happens when you click the button:

**First Click Output:**

```
🔘 Button clicked!
📊 Before updates - State: 0 Ref: 0
📊 After setState - State: 0 Ref: 0
📊 After ref update - State: 0 Ref: 1
✅ Function execution complete
-------------------
🔄 Component rendered with count: 1
```

**Second Click Output:**

```
🔘 Button clicked!
📊 Before updates - State: 1 Ref: 1
📊 After setState - State: 1 Ref: 1
📊 After ref update - State: 1 Ref: 2
✅ Function execution complete
-------------------
🔄 Component rendered with count: 2
```

---

## The Console Log Mystery Explained

### Why State Shows Old Value But Ref Shows New Value?

When you click increment and see:

- State: 0
- Ref: 1

**This happens because:**

1. **State updates are scheduled**: `setCount(count + 1)` doesn't immediately change the `count` variable
2. **Ref updates are immediate**: `countRef.current++` changes the value right away
3. **Re-render happens later**: React batches state updates and re-renders after the function completes

### Detailed Breakdown:

```javascript
const handleIncrement = () => {
  // Current render: count = 0
  setCount(count + 1); // Schedules update: count will be 1 in NEXT render
  console.log(count); // Still 0 (current render value)

  countRef.current++; // Immediately becomes 1
  console.log(countRef.current); // Shows 1

  // After function completes, React re-renders with count = 1
};
```

---

## Common useRef Patterns

### 1. DOM Element Access (Most Common)

```javascript
import { useRef, useEffect } from "react";

export default function DOMAccess() {
  const inputRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    // Auto-focus input on component mount
    inputRef.current.focus();
    console.log("✅ Input focused on mount");
  }, []);

  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      console.log("▶️ Video started playing");
    }
  };

  const pauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      console.log("⏸️ Video paused");
    }
  };

  const scrollToInput = () => {
    inputRef.current.scrollIntoView({ behavior: "smooth" });
    console.log("📜 Scrolled to input");
  };

  return (
    <div>
      <input
        ref={inputRef}
        placeholder="This input auto-focuses"
        style={{ marginBottom: "1000px" }}
      />

      <video ref={videoRef} width="300" controls>
        <source src="video.mp4" type="video/mp4" />
      </video>

      <div>
        <button onClick={playVideo}>Play Video</button>
        <button onClick={pauseVideo}>Pause Video</button>
        <button onClick={scrollToInput}>Scroll to Input</button>
      </div>
    </div>
  );
}
```

### 2. Storing Previous Values

```javascript
import { useRef, useEffect, useState } from "react";

export default function PreviousValue() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");
  const prevCountRef = useRef();
  const prevNameRef = useRef();

  useEffect(() => {
    console.log("📝 Storing previous values");
    console.log("Previous count:", prevCountRef.current, "→ Current:", count);
    console.log("Previous name:", prevNameRef.current, "→ Current:", name);

    prevCountRef.current = count;
    prevNameRef.current = name;
  });

  return (
    <div>
      <div>
        <p>
          Count: {count} (Previous: {prevCountRef.current ?? "N/A"})
        </p>
        <button onClick={() => setCount((c) => c + 1)}>Increment</button>
      </div>

      <div>
        <p>
          Name: {name} (Previous: {prevNameRef.current ?? "N/A"})
        </p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
        />
      </div>
    </div>
  );
}
```

### 3. Timers and Intervals

```javascript
import { useRef, useState } from "react";

export default function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const startTimer = () => {
    if (intervalRef.current) {
      console.log("⚠️ Timer already running");
      return;
    }

    console.log("▶️ Starting timer");
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setSeconds((prevSeconds) => {
        const newSeconds = prevSeconds + 1;
        console.log("⏰ Timer tick:", newSeconds);
        return newSeconds;
      });
    }, 1000);

    console.log("✅ Timer started with ID:", intervalRef.current);
  };

  const stopTimer = () => {
    if (!intervalRef.current) {
      console.log("⚠️ No timer to stop");
      return;
    }

    console.log("⏹️ Stopping timer with ID:", intervalRef.current);
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
    console.log("✅ Timer stopped");
  };

  const resetTimer = () => {
    console.log("🔄 Resetting timer");
    stopTimer();
    setSeconds(0);
    console.log("✅ Timer reset to 0");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        console.log("🧹 Cleaning up timer on unmount");
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div>
      <h2>Timer: {seconds}s</h2>
      <p>Status: {isRunning ? "Running" : "Stopped"}</p>
      <button onClick={startTimer} disabled={isRunning}>
        Start
      </button>
      <button onClick={stopTimer} disabled={!isRunning}>
        Stop
      </button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  );
}
```

### 4. Avoiding Stale Closures

```javascript
import { useRef, useState, useCallback } from "react";

export default function StaleClosureFix() {
  const [count, setCount] = useState(0);
  const [delay, setDelay] = useState(1000);
  const countRef = useRef(count);
  const timeoutRef = useRef(null);

  // Keep ref in sync with state
  countRef.current = count;

  const alertCount = useCallback(() => {
    console.log("🚨 Alert triggered!");
    console.log("State value at alert time:", countRef.current);
    alert(`Count is: ${countRef.current}`);
  }, []); // Empty dependency array - won't recreate

  const startDelayedAlert = () => {
    if (timeoutRef.current) {
      console.log("⚠️ Clearing existing timeout");
      clearTimeout(timeoutRef.current);
    }

    console.log(`⏳ Setting alert for ${delay}ms from now`);
    console.log("Current count when setting timeout:", count);

    timeoutRef.current = setTimeout(() => {
      console.log("⏰ Timeout executed!");
      alertCount();
    }, delay);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment Count</button>

      <p>Delay: {delay}ms</p>
      <input
        type="number"
        value={delay}
        onChange={(e) => setDelay(Number(e.target.value))}
      />

      <button onClick={startDelayedAlert}>Alert Count After Delay</button>

      <p style={{ fontSize: "12px", color: "gray" }}>
        Increment count, then click alert. The alert will show the current count
        even if you increment more before the alert appears!
      </p>
    </div>
  );
}
```

### 5. Caching Expensive Calculations

```javascript
import { useRef, useState } from "react";

export default function ExpensiveCalculation() {
  const [input, setInput] = useState("");
  const [triggerCalc, setTriggerCalc] = useState(0);
  const cacheRef = useRef(new Map());

  const expensiveFunction = (value) => {
    console.log("💰 Expensive calculation started for:", value);

    // Check cache first
    if (cacheRef.current.has(value)) {
      console.log("✅ Found in cache!");
      return cacheRef.current.get(value);
    }

    // Simulate expensive calculation
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.random();
    }
    result = Math.floor(result);

    // Store in cache
    cacheRef.current.set(value, result);
    console.log("💾 Stored in cache:", value, "→", result);
    console.log("📊 Cache size:", cacheRef.current.size);

    return result;
  };

  const result = input ? expensiveFunction(input) : null;

  const clearCache = () => {
    console.log("🗑️ Clearing cache");
    cacheRef.current.clear();
    console.log("✅ Cache cleared");
  };

  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text to calculate"
      />

      <button onClick={() => setTriggerCalc((t) => t + 1)}>
        Force Recalculate
      </button>

      <button onClick={clearCache}>Clear Cache</button>

      {result && <p>Result: {result}</p>}

      <p style={{ fontSize: "12px", color: "gray" }}>
        Try entering the same text multiple times - it will be cached! Check
        console for cache hits/misses.
      </p>
    </div>
  );
}
```

---

## Best Practices

### ✅ Do's

1. **Use useRef for DOM access**

   ```javascript
   const inputRef = useRef(null);
   inputRef.current.focus();
   ```

2. **Store mutable values that don't affect render**

   ```javascript
   const intervalIdRef = useRef();
   ```

3. **Keep previous values**

   ```javascript
   const prevValueRef = useRef();
   useEffect(() => {
     prevValueRef.current = currentValue;
   });
   ```

4. **Always check if ref.current exists**
   ```javascript
   if (myRef.current) {
     myRef.current.focus();
   }
   ```

### ❌ Don'ts

1. **Don't use refs instead of state for UI updates**

   ```javascript
   // ❌ Wrong - UI won't update
   const countRef = useRef(0);
   countRef.current++; // Component won't re-render

   // ✅ Correct
   const [count, setCount] = useState(0);
   setCount(count + 1); // Triggers re-render
   ```

2. **Don't read/write refs during rendering**

   ```javascript
   // ❌ Wrong
   function Component() {
     const ref = useRef();
     ref.current = Math.random(); // Side effect during render
     return <div>{ref.current}</div>;
   }

   // ✅ Correct
   function Component() {
     const ref = useRef();
     useEffect(() => {
       ref.current = Math.random(); // Side effect in useEffect
     });
     return <div>Component</div>;
   }
   ```

3. **Don't forget to cleanup**
   ```javascript
   useEffect(() => {
     return () => {
       if (intervalRef.current) {
         clearInterval(intervalRef.current);
       }
     };
   }, []);
   ```

---

## Interview Questions & Answers

### Q1: What is useRef and when would you use it?

**Answer:** useRef is a React Hook that returns a mutable ref object. The .current property persists for the component's lifetime. Use it for:

- Accessing DOM elements directly
- Storing mutable values that don't trigger re-renders
- Keeping references to timers/intervals
- Avoiding stale closures
- Caching values between renders

### Q2: What's the difference between useState and useRef?

**Answer:**

- useState triggers re-renders when changed, useRef doesn't
- useState updates are asynchronous/batched, useRef updates are immediate
- useState is for values that affect the UI, useRef is for values that don't
- Both persist between renders

### Q3: Why doesn't changing a ref trigger a re-render?

**Answer:** Refs are designed to be an "escape hatch" from React's declarative paradigm. They allow you to perform imperative operations without causing unnecessary re-renders. React doesn't track ref mutations because they're meant for side effects, not state management.

### Q4: Can you use refs in functional components?

**Answer:** Yes! useRef is the Hook version of refs for functional components. Class components use createRef() or callback refs.

### Q5: What happens if you use a ref value in JSX?

**Answer:** You can use ref.current in JSX, but the UI won't update when the ref changes because refs don't trigger re-renders. The displayed value will only update when the component re-renders for other reasons.

### Q6: How do you cleanup refs containing timers?

**Answer:**

```javascript
useEffect(() => {
  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
}, []);
```

### Q7: What is a "stale closure" and how do refs help?

**Answer:** A stale closure occurs when a function captures old values from its lexical scope. Refs help by providing a mutable container that always holds the latest value:

```javascript
// Stale closure problem
const callback = useCallback(() => {
  console.log(count); // Always logs initial count value
}, []); // Empty deps means stale closure

// Solution with ref
const countRef = useRef(count);
countRef.current = count; // Always updated
const callback = useCallback(() => {
  console.log(countRef.current); // Always logs current count
}, []);
```

### Q8: Can you pass refs down to child components?

**Answer:** Yes, using `forwardRef`:

```javascript
const Input = forwardRef((props, ref) => <input ref={ref} {...props} />);

// Parent
const inputRef = useRef();
<Input ref={inputRef} />;
```

---

## Summary

useRef is a powerful Hook for:

1. **DOM Access**: Direct interaction with DOM elements
2. **Mutable Storage**: Values that persist but don't trigger re-renders
3. **Performance**: Avoiding unnecessary re-renders
4. **Side Effects**: Managing timers, intervals, and external libraries

Remember: Use useState for values that affect the UI, use useRef for everything else that needs to persist between renders!
