import { useUserContext } from "./context";

export default function Sidebar() {
  const user = useUserContext();
  return <div>{user.isInterested ? "Interested" : "Not Interested"}</div>;
}
