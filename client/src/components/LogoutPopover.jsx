import { LogOut } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { toast, useToast } from "./ui/use-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function LogoutPopover() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const handleLogout = async () => {
        try {
            const response = await axios.post('/api/user/sign-out');
            if (response.data.success) {
                toast({
                    title: 'Success',
                    description: response.data.message,
                });
                navigate('/sign-in');
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response.data.message,
                variant: "destructive"
            });
        }
    };

    return (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
                <button onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
                    <LogOut size={18} />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="flex flex-col items-center">
                    <h1>Are you sure you want to logout?</h1>
                    <div className="flex items-center justify-center gap-x-3">
                        <button
                            onClick={handleLogout}
                            className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded-lg text-white mt-2 outline-none"
                        >
                            Yes
                        </button>
                        <button
                            onClick={() => setIsPopoverOpen(false)}
                            className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded-lg text-white mt-2 outline-none"
                        >
                            No
                        </button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
