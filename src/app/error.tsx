'use client';
export default function Error({ error }: { error: Error }) {
  return (
    <div className="text-white">
      <h1>Error</h1>
      <p>{error.message}</p>
    </div>
  );
}
