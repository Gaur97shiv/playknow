import XSvg from "../svgs/X";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation } from "@tanstack/react-query";

const Sidebar = () => {
  const { mutate: logout, isError, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error("Logout failed");
        }
        return res.json();
      } catch (error) {
        console.error("Logout error:", error);
      }
    },
    onSuccess: () => {
      toast.success("Logged out successfully");
    },
    onError: (error) => {
      toast.error(`Logout failed: ${error.message}`);
    },
  });

  const data = {
    fullName: "John Doe",
    username: "johndoe",
    profileImg: "/avatars/boy1.png",
  };

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
        <Link to="/" className="flex justify-center md:justify-start">
          <XSvg className="px-2 w-12 h-12 rounded-full fill-white hover:bg-white" />
        </Link>
        <ul className="flex flex-col gap-3 mt-4">
          <li className="flex justify-center md:justify-start">
            <Link
              to="/"
              className="flex gap-3 items-center hover:bg-white transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <MdHomeFilled className="w-8 h-8" />
              <span className="text-lg hidden md:block">Home</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to="/notifications"
              className="flex gap-3 items-center hover:bg-white transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <IoNotifications className="w-6 h-6" />
              <span className="text-lg hidden md:block">Notifications</span>
            </Link>
          </li>
          <li className="flex justify-center md:justify-start">
            <Link
              to={`/profile/${data?.username}`}
              className="flex gap-3 items-center hover:bg-white transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <FaUser className="w-6 h-6" />
              <span className="text-lg hidden md:block">Profile</span>
            </Link>
          </li>
        </ul>
        {data && (
          <div className="mt-auto mb-10 flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:bg-red-400">
            {/* Profile Link */}
            <Link
              to={`/profile/${data.username}`}
              className="flex items-center gap-2 flex-1"
            >
              <div className="avatar hidden md:inline-flex">
                <div className="w-8 rounded-full">
                  <img
                    src={data?.profileImg || "/avatar-placeholder.png"}
                    alt="profile"
                  />
                </div>
              </div>
              <div className="hidden md:block">
                <p className="text-white font-bold text-sm w-20 truncate">
                  {data?.fullName}
                </p>
                <p className="text-white text-sm">@{data?.username}</p>
              </div>
            </Link>
            {/* Logout Button */}
            <button
              onClick={logout}
              className="p-2 hover:bg-red-500 rounded-full transition-colors duration-200"
              title="Logout"
            >
              <BiLogOut className="w-5 h-5 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;