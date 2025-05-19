import { useUserContext } from "./context";

export default function Profile() {
  const user = useUserContext();
  return <div>{user.name}</div>;
}
