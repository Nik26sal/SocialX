import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

function Footer() {
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => setOpen((prev) => !prev);

  const navItems = [
    { to: "/", label: "Home", icon: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" },
    { to: "/uploadPost", label: "Upload", icon: "M12 2L6 12h4v8h4v-8h4L12 2z" },
    { to: "/profile", label: "Profile", icon: "M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" },
  ];

  return (
    <div className="flex flex-col sm:flex-row h-auto">
      {/* Desktop Sidebar */}
      <div
        className={`${
          open ? "w-64" : "w-20"
        } hidden sm:flex flex-col h-screen bg-gray-900/80 backdrop-blur-md text-white transition-all duration-300 shadow-lg`}
      >
        {/* Toggle Button */}
        <button onClick={toggleSidebar} className="p-4 hover:bg-gray-800">
          <div className="relative w-6 h-6">
            <span
              className={`absolute top-0 w-full h-0.5 bg-white rounded transform transition duration-300 ${
                open ? "rotate-45 top-2" : ""
              }`}
            />
            <span
              className={`absolute top-2 w-full h-0.5 bg-white rounded transition duration-300 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute bottom-0 w-full h-0.5 bg-white rounded transform transition duration-300 ${
                open ? "-rotate-45 bottom-2" : ""
              }`}
            />
          </div>
        </button>

        {/* Sidebar Links */}
        <nav className="mt-6 flex flex-col space-y-2">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-4 p-4 group relative hover:bg-gray-800 transition ${
                  isActive ? "bg-gray-800 text-blue-400" : "text-white"
                }`
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
              >
                <path d={icon} />
              </svg>
              {open ? (
                <span className="text-md">{label}</span>
              ) : (
                <span className="absolute left-full ml-2 bg-gray-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
                  {label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Mobile Footer */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md text-white flex justify-around p-2 shadow-inner z-50">
        {navItems.map(({ to, icon }, i) => (
          <NavLink
            key={i}
            to={to}
            className={({ isActive }) =>
              `p-2 ${isActive ? "text-blue-400" : "text-white"}`
            }
          >
            <motion.svg
              whileTap={{ scale: 0.85 }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d={icon} />
            </motion.svg>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default Footer;
