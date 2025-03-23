import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setPosts, setError, setLoading, removePost } from '../features/postSlice';

function Profile() {
  const user = useSelector((state) => state.auth.user);
  const posts = useSelector((state) => state.posts.posts);
  const status = useSelector((state) => state.posts.status);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      dispatch(setLoading());
      axios.get('http://localhost:5555/user/userPosts', { withCredentials: true })
        .then((response) => {
          dispatch(setPosts(response.data.userPosts));
        })
        .catch((error) => {
          dispatch(setError(error.response?.data?.message || "Failed to fetch posts"));
        });
    }
  }, [user, dispatch]);

  const handleNavigation = () => navigate('/sign_in_up');

  const handleDeletePost = (postId) => {
    axios.post(`http://localhost:5555/user/deletePost/${postId}`, {}, { withCredentials: true })
      .then(() => dispatch(removePost(postId)))
      .catch(() => alert("Failed to delete the post."));
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-white text-white">
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
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-white text-white p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center border border-purple-500">
        <img src={user.avatar} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-purple-500 shadow-lg" />
        <h2 className="text-4xl font-extrabold text-purple-400">{user.Name}</h2>
        <p className="text-gray-400 text-lg">{user.Email}</p>
        <p className="mt-4 text-lg font-semibold">Total Posts: {posts.length}</p>
      </div>

      <h1 className="mt-10 text-3xl font-extrabold text-purple-300">🔥 Uploaded Posts 🔥</h1>
      {status === 'loading' && <p className="mt-4 animate-pulse">Loading posts...</p>}
      {status === 'failed' && <p className="mt-4 text-red-500">Error loading posts.</p>}
      {posts.length === 0 && <p className="mt-4 text-gray-500">No posts uploaded yet.</p>}

      <div className="mt-8 space-y-6 w-full max-w-lg">
        {posts.map((post) => (
          <div key={post._id} className="bg-white rounded-xl shadow-md p-6 border border-purple-500 transform transition hover:scale-105 hover:shadow-lg">
            <h3 className="text-2xl font-bold text-purple-400">{post.title}</h3>
            <p className="text-gray-300 mt-2">{post.Content}</p>
            <p className="text-sm text-gray-400 mt-2">❤️ Likes: {post.Likes?.length || 0}</p>
            <p className="text-xs text-gray-500">📅 {new Date(post.createdAt).toLocaleString()}</p>
            <button onClick={() => handleDeletePost(post._id)} className="mt-4 text-red-400 font-bold hover:text-red-500 transition-transform transform hover:scale-110">
              ❌ Delete Post
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
