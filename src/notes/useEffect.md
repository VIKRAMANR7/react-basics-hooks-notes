# useEffect

## It is used to perform side effects in our application

**In most applications, usually side effects are results of state changing.**

> You can control the side effects using `useEffect`.

```js
useEffect(() => {}, []);
```

This is an empty useEffect with an empty dependency array.
The first part of useEffect is the actual code that we want to run.

```js
useEffect(() => {
  // The code we want to run
  // useEffect has an optional return function - Cleanup function
}, []);
// The dependency array
```

An important thing to understand is:
No matter what you provide in the dependency array, it is always guaranteed to run at least once.

```js
useEffect(() => {
  console.log("The count is:", count);
}, []);
```

Here, output will be: count is 0 and it will stay at 0 even after you press increment or decrement.

```js
import { useEffect, useState } from "react";

export default function UseEffect() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("The count is: " + count);

    return () => {
      console.log("I am being cleaned up");
    };
  }, [count]);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
}
```

When you provide the dependency count, only the console log will update according to the count.

Now, if we provide the optional return function:

- Before you click the button the first time, the output will log: "The count is: 0"
- But after that, every time you click the button:
  - First you'll see "I am being cleaned up"
  - Then "The count is: 1" (or whatever the updated value is).

**Why does this happen?**
useEffect will first run the code inside on mount of the component.
And then, when you give a dependency array, whenever the value in the dependency array changes:
The useEffect hook will destroy itself, run the cleanup function, and then recreate with the new value.

For example, if we do not provide any dependency array, the cleanup function will run only when the component unmounts.

```js
useEffect(() => {
  console.log("The count is: " + count);

  return () => {
    console.log("I am being cleaned up");
  };
}, []);
```
