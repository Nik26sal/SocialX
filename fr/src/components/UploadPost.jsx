// UploadPost.jsx
import { useState } from 'react';

function UploadPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const post = { title, content };

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      });
      if (response.ok) {
        alert('Post uploaded successfully!');
        setTitle('');
        setContent('');
      } else {
        throw new Error('Failed to upload post');
      }
    } catch (error) {
      console.error(error);
      alert('Error uploading post');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen  bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Upload New Post</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 w-80">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-bold mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-bold mb-1">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-blue-500"
            rows="5"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-bold rounded shadow hover:bg-blue-700 transition duration-200"
        >
          Upload Post
        </button>
      </form>
    </div>
  );
}

export default UploadPost;
