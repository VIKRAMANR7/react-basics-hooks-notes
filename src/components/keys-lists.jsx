import { useState } from "react";
import { users as defaultUsers } from "../lib/users";

export default function Keys() {
  const [users, setUsers] = useState(defaultUsers);

  const handleRemove = (id) => {
    const newUsers = users.filter((user) => user.id !== id);
    setUsers(newUsers);
  };
  return (
    <div className="flex flex-col items-start">
      {users.map((user) => {
        return (
          <button key={user.id} onClick={() => handleRemove(user.id)}>
            {user.name}
          </button>
        );
      })}
    </div>
  );
}

//Keys are identifiers they are a way to uniquely identify every single element in your code to then be able to make efficient updates
