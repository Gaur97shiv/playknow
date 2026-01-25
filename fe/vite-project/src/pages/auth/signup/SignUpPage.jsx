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
				<div className='decorative-border p-6'>
					<XSvg className='lg:w-52 h-52' />
					<div className='text-center mt-4'>
						<h2 className='text-2xl font-bold text-bark' style={{fontFamily: 'Times New Roman, serif'}}>Join PlayKnow</h2>
						<p className='text-soil text-sm mt-1'>Your Voice Has Value</p>
					</div>
				</div>
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<div className='vintage-card p-8 w-full max-w-md'>
					<div className='vintage-header -mx-8 -mt-8 mb-6 px-6 py-4'>
						<h1 className='text-2xl font-bold text-center'>Create Your Account</h1>
					</div>
					
					<XSvg className='w-16 lg:hidden mx-auto mb-4' />
					
					<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
						<div>
							<label className='block text-bark text-sm font-bold mb-1' style={{fontFamily: 'Arial, sans-serif'}}>
								Email Address:
							</label>
							<div className='vintage-input rounded flex items-center gap-2'>
								<MdOutlineMail className='text-soil' />
								<input
									type='email'
									className='grow bg-transparent border-none outline-none'
									placeholder='you@example.com'
									name='email'
									onChange={handleInputChange}
									value={formData.email}
								/>
							</div>
						</div>
						
						<div>
							<label className='block text-bark text-sm font-bold mb-1' style={{fontFamily: 'Arial, sans-serif'}}>
								Full Name:
							</label>
							<div className='vintage-input rounded flex items-center gap-2'>
								<MdDriveFileRenameOutline className='text-soil' />
								<input
									type='text'
									className='grow bg-transparent border-none outline-none'
									placeholder='Your full name'
									name='fullName'
									onChange={handleInputChange}
									value={formData.fullName}
								/>
							</div>
						</div>
						
						<div>
							<label className='block text-bark text-sm font-bold mb-1' style={{fontFamily: 'Arial, sans-serif'}}>
								Password:
							</label>
							<div className='vintage-input rounded flex items-center gap-2'>
								<MdPassword className='text-soil' />
								<input
									type='password'
									className='grow bg-transparent border-none outline-none'
									placeholder='Choose a password'
									name='password'
									onChange={handleInputChange}
									value={formData.password}
								/>
							</div>
						</div>
						
						<button className='vintage-btn-primary rounded mt-2'>
							{isPending ? "Creating Account..." : "Register Now"}
						</button>
						{isError && <p className='text-rust text-center text-sm'>Something went wrong</p>}
					</form>
				</div>
				
				<div className='vintage-card-raised p-4 mt-4 text-center rounded'>
					<p className='text-bark mb-2'>Already a member?</p>
					<Link to='/login'>
						<button className='vintage-btn-secondary rounded px-6 py-2'>Sign In</button>
					</Link>
				</div>
				
				<div className='mt-6 text-center'>
					<div className='marquee-style px-4 py-2 rounded'>
						*** FREE Registration *** Earn Coins for Every Post! ***
					</div>
				</div>
			</div>
		</div>
	);
};
export default SignUpPage;
