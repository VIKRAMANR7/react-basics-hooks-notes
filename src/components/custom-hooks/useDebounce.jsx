//This is a custom hook used to delay the updation of a certain value by a certain amount of time

import { useEffect, useState } from "react";
import { useDebounce } from "./hooks";
import SearchBar from "./SearchBar";
import { fetchUsers } from "./utils";

export default function UseDebounce() {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);

      const users = await fetchUsers(debouncedSearch);
      setUsers(users);

      setLoading(false);
    };
    loadUsers();
  }, [debouncedSearch]);

  return (
    <div className="tutorial">
      <SearchBar onChange={setSearch} />
      {loading && <div>Loading...</div>}
      {!loading &&
        users.map((user) => {
          return <div key={user.id}>{user.name}</div>;
        })}
    </div>
  );
}
