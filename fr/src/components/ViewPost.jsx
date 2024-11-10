import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router';

function ViewPost() {
  const [posts, setPosts] = useState([]);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const userId = user?._id;

  useEffect(() => {
    if (!userId) return;

    const fetchPosts = async () => {
      try {
        const allPostsResponse = await axios.get("http://localhost:5555/user/getAllPost", { withCredentials: true });
        const likedPostsResponse = await axios.get("http://localhost:5555/user/returnpost", { withCredentials: true });
        console.log('All posts:', allPostsResponse.data);
        console.log('Liked posts:', likedPostsResponse.data);
        const likedPostIds = new Set();
        if (likedPostsResponse.data.likedPosts && likedPostsResponse.data.likedPosts.length > 0) {
          likedPostsResponse.data.likedPosts.forEach(post => {
            likedPostIds.add(post._id);
          });
        }
        const postsData = allPostsResponse.data.post
          .filter(post => post.User._id !== userId) 
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (likedPostIds.size > 0) {
          const updatedPostsData = postsData.map(post => ({
            ...post,
            isLiked: likedPostIds.has(post._id), 
          }));
          setPosts(updatedPostsData);
        } else {
          setPosts(postsData);
        }
        
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        if (error.response && error.response.status === 401) {
          navigate('/sign_in_up');
        }
      }
    };

    fetchPosts();
  }, [userId, navigate]);

  const handleNavigation = () => {
    navigate('/sign_in_up');
  };

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

  const handleLikeToggle = async () => {
    const post = posts[currentPostIndex];
    const endpoint = post.isLiked
      ? `http://localhost:5555/user/unlikepost/${post._id}`
      : `http://localhost:5555/user/likesOnPost/${post._id}`;

    try {
      await axios.post(endpoint, {}, { withCredentials: true });
      
      // Update the post's like status locally
      const updatedPosts = [...posts];
      updatedPosts[currentPostIndex] = {
        ...post,
        isLiked: !post.isLiked,
        Likes: post.isLiked
          ? post.Likes.filter(id => id !== userId) // Remove user ID from likes if unliking
          : [...post.Likes, userId] // Add user ID to likes if liking
      };

      setPosts(updatedPosts);
    } catch (error) {
      console.error(`Failed to ${post.isLiked ? "unlike" : "like"} post:`, error);
      if (error.response && error.response.status === 401) {
        navigate('/sign_in_up'); 
      }
    }
  };

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 w-screen">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <div className="bg-white rounded-lg shadow-lg p-6 w-80">
          <h2 className="text-xl font-semibold">No User Registered Yet...</h2>
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={handleNavigation}
              className="text-blue-500 hover:underline"
            >
              --- Register or Login to the Website ---
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return <div>Loading posts...</div>;
  }

  const currentPost = posts[currentPostIndex];
  const postDate = new Date(currentPost.createdAt);

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
          <h2 className='text-xl font-bold text-gray-800'>UserName: {currentPost.User.Name}</h2>
        </header>
        <main className='flex-1 text-gray-700 mb-6 text-center'>
          <p>{currentPost.Content}</p>
        </main>
        <footer className='w-full'>
          <button
            onClick={handleLikeToggle}
            className={`w-full py-2 rounded-md transition duration-200 ${currentPost.isLiked ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          >
            {currentPost.isLiked ? 'Unlike' : 'Like'}: {currentPost.Likes?.length || 0}
          </button>
        </footer>
        <h2>
          Date: {postDate.toLocaleDateString()} &nbsp;
          Time: {postDate.toLocaleTimeString()}
        </h2>
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
