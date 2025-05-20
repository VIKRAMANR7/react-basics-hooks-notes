export default function UserCard({ user }) {
  return (
    <>
      <td>{user.id}</td>
      <td>{user.name}</td>
    </>
  );
}
