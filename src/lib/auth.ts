import { redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

export const ensureAuthenticated = createServerFn({ method: 'GET' })
  .validator((path?: unknown) => (typeof path === 'string' ? path : undefined))
  .handler(async ({ data }) => {
    const { ensureAccessToken, setReturnTo } = await import('./auth.server');
    if (!(await ensureAccessToken())) {
      if (data?.startsWith('/compare/invite/')) setReturnTo(data);
      throw redirect({ to: '/login' });
    }
    return true;
  });
export const logout = createServerFn({ method: 'POST' }).handler(async () => {
  const { clearAuthCookies } = await import('./auth.server');
  clearAuthCookies();
  throw redirect({ to: '/login', statusCode: 303 });
});
