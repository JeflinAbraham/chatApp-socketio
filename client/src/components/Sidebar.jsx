import { LogOut } from 'lucide-react';
import { AccountPopover } from "./AccountPopover";
import axios from 'axios';
import { toast, useToast } from './ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { LogoutPopover } from './LogoutPopover';

const Sidebar = () => {
    const { toast } = useToast();
    const navigate = useNavigate();

    return (
        <div className='w-full h-full bg-gray-400 flex'>
            {/* leftmost mini panel */}
            <div className='bg-blue-500 w-12 h-full py-4 text-white'>
                <div className='flex flex-col gap-7 items-center justify-center'>
                    <AccountPopover></AccountPopover>
                    <LogoutPopover></LogoutPopover>
                    
                </div>
            </div>

            <div className='bg-slate-100 w-80 h-full py-2 text-slate-600'>
                <div className='flex items-center justify-center py-2 font-semibold text-2xl border-b border-blue-500'>
                    <h1>Messages</h1>
                </div>
            </div>

        </div>
    );
};
export default Sidebar;