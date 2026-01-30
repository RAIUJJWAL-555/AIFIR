import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { UserCheck, Shield, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const OfficerAssignment = () => {
    // Mock officers for now since we don't have an endpoint
    const [officers, setOfficers] = useState([]);
    const [selectedOfficer, setSelectedOfficer] = useState({}); // { caseId: officerId }

    const [unassignedCases, setUnassignedCases] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // Fetch Complaints
                const complaintsRes = await axios.get('http://localhost:5000/api/complaints/all', config);
                // Filter for FIRs that are not resolved or rejected
                setUnassignedCases(complaintsRes.data.filter(c =>
                    (c.status === 'FIR Registered' || c.status === 'Under Review') && !c.assignedOfficer
                ));
                setPendingCount(complaintsRes.data.filter(c => c.status === 'Pending').length);

                // Fetch Officers
                const officersRes = await axios.get('http://localhost:5000/api/admin/officers', config);
                setOfficers(officersRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const handleAssign = async (caseId) => {
        const officerId = selectedOfficer[caseId];
        if (!officerId) return toast.warning('Please select an officer');

        try {
            const token = sessionStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/complaints/${caseId}`,
                { assignedOfficer: officerId, status: 'FIR Registered' },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Remove from list
            setUnassignedCases(current => current.filter(c => c._id !== caseId));
            toast.success('Officer Assigned Successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to assign officer');
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Officer Assignment</h1>
                <p className="text-slate-500 mt-1">Delegate incoming FIRs to investigating officers.</p>
            </div>

            {pendingCount > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-full text-amber-600">
                            <Shield className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-semibold text-amber-800">Action Required</p>
                            <p className="text-sm text-amber-600">There are {pendingCount} complaints awaiting your approval before they can be assigned.</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin/review'}>
                        Go to Review
                    </Button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Available Officers List */}
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="font-semibold text-slate-700 flex items-center">
                        <Shield className="mr-2 h-5 w-5 text-primary-600" />
                        Duty Roster
                    </h3>
                    {officers.map(officer => (
                        <Card key={officer.id} className="cursor-pointer hover:border-primary-300 transition-colors">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-slate-900">{officer.name}</p>
                                    <p className="text-xs text-slate-500">{officer.badgeId}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs px-2 py-1 rounded-full bg-green-100 text-green-700`}>
                                        Available
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Unassigned Cases */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-semibold text-slate-700 flex items-center">
                        <UserCheck className="mr-2 h-5 w-5 text-amber-600" />
                        Unassigned Cases ({unassignedCases.length})
                    </h3>

                    {unassignedCases.length === 0 ? (
                        <div className="p-8 border-2 border-dashed border-slate-200 rounded-lg text-center text-slate-400">
                            No cases pending assignment. Good job!
                        </div>
                    ) : (
                        unassignedCases.map(c => (
                            <Card key={c._id}>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900">{c.incidentType} Incident</h4>
                                            <p className="text-sm text-slate-500">Reported on {new Date(c.incidentDate).toLocaleDateString()}</p>
                                        </div>
                                        <Button size="sm" variant="outline">View Full Report</Button>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded">{c.description}</p>

                                    <div className="flex items-center gap-2">
                                        <select
                                            className="flex-1 text-sm border-slate-300 rounded-md py-2 px-3 bg-white border focus:ring-2 focus:ring-primary-500 outline-none"
                                            onChange={(e) => setSelectedOfficer({ ...selectedOfficer, [c._id]: e.target.value })}
                                            value={selectedOfficer[c._id] || ''}
                                        >
                                            <option value="">Select Officer...</option>
                                            {officers.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}
                                        </select>
                                        <Button onClick={() => handleAssign(c._id)}>
                                            Assign
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default OfficerAssignment;
