import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Sparkles, MapPin, Upload, ArrowLeft } from 'lucide-react';

const RegisterComplaint = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        type: '',
        date: '',
        time: '',
        location: '',
        description: '',
        complainantName: user?.name || '',
        aadharNumber: '',
    });

    // Update name if user loads late
    useState(() => {
        if (user?.name) {
            setFormData(prev => ({ ...prev, complainantName: user.name }));
        }
    }, [user]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedDraft, setGeneratedDraft] = useState('');
    const [uploading, setUploading] = useState(false);
    const [evidence, setEvidence] = useState('');
    const [isClassifying, setIsClassifying] = useState(false);
    const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
    const [locationLoading, setLocationLoading] = useState(false);

    const handleAutoClassify = async () => {
        if (!formData.description) return;

        setIsClassifying(true);
        try {
            const token = sessionStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await axios.post('http://localhost:5000/api/ai/classify', {
                description: formData.description
            }, config);

            if (data.success && data.ai) {
                console.log("Frontend Received AI Data:", data.ai);

                // Determine mapped type
                const aiType = data.ai.crime_type?.trim();
                const validTypes = ["Theft", "Cyber Crime", "Harassment", "Lost Property", "Fraud", "Robbery", "Assault", "Other"];

                // Case-insensitive match attempt
                const matchedType = validTypes.find(t => t.toLowerCase() === aiType?.toLowerCase());
                const finalType = matchedType || "Other";

                if (!matchedType) {
                    console.warn(`AI returned unknown type: '${aiType}'. Defaulting to 'Other'.`);
                }

                setFormData(prev => ({
                    ...prev,
                    type: finalType
                }));

                toast.success(`AI Detected: ${finalType} (Severity: ${data.ai.severity})`);

                // Also trigger draft generation automatically if not done
                // Pass the finalType directly to ensure draft uses it
                if (!generatedDraft) {
                    handleAIAssist(finalType);
                }
            }

        } catch (error) {
            console.error("AI Classify Error:", error);
            toast.error("Could not auto-classify. Please select manually.");
        } finally {
            setIsClassifying(false);
        }
    };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('evidence', file);
        setUploading(true);

        try {
            const token = sessionStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await axios.post('http://localhost:5000/api/upload', formData, config);
            setEvidence(data);
            setUploading(false);
            toast.success('Evidence uploaded successfully');
        } catch (error) {
            console.error(error);
            setUploading(false);
            toast.error('File upload failed');
        }
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCoordinates({ lat: latitude, lng: longitude });
                setFormData(prev => ({
                    ...prev,
                    location: `Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)}` // Auto-fill text as well
                }));
                setLocationLoading(false);
                toast.success("Location coordinates captured!");
            },
            (error) => {
                console.error("Error getting location:", error);
                toast.error("Unable to retrieve your location. Please ensure location access is enabled.");
                setLocationLoading(false);
            }
        );
    };

    const handleAIAssist = async (typeOverride = null) => {
        const currentType = typeOverride || formData.type;
        if (!formData.description) return;

        // Ensure coordinates are captured for draft
        if (!coordinates.lat || !coordinates.lng) {
            toast.info("Please capture your location coordinates first for the FIR draft.");
            // Optional: Auto trigger capture?
            // handleGetLocation(); 
            return;
        }

        setIsGenerating(true);
        // Simulate AI Call (or we could use the AI endpoint here too if we wanted a better draft)
        await new Promise(resolve => setTimeout(resolve, 1500));

        setGeneratedDraft(`FIRST INFORMATION REPORT (DRAFT)
    
Date: ${new Date().toLocaleDateString()}
Subject: Complaint regarding ${currentType || 'Incident'}

To,
The Station House Officer,
Local Police Station,

Respected Sir/Madam,

I am writing to formally report an incident of ${currentType || '...'} that occurred on ${formData.date || '[Date]'} at approximately ${formData.time || '[Time]'}.

Details of the incident:
${formData.description}

The incident took place at ${formData.location || '[Location]'} (GPS: ${coordinates.lat?.toFixed(6)}, ${coordinates.lng?.toFixed(6)}).

I request you to kindly register an FIR and take necessary legal action.

Sincerely,
${user?.name || '[Complainant Name]'}`);

        setIsGenerating(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (user?.role === 'citizen' && user?.identityStatus !== 'Verified') {
            toast.error("Your identity is not verified yet. FIR submission requires verified identity.");
            return;
        }

        try {
            const token = sessionStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            await axios.post('http://localhost:5000/api/complaints', {
                title: `${formData.type} Incident`, // Using type as title for now, or could add a title field
                incidentType: formData.type,
                description: formData.description,
                incidentDate: formData.date,
                incidentTime: formData.time,
                location: formData.location,
                aiDraft: generatedDraft,
                evidence: evidence,
                latitude: coordinates.lat,
                longitude: coordinates.lng,
                complainantName: formData.complainantName,
                aadharNumber: formData.aadharNumber
            }, config);

            toast.success('Complaint Submitted Successfully!');
            navigate('/user/dashboard');
        } catch (error) {
            console.error("Error submitting complaint:", error);
            toast.error(error.response?.data?.message || 'Failed to submit complaint. Please try again.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="pl-0 hover:bg-transparent hover:text-primary-600">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Register Complaint</h1>
                    <p className="text-slate-500 mt-1">File a new complaint with AI assistance.</p>
                </div>
                <div className="bg-primary-50 px-4 py-2 rounded-lg border border-primary-100 flex items-center text-primary-700 text-sm font-medium">
                    <Sparkles className="mr-2 h-4 w-4 text-primary-600" />
                    AI Assistant Active
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Incident Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <label className="block text-sm font-medium text-slate-700">
                                            Describe the Incident
                                        </label>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="accent"
                                            onClick={handleAutoClassify}
                                            isLoading={isClassifying}
                                            disabled={!formData.description}
                                            className="text-xs py-1 h-7"
                                        >
                                            <Sparkles className="mr-2 h-3 w-3" />
                                            Auto-Fill Details
                                        </Button>
                                    </div>
                                    <textarea
                                        rows={6}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Please describe exactly what happened. We will try to auto-detect the incident type."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                    <p className="mt-1 text-xs text-slate-500">
                                        Be specific. Example: "My wallet was stolen near City Mall yesterday evening."
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Complainant Name"
                                        placeholder="Full Name"
                                        value={formData.complainantName}
                                        onChange={(e) => setFormData({ ...formData, complainantName: e.target.value })}
                                        required
                                    />
                                    <Input
                                        label="Aadhar Number"
                                        placeholder="12-digit Aadhar Number"
                                        value={formData.aadharNumber}
                                        onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                                        required
                                        maxLength={12}
                                        minLength={12}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Incident Type
                                        </label>
                                        <select
                                            className="flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Type</option>
                                            <option value="Theft">Theft</option>
                                            <option value="Cyber Crime">Cyber Crime</option>
                                            <option value="Harassment">Harassment</option>
                                            <option value="Lost Property">Lost Property</option>
                                            <option value="Fraud">Fraud</option>
                                            <option value="Robbery">Robbery</option>
                                            <option value="Assault">Assault</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <Input
                                        type="date"
                                        label="Date of Incident"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        type="time"
                                        label="Approx. Time"
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        required
                                    />
                                    <div className="md:col-span-1">
                                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Location & GPS <span className="text-red-500">*</span>
                                        </label>
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                placeholder="e.g. Near City Mall"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                required
                                            />
                                            <div className="flex gap-2">
                                                <div className={`flex-1 flex items-center px-3 py-2 border rounded-lg bg-slate-50 text-slate-600 text-xs ${!coordinates.lat ? 'border-red-300' : 'border-slate-300'}`}>
                                                    <MapPin className="h-3 w-3 mr-2 text-slate-400" />
                                                    {coordinates.lat
                                                        ? `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`
                                                        : "GPS Required *"}
                                                </div>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    onClick={handleGetLocation}
                                                    isLoading={locationLoading}
                                                    variant={coordinates.lat ? "success" : "secondary"}
                                                    className="py-1 h-9 text-xs"
                                                >
                                                    {coordinates.lat ? "Update GPS" : "Get GPS"}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {generatedDraft && (
                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 animate-in fade-in slide-in-from-top-2">
                                        <h4 className="text-sm font-semibold text-slate-900 mb-2 flex items-center">
                                            <Sparkles className="mr-2 h-4 w-4 text-purple-500" />
                                            AI Generated Draft
                                        </h4>
                                        <pre className="text-xs text-slate-600 whitespace-pre-wrap font-sans bg-white p-3 rounded border border-slate-100">
                                            {generatedDraft}
                                        </pre>
                                    </div>
                                )}

                                <div className="pt-4">
                                    <Button type="submit" size="lg" className="w-full">
                                        Submit Complaint
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Evidence Upload</CardTitle></CardHeader>
                        <CardContent>
                            <label className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer block">
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={uploadFileHandler}
                                    accept=".jpg,.jpeg,.png,.pdf"
                                />
                                <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                                {uploading ? (
                                    <p className="text-sm font-medium text-primary-600 animate-pulse">Uploading...</p>
                                ) : evidence ? (
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-green-600">File Received!</p>
                                        <p className="text-xs text-slate-500 truncate">{evidence.split('/').pop()}</p>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm font-medium text-slate-700">Click to upload</p>
                                        <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                                    </>
                                )}
                            </label>
                            {evidence && (
                                <p className="text-[10px] text-slate-400 mt-2 text-center">
                                    Evidence attached to report
                                </p>
                            )}
                        </CardContent>
                    </Card>


                </div>
            </div>
        </div>
    );
};

export default RegisterComplaint;
