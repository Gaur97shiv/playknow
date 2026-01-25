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
				<div className='decorative-border p-6 bg-cream'>
					<XSvg className='lg:w-48 h-48' />
					<div className='text-center mt-4'>
						<h2 className='text-2xl font-bold text-coffee' style={{fontFamily: 'Times New Roman, serif'}}>PlayKnow</h2>
						<p className='text-vintage-brown text-sm mt-1'>Engage & Earn</p>
					</div>
				</div>
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<div className='vintage-card p-8 min-w-[340px]'>
					<div className='vintage-header -mx-8 -mt-8 mb-6 px-6 py-4 rounded-t'>
						<h1 className='text-2xl font-bold text-center'>Welcome Back!</h1>
					</div>
					
					<XSvg className='w-16 lg:hidden mx-auto mb-4' />
					
					<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
						<div>
							<label className='block text-coffee text-sm font-bold mb-1' style={{fontFamily: 'Arial, sans-serif'}}>
								Username:
							</label>
							<div className='vintage-input rounded flex items-center gap-2'>
								<MdOutlineMail className='text-vintage-brown' />
								<input
									type='text'
									className='grow bg-transparent border-none outline-none'
									placeholder='Enter your username'
									name='username'
									onChange={handleInputChange}
									value={formData.username}
								/>
							</div>
						</div>

						<div>
							<label className='block text-coffee text-sm font-bold mb-1' style={{fontFamily: 'Arial, sans-serif'}}>
								Password:
							</label>
							<div className='vintage-input rounded flex items-center gap-2'>
								<MdPassword className='text-vintage-brown' />
								<input
									type='password'
									className='grow bg-transparent border-none outline-none'
									placeholder='Enter your password'
									name='password'
									onChange={handleInputChange}
									value={formData.password}
								/>
							</div>
						</div>
						
						<button className='vintage-btn-primary rounded mt-2'>
							{isPending ? "Signing In..." : "Sign In"}
						</button>
						{isError && <p className='text-vintage-red text-center text-sm'>Something went wrong</p>}
					</form>
				</div>
				
				<div className='vintage-card-raised p-4 mt-4 text-center'>
					<p className='text-coffee mb-2'>{"Don't"} have an account?</p>
					<Link to='/signup'>
						<button className='vintage-btn-secondary rounded px-6 py-2'>Create Account</button>
					</Link>
				</div>
				
				<div className='mt-6 text-center'>
					<p className='text-vintage-brown text-xs' style={{fontFamily: 'Arial, sans-serif'}}>
						Best viewed in Netscape Navigator 4.0 or Internet Explorer 5.0
					</p>
					<div className='flex justify-center gap-1 mt-2'>
						<div className='w-2 h-2 bg-vintage-orange rounded-full'></div>
						<div className='w-2 h-2 bg-vintage-green rounded-full'></div>
						<div className='w-2 h-2 bg-vintage-blue rounded-full'></div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;
