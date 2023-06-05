'use client';

import { TTimeRange } from '@/types';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../Card';

const classes = {
  active: 'border-b border-white',
  inactive: 'border-b border-transparent',
};

let parent = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const TermSelect = ({ long_term, short_term, medium_term }: any) => {
  const [activeRange, setActiveRange] = useState<{
    term: TTimeRange;
    data: any;
  }>({
    term: 'long_term',
    data: long_term,
  });

  const terms = [
    {
      action: () =>
        setActiveRange({
          term: 'long_term',
          data: long_term,
        }),
      range: 'long_term',
      text: 'All Time',
    },
    {
      action: () =>
        setActiveRange({
          term: 'medium_term',
          data: medium_term,
        }),
      range: 'medium_term',
      text: 'Last 6 Months',
    },
    {
      action: () =>
        setActiveRange({
          term: 'short_term',
          data: short_term,
        }),
      range: 'short_term',
      text: 'Last 4 Weeks',
    },
  ];

  return (
    <>
      <div className="max-w-5xl mx-auto px-2 md:px-4 no-scrollbar pt-10 md:pt-24">
        <div className="bg-black w-full text-white pb-10 select-none flex flex-col md:flex-row items-center justify-between space-y-2">
          <div>
            <p className="text-2xl font-semibold">Top Artists</p>
          </div>

          <div className="flex items-center justify-center space-x-4">
            {terms.map(({ text, action, range }) => (
              <p
                onClick={action}
                className={
                  'cursor-pointer ' +
                  (activeRange.term == range
                    ? classes.active
                    : classes.inactive)
                }
              >
                {text}
              </p>
            ))}
          </div>
        </div>

        <motion.div
          variants={parent}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-3 gap-y-2 md:gap-6 no-scrollbar mb-[100px]"
        >
          {activeRange.data.map((item, index) => (
            <Card key={index} info={item} />
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default TermSelect;
