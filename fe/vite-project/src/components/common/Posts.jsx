import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts } from "../../redux/postSlice";

const Posts = ({ feedType, username, userId }) => {
	const dispatch = useDispatch();

	const { posts, loading, error } = useSelector((state) => state.posts);

	useEffect(() => {
		dispatch(fetchPosts({ feedType, username, userId }));
	}, [feedType, username, userId, dispatch]);

	return (
		<>
			{loading && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!loading && posts.length === 0 && (
				<p className='text-center my-4'>No posts in this tab. Switch 👻</p>
			)}
			{!loading && posts.length > 0 && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
			{error && <p className='text-red-500 text-center'>{error}</p>}
		</>
	);
};

export default Posts;
