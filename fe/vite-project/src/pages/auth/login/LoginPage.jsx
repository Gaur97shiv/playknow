import { useState } from "react";
import { Link } from "react-router-dom";

import Psvg from "../../../components/svgs/P";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import  {useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		name: "",
		password: "",
	});

	const {isError,isPending,mutate ,error }=useMutation({
		mutationFn:  async ({name, password }) => {
			try{
				const response = await fetch('http://localhost:5000/api/auth/login', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ name, password }),
				});
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				const data = await response.json();
			}catch (error) {
				console.error('Error during login:', error);
				throw error;
			}
			
		},
		onSuccess: (data) => {
			console.log('Login successful:', data);
			toast.success('Login successful');
			// Handle successful login, e.g., redirect or show a success message
		},
		onError: (error) => {
			console.error('Login failed:', error);
			toast.error('Login failed');
			// Handle login error, e.g., show an error message
		}
	
})

	const handleSubmit = (e) => {
		e.preventDefault();
		mutate(formData)
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	

	

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<Psvg className='lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
					<Psvg className='w-24 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='text'
							className='grow'
							placeholder='username'
							name='name' // <-- change this from 'username' to 'name'
							onChange={handleInputChange}
							value={formData.name}
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
					<button className='btn rounded-full btn-primary text-white'>{
					isPending ? "Loading..." : "Login"}</button>
					{isError && <p className='text-red-500'>{error.message}</p>}
				</form>
				<div className='flex flex-col gap-2 mt-4'>
					<p className='text-white text-lg'>{"Don't"} have an account?</p>
					<Link to='/signup'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign up</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;