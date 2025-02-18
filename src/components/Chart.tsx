// @ts-nocheck
'use client';

import { Bar } from 'react-chartjs-2';

const properties = [
  'acousticness',
  'danceability',
  'energy',
  'instrumentalness',
  'liveness',
  'speechiness',
  'valence',
];

const MyChart = ({ features }) => {
  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

  const createDataset = () => {
    const dataset = {};
    properties.forEach((prop) => {
      dataset[prop] = features.length
        ? avg(features.map((feat) => feat?.[prop]))
        : features[prop];
    });
    return dataset;
  };

  const labels = Object.keys(createDataset());
  const datas = Object.values(createDataset());

  const data = {
    labels,
    datasets: [
      {
        label: '',
        data: datas,
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
      },
    ],
  };
  // const options = {
  //   layout: {
  //     padding: {
  //       left: 0,
  //       right: 0,
  //       top: 0,
  //       bottom: 0,
  //     },
  //   },
  //   title: {
  //     display: true,
  //     text: `Audio Features`,
  //     fontSize: 18,
  //     // fontFamily: `${fonts.primary}`,
  //     fontColor: '#ffffff',
  //     padding: 30,
  //   },
  //   legend: {
  //     display: false,
  //   },
  //   scales: {
  //     xAxes: [
  //       {
  //         gridLines: {
  //           color: 'rgba(255, 255, 255, 0.3)',
  //         },
  //         ticks: {
  //           // fontFamily: `${fonts.primary}`,
  //           fontSize: 12,
  //         },
  //       },
  //     ],
  //     yAxes: [
  //       {
  //         gridLines: {
  //           color: 'rgba(255, 255, 255, 0.3)',
  //         },
  //         ticks: {
  //           beginAtZero: true,
  //           // fontFamily: `${fonts.primary}`,
  //           fontSize: 12,
  //         },
  //       },
  //     ],
  //   },
  // };

  return <Bar id="chart" data={data} width="400" height="400" />;
};

export default MyChart;
