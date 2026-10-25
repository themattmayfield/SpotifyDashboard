import { ConvexHttpClient } from 'convex/browser';
import type { FunctionReference, FunctionReturnType } from 'convex/server';

const url = process.env.CONVEX_URL;
const secret = process.env.CONVEX_SERVER_SECRET;
let client: ConvexHttpClient | undefined;

export const convexEnabled = () => Boolean(url && secret);
const getClient = () => {
  if (!url || !secret) return null;
  client ??= new ConvexHttpClient(url);
  return client;
};

export async function convexQuery<Q extends FunctionReference<'query'>>(
  fn: Q,
  args: Omit<Q['_args'], 'secret'>
): Promise<FunctionReturnType<Q>> {
  const instance = getClient();
  if (!instance || !secret) throw new Error('Persistence unavailable');
  return instance.query(fn, { ...args, secret } as Q['_args']);
}
export async function convexMutation<M extends FunctionReference<'mutation'>>(
  fn: M,
  args: Omit<M['_args'], 'secret'>
): Promise<FunctionReturnType<M>> {
  const instance = getClient();
  if (!instance || !secret) throw new Error('Persistence unavailable');
  return instance.mutation(fn, { ...args, secret } as M['_args']);
}
export function degradeConvex<TArgs, TResult>(
  fallback: TResult,
  handler: (args: TArgs) => Promise<TResult>
) {
  return async (args: TArgs) => {
    try {
      return await handler(args);
    } catch (error) {
      console.error(
        'Persistence operation failed',
        error instanceof Error ? error.message : 'Unknown error'
      );
      return fallback;
    }
  };
}
