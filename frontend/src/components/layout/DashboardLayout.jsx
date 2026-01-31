import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-navy-50">
            <Sidebar />
            <main className="ml-64 p-8">
                <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
