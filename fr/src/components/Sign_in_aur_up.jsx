import { useState, useEffect } from 'react';
import { Link, useNavigate,useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuth } from '../features/authSlice';
import axios from 'axios';

const carouselItems = [
  "https://media.istockphoto.com/id/1477183258/photo/woman-holding-ai-icons-with-laptop.webp?a=1&b=1&s=612x612&w=0&k=20&c=RTy3cj2HXeN3LBwpCvFtTvv2G8DIDh5S6-U-iCkEXSc=",
  "https://media.istockphoto.com/id/1397678880/photo/closeup-of-a-black-businesswoman-typing-on-a-laptop-keyboard-in-an-office-alone.webp?a=1&b=1&s=612x612&w=0&k=20&c=zcsil2E_3frStihv7zNUacOt0ZXSCFqKJMu40VLOY-s=",
  "https://plus.unsplash.com/premium_photo-1661339265887-be15949790ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmxvZ3xlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmxvZ3xlbnwwfHwwfHx8MA%3D%3D"
];

function Sign_in_aur_up() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.state?.isLogin || true);
  const [loading, setLoading] = useState(location.state?.loading || false);
  const [input, setInput] = useState({ Name: '', Email: '', Password: '', avatar: null });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (isLogin) {
        setLoading(true);
        response = await axios.post('http://localhost:5555/user/login', {
          Email: input.Email,
          Password: input.Password
        }, {
          withCredentials: true
        });

        alert(`Welcome ${response.data.user.Name}`);
        dispatch(setAuth({
          user: response.data.user,
        }));
        setLoading(false)
        navigate('/');
      } else {
        setLoading(true);
        const formData = new FormData();
        formData.append('Name', input.Name);
        formData.append('Email', input.Email);
        formData.append('Password', input.Password);
        if (input.avatar) {
          formData.append('avatar', input.avatar);
        }
      
        response = await axios.post('http://localhost:5555/user/register', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log("response", response);
        navigate('/verifyOTP')
      }
    } catch (error) {
      console.error("Authentication error:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setInput({ Name: '', Email: '', Password: '', avatar: null });
  };

  const nextSlide = () => setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
  useEffect(() => {
    const interval = setInterval(nextSlide, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border bg-gray-300 h-screen w-screen flex flex-col items-center justify-center p-4">
      <div className="mb-4">
        <Link to="/" className="text-blue-500 hover:underline">
          &larr; Back to Home
        </Link>
      </div>
      <div className="w-full sm:w-3/4 lg:w-3/5 flex flex-col sm:flex-row rounded-lg shadow-lg overflow-hidden">
        <div
          className="w-full sm:w-1/2 h-64 sm:h-auto flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${carouselItems[currentIndex]})` }}
        >
          <div className="text-white text-center bg-opacity-60 bg-gray-900 p-4 rounded-lg">
            <h2 className="text-lg font-semibold">Welcome to Blog-Site</h2>
            <p>Join us and explore the world of blogs!</p>
          </div>
        </div>

        <div className="w-full sm:w-1/2 bg-yellow-50 p-8 flex items-center justify-center">
          <form className="w-full max-w-sm space-y-4" onSubmit={handleAuth}>
            <h2 className="text-xl font-bold text-center">{isLogin ? 'Login' : 'Register'}</h2>

            {!isLogin && (
              <div>
                <label className="block text-sm font-bold mb-1" htmlFor="Name">
                  Name
                </label>
                <input
                  type="text"
                  id="Name"
                  value={input.Name}
                  onChange={(e) => setInput({ ...input, Name: e.target.value })}
                  className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-blue-500"
                  placeholder="Enter your Name"
                  required
                />
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-bold mb-1" htmlFor="avatar">
                  avatar
                </label>
                <input
                  type="file"
                  id="avatar"
                  onChange={(e) => setInput({ ...input, avatar: e.target.files[0] })}
                  className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-blue-500"
                  placeholder="Select your avatar"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold mb-1" htmlFor="Email">
                Email
              </label>
              <input
                type="email"
                id="Email"
                value={input.Email}
                onChange={(e) => setInput({ ...input, Email: e.target.value })}
                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-blue-500"
                placeholder="Enter your Email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1" htmlFor="Password">
                Password
              </label>
              <input
                type="password"
                id="Password"
                value={input.Password}
                onChange={(e) => setInput({ ...input, Password: e.target.value })}
                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-blue-500"
                placeholder="Enter your Password"
                required
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white font-bold rounded shadow hover:bg-blue-700 transition duration-200"
              >
                {isLogin ? (loading ? 'Login.............' : 'Login') : (loading ? 'Register.............' : 'Register')}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={toggleForm}
                className="text-blue-500 hover:underline"
              >
                {isLogin ? 'Don’t have an account? Register' : 'Already have an account? Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Sign_in_aur_up;
