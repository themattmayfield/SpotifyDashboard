import { friendships, invites, topSnapshots, users } from '@/db/schema';
import { createServerFn } from '@tanstack/react-start';
import { and, desc, eq, gt, isNull, or } from 'drizzle-orm';
import { degradeDb, getDb } from './db.server';
import { currentUser } from './identity';
import { type ComparisonLists, compatibilityScore } from './insights';

const idPattern = /^[A-Za-z0-9]+$/;
const tokenPattern = /^[A-Za-z0-9_-]{43}$/;
const ordered = (a: string, b: string) =>
  a < b ? ([a, b] as const) : ([b, a] as const);

async function latest(userId: string) {
  const db = getDb();
  if (!db) return {};
  const rows = await db
    .select()
    .from(topSnapshots)
    .where(eq(topSnapshots.userId, userId))
    .orderBy(desc(topSnapshots.takenAt));
  const result: ComparisonLists = {};
  for (const row of rows) {
    result[row.range] ??= { artists: [], tracks: [] };
    if (!result[row.range][row.kind].length)
      result[row.range][row.kind] = row.items;
  }
  return result;
}

export const getCompareHome = createServerFn({ method: 'GET' }).handler(
  degradeDb({ enabled: false, friends: [] }, async () => {
    const db = getDb();
    if (!db) return { enabled: false, friends: [] };
    const me = await currentUser();
    const rows = await db
      .select()
      .from(friendships)
      .where(or(eq(friendships.userA, me.id), eq(friendships.userB, me.id)));
    const mine = await latest(me.id);
    const friends = await Promise.all(
      rows.map(async (row) => {
        const id = row.userA === me.id ? row.userB : row.userA;
        const user = await db.query.users.findFirst({
          where: eq(users.id, id),
        });
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
    const db = getDb();
    if (!db) throw new Error('Database disabled');
    const me = await currentUser();
    const now = new Date();
    const active = await db
      .select()
      .from(invites)
      .where(
        and(
          eq(invites.inviterUserId, me.id),
          isNull(invites.revokedAt),
          gt(invites.expiresAt, now)
        )
      );
    if (active.length >= 20) throw new Error('Too many active invites');
    const token = Buffer.from(
      crypto.getRandomValues(new Uint8Array(32))
    ).toString('base64url');
    await db.insert(invites).values({
      token,
      inviterUserId: me.id,
      createdAt: now,
      expiresAt: new Date(now.getTime() + 14 * 86_400_000),
    });
    return token;
  }
);

const token = (value: unknown) => {
  if (typeof value !== 'string' || !tokenPattern.test(value))
    throw new Error('Invalid invite token');
  return value;
};
export const getInvite = createServerFn({ method: 'GET' })
  .validator(token)
  .handler(
    degradeDb(null, async ({ data }) => {
      const db = getDb();
      if (!db) return null;
      const me = await currentUser();
      const row = await db.query.invites.findFirst({
        where: and(
          eq(invites.token, data),
          isNull(invites.revokedAt),
          gt(invites.expiresAt, new Date())
        ),
      });
      if (!row) return null;
      const inviter = await db.query.users.findFirst({
        where: eq(users.id, row.inviterUserId),
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
  .validator(token)
  .handler(async ({ data }) => {
    const db = getDb();
    if (!db) throw new Error('Database disabled');
    const me = await currentUser();
    await db
      .insert(users)
      .values({
        id: me.id,
        displayName: me.name,
        image: me.image,
        createdAt: new Date(),
      })
      .onConflictDoUpdate({
        target: users.id,
        set: { displayName: me.name, image: me.image },
      });
    const row = await db.query.invites.findFirst({
      where: and(
        eq(invites.token, data),
        isNull(invites.revokedAt),
        gt(invites.expiresAt, new Date())
      ),
    });
    if (!row || row.inviterUserId === me.id) throw new Error('Invalid invite');
    const [userA, userB] = ordered(me.id, row.inviterUserId);
    await db
      .insert(friendships)
      .values({ userA, userB, createdAt: new Date() })
      .onConflictDoNothing();
    await db
      .update(invites)
      .set({ revokedAt: new Date() })
      .where(eq(invites.token, data));
    return row.inviterUserId;
  });

const friendId = (value: unknown) => {
  if (typeof value !== 'string' || !idPattern.test(value))
    throw new Error('Invalid Spotify ID');
  return value;
};
export const getComparison = createServerFn({ method: 'GET' })
  .validator(friendId)
  .handler(
    degradeDb(null, async ({ data }) => {
      const db = getDb();
      if (!db) return null;
      const me = await currentUser();
      const [userA, userB] = ordered(me.id, data);
      const friendship = await db.query.friendships.findFirst({
        where: and(eq(friendships.userA, userA), eq(friendships.userB, userB)),
      });
      if (!friendship) return null;
      const [mine, theirs, friend] = await Promise.all([
        latest(me.id),
        latest(data),
        db.query.users.findFirst({ where: eq(users.id, data) }),
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
    const db = getDb();
    if (!db) return;
    const me = await currentUser();
    const [userA, userB] = ordered(me.id, data);
    await db
      .delete(friendships)
      .where(and(eq(friendships.userA, userA), eq(friendships.userB, userB)));
  });
