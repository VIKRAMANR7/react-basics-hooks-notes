export const users = Array(10)
  .fill(0)
  .map((_, i) => ({
    id: i,
    name: `User ${i}`,
  }));

export function createUsers(from = 0, to = 10000) {
  return Array.from({ length: to - from }, (_, i) => ({
    id: i + from,
    name: `User ${i + from}`,
  }));
}
