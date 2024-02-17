'use client';

import { followHandler } from './action';

const FollowButton = ({
  isFollowingArtist,
  id,
}: {
  isFollowingArtist: boolean;
  id: string;
}) => {
  return (
    <form action={async () => await followHandler(isFollowingArtist, id)}>
      <button
        type="submit"
        className={`bg-transparent border text-white rounded w-[100px] py-1 cursor-pointer focus:outline-none hover:bg-custom-darkgray transition duration-300 ease-in-out ${
          isFollowingArtist ? 'border-spotify-green' : 'border-custom-gray'
        }`}
      >
        {isFollowingArtist ? 'Following' : `Follow`}
      </button>
    </form>
  );
};

export default FollowButton;
