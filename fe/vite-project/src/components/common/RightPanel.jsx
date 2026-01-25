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
			<div className='right-panel-card p-4 rounded sticky top-4'>
				<div className='vintage-header -mx-4 -mt-4 mb-4 px-4 py-3 rounded-t'>
					<p className='font-bold text-center'>Who to Follow</p>
				</div>
				<div className='flex flex-col gap-3'>
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
								className='flex items-center justify-between gap-3 p-2 rounded hover:bg-cream-dark transition-colors'
								key={user._id}
							>
								<div className='flex gap-3 items-center'>
									<div className='avatar'>
										<div className='w-10 rounded-full avatar-vintage overflow-hidden'>
											<img src={user.profileImg || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-bold text-coffee text-sm truncate w-24'>
											{user.name}
										</span>
										<span className='text-xs text-vintage-brown'>@{user.name}</span>
									</div>
								</div>
								<div>
									<button
										className='vintage-btn text-xs px-3 py-1.5 rounded'
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
				
				<hr className='vintage-divider my-4' />
				
				<div className='text-center'>
					<p className='text-xs text-vintage-brown' style={{fontFamily: 'Arial, sans-serif'}}>
						You are visitor #<span className='text-vintage-orange font-bold'>000,042</span>
					</p>
					<div className='flex justify-center gap-1 mt-2'>
						<div className='w-2 h-2 bg-vintage-orange rounded-full'></div>
						<div className='w-2 h-2 bg-vintage-green rounded-full'></div>
						<div className='w-2 h-2 bg-vintage-blue rounded-full'></div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default RightPanel;
