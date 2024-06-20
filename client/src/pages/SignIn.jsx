import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '@/redux/userSlice';


function signup() {
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();
    const { toast } = useToast()
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/sign-in', formData);
            // console.log(response);
            if (response.data.success) {
                dispatch(setToken(response.data.token));
                dispatch(setUser(response.data.loggedInUser));
                toast({
                    title: "Success",
                    description: response.data.message,
                })

                navigate('/')
            }
        } catch (error) {
            console.log(error);
            toast({
                title: "Failure",
                description: error.response.data.message,
                variant: 'destructive'
            })
        }
    }

    return (
        <div className="max-w-md mx-auto mt-40 p-8 bg-white shadow-md rounded-lg">
            <h2 className="text-4xl font-bold text-center">Sign In</h2>
            <form onSubmit={handleSubmit}>

                <div className='mt-4'>
                    <Label className="text-gray-700">Email</Label>
                    <input
                        type="text"
                        id="email"
                        placeholder="Enter your email"
                        onChange={handleChange}
                        className='w-full p-2 border border-slate-300 rounded focus:outline-none'
                    />
                </div>

                <div className="mt-4">
                    <Label className="text-gray-700">Password</Label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        onChange={handleChange}
                        className='w-full p-2 border border-slate-300 rounded focus:outline-none'
                    />
                </div>

                <div className="text-center mt-4">
                    <Button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        Sign in
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default signup