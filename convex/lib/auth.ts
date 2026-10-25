export function requireSecret(value: string) {
  const expected = process.env.CONVEX_SERVER_SECRET;
  if (!expected || value.length !== expected.length)
    throw new Error('Unauthorized');
  let difference = 0;
  for (let index = 0; index < value.length; index++)
    difference |= value.charCodeAt(index) ^ expected.charCodeAt(index);
  if (difference !== 0) throw new Error('Unauthorized');
}
