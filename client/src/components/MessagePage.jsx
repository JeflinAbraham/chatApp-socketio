import { setSocketConnection } from '@/redux/userSlice';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'





import { useEffect, useRef, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Image, Video, X } from 'lucide-react';

// file upload: refer docs from firebase->storage->web->upload files 
import { app } from "@/firebase.js";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';






function MessagePage() {

    const [message, setMessage] = useState({
        text: "",
        imageUrl: "",
        videoUrl: ""
    })
    const [imageFile, setImageFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const imagePickRef = useRef();
    const videoPickRef = useRef();
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        }
    }
    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        // console.log(videoFile);
        if(file){
            setVideoFile(file);
        }
    }
    useEffect(() => {
        if (imageFile || videoFile) {
            uploadFile();
        }
    }, [imageFile, videoFile]);

    const uploadFile = async () => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + (imageFile?.name || videoFile?.name);
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile || videoFile);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(progress);
            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                    if(imageFile) setMessage((prev) => ({ ...prev, imageUrl: downloadUrl }));
                    if(videoFile) setMessage((prev) => ({...prev, videoUrl: downloadUrl}));
                    console.log("image url: ", message.imageUrl);
                    console.log("video url: ", message.videoUrl);
                })
            })

    }

    const handleClearUploadImage = () => {
        setMessage((prev) => ({ ...prev, imageUrl: "" }))
        setImageFile(null);
    }
    const handleClearUploadVideo = () => {
        setMessage((prev) => ({ ...prev, videoUrl: "" }))
        setVideoFile(null);
    }

    const params = useParams();
    const socketConnection = useSelector(state => state.user.socketConnection);
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        profile_pic: "",
        online: false,
        _id: ""
    })


    // why .userid? check App.jsx paths.
    // console.log(params.userid);

    useEffect(() => {
        if (socketConnection) {
            socketConnection.emit('message-page', params.userid)
            socketConnection.on('message-user', (data) => {
                // console.log("message-user ", data); 
                setUserData(data);
            })
        }
    }, [socketConnection, params.userid])


    return (
        <div>
            <input
                type='file'
                onChange={handleImageChange}
                ref={imagePickRef}
                accept="image/*"
                hidden
            />
            <input
                type='file'
                onChange={handleVideoChange}
                ref={videoPickRef}
                accept="video/*"
                hidden
            />
            {/* online/offline bar at the top */}
            <header className='sticky top-0 h-14 w-[1120px] bg-white flex justify-between items-center px-4'>
                <div className='flex items-center gap-2 mb-3'>
                    <div>
                        <img
                            src={userData.profile_pic}
                            className="w-10 h-10 rounded-full mr-3 mt-3"
                        />
                    </div>
                    <div>
                        <h3 className='font-semibold text-lg mb-1'>{userData?.name}</h3>
                        <p className='-my-2 text-sm'>
                            {
                                userData.online ?
                                    (<span className='text-emerald-500'>online</span>) :
                                    (<span className='text-slate-500'>offline</span>)
                            }
                        </p>
                    </div>
                </div>
            </header>

            <div className='bg-gray-400 w-full h-[622px]'>
                {/* upload image display */}
                {
                    message.imageUrl && (
                        <div className='fixed inset-0 bg-black bg-opacity-55 flex justify-center items-center z-50'>
                            <div className='bg-white py-20 ml-[360px] w-96 relative'>
                                <div className='absolute top-0 right-0 cursor-pointer text-white p-1' onClick={handleClearUploadImage}>
                                    <X className='bg-red-500 p-1 hover:bg-red-700' size={35} />
                                </div>
                                <img
                                    src={message.imageUrl}
                                    className='h-[300px]'
                                />
                            </div>
                        </div>
                    )
                }
                {/* upload video display */}
                {
                    message.videoUrl && (
                        <div className='fixed inset-0 bg-black bg-opacity-55 flex justify-center items-center z-50'>
                            <div className='bg-white py-20 ml-[360px] w-96 relative'>
                                <div className='absolute top-0 right-0 cursor-pointer text-white p-1' onClick={handleClearUploadVideo}>
                                    <X className='bg-red-500 p-1 hover:bg-red-700' size={35} />
                                </div>
                                <video
                                    src={message.videoUrl}
                                    className='h-[300px]'
                                    controls
                                    muted
                                    autoPlay
                                />
                            </div>
                        </div>
                    )
                }
            </div>




            {/* send messages */}
            <div className='w-full h-16'>
                <DropdownMenu>
                    <DropdownMenuTrigger ><Plus className="bg-blue-500 hover:bg-blue-700 text-white rounded-full mt-2 ml-1 p-2" size={50} /></DropdownMenuTrigger>
                    <DropdownMenuContent >
                        <DropdownMenuItem onClick={() => imagePickRef.current.click()}>
                            <Image className="mr-2 h-4 w-4" />
                            <span>Image</span>
                        </DropdownMenuItem >
                        <DropdownMenuItem onClick={() => videoPickRef.current.click()}>
                            <Video className="mr-2 h-4 w-4" />
                            <span>Video</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export default MessagePage