import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { UserCheck, Shield, ChevronRight } from 'lucide-react';
import axios from 'axios';

const OfficerAssignment = () => {
    // Mock officers for now since we don't have an endpoint
    const officers = [
        { id: '1', name: 'Insp. Vikram Singh', badge: 'POLICE-007', status: 'Available', cases: 2 },
        { id: '2', name: 'Sub-Insp. Aditi Rao', badge: 'POLICE-042', status: 'On Duty', cases: 5 },
        { id: '3', name: 'Constable Rajesh Kumar', badge: 'POLICE-108', status: 'Busy', cases: 8 },
    ];

    const [unassignedCases, setUnassignedCases] = useState([]);

    useEffect(() => {
        const fetchCases = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/complaints/all', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Filter for FIRs that are 'FIR Registered' but not 'assigned' (mock logic since no assigned field used yet really)
                // For demo, just show all 'FIR Registered'
                setUnassignedCases(response.data.filter(c => c.status === 'FIR Registered'));
            } catch (err) {
                console.error(err);
            }
        };
        fetchCases();
    }, []);

    const handleAssign = (caseId, officerName) => {
        alert(`Assigned Case ${caseId} to ${officerName}`);
        // In real app, API call to update 'assignedOfficer' field
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Officer Assignment</h1>
                <p className="text-slate-500 mt-1">Delegate incoming FIRs to investigating officers.</p>
            </div>

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
                                    <p className="text-xs text-slate-500">{officer.badge}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs px-2 py-1 rounded-full ${officer.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {officer.status}
                                    </span>
                                    <p className="text-xs text-slate-400 mt-1">{officer.cases} active cases</p>
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
                                        <select className="flex-1 text-sm border-slate-300 rounded-md py-2 px-3 bg-white border focus:ring-2 focus:ring-primary-500 outline-none">
                                            <option>Select Officer...</option>
                                            {officers.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                                        </select>
                                        <Button onClick={() => handleAssign(c._id.substring(c._id.length - 6), 'Selected Officer')}>
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
