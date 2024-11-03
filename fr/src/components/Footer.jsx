import { useState } from 'react';
import { NavLink } from 'react-router-dom';

function Footer() {
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen">
      {/* Sidebar for larger screens */}
      <div
        className={`${
          open ? "w-64" : "w-20"
        } bg-gray-800 text-white transition-all duration-300 flex-col h-full hidden sm:flex`}
      >
        <button className="p-4 hover:bg-gray-700" onClick={toggleSidebar}>
          <div className="relative w-8 h-8">
            <span
              className={`block h-1 bg-white rounded transition-transform duration-300 ${
                open ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`block h-1 bg-white rounded my-1 transition-opacity duration-300 ${
                open ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block h-1 bg-white rounded transition-transform duration-300 ${
                open ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </div>
        </button>

        {/* Sidebar Links with SVGs */}
        <div className="flex flex-col space-y-4 mt-6">
          {/* Home Link */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center p-4 hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            {open && <span className="ml-4">Home</span>}
          </NavLink>
          
          {/* Upload Link */}
          <NavLink
            to="/uploadPost"
            className={({ isActive }) =>
              `flex items-center p-4 hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M12 2L6 12h4v8h4v-8h4L12 2z" />
            </svg>
            {open && <span className="ml-4">Upload</span>}
          </NavLink>

          {/* Profile Link */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center p-4 hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""}`
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            {open && <span className="ml-4">Profile</span>}
          </NavLink>
        </div>
      </div>

      {/* Footer for mobile view */}
      <div className="bg-gray-800 text-white p-2 flex justify-around fixed bottom-0 w-full sm:hidden">
        {/* Mobile Home Link */}
        <NavLink to="/" className={({ isActive }) => (isActive ? "text-blue-400" : "")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </NavLink>
        
        {/* Mobile Upload Link */}
        <NavLink to="/uploadPost" className={({ isActive }) => (isActive ? "text-blue-400" : "")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path d="M12 2L6 12h4v8h4v-8h4L12 2z" />
          </svg>
        </NavLink>
        
        {/* Mobile Profile Link */}
        <NavLink to="/profile" className={({ isActive }) => (isActive ? "text-blue-400" : "")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </NavLink>
      </div>
    </div>
  );
}

export default Footer;
