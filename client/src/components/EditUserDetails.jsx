import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/userSlice'
import { useToast } from './ui/use-toast'
import { Label } from './ui/label'
import { Input } from './ui/input'

const EditUserDetails = ({ onClose, user }) => {
    console.log(user);
    const [formData, setFormData] = useState({
        name: user?.name,
        password: user?.password,
        profile_pic: user?.profile_pic
    })

    const { toast } = useToast();
    const dispatch = useDispatch()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('/api/user/update-user', formData);
            if (response.data.success) {
                toast({
                    title: "success",
                    description: response.data.message
                })
                dispatch(setUser(response.data.data))
                onClose()
            }

        } 
        catch (error) {
            console.log(error)
            toast({
                title: "failure",
                description: error.response.data.message,
                variant: 'destructive'
            })
        }
    }
    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center'>
            <div className='bg-white p-4 py-6 m-1 rounded w-full max-w-sm text-gray-600'>
                <h2 className='font-semibold'>Profile Details</h2>
                <p className='text-sm '>Edit user details</p>

                <form className='grid gap-3 mt-3' onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-1'>
                        <Label className='mb-2'>Name:</Label>
                        <Input
                            type='text'
                            id='name'
                            value={formData.name}
                            onChange={handleChange}
                            className='w-full py-1 px-2'
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <Label className='mb-2'>Password:</Label>
                        <Input
                            type='password'
                            id='password'
                            value={formData.password}
                            onChange={handleChange}
                            className='w-full py-1 px-2'
                        />
                    </div>
                    <div className='flex gap-2 w-fit ml-auto '>
                        <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Cancel</button>
                        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default React.memo(EditUserDetails)