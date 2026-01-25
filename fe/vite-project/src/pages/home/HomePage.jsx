import { useState } from "react";

import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");

	return (
		<>
			<div className='flex-[4_4_0] mr-auto border-r border-royal-gold/30 min-h-screen'>
				<div className='flex w-full border-b border-royal-gold/30 bg-gradient-to-r from-transparent via-base-200/50 to-transparent'>
					<div
						className={`tab-vintage flex justify-center flex-1 p-4 cursor-pointer relative text-sm ${
							feedType === "forYou" ? "text-saffron" : "text-gray-400"
						}`}
						onClick={() => setFeedType("forYou")}
					>
						For You
						{feedType === "forYou" && (
							<div className='absolute bottom-0 w-12 h-1 rounded-full bg-gradient-to-r from-saffron to-royal-gold'></div>
						)}
					</div>
					<div
						className={`tab-vintage flex justify-center flex-1 p-4 cursor-pointer relative text-sm ${
							feedType === "following" ? "text-india-green" : "text-gray-400"
						}`}
						onClick={() => setFeedType("following")}
					>
						Following
						{feedType === "following" && (
							<div className='absolute bottom-0 w-12 h-1 rounded-full bg-gradient-to-r from-india-green to-neon-green'></div>
						)}
					</div>
				</div>
				<CreatePost />
				<Posts feedType ={feedType}/>
			</div>
		</>
	);
};
export default HomePage;
