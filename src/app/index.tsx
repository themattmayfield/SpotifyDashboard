// src/app/index.tsx
// Root index - redirects to login if not authenticated
import { createFileRoute, redirect } from '@tanstack/react-router';
import { getSessionFn } from '@/lib/auth';

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const session = await getSessionFn();

    if (!session.authenticated) {
      throw redirect({ to: '/login' });
    }
  },
});
