import React from 'react'
import { Link } from 'react-router-dom'

const UserSearchCard = ({ user, onClose }) => {
    return (
        <Link to={"/" + user?._id} onClick={onClose} className='flex items-center gap-3 lg:p-4 rounded border border-transparent border-b-slate-300 hover:border hover:border-blue-600 cursor-pointer'>
            <div>
                <img src={user?.profile_pic} className="w-8 h-8 rounded-full mr-3" />
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