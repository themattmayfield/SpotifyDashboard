'use client';
import { motion } from 'framer-motion';

function AnimatedBars() {
  const motions = [
    {
      animate: {
        transform: [
          'scaleY(1.0) translateY(0rem)',
          'scaleY(1.5) translateY(-0.082rem)',
          'scaleY(1.0) translateY(0rem)',
        ],
      },
      transition: { duration: 1, repeat: Infinity },
    },
    {
      animate: {
        transform: [
          'scaleY(1.0) translateY(0rem)',
          'scaleY(3) translateY(-0.083rem)',
          'scaleY(1.0) translateY(0rem)',
        ],
      },
      transition: { delay: 0.2, duration: 1.5, repeat: Infinity },
    },
    {
      animate: {
        transform: [
          'scaleY(1.0)  translateY(0rem)',
          'scaleY(0.5) translateY(0.37rem)',
          'scaleY(1.0)  translateY(0rem)',
        ],
      },
      transition: { delay: 0.3, duration: 1.5, repeat: Infinity },
    },
  ];
  return (
    <div className="flex justify-center items-center w-full h-[90vh]">
      <div className="flex justify-center items-end space-x-[3px] overflow-hidden w-[100px] min-w-[100px] h-[50px] my-0 mx-auto z-20 relative left-0 right-0">
        {motions.map((bar, index) => (
          <motion.span
            key={index}
            {...bar}
            className="w-2.5 h-5 ease-in-out bg-[#383838]"
          />
        ))}
      </div>
    </div>
  );
}
export default AnimatedBars;
