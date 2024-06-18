import { ListFilter, LogOut, MessageSquareDiff, User } from "lucide-react";
import { Input } from "./ui/input";
import { AccountPopover } from "./AccountPopover";

const Sidebar = () => {
    return (
        <div className='w-full h-full grid grid-cols-[48px,1fr] bg-white'>
            <div className='bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between'>
                <div className='flex flex-col items-center'>
                    <AccountPopover></AccountPopover>
                </div>
            </div>
        </div>
    );
};
export default Sidebar;