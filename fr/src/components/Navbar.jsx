import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearAuth } from "../features/authSlice";
import axios from "axios";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [popup, setPopup] = useState({ show: false, message: '', status: 'success' });

  const showPopup = (message, status = 'success') => {
    setPopup({ show: true, message, status });
    setTimeout(() => setPopup({ ...popup, show: false }), 3000);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get('http://localhost:5555/user/logout', {
        withCredentials: true,
      });

      if (response.status === 200) {
        dispatch(clearAuth());
        showPopup("User logged out successfully", 'success');
        setTimeout(() => {
          navigate('/sign_in_up', { state: { isLogin: true } });
        }, 1500);
      }
    } catch (error) {
      showPopup(error.response?.data?.message || "Logout failed", 'error');
    }
  };

  return (
    <div className="relative">
      <nav className="backdrop-blur-md bg-white/10 border-b border-white/20 shadow-md px-6 py-4 flex justify-between items-center text-white">
        <Link to="/" className="text-2xl font-bold tracking-wide flex items-center gap-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
            SocialX
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="relative group">
                <img
                  src={user.avatar || "/default-avatar.png"}
                  alt="User Avatar"
                  className="w-11 h-11 rounded-full border-2 border-white object-cover transition-transform duration-300 transform group-hover:scale-110"
                />
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition">
                  {user.Name}
                </div>
              </div>

              <Link to="/profile">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2 bg-white text-blue-600 font-semibold rounded-full shadow-md hover:bg-blue-100 transition duration-200"
                >
                  Profile
                </motion.button>
              </Link>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-5 py-2 bg-white text-red-500 font-semibold rounded-full shadow-md hover:bg-red-100 transition duration-200"
              >
                Logout
              </motion.button>
            </>
          ) : (
            <Link to="/sign_in_up">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-full shadow-md hover:bg-blue-100 transition duration-200"
              >
                Sign In
              </motion.button>
            </Link>
          )}
        </div>
      </nav>
      <AnimatePresence>
        {popup.show && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 text-white ${
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

export default Navbar;
