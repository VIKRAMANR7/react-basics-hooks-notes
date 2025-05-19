// import { useState } from "react";
// import Search from "./search";
// import { shuffle } from "../lib";

// const allUsers = ["john", "alex", "george", "simon", "james"];

// export default function UseCallback() {
//   const [users, setUsers] = useState(allUsers);

//   const handleSearch = (text) => {
//     const filteredUsers = allUsers.filter((user) => user.includes(text));
//     setUsers(filteredUsers);
//   };
//   return (
//     <>
//       <div className="flex mb-2 items-center">
//         <button onClick={() => setUsers(shuffle(allUsers))}>Shuffle</button>
//         <Search onChange={handleSearch} />
//       </div>
//       <ul>
//         {users.map((user) => (
//           <li key={user}>{user}</li>
//         ))}
//       </ul>
//     </>
//   );
// }

import { useCallback, useState } from "react";
import Search from "./search";
import { shuffle } from "../lib";

const allUsers = ["john", "alex", "george", "simon", "james"];

export default function UseCallback() {
  const [users, setUsers] = useState(allUsers);

  const handleSearch = useCallback(
    (text) => {
      console.log(users[0]);
      const filteredUsers = allUsers.filter((user) => user.includes(text));
      setUsers(filteredUsers);
    },
    [users]
  );
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
