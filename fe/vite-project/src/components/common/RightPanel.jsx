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
		<div className='hidden lg:block my-8 mx-2'>
			<div className='bg-gray-400 p-4 rounded-md sticky top-2'>
				<p className='font-bold'>Who to follow</p>
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
								className='flex items-center justify-between gap-4'
								key={user._id}
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user.profileImg || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate w-28'>
											{user.name}
										</span>
										<span className='text-sm text-slate-500'>@{user.name}</span>
									</div>
								</div>
								<div>
									<button
										className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
										onClick={(e) => {
											e.preventDefault();
										follow(user._id);
										}}
									>
										{isPending ? "Following..." : "Follow"}
									</button>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};
export default RightPanel;