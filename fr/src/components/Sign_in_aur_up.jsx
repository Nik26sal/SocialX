import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuth } from '../features/authSlice';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Upload, LogIn, UserPlus } from 'lucide-react';

const carouselItems = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  "https://images.unsplash.com/photo-1581091012184-5c1842f9c8a7",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
];

export default function Sign_in_aur_up() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({ Name: '', Email: '', Password: '', avatar: null });
  const [popup, setPopup] = useState({ show: false, message: '', status: 'success' });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.isLogin) {
      setIsLogin(true);
    }
  }, [location]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % carouselItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const showPopup = (message, status = 'success') => {
    setPopup({ show: true, message, status });
    setTimeout(() => setPopup({ ...popup, show: false }), 3000);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isLogin) {
        const response = await axios.post('https://social-x-cx5w.vercel.app/user/login', {
          Email: input.Email,
          Password: input.Password,
        }, { withCredentials: true });

        showPopup(`Welcome ${response.data.user.Name}`, 'success');
        dispatch(setAuth({ user: response.data.user }));
        setTimeout(() => navigate('/'), 2000);
      } else {
        const formData = new FormData();
        formData.append('Name', input.Name);
        formData.append('Email', input.Email);
        formData.append('Password', input.Password);
        if (input.avatar) formData.append('avatar', input.avatar);

        await axios.post('https://social-x-cx5w.vercel.app/user/register', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });

        showPopup("Registration successful. Verify your email.", 'success');
        setTimeout(() => navigate('/verifyOTP'), 2000);
      }
    } catch (err) {
      showPopup(err?.response?.data?.message || "Something went wrong", 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="absolute inset-0 z-0 transition-all duration-1000">
        <img
          src={carouselItems[currentIndex]}
          alt="carousel"
          className="object-cover w-full h-full blur-sm scale-105 transition duration-1000"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl px-8 py-10 w-11/12 max-w-md text-white"
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold tracking-tight">{isLogin ? 'Welcome Back 👋' : 'Create an Account ✨'}</h2>
            <p className="text-sm text-gray-200">{isLogin ? 'Please login to continue' : 'Join our blog family!'}</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <>
                <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-md">
                  <User className="text-white" size={18} />
                  <input
                    type="text"
                    placeholder="Name"
                    value={input.Name}
                    onChange={(e) => setInput({ ...input, Name: e.target.value })}
                    className="bg-transparent w-full text-white placeholder-gray-300 focus:outline-none"
                    required
                  />
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-md">
                  <Upload className="text-white" size={18} />
                  <input
                    type="file"
                    onChange={(e) => setInput({ ...input, avatar: e.target.files[0] })}
                    className="text-sm text-white"
                    required
                  />
                </div>
              </>
            )}

            <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-md">
              <Mail className="text-white" size={18} />
              <input
                type="email"
                placeholder="Email"
                value={input.Email}
                onChange={(e) => setInput({ ...input, Email: e.target.value })}
                className="bg-transparent w-full text-white placeholder-gray-300 focus:outline-none"
                required
              />
            </div>

            <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-md">
              <Lock className="text-white" size={18} />
              <input
                type="password"
                placeholder="Password"
                value={input.Password}
                onChange={(e) => setInput({ ...input, Password: e.target.value })}
                className="bg-transparent w-full text-white placeholder-gray-300 focus:outline-none"
                required
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 transition rounded-md text-white font-semibold flex items-center justify-center gap-2 shadow-md"
            >
              {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
              {loading ? (isLogin ? 'Logging in...' : 'Registering...') : (isLogin ? 'Login' : 'Register')}
            </motion.button>
          </form>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setInput({ Name: '', Email: '', Password: '', avatar: null });
              }}
              className="text-sm text-blue-300 hover:underline"
            >
              {isLogin ? 'New here? Create an account' : 'Already registered? Log in'}
            </button>
          </div>
        </motion.div>

        <Link to="/" className="absolute top-5 left-5 text-white text-sm hover:underline">
          &larr; Back to Home
        </Link>
      </div>
      <AnimatePresence>
        {popup.show && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-lg shadow-lg text-white text-center z-50 ${
              popup.status === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {popup.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
