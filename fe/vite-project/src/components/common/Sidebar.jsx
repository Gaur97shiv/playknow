import XSvg from "../svgs/X";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useDailyPool from "../../hooks/useDailyPool";
import useUserBalance from "../../hooks/useUserBalance";

const Sidebar = () => {
	const queryClient = useQueryClient();
	const { dailyPool, isLoading: poolLoading } = useDailyPool();
	const { userBalance, isLoading: balanceLoading } = useUserBalance();
	
	const { mutate: logout } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/auth/logout", {
					method: "POST",
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: () => {
			toast.error("Logout failed");
		},
	});
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
 

	return (
		<div className='md:flex-[2_2_0] w-18 max-w-52'>
			<div className='vintage-sidebar sticky top-0 left-0 h-screen flex flex-col w-20 md:w-full'>
				<Link to='/' className='flex justify-center md:justify-start p-4'>
					<XSvg className='w-10 h-10' />
				</Link>
				
				<ul className='flex flex-col gap-2 mt-4 px-2'>
					{!poolLoading && dailyPool && (
						<li className='flex justify-center md:justify-start mb-2'>
							<div className='pool-display w-full rounded'>
								<div className='flex items-center gap-2'>
									<span className='text-lg'>💰</span>
									<div className='flex flex-col'>
										<span className='text-xs text-vintage-brown font-bold' style={{fontFamily: 'Arial, sans-serif'}}>
											Daily Pool
										</span>
										<span className='text-sm text-vintage-orange font-bold'>
											{dailyPool.total_pool_coins || 0} coins
										</span>
									</div>
								</div>
								<span className='text-xs text-coffee hidden md:block mt-1'>
									{dailyPool.posts_count || 0} posts today
								</span>
							</div>
						</li>
					)}
					
					{!balanceLoading && userBalance && (
						<li className='flex justify-center md:justify-start mb-4'>
							<div className='balance-display w-full rounded'>
								<div className='flex items-center gap-2'>
									<span className='text-lg'>🪙</span>
									<div className='flex flex-col'>
										<span className='text-xs text-vintage-green font-bold' style={{fontFamily: 'Arial, sans-serif'}}>
											My Balance
										</span>
										<span className='text-sm text-vintage-green font-bold'>
											{userBalance.balance || 0} coins
										</span>
									</div>
								</div>
								<span className='text-xs text-coffee hidden md:block mt-1'>
									@{userBalance.userName}
								</span>
							</div>
						</li>
					)}
					
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/'
							className='sidebar-link flex gap-3 items-center rounded py-3 pl-3 pr-4 w-full'
						>
							<MdHomeFilled className='w-6 h-6' />
							<span className='text-base hidden md:block font-bold' style={{fontFamily: 'Arial, sans-serif'}}>Home</span>
						</Link>
					</li>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/notifications'
							className='sidebar-link flex gap-3 items-center rounded py-3 pl-3 pr-4 w-full'
						>
							<IoNotifications className='w-5 h-5' />
							<span className='text-base hidden md:block font-bold' style={{fontFamily: 'Arial, sans-serif'}}>Notifications</span>
						</Link>
					</li>

					<li className='flex justify-center md:justify-start'>
						<Link
							to={`/profile/${authUser?.name}`}
							className='sidebar-link flex gap-3 items-center rounded py-3 pl-3 pr-4 w-full'
						>
							<FaUser className='w-5 h-5' />
							<span className='text-base hidden md:block font-bold' style={{fontFamily: 'Arial, sans-serif'}}>Profile</span>
						</Link>
					</li>
				</ul>
				
				{authUser && (
					<div className='mt-auto mb-6 px-2'>
						<Link
							to={`/profile/${authUser.name}`}
							className='vintage-card-raised flex gap-3 items-center p-3 rounded'
						>
							<div className='avatar hidden md:inline-flex'>
								<div className='w-10 rounded-full avatar-vintage overflow-hidden'>
									<img src={authUser?.profileImg || "/avatar-placeholder.png"} />
								</div>
							</div>
							<div className='flex justify-between flex-1 items-center'>
								<div className='hidden md:block'>
									<p className='text-coffee font-bold text-sm w-20 truncate'>{authUser?.name}</p>
									<p className='text-vintage-brown text-xs'>@{authUser?.name}</p>
								</div>
								<BiLogOut
									className='w-5 h-5 text-vintage-red hover:text-vintage-orange cursor-pointer transition-colors'
									onClick={(e) => {
										e.preventDefault();
										logout();
									}}
								/>
							</div>
						</Link>
					</div>
				)}
			</div>
		</div>
	);
};
export default Sidebar;
