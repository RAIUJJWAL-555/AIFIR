import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, User, Lock, ArrowRight, Activity } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

const Login = () => {
    const [role, setRole] = useState('citizen'); // 'citizen', 'police', 'admin'
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const loggedInUser = await login(role, identifier.trim(), password.trim());
            toast.success('Successfully logged in!');
            // Navigate based on returned role
            if (loggedInUser.role === 'citizen') {
                navigate('/user/dashboard');
            } else if (loggedInUser.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (loggedInUser.role === 'police') {
                navigate('/police/my-cases');
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
        <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-10 left-10 w-64 h-64 bg-primary-600/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md space-y-8 relative z-10 animate-in fade-in zoom-in duration-500">
                <div className="text-center">
                    <div className="mx-auto h-20 w-20 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 mb-6 border border-primary-500/30">
                        <ShieldCheck className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">Access Portal</h2>
                    <p className="mt-2 text-navy-200">AI-Assisted FIR System</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
                    {/* Role Switcher */}
                    <div className="grid grid-cols-3 gap-2 p-1 bg-navy-950/50 rounded-lg mb-8 border border-white/5">
                        {['citizen', 'police', 'admin'].map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => { setRole(r); setIdentifier(''); }}
                                className={`py-2 text-xs font-semibold rounded-md transition-all uppercase tracking-wider ${role === r
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'text-navy-300 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <User className="absolute left-3 top-3.5 h-5 w-5 text-navy-400 group-focus-within:text-primary-400 transition-colors" />
                                <input
                                    type={role === 'police' ? "text" : "email"}
                                    placeholder={role === 'police' ? "Badge Number" : "Email Address"}
                                    className="w-full bg-navy-900/50 border border-navy-700 text-white placeholder-navy-500 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-navy-400 group-focus-within:text-primary-400 transition-colors" />
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    className="w-full bg-navy-900/50 border border-navy-700 text-white placeholder-navy-500 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <Link to="/forgot-password" className="font-medium text-primary-400 hover:text-primary-300 transition-colors">
                                Forgot password?
                            </Link>
                            {role === 'citizen' && (
                                <Link to="/register" className="font-medium text-primary-400 hover:text-primary-300 transition-colors">
                                    Create Account
                                </Link>
                            )}
                        </div>

                        <Button type="submit" className="w-full h-12 text-base shadow-lg shadow-primary-900/20" isLoading={isLoading}>
                            Sign In to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>
                </div>

                <p className="text-center text-xs text-navy-400">
                    Secure Justice Delivery Platform &copy; 2026.
                </p>
            </div>
        </div>
    );
};

export default Login;
