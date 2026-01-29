import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Sparkles, MapPin, Upload, ArrowLeft } from 'lucide-react';

const RegisterComplaint = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        type: '',
        date: '',
        time: '',
        location: '',
        description: '',
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedDraft, setGeneratedDraft] = useState('');

    const handleAIAssist = async () => {
        if (!formData.description) return;

        setIsGenerating(true);
        // Simulate AI Call
        await new Promise(resolve => setTimeout(resolve, 2000));

        setGeneratedDraft(`FIRST INFORMATION REPORT (DRAFT)
    
Date: ${new Date().toLocaleDateString()}
Subject: Complaint regarding ${formData.type || 'Instruction'}

To,
The Station House Officer,
Local Police Station,

Respected Sir/Madam,

I am writing to formally report an incident of ${formData.type || '...'} that occurred on ${formData.date} at approximately ${formData.time}.

Details of the incident:
${formData.description}

The incident took place at ${formData.location}.

I request you to kindly register an FIR and take necessary legal action.

Sincerely,
[Complainant Name]`);

        setIsGenerating(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                aiDraft: generatedDraft
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
                                    <Input
                                        label="Location Checkpoint"
                                        placeholder="e.g. Near City Mall"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Describe the Incident
                                    </label>
                                    <textarea
                                        rows={6}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Please describe exactly what happened..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                    <p className="mt-2 text-xs text-slate-500 flex items-center justify-between">
                                        <span>Be as specific as possible.</span>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={handleAIAssist}
                                            isLoading={isGenerating}
                                            disabled={!formData.description}
                                            className="ml-auto"
                                        >
                                            <Sparkles className="mr-2 h-3 w-3" />
                                            Generate FIR Draft
                                        </Button>
                                    </p>
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
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                                <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                                <p className="text-sm font-medium text-slate-700">Click to upload</p>
                                <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Location Map</CardTitle></CardHeader>
                        <CardContent>
                            <div className="bg-slate-200 h-48 rounded-lg flex items-center justify-center text-slate-500 relative overflow-hidden group">
                                <MapPin className="h-8 w-8 text-slate-400" />
                                <span className="ml-2 text-sm font-medium">Map Placeholder</span>
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button variant="secondary" size="sm">Set on Map</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default RegisterComplaint;
