export const initialItems = new Array(29_999_999).fill(0).map((_, index) => {
  return {
    id: index,
    isSelected: index === 29_999_998,
  };
});

//So here initialItems is a variable that holds an array of about 29 million entries. And each one of those has an object and has an ID property and an isSelected property which is true or false and is only true for the last element in the array.
//This is important because you can run into performance problems because the selected item is the last one in the array - Only one item (id === 29_999_998) has isSelected: true

// In react to update state means we have to trigger a rerender of the entire component
//Here to find one item from 29 million items to return the item has performance issues

/*
Why is this slow?
Every time the component re-renders (e.g. after you click "Increment"):
selectedItem = items.find(...) executes again.

This .find() loop goes through millions of items to find the one with isSelected: true.

Even though the items array doesn’t change, the find() operation is recomputed unnecessarily.

This is wasteful and causes:
Long render times.
UI lag or freezing.
High CPU usage.
*/

/* Now as the items are same and will not change so there is no need to recompute this again we only need to run this once. If items are going to be the same in next render we can return the previous value which saves computational power */

//Solution
//useMemo -  It is a React Hook that lets you cache(memoize) the result of a calculation between re-renders until the dependencies change(here only when items change).
