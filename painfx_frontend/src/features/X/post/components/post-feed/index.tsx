"use client";
import { Spinner } from '@/components/spinner';
import { useGetPostsQuery } from '@/redux/services/booking/postApiSlice';
import React from 'react';
import PostItem from './post-item';
import { NoResult } from '@/components/global/no-results';

const PostsList: React.FC = () => {
  const { data: posts, error, isLoading } = useGetPostsQuery({ page: 1 });

console.log(posts)
  if (isLoading) return <Spinner />;

  
  if (!posts || error || posts.count === 0) {
    return <NoResult message={''} backTo={''}/>;
  }


  return (
    <div>
      {posts.results.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
};
export default PostsList;
