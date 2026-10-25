import { createServerFn } from '@tanstack/react-start';
import { redirect } from '@tanstack/react-router';

export const ensureAuthenticated = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { ensureAccessToken } = await import('./auth.server');
    if (!(await ensureAccessToken())) throw redirect({ to: '/login' });
    return true;
  }
);
export const login = createServerFn({ method: 'POST' }).handler(async () => {
  const { createLoginUrl } = await import('./auth.server');
  throw redirect({ href: createLoginUrl() });
});
export const logout = createServerFn({ method: 'POST' }).handler(async () => {
  const { clearAuthCookies } = await import('./auth.server');
  clearAuthCookies();
  throw redirect({ to: '/login' });
});
