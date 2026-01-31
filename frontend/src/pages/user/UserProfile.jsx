import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Phone, MapPin, ShieldCheck, Fingerprint, Calendar, BadgeCheck, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { toast } from 'react-toastify';

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) {
                    toast.error("Not authenticated");
                    return;
                }

                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                const { data } = await axios.get('http://localhost:5000/api/auth/me', config);
                setProfile(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load profile");
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
            </div>
        );
    }

    if (!profile) {
        return <div className="text-center p-8 text-slate-500">Profile data not available.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="relative">
                {/* Header Content */}
                <div className="bg-gradient-to-r from-primary-700 to-primary-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden shadow-2xl relative">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 bg-white/5 rounded-full blur-2xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            <div className="h-32 w-32 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-4 border-white/30 shadow-2xl text-5xl font-bold">
                                {profile.name.charAt(0).toUpperCase()}
                            </div>

                            {/* Dynamic Header Badge */}
                            {(() => {
                                const isAiVerified = profile.ocrResult?.hasAadhaarWord && profile.ocrResult?.has12DigitNumber;
                                const isVerified = profile.identityStatus === 'Verified';
                                const isRejected = profile.identityStatus === 'Rejected';
                                const isPending = profile.identityStatus === 'Pending';

                                let badgeColor = 'bg-yellow-500'; // Default Pending
                                let title = 'Pending Verification';

                                if (isVerified) {
                                    badgeColor = 'bg-green-500';
                                    title = 'Verified Citizen';
                                } else if (isRejected || (isPending && !isAiVerified)) {
                                    badgeColor = 'bg-red-500';
                                    title = isRejected ? 'Rejected' : 'Low Confidence';
                                }

                                return (
                                    <div className={`absolute bottom-2 right-2 ${badgeColor} p-1.5 rounded-full border-2 border-primary-900`} title={title}>
                                        <BadgeCheck className="h-5 w-5 text-white" />
                                    </div>
                                );
                            })()}
                        </div>

                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-bold mb-2">{profile.name}</h1>
                            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm border border-white/30 flex items-center">
                                    <ShieldCheck className="w-3 h-3 mr-2" />
                                    {profile.role === 'citizen' ? 'Verified Citizen' : 'Police Official'}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm border border-white/30 truncate max-w-[200px]">
                                    ID: {profile._id}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-lg border-t-4 border-t-primary-500">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center">
                            <User className="mr-2 h-5 w-5 text-primary-600" />
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 text-blue-600">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Email Address</p>
                                <p className="text-slate-900 font-medium">{profile.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-4 text-green-600">
                                <Phone className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Phone Number</p>
                                <p className="text-slate-900 font-medium">{profile.phone}</p>
                            </div>
                        </div>

                        {profile.address && (
                            <div className="flex items-center p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center mr-4 text-orange-600">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Residential Address</p>
                                    <p className="text-slate-900 font-medium">{profile.address}</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="shadow-lg border-t-4 border-t-purple-500">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center">
                            <ShieldCheck className="mr-2 h-5 w-5 text-purple-600" />
                            Identity Verification
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-4 text-purple-600">
                                <Fingerprint className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Aadhar Number</p>
                                <p className="text-slate-900 font-mono font-bold tracking-widest">
                                    {profile.aadharNumber || 'Not Linked'}
                                </p>
                            </div>
                            {profile.aadharNumber && (
                                <div className="ml-2">
                                    {/* Dynamic Aadhar Badge */}
                                    {(() => {
                                        const isAiVerified = profile.ocrResult?.hasAadhaarWord && profile.ocrResult?.has12DigitNumber;
                                        const isVerified = profile.identityStatus === 'Verified';
                                        const isRejected = profile.identityStatus === 'Rejected';
                                        const isPending = profile.identityStatus === 'Pending';

                                        let textColor = 'text-yellow-500';

                                        if (isVerified) {
                                            textColor = 'text-green-500';
                                        } else if (isRejected || (isPending && !isAiVerified)) {
                                            textColor = 'text-red-500';
                                        }

                                        return <BadgeCheck className={`h-6 w-6 ${textColor}`} />;
                                    })()}
                                </div>
                            )}
                        </div>

                        {profile.aadharCardPath && (
                            <div className="flex items-center p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center mr-4 text-teal-600">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Aadhar Document</p>
                                    <a
                                        href={`http://localhost:5000${profile.aadharCardPath}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary-600 font-medium hover:underline flex items-center mt-1"
                                    >
                                        View Document <span className="ml-1">↗</span>
                                    </a>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4 text-indigo-600">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Member Since</p>
                                <p className="text-slate-900 font-medium">
                                    {new Date(profile.createdAt).toLocaleDateString('en-IN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                            <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center mr-4 text-pink-600">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Date of Birth</p>
                                <p className="text-slate-900 font-medium">
                                    {profile.dob ? new Date(profile.dob).toLocaleDateString('en-IN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }) : 'Not Provided'}
                                </p>
                            </div>
                        </div>

                        {(() => {
                            const isAiVerified = profile.ocrResult?.hasAadhaarWord && profile.ocrResult?.has12DigitNumber;
                            const isVerified = profile.identityStatus === 'Verified';
                            const isRejected = profile.identityStatus === 'Rejected';
                            const isPending = profile.identityStatus === 'Pending';

                            // Determine Badge Color & Type
                            let badgeClass = 'bg-yellow-50 border-yellow-200 text-yellow-800'; // Default Yellow (AI Match / Pending)
                            let icon = '⏳';
                            let title = 'Pending Verification';
                            let msg = "Your identity is being verified. AI check passed. Waiting for officer approval.";

                            if (isVerified) {
                                badgeClass = 'bg-green-50 border-green-200 text-green-800';
                                icon = '✅';
                                title = 'Verified';
                                msg = "Your KYC details are verified. You can generate e-FIRs instantly.";
                            } else if (isRejected) {
                                badgeClass = 'bg-red-50 border-red-200 text-red-800';
                                icon = '❌';
                                title = 'Rejected';
                                msg = `Verification Failed: ${profile.identityRemark || "Document mismatch"}. Please re-upload.`;
                            } else if (isPending && !isAiVerified) {
                                // Pending but AI failed / Low Confidence
                                badgeClass = 'bg-red-50 border-red-200 text-red-800';
                                icon = '⚠️';
                                title = 'Low Confidence / Scan Failed';
                                msg = "AI could not clearly detect Aadhaar details. Manual review required. It may be rejected if unclear.";
                            }

                            return (
                                <div className={`mt-4 p-4 rounded-lg border text-sm ${badgeClass}`}>
                                    <div className="flex items-start">
                                        <span className="mr-3 text-2xl">{icon}</span>
                                        <div>
                                            <strong className="block mb-1">{title}</strong>
                                            <span>{msg}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                    </CardContent>
                </Card >
            </div >
        </div >
    );
};

export default UserProfile;
