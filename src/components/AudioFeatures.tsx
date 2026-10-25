import {
  type AudioFeatures as TAudioFeatures,
  audioFeatureKeys,
} from '@/types';

const colors = [
  'rgb(255, 99, 132)',
  'rgb(255, 159, 64)',
  'rgb(255, 206, 86)',
  'rgb(75, 192, 192)',
  'rgb(54, 162, 235)',
  'rgb(104, 132, 245)',
  'rgb(153, 102, 255)',
];

export function AudioFeatures({ features }: { features: TAudioFeatures }) {
  return (
    <dl className="grid w-full max-w-xl gap-3">
      {audioFeatureKeys.map((key, index) => {
        const percent = Math.round(features[key] * 100);
        return (
          <div
            key={key}
            className="grid grid-cols-[8.5rem_1fr_3rem] items-center gap-3"
          >
            <dt className="capitalize text-custom-muted">{key}</dt>
            <dd className="h-2 overflow-hidden rounded-full bg-custom-darkgray">
              <div
                className="h-full rounded-full"
                style={{ width: `${percent}%`, backgroundColor: colors[index] }}
              />
            </dd>
            <dd className="text-right text-sm tabular-nums text-white">
              {percent}%
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
