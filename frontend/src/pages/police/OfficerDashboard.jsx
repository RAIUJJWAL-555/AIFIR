import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import axios from 'axios';
import { BadgeCheck, Clock, MapPin, AlertCircle } from 'lucide-react';

const OfficerDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyCases = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) return;

                const response = await axios.get('http://localhost:5000/api/complaints/officer/my', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setComplaints(response.data);
            } catch (error) {
                console.error("Error fetching cases:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyCases();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolved': return 'bg-green-100 text-green-700';
            case 'Rejected': return 'bg-red-100 text-red-700';
            case 'FIR Registered': return 'bg-blue-100 text-blue-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Under Review': return 'bg-orange-100 text-orange-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    if (loading) {
        return <div className="text-center py-12">Loading cases...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">My Assigned Cases</h1>
                <p className="text-slate-500 mt-1">Manage and investigate cases assigned to you.</p>
            </div>

            <div className="grid gap-6">
                {complaints.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center text-slate-500">
                            <BadgeCheck className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                            <p>No cases assigned currently.</p>
                        </CardContent>
                    </Card>
                ) : (
                    complaints.map(complaint => (
                        <Card key={complaint._id} className="overflow-hidden">
                            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            {complaint.title}
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(complaint.status)}`}>
                                                {complaint.status}
                                            </span>
                                        </CardTitle>
                                        <p className="text-sm text-slate-500 mt-1">
                                            Case ID: #{complaint._id.substring(complaint._id.length - 6)}
                                        </p>
                                    </div>
                                    <div className="text-right text-sm text-slate-500">
                                        <div className="flex items-center justify-end gap-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(complaint.incidentDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-700 mb-1">Incident Details</h4>
                                        <p className="text-slate-600 text-sm mb-2">{complaint.description}</p>
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <MapPin className="w-4 h-4" />
                                            {complaint.location}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-700 mb-1">Complainant Details</h4>
                                        <div className="bg-slate-50 p-3 rounded text-sm relative mb-4">
                                            <p><span className="font-medium">Name:</span> {complaint.user?.name || 'N/A'}</p>
                                            <p><span className="font-medium">Contact:</span> {complaint.user?.phone || 'N/A'}</p>
                                            <p><span className="font-medium">Email:</span> {complaint.user?.email || 'N/A'}</p>
                                        </div>
                                        <Button
                                            className="w-full"
                                            size="sm"
                                            onClick={() => navigate(`/police/case/${complaint._id}`)}
                                        >
                                            Manage Investigation
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div >
    );
};

export default OfficerDashboard;
