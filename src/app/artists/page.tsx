import handleServerSession from '@/lib/handleServerSession';
import spotifyApi from '@/lib/spotify';
import TermSelect from '@/components/Artists/termSelect';

export default async function Artists() {
  handleServerSession();

  const { body: topArtists_LONG } = await spotifyApi.getMyTopArtists({
    limit: 50,
    time_range: 'long_term',
  });
  const { body: topArtists_MEDIUM } = await spotifyApi.getMyTopArtists({
    limit: 50,
    time_range: 'medium_term',
  });
  const { body: topArtists_SHORT } = await spotifyApi.getMyTopArtists({
    limit: 50,
    time_range: 'short_term',
  });

  return (
    <>
      <TermSelect
        long_term={topArtists_LONG.items}
        medium_term={topArtists_MEDIUM.items}
        short_term={topArtists_SHORT.items}
      />
    </>
  );
}
