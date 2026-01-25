import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { useQuery } from "@tanstack/react-query";
import useFollow from "../../hooks/useFollow";

const RightPanel = () => {

	const {data:suggestedUser,isLoading }=useQuery({
		queryKey: ["suggestedUser"],
		queryFn: async () => {
			try {
				const res=await fetch('/api/user/suggested');
				if (!res.ok) {
					throw new Error("Failed to fetch suggested users");
				}
				const data = await res.json();
				return data;
			} catch (error) {
				console.error("Error fetching suggested users:", error);
				throw error;
			}

	}
})

const { follow, isPending } = useFollow();

	return (
		<div className='hidden lg:block my-6 mx-3 w-72'>
			<div className='right-panel-card p-5 rounded-xl sticky top-4 decorative-corner'>
				<div className='flex items-center gap-2 mb-4'>
					<span className='text-xl'>👥</span>
					<p className='font-future text-royal-gold text-sm tracking-wide'>Who to Follow</p>
				</div>
				<div className='flex flex-col gap-4'>
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!isLoading &&
						suggestedUser?.map((user) => (
							<Link
								to={`/profile/${user.name}`}
								className='flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-white/5 transition-all duration-300'
								key={user._id}
							>
								<div className='flex gap-3 items-center'>
									<div className='avatar'>
										<div className='w-10 rounded-full avatar-vintage overflow-hidden'>
											<img src={user.profileImg || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold text-cream text-sm truncate w-24'>
											{user.name}
										</span>
										<span className='text-xs text-gray-500'>@{user.name}</span>
									</div>
								</div>
								<div>
									<button
										className='vintage-btn text-xs px-3 py-1.5 rounded-lg'
										onClick={(e) => {
											e.preventDefault();
										follow(user._id);
										}}
									>
										{isPending ? "..." : "Follow"}
									</button>
								</div>
							</Link>
						))}
				</div>
				
				<div className='mt-6 pt-4 border-t border-royal-gold/30'>
					<p className='text-xs text-gray-500 font-future tracking-wider text-center'>
						ENGAGE & EARN
					</p>
					<div className='flex justify-center gap-1 mt-2'>
						<span className='w-1.5 h-1.5 rounded-full bg-saffron'></span>
						<span className='w-1.5 h-1.5 rounded-full bg-white'></span>
						<span className='w-1.5 h-1.5 rounded-full bg-india-green'></span>
					</div>
				</div>
			</div>
		</div>
	);
};
export default RightPanel;
