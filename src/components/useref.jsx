// import { useRef } from "react";

// export default function UseRef() {
//   const countRef = useRef(0);

//   const handleIncrement = () => {
//     countRef.current++;
//     //The value of the ref is always changed or mutated by the dot current property
//     console.log("Ref: ", countRef.current);
//   };
//   return (
//     <div>
//       <h1>Count: {countRef.current}</h1>
//       <button onClick={handleIncrement}>Increment</button>
//     </div>
//   );
// }
//ref is something similar to state in the sense that you can hold and mutate values but unlike state, it does not cause a re-render of the component and ref values are not used in the return body of the actual component

import { useRef, useState } from "react";

export default function UseRefExplanation() {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const [renderCount, setRenderCount] = useState(0);

  const handleIncrement = () => {
    // This will trigger a re-render
    setCount(count + 1);

    // This will NOT trigger a re-render
    countRef.current++;

    console.log("State: ", count);
    console.log("Ref: ", countRef.current);
  };

  const handleOnlyRef = () => {
    // Only increment ref - no re-render
    countRef.current++;
    console.log("Only Ref incremented: ", countRef.current);
    console.log("UI will NOT update!");
  };

  const forceRerender = () => {
    // Force a re-render to see updated ref value
    setRenderCount(renderCount + 1);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">useState vs useRef Demo</h1>

      <div className="space-y-4">
        <div className="bg-blue-100 p-4 rounded">
          <h2 className="font-semibold">State (triggers re-render):</h2>
          <p className="text-xl">Count: {count}</p>
        </div>

        <div className="bg-green-100 p-4 rounded">
          <h2 className="font-semibold">Ref (does NOT trigger re-render):</h2>
          <p className="text-xl">Count: {countRef.current}</p>
          <p className="text-sm text-gray-600">
            This only updates when component re-renders for other reasons
          </p>
        </div>

        <div className="bg-purple-100 p-4 rounded">
          <h2 className="font-semibold">Render Count:</h2>
          <p className="text-xl">{renderCount}</p>
        </div>

        <div className="space-x-2">
          <button
            onClick={handleIncrement}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Increment Both (causes re-render)
          </button>
          <button
            onClick={handleOnlyRef}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Increment Only Ref (no re-render)
          </button>
          <button
            onClick={forceRerender}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Force Re-render
          </button>
        </div>

        <div className="bg-yellow-100 p-4 rounded">
          <h3 className="font-semibold">Why State Shows 0 but Ref Shows 1:</h3>
          <p className="text-sm">
            When you click increment, the console shows state as 0 and ref as 1
            because:
            <br />• State updates are scheduled for the next render
            <br />• The `count` variable still holds the old value during this
            render
            <br />• Refs update immediately since they're just object mutations
          </p>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold">Open Console to see the logs!</h3>
          <p className="text-sm">
            Click the buttons and check the browser console to see the behavior.
          </p>
        </div>
      </div>
    </div>
  );
}
