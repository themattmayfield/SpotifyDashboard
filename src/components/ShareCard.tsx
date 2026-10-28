import { useClientTimeZone } from '@/components/StoredHistory';
import { tasteBreakdown } from '@/lib/insights';
import { getRecap } from '@/lib/persistence';
import { spotifyQueries } from '@/lib/queries';
import {
  type ShareCardData,
  drawShareCard,
  loadCardImage,
} from '@/lib/shareCard';
import type { TTimeRange } from '@/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { Suspense, useEffect, useRef, useState } from 'react';
import { IoClose, IoShareOutline } from 'react-icons/io5';

const labels = {
  short_term: 'Last 4 Weeks',
  medium_term: 'Last 6 Months',
  long_term: 'All Time',
};
export type Card =
  | { variant: 'artists'; range: TTimeRange }
  | { variant: 'tracks'; range: TTimeRange }
  | { variant: 'taste'; range: TTimeRange }
  | { variant: 'recap'; month: string; timeZone?: string };

const spotifyRoute = getRouteApi('/_spotify');

export default function ShareCard({ card }: { card: Card }) {
  const user = spotifyRoute.useLoaderData().name;
  return (
    <Suspense fallback={<ShareButton disabled />}>
      <ShareCardContent card={card} user={user} />
    </Suspense>
  );
}

function ShareCardContent({ card, user }: { card: Card; user: string }) {
  return card.variant === 'artists' ? (
    <ArtistCard range={card.range} user={user} />
  ) : card.variant === 'tracks' ? (
    <TrackCard range={card.range} user={user} />
  ) : card.variant === 'taste' ? (
    <TasteCard range={card.range} user={user} />
  ) : (
    <RecapCard
      month={card.month}
      requestedTimeZone={card.timeZone}
      user={user}
    />
  );
}

function TasteCard({ range, user }: { range: TTimeRange; user: string }) {
  const { data: artists } = useSuspenseQuery(spotifyQueries.topArtists(range));
  const { data: tracks } = useSuspenseQuery(spotifyQueries.topTracks(range));
  const taste = tasteBreakdown(artists, tracks);
  const decades = [...taste.decades].sort((a, b) => b.count - a.count);
  return (
    <CardModal
      data={{
        title: `My Taste — ${labels[range]}`,
        user,
        items: [
          ...taste.genres.slice(0, 3).map((genre) => ({
            name: genre.name,
            subtitle: 'Top genre',
          })),
          ...decades.slice(0, 2).map(({ decade, count }) => ({
            name: `${decade}s`,
            subtitle: `${count} top tracks`,
          })),
        ],
      }}
    />
  );
}

function ArtistCard({ range, user }: { range: TTimeRange; user: string }) {
  const { data } = useSuspenseQuery(spotifyQueries.topArtists(range));
  return (
    <CardModal
      data={{
        title: `My Top Artists — ${labels[range]}`,
        user,
        items: data
          .slice(0, 5)
          .map((x) => ({ name: x.name, imageUrl: x.thumb })),
      }}
    />
  );
}

function TrackCard({ range, user }: { range: TTimeRange; user: string }) {
  const { data } = useSuspenseQuery(spotifyQueries.topTracks(range));
  return (
    <CardModal
      data={{
        title: `My Top Tracks — ${labels[range]}`,
        user,
        items: data.slice(0, 5).map((x) => ({
          name: x.name,
          subtitle: x.artists.map((a) => a.name).join(', '),
          imageUrl: x.thumb,
        })),
      }}
    />
  );
}

