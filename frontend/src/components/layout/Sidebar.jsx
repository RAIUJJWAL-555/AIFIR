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
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-navy-900 text-white shadow-2xl border-r border-navy-800">
            {/* Gov Header */}
            <div className="flex flex-col items-center justify-center h-24 border-b border-navy-800 bg-navy-950 px-4 text-center">
                <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="h-6 w-6 text-accent" />
                    <span className="text-xs font-serif tracking-widest text-navy-400">GOVERNMENT OF INDIA</span>
                </div>
                <h1 className="text-lg font-bold text-white tracking-wide">POLICE PORTAL</h1>
                <span className="text-[10px] text-accent font-medium tracking-widest uppercase mt-1">Satyamev Jayate</span>
            </div>

            <div className="flex flex-col justify-between h-[calc(100vh-6rem)]">
                <nav className="space-y-1 p-4">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;

                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 border-l-4",
                                    isActive
                                        ? "bg-navy-800 border-accent text-white shadow-lg shadow-navy-950/20 relative overflow-hidden"
                                        : "border-transparent text-navy-300 hover:bg-navy-800 hover:text-white"
                                )}
                            >
                                <Icon className={cn("h-5 w-5", isActive ? "text-accent" : "text-navy-400")} />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-navy-800 p-4 bg-navy-950">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-navy-900 border border-navy-800">
                        <div className="h-10 w-10 rounded-full bg-navy-700 flex items-center justify-center text-accent font-bold border border-navy-600">
                            {user?.name?.[0] || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="truncate text-sm font-medium text-white">{user?.name}</p>
                            <p className="truncate text-xs text-accent capitalize">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
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
