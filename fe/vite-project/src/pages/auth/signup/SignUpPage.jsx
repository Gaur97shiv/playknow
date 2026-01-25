import { Link } from "react-router-dom";
import { useState } from "react";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		fullName: "",
		password: "",
	});
	const {mutate ,isError, isPending  }= useMutation({
		mutationFn: async (formData) => {
			try {
			const response = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: formData.fullName,
                    email: formData.email,
                    password: formData.password}),
				});
			if (!response.ok) {
				const errorData = await response.json();  
                throw new Error(errorData.message || 'Signup failed');
			}
			const data = await response.json();
			console.log(data);
			if (data.error) {
				throw new Error(data.error);
			}
			return data;
		}
		catch (error) {
			console.error('Error during signup:', error);
			toast.error(error.message || 'Something went wrong');
		}
},
		onSuccess: (data) => {
			toast.success("Signup successful! Please log in.");
			setFormData({ email: "", fullName: "", password: "" });
		},
		onError: (error) => {
			toast.error(error.message || 'Something went wrong');
		},
	});


	const handleSubmit = (e) => {
		e.preventDefault();
		mutate(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};



	return (
		<div className='max-w-screen-2xl mx-auto flex h-screen px-6'>
			<div className='flex-1 hidden lg:flex items-center justify-center'>
				<div className='relative decorative-corner p-8'>
					<XSvg className='lg:w-72 h-72 drop-shadow-[0_0_30px_rgba(255,215,0,0.5)]' />
					<div className='absolute -bottom-8 left-1/2 -translate-x-1/2 text-center'>
						<p className='font-future text-neon-cyan text-sm tracking-widest neon-text'>JOIN THE</p>
						<p className='font-future text-saffron text-xl tracking-widest' style={{textShadow: '0 0 10px #FF9933'}}>REVOLUTION</p>
					</div>
				</div>
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='retro-card decorative-corner p-8 rounded-lg flex gap-5 flex-col w-full max-w-md' onSubmit={handleSubmit}>
					<XSvg className='w-20 lg:hidden mx-auto drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]' />
					<div className='text-center mb-2'>
						<h1 className='font-future text-3xl gold-text tracking-wide'>Create Account</h1>
						<p className='text-neon-cyan text-sm font-future tracking-widest mt-2 neon-text'>Join today.</p>
					</div>
					
					<label className='cyber-input rounded-lg flex items-center gap-3 px-4 py-3'>
						<MdOutlineMail className='text-neon-cyan text-xl' />
						<input
							type='email'
							className='grow bg-transparent border-none outline-none text-white placeholder-gray-500'
							placeholder='Email'
							name='email'
							onChange={handleInputChange}
							value={formData.email}
						/>
					</label>
					
					<label className='cyber-input rounded-lg flex items-center gap-3 px-4 py-3'>
						<MdDriveFileRenameOutline className='text-neon-cyan text-xl' />
						<input
							type='text'
							className='grow bg-transparent border-none outline-none text-white placeholder-gray-500'
							placeholder='Full Name'
							name='fullName'
							onChange={handleInputChange}
							value={formData.fullName}
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
						{isPending ? "Signing Up..." : "Sign Up"}
					</button>
					{isError && <p className='text-neon-pink text-center'>Something went wrong</p>}
				</form>
				
				<div className='flex flex-col gap-3 mt-6 text-center'>
					<p className='text-cream text-lg font-classic'>Already have an account?</p>
					<Link to='/login'>
						<button className='outline-btn rounded-lg px-8 py-2 min-w-[200px]'>Sign in</button>
					</Link>
				</div>
				
				<div className='mt-8 text-center'>
					<p className='text-gray-500 text-xs font-future tracking-wider'>EARN REWARDS FOR ENGAGEMENT</p>
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
export default SignUpPage;
