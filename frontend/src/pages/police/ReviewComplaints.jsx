import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FileText, CheckCircle, XCircle, Filter, Search, ChevronDown } from 'lucide-react';

const ReviewComplaints = () => {
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('Pending');

    const fetchComplaints = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/complaints/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Filter locally for now effectively
            setComplaints(response.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch complaints');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const token = sessionStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/complaints/${id}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`Complaint marked as ${newStatus}`);
            fetchComplaints(); // Refresh list
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const filteredComplaints = complaints.filter(c => c.status === filter);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Review Complaints</h1>
                    <p className="text-slate-500 mt-1">Review incoming citizen complaints and take action.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="appearance-none bg-white border border-slate-300 text-slate-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="Pending">Pending Review</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-0">
                    <CardTitle className="text-lg font-medium text-slate-700">
                        {filter} Complaints ({filteredComplaints.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto mt-4">
                        {loading ? (
                            <p className="py-8 text-center text-slate-500">Loading...</p>
                        ) : filteredComplaints.length === 0 ? (
                            <div className="py-12 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500">No complaints found with status "{filter}".</p>
                            </div>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3">ID</th>
                                        <th className="px-4 py-3">Complainant</th>
                                        <th className="px-4 py-3">Type</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Snippet</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredComplaints.map((c) => (
                                        <tr key={c._id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-4 py-3 font-mono text-xs text-slate-500">
                                                {c._id.substring(c._id.length - 6).toUpperCase()}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-slate-900">
                                                {c.user?.name || 'Unknown'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                                                    {c.incidentType}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-500">
                                                {new Date(c.incidentDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                                                {c.description}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-primary-600 border-primary-100 hover:bg-primary-50"
                                                        onClick={() => navigate(`/admin/case/${c._id}`)}
                                                    >
                                                        View
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleStatusUpdate(c._id, 'Rejected')}
                                                    >
                                                        Reject
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700 text-white"
                                                        onClick={() => handleStatusUpdate(c._id, 'FIR Registered')}
                                                    >
                                                        Register FIR
                                                    </Button>
                                                </div>
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

export default ReviewComplaints;
