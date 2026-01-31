import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, FileText, User, Shield, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { toast } from 'react-toastify';

const IdentityVerification = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchPendingUsers = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('http://localhost:5000/api/admin/pending-identities', config);
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load pending verifications");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const handleVerify = async (userId, isApproved) => {
        setActionLoading(userId);
        try {
            const token = sessionStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const payload = {
                status: isApproved ? 'Verified' : 'Rejected',
                remark: isApproved ? 'Identity verified by Admin' : 'Document unclear or mismatch'
            };

            await axios.patch(`http://localhost:5000/api/admin/verify-identity/${userId}`, payload, config);

            toast.success(isApproved ? "User Verified Successfully" : "User Verification Rejected");

            // Remove user from list
            setUsers(users.filter(u => u._id !== userId));
        } catch (error) {
            console.error(error);
            toast.error("Action failed");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading pending verifications...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-navy-900">Identity Verification Requests</h1>
                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                    {users.length} Pending
                </span>
            </div>

            {users.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center text-slate-500">
                        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                        <p className="text-lg">All caught up! No pending identity verifications.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {users.map((user) => {
                        // AI Confidence Logic
                        // High Confidence: Has Aadhaar Keyword AND 12-digit number (Green-ish / Yellow indication)
                        // Low Confidence: Missing either (Red indication)
                        const isAiVerified = user.ocrResult?.hasAadhaarWord && user.ocrResult?.has12DigitNumber;
                        const borderColorClass = isAiVerified ? 'border-l-yellow-500' : 'border-l-red-500';

                        return (
                            <Card key={user._id} className={`overflow-hidden border-l-4 ${borderColorClass}`}>
                                <CardContent className="p-6">
                                    <div className="flex flex-col lg:flex-row gap-6">
                                        {/* User Details */}
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                                                    <User className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>
                                                    <p className="text-sm text-slate-500">{user.email}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 text-sm mt-4 bg-slate-50 p-4 rounded-lg">
                                                <div>
                                                    <span className="block text-slate-500 text-xs uppercase">Aadhar Number</span>
                                                    <span className="font-mono font-medium">{user.aadharNumber}</span>
                                                </div>
                                                <div>
                                                    <span className="block text-slate-500 text-xs uppercase">Date of Birth</span>
                                                    <span className="font-medium">
                                                        {user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'}
                                                    </span>
                                                </div>
                                                <div className="col-span-2">
                                                    <span className="block text-slate-500 text-xs uppercase">Phone</span>
                                                    <span className="font-medium">{user.phone}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* OCR & Document */}
                                        <div className="flex-1 space-y-4 border-l border-slate-100 pl-6">
                                            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                                                <Shield className="h-4 w-4 text-primary-600" />
                                                AI Analysis (OCR)
                                                {!isAiVerified && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Low Confidence</span>}
                                                {isAiVerified && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">High Confidence</span>}
                                            </h4>

                                            <div className="space-y-2">
                                                <div className={`flex items-center gap-2 text-sm ${user.ocrResult?.hasAadhaarWord ? 'text-green-700' : 'text-red-700'}`}>
                                                    {user.ocrResult?.hasAadhaarWord ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                                    <span>Contains "Aadhaar" Keyword</span>
                                                </div>
                                                <div className={`flex items-center gap-2 text-sm ${user.ocrResult?.has12DigitNumber ? 'text-green-700' : 'text-red-700'}`}>
                                                    {user.ocrResult?.has12DigitNumber ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                                    <span>Valid 12-digit Number Found</span>
                                                </div>
                                                <div className={`flex items-center gap-2 text-sm ${user.ocrResult?.hasDOB ? 'text-green-700' : 'text-yellow-600'}`}>
                                                    {user.ocrResult?.hasDOB ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                                                    <span>DOB Pattern Found</span>
                                                </div>
                                            </div>

                                            {user.aadharCardPath ? (
                                                <a
                                                    href={`http://localhost:5000${user.aadharCardPath}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-sm text-primary-600 font-medium hover:underline bg-primary-50 px-3 py-2 rounded-lg w-full justify-center border border-primary-100"
                                                >
                                                    <FileText className="h-4 w-4" />
                                                    View Uploaded Document
                                                </a>
                                            ) : (
                                                <div className="text-red-500 text-sm flex items-center gap-2 bg-red-50 p-2 rounded">
                                                    <AlertTriangle className="h-4 w-4" /> No Document Uploaded
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col justify-center gap-3 min-w-[150px]">
                                            <Button
                                                variant="secondary" // Greenish in our theme usually, or we style manually
                                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                                                onClick={() => handleVerify(user._id, true)}
                                                isLoading={actionLoading === user._id}
                                                disabled={!!actionLoading}
                                            >
                                                <CheckCircle className="h-4 w-4 mr-2" /> Verify
                                            </Button>
                                            <Button
                                                variant="danger"
                                                className="w-full"
                                                onClick={() => handleVerify(user._id, false)}
                                                isLoading={actionLoading === user._id}
                                                disabled={!!actionLoading}
                                            >
                                                <XCircle className="h-4 w-4 mr-2" /> Reject
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default IdentityVerification;
