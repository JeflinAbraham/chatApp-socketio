import React, { useEffect, useState } from 'react'
import { Search } from 'lucide-react';
import { X } from 'lucide-react';
import ClipLoader from "react-spinners/ClipLoader";
import UserSearchCard from './UserSearchCard';
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from './ui/use-toast';

import axios from 'axios';

const SearchUser = ({ onClose }) => {
    //array of matched users.
    const [searchUser, setSearchUser] = useState([])

    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const { toast } = useToast();


    const handleSearchUser = async () => {
        if (searchTerm) {
            try {
                setLoading(true)
                const response = await axios.post('api/user/search-users', {
                    search: searchTerm
                })
                setSearchUser(response.data.data);
            }
            catch (error) {
                toast({
                    title: "Error",
                    description: "Error while searching users",
                    variant: 'destructive'
                })
            }
            finally {
                setLoading(false);
            }
        }
        else {
            setSearchUser([]);
        }
    }

    useEffect(() => {
        handleSearchUser()
    }, [searchTerm])
    console.log("searchUser", searchUser);

    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-65 p-2 z-10'>
            <div className='w-full max-w-lg mx-auto mt-10'>
                {/*input search user */}
                <div className='bg-white rounded h-14 overflow-hidden flex '>
                    <input
                        type='text'
                        placeholder='Search user by name, email....'
                        className='w-full outline-none py-1 h-full px-4'
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                    />
                    <div className='h-14 w-14 flex justify-center items-center'>
                        <Search size={20} />
                    </div>
                </div>

                {/**display search user */}
                <div className='bg-white mt-2 w-full p-4 rounded flex items-center justify-center'>
                    {/**no user found */}
                    {
                        searchTerm == "" && (
                            <p className='text-center text-slate-500'>Search for users to chat</p>
                        )
                    }
                    {
                        searchTerm && searchUser.length === 0 && !loading && (
                            <p className='text-center text-slate-500'>no user found!</p>
                        )
                    }

                    {
                        loading && (
                            <ClipLoader
                                color="#ffffff"
                                loading={loading}
                                size={150}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />
                        )
                    }

                    {
                        searchUser.length !== 0 && !loading && (
                            // searchUser.map((user) => {
                            //     return (
                            //         <UserSearchCard key={user._id} user={user} onClose={onClose} />
                            //     )
                            // })
                            <ScrollArea className="h-[500px] w-[450px] rounded-md border">
                                <div className="p-4">
                                    {searchUser.map((user) => (
                                        <>
                                            <UserSearchCard key={user._id} user={user} onClose={onClose} />
                                        </>
                                    ))}
                                </div>
                            </ScrollArea>
                        )

                    }


                </div>
            </div>

            <div className='absolute top-0 right-0 text-2xl p-2 lg:text-4xl hover:text-white' onClick={onClose}>
                <button>
                    <X />
                </button>
            </div>
        </div>
    )
}

export default SearchUser