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
			const response = await fetch('http://localhost:5000/api/auth/signup', {
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
		<div className='max-w-screen-2xl mx-auto flex h-screen px-10'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<XSvg className=' lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-24 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-white'>Join today.</h1>
					<label className='input input-bordered rounded flex items-center gap-1'>
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
					<div className='flex gap-4 flex-wrap'>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<MdDriveFileRenameOutline />
							<input
								type='text'
								className='grow'
								placeholder='Full Name'
								name='fullName'
								onChange={handleInputChange}
								value={formData.fullName}
							/>
						</label>
					</div>
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
					<button className='btn rounded-full btn-primary text-white'>
						{isPending ? "Signing Up..." : "Sign Up"}
					</button>
					{isError && <p className='text-red-500'>Something went wrong</p>}
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