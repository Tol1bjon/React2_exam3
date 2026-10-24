import { useEffect, useState } from 'react';
import SideBar from './SideBar';
import Header from './Header';
import AddButton from './AddButton';
import { Outlet } from 'react-router';
import { useUser } from '@/Store/Zustand';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const getMe = useUser((state: any) => state.getMe)

    useEffect(() => {
        getMe()
    }, [])

    return (
        <div className='flex min-h-screen bg-slate-50 dark:bg-[#0b131e] transition-colors duration-200'>
            <SideBar isOpen={isSidebarOpen}/>
            <div className='flex min-w-0 flex-1 flex-col'>
                <Header onToggle={() => setIsSidebarOpen(prev => !prev)}/>
                <main className='flex-1 px-4 pb-28 md:px-8 md:pb-8'>
                    <Outlet/>
                </main>
            </div>
            <AddButton/>
        </div>
    );
}

export default Layout;