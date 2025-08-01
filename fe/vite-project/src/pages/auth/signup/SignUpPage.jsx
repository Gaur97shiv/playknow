import { Link } from "react-router-dom";
import { useState } from "react";
import PSvg from "../../../components/svgs/P"; 
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../../../redux/authSlice"; // <-- update import

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
    });

    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        mutate(formData);
    };

    const { mutate, isError, isPending, error } = useMutation({
        mutationFn: async ({ email, username, password }) => {
            try {
                const response = await fetch("http://localhost:5000/api/auth/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include", // Ensure cookies are sent!
                    body: JSON.stringify({ name: username, email, password }),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to signup");
                }
                const data = await response.json();
                return data;
            } catch (err) {
                toast.error("Signup failed. Please try again.");
                console.error("Error during signup:", err);
                throw err;
            }
        },
        onSuccess: (data) => {
            toast.success("Signup successful!");
            dispatch(setAuthUser(data.savedUser)); // <-- update slice directly
            // Optionally: window.location.reload() or redirect
        }
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className='max-w-screen-xl mx-auto flex h-screen px-10'>
            <div className='flex-1 hidden lg:flex items-center  justify-center'>
                <PSvg className='lg:w-2/3 fill-white' /> 
            </div>
            <div className='flex-1 flex flex-col justify-center items-center'>
                <form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
                    <PSvg className='w-24 lg:hidden fill-white' />
                    <h1 className='text-4xl font-extrabold text-white'>Join today.</h1>
                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <MdOutlineMail />
                        <input
                            type='email'
                            className='grow'
                            placeholder='Email'
                            name='email'
                            onChange={handleInputChange}
                            value={formData.email}
                        />
                    </label>
                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <FaUser />
                        <input
                            type='text'
                            className='grow'
                            placeholder='Username'
                            name='username'
                            onChange={handleInputChange}
                            value={formData.username}
                        />
                    </label>
                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <MdPassword />
                        <input
                            type='password'
                            className='grow'
                            placeholder='Password'
                            name='password'
                            onChange={handleInputChange}
                            value={formData.password}
                        />
                    </label>
                    <button className='btn rounded-full btn-primary text-white'>{isPending ? "Loading.... " : "Signup"}</button>
                    {isError && <p className='text-red-500'>{error?.message || "Something went wrong"}</p>}
                </form>
                <div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
                    <p className='text-white text-lg'>Already have an account?</p>
                    <Link to='/login'>
                        <button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign in</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
export default SignUpPage;