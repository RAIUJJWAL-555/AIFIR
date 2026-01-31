import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { ShieldCheck, Menu, X } from 'lucide-react';

const PublicNavbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'Services', href: '#services' },
        { name: 'Tech', href: '#about' }, // Renamed for modern feel
        { name: 'Contact', href: '#' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-navy-900/90 backdrop-blur-md shadow-lg border-b border-white/10 py-3'
                    : 'bg-transparent py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${isScrolled ? 'bg-primary-600/20' : 'bg-white/10'}`}>
                            <ShieldCheck className={`h-7 w-7 ${isScrolled ? 'text-primary-400' : 'text-white'}`} />
                        </div>
                        <span className={`text-xl font-bold tracking-tight ${isScrolled ? 'text-white' : 'text-white'}`}>
                            AI-FiR Sys
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-medium transition-colors ${isScrolled
                                        ? 'text-navy-100 hover:text-primary-400'
                                        : 'text-navy-100 hover:text-white'
                                    }`}
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Desktop Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/login">
                            <Button variant="ghost" className={`${isScrolled ? 'text-white hover:text-primary-300' : 'text-white hover:text-primary-200'}`}>Log In</Button>
                        </Link>
                        <Link to="/register">
                            <Button className="bg-primary-600 hover:bg-primary-700 text-white border-none shadow-lg shadow-primary-900/20">Register</Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`p-2 ${isScrolled ? 'text-white' : 'text-white'}`}
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-navy-900 border-t border-navy-800 shadow-xl absolute w-full left-0">
                    <div className="px-4 pt-2 pb-6 space-y-4">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="block px-3 py-2 text-base font-medium text-navy-200 hover:text-white hover:bg-navy-800 rounded-md"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}
                        <div className="pt-4 flex flex-col gap-3">
                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                <Button variant="secondary" className="w-full justify-center bg-navy-800 text-white border-navy-700">Log In</Button>
                            </Link>
                            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                <Button className="w-full justify-center bg-primary-600">Register</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default PublicNavbar;
