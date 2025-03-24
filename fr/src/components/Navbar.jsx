import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearAuth } from "../features/authSlice";
import axios from "axios";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const handleLogout = async () => {
    try {
      const response = await axios.get('http://localhost:5555/user/logout', {
        withCredentials: true
      });
      console.log(response)
      if (response.status === 200) {
        dispatch(clearAuth());
        alert("User Logout Successfully");
        navigate('/sign_in_up', { state: { isLogin: true, loading: false } });
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to log out. Please try again.");
    }
  };

  return (
    <div className="flex justify-between items-center shadow-lg p-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white mx-auto">
      <div className="text-3xl font-bold tracking-wide flex items-center">
        <span className="border-b-4 border-white pb-1">SocialX</span>
      </div>
      <div className="flex items-center">
        {isAuthenticated ? (
          <>
            <>
              <div>
                <img
                  src={user.avatar || "/default-avatar.png"}
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full object-cover m-2"
                />
              </div>

              <Link to="/profile">
                <button className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-full shadow-md hover:bg-blue-100 transition duration-200 ease-in-out mr-2">
                  {user?.Name || "Profile"}
                </button>
              </Link>

              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-full shadow-md hover:bg-blue-100 transition duration-200 ease-in-out mr-2"
              >
                Logout
              </button>
            </>

          </>
        ) : (
          <Link to="/sign_in_up">
            <button className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-full shadow-md hover:bg-blue-100 transition duration-200 ease-in-out">
              Sign In
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
