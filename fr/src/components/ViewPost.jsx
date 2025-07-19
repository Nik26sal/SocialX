import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { post } from '../features/postSlice';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { addComment } from '../features/commentSlice';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUp,
  ArrowDown,
  ThumbsUp,
  User,
  MessageCircle,
  Send,
} from 'lucide-react';

function ViewPost() {
  const [posts, setPosts] = useState([]);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userId = user?._id;

  useEffect(() => {
    if (!userId) return;

    const fetchPosts = async () => {
      try {
        const allPostsResponse = await axios.get(
          'http://localhost:5555/post/getAllPost',
          { withCredentials: true }
        );
        dispatch(post({ post: allPostsResponse.data.post }));

        const likedPostsResponse = await axios.get(
          'http://localhost:5555/like/returnpost',
          { withCredentials: true }
        );
        const likedPostIds = new Set(
          likedPostsResponse.data.likedPosts?.map((post) => post._id) || []
        );

        const postsData = allPostsResponse.data.post
          .filter((post) => post.User._id !== userId)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((post) => ({ ...post, isLiked: likedPostIds.has(post._id) }));

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
        const response = await axios.get(
          `http://localhost:5555/comment/returnAllComment/${posts[currentPostIndex]._id}`,
          { withCredentials: true }
        );
        setComments(response.data.comments);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };

    fetchComments();
  }, [currentPostIndex, posts]);

  const handleNavigation = () => navigate('/sign_in_up');

  const handleNextPost = () => {
    if (currentPostIndex < posts.length - 1)
      setCurrentPostIndex(currentPostIndex + 1);
  };

  const handlePreviousPost = () => {
    if (currentPostIndex > 0)
      setCurrentPostIndex(currentPostIndex - 1);
  };

  const handleLikeToggle = async () => {
    const post = posts[currentPostIndex];
    const isLiked = post.Likes.includes(userId);
    const endpoint = isLiked
      ? `http://localhost:5555/like/unlikepost/${post._id}`
      : `http://localhost:5555/like/likesOnPost/${post._id}`;

    try {
      await axios.patch(endpoint, {}, { withCredentials: true });

      setPosts((prevPosts) =>
        prevPosts.map((p, index) =>
          index === currentPostIndex
            ? {
                ...p,
                isLiked: !p.isLiked,
                Likes: p.isLiked
                  ? p.Likes.filter((id) => id !== userId)
                  : [...p.Likes, userId],
              }
            : p
        )
      );
    } catch (error) {
      console.error(`Failed to toggle like:`, error);
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
      setNewComment('');
      window.location.reload();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 w-screen">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <div className="bg-white rounded-lg shadow-lg p-6 w-80">
          <h2 className="text-xl font-semibold">No User Registered Yet...</h2>
          <button
            onClick={handleNavigation}
            className="text-blue-500 hover:underline mt-4"
          >
            Register or Login
          </button>
        </div>
      </div>
    );
  }

  if (posts.length === 0) return <div>Loading posts...</div>;

  const currentPost = posts[currentPostIndex];
  const postDate = new Date(currentPost.createdAt);

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <div className="flex gap-4 mb-4">
        <button
          onClick={handlePreviousPost}
          disabled={currentPostIndex === 0}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md"
        >
          <ArrowUp size={18} />
        </button>
        <button
          onClick={handleNextPost}
          disabled={currentPostIndex === posts.length - 1}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md"
        >
          <ArrowDown size={18} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPost._id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-3 flex items-center gap-2 border-b">
            <User className="w-4 h-4 text-gray-700" />
            <h2 className="text-sm font-medium text-gray-800">
              {currentPost.User.Name}
            </h2>
          </div>

          {currentPost.Type === 'text' && (
            <p className="p-4 text-sm text-gray-800">{currentPost.Content}</p>
          )}

          {currentPost.Type === 'image' && (
            <img
              src={currentPost.mediaURL}
              alt="Post"
              className="w-full h-72 object-cover"
            />
          )}

          {currentPost.Type === 'video' && (
            <video
              src={currentPost.mediaURL}
              controls
              className="w-full h-72 object-cover"
            />
          )}

          <div className="p-3">
            <p className="text-xs text-gray-600 mb-2">{currentPost.description}</p>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLikeToggle}
              className={`w-full py-1.5 text-sm rounded-md flex items-center justify-center gap-2 ${
                currentPost.isLiked ? 'bg-red-500' : 'bg-blue-500'
              } text-white`}
            >
              <ThumbsUp size={16} />
              {currentPost.isLiked ? 'Unlike' : 'Like'} ({currentPost.Likes?.length || 0})
            </motion.button>

            <p className="text-[11px] text-center text-gray-400 mt-2">
              {postDate.toLocaleDateString()} at {postDate.toLocaleTimeString()}
            </p>
          </div>

          <div className="px-3 pb-4 space-y-2">
            <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
              <MessageCircle size={16} />
              Comments
            </div>

            <div className="max-h-28 overflow-y-auto text-sm text-gray-700 space-y-1">
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <img
                      src={comment?.user?.avatar}
                      alt="Avatar"
                      className="w-6 h-6 rounded-full object-cover mt-0.5"
                    />
                    <div>
                      <strong>{comment?.user?.Name || 'Anonymous'}:</strong>{' '}
                      {comment?.content || ''}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No comments yet.</p>
              )}
            </div>

            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 p-1.5 text-sm border rounded-md resize-none"
                rows={1}
                placeholder="Write a comment..."
              ></textarea>
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default ViewPost;
