import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Mock Password Reset Logic
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitted(true);
        setIsLoading(false);
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
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Recover Account</h2>
                    <p className="mt-2 text-slate-600">Enter your email to reset your password.</p>
                </div>

                <Card className="border-t-4 border-t-primary-600 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-xl text-center">Forgot Password</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!isSubmitted ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <Input
                                        type="email"
                                        placeholder="Registered Email Address"
                                        className="pl-10"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full" isLoading={isLoading}>
                                    Send Reset Link <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center space-y-4">
                                <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <Mail className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-slate-900">Check your email</h3>
                                    <p className="text-sm text-slate-500 mt-2">
                                        We have sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
                                    </p>
                                </div>
                                <Button variant="outline" className="w-full" onClick={() => setIsSubmitted(false)}>
                                    Try another email
                                </Button>
                            </div>
                        )}

                        <div className="mt-6 text-center text-sm">
                            <Link to="/login" className="font-medium text-slate-600 hover:text-primary-600 flex items-center justify-center gap-2">
                                <ArrowLeft className="h-4 w-4" /> Back to Login
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

export default ForgotPassword;
