import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
const UserSearchCard = ({ user, onClose }) => {
    const { onlineUser } = useSelector((state) => state.user);
    const isOnline = onlineUser.includes(user._id);
    console.log(onlineUser);
    console.log(isOnline);
    return (
            <Link to={"/" + user?._id} onClick={onClose} className='flex items-center gap-3 p-2 lg:p-4 rounded border border-transparent border-b-slate-300 hover:border hover:border-blue-600 cursor-pointer'>
                <div className='flex relative'>
                    <img src={user?.profile_pic} className="w-8 h-8 rounded-full mr-3" />
                    {
                        isOnline && (
                            // position absolute wrt nearest ancestor with (non static) relative position property.
                            <div className='bg-emerald-400 p-1 w-1 h-1 rounded-full absolute right-[10px]' ></div>
                        )
                    }
                </div>
                <div>
                    <div className='font-semibold'>
                        {user?.name}
                    </div>
                    <p className='text-sm'>{user?.email}</p>
                </div>
            </Link>
    );
}

export default UserSearchCard