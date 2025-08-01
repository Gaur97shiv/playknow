import { useDispatch, useSelector } from "react-redux";
import { likePost, deletePost, commentPost, setEditingPost } from "../../redux/postSlice";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FaRegComment, FaRegHeart, FaRegBookmark, FaTrash, FaEdit } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { Link } from "react-router-dom";
import { formatPostDate } from "../../utils/date";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const isLiked = Array.isArray(post.likes) && authUser?._id ? post.likes.includes(authUser._id) : false;
  const isMyPost = authUser?._id && post.user?._id ? authUser._id === post.user._id : false;
  const formattedDate = formatPostDate(post.createdAt);

  const handleDeletePost = async () => {
    try {
      await dispatch(deletePost(post._id)).unwrap();
      toast.success("Post deleted successfully");
    } catch (err) {
      toast.error(err?.message || String(err));
    }
  };

  const handleLikePost = async () => {
    try {
      await dispatch(likePost(post._id)).unwrap();
    } catch (err) {
      toast.error(err?.message || String(err));
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    try {
      await dispatch(commentPost({ postId: post._id, comment })).unwrap();
      toast.success("Comment posted");
      setComment("");
    } catch (err) {
      toast.error(err?.message || String(err));
    }
  };

  const handleEditPost = () => {
    dispatch(setEditingPost(post));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex gap-2 items-start p-4 border-b border-gray-700">
      <div className="avatar">
        <Link to={`/profile/${post.user?.username || ""}`} className="w-8 rounded-full overflow-hidden">
          <img src={post.user?.profileImg || "/avatar-placeholder.png"} />
        </Link>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex gap-2 items-center">
          <Link to={`/profile/${post.user?.username || ""}`} className="font-bold">
            {post.user?.fullName || "Unknown"}
          </Link>
          <span className="text-gray-700 flex gap-1 text-sm">
            <Link to={`/profile/${post.user?.username || ""}`}>@{post.user?.username || "unknown"}</Link>
            <span>·</span>
            <span>{formattedDate}</span>
          </span>
          {isMyPost && (
            <span className="flex justify-end flex-1 gap-2">
              <FaEdit className="cursor-pointer hover:text-yellow-500" onClick={handleEditPost} />
              <FaTrash className="cursor-pointer hover:text-red-500" onClick={handleDeletePost} />
            </span>
          )}
        </div>
        <div className="flex flex-col gap-3 overflow-hidden">
          <span>{post.text}</span>
          {post.img && (
            <img
              src={post.img}
              className="h-80 object-contain rounded-lg border border-gray-700"
              alt="post"
            />
          )}
        </div>
        <div className="flex justify-between mt-3">
          <div className="flex gap-4 items-center w-2/3 justify-between">
            <div
              className="flex gap-1 items-center cursor-pointer group"
              onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
            >
              <FaRegComment className="w-4 h-4 text-slate-500 group-hover:text-sky-400" />
              <span className="text-sm text-slate-500 group-hover:text-sky-400">{post.comments.length}</span>
            </div>
            <dialog id={`comments_modal${post._id}`} className="modal border-none outline-none">
              <div className="modal-box rounded border border-gray-600">
                <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
                <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                  {post.comments.length === 0 && (
                    <p className="text-sm text-slate-500">No comments yet 🤔 Be the first one 😉</p>
                  )}
                  {post.comments.map((comment) => (
                    <div key={comment._id} className="flex gap-2 items-start">
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img src={comment.user.profileImg || "/avatar-placeholder.png"} />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className="font-bold">{comment.user.fullName}</span>
                          <span className="text-gray-700 text-sm">@{comment.user.username}</span>
                        </div>
                        <div className="text-sm">{comment.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <form className="flex gap-2 items-center mt-4 border-t border-gray-600 pt-2" onSubmit={handlePostComment}>
                  <textarea
                    className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none border-gray-800"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button className="btn btn-primary rounded-full btn-sm text-white px-4">Post</button>
                </form>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button className="outline-none">close</button>
              </form>
            </dialog>
            <div className="flex gap-1 items-center group cursor-pointer">
              <BiRepost className="w-6 h-6 text-slate-500 group-hover:text-green-500" />
              <span className="text-sm text-slate-500 group-hover:text-green-500">0</span>
            </div>
            <div className="flex gap-1 items-center group cursor-pointer" onClick={handleLikePost}>
              <FaRegHeart className={`w-4 h-4 ${isLiked ? "text-pink-500" : "text-slate-500"} group-hover:text-pink-500`} />
              <span className={`text-sm ${isLiked ? "text-pink-500" : "text-slate-500"} group-hover:text-pink-500`}>
                {post.likes.length}
              </span>
            </div>
          </div>
          <div className="flex w-1/3 justify-end gap-2 items-center">
            <FaRegBookmark className="w-4 h-4 text-slate-500 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
