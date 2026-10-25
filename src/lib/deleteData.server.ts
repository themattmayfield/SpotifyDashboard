import { friendships, invites, plays, topSnapshots, users } from '@/db/schema';
import { eq, or } from 'drizzle-orm';
import type { getDb } from './db.server';

type Database = NonNullable<ReturnType<typeof getDb>>;

export async function deleteUserData(db: Database, userId: string) {
  await db.transaction(async (tx) => {
    await tx.delete(plays).where(eq(plays.userId, userId));
    await tx.delete(topSnapshots).where(eq(topSnapshots.userId, userId));
    await tx.delete(invites).where(eq(invites.inviterUserId, userId));
    await tx
      .delete(friendships)
      .where(or(eq(friendships.userA, userId), eq(friendships.userB, userId)));
    await tx.delete(users).where(eq(users.id, userId));
  });
}
