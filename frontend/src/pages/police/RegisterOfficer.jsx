import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { UserPlus, Shield, BadgeCheck } from 'lucide-react';

const RegisterOfficer = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        badgeId: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = sessionStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            await axios.post('http://localhost:5000/api/admin/officers', formData, config);

            toast.success('Officer registered successfully!');
            setFormData({
                name: '',
                email: '',
                password: '',
                phone: '',
                badgeId: ''
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to register officer');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                    <UserPlus className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Register Police Officer</h1>
                    <p className="text-sm text-slate-500">Create a new official account for investigative purposes.</p>
                </div>
            </div>

            <Card>
                <CardHeader className="border-b border-slate-100">
                    <CardTitle className="text-lg">Officer Credentials</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Full Name"
                                placeholder="e.g. Officer John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <Input
                                label="Badge ID"
                                icon={BadgeCheck}
                                placeholder="e.g. POL-5562"
                                value={formData.badgeId}
                                onChange={(e) => setFormData({ ...formData, badgeId: e.target.value })}
                                required
                            />
                        </div>

                        <Input
                            label="Official Email Address"
                            type="email"
                            placeholder="officer@police.gov.in"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                            <Input
                                label="Phone Number"
                                placeholder="+91 9988776655"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 flex gap-3 items-start mt-6">
                            <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
                            <div className="text-sm text-amber-800">
                                <p className="font-semibold">Important Security Notice</p>
                                <p className="mt-1 opacity-90">
                                    The Badge ID will be required for the officer to log in. Please ensure it is unique and follows the department standard.
                                </p>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white"
                                isLoading={loading}
                            >
                                Register Official
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default RegisterOfficer;
