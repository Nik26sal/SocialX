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
    console.log(posts)
    if (user) {
      if(posts.length >0){
      setUserPosts(posts.filter((p) => p.User._id === user._id));
      }
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
        `http://localhost:5555/post/deletePost/${postId}`,
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
      <div className="border border-purple-500 text-center w-full p-6 mt-6 rounded-2xl bg-white shadow-md flex flex-col justify-center items-center">
        <h2 className="font-bold text-2xl mb-4 text-purple-500">Uploaded Posts</h2>
        
        {userPosts.length > 0 ? (
          <div className="relative w-full max-w-lg overflow-hidden rounded-lg border border-gray-300 shadow-lg">
            <div className="flex transition-transform ease-in-out duration-500" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {userPosts.map((p, index) => (
                <div key={index} className="min-w-full p-4 flex-shrink-0">
                  {p.Type === 'image' && (
                    <img 
                      src={p.mediaURL} 
                      alt="User Post" 
                      className="rounded-xl shadow-lg w-full h-64 object-cover"
                    />
                  )}
                  {p.Type === 'video' && (
                    <video 
                      controls 
                      className="rounded-xl shadow-lg w-full h-64 object-cover"
                    >
                      <source src={p.mediaURL} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                  {p.Type === 'text' && (
                    <p className="text-lg text-gray-700 bg-gray-200 h-4/6 flex justify-center items-center p-4 rounded-lg">{p.Content}</p>
                  )}
                     <div className="mt-4 text-gray-500 text-sm">
                    <p>📅 {new Date(p.createdAt).toLocaleString()}</p>
                    <p>❤️ {p.Likes.length} Likes</p>
                  </div>

                  <button
                    onClick={() => handleDelete(p._id)}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition-transform hover:scale-105"
                  >
                    🗑 Delete Post
                  </button>
                </div>
              ))}
            </div>
            <button 
              onClick={prevSlide} 
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-transform hover:scale-110"
            >‹</button>
            
            <button 
              onClick={nextSlide} 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-transform hover:scale-110"
            >›</button>
          </div>
        ) : (
          <p className="text-gray-500">No posts available</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
