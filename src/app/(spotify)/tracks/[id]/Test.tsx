'use client';

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Text,
  Label,
} from 'recharts';
const properties = [
  'acousticness',
  'danceability',
  'energy',
  'instrumentalness',
  'liveness',
  'speechiness',
  'valence',
] as const;

const colors = {
  backgroundColor: [
    'rgba(255, 99, 132, 0.3)',
    'rgba(255, 159, 64, 0.3)',
    'rgba(255, 206, 86, 0.3)',
    'rgba(75, 192, 192, 0.3)',
    'rgba(54, 162, 235, 0.3)',
    'rgba(104, 132, 245, 0.3)',
    'rgba(153, 102, 255, 0.3)',
  ],
  borderColor: [
    'rgba(255,99,132,1)',
    'rgba(255, 159, 64, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(104, 132, 245, 1)',
    'rgba(153, 102, 255, 1)',
  ],
  borderWidth: 1,
};
const Test = ({
  features,
}: {
  features: SpotifyApi.AudioFeaturesResponse | any;
}) => {
  const avg = (arr: any) =>
    arr.reduce((a: number, b: number) => a + b, 0) / arr.length;
  console.log(features);

  const createDataset = () => {
    const dataset = {} as Record<(typeof properties)[number], any>;
    properties.forEach((prop: (typeof properties)[number]) => {
      dataset[prop] = features?.length
        ? avg(features.map((feat: any) => feat && feat[prop]))
        : features[prop];
    });
    return dataset;
  };

  const labels = Object.keys(createDataset());
  const datas = Object.values(createDataset());
  const entries = Object.entries(createDataset());
  console.log(entries);

  const data = entries
    .map(([label, value], index) => {
      return {
        label,
        value,
        color: colors.backgroundColor[index],
      };
    })
    .filter(({ value }) => value !== 0);

  return (
    <ResponsiveContainer width={400} height={100}>
      <BarChart data={data}>
        <Tooltip />

        <Bar dataKey="value">
          {data.map((entry, index) => (
            <Cell fill={entry.color} key={`cell-${index}`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Test;
