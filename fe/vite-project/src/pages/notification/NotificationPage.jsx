import { Link, UNSAFE_FetchersContext } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

const NotificationPage = () => {
	const queryClient = useQueryClient();
	const {data:notifications,isLoading}=useQuery({
		queryKey:["notifications"],
		queryFn: async()=>{
           try {
			const res=await fetch("/api/notifications")
			const data=res.json();
			if(!res.ok){
              throw new Error(data.error);
			}
			return  data;
		   } catch (error) {
			console.log("error in the notification page")
		   }
		}
	})

	const {mutate:deleteNotifications}=useMutation({
		mutationFn:async()=>{
			try {
				const res=await fetch("/api/notifications",{
					method:"DELETE"
				})
				const data=res.json();
				if(!res.ok){
					throw new Error(data.error)
				}
				return data;
			} catch (error) {
				console.log("error in deleting the notifications")
			}
		},
		onSuccess:()=>{
			queryClient.invalidateQueries({queryKey:["notifications"]})
		}
	}
	)


	return (
		<>
			<div className='flex-[4_4_0] border-l border-r border-royal-gold/30 min-h-screen'>
				<div className='flex justify-between items-center p-4 border-b border-royal-gold/30 bg-gradient-to-r from-transparent via-base-200/50 to-transparent'>
					<div className='flex items-center gap-2'>
						<span className='text-xl'>🔔</span>
						<p className='font-future text-royal-gold tracking-wide'>Notifications</p>
					</div>
					<div className='dropdown dropdown-end'>
						<div tabIndex={0} role='button' className='p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer'>
							<IoSettingsOutline className='w-5 h-5 text-gray-400 hover:text-neon-cyan transition-colors' />
						</div>
						<ul
							tabIndex={0}
							className='dropdown-content z-[1] menu p-2 shadow-lg right-panel-card rounded-lg w-56'
						>
							<li>
								<a onClick={deleteNotifications} className='text-cream hover:text-neon-pink transition-colors'>
									Delete all notifications
								</a>
							</li>
						</ul>
					</div>
				</div>
				{isLoading && (
					<div className='flex justify-center h-full items-center py-20'>
						<LoadingSpinner size='lg' />
					</div>
				)}
				{notifications?.length === 0 && (
					<div className='text-center p-8'>
						<span className='text-4xl mb-4 block'>📭</span>
						<p className='font-future text-gray-400 tracking-wide'>No notifications yet</p>
					</div>
				)}
				{notifications?.map((notification) => (
					<div className='post-card border-b border-royal-gold/20' key={notification._id}>
						<div className='flex gap-3 p-4 items-center'>
							{notification.type === "follow" && (
								<div className='p-2 rounded-full bg-india-green/20'>
									<FaUser className='w-5 h-5 text-india-green' />
								</div>
							)}
							{notification.type === "like" && (
								<div className='p-2 rounded-full bg-neon-pink/20'>
									<FaHeart className='w-5 h-5 text-neon-pink' />
								</div>
							)}
							<Link to={`/profile/${notification.from.username}`} className='flex items-center gap-3 flex-1'>
								<div className='avatar'>
									<div className='w-10 rounded-full avatar-vintage overflow-hidden'>
										<img src={notification.from.profileImg || "/avatar-placeholder.png"} />
									</div>
								</div>
								<div className='flex flex-col'>
									<span className='font-bold text-cream'>@{notification.from.username}</span>
									<span className='text-gray-400 text-sm'>
										{notification.type === "follow" ? "followed you" : "liked your post"}
									</span>
								</div>
							</Link>
						</div>
					</div>
				))}
			</div>
		</>
	);
};
export default NotificationPage;
