'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from 'lucide-react';
import { usePosts } from '@/hooks/Social/post';
import {
  useCreatePostMutation,
  CreatePostRequest,
} from "@/redux/services/booking/postApiSlice";

export default function PostContent() {
  const [createPost, { isLoading }] = useCreatePostMutation();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const postData = {
      title,
      content,
      tags: tags.map((tag) => ({ name: tag })),
      media_attachments: mediaFiles.map((file) => ({
        media_type: file.type.startsWith('image') ? 'image' : 'video',
        file,
        url: undefined,
      })),
    };

    try {
      await createPost(postData).unwrap();
      setTitle('');
      setContent('');
      setTags([]);
      setMediaFiles([]);
      alert('Post created successfully!');
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post.');
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      setTags([...tags, e.currentTarget.value.trim()]);
      e.currentTarget.value = '';
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setMediaFiles([...mediaFiles, ...files]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
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
      <label htmlFor="tags">Tags:</label>
      <input
        type="text"
        id="tags"
        placeholder="Add a tag and press Enter"
        onKeyDown={handleAddTag}
      />
      <div>
        {tags.map((tag, index) => (
          <div key={index}>
            <span>{tag}</span>
            <button type="button" onClick={() => handleRemoveTag(index)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>

    <div>
      <label htmlFor="media_attachments">Media Attachments:</label>
      <input
        type="file"
        id="media_attachments"
        multiple
        onChange={handleFileChange}
      />
      <div>
        {mediaFiles.map((file, index) => (
          <div key={index}>
            <span>{file.name}</span>
            <button type="button" onClick={() => handleRemoveFile(index)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>

    <button type="submit" disabled={isLoading}>
      {isLoading ? 'Creating...' : 'Create Post'}
    </button>
  </form>
  );
};

