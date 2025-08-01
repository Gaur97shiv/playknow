import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoCloseSharp } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { createPost, editPost, setEditingPost } from "../../redux/postSlice";
import { toast } from "react-hot-toast";

const CreatePost = () => {
  const dispatch = useDispatch();
  const { editingPost, loading, error } = useSelector((state) => state.posts);
  const { authUser } = useSelector((state) => state.auth);

  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    if (editingPost) {
      setText(editingPost.content || "");
      setImg(editingPost.img || null);
    }
  }, [editingPost]);

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed && !img) return;

    if (editingPost) {
      dispatch(editPost({ ...editingPost, content: trimmed, img }));
      toast.success("Post updated");
    } else {
      dispatch(createPost({ content: trimmed, img }));
      toast.success("Post created");
    }

    setText("");
    setImg(null);
    if (imgRef.current) imgRef.current.value = null;
    dispatch(setEditingPost(null));
  };

  const handleCancelEdit = () => {
    dispatch(setEditingPost(null));
    setText("");
    setImg(null);
    if (imgRef.current) imgRef.current.value = null;
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img src={authUser?.profileImg || "/avatar-placeholder.png"} />
        </div>
      </div>

      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none border-gray-800"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {img && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImg(null);
                if (imgRef.current) imgRef.current.value = null;
              }}
            />
            <img src={img} className="w-full mx-auto h-72 object-contain rounded" />
          </div>
        )}

        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current?.click()}
            />
            <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" />
          </div>

          <input
            type="file"
            accept="image/*"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
          />

          <div className="flex gap-2">
            {editingPost && (
              <button
                type="button"
                className="text-sm text-gray-400 hover:underline"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary rounded-full btn-sm text-white px-4"
            >
              {loading ? (editingPost ? "Updating..." : "Posting...") : editingPost ? "Update" : "Post"}
            </button>
          </div>
        </div>

        {error && <div className="text-red-500">{String(error)}</div>}
      </form>
    </div>
  );
};

export default CreatePost;
