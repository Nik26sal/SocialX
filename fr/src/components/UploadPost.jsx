import { useState } from 'react';

function UploadPost() {
  const [upload, setUpload] = useState(false);
  
  const toggle = () => {
    setUpload((prev) => !prev);
  };

  return (
    <>
      <div className="border w-screen h-screen flex justify-center items-center relative">
        {!upload ? (
          <div 
            onClick={toggle} 
            className="border border-blue-900 bg-blue-600 text-white flex justify-center items-center rounded-full w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 cursor-pointer"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16"
            >
              <path 
                fillRule="evenodd" 
                d="M12 4a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H5a1 1 0 110-2h6V5a1 1 0 011-1z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <label htmlFor="content" className="mb-2 text-lg font-semibold">Enter Your Content</label>
            <input 
              id="content" 
              type="text" 
              placeholder="Enter your content" 
              className="mb-4 p-2 border rounded w-64 md:w-80 lg:w-96"
            />
            <button 
              onClick={toggle}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Upload
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default UploadPost;
