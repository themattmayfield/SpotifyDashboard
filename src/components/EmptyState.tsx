export function EmptyState({
  message = 'Not enough listening yet — play some music and check back.',
}: { message?: string }) {
  return (
    <p className="col-span-full py-10 text-center text-[14px] text-label-tertiary">
      {message}
    </p>
  );
}
