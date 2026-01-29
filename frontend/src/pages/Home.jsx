import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/layout/PublicNavbar';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import {
    FileText,
    Shield,
    Cpu,
    CheckCircle,
    ArrowRight,
    Lock,
    Globe,
    Activity,
    ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
    >
        <div className="h-12 w-12 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
            <Icon className="h-6 w-6 text-primary-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </motion.div>
);

const StepCard = ({ number, title, description }) => (
    <div className="relative flex flex-col items-center text-center p-6 bg-white rounded-xl border-l-4 border-primary-500 shadow-sm">
        <div className="absolute -top-4 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {number}
        </div>
        <h3 className="text-lg font-bold text-slate-900 mt-4 mb-2">{title}</h3>
        <p className="text-slate-600 text-sm">{description}</p>
    </div>
);

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <PublicNavbar />

            {/* HERO SECTION */}
            <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-primary-700 text-xs font-semibold mb-6 border border-blue-100">
                        <span className="flex h-2 w-2 rounded-full bg-primary-600 animate-pulse"></span>
                        Official Government Initiative
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
                        <span className="block">AI-Assisted</span>
                        <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">FIR System</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                        A secure, transparent, and intelligent digital platform empowering citizens to file complaints and enabling police to manage investigations efficiently.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="px-8 text-base shadow-lg shadow-primary-500/20"
                            onClick={() => navigate('/login')}
                        >
                            File a Complaint <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button
                            size="lg"
                            variant="secondary"
                            className="px-8 text-base"
                            onClick={() => navigate('/login')}
                        >
                            Police Login
                        </Button>
                    </div>
                </motion.div>
            </section>

            {/* FEATURES SECTION */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Smart Policing Features</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Leveraging advanced technology to streamline the First Information Report process.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={FileText}
                            title="Online Complaint & Pre-FIR"
                            description="Register complaints from anywhere, anytime. Our system guides you through the necessary details for a complete report."
                        />
                        <FeatureCard
                            icon={Cpu}
                            title="AI-Generated Drafts"
                            description="Our intelligent assistant analyses your complaint description and auto-drafts a professional FIR for police review."
                        />
                        <FeatureCard
                            icon={Activity}
                            title="Real-time Status Tracking"
                            description="Track the progress of your complaint in real-time with granular status updates and notifications."
                        />
                        <FeatureCard
                            icon={Shield}
                            title="Police Dashboard"
                            description="A dedicated, feature-rich dashboard for officials to review, approve, and manage investigations efficiently."
                        />
                        <FeatureCard
                            icon={Lock}
                            title="Secure & Transparent"
                            description="Role-based access control and encrypted data storage ensures absolute privacy and integrity of legal records."
                        />
                        <FeatureCard
                            icon={Globe}
                            title="Multi-Language Support"
                            description="Interface accessible in multiple regional languages to ensure every citizen can access justice easily."
                        />
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section id="how-it-works" className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
                        <p className="text-slate-600">A seamless four-step process from complaint to investigation.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <StepCard number="1" title="Register" description="Citizen logs in and submits incident details with evidence." />
                        <StepCard number="2" title="AI Processing" description="System analyzes input and generates a preliminary FIR draft." />
                        <StepCard number="3" title="Police Review" description="Officer validates the draft, makes corrections, and approves it." />
                        <StepCard number="4" title="Investigation" description="FIR is registered, officer assigned, and investigation begins." />
                    </div>
                </div>
            </section>

            {/* WHY AI */}
            <section id="about" className="py-20 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Why AI in Law Enforcement?</h2>
                            <div className="space-y-4">
                                {[
                                    "Drastically reduces time taken to draft FIRs.",
                                    "Minimizes human error in recording details.",
                                    "Ensures standardized legal language usage.",
                                    "Allows police to focus more on field investigation."
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start">
                                        <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 shrink-0" />
                                        <p className="text-slate-700">{item}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8">
                                <Button onClick={() => navigate('/login')}>Get Started Now</Button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/20 to-transparent rounded-2xl transform rotate-3"></div>
                            <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl relative">
                                <pre className="text-xs text-green-400 font-mono leading-relaxed overflow-hidden">
                                    {`> INITIALIZING AI MODULE...
> LOADING CRIME_DATA_SETS... [OK]
> ANALYZING INCIDENT_REPORT...
> DETECTED TYPE: "THEFT_MOBILE"
> CONFIDENCE SCORE: 98.4%
> GENERATING LEGAL_DRAFT_V1...

SUBJECT: FIRST INFORMATION REPORT
----------------------------------
Based on the provided statement, 
a cognizable offence under Section 
379 of IPC has been identified...
`}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <ShieldCheck className="h-8 w-8 text-white" />
                                <span className="text-xl font-bold text-white">AI-FiR Sys</span>
                            </div>
                            <p className="text-sm text-slate-400 max-w-sm">
                                A Government of India initiative (Prototype) to modernize the criminal justice system through technology, ensuring efficient and transparent service delivery.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-4">Contact & Support</h4>
                            <p className="text-sm">Helpline: 100 / 112</p>
                            <p className="text-sm mt-2">Email: privacy@police.gov.in</p>
                            <p className="text-sm mt-2">New Delhi, India</p>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
                        <p>&copy; 2026 AI-Assisted FIR System. All rights reserved.</p>
                        <p className="mt-2">Disclaimer: This is a demo project for educational/prototype purposes.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
