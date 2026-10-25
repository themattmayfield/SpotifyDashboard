import { expect, test } from 'bun:test';
import { sanitizeReturnTo } from './returnTo';

test('only permits simple same-origin return paths', () => {
  expect(sanitizeReturnTo('/compare/invite/abc-123')).toBe(
    '/compare/invite/abc-123'
  );
  for (const value of [
    '//evil.test',
    '/\\evil.test',
    'https://evil.test',
    '/compare?x=1',
    null,
  ])
    expect(sanitizeReturnTo(value)).toBe('/');
});
