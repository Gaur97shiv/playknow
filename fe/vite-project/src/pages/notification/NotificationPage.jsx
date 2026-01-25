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
			<div className='flex-[4_4_0] border-l-4 border-r-4 border-soil min-h-screen bg-sand'>
				<div className='vintage-header flex justify-between items-center p-4'>
					<div className='flex items-center gap-2'>
						<span className='text-xl'>📬</span>
						<p className='font-bold'>Notifications</p>
					</div>
					<div className='dropdown dropdown-end'>
						<div tabIndex={0} role='button' className='p-2 rounded hover:bg-white/20 transition-colors cursor-pointer'>
							<IoSettingsOutline className='w-5 h-5' />
						</div>
						<ul
							tabIndex={0}
							className='dropdown-content z-[1] menu p-2 shadow-lg vintage-card rounded w-56'
						>
							<li>
								<a onClick={deleteNotifications} className='text-bark hover:text-rust transition-colors'>
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
					<div className='text-center p-8 vintage-card-inset m-4 rounded'>
						<span className='text-4xl mb-4 block'>📭</span>
						<p className='text-bark font-bold'>No notifications yet</p>
						<p className='text-soil text-sm mt-1'>Check back later!</p>
					</div>
				)}
				{notifications?.map((notification) => (
					<div className='post-card' key={notification._id}>
						<div className='flex gap-3 p-4 items-center'>
							{notification.type === "follow" && (
								<div className='p-2 rounded-full bg-moss/30'>
									<FaUser className='w-5 h-5 text-moss' />
								</div>
							)}
							{notification.type === "like" && (
								<div className='p-2 rounded-full bg-rust/30'>
									<FaHeart className='w-5 h-5 text-rust' />
								</div>
							)}
							<Link to={`/profile/${notification.from.username}`} className='flex items-center gap-3 flex-1'>
								<div className='avatar'>
									<div className='w-10 rounded-full avatar-vintage overflow-hidden'>
										<img src={notification.from.profileImg || "/avatar-placeholder.png"} />
									</div>
								</div>
								<div className='flex flex-col'>
									<span className='font-bold text-bark'>@{notification.from.username}</span>
									<span className='text-soil text-sm'>
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
