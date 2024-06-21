import { Image, LogOut, Video } from 'lucide-react';
import { AccountPopover } from "./AccountPopover";
import axios from 'axios';
import { toast, useToast } from './ui/use-toast';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LogoutPopover } from './LogoutPopover';
import { UserSearch } from 'lucide-react';
import { useEffect, useState } from 'react';
import SearchUser from './SearchUser';
import { useSelector } from 'react-redux';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const Sidebar = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [searchUserOpen, setSearchUserOpen] = useState(false);
    const socketConnection = useSelector((state) => state.user.socketConnection);
    const user = useSelector((state) => state.user);
    const [allUser, setAllUser] = useState([])

    const handleSearchClick = () => {
        setSearchUserOpen(true);
    }

    useEffect(() => {
        if (socketConnection) {
            socketConnection.emit('sidebar', user._id);

            socketConnection.on('conversation', (data) => {
                console.log("my conversation: ", data);
                const conversationUserData = data.map((convDoc) => {

                    // If the sender and receiver IDs are the same
                    if (convDoc.sender._id === convDoc.receiver._id) {
                        return {
                            ...convDoc,
                            userDetails: convDoc.sender
                        }
                    }
                    else if (convDoc.receiver._id !== user._id) {
                        return {
                            ...convDoc,
                            userDetails: convDoc.receiver
                        }
                    }
                    else {
                        return {
                            ...convDoc,
                            userDetails: convDoc.sender
                        }
                    }
                })
                setAllUser(conversationUserData)
                console.log("all user: ", conversationUserData);
                console.log("helloo");
            })
        }

    }, [socketConnection, user])

    return (
        <div className='h-full bg-gray-400 flex'>
            {/* leftmost mini panel */}
            <div className='bg-blue-700 w-12 h-full py-4 text-white'>
                <div className='flex flex-col gap-7 items-center justify-center'>
                    <AccountPopover></AccountPopover>
                    <UserSearch className='cursor-pointer' onClick={handleSearchClick}></UserSearch>
                    <LogoutPopover></LogoutPopover>

                </div>
            </div>

            <div className='bg-slate-100 w-80 h-full py-2 text-slate-600'>
                <div className='flex items-center justify-center py-2 font-semibold text-2xl border-b border-blue-500'>
                    <h1>Messages</h1>
                </div>
                <ScrollArea className="h-[685px] w-[320px] rounded-md">
                    <div className="p-4">
                        {
                            allUser.map((conv, index) => (
                                <div key={index} >
                                <Link to={"/" + conv.userDetails._id}>
                                <div className='flex justify-between hover:bg-gray-200 p-2'>
                                    <div className='flex items-start gap-2 mb-1'>
                                        <img
                                            src={conv.userDetails.profile_pic}
                                            className='w-12 h-12 rounded-full'
                                        />
                                        <div className='flex flex-col'>
                                            <span className='text-blue-700 font-medium '>{conv.userDetails.name}</span>

                                            {
                                                conv.lastMsg.imageUrl ? (
                                                    <div className='flex text-sm gap-1'>
                                                        <Image className='text-gray-400 mt-[2px]' size={18} />
                                                        <span>Image</span>
                                                    </div>
                                                ) : conv.lastMsg.videoUrl ? (
                                                    <div className='flex items-center text-sm gap-1'>
                                                        <Video className='text-gray-400 mt-[2px]' size={18} />
                                                        <span>Video</span>
                                                    </div>
                                                ) : (
                                                    <span className='text-sm w-[205px] line-clamp-1'>{conv.lastMsg.text}</span>
                                                )
                                            }
                                        </div>
                                    </div>
                                    {conv.unseenMsg > 0 &&
                                    (<div className='bg-blue-500 w-7 h-7 rounded-full text-white text-center'>
                                        {conv.unseenMsg}
                                    </div>)
                                    }
                                </div>
                                </Link>
                                    <hr></hr>
                                </div>
                            ))
                        }
                    </div>
                </ScrollArea>


            </div>
            {
                searchUserOpen && (
                    <SearchUser onClose={() => setSearchUserOpen(false)}></SearchUser>
                )
            }

        </div>
    );
};
export default Sidebar;