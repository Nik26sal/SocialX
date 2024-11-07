import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate('/sign_in_up');
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 w-screen">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <div className="bg-white rounded-lg shadow-lg p-6 w-80">
          <h2 className="text-xl font-semibold">Any User Not Registered Yet...</h2>
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={handleNavigation}
              className="text-blue-500 hover:underline"
            >
              --- Register or Login to the Website ---
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 w-screen">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="bg-white rounded-lg shadow-lg p-6 w-80">
        <h2 className="text-xl font-semibold">{user.Name}</h2>
        <p className="text-gray-600">Total-Posts: {user.Posts ? user.Posts.length : 0}</p>
      </div>
    </div>
  );
}

export default Profile;
