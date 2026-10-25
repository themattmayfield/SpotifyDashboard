import { useClientTimeZone } from '@/components/StoredHistory';
import { getRecap } from '@/lib/persistence';
import { spotifyQueries } from '@/lib/queries';
import {
  type ShareCardData,
  drawShareCard,
  loadCardImage,
} from '@/lib/shareCard';
import type { TTimeRange } from '@/types';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

const labels = {
  short_term: 'Last 4 Weeks',
  medium_term: 'Last 6 Months',
  long_term: 'All Time',
};
export type Card =
  | { variant: 'artists'; range: TTimeRange }
  | { variant: 'tracks'; range: TTimeRange }
  | { variant: 'recap'; month: string; timeZone?: string };

export default function ShareCard({ card }: { card: Card }) {
  return card.variant === 'artists' ? (
    <ArtistCard range={card.range} />
  ) : card.variant === 'tracks' ? (
    <TrackCard range={card.range} />
  ) : (
    <RecapCard month={card.month} requestedTimeZone={card.timeZone} />
  );
}

function ArtistCard({ range }: { range: TTimeRange }) {
  const { data: me } = useSuspenseQuery(spotifyQueries.me());
  const { data } = useSuspenseQuery(spotifyQueries.topArtists(range));
  return (
    <CardModal
      data={{
        title: `My Top Artists — ${labels[range]}`,
        user: me.name,
        items: data
          .slice(0, 5)
          .map((x) => ({ name: x.name, imageUrl: x.thumb })),
      }}
    />
  );
}

function TrackCard({ range }: { range: TTimeRange }) {
  const { data: me } = useSuspenseQuery(spotifyQueries.me());
  const { data } = useSuspenseQuery(spotifyQueries.topTracks(range));
  return (
    <CardModal
      data={{
        title: `My Top Tracks — ${labels[range]}`,
        user: me.name,
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
}: { month: string; requestedTimeZone?: string }) {
  const clientTimeZone = useClientTimeZone();
  const timeZone = requestedTimeZone ?? clientTimeZone;
  const { data: me } = useSuspenseQuery(spotifyQueries.me());
  const { data } = useQuery({
    queryKey: ['wrapper', 'recap', month, timeZone],
    queryFn: () => getRecap({ data: { month, timeZone } }),
  });
  if (!data?.recap) return null;
  const recap = data.recap;
  return (
    <CardModal
      data={{
        title: `My ${month} Recap`,
        user: me.name,
        items: [
          {
            name: `${recap.minutes} minutes listened`,
            subtitle: `${recap.totalPlays} total plays`,
          },
          { name: recap.topArtists[0]?.name ?? 'None', subtitle: 'Top artist' },
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
      }}
    />
  );
}

type ModalData = Omit<ShareCardData, 'items'> & {
  items: (Omit<ShareCardData['items'][number], 'image'> & {
    imageUrl?: string | null;
  })[];
};
function CardModal({ data }: { data: ModalData }) {
  const [open, setOpen] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!open || !canvas.current) return;
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
      <button
        type="button"
        className="rounded-full border border-white px-4 py-2 text-white"
        onClick={() => setOpen(true)}
      >
        Share
      </button>
      {open && (
        <dialog
          open
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
        >
          <div className="max-h-full max-w-md overflow-auto rounded-xl bg-custom-darkgray p-4">
            <canvas
              ref={canvas}
              width={1080}
              height={1920}
              className="w-full"
            />
            <div className="mt-3 flex flex-wrap gap-3">
              <button type="button" onClick={share}>
                Share
              </button>
              <button type="button" onClick={download}>
                Download PNG
              </button>
              {typeof ClipboardItem !== 'undefined' && (
                <button
                  type="button"
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
              <button type="button" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
