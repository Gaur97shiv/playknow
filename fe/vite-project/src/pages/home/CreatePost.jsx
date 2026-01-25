import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import {  useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const CreatePost = () => {
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);

	const imgRef = useRef(null);
    const {data:authUser}=useQuery({queryKey: ['authUser']})
	const queryClient=useQueryClient();

const { mutate: createPost ,isPending } = useMutation({
  mutationFn: async ({ text, img }) => {
    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({content: text, image: img}),
      });

      if (!res.ok) throw new Error("Failed to create post");

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },
  onSuccess:(data) =>{
	setText("");
	setImg(null);
   toast.success("Post created successfully");
   queryClient.invalidateQueries({ queryKey: ['posts'] });
   queryClient.invalidateQueries({ queryKey: ['authUser'] });
   queryClient.invalidateQueries({ queryKey: ['userBalance'] });
   queryClient.invalidateQueries({ queryKey: ['dailyPool'] });
   
   if (data.balance !== undefined) {
     toast.success(`Remaining balance: ${data.balance} coins`);
   }
  }
});


	const handleSubmit = (e) => {
		e.preventDefault();
		createPost({text, img});
	};

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

	return (
		<div className='post-card flex p-4 items-start gap-4 border-b-2 border-royal-gold/30'>
			<div className='avatar'>
				<div className='w-10 rounded-full avatar-vintage overflow-hidden'>
					<img src={authUser.profileImg || "/avatar-placeholder.png"} />
				</div>
			</div>
			<form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
				<textarea
					className='textarea w-full p-2 text-lg resize-none bg-transparent border-none focus:outline-none text-cream placeholder-gray-500'
					placeholder='Share your thoughts...'
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				{img && (
					<div className='relative w-72 mx-auto'>
						<IoCloseSharp
							className='absolute top-2 right-2 text-white bg-black/70 rounded-full w-6 h-6 cursor-pointer p-1 hover:bg-neon-pink transition-colors'
							onClick={() => {
								setImg(null);
								imgRef.current.value = null;
							}}
						/>
						<img src={img} className='w-full mx-auto h-72 object-contain rounded-lg border-2 border-royal-gold/30' />
					</div>
				)}

				<div className='flex justify-between border-t py-3 border-t-royal-gold/30'>
					<div className='flex gap-3 items-center'>
						<CiImageOn
							className='w-6 h-6 cursor-pointer text-saffron hover:text-royal-gold transition-colors'
							onClick={() => imgRef.current.click()}
						/>
						<BsEmojiSmileFill className='w-5 h-5 cursor-pointer text-saffron hover:text-royal-gold transition-colors' />
					</div>
					<input type='file' accept='image/*' hidden ref={imgRef} onChange={handleImgChange} />
					<button className='vintage-btn rounded-lg text-sm px-5 py-2'>
						{isPending ? "Posting..." : "Post"}
					</button>
				</div>
			
			</form>
		</div>
	);
};
export default CreatePost;
