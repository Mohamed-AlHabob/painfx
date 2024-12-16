"use client";
import { Spinner } from '@/components/spinner';
import { useGetPostsQuery } from '@/redux/services/booking/postApiSlice';
import React from 'react';
import ReelItem from './reel-item';
import { motion } from 'framer-motion';
import { NoResult } from '@/components/global/no-results';

const ReelsList: React.FC = () => {
  const { data: posts, error, isLoading } = useGetPostsQuery({ page: 1 });

  if (isLoading) return <Spinner />;

  if (!posts || error || posts.count === 0) {
    return <NoResult message={''} backTo={''}/>;
  }

  return (
     <motion.div
     className="relative min-h-screen overflow-y-auto py-6 px-4"
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     exit={{ opacity: 0 }}
   >
     {posts.results.map((reel) => (
       <ReelItem key={reel.id} reel={reel} />
     ))}
   </motion.div>
  );
};
export default ReelsList;
