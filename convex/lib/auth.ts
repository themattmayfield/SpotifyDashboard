async function digest(value: string) {
  return new Uint8Array(
    await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  );
}

export async function requireSecret(value: string) {
  const expected = process.env.CONVEX_SERVER_SECRET;
  if (!expected) throw new Error('Unauthorized');
  const [actualHash, expectedHash] = await Promise.all([
    digest(value),
    digest(expected),
  ]);
  let difference = 0;
  for (let index = 0; index < actualHash.length; index++)
    difference |= actualHash[index] ^ expectedHash[index];
  if (difference !== 0) throw new Error('Unauthorized');
}
