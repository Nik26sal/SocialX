

function Profile() {
  const user = {
    name: "Nikhil",
    totalLikes: 125,
    posts: [
      { id: 1, title: "My First Post", content: "This is the content of my first post." },
      { id: 2, title: "A Day in My Life", content: "Sharing a day from my life with you all." },
      { id: 3, title: "React Tips", content: "Some tips and tricks for working with React." },
    ],
  };

  return (
    <div className="h-screen flex flex-col w-screen items-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6 mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
        <p className="text-gray-600 mt-2">Total Likes: <span className="font-semibold">{user.totalLikes}</span></p>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Posts by {user.name}</h2>
        
        <div className="space-y-4">
          {user.posts.map((post) => (
            <div key={post.id} className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-700">{post.title}</h3>
              <p className="text-gray-600 mt-2">{post.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
