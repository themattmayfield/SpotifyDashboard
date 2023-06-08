'use client';

import React, { experimental_useOptimistic } from 'react';
import followHandler from '@/components/Artist/followHandler';

const FollowButton = ({
  isFollowingArtist,
  id,
}: {
  isFollowingArtist: boolean;
  id: string;
}) => {
  const [optimisticMessages, addOptimisticMessage] = experimental_useOptimistic(
    isFollowingArtist,
    (state, newMessage) => newMessage
  );

  return (
    <>
      <button
        onClick={async () => {
          addOptimisticMessage(
            optimisticMessages ? !optimisticMessages : optimisticMessages
          );
          await followHandler({
            isFollowingArtist,
            id,
          });
        }}
        className={`bg-transparent border text-white rounded px-4 py-1 cursor-pointer focus:outline-none hover:bg-custom-darkgray transition duration-300 ease-in-out ${
          optimisticMessages ? 'border-white' : 'border-gray-900'
        }`}
      >
        {optimisticMessages ? 'Following' : `Follow`}
      </button>
    </>
  );
};

export default FollowButton;
