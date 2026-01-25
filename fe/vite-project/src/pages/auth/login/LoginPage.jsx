import { useState } from "react";
import { Link } from "react-router-dom";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const LoginPage = () => {
        const [formData, setFormData] = useState({
                username: "",
                password: "",
        });
        const queryClient = useQueryClient();

        const {mutate:loginMutation ,isPending} = useMutation({
                mutationFn: async (formData) => {
                        try {
                        const response = await fetch("/api/auth/login", {
                                method: "POST",
                                headers: {
                                        "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                        name: formData.username,
                                        password: formData.password,
                                }
                                ),
                        });
                        if (!response.ok) {
                                console.log(response.error)
                                throw new Error("Failed to login");
                                
                        }
                        const data = await response.json();
                        console.log(data);
                        if (data.error) {
                                throw new Error(data.error);
                        }
                        
                }
                catch (error) {
                        console.error("Error during login:", error);
                        throw new Error(error.message || "Login failed");
                }
        },
                onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: ["authUser"] });
                },
                onError: (error) => {
                        toast.error(error.message || "Something went wrong");
                }
        })

        const handleSubmit = (e) => {
                e.preventDefault();
                loginMutation(formData);
        };

        const handleInputChange = (e) => {
                setFormData({ ...formData, [e.target.name]: e.target.value });
        };

        const isError = false;

        return (
                <div className='max-w-screen-xl mx-auto flex h-screen px-4'>
                        <div className='flex-1 hidden lg:flex items-center justify-center'>
                                <div className='relative decorative-corner p-8'>
                                        <XSvg className='lg:w-64 h-64 drop-shadow-[0_0_30px_rgba(255,215,0,0.5)]' />
                                        <div className='absolute -bottom-8 left-1/2 -translate-x-1/2 text-center'>
                                                <p className='font-future text-neon-cyan text-sm tracking-widest neon-text'>PLAY</p>
                                                <p className='font-future text-saffron text-xl tracking-widest' style={{textShadow: '0 0 10px #FF9933'}}>KNOW</p>
                                        </div>
                                </div>
                        </div>
                        <div className='flex-1 flex flex-col justify-center items-center'>
                                <form className='retro-card decorative-corner p-8 rounded-lg flex gap-5 flex-col min-w-[320px]' onSubmit={handleSubmit}>
                                        <XSvg className='w-20 lg:hidden mx-auto drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]' />
                                        <div className='text-center mb-2'>
                                                <h1 className='font-future text-3xl gold-text tracking-wide'>Welcome Back</h1>
                                                <p className='text-neon-cyan text-sm font-future tracking-widest mt-2 neon-text'>{"Let's"} go.</p>
                                        </div>
                                        
                                        <label className='cyber-input rounded-lg flex items-center gap-3 px-4 py-3'>
                                                <MdOutlineMail className='text-neon-cyan text-xl' />
                                                <input
                                                        type='text'
                                                        className='grow bg-transparent border-none outline-none text-white placeholder-gray-500'
                                                        placeholder='Username'
                                                        name='username'
                                                        onChange={handleInputChange}
                                                        value={formData.username}
                                                />
                                        </label>

                                        <label className='cyber-input rounded-lg flex items-center gap-3 px-4 py-3'>
                                                <MdPassword className='text-neon-cyan text-xl' />
                                                <input
                                                        type='password'
                                                        className='grow bg-transparent border-none outline-none text-white placeholder-gray-500'
                                                        placeholder='Password'
                                                        name='password'
                                                        onChange={handleInputChange}
                                                        value={formData.password}
                                                />
                                        </label>
                                        
                                        <button className='vintage-btn rounded-lg py-3 text-white mt-2'>
                                                {isPending ? "Logging in..." : "Login"}
                                        </button>
                                        {isError && <p className='text-neon-pink text-center'>Something went wrong</p>}
                                </form>
                                
                                <div className='flex flex-col gap-3 mt-6 text-center'>
                                        <p className='text-cream text-lg font-classic'>{"Don't"} have an account?</p>
                                        <Link to='/signup'>
                                                <button className='outline-btn rounded-lg px-8 py-2 min-w-[200px]'>Sign up</button>
                                        </Link>
                                </div>
                                
                                <div className='mt-8 text-center'>
                                        <p className='text-gray-500 text-xs font-future tracking-wider'>POWERED BY PLAYKNOW</p>
                                        <div className='flex justify-center gap-2 mt-2'>
                                                <span className='w-2 h-2 rounded-full bg-saffron animate-pulse'></span>
                                                <span className='w-2 h-2 rounded-full bg-white animate-pulse' style={{animationDelay: '0.2s'}}></span>
                                                <span className='w-2 h-2 rounded-full bg-india-green animate-pulse' style={{animationDelay: '0.4s'}}></span>
                                        </div>
                                </div>
                        </div>
                </div>
        );
};
export default LoginPage;
