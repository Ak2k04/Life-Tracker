import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { CheckCircle, Activity, DollarSign, LogOut, Sun, Moon, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';

const DashboardLayout = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const { theme, toggleTheme, accent, setAccent } = useTheme();
    const location = useLocation();

    if (!isAuthenticated) return null; // App router redirects to login

    const navigation = [
        { name: 'Overview', href: '/dashboard/overview', icon: LayoutDashboard },
        { name: 'Habits', href: '/dashboard/habits', icon: CheckCircle },
        { name: 'Workouts', href: '/dashboard/workouts', icon: Activity },
        { name: 'Finance', href: '/dashboard/finance', icon: DollarSign },
    ];

    const currentNav = navigation.find(n => location.pathname.includes(n.href));
    const pageTitle = currentNav ? currentNav.name : 'Dashboard';

    return (
        <div className="flex bg-gray-50 dark:bg-gray-900 h-screen overflow-hidden transition-colors duration-200">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col transition-colors duration-200">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-indigo-600 tracking-tight flex items-center gap-2">
                        <span>🌟</span> Life
                    </h1>
                </div>
                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
                            {user?.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate w-24">{user?.username}</div>
                    </div>
                    <button onClick={logout} className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Logout">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-6 shadow-sm justify-between transition-colors duration-200">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{pageTitle}</h2>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 mr-2 border-r border-gray-200 dark:border-gray-700 pr-4">
                            {['indigo', 'emerald', 'rose', 'amber'].map(color => (
                                <button
                                    key={color}
                                    onClick={() => setAccent(color)}
                                    className={`w-5 h-5 rounded-full transition-transform ${accent === color ? 'scale-125 ring-2 ring-offset-2 dark:ring-offset-gray-800 ring-gray-400 dark:ring-gray-500' : 'hover:scale-110'}`}
                                    style={{
                                        backgroundColor: color === 'indigo' ? '#6366f1' :
                                            color === 'emerald' ? '#10b981' :
                                                color === 'rose' ? '#f43f5e' :
                                                    '#f59e0b'
                                    }}
                                    title={`Set theme to ${color}`}
                                />
                            ))}
                        </div>
                        <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline-block">Welcome back, {user?.username}</span>
                    </div>
                </header>
                <div className="p-6 overflow-y-auto flex-1 pb-20">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
