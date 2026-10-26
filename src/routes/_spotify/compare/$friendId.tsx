import { getComparison } from '@/lib/compare';
import { createFileRoute, notFound } from '@tanstack/react-router';

import { PageWrapper } from '@/components/PageWrapper';

const subheadClassName =
  'text-[12px] font-semibold uppercase tracking-[0.06em] text-label-tertiary';

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
    <PageWrapper className="max-w-5xl">
      <div className="card relative overflow-hidden px-6 py-12 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.1),transparent_65%)]" />
        <div className="relative mb-8 flex items-center justify-center">
          <Person image={data.me.image} name={data.me.name} />
          <Person
            image={data.friend?.image}
            name={data.friend?.displayName ?? 'Friend'}
            overlap
          />
        </div>
        <h1 className="relative text-[64px] font-light leading-none tracking-[-0.04em] tabular-nums md:text-[88px]">
          {data.score}%
        </h1>
        <p className="relative mt-3 text-[17px] font-medium text-label-secondary">
          {label}
        </p>
        <p className="relative mt-1 text-[13px] text-label-tertiary">
          {data.me.name} &amp; {data.friend?.displayName ?? 'Friend'}
        </p>
      </div>
      <div className="mt-10 grid gap-10">
        {ranges.map((range) => (
          <Range
            key={range}
            title={range.replace('_', ' ')}
            mine={data.mine[range]}
            theirs={data.theirs[range]}
          />
        ))}
      </div>
    </PageWrapper>
  );
}
function Person({
  image,
  name,
  overlap,
}: { image?: string | null; name: string; overlap?: boolean }) {
  return (
    <img
      src={image ?? undefined}
      alt={name}
      title={name}
      className={`h-20 w-20 rounded-full bg-elevated object-cover ring-4 ring-[#111] md:h-24 md:w-24 ${overlap ? '-ml-4' : ''}`}
    />
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
    <section>
      <h2 className="section-title mb-3 capitalize">{title}</h2>
      <div className="card space-y-6 p-5">
        <h3 className={subheadClassName}>Shared top artists</h3>
        <ol className="-mt-4 grid gap-x-6 gap-y-2 text-[15px] md:grid-cols-2">
          {sharedArtists.map((x) => (
            <li key={x.id}>
              {x.name}{' '}
              <span className="text-[13px] tabular-nums text-label-tertiary">
                #{mine.artists.findIndex((y) => y.id === x.id) + 1} / #
                {(theirs?.artists.findIndex((y) => y.id === x.id) ?? -1) + 1}
              </span>
            </li>
          ))}
        </ol>
        <h3 className={subheadClassName}>Shared top tracks</h3>
        <ol className="-mt-4 grid gap-x-6 gap-y-2 text-[15px] md:grid-cols-2">
          {sharedTracks.map((x) => (
            <li key={x.id}>
              {x.name}{' '}
              <span className="text-[13px] tabular-nums text-label-tertiary">
                #{mine.tracks.findIndex((y) => y.id === x.id) + 1} / #
                {(theirs?.tracks.findIndex((y) => y.id === x.id) ?? -1) + 1}
              </span>
            </li>
          ))}
        </ol>
        <div className="grid gap-6 border-t border-separator pt-6 md:grid-cols-2">
          <ArtistList title="Only you" items={onlyMine} />
          <ArtistList title="Only them" items={onlyTheirs} />
        </div>
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
      <h3 className={subheadClassName}>{title}</h3>
      <ol className="mt-2 space-y-1.5 text-[15px]">
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ol>
    </div>
  );
}
