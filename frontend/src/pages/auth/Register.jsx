import { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, User, Mail, Lock, ArrowRight, Phone } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); // We might auto-login after register
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            await axios.post('http://localhost:5000/api/auth/register', {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                role: 'citizen'
            });

            toast.success('Account created successfully!');

            // Auto login as user
            await login('citizen', formData.email, formData.password);

            navigate('/user/dashboard');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <Link to="/" className="inline-block">
                        <div className="mx-auto h-16 w-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 mb-6">
                            <ShieldCheck className="h-10 w-10 text-white" />
                        </div>
                    </Link>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Create Account</h2>
                    <p className="mt-2 text-slate-600">Join the AI-Assisted FIR System for safer communities.</p>
                </div>

                <Card className="border-t-4 border-t-primary-600 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-xl text-center">Citizen Registration</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-4">
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <Input
                                        name="name"
                                        type="text"
                                        placeholder="Full Name"
                                        className="pl-10"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <Input
                                        name="email"
                                        type="email"
                                        placeholder="Email Address"
                                        className="pl-10"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <Input
                                        name="phone"
                                        type="tel"
                                        placeholder="Phone Number"
                                        className="pl-10"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <Input
                                        name="password"
                                        type="password"
                                        placeholder="Password"
                                        className="pl-10"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <Input
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Confirm Password"
                                        className="pl-10"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="text-xs text-slate-500 mt-2">
                                By registering, you agree to our <a href="#" className="text-primary-600 underline">Terms of Service</a> and <a href="#" className="text-primary-600 underline">Privacy Policy</a>.
                            </div>

                            <Button type="submit" className="w-full" isLoading={isLoading}>
                                Create Account <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-slate-600">Already have an account? </span>
                            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                                Sign in
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-slate-500">
                    Government of India &copy; 2024. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Register;
