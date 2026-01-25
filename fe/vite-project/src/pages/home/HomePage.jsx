import { useState } from "react";

import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");

	return (
		<>
			<div className='flex-[4_4_0] mr-auto border-r-4 border-soil min-h-screen bg-sand'>
				<div className='flex w-full border-b-4 border-soil bg-wheat'>
					<div
						className={`tab-vintage flex justify-center flex-1 p-4 cursor-pointer relative text-sm ${
							feedType === "forYou" ? "active" : ""
						}`}
						onClick={() => setFeedType("forYou")}
					>
						For You
					</div>
					<div
						className={`tab-vintage flex justify-center flex-1 p-4 cursor-pointer relative text-sm ${
							feedType === "following" ? "active" : ""
						}`}
						onClick={() => setFeedType("following")}
					>
						Following
					</div>
				</div>
				<CreatePost />
				<Posts feedType ={feedType}/>
			</div>
		</>
	);
};
export default HomePage;
