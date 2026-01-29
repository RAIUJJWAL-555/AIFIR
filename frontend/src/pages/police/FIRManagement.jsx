import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { FileBadge, Download, Printer, Eye } from 'lucide-react';

const FIRManagement = () => {
    const [firs, setFirs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFIRs = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/complaints/all', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Filter only registered FIRs
                const registered = response.data.filter(c =>
                    c.status === 'FIR Registered' || c.status === 'Resolved' || c.status === 'Under Investigation'
                );
                setFirs(registered);
            } catch (error) {
                console.error("Failed to fetch FIRs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFIRs();
    }, []);

    const generateMockPDF = (firId) => {
        alert(`Generating PDF for FIR #${firId.substring(firId.length - 6).toUpperCase()}... (Mock Action)`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">FIR Management</h1>
                    <p className="text-slate-500 mt-1">Access, print, and manage official First Information Reports.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <p className="col-span-full text-center py-8 text-slate-500">Loading FIR records...</p>
                ) : firs.length === 0 ? (
                    <div className="col-span-full py-12 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        <FileBadge className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500">No active FIRs found in the system.</p>
                    </div>
                ) : (
                    firs.map((fir) => (
                        <Card key={fir._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="bg-slate-900 h-2 w-full"></div>
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <p className="text-xs font-mono text-slate-500">FIR #{fir._id.substring(fir._id.length - 6).toUpperCase()}</p>
                                        <h3 className="text-lg font-bold text-slate-900 mt-1">{fir.incidentType} Case</h3>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-bold uppercase rounded ${fir.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {fir.status}
                                    </span>
                                </div>

                                <div className="space-y-3 text-sm text-slate-600 mb-6">
                                    <div className="flex justify-between">
                                        <span>Complainant:</span>
                                        <span className="font-medium text-slate-900">{fir.user?.name || 'Unknown'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Date:</span>
                                        <span className="font-medium text-slate-900">{new Date(fir.incidentDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Location:</span>
                                        <span className="font-medium text-slate-900 max-w-[150px] truncate text-right">{fir.location}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <Button variant="outline" size="sm" onClick={() => generateMockPDF(fir._id)}>
                                        <Printer className="mr-2 h-4 w-4" /> Print
                                    </Button>
                                    <Button variant="secondary" size="sm">
                                        <Eye className="mr-2 h-4 w-4" /> View
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default FIRManagement;
