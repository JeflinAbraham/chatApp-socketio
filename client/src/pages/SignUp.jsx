import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import axios from 'axios'

function signup() {
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();
    const { toast } = useToast()
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/sign-up', formData);
            console.log(response);
            if (response.data.success) {
                toast({
                    title: "Success",
                    description: response.data.message,
                })

                navigate('/sign-in')
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
            <h2 className="text-4xl font-bold text-center">Sign Up</h2>
            <form onSubmit={handleSubmit}>

                <div className='mt-4'>
                    <Label className="text-gray-700">Name</Label>
                    <Input
                        type="text"
                        id="name"
                        placeholder="Enter your name"
                        onChange={handleChange}
                    />
                </div>

                <div className='mt-4'>
                    <Label className="text-gray-700">Email</Label>
                    <Input
                        type="text"
                        id="email"
                        placeholder="Enter your email"
                        onChange={handleChange}
                    />
                </div>

                <div className="mt-4">
                    <Label className="text-gray-700">Password</Label>
                    <Input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        onChange={handleChange}
                    />
                </div>

                <div className="text-center mt-4">
                    <Button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        Sign up
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default signup