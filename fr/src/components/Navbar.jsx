import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../features/authSlice";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate("/sign_in_up"); 
      })
      .catch((error) => console.error("Logout error:", error));
  };

  return (
    <div className="flex justify-between items-center shadow-lg p-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white mx-auto">
      <div className="text-3xl font-bold tracking-wide flex items-center">
        <span className="border-b-4 border-white pb-1">Blog-Site</span>
      </div>
      <div className="flex items-center">
        {isAuthenticated ? (
          <>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-full shadow-md hover:bg-blue-100 transition duration-200 ease-in-out mr-4"
            >
              Logout
            </button>
            <Link to="/profile">
              <button className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-full shadow-md hover:bg-blue-100 transition duration-200 ease-in-out">
                {user?.name || "Profile"}
              </button>
            </Link>
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
