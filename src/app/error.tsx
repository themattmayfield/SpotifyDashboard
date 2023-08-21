'use client';
export default function Error({ error }: { error: Error }) {
  return (
    <div className="text-white">
      <h1>Error</h1>
      <p>{JSON.stringify(error)}</p>
    </div>
  );
}
