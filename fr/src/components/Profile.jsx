import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const handleNavigation = () => navigate('/sign_in_up');
  const posts = useSelector((state) => state.post.post);
  const [userPosts, setUserPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (user && posts.length > 0) {
      setUserPosts(posts.filter((p) => p.User._id === user._id));
    }
  }, [user, posts]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % userPosts.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + userPosts.length) % userPosts.length);
  };

  const handleDelete = async (postId) => {
    try {
      const response = await axios.delete(
        `https://social-x-cx5w.vercel.app/post/deletePost/${postId}`,
        { withCredentials: true }
      );
      setUserPosts((prevPosts) => prevPosts.filter((p) => p._id !== postId));
      alert(response.data.message || "Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete the post. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-gray-900 text-white">
        <h1 className="text-5xl font-extrabold mb-6 animate-pulse">🚀 Welcome</h1>
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-96 text-center border border-purple-500">
          <h2 className="text-2xl font-semibold">No User Registered Yet...</h2>
          <button
            onClick={handleNavigation}
            className="mt-6 bg-purple-500 px-6 py-3 rounded-lg text-white font-bold hover:bg-purple-600 transition-transform transform hover:scale-105"
          >
            Register or Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-100 text-black p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center border border-purple-500">
        <img
          src={user.avatar}
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-purple-500 shadow-lg"
        />
        <h2 className="text-4xl font-extrabold text-purple-500">{user.Name}</h2>
        <p className="text-gray-500 text-lg">{user.Email}</p>
        <p className="mt-4 text-lg font-semibold border border-gray-300 rounded-md text-gray-600 p-2">
          Total Posts: {userPosts.length}
        </p>
      </div>
      <div className="border border-purple-500 w-full p-6 mt-6 rounded-2xl bg-white shadow-md">
        <h2 className="font-bold text-2xl mb-6 text-center text-purple-500">Uploaded Posts</h2>

        {userPosts.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {userPosts.map((p, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-300 bg-white overflow-hidden"
              >
                <div className="w-full h-60 bg-gray-100 flex items-center justify-center">
                  {p.Type === 'image' && (
                    <img
                      src={p.mediaURL}
                      alt="User Post"
                      className="w-full h-full object-cover"
                    />
                  )}
                  {p.Type === 'video' && (
                    <video controls className="w-full h-full object-cover">
                      <source src={p.mediaURL} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  {p.Type === 'text' && (
                    <p className="text-gray-700 text-center p-4 text-lg">{p.Content}</p>
                  )}
                </div>

                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-1">📅 {new Date(p.createdAt).toLocaleString()}</p>
                  <p className="text-sm text-red-500 mb-3">❤️ {p.Likes.length} Likes</p>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition-transform hover:scale-105"
                  >
                    🗑 Delete Post
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No posts available</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
