import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts } from "../../redux/postSlice";
import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";

const Posts = ({ feedType, username, userId }) => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts({ feedType, username, userId }));
  }, [feedType, username, userId, dispatch]);

  return (
    <>
      {loading && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!loading && posts.length === 0 && (
        <p className="text-center my-4 text-gray-400">
          No posts in this tab. Switch 👻
        </p>
      )}
      {!loading && posts.length > 0 && (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
      {error && (
        <p className="text-red-500 text-center mt-4">
          {error?.message || String(error)}
        </p>
      )}
    </>
  );
};

export default Posts;
