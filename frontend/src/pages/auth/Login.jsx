import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, User, Lock, ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

const Login = () => {
    const [role, setRole] = useState('user'); // 'user' or 'police'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const loggedInUser = await login(role, email, password);
            toast.success('Successfully logged in!');
            // Navigate based on returned role
            if (loggedInUser.role === 'citizen') {
                navigate('/user/dashboard');
            } else if (loggedInUser.role === 'police' || loggedInUser.role === 'admin') {
                navigate('/police/dashboard');
            } else {
                navigate('/'); // Fallback
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 mb-6">
                        <ShieldCheck className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">AI-Assisted FIR System</h2>
                    <p className="mt-2 text-slate-600">Secure Justice Delivery Platform</p>
                </div>

                <Card className="border-t-4 border-t-primary-600 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-xl text-center">Welcome Back</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Role Switcher */}
                        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg mb-6">
                            <button
                                type="button"
                                onClick={() => setRole('user')}
                                className={`py-2 text-sm font-medium rounded-md transition-all ${role === 'user'
                                    ? 'bg-white text-primary-700 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                Citizen
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('police')}
                                className={`py-2 text-sm font-medium rounded-md transition-all ${role === 'police'
                                    ? 'bg-white text-primary-700 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                Official
                            </button>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-4">
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <Input
                                        type={role === 'user' ? "email" : "text"}
                                        placeholder={role === 'user' ? "Email address" : "Badge Number"}
                                        className="pl-10"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        className="pl-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                                    Forgot password?
                                </Link>
                                {role === 'user' && (
                                    <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                                        Register new account
                                    </Link>
                                )}
                            </div>

                            <Button type="submit" className="w-full" isLoading={isLoading}>
                                Sign in to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-slate-500">
                    Government of India &copy; 2024. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Login;
