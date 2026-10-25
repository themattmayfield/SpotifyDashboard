import { getComparison } from '@/lib/compare';
import { createFileRoute, notFound } from '@tanstack/react-router';

export const Route = createFileRoute('/_spotify/compare/$friendId')({
  loader: async ({ params }) => {
    const result = await getComparison({ data: params.friendId });
    if (!result) throw notFound();
    return result;
  },
  component: Comparison,
});
function Comparison() {
  const data = Route.useLoaderData();
  const label =
    data.score >= 80
      ? 'Musical soulmates'
      : data.score >= 60
        ? 'Same wavelength'
        : data.score >= 35
          ? 'Some shared favorites'
          : 'Taste explorers';
  const ranges = Object.keys(data.mine);
  return (
    <main className="p-6 text-white md:p-10">
      <div className="text-center">
        <div className="mb-6 flex items-center justify-center gap-8">
          <Person image={data.me.image} name={data.me.name} />
          <span className="text-2xl text-custom-muted">&amp;</span>
          <Person
            image={data.friend?.image}
            name={data.friend?.displayName ?? 'Friend'}
          />
        </div>
        <h1 className="text-5xl font-bold text-spotify-green">{data.score}%</h1>
        <p className="text-xl">{label}</p>
      </div>
      <div className="mt-10 grid gap-8">
        {ranges.map((range) => (
          <Range
            key={range}
            title={range.replace('_', ' ')}
            mine={data.mine[range]}
            theirs={data.theirs[range]}
          />
        ))}
      </div>
    </main>
  );
}
function Person({ image, name }: { image?: string | null; name: string }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2">
      <img
        src={image ?? undefined}
        alt=""
        className="h-24 w-24 rounded-full bg-custom-gray object-cover"
      />
      <strong className="max-w-32 truncate">{name}</strong>
    </div>
  );
}
function Range({
  title,
  mine,
  theirs,
}: {
  title: string;
  mine: {
    artists: { id: string; name: string }[];
    tracks: { id: string; name: string }[];
  };
  theirs?: {
    artists: { id: string; name: string }[];
    tracks: { id: string; name: string }[];
  };
}) {
  const sharedArtists = mine.artists.filter((x) =>
    theirs?.artists.some((y) => y.id === x.id)
  );
  const sharedTracks = mine.tracks.filter((x) =>
    theirs?.tracks.some((y) => y.id === x.id)
  );
  const onlyMine = mine.artists
    .filter((x) => !theirs?.artists.some((y) => y.id === x.id))
    .slice(0, 5);
  const onlyTheirs = (theirs?.artists ?? [])
    .filter((x) => !mine.artists.some((y) => y.id === x.id))
    .slice(0, 5);
  return (
    <section className="rounded-xl bg-custom-darkgray p-5">
      <h2 className="mb-4 text-xl capitalize">{title}</h2>
      <h3 className="text-spotify-green">Shared top artists</h3>
      <ol className="mt-2 grid gap-2 md:grid-cols-2">
        {sharedArtists.map((x) => (
          <li key={x.id}>
            {x.name}{' '}
            <span className="text-custom-muted">
              #{mine.artists.findIndex((y) => y.id === x.id) + 1} / #
              {(theirs?.artists.findIndex((y) => y.id === x.id) ?? -1) + 1}
            </span>
          </li>
        ))}
      </ol>
      <h3 className="mt-6 text-spotify-green">Shared top tracks</h3>
      <ol className="mt-2 grid gap-2 md:grid-cols-2">
        {sharedTracks.map((x) => (
          <li key={x.id}>
            {x.name}{' '}
            <span className="text-custom-muted">
              #{mine.tracks.findIndex((y) => y.id === x.id) + 1} / #
              {(theirs?.tracks.findIndex((y) => y.id === x.id) ?? -1) + 1}
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <ArtistList title="Only you" items={onlyMine} />
        <ArtistList title="Only them" items={onlyTheirs} />
      </div>
    </section>
  );
}
function ArtistList({
  title,
  items,
}: { title: string; items: { id: string; name: string }[] }) {
  return (
    <div>
      <h3 className="text-spotify-green">{title}</h3>
      <ol className="mt-2 space-y-1">
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ol>
    </div>
  );
}
