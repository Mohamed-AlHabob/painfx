"use client";
import { Spinner } from '@/components/spinner';
import { useGetPostsQuery } from '@/redux/services/booking/postApiSlice';
import React from 'react';
import {PostItem} from './post-item';
import { NoResult } from '@/components/global/no-results';

const PostsList: React.FC = () => {
  const { data: posts, error, isLoading,isFetching } = useGetPostsQuery({ page: 1 });

  console.log("posts : ", posts)


  if (isFetching || isLoading) {
    return (
        <PostItem.Skeleton />
    )
  }
  
  if (!posts || error) {
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
