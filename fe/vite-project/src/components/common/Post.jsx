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
 const {data :authUser} =useQuery({queryKey : ["authUser"]})
 const queryClient=useQueryClient();

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
						<Link to={`/profile/${postOwner.name}`} className='font-bold text-cream hover:text-saffron transition-colors'>
							{postOwner.name}
						</Link>
						<span className='text-gray-500 flex gap-1 text-sm'>
							<Link to={`/profile/${postOwner.name}`} className='hover:text-neon-cyan transition-colors'>@{postOwner.name}</Link>
							<span>·</span>
							<span className='text-gray-600'>{formattedDate}</span>
						</span>
						{isMyPost && (
							<span className='flex justify-end flex-1'>
								<FaTrash className='cursor-pointer text-gray-500 hover:text-neon-pink transition-colors' onClick={handleDeletePost} />
								{isDeleting && <LoadingSpinner size="sm"/>}
							</span>
						)}
					</div>
					<div className='flex flex-col gap-3 overflow-hidden mt-2'>
						<span className='text-cream/90 leading-relaxed'>{post.content}</span>
						{post.img && (
							<img
								src={post.img}
								className='h-80 object-contain rounded-lg border-2 border-royal-gold/30 shadow-[0_0_20px_rgba(255,215,0,0.1)]'
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
								<FaRegComment className='w-4 h-4 text-gray-500 group-hover:text-neon-cyan transition-colors' />
								<span className='text-sm text-gray-500 group-hover:text-neon-cyan transition-colors'>
									{post.comments.length}
								</span>
							</div>
							<dialog id={`comments_modal${post._id}`} className='modal border-none outline-none'>
								<div className='modal-box rounded-xl'>
									<h3 className='font-future text-lg mb-4 gold-text tracking-wide'>COMMENTS</h3>
									<div className='flex flex-col gap-3 max-h-60 overflow-auto'>
										{post.comments.length === 0 && (
											<p className='text-sm text-gray-500'>
												No comments yet. Be the first one!
											</p>
										)}
										{post.comments.map((comment) => (
											<div key={comment._id} className='flex gap-2 items-start p-2 rounded-lg bg-white/5'>
												<div className='avatar'>
													<div className='w-8 rounded-full avatar-vintage overflow-hidden'>
														<img
															src={comment.user.profileImg || "/avatar-placeholder.png"}
														/>
													</div>
												</div>
												<div className='flex flex-col'>
													<div className='flex items-center gap-2'>
														<span className='font-bold text-cream text-sm'>{comment.user.fullName}</span>
														<span className='text-gray-500 text-xs'>
															@{comment.user.name}
														</span>
													</div>
													<div className='text-sm text-cream/80'>{comment.text}</div>
												</div>
											</div>
										))}
									</div>
									<form
										className='flex gap-2 items-center mt-4 border-t border-royal-gold/30 pt-4'
										onSubmit={handlePostComment}
									>
										<textarea
											className='textarea w-full p-2 rounded-lg text-md resize-none'
											placeholder='Add a comment...'
											value={comment}
											onChange={(e) => setComment(e.target.value)}
										/>
										<button className='vintage-btn rounded-lg text-sm px-4 py-2'>
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
								<BiRepost className='w-5 h-5 text-gray-500 group-hover:text-india-green transition-colors' />
								<span className='text-sm text-gray-500 group-hover:text-india-green transition-colors'>0</span>
							</div>
							<div className='flex gap-1 items-center group cursor-pointer' onClick={handleLikePost}>
								{isLiking && <LoadingSpinner size='sm' />}
								{!isLiked && !isLiking && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-gray-500 group-hover:text-neon-pink transition-colors' />
								)}
								{isLiked && !isLiking && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-neon-pink' />
								)}

								<span
									className={`text-sm transition-colors ${
										isLiked ? "text-neon-pink" : "text-gray-500 group-hover:text-neon-pink"
									}`}
								>
									{post.likes.length}
								</span>
								
								{post.total_coin_on_post > 0 && (
									<div className='flex items-center gap-1 ml-2 pool-display py-1 px-2'>
										<span className='text-xs'>💰</span>
										<span className='text-xs text-royal-gold font-bold'>
											{post.total_coin_on_post}
										</span>
									</div>
								)}
							</div>
						</div>
						<div className='flex w-1/3 justify-end gap-2 items-center'>
							<FaRegBookmark className='w-4 h-4 text-gray-500 cursor-pointer hover:text-royal-gold transition-colors' />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default Post;
