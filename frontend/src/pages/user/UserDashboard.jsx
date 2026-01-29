import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { PlusCircle, FileText, Clock, CheckCircle } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card>
        <CardContent className="p-6 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
            </div>
            <div className={`p-4 rounded-full ${color}`}>
                <Icon className="h-6 w-6 text-white" />
            </div>
        </CardContent>
    </Card>
);

const UserDashboard = () => {
    const { user } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const response = await axios.get('http://localhost:5000/api/complaints', config);
                setComplaints(response.data);
            } catch (error) {
                console.error("Error fetching complaints:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchComplaints();
    }, []);

    // Calculate stats safely
    const stats = {
        total: Array.isArray(complaints) ? complaints.length : 0,
        pending: Array.isArray(complaints) ? complaints.filter(c => c.status === 'Pending').length : 0,
        registered: Array.isArray(complaints) ? complaints.filter(c => c.status === 'FIR Registered' || c.status === 'Resolved').length : 0
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Welcome back, {user?.name}</p>
                </div>
                <Link to="/user/register">
                    <Button size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-all">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Register New Complaint
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Complaints"
                    value={stats.total}
                    icon={FileText}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Pending Review"
                    value={stats.pending}
                    icon={Clock}
                    color="bg-amber-500"
                />
                <StatCard
                    title="FIRs Registered"
                    value={stats.registered}
                    icon={CheckCircle}
                    color="bg-green-500"
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        {loading ? (
                            <p className="text-center py-4 text-slate-500">Loading complaints...</p>
                        ) : !Array.isArray(complaints) || complaints.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-slate-500 mb-4">No complaints found.</p>
                                <Link to="/user/register">
                                    <Button variant="outline">Register your first complaint</Button>
                                </Link>
                            </div>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium">
                                    <tr>
                                        <th className="px-4 py-3 rounded-tl-lg">Complaint ID</th>
                                        <th className="px-4 py-3">Type</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 rounded-tr-lg">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {complaints.map((complaint) => (
                                        <tr key={complaint._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-slate-900">
                                                {complaint._id.substring(complaint._id.length - 6).toUpperCase()}
                                            </td>
                                            <td className="px-4 py-3">{complaint.incidentType}</td>
                                            <td className="px-4 py-3 text-slate-500">
                                                {new Date(complaint.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                ${complaint.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                                                        complaint.status === 'FIR Registered' ? 'bg-green-100 text-green-800' :
                                                            complaint.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                                'bg-slate-100 text-slate-800'}`}>
                                                    {complaint.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Link to={`/user/complaint/${complaint._id}`}>
                                                    <Button variant="ghost" size="sm">View Details</Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserDashboard;
