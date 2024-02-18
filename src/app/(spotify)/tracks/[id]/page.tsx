import { getAudioFeaturesForTrack, getTrack } from '@/lib/spotify';
import { getYear } from '@/lib/time';

// import { Legend, Tooltip } from 'chart.js';
// import { Bar } from 'react-chartjs-2';
// import { BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import Test from './Test';

const Track = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [track, audioFeatures] = await Promise.all([
    getTrack(id),
    getAudioFeaturesForTrack(id),
  ]);

  return (
    <>
      <div className="no-scrollbar overflow-x-hidden max-w-7xl px-2 md:px-4 pt-10 md:pt-12 pb-24 flex flex-col items-center mb-[150px]">
        <div className="max-auto flex flex-col items-center md:flex-row text-[#565656] md:space-x-8">
          <img
            className="w-48 h-48 md:w-72 md:h-72"
            src={track.album.images[0].url}
            alt="Album Artwork"
          />
          <div className="flex flex-col space-y-1 md:space-y-3 text-center md:text-left">
            <p className="text-white text-3xl md:text-5xl mt-3 md:mt-0">
              {track.name}
            </p>
            <div className="md:text-2xl">
              {track.artists &&
                track.artists.map(({ name }, i) => (
                  <span key={i}>
                    {name}
                    {track.artists.length > 0 && i === track.artists.length - 1
                      ? ''
                      : ','}
                    &nbsp;
                  </span>
                ))}
            </div>
            <div className="md:text-lg">
              <a
                href={track.album.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
              >
                {track.album.name}
              </a>{' '}
              &middot; {getYear(track.album.release_date)}
            </div>
          </div>
        </div>

        <div className="w-400 h-[800px] mt-6">
          <Test features={audioFeatures} />
        </div>
      </div>
    </>
  );
};

export default Track;
