import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/layout/PublicNavbar';
import Button from '../components/ui/Button';
import {
    FileText,
    Shield,
    Users,
    CheckCircle,
    ArrowRight,
    Lock,
    Globe,
    Activity,
    Search,
    AlertTriangle,
    FileCheck,
    UserCheck,
    Megaphone,
    MapPin,
    X,
    Loader
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import axios from 'axios';

const ServiceCard = ({ icon: Icon, title, description, color = "text-primary-600", bg = "bg-primary-50" }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="group bg-white rounded-xl border border-navy-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
        <div className="p-6">
            <div className={`h-14 w-14 ${bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`h-7 w-7 ${color}`} />
            </div>
            <h3 className="text-xl font-bold text-navy-900 mb-3 group-hover:text-primary-700 transition-colors">{title}</h3>
            <p className="text-navy-500 text-sm leading-relaxed mb-4">{description}</p>

            <div className="flex items-center text-primary-600 font-semibold text-sm group-hover:underline">
                Access Service <ArrowRight className="ml-2 h-4 w-4" />
            </div>
        </div>
    </motion.div>
);

const Home = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [stationResults, setStationResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setStationResults([]);
        setShowResults(true);

        try {
            // 1. Geocode the location (using simple public API for demo)
            const geoRes = await axios.get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: searchQuery,
                    format: 'json',
                    limit: 1
                }
            });

            if (geoRes.data && geoRes.data.length > 0) {
                const { lat, lon } = geoRes.data[0];

                // 2. Fetch nearby stations from our backend
                const stationsRes = await axios.post('http://localhost:5000/api/stations/nearby', {
                    lat: parseFloat(lat),
                    lon: parseFloat(lon),
                    radius: 20000 // 20km radius (Efficient for Delhi NCR coverage)
                });

                setStationResults(stationsRes.data);
            } else {
                setStationResults([]); // Location not found
            }
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-navy-50 font-sans text-navy-900 selection:bg-primary-200">
            <PublicNavbar />

            {/* HERO SECTION - Modern Glassmorphism */}
            <section id="home" className="relative pt-32 pb-32 bg-navy-900">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-800/50 border border-navy-700 text-primary-300 text-sm font-medium mb-8 backdrop-blur-sm">
                            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
                            Official AI-Integrated Future Policing Initiative
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                            Smart Policing for a <br />
                            <span className="bg-gradient-to-r from-primary-400 via-primary-200 to-white bg-clip-text text-transparent">
                                Safer Tomorrow
                            </span>
                        </h1>

                        <p className="text-xl text-navy-200 mb-12 max-w-2xl mx-auto font-light">
                            Experience the next generation of law enforcement. seamless FIR filing, real-time tracking, and AI-powered investigations at your fingertips.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={() => navigate('/login')}
                                className="gov-btn-accent text-lg px-8 py-4 shadow-lg shadow-accent/20"
                            >
                                File e-FIR Now
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="px-8 py-3.5 rounded-lg border border-navy-600 text-white font-medium hover:bg-navy-800 transition-all"
                            >
                                Official Login
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Glass Search Bar Overlay */}
                <div className="absolute -bottom-8 left-0 w-full z-20 px-4">
                    <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl flex flex-col items-center relative">
                        <div className="flex flex-col md:flex-row gap-4 items-center w-full">
                            <div className="flex-1 w-full relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 h-5 w-5" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Enter location to find nearby stations..."
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="w-full bg-navy-900/50 border border-navy-700 text-white placeholder-navy-300 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                />
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <button
                                    onClick={handleSearch}
                                    disabled={loading}
                                    className="flex-1 md:flex-none px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center min-w-[100px]"
                                >
                                    {loading ? <Loader className="h-5 w-5 animate-spin" /> : "Search"}
                                </button>
                            </div>
                        </div>

                        {/* Search Results Dropdown */}
                        <AnimatePresence>
                            {showResults && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-navy-100 overflow-hidden z-50 max-h-80 overflow-y-auto"
                                >
                                    <div className="flex justify-between items-center p-3 border-b border-gray-100 bg-gray-50 sticky top-0">
                                        <h3 className="text-sm font-bold text-navy-800">
                                            {loading ? 'Searching...' : `Results near "${searchQuery}"`}
                                        </h3>
                                        <button onClick={() => setShowResults(false)} className="text-gray-500 hover:text-red-500">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="p-2">
                                        {!loading && stationResults.length === 0 && (
                                            <div className="p-4 text-center text-gray-500 text-sm">
                                                No police stations found nearby or invalid location.
                                            </div>
                                        )}

                                        {stationResults.map((station, idx) => (
                                            <div key={idx} className="flex items-start gap-3 p-3 hover:bg-blue-50 rounded-lg transition-colors border-b last:border-0 border-gray-50">
                                                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg shrink-0">
                                                    <Shield className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-navy-900 text-sm truncate">{station.tags?.name || 'Police Station'}</h4>
                                                    <p className="text-xs text-navy-500 truncate">{station.tags?.['addr:city'] || 'Local Station'}</p>
                                                </div>
                                                <a
                                                    href={`https://www.google.com/maps/search/?api=1&query=${station.lat},${station.lon}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1"
                                                >
                                                    <MapPin className="h-3 w-3" /> Map
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* NEWS TICKER */}
            <div className="bg-navy-900 border-b border-navy-800 pt-12 pb-2">
                <div className="max-w-7xl mx-auto px-4 flex items-center gap-4 overflow-hidden">
                    <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider shrink-0 animate-pulse">
                        Breaking News
                    </div>
                    <div className="w-full overflow-hidden whitespace-nowrap">
                        <div className="inline-block animate-marquee text-navy-200 text-sm">
                            <span className="mx-4">• New Cyber Crime Reporting Portal launched for faster redressal.</span>
                            <span className="mx-4">• Annual Police Marathon scheduled for next Sunday. Registration open.</span>
                            <span className="mx-4">• Traffic advisory: Heavy rain expected in downtown areas. Drive safely.</span>
                            <span className="mx-4">• AI-powered surveillance system implementation begins in Phase 1.</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* CITIZEN SERVICES SECTION */}
            <section id="services" className="py-24 bg-navy-50 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-primary-700 font-bold tracking-wide uppercase text-sm mb-2">Public Services</h2>
                        <h3 className="text-4xl font-extrabold text-navy-900">Citizen Centric Services</h3>
                        <div className="w-24 h-1.5 bg-accent mx-auto mt-6 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <ServiceCard
                            icon={FileText}
                            title="Register e-FIR"
                            description="File a First Information Report online for lost articles, theft, or other non-heinous crimes instantly."
                        />
                        <ServiceCard
                            icon={Megaphone}
                            title="Report Cyber Crime"
                            description="Dedicated channel for reporting financial fraud, cyber bullying, and online harassment."
                            color="text-red-500"
                            bg="bg-red-50"
                        />
                        <ServiceCard
                            icon={UserCheck}
                            title="Character Verification"
                            description="Apply for police verification certificates for employment, passport, or tenant verification."
                            color="text-green-600"
                            bg="bg-green-50"
                        />
                        <ServiceCard
                            icon={Search}
                            title="Lost & Found"
                            description="Search the database for recovered vehicles, mobile phones, and unidentified persons."
                            color="text-orange-500"
                            bg="bg-orange-50"
                        />
                        <ServiceCard
                            icon={Users}
                            title="Missing Persons"
                            description="View list of missing persons or report a missing family member directly to the special cell."
                            color="text-purple-600"
                            bg="bg-purple-50"
                        />
                        <ServiceCard
                            icon={FileCheck}
                            title="View FIR Details"
                            description="Check the status of your lodged FIR and download copies by entering the FIR number."
                            color="text-blue-600"
                            bg="bg-blue-50"
                        />
                    </div>
                </div>
            </section>

            {/* WHY AI - Dark Modern Section */}
            <section className="py-24 bg-navy-900 relative overflow-hidden">
                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-block px-4 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-400 text-sm font-medium mb-6">
                                Powered by Advanced AI
                            </div>
                            <h2 className="text-4xl font-extrabold text-white mb-6">Redefining Law Enforcement with Technology.</h2>
                            <p className="text-navy-300 text-lg mb-8 leading-relaxed">
                                Our platform integrates cutting-edge Artificial Intelligence to analyze patterns, predict hotspots, and assist officers in drafting accurate investigation reports, reducing the timeline from days to hours.
                            </p>

                            <div className="space-y-4">
                                {[
                                    "Zero-Shot Crime Classification Models",
                                    "Automated Legal Draft Generation",
                                    "Real-time Predictive Analytics",
                                    "Seamless Digital Evidence Management"
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center">
                                        <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center mr-4 border border-green-500/40">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                        </div>
                                        <p className="text-navy-100 font-medium">{item}</p>
                                    </div>
                                ))}
                            </div>

                            <button className="mt-10 text-white border-b border-primary-500 pb-1 hover:text-primary-400 transition-colors flex items-center gap-2">
                                Read our Technology Whitepaper <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-primary-500/20 rounded-2xl filter blur-xl transform translate-y-4"></div>
                            <div className="bg-navy-800 border border-navy-700 p-1 rounded-2xl shadow-2xl relative overflow-hidden">
                                <div className="bg-navy-950 rounded-xl p-6 font-mono text-sm h-80 overflow-y-auto custom-scrollbar">
                                    <div className="flex gap-2 mb-4">
                                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                        <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                    </div>
                                    <div className="text-green-400 mb-2">$ git clone ai-fir-system</div>
                                    <div className="text-blue-400 mb-2">{`> Cloning into 'ai-fir-system'...`}</div>
                                    <div className="text-navy-400 mb-4">{`> Unpacking objects: 100% (402/402), done.`}</div>
                                    <div className="text-white mb-2">$ ./init_neural_core.sh</div>
                                    <div className="text-accent mb-2">{`> [SYSTEM] Connecting to Neural Core...`}</div>
                                    <div className="text-accent mb-2">{`> [SYSTEM] Loading NLP Models (RoBERTa, GPT-4)...`}</div>
                                    <div className="text-green-400 mb-2">{`> [SUCCESS] AI Agent Online. Ready to process complaints.`}</div>
                                    <div className="text-white mt-4 animate-pulse">_</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SAFETY TIP CARD */}
            <section className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="bg-gradient-to-r from-navy-900 to-navy-800 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="bg-red-500/20 p-4 rounded-full border border-red-500/30">
                                <AlertTriangle className="h-10 w-10 text-red-500" />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-2xl font-bold text-white mb-2">Emergency Assistance Required?</h3>
                                <p className="text-navy-200">
                                    In case of immediate threat, medical emergency, or fire, please do not file an online complaint. Call the national emergency number immediately.
                                </p>
                            </div>
                            <div className="text-center">
                                <span className="block text-sm text-navy-300 mb-1">Emergency Number</span>
                                <span className="block text-5xl font-black text-white tracking-widest">112</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-navy-950 text-slate-300 py-16 border-t border-navy-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-white/10 p-2 rounded-lg">
                                    <Shield className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white leading-none">AIFIR</h3>
                                    <span className="text-xs text-primary-400 tracking-wider">SECURE & SMART</span>
                                </div>
                            </div>
                            <p className="text-sm text-navy-400 leading-relaxed mb-6">
                                A next-generation law enforcement platform helping citizens and officers via AI-driven workflows.
                            </p>
                            <div className="flex gap-4">
                                {/* Social placeholders */}
                                <div className="w-8 h-8 rounded-full bg-navy-800 flex items-center justify-center hover:bg-primary-600 transition-colors cursor-pointer"><Globe className="h-4 w-4 text-white" /></div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6 flex items-center gap-2"><div className="w-1 h-4 bg-accent rounded-full"></div> Quick Links</h4>
                            <ul className="space-y-3 text-sm text-navy-300">
                                <li><a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Home</a></li>
                                <li><a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> About Department</a></li>
                                <li><a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Report Crime</a></li>
                                <li><a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> FAQ</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6 flex items-center gap-2"><div className="w-1 h-4 bg-accent rounded-full"></div> Services</h4>
                            <ul className="space-y-3 text-sm text-navy-300">
                                <li><a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Character Verification</a></li>
                                <li><a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Domestic Help Verify</a></li>
                                <li><a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Processions Request</a></li>
                                <li><a href="#" className="hover:text-primary-400 transition-colors flex items-center gap-2"><ArrowRight className="h-3 w-3" /> Protest Permission</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6 flex items-center gap-2"><div className="w-1 h-4 bg-accent rounded-full"></div> Contact</h4>
                            <div className="p-4 bg-navy-900 rounded-xl border border-navy-800">
                                <p className="text-xs text-navy-400 uppercase tracking-widest mb-1">Helpline</p>
                                <p className="text-2xl font-bold text-white mb-4">112 / 100</p>

                                <p className="text-xs text-navy-400 uppercase tracking-widest mb-1">Email</p>
                                <p className="text-sm text-white">support@uppolice.gov.in</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-navy-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-navy-500">
                        <p>&copy; 2026 AI-Assisted FIR System. All rights reserved.</p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-white transition-colors">Accessibility</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
