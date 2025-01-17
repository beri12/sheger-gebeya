import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import {Link, useLocation, useNavigate } from 'react-router-dom';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummartApi';
import AxiosToastError from '../utils/AxiosToastError';

const ResetPassword = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [data, setData] = useState({
        email : "",
        newPassword : "",
        confirmPassword : ""
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const valideValue = Object.values(data).every(el => el)

    useEffect(()=>{
        if(!(location?.state?.data?.sucess)){
            navigate("/")
        }

        if(location?.state?.email){
            setData((prev) => {
                return {
                    ...prev,
                    email : location?.state?.email
                }
            })
        }
    },[])

    const handleChange = (e) => {
        const { name, value} = e.target
        
        setData((prev)=> {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    console.log("data reset password", data)

    const handleSubmit = async(e)=>{
        e.preventdefault()

        ///optional 
        if(data.newPassword !== data.confirmPassword){
            toast.error("New password and confirm password must be same.")
        }

        try {
            const response = await Axios({
                ...SummaryApi.resetPassword, // chaneg
                data : data
            })

            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.sucess){
                toast.sucess(response.data.message)
                navigate("/login")
                setData({
                    email : "",
                    newPassword : "",
                    confirmPassword : ""
                })

    
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }
  return (
  <section className='w-full container mx-auto px-2'>
    <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
        <p className='font-semibold text-lg'>Enter your Password</p>
        <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
            <div className='grid gap-1'>
                <label htmlFor='newPassword'>New Password :</label>
                <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
                    <input
                    type={showPassword ? "text" : "password"}
                    id='password'
                    className='w-full outline-none'
                    name='newPassword'
                    value={data.newPassword}
                    onChange={handleChange}
                    placeholder='Enter your new password'
                    />
                    <div onClick={() => setShowPassword(prev => !prev)} className='cursor-pointer'>

                        {

                            showPassword ? (
                                <FaRegEye />
                            ) : (
                                <FaRegEyeSlash />

                            )
                        }
                    </div>

                </div>

            </div>

            <div className='grid gap-1'>
                <label htmlFor='confirmPassword'>Confirm Password :</label>
                <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200'>
                    <input
                    type={showConfirmPassword ? "text" : "password"}
                    id='password'
                    className='w-full outline-none'
                    name='confirmPassword'
                    value={data.confirmPassword}
                    onChange={handleChange}
                    placeholder='Enter your confirm password'
                    />
                    <div onClick={() => setShowConfirmPassword(prev => !prev)} className='cursot-pointer'>

                        {

                            showConfirmPassword ? (
                                <FaRegEye />
                            ) : (
                                <FaRegEyeSlash />
                            )
                        }
                    </div>

                </div>
            </div>

            <button disabled={!valideValue} className={` ${valideValue ? " bg-green-800 hover:bg-green-700" : "bg-gray-500"} text-white py-2 rounded font-semibold my-3 tracking-wide`}>Change Password</button>

        </form>

        <p>
            Already have account? <Link to={"/login"} className='font-semibold  text-green-700 hover:text-green-800'>Login</Link>
        </p>



    </div>

  </section>
  )
}

export default ResetPassword