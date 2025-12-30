import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, MessageSquare, Globe, LogOut } from 'lucide-react';

const Sidebar = () => {
    const { logout } = useAuth();

    // Navigation items configuration
    const navItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/chat', label: 'Chat', icon: MessageSquare },
        { path: '/posts', label: 'Posts', icon: Globe },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-20 md:w-64 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-50">
            <div className="p-4 md:p-6 flex items-center justify-center md:justify-start">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
                    C
                </div>
                <span className="ml-3 font-bold text-xl text-gray-800 hidden md:block tracking-tight">ChatApp</span>
            </div>

            <nav className="flex-1 py-6 flex flex-col gap-2 px-2 md:px-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center p-3 rounded-xl transition-all duration-200 group
                            ${isActive
                                ? 'bg-blue-50 text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={`w-6 h-6 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} strokeWidth={2} />
                                <span className="ml-3 font-medium hidden md:block">{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={logout}
                    className="flex items-center justify-center md:justify-start w-full p-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                >
                    <LogOut className="w-6 h-6" />
                    <span className="ml-3 font-medium hidden md:block">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
