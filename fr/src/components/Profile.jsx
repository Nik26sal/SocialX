import { useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const handleNavigation = () => navigate('/sign_in_up');

  // const handleDeletePost = (postId) => {
  //   axios.post(`http://localhost:5555/user/deletePost/${postId}`, {}, { withCredentials: true })
  //     .catch(() => alert("Failed to delete the post."));
  // };

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
        <p className="text-gray-600 text-lg">{user.Email}</p>
        <p className="mt-4 text-lg font-semibold border border-black-500 rounded-md text-gray-600">Total Posts: {user.Posts.length}</p>
      </div>

      {/* <h1 className="mt-10 text-3xl font-extrabold text-purple-300">🔥 Uploaded Posts 🔥</h1>
      {status === 'loading' && <p className="mt-4 animate-pulse">Loading posts...</p>}
      {status === 'failed' && <p className="mt-4 text-red-500">Error loading posts.</p>}
      {posts.length === 0 && <p className="mt-4 text-gray-500">No posts uploaded yet.</p>} */}
    </div>
  );
}

export default Profile;
