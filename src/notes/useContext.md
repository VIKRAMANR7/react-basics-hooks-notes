# 🧠 Understanding useContext in React (with Custom Hooks)

This guide explains how to use `useContext` in React, when and why to use a separate `context.js` file, and the purpose of custom hooks.

---

## ✅ What is `useContext`?

`useContext` is a React Hook that lets you **read and share data** across components **without prop-drilling**.

```jsx
const MyContext = createContext();
const value = useContext(MyContext);
```

---

## 📦 Why use `context.js`?

**Not required, but recommended** for better structure in larger projects.

### Benefits:

- Central place for context and hook logic
- Reusable across multiple components
- Avoids repetition of `useContext(...)` logic

---

## 💡 Why use a Custom Hook?

A custom hook like `useUserContext()`:

- Wraps the `useContext(...)` call
- Throws a helpful error if the component is not wrapped in the provider
- Promotes clean and safe code

### Example:

```jsx
// context.js
import { createContext, useContext } from "react";

export const DashboardContext = createContext(undefined);

export function useUserContext() {
  const user = useContext(DashboardContext);
  if (user === undefined) {
    throw new Error(
      "useUserContext must be used within a DashboardContext.Provider"
    );
  }
  return user;
}
```

---

## 📁 File Structure Example

```
/src
  |-- UseContext.jsx
  |-- Dashboard.jsx
  |-- Sidebar.jsx
  |-- Profile.jsx
  |-- context.js
```

---

## 🧩 Component Code Using Context

### 1. `UseContext.jsx`

```jsx
import { useState } from "react";
import Dashboard from "./Dashboard";
import { DashboardContext } from "./context";

export default function UseContext() {
  const [user] = useState({ isInterested: true, name: "You" });

  return (
    <DashboardContext.Provider value={user}>
      <Dashboard />
    </DashboardContext.Provider>
  );
}
```

### 2. `Dashboard.jsx`

```jsx
import Profile from "./Profile";
import Sidebar from "./Sidebar";

export default function Dashboard() {
  return (
    <div>
      <Sidebar />
      <Profile />
    </div>
  );
}
```

### 3. `Sidebar.jsx`

```jsx
import { useUserContext } from "./context";

export default function Sidebar() {
  const user = useUserContext();
  return <div>{user.isInterested ? "Interested" : "Not Interested"}</div>;
}
```

### 4. `Profile.jsx`

```jsx
import { useUserContext } from "./context";

export default function Profile() {
  const user = useUserContext();
  return <div>{user.name}</div>;
}
```

---

## ❌ What if you skip `context.js` and custom hook?

You can inline everything in `UseContext.jsx` like this:

```jsx
import { useState, createContext, useContext } from "react";
const DashboardContext = createContext(undefined);

export default function UseContext() {
  const [user] = useState({ isInterested: true, name: "You" });
  return (
    <DashboardContext.Provider value={user}>
      <Dashboard />
    </DashboardContext.Provider>
  );
}

// Use useContext(DashboardContext) directly in child components
```

But this leads to:

- Repeated logic
- Less maintainable code
- No helpful error if the provider is missing

---

## ✅ Do's and Don'ts of useContext

### ✅ Do's

- ✅ Use a custom hook to encapsulate `useContext` and throw errors if used outside a provider.
- ✅ Wrap the parts of your app that need the context inside the Provider.
- ✅ Extract context logic into a separate file for cleaner code.

### ❌ Don'ts

- ❌ Don’t provide a default value like `{}` unless it’s truly safe.
- ❌ Don’t access context outside the provider – it will return `undefined`.
- ❌ Don’t overuse context for frequently changing values (use Zustand or Redux instead).

---

## 🧠 Summary

| Feature           | Required? | Why?                                     |
| ----------------- | --------- | ---------------------------------------- |
| `context.js` file | ❌        | Optional, helps organize code            |
| Custom hook       | ❌        | Recommended for safety and cleaner usage |
| `createContext()` | ✅        | Required to create a context             |
| `useContext()`    | ✅        | Required to access the context           |

---

> Context is great for sharing data across the component tree (like user, theme, locale). Keep it simple and structured with custom hooks and separation when possible.
