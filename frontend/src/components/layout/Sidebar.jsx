import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';
import {
    LayoutDashboard,
    FileText,
    PlusCircle,
    History,
    LogOut,
    ShieldCheck,
    UserCheck,
    FileBadge,
    UserPlus,
    BarChart2
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    // Citizen Links
    const userLinks = [
        { name: 'Dashboard', path: '/user/dashboard', icon: LayoutDashboard },
        { name: 'Register Complaint', path: '/user/register', icon: PlusCircle },
        { name: 'My Complaints', path: '/user/status', icon: History },
    ];

    // Admin (Assigner) Links
    const adminLinks = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Review Complaints', path: '/admin/review', icon: FileText },
        { name: 'Officer Assignment', path: '/admin/assign', icon: UserCheck },
        { name: 'FIR Management', path: '/admin/firs', icon: FileBadge },
        { name: 'Analytics', path: '/admin/analytics', icon: BarChart2 },
        { name: 'Register Officer', path: '/admin/officers/register', icon: UserPlus },
    ];

    // Police (Officer) Links
    const policeLinks = [
        { name: 'My Assigned Cases', path: '/police/my-cases', icon: LayoutDashboard },
        // Officers don't see assign or global review
    ];

    let links = userLinks;
    if (user?.role === 'admin') links = adminLinks;
    if (user?.role === 'police') links = policeLinks;

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white">
            <div className="flex h-16 items-center border-b border-slate-200 px-6">
                <ShieldCheck className="h-8 w-8 text-primary-600 mr-2" />
                <span className="text-xl font-bold text-slate-900">AI-FiR Sys</span>
            </div>

            <div className="flex flex-col justify-between h-[calc(100vh-4rem)]">
                <nav className="space-y-1 p-4">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;

                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary-50 text-primary-700"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <Icon className={cn("h-5 w-5", isActive ? "text-primary-600" : "text-slate-400")} />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-slate-200 p-4">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                            {user?.name?.[0] || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="truncate text-sm font-medium text-slate-900">{user?.name}</p>
                            <p className="truncate text-xs text-slate-500 capitalize">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                        <LogOut className="h-5 w-5" />
                        Logout
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
