import  { useState, useEffect } from 'react';

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
    <div className="border bg-gray-300 h-screen relative">
      <div className="h-4/5 w-4/5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col sm:flex-row rounded-lg">
        
        {/* Green Box with Carousel */}
        <div
          className="w-full sm:w-1/2 h-1/2 sm:h-full border flex items-center justify-center p-4 rounded-lg bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/file-1720553250263-3b4f25a93c9cimage?w=416&dpr=2&auto=format&fit=crop&q=60')`
          }}
        >
          <div className="text-center">
            <div className="bg-transparent rounded-lg p-4">
              <img
                src={carouselItems[currentIndex]}
                alt="Carousel Item"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Yellow Box with Form (Registration/Login) */}
        <div className="w-full sm:w-1/2 h-1/2 sm:h-full border border-black flex items-center justify-center p-4 rounded-lg">
          <form
            className="w-full max-w-sm bg-cover bg-center p-8 rounded-lg"
            style={{
              backgroundImage: `url('https://plus.unsplash.com/premium_photo-1683211783920-8c66ab120c09?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YmxvZ3xlbnwwfHwwfHx8MA%3D%3D')`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <h2 className="text-lg font-bold mb-4 text-center">{isLogin ? 'Login Form' : 'Registration Form'}</h2>

            {!isLogin && (
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="UserName">
                   User Name
                </label>
                <input
                  type="text"
                  id="UserName"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter User Name"
                  required
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter Email"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter Password"
                required
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {isLogin ? 'Login' : 'Register'}
              </button>
            </div>
            <div className="flex justify-center mt-4">
              <button
                type="button"
                onClick={toggleForm}
                className="text-black"
              >
                {isLogin ? 'Switch to Registration' : 'Switch to Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Sign_in_aur_up;
