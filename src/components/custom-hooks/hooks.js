import { useEffect, useRef, useState } from "react";

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timerRef = useRef(null);

  useEffect(() => {
    // Clear any existing timeout
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new timeout
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function - clear timeout on unmount or dependency change
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
};

/*
1. Initial Setup
-useDebounce accepts a value and optional delay (defaults to 500ms)
-Creates state debouncedValue initialized with the current value
-Creates timerRef using useRef(null) to store timer ID persistently

2. useEffect Hook
-Dependencies: [value, delay] - Effect runs whenever either changes
-we need to restart the timer when input value or delay changes

3.Clear Existing Timer
Explicitly checks if timerRef.current exists
If it does, clears that timer with clearTimeout(timerRef.current)

4.Setting the New Timeout
Creates a new timer and stores the timer ID in timerRef.current
Timer will update debouncedValue after the specified delay

5.Cleanup Function
Still clears the timer if component unmounts or dependencies change


Initial state:
- search = ""
- debouncedSearch = ""
- timerRef.current = null

User types "a":
1. search becomes "a"
2. useEffect runs (value changed)
3. timerRef.current is null, so no clearing needed
4. setTimeout created → timerRef.current = 123 (some timer ID)
5. Timer scheduled: "set debouncedSearch to 'a' in 500ms"

User types "ab" (before 500ms):
1. search becomes "ab"
2. useEffect runs (value changed)
3. timerRef.current = 123, so clearTimeout(123) is called
4. Previous timer cancelled ❌
5. setTimeout created → timerRef.current = 456 (new timer ID)
6. New timer scheduled: "set debouncedSearch to 'ab' in 500ms"

User types "abc" (before 500ms):
1. search becomes "abc"
2. useEffect runs (value changed)
3. timerRef.current = 456, so clearTimeout(456) is called
4. Previous timer cancelled ❌
5. setTimeout created → timerRef.current = 789 (new timer ID)
6. New timer scheduled: "set debouncedSearch to 'abc' in 500ms"

User stops typing:
1. 500ms passes without new input
2. Timer 789 executes
3. debouncedSearch becomes "abc" ✅
4. API call triggered with "abc"
*/
