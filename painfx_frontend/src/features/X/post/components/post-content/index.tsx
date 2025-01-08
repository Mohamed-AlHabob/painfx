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

  // State for form fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]); // Array of tag names
  const [mediaFiles, setMediaFiles] = useState<File[]>([]); // Array of files for media attachments

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the payload
    const postData = {
      title,
      content,
      tags: tags.map((tag) => ({ name: tag })), // Convert tag names to objects
      media_attachments: mediaFiles.map((file) => ({
        media_type: file.type.startsWith('image') ? 'image' : 'video', // Determine media type
        file, // Include the file
        url: undefined, // URL is not needed when uploading files
      })),
    };

    try {
      // Call the createPost mutation
      await createPost(postData).unwrap();
      // Clear the form after successful submission
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

  // Handle adding tags
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      setTags([...tags, e.currentTarget.value.trim()]);
      e.currentTarget.value = ''; // Clear the input
    }
  };

  // Handle removing tags
  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // Handle file uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setMediaFiles([...mediaFiles, ...files]);
    }
  };

  // Handle removing files
  const handleRemoveFile = (index: number) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit}>
    {/* Title Field */}
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

    {/* Content Field */}
    <div>
      <label htmlFor="content">Content:</label>
      <textarea
        id="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
    </div>

    {/* Tags Field */}
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

    {/* Media Attachments Field */}
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

    {/* Submit Button */}
    <button type="submit" disabled={isLoading}>
      {isLoading ? 'Creating...' : 'Create Post'}
    </button>
  </form>
  );
};

