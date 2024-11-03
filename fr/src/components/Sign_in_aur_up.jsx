import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const carouselItems = [
  "https://media.istockphoto.com/id/1477183258/photo/woman-holding-ai-icons-with-laptop.webp?a=1&b=1&s=612x612&w=0&k=20&c=RTy3cj2HXeN3LBwpCvFtTvv2G8DIDh5S6-U-iCkEXSc=",
  "https://media.istockphoto.com/id/1397678880/photo/closeup-of-a-black-businesswoman-typing-on-a-laptop-keyboard-in-an-office-alone.webp?a=1&b=1&s=612x612&w=0&k=20&c=zcsil2E_3frStihv7zNUacOt0ZXSCFqKJMu40VLOY-s=",
  "https://plus.unsplash.com/premium_photo-1661339265887-be15949790ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmxvZ3xlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmxvZ3xlbnwwfHwwfHx8MA%3D%3D"
];

function Sign_in_aur_up() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLogin, setIsLogin] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 1500);
    return () => clearInterval(interval);
  }, []);

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div className="border bg-gray-300 h-screen w-screen flex flex-col items-center justify-center p-4">
      <div className="mb-4">
        <Link to="/" className="text-blue-500 hover:underline">
          &larr; Back to Home
        </Link>
      </div>
      <div className="w-full sm:w-3/4 lg:w-3/5 flex flex-col sm:flex-row rounded-lg shadow-lg overflow-hidden">
        
        {/* Carousel Section */}
        <div
          className="w-full sm:w-1/2 h-64 sm:h-auto flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage: `url(${carouselItems[currentIndex]})`
          }}
        >
          <div className="text-white text-center bg-opacity-60 bg-gray-900 p-4 rounded-lg">
            <h2 className="text-lg font-semibold">Welcome to Blog-Site</h2>
            <p>Join us and explore the world of blogs!</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full sm:w-1/2 bg-yellow-50 p-8 flex items-center justify-center">
          <form className="w-full max-w-sm space-y-4">
            <h2 className="text-xl font-bold text-center">{isLogin ? 'Login' : 'Register'}</h2>

            {!isLogin && (
              <div>
                <label className="block text-sm font-bold mb-1" htmlFor="username">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-blue-500"
                  placeholder="Enter your username"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold mb-1" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-1" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:border-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white font-bold rounded shadow hover:bg-blue-700 transition duration-200"
              >
                {isLogin ? 'Login' : 'Register'}
              </button>
            </div>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={toggleForm}
                className="text-sm text-blue-500 hover:underline"
              >
                {isLogin ? 'Switch to Register' : 'Switch to Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Sign_in_aur_up;
