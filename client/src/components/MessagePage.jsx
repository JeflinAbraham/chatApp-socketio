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
import { Plus, Image, Video, X, Loader, SendHorizonal } from 'lucide-react';

// file upload: refer docs from firebase->storage->web->upload files 
import { app } from "@/firebase.js";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import moment from 'moment';

import { ScrollArea } from "@/components/ui/scroll-area"





function MessagePage() {
    const [loading, setLoading] = useState(false);
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
        if (file) {
            setVideoFile(file);
        }
    }
    const handleTextChange = (e) => {
        setMessage((prev) => ({ ...prev, text: e.target.value }))
    }

    useEffect(() => {
        if (imageFile || videoFile) {
            uploadFile();
        }
    }, [imageFile, videoFile]);

    const uploadFile = async () => {
        try {
            setLoading(true);
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
                async () => {
                    await getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                        if (imageFile) setMessage((prev) => ({ ...prev, imageUrl: downloadUrl }));
                        if (videoFile) setMessage((prev) => ({ ...prev, videoUrl: downloadUrl }));
                    });
                    setLoading(false);
                    setImageFile(null);
                    setVideoFile(null);
                }
            )
        }
        catch (error) {
            console.log(error);
            setLoading(false);
        }
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
    const user = useSelector(state => state.user)

    // recievers data.
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        profile_pic: "",
        online: false,
        _id: ""
    })
    const [allMessages, setAllMessage] = useState([]);

    // why .userid? check App.jsx paths.
    // console.log(params.userid);

    useEffect(() => {
        if (socketConnection) {
            // fontend backend ko bol rha h ki tu 'message-page' pe listen kar, u ll recive a params.userid.
            socketConnection.emit('message-page', params.userid);

            socketConnection.emit('seen',params.userid)

            // the details of the reciever is send to us by the backend server.
            socketConnection.on('message-user', (data) => {
                // console.log("message-user ", data); 
                setUserData(data);
                console.log(data.profile_pic);
            })

            // when this message event is triggered, client recieves the conversation data.
            socketConnection.on('message', (data) => {
                console.log('message data: ', data);
                setAllMessage(data);
            })
        }
    }, [socketConnection, params.userid])

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.text || message.imageUrl || message.videoUrl) {
            if (socketConnection) {
                // client server ko bol rha, bhaii tu 'new-message' pe listen kar, meii terko data bhej rha.
                socketConnection.emit('new-message', {
                    sender: user?._id,
                    receiver: params.userid,
                    text: message.text,
                    imageUrl: message.imageUrl,
                    videoUrl: message.videoUrl,
                    msgByUserId: user?._id
                })

                // after the message is send to the server, clear the input text box, img/vid urls.
                setMessage({
                    text: "",
                    imageUrl: "",
                    videoUrl: ""
                })
            }
        }
    }

    const scrollRef = useRef(null);
    const scrollToBottom = () => {
        scrollRef.current.scrollIntoView(false);
    }
    useEffect(() => {
        scrollToBottom();
    }, [allMessages]);

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

                {loading && (
                    <Loader className="text-blue-600 animate-spin ml-[520px] fixed mt-64 z-50" size={50} />
                )}


                {/* upload image display */}
                {
                    message.imageUrl && (
                        <div className='fixed inset-0 bg-black bg-opacity-65 flex justify-center items-center z-40'>
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
                        <div className='fixed inset-0 bg-black bg-opacity-65 flex justify-center items-center z-50'>
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

                {/**all message show here */}
                <ScrollArea className="h-[620px] w-[1120px] bg-gray-400 p-3 ">
                    <div className="p-2" ref={scrollRef}>
                        {
                            allMessages.map((msg, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={`flex flex-col mb-2 p-3 rounded-lg shadow-md text-black shadow-black w-fit ${user._id === msg.msgByUserId ? "items-end ml-auto bg-blue-700 text-white" : "bg-white items-start"}`}

                                    >
                                        {
                                            msg.imageUrl && (
                                                <img
                                                    src={msg.imageUrl}
                                                    className='w-80 h-60 object-scale-down'
                                                />
                                            )
                                        }
                                        {
                                            msg.videoUrl && (
                                                <video
                                                    src={msg.videoUrl}
                                                    className='w-80 h-60 object-scale-down'
                                                    controls
                                                />
                                            )
                                        }
                                        <p>{msg.text}</p>
                                        <p className={`text-xs  ${user._id == msg.msgByUserId ? "text-gray-300" : "text-gray-400"}`}> {moment(msg.createdAt).format('LT')} </p>
                                    </div>
                                );
                            })
                        }
                    </div>
                </ScrollArea>



            </div>




            {/* send messages*/}
            <div className='w-full h-16 flex items-center justify-center gap-x-1'>
                {/* left side button */}
                <DropdownMenu>
                    <DropdownMenuTrigger className='outline-none' ><Plus className="bg-blue-700 hover:bg-blue-700 text-white rounded-full ml-1 p-2" size={50} /></DropdownMenuTrigger>
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

                <form onSubmit={handleSubmit} className='flex gap-x-1'>
                    <input
                        type="text"
                        className='w-[988px] h-[45px] rounded-lg p-2 border-2 border-blue-500 outline-none z-50'
                        placeholder='Type here...'
                        value={message.text}
                        onChange={handleTextChange}
                    />
                    <button type='submit' className='bg-blue-700 text-lg text-white py-1 px-4 rounded-lg z-50'><SendHorizonal /></button>
                </form>
            </div>
        </div>
    )
}

export default MessagePage







{/*



*/}