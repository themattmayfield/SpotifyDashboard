export function EmptyState({
  message = 'Not enough listening yet — play some music and check back.',
}: { message?: string }) {
  return (
    <p className="col-span-full py-8 text-center text-sm text-custom-muted">
      {message}
    </p>
  );
}
