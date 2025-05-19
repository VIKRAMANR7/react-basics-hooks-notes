// import { useState } from "react";
// import { initialItems } from "../lib/utils";

// export default function UseMemo() {
//   const [count, setCount] = useState(0);
//   const [items] = useState(initialItems);

//   const selectedItem = items.find((item) => item.isSelected);
//   return (
//     <div>
//       <h1>Count: {count}</h1>
//       <h2>Selected Item: {selectedItem?.id}</h2>
//       <button onClick={() => setCount(count + 1)}>Increment</button>
//     </div>
//   );
// }

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
