import { BarChart, Bar, Cell, Tooltip, ResponsiveContainer } from 'recharts';
const properties = [
  'acousticness',
  'danceability',
  'energy',
  'instrumentalness',
  'liveness',
  'speechiness',
  'valence',
] as const;
const colors = [
  'rgba(255, 99, 132, 0.3)',
  'rgba(255, 159, 64, 0.3)',
  'rgba(255, 206, 86, 0.3)',
  'rgba(75, 192, 192, 0.3)',
  'rgba(54, 162, 235, 0.3)',
  'rgba(104, 132, 245, 0.3)',
  'rgba(153, 102, 255, 0.3)',
];
export default function AudioFeaturesChart({
  features,
}: { features: SpotifyApi.AudioFeaturesResponse }) {
  const data = properties
    .map((label, index) => ({
      label,
      value: features[label],
      color: colors[index],
    }))
    .filter((x) => x.value !== 0);
  return (
    <ResponsiveContainer width={400} height={100}>
      <BarChart data={data}>
        <Tooltip />
        <Bar dataKey="value">
          {data.map((entry) => (
            <Cell fill={entry.color} key={entry.label} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
