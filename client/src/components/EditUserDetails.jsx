import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/userSlice'
import { useToast } from './ui/use-toast'
import { Label } from './ui/label'
import { Input } from './ui/input'

import { app } from "@/firebase.js";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { Loader } from 'lucide-react'

const EditUserDetails = ({ onClose, user }) => {
    console.log(user);
    const [formData, setFormData] = useState({
        name: user?.name,
        password: user?.password,
        profile_pic: user?.profile_pic
    })

    const { toast } = useToast();
    const dispatch = useDispatch()
    const imagePickRef = useRef();
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        }
    }
    useEffect(() => {
        if (imageFile) {
            uploadFile();
        }
    }, [imageFile])


    // entire function is available on firebase->storage->web->upload files
    const uploadFile = () => {
        try {
            setLoading(true);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + imageFile;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, imageFile);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(progress);
                },
                (error) => {
                    console.log(error);
                },
                async () => {
                    await getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                        setImageFileUrl(downloadUrl);
                        setFormData((prev) => ({...prev, profile_pic: downloadUrl}));
                    });
                    setLoading(false);
                }
            )
        }
        catch (error) {
            console.log(error);
            setLoading(false);
        }
    }
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
        <div className='fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10'>
            <div className='bg-white p-4 py-6 m-1 rounded w-full max-w-sm text-gray-600'>
                <h2 className='font-semibold'>Profile Details</h2>
                <p className='text-sm '>Edit user details</p>
                <input
                    type='file'
                    onChange={handleImageChange}
                    ref={imagePickRef}
                    accept="image/*"
                    hidden
                />

                <form className='grid gap-3 mt-3' onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-1'>
                        <Label className='mb-2'>Name:</Label>
                        <input
                            type='text'
                            id='name'
                            value={formData.name}
                            onChange={handleChange}
                            className='w-full py-1 px-2 border border-slate-300 rounded focus:outline-none'
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <Label className='mb-2'>Password:</Label>
                        <input
                            type='password'
                            id='password'
                            value={formData.password}
                            onChange={handleChange}
                            className='w-full py-1 px-2 border border-slate-300 rounded focus:outline-none'
                        />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <Label className='mb-2'>Photo:</Label>
                        {
                            loading ?
                                (
                                    <Loader className='animate-spin text-blue-600' />
                                ) :
                                (
                                    <img
                                        src={imageFileUrl || formData.profile_pic}
                                        className='w-16 h-16 rounded'
                                        onClick={() => imagePickRef.current.click()}
                                    />
                                )
                        }

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