function RecapCard({
  month,
  requestedTimeZone,
  user,
}: { month: string; requestedTimeZone?: string; user: string }) {
  const clientTimeZone = useClientTimeZone();
  const timeZone = requestedTimeZone ?? clientTimeZone;
  const { data } = useSuspenseQuery({
    queryKey: ['wrapper', 'recap', month, timeZone],
    queryFn: () => getRecap({ data: { month, timeZone } }),
  });
  const recap = data?.recap;
  return (
    <CardModal
      data={
        recap
          ? {
              title: `My ${month} Recap`,
              user,
              items: [
                {
                  name: `${recap.minutes} minutes listened`,
                  subtitle: `${recap.totalPlays} total plays`,
                },
                {
                  name: recap.topArtists[0]?.name ?? 'None',
                  subtitle: 'Top artist',
                },
                {
                  name: recap.topTracks[0]?.item.name ?? 'None',
                  subtitle: 'Top track',
                  imageUrl: recap.topTracks[0]?.item.image,
                },
                {
                  name: recap.topNewArtist?.name ?? 'None',
                  subtitle: 'Top new artist',
                },
              ],
            }
          : undefined
      }
    />
  );
}

type ModalData = Omit<ShareCardData, 'items'> & {
  items: (Omit<ShareCardData['items'][number], 'image'> & {
    imageUrl?: string | null;
  })[];
};
function CardModal({ data }: { data?: ModalData }) {
  const [open, setOpen] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!open || !canvas.current || !data) return;
    void Promise.all(data.items.map((x) => loadCardImage(x.imageUrl))).then(
      (images) =>
        drawShareCard(
          canvas.current?.getContext('2d') as CanvasRenderingContext2D,
          {
            ...data,
            items: data.items.map(({ imageUrl: _, ...item }, index) => ({
              ...item,
              image: images[index],
            })),
          }
        )
    );
  }, [open, data]);
  const blob = () =>
    new Promise<Blob | null>((resolve) =>
      canvas.current?.toBlob(resolve, 'image/png')
    );
  const download = async () => {
    const value = await blob();
    if (!value) return;
    const url = URL.createObjectURL(value);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'spotify-profile.png';
    anchor.click();
    URL.revokeObjectURL(url);
  };
  const share = async () => {
    const value = await blob();
    if (!value) return;
    const file = new File([value], 'spotify-profile.png', {
      type: 'image/png',
    });
    if (navigator.canShare?.({ files: [file] }))
      await navigator.share({ files: [file] });
    else await download();
  };
  return (
    <>
      <ShareButton disabled={!data} onClick={() => setOpen(true)} />
      {open && (
        <dialog
          open
          className="fixed inset-0 z-[100] m-0 flex h-full max-h-none w-full max-w-none items-center justify-center bg-black/60 p-4 text-label backdrop-blur-md animate-in fade-in-0"
        >
          <div className="relative flex max-h-full w-full max-w-sm flex-col overflow-hidden rounded-[28px] bg-elevated p-4 shadow-[0_30px_80px_rgba(0,0,0,0.7)] ring-1 ring-inset ring-white/10 animate-in zoom-in-95">
            <div className="mb-3 flex items-center justify-between pl-1">
              <h2 className="text-[17px] font-semibold">Share</h2>
              <button
                type="button"
                aria-label="Close"
                className="btn-icon h-8 w-8 bg-fill-strong"
                onClick={() => setOpen(false)}
              >
                <IoClose className="h-4 w-4" />
              </button>
            </div>
            <div className="min-h-0 overflow-auto rounded-2xl">
              <canvas
                ref={canvas}
                width={1080}
                height={1920}
                className="w-full rounded-2xl"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                className="btn-primary col-span-2"
                onClick={share}
              >
                <IoShareOutline className="h-4 w-4" />
                Share
              </button>
              <button
                type="button"
                className={`btn-secondary ${typeof ClipboardItem === 'undefined' ? 'col-span-2' : ''}`}
                onClick={download}
              >
                Download PNG
              </button>
              {typeof ClipboardItem !== 'undefined' && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={async () => {
                    const value = await blob();
                    if (value)
                      await navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': value }),
                      ]);
                  }}
                >
                  Copy image
                </button>
              )}
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}

function ShareButton({
  disabled = false,
  onClick,
}: { disabled?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      className="btn-secondary h-9 px-4 text-[13px]"
      onClick={onClick}
      disabled={disabled}
      aria-busy={disabled}
    >
      <IoShareOutline className="h-4 w-4" />
      Share
    </button>
  );
}
