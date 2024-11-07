import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addPost } from '../features/postSlice';
import axios from 'axios';

function UploadPost() {
  const [Content, setContent] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const post = { Content };

    try {
      const response = await axios.post(
        'http://localhost:5555/user/uploadPost',
        post,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      if (response.status === 201) {
        const newPost = response.data;
        dispatch(addPost(newPost.post)); 
        alert('Post uploaded successfully!');
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
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Upload New Post</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 w-80">
        <div className="mb-4">
          <label htmlFor="Content" className="block text-sm font-bold mb-1">
            Content
          </label>
          <textarea
            id="Content"
            value={Content}
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
