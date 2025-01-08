'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from 'lucide-react';
import { usePosts } from '@/hooks/Social/post';
import {
  useGetPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} from "@/redux/services/booking/postApiSlice";

export default function PostContent() {
  const [createPost, { isLoading }] = useCreatePostMutation();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<number[]>([]);
  const [mediaAttachments, setMediaAttachments] = useState<{ media_type: string; file?: File; url?: string }[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const postData: CreatePostRequest = {
      title,
      content,
      tags,
      media_attachments: mediaAttachments,
    };

    try {
      await createPost(postData).unwrap();
      // Clear the form after successful submission
      setTitle('');
      setContent('');
      setTags([]);
      setMediaAttachments([]);
      alert('Post created successfully!');
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="tags">Tags (comma-separated IDs):</label>
        <input
          type="text"
          id="tags"
          value={tags.join(',')}
          onChange={(e) => setTags(e.target.value.split(',').map(Number))}
        />
      </div>
      <div>
        <label htmlFor="media_attachments">Media Attachments:</label>
        <input
          type="file"
          id="media_attachments"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            setMediaAttachments(files.map(file => ({ media_type: 'image', file })));
          }}
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
};

