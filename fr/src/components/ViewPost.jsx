import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios, { all } from 'axios';
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
        const allPostsResponse = await axios.get("http://localhost:5555/post/getAllPost", { withCredentials: true });
        const likedPostsResponse = await axios.get("http://localhost:5555/like/returnpost", { withCredentials: true });
        console.log(allPostsResponse)
        const likedPostIds = new Set(likedPostsResponse.data.likedPosts?.map(post => post._id) || []);
        
        const postsData = allPostsResponse.data.post
          .filter(post => post.User._id !== userId)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map(post => ({ ...post, isLiked: likedPostIds.has(post._id) }));

        setPosts(postsData);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        if (error.response?.status === 401) navigate('/sign_in_up');
      }
    };

    fetchPosts();
  }, [userId, navigate]);

  const handleNavigation = () => navigate('/sign_in_up');

  const handleNextPost = () => {
    if (currentPostIndex < posts.length - 1) setCurrentPostIndex(currentPostIndex + 1);
  };

  const handlePreviousPost = () => {
    if (currentPostIndex > 0) setCurrentPostIndex(currentPostIndex - 1);
  };

  const handleLikeToggle = async () => {
    const post = posts[currentPostIndex];
    const endpoint = post.isLiked
      ? `http://localhost:5555/like/unlikepost/${post._id}`
      : `http://localhost:5555/like/likesOnPost/${post._id}`;

    try {
      await axios.post(endpoint, {}, { withCredentials: true });
      setPosts(posts.map((p, index) =>
        index === currentPostIndex ? { ...p, isLiked: !p.isLiked, Likes: p.isLiked ? p.Likes.filter(id => id !== userId) : [...p.Likes, userId] } : p
      ));
    } catch (error) {
      console.error(`Failed to ${post.isLiked ? "unlike" : "like"} post:`, error);
      if (error.response?.status === 401) navigate('/sign_in_up');
    }
  };

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 w-screen">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <div className="bg-white rounded-lg shadow-lg p-6 w-80">
          <h2 className="text-xl font-semibold">No User Registered Yet...</h2>
          <button onClick={handleNavigation} className="text-blue-500 hover:underline mt-4">Register or Login</button>
        </div>
      </div>
    );
  }

  if (posts.length === 0) return <div>Loading posts...</div>;

  const currentPost = posts[currentPostIndex];
  const postDate = new Date(currentPost.createdAt);

  return (
    <div className='h-screen w-screen flex flex-col items-center justify-center bg-gray-100'>
      <button onClick={handlePreviousPost} disabled={currentPostIndex === 0} className='p-4 mb-4 rounded-full bg-blue-500 text-white'>↑</button>
      <div className='w-96 bg-white rounded-lg shadow-lg p-6 flex flex-col items-center'>
        <h2 className='text-xl font-bold text-gray-800'>User: {currentPost.User.Name}</h2>
        {currentPost.Type === 'text' && <p>{currentPost.Content}</p>}
        {currentPost.Type === 'image' && <img src={currentPost.mediaURL} alt='Post' className='max-w-full rounded-lg' />}
        {currentPost.Type === 'video' && <video src={currentPost.mediaURL} controls className='max-w-full rounded-lg' />}
        <p className='text-gray-600'>{currentPost.description}</p>
        <button onClick={handleLikeToggle} className={`w-full py-2 rounded-md mt-4 ${currentPost.isLiked ? 'bg-red-600' : 'bg-blue-600'} text-white`}>
          {currentPost.isLiked ? 'Unlike' : 'Like'} ({currentPost.Likes?.length || 0})
        </button>
        <p>Date: {postDate.toLocaleDateString()} Time: {postDate.toLocaleTimeString()}</p>
      </div>
      <button onClick={handleNextPost} disabled={currentPostIndex === posts.length - 1} className='p-4 mt-4 rounded-full bg-blue-500 text-white'>↓</button>
    </div>
  );
}

export default ViewPost;
