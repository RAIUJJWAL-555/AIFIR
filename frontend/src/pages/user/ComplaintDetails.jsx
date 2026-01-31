import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { ArrowLeft, MapPin, Calendar, Clock, FileText, User, Shield, AlertCircle, Paperclip, ExternalLink } from 'lucide-react';

const ComplaintDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/api/complaints/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setComplaint(response.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load complaint details.');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchComplaint();
    }, [id]);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading details...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!complaint) return <div className="p-8 text-center text-slate-500">Complaint not found.</div>;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolved': return 'bg-green-100 text-green-700';
            case 'Rejected': return 'bg-red-100 text-red-700';
            case 'Solved by Officer': return 'bg-amber-100 text-amber-700';
            case 'FIR Registered': return 'bg-blue-100 text-blue-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Under Review': return 'bg-orange-100 text-orange-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="pl-0 hover:bg-transparent hover:text-primary-600 mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        {complaint.title}
                        <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(complaint.status)}`}>
                            {complaint.status === 'Solved by Officer' ? 'Solved (Pending Verification)' : complaint.status}
                        </span>
                    </h1>
                    <p className="text-slate-500 mt-1">Complaint ID: #{complaint._id.substring(complaint._id.length - 6).toUpperCase()}</p>
                </div>
                <div className="text-right text-sm text-slate-400">
                    Filed on {new Date(complaint.createdAt).toLocaleDateString()}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {/* Main Details */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-primary-500" /> Incident Report
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-slate-700 whitespace-pre-wrap">{complaint.description}</p>

                            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                    <span>{new Date(complaint.incidentDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Clock className="h-4 w-4 text-slate-400" />
                                    <span>{complaint.incidentTime}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 col-span-2">
                                    <MapPin className="h-4 w-4 text-slate-400" />
                                    <span>{complaint.location}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {complaint.aiDraft && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-purple-700">
                                    <FileText className="h-5 w-5" /> AI Generated FIR Draft
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                                    <pre className="text-xs text-slate-600 whitespace-pre-wrap font-sans">
                                        {complaint.aiDraft}
                                    </pre>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Investigation Updates Timeline */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-indigo-700">
                                <Shield className="h-5 w-5" /> Investigation Updates
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {complaint.investigationUpdates && complaint.investigationUpdates.length > 0 ? (
                                    complaint.investigationUpdates.slice().reverse().map((update, idx) => (
                                        <div key={idx} className="relative pl-6 pb-2 border-l-2 border-indigo-100 last:border-0">
                                            <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-indigo-500 ring-4 ring-white" />
                                            <div>
                                                <p className="text-sm text-slate-800 font-medium">{update.note}</p>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    {new Date(update.updatedAt).toLocaleString()} • Officer {update.officerName || ''}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500 italic">No updates available yet.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-indigo-600" /> Officer In-Charge
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {complaint.assignedOfficer ? (
                                <div className="text-center py-4">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 text-indigo-600">
                                        <User className="h-6 w-6" />
                                    </div>
                                    <p className="font-bold text-slate-900">{complaint.assignedOfficer.name}</p>
                                    <p className="text-sm text-slate-500">{complaint.assignedOfficer.badgeId}</p>
                                    <p className="text-xs text-green-600 font-medium mt-2 bg-green-50 inline-block px-2 py-1 rounded">Assigned</p>
                                </div>
                            ) : (
                                <div className="text-center py-6 text-slate-500">
                                    <p className="text-sm">No officer assigned yet.</p>
                                    <p className="text-xs mt-1">Pending Admin Review</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm uppercase tracking-wide text-slate-500">Complainant</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                            <div className="space-y-2">
                                <p><span className="font-medium">Name:</span> {complaint.user?.name}</p>
                                <p><span className="font-medium">Email:</span> {complaint.user?.email}</p>
                                <p><span className="font-medium">Phone:</span> {complaint.user?.phone}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {complaint.evidence && (
                        <Card className="border-l-4 border-l-blue-500">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-blue-700">
                                    <Paperclip className="h-4 w-4" /> Evidence Attached
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <a
                                    href={`http://localhost:5000${complaint.evidence}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200 hover:bg-slate-100 transition-colors group"
                                >
                                    <span className="text-xs font-mono text-slate-600 truncate mr-2">
                                        {complaint.evidence.split('/').pop()}
                                    </span>
                                    <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-blue-500" />
                                </a>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComplaintDetails;
