import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { ArrowLeft, MapPin, Calendar, Clock, User, Phone, Mail, FileText, CheckCircle, Shield, Paperclip, ExternalLink, Lightbulb, TrendingUp } from 'lucide-react';

const SimilarCases = ({ description }) => {
    const [similar, setSimilar] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSimilar = async () => {
            setLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const res = await axios.post('http://localhost:5000/api/complaints/similar',
                    { description },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSimilar(res.data);
            } catch (error) {
                console.error("Error fetching similar cases:", error);
            } finally {
                setLoading(false);
            }
        };

        if (description) fetchSimilar();
    }, [description]);

    if (!description) return null;

    return (
        <Card className="border-t-4 border-t-amber-500 shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2 text-amber-700">
                    <Lightbulb className="h-5 w-5" /> AI Insights: Similar Resolved Cases
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {loading ? (
                        <p className="text-sm text-slate-500 animate-pulse">Analyzing patterns...</p>
                    ) : similar.length === 0 ? (
                        <p className="text-sm text-slate-500">No similar solved cases found.</p>
                    ) : (
                        similar.map(c => (
                            <div key={c._id} className="p-3 bg-amber-50 rounded-lg border border-amber-100 hover:border-amber-300 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-slate-800 text-sm">{c.incidentType}</h4>
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Resolved</span>
                                </div>
                                <p className="text-xs text-slate-600 line-clamp-2 mb-2">{c.description}</p>

                                {c.investigationUpdates && c.investigationUpdates.length > 0 && (
                                    <div className="bg-white p-2 rounded border border-amber-100 mb-2">
                                        <p className="text-xs text-slate-500 font-medium mb-1">Resolution Note:</p>
                                        <p className="text-xs text-slate-700 italic">"{c.investigationUpdates[c.investigationUpdates.length - 1].note}"</p>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 border-t border-amber-200 pt-2">
                                    <User className="h-3 w-3" />
                                    <span>Officer: {c.assignedOfficer?.name || 'Unknown'}</span>
                                    {c.assignedOfficer?.phone && (
                                        <span className="flex items-center gap-1 ml-auto text-blue-600 font-medium cursor-pointer hover:underline">
                                            <Phone className="h-3 w-3" /> {c.assignedOfficer.phone}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

const CaseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [caseData, setCaseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [newNote, setNewNote] = useState("");

    const handleAddNote = async () => {
        if (!newNote.trim()) return;
        setUpdating(true);
        try {
            const token = sessionStorage.getItem('token');
            const res = await axios.post(`http://localhost:5000/api/complaints/${id}/notes`,
                { note: newNote },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCaseData(res.data);
            setNewNote("");
            toast.success("Note added successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to add note");
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        const fetchCaseDetails = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/api/complaints/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCaseData(response.data);
            } catch (error) {
                console.error(error);
                toast.error('Failed to load case details');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCaseDetails();
    }, [id]);

    const handleStatusUpdate = async (newStatus) => {
        if (!confirm(`Are you sure you want to mark this case as ${newStatus}?`)) return;

        setUpdating(true);
        try {
            const token = sessionStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/complaints/${id}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCaseData(prev => ({ ...prev, status: newStatus }));
            toast.success(`Case marked as ${newStatus}`);
        } catch (error) {
            console.error(error);
            toast.error('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-slate-500">Loading case file...</div>;
    if (!caseData) return <div className="p-12 text-center text-slate-500">Case not found.</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="pl-0 hover:bg-transparent hover:text-primary-600">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        Case #{caseData._id.substring(caseData._id.length - 6).toUpperCase()}
                        <span className={`text-sm px-3 py-1 rounded-full border ${caseData.status === 'Resolved' ? 'bg-green-100 text-green-700 border-green-200' :
                            caseData.status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                                caseData.status === 'Solved by Officer' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                    'bg-blue-100 text-blue-700 border-blue-200'
                            }`}>
                            {caseData.status}
                        </span>
                    </h1>
                    <p className="text-slate-500 mt-1">{caseData.title}</p>
                </div>

                <div className="flex gap-2">
                    {user?.role === 'admin' && (
                        <div className="flex gap-2">
                            {(caseData.status === 'Pending' || caseData.status === 'Under Review') && (
                                <>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleStatusUpdate('Rejected')}
                                        isLoading={updating}
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => handleStatusUpdate('FIR Registered')}
                                        isLoading={updating}
                                    >
                                        <CheckCircle className="mr-2 h-4 w-4" /> Register FIR
                                    </Button>
                                </>
                            )}
                            {caseData.status === 'Solved by Officer' && (
                                <Button
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => handleStatusUpdate('Resolved')}
                                    isLoading={updating}
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" /> Approve & Resolve Case
                                </Button>
                            )}
                        </div>
                    )}
                    {user?.role === 'police' && caseData.status === 'FIR Registered' && (
                        <Button
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                            onClick={() => handleStatusUpdate('Solved by Officer')}
                            isLoading={updating}
                        >
                            <CheckCircle className="mr-2 h-4 w-4" /> Submit for Resolution
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Complaint Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="bg-slate-50 border-b border-slate-100">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <FileText className="h-5 w-5 text-indigo-600" /> Incident Report
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</h3>
                                <p className="text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    {caseData.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Location</h3>
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <MapPin className="h-5 w-5 text-slate-400" />
                                        {caseData.location}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Date & Time</h3>
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <Calendar className="h-5 w-5 text-slate-400" />
                                        {new Date(caseData.incidentDate).toLocaleDateString()}
                                        <span className="text-slate-300">|</span>
                                        <Clock className="h-5 w-5 text-slate-400" />
                                        {caseData.incidentTime}
                                    </div>
                                </div>
                            </div>

                            {caseData.aiDraft && (
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">AI Generated Draft</h3>
                                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 text-sm text-indigo-900 font-mono whitespace-pre-wrap">
                                        {caseData.aiDraft}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <SimilarCases description={caseData.description} />
                </div>

                {/* Right Column: Complainant Info & Actions */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="bg-slate-50 border-b border-slate-100">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="h-5 w-5 text-primary-600" /> Complainant Profile
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg">
                                    {caseData.user?.name?.[0] || 'U'}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{caseData.user?.name || 'Unknown'}</p>
                                    <p className="text-xs text-slate-500">Citizen</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Phone className="h-4 w-4 text-slate-400" />
                                    {caseData.user?.phone || 'Not provided'}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                    {caseData.user?.email || 'Not provided'}
                                </div>
                            </div>

                            <Button variant="outline" className="w-full mt-2">
                                Contact Citizen
                            </Button>
                        </CardContent>
                    </Card>

                    {caseData.evidence && (
                        <Card className="border-l-4 border-l-blue-500">
                            <CardHeader className="bg-slate-50">
                                <CardTitle className="flex items-center gap-2 text-blue-700">
                                    <Paperclip className="h-4 w-4" /> Evidence Attached
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <a
                                    href={`http://localhost:5000${caseData.evidence}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200 hover:bg-slate-100 transition-colors group"
                                >
                                    <span className="text-xs font-mono text-slate-600 truncate mr-2">
                                        {caseData.evidence.split('/').pop()}
                                    </span>
                                    <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-blue-500" />
                                </a>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader className="bg-slate-50 border-b border-slate-100">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Shield className="h-5 w-5 text-indigo-600" /> Investigation Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
                                {caseData.investigationUpdates && caseData.investigationUpdates.length > 0 ? (
                                    caseData.investigationUpdates.slice().reverse().map((update, idx) => (
                                        <div key={idx} className="bg-slate-50 p-3 rounded border border-slate-100 text-sm">
                                            <p className="text-slate-800">{update.note}</p>
                                            <p className="text-xs text-slate-400 mt-2 flex justify-between">
                                                <span>By: {update.officerName || 'Officer'}</span>
                                                <span>{new Date(update.updatedAt).toLocaleString()}</span>
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-400 text-center py-2">No investigation notes yet.</p>
                                )}
                            </div>

                            <textarea
                                className="w-full h-24 p-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                                placeholder="Add update/note about investigation..."
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                            ></textarea>
                            <Button
                                size="sm"
                                className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700"
                                onClick={handleAddNote}
                                isLoading={updating}
                                disabled={!newNote.trim()}
                            >
                                Add Note
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CaseDetails;
