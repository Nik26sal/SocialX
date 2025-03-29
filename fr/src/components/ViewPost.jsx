import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {post} from '../features/postSlice';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { addComment } from '../features/commentSlice';

function ViewPost() {
  const [posts, setPosts] = useState([]);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userId = user?._id;

  useEffect(() => {
    if (!userId) return;

    const fetchPosts = async () => {
      try {
        const allPostsResponse = await axios.get("http://localhost:5555/post/getAllPost", { withCredentials: true });
        console.log(allPostsResponse)
        dispatch(post({ post: allPostsResponse.data.post }));
        const likedPostsResponse = await axios.get("http://localhost:5555/like/returnpost", { withCredentials: true });
        const likedPostIds = new Set(likedPostsResponse.data.likedPosts?.map(post => post._id) || []);

        const postsData = allPostsResponse.data.post
          .filter(post => post.User._id !== userId)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map(post => ({ ...post, isLiked: likedPostIds.has(post._id) }));

        setPosts(postsData);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        if (error.response?.status === 401) navigate('/sign_in_up');
      }
    };

    fetchPosts();
  }, [userId, navigate, dispatch]);

  useEffect(() => {
    if (posts.length === 0) return;

    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/comment/returnAllComment/${posts[currentPostIndex]._id}`, {
          withCredentials: true,
        });
        console.log(response.data)
        setComments(response.data.comments);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };

    fetchComments();
  }, [currentPostIndex, posts]);

  const handleNavigation = () => navigate('/sign_in_up');

  const handleNextPost = () => {
    if (currentPostIndex < posts.length - 1) setCurrentPostIndex(currentPostIndex + 1);
  };

  const handlePreviousPost = () => {
    if (currentPostIndex > 0) setCurrentPostIndex(currentPostIndex - 1);
  };

  const handleLikeToggle = async () => {
    const post = posts[currentPostIndex];
    const isLiked = post.Likes.includes(userId);
    const endpoint = isLiked
      ? `http://localhost:5555/like/unlikepost/${post._id}`
      : `http://localhost:5555/like/likesOnPost/${post._id}`;

    try {
      await axios.patch(endpoint, {}, { withCredentials: true });

      setPosts(posts.map((p, index) =>
        index === currentPostIndex
          ? {
            ...p,
            isLiked: !p.isLiked,
            Likes: p.isLiked
              ? p.Likes.filter(id => id !== userId)
              : [...p.Likes, userId]
          }
          : p
      ));
    } catch (error) {
      console.error(`Failed to ${posts[currentPostIndex]?.isLiked ? "unlike" : "like"} post:`, error);
      if (error.response?.status === 401) navigate('/sign_in_up');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const response = await axios.post(
        `http://localhost:5555/comment/commentOnPost/${posts[currentPostIndex]._id}`,
        { content: newComment },
        { withCredentials: true }
      );

      const addedComment = response.data.comment;
      setComments([...comments, addedComment]);
      dispatch(addComment({ comment: addedComment }));
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 w-screen">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <div className="bg-white rounded-lg shadow-lg p-6 w-80">
          <h2 className="text-xl font-semibold">No User Registered Yet...</h2>
          <button onClick={handleNavigation} className="text-blue-500 hover:underline mt-4">Register or Login</button>
        </div>
      </div>
    );
  }

  if (posts.length === 0) return <div>Loading posts...</div>;

  const currentPost = posts[currentPostIndex];
  const postDate = new Date(currentPost.createdAt);

  return (
    <div className='h-screen w-screen flex flex-col items-center justify-center bg-gray-100'>
      <button onClick={handlePreviousPost} disabled={currentPostIndex === 0} className='p-4 mb-2 rounded-full bg-blue-500 text-white'>↑</button>

      <div className='w-96 bg-white rounded-lg shadow-lg p-4 flex flex-col items-center'>
        <h2 className='text-xl font-bold text-gray-800'>User: {currentPost.User.Name}</h2>
        {currentPost.Type === 'text' && <p>{currentPost.Content}</p>}
        {currentPost.Type === 'image' && <img src={currentPost.mediaURL} alt='Post' className='max-w-full rounded-lg' />}
        {currentPost.Type === 'video' && <video src={currentPost.mediaURL} controls className='max-w-full rounded-lg' />}
        <p className='text-gray-600'>{currentPost.description}</p>

        <button onClick={handleLikeToggle} className={`w-full py-2 rounded-md mt-4 ${currentPost.isLiked ? 'bg-red-600' : 'bg-blue-600'} text-white`}>
          {currentPost.isLiked ? 'Unlike' : 'Like'} ({currentPost.Likes?.length || 0})
        </button>
        <p>Date: {postDate.toLocaleDateString()} Time: {postDate.toLocaleTimeString()}</p>
        <div className="border-t border-gray-300 mt-4 pt-4 w-full">
          <h3 className="text-lg font-semibold">Comments</h3>
          <div className="max-h-40 overflow-y-auto mt-2">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="p-2 border-b border-gray-200">
                  <p className="text-sm flex items-center">
                    <img
                      src={comment?.user?.avatar || "https://via.placeholder.com/40"}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full inline-block mr-2 object-cover"
                    />
                    <strong>{comment?.user?.Name || "Anonymous"}:</strong> {comment?.content || "No content"}
                  </p>

                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No comments yet.</p>
            )}
          </div>
          <form onSubmit={handleCommentSubmit} className="mt-2 flex flex-col">
            <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} className="p-2 border rounded-md w-full" placeholder="Write a comment..."></textarea>
            <button type="submit" className="mt-2 bg-blue-500 text-white py-1 rounded-md">Submit</button>
          </form>
        </div>
      </div>
      <button onClick={handleNextPost} disabled={currentPostIndex === posts.length - 1} className='p-4 mt-4 rounded-full bg-blue-500 text-white'>↓</button>
    </div>
  );
}

export default ViewPost;
