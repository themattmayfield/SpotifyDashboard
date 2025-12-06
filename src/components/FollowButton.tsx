// src/components/FollowButton.tsx
import { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { followArtistFn, unfollowArtistFn } from '@/lib/actions.server';

interface FollowButtonProps {
  artistId: string;
  isFollowing: boolean;
}

export function FollowButton({
  artistId,
  isFollowing: initialIsFollowing,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setIsLoading(true);
    try {
      if (isFollowing) {
        await unfollowArtistFn({ data: { artistId } });
        setIsFollowing(false);
      } else {
        await followArtistFn({ data: { artistId } });
        setIsFollowing(true);
      }
      // Invalidate the route to refresh data
      router.invalidate();
    } catch (error) {
      console.error('Failed to update follow status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={`bg-transparent border text-white rounded w-[100px] py-1 cursor-pointer focus:outline-none hover:bg-custom-darkgray transition duration-300 ease-in-out ${
        isFollowing ? 'border-spotify-green' : 'border-custom-gray'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? '...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}
