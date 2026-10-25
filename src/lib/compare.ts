import { createServerFn } from '@tanstack/react-start';
import { api } from '../../convex/_generated/api';
import {
  convexEnabled,
  convexMutation,
  convexQuery,
  degradeConvex,
} from './convex.server';
import { currentUser } from './identity';
import { type ComparisonLists, compatibilityScore } from './insights';

const idPattern = /^[A-Za-z0-9]+$/;
const tokenPattern = /^[A-Za-z0-9_-]{43}$/;
const ordered = (a: string, b: string) =>
  a < b ? ([a, b] as const) : ([b, a] as const);
async function latest(userId: string) {
  const rows = await convexQuery(api.wrapper.latestSnapshots, { userId });
  const result: ComparisonLists = {};
  for (const row of rows) {
    result[row.range] ??= { artists: [], tracks: [] };
    if (!result[row.range][row.kind].length)
      result[row.range][row.kind] = row.items;
  }
  return result;
}
export const getCompareHome = createServerFn({ method: 'GET' }).handler(
  degradeConvex({ enabled: false, friends: [] }, async () => {
    if (!convexEnabled()) return { enabled: false, friends: [] };
    const me = await currentUser();
    const rows = await convexQuery(api.wrapper.friends, { userId: me.id });
    const mine = await latest(me.id);
    const friends = await Promise.all(
      rows.map(async (row) => {
        const id = row.userA === me.id ? row.userB : row.userA;
        const user = await convexQuery(api.wrapper.getUser, { userId: id });
        return {
          id,
          name: user?.displayName ?? id,
          image: user?.image ?? null,
          score: compatibilityScore(mine, await latest(id)),
        };
      })
    );
    return { enabled: true, friends };
  })
);
export const createInvite = createServerFn({ method: 'POST' }).handler(
  async () => {
    if (!convexEnabled()) throw new Error('Persistence unavailable');
    const me = await currentUser();
    const token = Buffer.from(
      crypto.getRandomValues(new Uint8Array(32))
    ).toString('base64url');
    const now = Date.now();
    await convexMutation(api.wrapper.createInvite, {
      userId: me.id,
      token,
      now,
      expiresAt: now + 14 * 86_400_000,
    });
    return token;
  }
);
const validToken = (value: unknown) => {
  if (typeof value !== 'string' || !tokenPattern.test(value))
    throw new Error('Invalid invite token');
  return value;
};
export const getInvite = createServerFn({ method: 'GET' })
  .validator(validToken)
  .handler(
    degradeConvex(null, async ({ data }) => {
      if (!convexEnabled()) return null;
      const me = await currentUser();
      const row = await convexQuery(api.wrapper.invite, { token: data });
      if (!row || row.revokedAt || row.expiresAt < Date.now()) return null;
      const inviter = await convexQuery(api.wrapper.getUser, {
        userId: row.inviterUserId,
      });
      return {
        own: row.inviterUserId === me.id,
        inviter: {
          id: row.inviterUserId,
          name: inviter?.displayName ?? 'Spotify listener',
          image: inviter?.image ?? null,
        },
      };
    })
  );
export const acceptInvite = createServerFn({ method: 'POST' })
  .validator(validToken)
  .handler(async ({ data }) => {
    if (!convexEnabled()) throw new Error('Persistence unavailable');
    const me = await currentUser();
    return convexMutation(api.wrapper.acceptInvite, { token: data, user: me });
  });
const friendId = (value: unknown) => {
  if (typeof value !== 'string' || !idPattern.test(value))
    throw new Error('Invalid Spotify ID');
  return value;
};
export const getComparison = createServerFn({ method: 'GET' })
  .validator(friendId)
  .handler(
    degradeConvex(null, async ({ data }) => {
      if (!convexEnabled()) return null;
      const me = await currentUser();
      const [userA, userB] = ordered(me.id, data);
      if (!(await convexQuery(api.wrapper.friendship, { userA, userB })))
        return null;
      const [mine, theirs, friend] = await Promise.all([
        latest(me.id),
        latest(data),
        convexQuery(api.wrapper.getUser, { userId: data }),
      ]);
      return {
        me,
        friend,
        mine,
        theirs,
        score: compatibilityScore(mine, theirs),
      };
    })
  );
export const removeFriend = createServerFn({ method: 'POST' })
  .validator(friendId)
  .handler(async ({ data }) => {
    if (!convexEnabled()) return;
    const me = await currentUser();
    const [userA, userB] = ordered(me.id, data);
    await convexMutation(api.wrapper.removeFriend, { userA, userB });
  });
