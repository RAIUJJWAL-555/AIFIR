import { useState } from 'react';
import { toast } from 'react-toastify';
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
        dob: '',
        aadharNumber: '',
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
            const data = new FormData();
            data.append('name', formData.name.trim());
            data.append('email', formData.email.trim());
            data.append('phone', formData.phone.trim());
            data.append('dob', formData.dob);
            data.append('aadharNumber', formData.aadharNumber.trim());
            data.append('password', formData.password.trim());
            data.append('role', 'citizen');

            if (formData.aadharCard) {
                data.append('aadharCard', formData.aadharCard);
            }

            await axios.post('http://localhost:5000/api/auth/register', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
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
        <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-10 left-10 w-64 h-64 bg-primary-600/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md space-y-8 relative z-10 animate-in fade-in zoom-in duration-500">
                <div className="text-center">
                    <Link to="/" className="inline-block">
                        <div className="mx-auto h-16 w-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 mb-6 border border-primary-500/30">
                            <ShieldCheck className="h-8 w-8 text-white" />
                        </div>
                    </Link>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h2>
                    <p className="mt-2 text-navy-200">Join the AI-Assisted FIR System regarding safety.</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-4">
                            <div className="relative group">
                                <User className="absolute left-3 top-3.5 h-5 w-5 text-navy-400 group-focus-within:text-primary-400 transition-colors" />
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full bg-navy-900/50 border border-navy-700 text-white placeholder-navy-500 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-navy-400 group-focus-within:text-primary-400 transition-colors" />
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full bg-navy-900/50 border border-navy-700 text-white placeholder-navy-500 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <Phone className="absolute left-3 top-3.5 h-5 w-5 text-navy-400 group-focus-within:text-primary-400 transition-colors" />
                                <input
                                    name="phone"
                                    type="tel"
                                    placeholder="Phone Number"
                                    className="w-full bg-navy-900/50 border border-navy-700 text-white placeholder-navy-500 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <label className="block text-xs font-medium text-navy-300 mb-1 ml-1">Date of Birth (as per Aadhar)</label>
                                <input
                                    name="dob"
                                    type="date"
                                    className="w-full bg-navy-900/50 border border-navy-700 text-white placeholder-navy-500 rounded-xl py-3 pl-3 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    required
                                    max={new Date().toISOString().split("T")[0]}
                                />
                            </div>

                            <div className="relative group">
                                <ShieldCheck className="absolute left-3 top-3.5 h-5 w-5 text-navy-400 group-focus-within:text-primary-400 transition-colors" />
                                <input
                                    name="aadharNumber"
                                    type="text"
                                    placeholder="Aadhar Number"
                                    className="w-full bg-navy-900/50 border border-navy-700 text-white placeholder-navy-500 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    value={formData.aadharNumber}
                                    onChange={handleChange}
                                    required
                                    minLength={12}
                                    maxLength={12}
                                />
                            </div>

                            <div className="relative group">
                                <label className="block text-xs font-medium text-navy-300 mb-1">Upload Aadhar Card (PDF/Image)</label>
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => setFormData({ ...formData, aadharCard: e.target.files[0] })}
                                    className="block w-full text-sm text-navy-300
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-xs file:font-semibold
                                        file:bg-primary-600 file:text-white
                                        hover:file:bg-primary-500
                                        cursor-pointer
                                    "
                                />
                            </div>

                            <div className="relative group">
                                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-navy-400 group-focus-within:text-primary-400 transition-colors" />
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    className="w-full bg-navy-900/50 border border-navy-700 text-white placeholder-navy-500 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-navy-400 group-focus-within:text-primary-400 transition-colors" />
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="w-full bg-navy-900/50 border border-navy-700 text-white placeholder-navy-500 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="text-xs text-navy-400 mt-2">
                            By registering, you agree to our <a href="#" className="text-primary-400 hover:text-primary-300 underline">Terms of Service</a> and <a href="#" className="text-primary-400 hover:text-primary-300 underline">Privacy Policy</a>.
                        </div>

                        <Button type="submit" className="w-full h-12 text-base shadow-lg shadow-primary-900/20" isLoading={isLoading}>
                            Create Account <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-navy-300">Already have an account? </span>
                        <Link to="/login" className="font-medium text-primary-400 hover:text-primary-300 transition-colors">
                            Sign in
                        </Link>
                    </div>
                </div>

                <p className="text-center text-xs text-navy-400">
                    Secure Justice Delivery Platform &copy; 2026.
                </p>
            </div>
        </div>
    );
};

export default Register;
