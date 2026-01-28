import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/date/index";

const Post = ({ post }) => {
        const [comment, setComment] = useState("");
        const queryClient = useQueryClient();
        const authUser = queryClient.getQueryData(["authUser"]);

        const postOwner = post.user;
        const isLiked = post.likes.includes(authUser._id);

        const isMyPost = authUser?._id === postOwner._id;

        const formattedDate = formatPostDate(post.createdAt);


    
const { mutate: commentOnPost, isPending: isCommenting } = useMutation({
        mutationFn: async () => {
                try {
                        const res = await fetch(`/api/post/commentOnPost/${post._id}`, {
                                method: "POST",
                                headers: {
                                        "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ text: comment }),
                        });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data.error || "Failed to comment on post");
                        
                        return data;
                } catch (error) {
                        console.error("Error commenting on post:", error);
                        throw error;
                }
        },
        onSuccess: (data) => {
                toast.success("Comment posted successfully");
                queryClient.invalidateQueries({ queryKey: ["posts"] });
                queryClient.invalidateQueries({ queryKey: ["authUser"] });
                setComment("");
                
                if (data.balance !== undefined) {
                        toast.success(`Remaining balance: ${data.balance} coins`);
                }
        },
        onError: (error) => {
                toast.error(error.message);
        },
});

        const {mutate: deletePost ,isPending:isDeleting } = useMutation({
          mutationFn: async () => {

                        try {
                                const res=await fetch(`/api/post/${post._id}`,
                                        {
                                                method: "DELETE",

                                        }
                                )

                                const data = await res.json();
                                if (!res.ok) throw new Error("Failed to delete post");
                                console.log("Post deleted successfully:", data);
                                return data;
                        } catch (error) {
                                console.error("Error deleting post:", error);
                                throw error;
                        }
                  },
                  onSuccess: () => {
                  toast.success("Post deleted successfully");
                  queryClient.invalidateQueries({queryKey: ["posts"]});
                  }
                })

        const {mutate:likePost,isPending:isLiking} = useMutation({
                mutationFn: async () =>{
                        try {
                                const res = await fetch(`/api/post/likeOrUnlike/${post._id}`, {
                                        method: "POST",
                                });
                                const data = await res.json();
                                if (!res.ok) {
                                        throw new Error(data.error || "Something went wrong");
                                }
                                return data;
                        } catch (error) {
                          throw error;
                        }
                },
                onSuccess: (data) => {
                        if (Array.isArray(data)) {
                                queryClient.setQueryData(["posts"], (oldData) => {
                                        return oldData.map((p) => {
                                                if (p._id === post._id) {
                                                        return { ...p, likes: data };
                                                }
                                                return p;
                                        });
                                });
                                toast.success("Post unliked successfully");
                        } else if (data.likes && data.balance) {
                                queryClient.setQueryData(["posts"], (oldData) => {
                                        return oldData.map((p) => {
                                                if (p._id === post._id) {
                                                        return { ...p, likes: data.likes, total_coin_on_post: data.post.total_coin_on_post };
                                                }
                                                return p;
                                        });
                                });
                                queryClient.invalidateQueries({ queryKey: ["authUser"] });
                                toast.success(`Post liked! Remaining balance: ${data.balance} coins`);
                        }
                },
                onError: (error) => {
                        toast.error(error.message);
                }
        })
        

        const handleDeletePost = () => {
                deletePost();
        };

        const handlePostComment = (e) => {
                e.preventDefault();
                if (isCommenting) return
                commentOnPost();
        };

        const handleLikePost = () => {
        likePost();
        };

        return (
                <>
                        <div className='post-card flex flex-row gap-3 items-start p-4'>
                                <div className='avatar'>
                                        <Link to={`/profile/${postOwner.name}`} className='w-10 rounded-full avatar-vintage overflow-hidden block'>
                                                <img src={postOwner.profileImg || "/avatar-placeholder.png"} />
                                        </Link>
                                </div>
                                <div className='flex flex-col flex-1'>
                                        <div className='flex gap-2 items-center'>
                                                <Link to={`/profile/${postOwner.name}`} className='font-bold text-bark hover:text-rust transition-colors'>
                                                        {postOwner.name}
                                                </Link>
                                                <span className='text-soil flex gap-1 text-sm'>
                                                        <Link to={`/profile/${postOwner.name}`} className='hover:text-sepia transition-colors'>@{postOwner.name}</Link>
                                                        <span>-</span>
                                                        <span>{formattedDate}</span>
                                                </span>
                                                {isMyPost && (
                                                        <span className='flex justify-end flex-1'>
                                                                <FaTrash className='cursor-pointer text-soil hover:text-rust transition-colors' onClick={handleDeletePost} />
                                                                {isDeleting && <LoadingSpinner size="sm"/>}
                                                        </span>
                                                )}
                                        </div>
                                        <div className='flex flex-col gap-3 overflow-hidden mt-2'>
                                                <span className='text-bark leading-relaxed'>{post.content}</span>
                                                {post.img && (
                                                        <img
                                                                src={post.img}
                                                                className='h-80 object-contain rounded border-4 border-soil shadow-classic'
                                                                alt=''
                                                        />
                                                )}
                                        </div>
                                        <div className='flex justify-between mt-4'>
                                                <div className='flex gap-6 items-center w-2/3'>
                                                        <div
                                                                className='flex gap-1 items-center cursor-pointer group'
                                                                onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
                                                        >
                                                                <FaRegComment className='w-4 h-4 text-soil group-hover:text-sepia transition-colors' />
                                                                <span className='text-sm text-soil group-hover:text-sepia transition-colors'>
                                                                        {post.comments.length}
                                                                </span>
                                                        </div>
                                                        <dialog id={`comments_modal${post._id}`} className='modal border-none outline-none'>
                                                                <div className='modal-box rounded'>
                                                                        <div className='vintage-header -mx-6 -mt-6 mb-4 px-4 py-3'>
                                                                                <h3 className='font-bold text-lg text-center'>Comments</h3>
                                                                        </div>
                                                                        <div className='flex flex-col gap-3 max-h-60 overflow-auto'>
                                                                                {post.comments.length === 0 && (
                                                                                        <p className='text-sm text-soil text-center py-4'>
                                                                                                No comments yet. Be the first!
                                                                                        </p>
                                                                                )}
                                                                                {post.comments.map((comment) => (
                                                                                        <div key={comment._id} className='flex gap-2 items-start p-2 rounded bg-wheat'>
                                                                                                <div className='avatar'>
                                                                                                        <div className='w-8 rounded-full avatar-vintage overflow-hidden'>
                                                                                                                <img
                                                                                                                        src={comment.user.profileImg || "/avatar-placeholder.png"}
                                                                                                                />
                                                                                                        </div>
                                                                                                </div>
                                                                                                <div className='flex flex-col'>
                                                                                                        <div className='flex items-center gap-2'>
                                                                                                                <span className='font-bold text-bark text-sm'>{comment.user.fullName}</span>
                                                                                                                <span className='text-soil text-xs'>
                                                                                                                        @{comment.user.name}
                                                                                                                </span>
                                                                                                        </div>
                                                                                                        <div className='text-sm text-bark'>{comment.text}</div>
                                                                                                </div>
                                                                                        </div>
                                                                                ))}
                                                                        </div>
                                                                        <form
                                                                                className='flex gap-2 items-center mt-4 border-t-4 border-soil pt-4'
                                                                                onSubmit={handlePostComment}
                                                                        >
                                                                                <textarea
                                                                                        className='textarea w-full p-2 rounded text-md resize-none'
                                                                                        placeholder='Add a comment...'
                                                                                        value={comment}
                                                                                        onChange={(e) => setComment(e.target.value)}
                                                                                />
                                                                                <button className='vintage-btn-primary rounded text-sm px-4 py-2'>
                                                                                        {isCommenting ? (
                                                                                                <span className='loading loading-spinner loading-sm'></span>
                                                                                        ) : (
                                                                                                "Post"
                                                                                        )}
                                                                                </button>
                                                                        </form>
                                                                </div>
                                                                <form method='dialog' className='modal-backdrop'>
                                                                        <button className='outline-none'>close</button>
                                                                </form>
                                                        </dialog>
                                                        <div className='flex gap-1 items-center group cursor-pointer'>
                                                                <BiRepost className='w-5 h-5 text-soil group-hover:text-moss transition-colors' />
                                                                <span className='text-sm text-soil group-hover:text-moss transition-colors'>0</span>
                                                        </div>
                                                        <div className='flex gap-1 items-center group cursor-pointer' onClick={handleLikePost}>
                                                                {isLiking && <LoadingSpinner size='sm' />}
                                                                {!isLiked && !isLiking && (
                                                                        <FaRegHeart className='w-4 h-4 cursor-pointer text-soil group-hover:text-rust transition-colors' />
                                                                )}
                                                                {isLiked && !isLiking && (
                                                                        <FaRegHeart className='w-4 h-4 cursor-pointer text-rust' />
                                                                )}

                                                                <span
                                                                        className={`text-sm transition-colors ${
                                                                                isLiked ? "text-rust" : "text-soil group-hover:text-rust"
                                                                        }`}
                                                                >
                                                                        {post.likes.length}
                                                                </span>
                                                                
                                                                {post.total_coin_on_post > 0 && (
                                                                        <div className='flex items-center gap-1 ml-2 pool-display py-1 px-2 rounded'>
                                                                                <span className='text-xs'>💰</span>
                                                                                <span className='text-xs text-rust font-bold'>
                                                                                        {post.total_coin_on_post}
                                                                                </span>
                                                                        </div>
                                                                )}
                                                        </div>
                                                </div>
                                                <div className='flex w-1/3 justify-end gap-2 items-center'>
                                                        <FaRegBookmark className='w-4 h-4 text-soil cursor-pointer hover:text-sepia transition-colors' />
                                                </div>
                                        </div>
                                </div>
                        </div>
                </>
        );
};
export default Post;
