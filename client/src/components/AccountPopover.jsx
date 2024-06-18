import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { useSelector } from "react-redux"
import { useState } from "react"
import EditUserDetails from "./EditUserDetails"

export function AccountPopover() {
    const { name, email, profile_pic } = useSelector((state) => state.user);
    const [editUserOpen, setEditUserOpen] = useState(false);
    const user = useSelector((state) => state.user)
    return (
        <div>
            <Popover>
                <PopoverTrigger asChild>
                    <User size={18} />
                </PopoverTrigger>
                {
                    !editUserOpen && (<PopoverContent className="w-80">
                        <div className="flex items-center">
                            <img src={profile_pic} className="w-16 h-16 rounded-full mr-4" />
                            <div>
                                <h3 className="text-lg font-semibold">{name}</h3>
                                <p className="text-sm text-gray-600">{email}</p>
                                <button
                                    className='bg-blue-600 hover:bg-blue-700 px-2 rounded-lg text-white mt-2 outline-none'
                                    onClick={() => setEditUserOpen(true)}
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    </PopoverContent>)
                }

            </Popover>
            {/**edit user details*/}
            {
                editUserOpen && (
                    <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
                )
            }
        </div>

    )
}
