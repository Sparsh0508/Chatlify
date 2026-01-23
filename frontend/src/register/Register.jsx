import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const Register = () => {
    const navigate = useNavigate()
    const { setAuthUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [inputData, setInputData] = useState({})

    const handelInput = (e) => {
        setInputData({
            ...inputData, [e.target.id]: e.target.value
        })
    }

    const selectGender = (selectGender) => {
        setInputData((prev) => ({
            ...prev, gender: selectGender === inputData.gender ? '' : selectGender
        }))
    }

    const handelSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        if (inputData.password !== inputData.confpassword) {
            setLoading(false)
            return toast.error("Passwords don't match")
        }
        if (!inputData.gender) {
            setLoading(false)
            return toast.error("Please select a gender")
        }
        try {
            const register = await axios.post(`/api/auth/register`, inputData);
            const data = register.data;
            if (data.success === false) {
                setLoading(false)
                toast.error(data.message)
                console.log(data.message);
            }
            toast.success(data?.message)
            localStorage.setItem('chatapp', JSON.stringify(data))
            setAuthUser(data)
            setLoading(false)
            navigate('/login')
        } catch (error) {
            setLoading(false)
            console.log(error);
            toast.error(error?.response?.data?.message)
        }
    }

    return (
        <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
            <div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 border border-gray-100'>
                <h1 className='text-3xl font-semibold text-center text-gray-300'>
                    Register <span className='text-blue-500'> Chatlify </span>
                </h1>

                <form onSubmit={handelSubmit} className="flex flex-col gap-4 mt-4">
                    <div>
                        <label className='label p-2'>
                            <span className='text-base label-text text-gray-300'>Full Name</span>
                        </label>
                        <label className="input input-bordered flex items-center gap-2">
                            <FaUser className="text-gray-500" />
                            <input
                                id='fullname'
                                type='text'
                                onChange={handelInput}
                                placeholder='John Doe'
                                required
                                className='grow' />
                        </label>
                    </div>

                    <div>
                        <label className='label p-2'>
                            <span className='text-base label-text text-gray-300'>Username</span>
                        </label>
                        <label className="input input-bordered flex items-center gap-2">
                            <FaUser className="text-gray-500" />
                            <input
                                id='username'
                                type='text'
                                onChange={handelInput}
                                placeholder='johndoe'
                                required
                                className='grow' />
                        </label>
                    </div>

                    <div>
                        <label className='label p-2'>
                            <span className='text-base label-text text-gray-300'>Email</span>
                        </label>
                        <label className="input input-bordered flex items-center gap-2">
                            <FaEnvelope className="text-gray-500" />
                            <input
                                id='email'
                                type='email'
                                onChange={handelInput}
                                placeholder='john@example.com'
                                required
                                className='grow' />
                        </label>
                    </div>

                    <div>
                        <label className='label p-2'>
                            <span className='text-base label-text text-gray-300'>Password</span>
                        </label>
                        <label className="input input-bordered flex items-center gap-2">
                            <FaLock className="text-gray-500" />
                            <input
                                id='password'
                                type='password'
                                onChange={handelInput}
                                placeholder='Enter Password'
                                required
                                className='grow' />
                        </label>
                    </div>

                    <div>
                        <label className='label p-2'>
                            <span className='text-base label-text text-gray-300'>Confirm Password</span>
                        </label>
                        <label className="input input-bordered flex items-center gap-2">
                            <FaLock className="text-gray-500" />
                            <input
                                id='confpassword'
                                type='password'
                                onChange={handelInput}
                                placeholder='Confirm Password'
                                required
                                className='grow' />
                        </label>
                    </div>

                    {/* Gender Checkbox */}
                    <div className="flex gap-2">
                        <div className="form-control">
                            <label className={`label gap-2 cursor-pointer ${inputData.gender === "male" ? "selected" : ""}`}>
                                <span className="label-text text-gray-300">Male</span>
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary border-gray-400"
                                    checked={inputData.gender === "male"}
                                    onChange={() => selectGender("male")}
                                />
                            </label>
                        </div>
                        <div className="form-control">
                            <label className={`label gap-2 cursor-pointer ${inputData.gender === "female" ? "selected" : ""}`}>
                                <span className="label-text text-gray-300">Female</span>
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary border-gray-400"
                                    checked={inputData.gender === "female"}
                                    onChange={() => selectGender("female")}
                                />
                            </label>
                        </div>
                    </div>

                    <Link to={'/login'} className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block text-gray-300'>
                        Already have an account?
                    </Link>

                    <div>
                        <button className='btn btn-block btn-primary btn-sm mt-2' disabled={loading}>
                            {loading ? <span className="loading loading-spinner"></span> : "Register"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register