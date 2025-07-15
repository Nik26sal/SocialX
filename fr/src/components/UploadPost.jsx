import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { motion } from 'framer-motion';
import { UploadCloud, FileText, ArrowLeftRight, ImagePlus } from 'lucide-react';

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
        navigate('/');
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
      <motion.div
        className="flex flex-col items-center justify-center h-screen w-full bg-white text-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="text-5xl font-extrabold mb-6 animate-pulse">🚀 Welcome</h1>
        <motion.div
          className="bg-gray-800 rounded-lg shadow-xl p-6 w-96 text-center border border-purple-500"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-white">No User Registered Yet...</h2>
          <button
            onClick={handleNavigation}
            className="mt-6 bg-purple-500 px-6 py-3 rounded-lg text-white font-bold hover:bg-purple-600 transition-transform transform hover:scale-105"
          >
            Register or Login
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-screen w-screen bg-gradient-to-tr from-white to-purple-100 text-black p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.h1
        className="text-4xl font-extrabold mb-6 flex items-center gap-2"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <UploadCloud className="w-7 h-7 text-purple-700" />
        Upload New Post
      </motion.h1>

      <motion.form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md border border-purple-400"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-500" />
            Content (or Upload File)
          </label>
          <textarea
            value={Content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-purple-500 bg-white text-black"
            rows="4"
            placeholder="Write something..."
            disabled={mediaURL !== null}
          />
          <div className="mt-2 flex items-center gap-2">
            <ImagePlus className="w-5 h-5 text-purple-500" />
            <input
              type="file"
              onChange={(e) => setMediaURL(e.target.files[0])}
              className="text-sm text-gray-700"
              disabled={Content.trim() !== ''}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2 flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-purple-500" />
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-purple-500 bg-white text-black"
            rows="3"
            placeholder="Add a description..."
          />
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-2 bg-purple-600 text-white font-bold rounded shadow hover:bg-purple-700 transition"
        >
          Upload Post
        </motion.button>
      </motion.form>
    </motion.div>
  );
}

export default UploadPost;
