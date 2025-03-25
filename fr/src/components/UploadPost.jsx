import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import axios from 'axios';

function UploadPost() {
  const [Content, setContent] = useState('');
  const [mediaURL, setMediaURL] = useState(null);
  const [description, setDescription] = useState('');
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const handleNavigation = () => navigate('/sign_in_up');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
  
    if (mediaURL) {
      formData.append('mediaURL', mediaURL); 
    } else {
      formData.append('Content', Content);
    }
  
    formData.append('description', description);
  
    try {
      console.log(formData);
      const response = await axios.post(
        'http://localhost:5555/post/uploadPost',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );
  
      if (response.status === 201) {
        alert('Post uploaded successfully!');
        setContent('');
        setMediaURL(null);
        setDescription('');
      } else {
        throw new Error('Failed to upload post');
      }
    } catch (error) {
      console.error(error);
      alert('Error uploading post');
    }
  };
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white text-black">
        <h1 className="text-5xl font-extrabold mb-6 animate-pulse">🚀 Welcome</h1>
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-96 text-center border border-purple-500">
          <h2 className="text-2xl font-semibold">No User Registered Yet...</h2>
          <button onClick={handleNavigation} className="mt-6 bg-purple-500 px-6 py-3 rounded-lg text-white font-bold hover:bg-purple-600 transition-transform transform hover:scale-105">
            Register or Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-white text-black p-6">
      <h1 className="text-3xl font-extrabold mb-6">Upload New Post 🚀</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-6 w-96 border border-purple-500">
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Content (or Upload File)</label>
          <textarea
            value={Content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-purple-500 bg-white text-black"
            rows="4"
            placeholder="Write something..."
            disabled={mediaURL !== null}
          />
          <input
            type="file"
            onChange={(e) => setMediaURL(e.target.files[0])}
            className="mt-2 w-full text-sm text-gray-300"
            disabled={Content.trim() !== ''}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-purple-500 bg-white text-black"
            rows="3"
            placeholder="Add a description..."
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-purple-600 text-white font-bold rounded shadow hover:bg-purple-700 transition duration-200 transform hover:scale-105"
        >
          Upload Post
        </button>
      </form>
    </div>
  );
}

export default UploadPost;
