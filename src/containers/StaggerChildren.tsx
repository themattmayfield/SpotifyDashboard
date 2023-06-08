'use client';
import { motion } from 'framer-motion';
import React from 'react';

let parent = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const StaggerChildren = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      variants={parent}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default StaggerChildren;
