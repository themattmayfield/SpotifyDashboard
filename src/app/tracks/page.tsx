import handleServerSession from '@/lib/handleServerSession';
import spotifyApi from '@/lib/spotify';
import TermSelect from '@/components/Tracks/TermSelect';

export default async function Tracks() {
  handleServerSession();

  const { body: topTracks_LONG } = await spotifyApi.getMyTopTracks({
    limit: 50,
    time_range: 'long_term',
  });
  const { body: topTracks_MEDIUM } = await spotifyApi.getMyTopTracks({
    limit: 50,
    time_range: 'medium_term',
  });
  const { body: topTracks_SHORT } = await spotifyApi.getMyTopTracks({
    limit: 50,
    time_range: 'short_term',
  });

  return (
    <>
      <TermSelect
        long_term={topTracks_LONG.items}
        medium_term={topTracks_MEDIUM.items}
        short_term={topTracks_SHORT.items}
      />
    </>
  );
}
