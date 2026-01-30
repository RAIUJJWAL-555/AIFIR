import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Search, FileText, CheckCircle, Clock, XCircle, User, Shield } from 'lucide-react';

const ComplaintStatus = () => {
    const [searchId, setSearchId] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchId) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const token = sessionStorage.getItem('token');
            // Fetch all my complaints to find the matching one (simulating short-ID search)
            // In a real production app with millions of records, you'd want a dedicated backend endpoint for this.
            const response = await axios.get('http://localhost:5000/api/complaints', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const complaints = response.data;
            const found = complaints.find(c =>
                c._id === searchId ||
                c._id.substring(c._id.length - 6).toUpperCase() === searchId.toUpperCase()
            );

            if (found) {
                setResult(found);
            } else {
                setError('No complaint found with this ID.');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to fetch tracking details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusStep = (currentStatus) => {
        const steps = ['Pending', 'Under Review', 'FIR Registered', 'Solved by Officer', 'Resolved'];
        if (currentStatus === 'Rejected') return -1;
        return steps.indexOf(currentStatus);
    };

    const currentStep = result ? getStatusStep(result.status) : 0;

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-900">Track Complaint Status</h1>
                <p className="text-slate-500 mt-2">Enter your Complaint ID to check the investigation progress.</p>
            </div>

            <Card className="border-t-4 border-t-primary-600 shadow-lg">
                <CardContent className="p-8">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Enter Complaint ID (e.g., 6F3A2B)"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                className="h-12 text-lg"
                                autoFocus
                            />
                        </div>
                        <Button type="submit" size="lg" disabled={loading} className="px-8 bg-primary-700 hover:bg-primary-800">
                            {loading ? 'Searching...' : <><Search className="mr-2 h-5 w-5" /> Track</>}
                        </Button>
                    </form>
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center animate-in fade-in">
                            <XCircle className="h-5 w-5 mr-2" />
                            {error}
                        </div>
                    )}
                </CardContent>
            </Card>

            {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    {/* Status Timeline */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg text-slate-700">Investigation Progress</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {result.status === 'Rejected' ? (
                                <div className="text-center py-4 text-red-600 bg-red-50 rounded-lg border border-red-100">
                                    <XCircle className="h-10 w-10 mx-auto mb-2" />
                                    <h3 className="text-lg font-bold">Complaint Rejected</h3>
                                    <p className="text-sm">Your complaint was reviewed and rejected. Please contact the station for more details.</p>
                                </div>
                            ) : (
                                <div className="relative flex justify-between pt-6 pb-2">
                                    {/* Progress Bar Background */}
                                    <div className="absolute top-[35%] left-0 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
                                    {/* Active Progress Bar */}
                                    <div
                                        className="absolute top-[35%] left-0 h-1 bg-green-500 -z-10 rounded-full transition-all duration-1000"
                                        style={{ width: `${(currentStep / 4) * 100}%` }}
                                    ></div>

                                    {[
                                        { s: 'Pending', label: 'Pending' },
                                        { s: 'Under Review', label: 'Review' },
                                        { s: 'FIR Registered', label: 'FIR' },
                                        { s: 'Solved by Officer', label: 'Officer Solved' },
                                        { s: 'Resolved', label: 'Resolved' }
                                    ].map((step, index) => {
                                        const isCompleted = index <= currentStep;
                                        const isCurrent = index === currentStep;
                                        return (
                                            <div key={step.s} className="flex flex-col items-center gap-2">
                                                <div
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500
                                                    ${isCompleted
                                                            ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                                                            : 'bg-slate-200 text-slate-400'}`}
                                                >
                                                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : index + 1}
                                                </div>
                                                <span className={`text-[10px] md:text-xs font-medium transition-colors ${isCurrent ? 'text-green-700 font-bold' : 'text-slate-500'}`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Complaint Details Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-primary-500" /> Case Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Title</p>
                                    <p className="text-slate-900 font-medium">{result.title}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Date</p>
                                        <p className="text-slate-900">{new Date(result.incidentDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Time</p>
                                        <p className="text-slate-900">{result.incidentTime}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Location</p>
                                    <p className="text-slate-900">{result.location}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Description</p>
                                    <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded mt-1">{result.description}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-indigo-500" /> Investigating Officer
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                                {result.assignedOfficer ? (
                                    <>
                                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700">
                                            <User className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">{result.assignedOfficer.name}</h3>
                                            <p className="text-indigo-600 font-medium">{result.assignedOfficer.badgeId || 'Senior Officer'}</p>
                                        </div>
                                        <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                            Currently Investigating
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                            <User className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-slate-500 font-medium">No Officer Assigned Yet</h3>
                                            <p className="text-slate-400 text-sm mt-1">Waiting for Station House Officer approval.</p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComplaintStatus;
