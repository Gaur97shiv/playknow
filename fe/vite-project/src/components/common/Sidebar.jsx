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
					<XSvg className='w-10 h-10 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)] hover:drop-shadow-[0_0_25px_rgba(255,215,0,0.8)] transition-all duration-300' />
				</Link>
				
				<ul className='flex flex-col gap-2 mt-4 px-2'>
					{!poolLoading && dailyPool && (
						<li className='flex justify-center md:justify-start mb-2'>
							<div className='pool-display w-full'>
								<div className='flex items-center gap-2'>
									<span className='text-lg'>💰</span>
									<div className='flex flex-col'>
										<span className='text-xs text-royal-gold font-future font-bold'>
											Daily Pool
										</span>
										<span className='text-sm text-royal-gold font-bold'>
											{dailyPool.total_pool_coins || 0} coins
										</span>
									</div>
								</div>
								<span className='text-xs text-gray-400 hidden md:block mt-1'>
									{dailyPool.posts_count || 0} posts today
								</span>
							</div>
						</li>
					)}
					
					{!balanceLoading && userBalance && (
						<li className='flex justify-center md:justify-start mb-4'>
							<div className='balance-display w-full'>
								<div className='flex items-center gap-2'>
									<span className='text-lg'>🪙</span>
									<div className='flex flex-col'>
										<span className='text-xs text-india-green font-future font-bold'>
											My Balance
										</span>
										<span className='text-sm text-neon-green font-bold'>
											{userBalance.balance || 0} coins
										</span>
									</div>
								</div>
								<span className='text-xs text-gray-400 hidden md:block mt-1'>
									@{userBalance.userName}
								</span>
							</div>
						</li>
					)}
					
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/'
							className='sidebar-link flex gap-3 items-center rounded-lg py-3 pl-3 pr-4 w-full text-cream hover:text-saffron transition-colors'
						>
							<MdHomeFilled className='w-6 h-6' />
							<span className='text-base hidden md:block font-future tracking-wide'>Home</span>
						</Link>
					</li>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/notifications'
							className='sidebar-link flex gap-3 items-center rounded-lg py-3 pl-3 pr-4 w-full text-cream hover:text-saffron transition-colors'
						>
							<IoNotifications className='w-5 h-5' />
							<span className='text-base hidden md:block font-future tracking-wide'>Alerts</span>
						</Link>
					</li>

					<li className='flex justify-center md:justify-start'>
						<Link
							to={`/profile/${authUser?.name}`}
							className='sidebar-link flex gap-3 items-center rounded-lg py-3 pl-3 pr-4 w-full text-cream hover:text-saffron transition-colors'
						>
							<FaUser className='w-5 h-5' />
							<span className='text-base hidden md:block font-future tracking-wide'>Profile</span>
						</Link>
					</li>
				</ul>
				
				{authUser && (
					<div className='mt-auto mb-6 px-2'>
						<Link
							to={`/profile/${authUser.name}`}
							className='retro-card flex gap-3 items-center p-3 rounded-lg hover:border-saffron transition-all duration-300'
						>
							<div className='avatar hidden md:inline-flex'>
								<div className='w-10 rounded-full avatar-vintage overflow-hidden'>
									<img src={authUser?.profileImg || "/avatar-placeholder.png"} />
								</div>
							</div>
							<div className='flex justify-between flex-1 items-center'>
								<div className='hidden md:block'>
									<p className='text-cream font-bold text-sm w-20 truncate'>{authUser?.name}</p>
									<p className='text-gray-500 text-xs'>@{authUser?.name}</p>
								</div>
								<BiLogOut
									className='w-5 h-5 text-neon-pink hover:text-neon-cyan cursor-pointer transition-colors'
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
