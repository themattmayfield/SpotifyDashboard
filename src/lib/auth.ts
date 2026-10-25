import { redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

export const ensureAuthenticated = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { ensureAccessToken } = await import('./auth.server');
    if (!(await ensureAccessToken())) throw redirect({ to: '/login' });
    return true;
  }
);
export const logout = createServerFn({ method: 'POST' }).handler(async () => {
  const { clearAuthCookies } = await import('./auth.server');
  clearAuthCookies();
  throw redirect({ to: '/login', statusCode: 303 });
});
