import  { useState } from 'react';

function ViewPosts() {
  // Sample posts data
  const posts = [
    { author: "Nikhil Bansal", content:"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Non dignissimos illum impedit, natus neque aliquid aut quam quaerat, error voluptas sequi vel similique esse omnis beatae eligendi possimus reiciendis id.", initialLikes: 10 },
    { author: "Alex Johnson", content:"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Non dignissimos illum impedit, natus neque aliquid aut quam quaerat, error voluptas sequi vel similique esse omnis beatae eligendi possimus reiciendis id.", initialLikes: 5 },
    { author: "Jamie Lee", content: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Non dignissimos illum impedit, natus neque aliquid aut quam quaerat, error voluptas sequi vel similique esse omnis beatae eligendi possimus reiciendis id.", initialLikes: 20 },
    { author: "Samantha Kim", content:"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Non dignissimos illum impedit, natus neque aliquid aut quam quaerat, error voluptas sequi vel similique esse omnis beatae eligendi possimus reiciendis id." , initialLikes: 8 },
  ];

  // State to keep track of the current post index
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [likes, setLikes] = useState(posts.map(post => post.initialLikes));

  // Handlers for navigation
  const handleNextPost = () => {
    if (currentPostIndex < posts.length - 1) {
      setCurrentPostIndex(currentPostIndex + 1);
    }
  };

  const handlePreviousPost = () => {
    if (currentPostIndex > 0) {
      setCurrentPostIndex(currentPostIndex - 1);
    }
  };

  // Handler for liking a post
  const handleLike = () => {
    setLikes(prevLikes => {
      const updatedLikes = [...prevLikes];
      updatedLikes[currentPostIndex] += 1;
      return updatedLikes;
    });
  };

  // Get the current post data
  const currentPost = posts[currentPostIndex];

  return (
    <div className='h-screen w-screen flex flex-col items-center justify-center bg-gray-100'>
      {/* Up Arrow - Positioned Above the Card */}
      <button
        onClick={handlePreviousPost}
        disabled={currentPostIndex === 0}
        className={`p-4 mb-4 rounded-full text-2xl font-bold ${currentPostIndex === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg'} transition duration-200`}
      >
        ↑
      </button>

      {/* Card */}
      <div className='w-96 bg-white rounded-lg shadow-lg p-6 flex flex-col items-center'>
        <header className='w-full border-b pb-3 mb-4 text-center'>
          <h2 className='text-xl font-bold text-gray-800'>{currentPost.author}</h2>
        </header>
        <main className='flex-1 text-gray-700 mb-6 text-center'>
          <p>
            {currentPost.content}
          </p>
        </main>
        <footer className='w-full'>
          <button
            onClick={handleLike}
            className='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200'
          >
            Likes: {likes[currentPostIndex]}
          </button>
        </footer>
      </div>

      {/* Down Arrow - Positioned Below the Card */}
      <button
        onClick={handleNextPost}
        disabled={currentPostIndex === posts.length - 1}
        className={`p-4 mt-4 rounded-full text-2xl font-bold ${currentPostIndex === posts.length - 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg'} transition duration-200`}
      >
        ↓
      </button>
    </div>
  );
}

export default ViewPosts;
