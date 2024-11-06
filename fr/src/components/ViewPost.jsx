// ViewPost.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

function ViewPost() {
  const [posts, setPosts] = useState([]);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [likes, setLikes] = useState([]);

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:5555/user/getAllPost");
  //       setPosts(response.data); // Set posts from response data
  //       setLikes(response.data.map(post => post.initialLikes)); // Set initial likes
  //     } catch (error) {
  //       console.error('Failed to fetch posts:', error);
  //     }
  //   };

  //   fetchPosts();
  // }, []);

  const handleNextPost = () => {
    if (currentPostIndex < posts.length - 1) {
      setCurrentPostIndex(currentPostIndex + 1);
    }
  };

  const handlePreviousPost = () => {
    if (currentPostIndex > 0) {
      setCurrentPostIndex(currentPostIndex - 1);
    }
  };

  const handleLike = async () => {
    const updatedLikes = [...likes];
    updatedLikes[currentPostIndex] += 1;
    setLikes(updatedLikes);

    // Send the updated likes to the server
    try {
      await fetch(`/api/posts/${posts[currentPostIndex].id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ likes: updatedLikes[currentPostIndex] }),
      });
    } catch (error) {
      console.error('Failed to update likes:', error);
    }
  };

  if (posts.length === 0) {
    return <div>Loading...</div>; // Handle loading state
  }

  const currentPost = posts[currentPostIndex];

  return (
    <div className='h-screen w-screen flex flex-col items-center justify-center bg-gray-100'>
      <button
        onClick={handlePreviousPost}
        disabled={currentPostIndex === 0}
        className={`p-4 mb-4 rounded-full text-2xl font-bold ${currentPostIndex === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg'} transition duration-200`}
      >
        ↑
      </button>

      <div className='w-96 bg-white rounded-lg shadow-lg p-6 flex flex-col items-center'>
        <header className='w-full border-b pb-3 mb-4 text-center'>
          <h2 className='text-xl font-bold text-gray-800'>{currentPost.author}</h2>
        </header>
        <main className='flex-1 text-gray-700 mb-6 text-center'>
          <p>{currentPost.content}</p>
        </main>
        <footer className='w-full'>
          <button
            onClick={handleLike}
            className='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200'
          >
            Likes: {likes[currentPostIndex]}
          </button>
        </footer>
      </div>

      <button
        onClick={handleNextPost}
        disabled={currentPostIndex === posts.length - 1}
        className={`p-4 mt-4 rounded-full text-2xl font-bold ${currentPostIndex === posts.length - 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg'} transition duration-200`}
      >
        ↓
      </button>
    </div>
  );
}

export default ViewPost;
