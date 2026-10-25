const safePath = /^\/[A-Za-z0-9/_-]*$/;

export function sanitizeReturnTo(value: unknown) {
  return typeof value === 'string' &&
    safePath.test(value) &&
    !value.startsWith('//') &&
    !value.startsWith('/\\')
    ? value
    : '/';
}
