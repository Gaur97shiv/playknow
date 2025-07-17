import Psvg from "../svgs/P";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { logoutAuthUser } from "../../redux/authSlice"; 

const Sidebar = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const { mutate, error } = useMutation({
        mutationFn: async () => {
            try {
                const res = await fetch('http://localhost:5000/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                if (!res.ok) {
                    throw new Error('Logout failed');
                }
                return await res.json();
            } catch (err) {
                console.error("Logout failed", err);
                throw err;
            }
        },
        onSuccess: () => {
            toast.success("Logout successful");
            dispatch(logoutAuthUser()); 
        },
        onError: (err) => {
            console.error("Logout error:", err);
            toast.error("Logout failed");
        }
    });

    return (
        <div className="md:flex-[2_2_0] w-18 max-w-52">
            <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full bg-black">
                <Link to="/" className="flex justify-center md:justify-start">
                    <Psvg className="px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900" />
                </Link>
                <ul className="flex flex-col gap-3 mt-4 text-white">
                    <li className="flex justify-center md:justify-start">
                        <Link
                            to="/"
                            className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer text-white"
                        >
                            <MdHomeFilled className="w-8 h-8" />
                            <span className="text-lg hidden md:block">Home</span>
                        </Link>
                    </li>
                    <li className="flex justify-center md:justify-start">
                        <Link
                            to="/notifications"
                            className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer text-white"
                        >
                            <IoNotifications className="w-6 h-6" />
                            <span className="text-lg hidden md:block">Notifications</span>
                        </Link>
                    </li>
                    <li className="flex justify-center md:justify-start">
                        <Link
                            to={user ? `/profile/${user?.username}` : "/login"}
                            className="flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer text-white"
                        >
                            <FaUser className="w-6 h-6" />
                            <span className="text-lg hidden md:block">Profile</span>
                        </Link>
                    </li>
                </ul>
                {user && (
                    <div className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full cursor-pointer">
                        <div className="avatar hidden md:inline-flex">
                            <div className="w-8 rounded-full">
                                <img src={user?.profileImg || "/avatar-placeholder.png"} alt="profile" />
                            </div>
                        </div>
                        <div className="flex justify-between flex-1">
                            <div className="hidden md:block">
                                <p className="text-white font-bold text-sm w-20 truncate">{user?.fullName}</p>
                                <p className="text-slate-500 text-sm">@{user?.username}</p>
                            </div>
                            <BiLogOut
                                onClick={(e) => {
                                    e.preventDefault();
                                    mutate();
                                }}
                                className="w-5 h-5 cursor-pointer text-white"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;