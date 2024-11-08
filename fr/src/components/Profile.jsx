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

  // Handle navigation to the login/signup page
  const handleNavigation = () => {
    navigate('/sign_in_up');
  };

  // Handle post deletion
  const handleDeletePost = (postId) => {
    axios.post(`http://localhost:5555/user/deletePost/${postId}`, {}, { withCredentials: true })
      .then(() => {
        dispatch(removePost(postId));
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
        alert("Failed to delete the post.");
      });
  };

  if (!user) {
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

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 w-screen">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <h2 className="text-xl font-semibold">{user.Name}</h2>
        <p className="text-gray-600">Total Posts: {posts.length}</p>
      </div>

      {status === 'loading' && <p>Loading posts...</p>}
      {status === 'failed' && <p>Error loading posts.</p>}

      <div className="mt-4">
        {posts.map((post) => (
          <div key={post._id} className="bg-white rounded-lg shadow-md p-4 mb-4 w-80">
            <h3 className="text-lg font-bold">{post.title}</h3>
            <p className="text-gray-600">{post.Content}</p>
            <p className="text-gray-600">Likes: {post.Likes?.length || 0}</p>
            <button
              onClick={() => handleDeletePost(post._id)}
              className="text-red-500 hover:underline mt-2"
            >
              Delete Post
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
