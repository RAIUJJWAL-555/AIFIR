import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FileText, Clock, CheckCircle, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, subtext }) => (
    <Card>
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h4 className="text-2xl font-bold text-slate-900 mt-2">{value}</h4>
                    {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
        </CardContent>
    </Card>
);

const PoliceDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [recentComplaints, setRecentComplaints] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const response = await axios.get('http://localhost:5000/api/admin/stats', config);
                setStats(response.data.overview);
                setRecentComplaints(response.data.recentActivity);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Officer Dashboard</h1>
                <p className="text-slate-500 mt-1">Overview of Station Activity • {user?.name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    title="Review Pending"
                    value={stats?.pending || 0}
                    icon={Clock}
                    color="bg-amber-500"
                    subtext="Needs attention"
                />
                <StatCard
                    title="FIRs Registered"
                    value={stats?.firRegistered || 0}
                    icon={FileText}
                    color="bg-blue-600"
                    subtext="Total processed"
                />
                <StatCard
                    title="Rejected"
                    value={stats?.rejected || 0}
                    icon={AlertTriangle}
                    color="bg-red-500"
                    subtext="Invalid complaints"
                />
                <StatCard
                    title="Cases Solved"
                    value={stats?.resolved || 0}
                    icon={CheckCircle}
                    color="bg-green-500"
                    subtext="Total resolved"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="h-full">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Incoming Complaints</CardTitle>
                            <Link to="/admin/review">
                                <Button variant="ghost" size="sm">View All <ArrowRight className="ml-1 h-4 w-4" /></Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentComplaints.length === 0 ? (
                                    <p className="text-center text-slate-500 py-4">No recent complaints found.</p>
                                ) : (
                                    recentComplaints.map((c) => (
                                        <div key={c._id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                                                    {c.incidentType?.[0] || 'O'}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-slate-900 text-sm">{c.incidentType}</h4>
                                                    <p className="text-xs text-slate-500">
                                                        {c.user?.name || 'Anonymous'} • {new Date(c.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold
                                            ${c.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                        c.status === 'FIR Registered' ? 'bg-green-100 text-green-700' :
                                                            'bg-slate-200 text-slate-600'}`}>
                                                    {c.status}
                                                </span>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => navigate(`/admin/case/${c._id}`)}
                                                >
                                                    Review
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex gap-3 text-sm">
                                    <div className="h-2 w-2 mt-1.5 rounded-full bg-blue-500 shrink-0" />
                                    <p className="text-slate-600">New high priority case assigned to Officer Rakesh regarding Cyber Fraud.</p>
                                </div>
                                <div className="flex gap-3 text-sm">
                                    <div className="h-2 w-2 mt-1.5 rounded-full bg-green-500 shrink-0" />
                                    <p className="text-slate-600">FIR #9921 marked as Resolved by Investigation Team A.</p>
                                </div>
                                <div className="flex gap-3 text-sm">
                                    <div className="h-2 w-2 mt-1.5 rounded-full bg-amber-500 shrink-0" />
                                    <p className="text-slate-600">Weekly report submission due by 5:00 PM today.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900 text-white border-0">
                        <CardContent className="p-6">
                            <h4 className="font-bold text-lg mb-2">AI Insights</h4>
                            <p className="text-sm text-slate-300 mb-4">Theft cases have increased by 15% in Sector 4 this week. Suggested patrol increase.</p>
                            <Button variant="secondary" size="sm" className="w-full">View Detailed Report</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PoliceDashboard;
