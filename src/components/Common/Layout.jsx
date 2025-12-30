import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <main className="flex-1 ml-20 md:ml-64 transition-all duration-300">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
