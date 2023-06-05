'use client';
import dynamic from 'next/dynamic';

const LoadingComponent = dynamic(() => import('@/components/Loading'), {
  ssr: false,
});

export default function Loading() {
  return <LoadingComponent />;
}
