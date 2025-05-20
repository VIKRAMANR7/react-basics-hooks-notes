import { useRef, useState } from "react";
import { TableVirtuoso } from "react-virtuoso";
import { createUsers } from "../../lib/users";
import UserCard from "./UserCard";

export default function RenderRows() {
  // const [users, setUsers] = useState(createUsers);
  const [users, setUsers] = useState(() => createUsers(0, 25));
  const [isLoading, setIsLoading] = useState(false);

  const virtuosoRef = useRef(null);

  async function fetchNextPage() {
    const newUsers = createUsers(users.length, users.length + 25);
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setUsers([...users, ...newUsers]);
  }
  return (
    <div>
      <button
        className="mb-4"
        onClick={() =>
          virtuosoRef.current.scrollToIndex({
            index: Math.floor(Math.random() * users.length),
            align: "start",
            behavior: "smooth",
          })
        }
      >
        Scroll
      </button>
      <TableVirtuoso
        ref={virtuosoRef}
        data={users}
        endReached={fetchNextPage}
        itemContent={(_, user) => <UserCard user={user} />}
        className="!h-[200px]"
        fixedFooterContent={() => (isLoading ? <div>Loading...</div> : null)}
        fixedHeaderContent={() => (
          <tr>
            <th className="w-[150px] bg-grayscale-700 text-left">Id</th>
            <th className="w-[150px] bg-grayscale-700 text-left">Name</th>
          </tr>
        )}
      />
    </div>
  );
}
