'use client';

import { motion } from 'framer-motion';
import React from 'react';

let parent = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      variants={parent}
      initial="hidden"
      animate="show"
      className="flex bg-transparent lg:pr-6 lg:pl-2 h-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
