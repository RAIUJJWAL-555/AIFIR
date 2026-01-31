import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { Loader, MapPin, Navigation, Shield } from 'lucide-react';
import L from 'leaflet';

// Fix Leaflet Default Icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const NearbyStations = () => {
    const [location, setLocation] = useState(null);
    const [stations, setStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [radius, setRadius] = useState(15000); // Default 15km

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
            },
            (err) => {
                setError('Unable to retrieve your location. Please enable location services.');
                setLoading(false);
            }
        );
    }, []);

    useEffect(() => {
        if (location) {
            fetchStations(location.lat, location.lon, radius);
        }
    }, [location, radius]);

    const fetchStations = async (lat, lon, searchRadius) => {
        try {
            setLoading(true);
            // Assuming backend is running on port 5000. 
            // In production, this should be an environment variable.
            const response = await axios.post('http://localhost:5000/api/stations/nearby', { lat, lon, radius: searchRadius });
            setStations(response.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch nearby police stations');
            setLoading(false);
        }
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(2);
    };

    if (loading) return (
        <div className="flex items-center justify-center p-12">
            <Loader className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Locating you...</span>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                        <Shield className="h-8 w-8 text-blue-600" />
                        Nearby Police Stations
                    </h1>
                    <p className="text-gray-500 mt-1">Locate and navigate to the nearest police stations.</p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-black-700 dark:text-black">Search Radius:</span>
                    <select
                        value={radius}
                        onChange={(e) => setRadius(Number(e.target.value))}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    >
                        <option value={5000}>5 km</option>
                        <option value={10000}>10 km</option>
                        <option value={15000}>15 km</option>
                        <option value={25000}>25 km</option>
                        <option value={50000}>50 km</option>
                    </select>
                </div>
            </div>

            {error ? (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl">
                    {error}
                </div>
            ) : (
                <>
                    {/* Map Section */}
                    <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border border-white/20 dark:border-gray-700 p-1 rounded-2xl shadow-xl">
                        {location && (
                            <div className="h-[400px] md:h-[500px] w-full rounded-xl overflow-hidden relative z-0">
                                <MapContainer center={[location.lat, location.lon]} zoom={13} style={{ height: '100%', width: '100%' }}>
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <Marker position={[location.lat, location.lon]}>
                                        <Popup>You are here</Popup>
                                    </Marker>
                                    {stations.map((s) => (
                                        <Marker key={s.id} position={[s.lat, s.lon]}>
                                            <Popup>
                                                <div className="p-1 min-w-[150px]">
                                                    <strong className="block text-sm font-bold text-gray-800">{s.tags.name || 'Police Station'}</strong>
                                                    <span className="text-xs text-blue-600 font-medium">
                                                        {calculateDistance(location.lat, location.lon, s.lat, s.lon)} km away
                                                    </span>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    ))}
                                </MapContainer>
                            </div>
                        )}
                    </div>

                    {/* List Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stations.map((s) => {
                            const dist = calculateDistance(location.lat, location.lon, s.lat, s.lon);
                            return (
                                <div key={s.id} className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 p-5 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                                            <Shield className="h-5 w-5" />
                                        </div>
                                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                            {dist} km
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors truncate">
                                        {s.tags.name || 'Police Station'}
                                    </h3>

                                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                        <div className="text-xs text-gray-500">
                                            {s.tags['addr:city'] ? `${s.tags['addr:city']}` : 'Local Station'}
                                        </div>
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lon}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                        >
                                            <Navigation className="h-4 w-4" />
                                            View on Map
                                        </a>
                                    </div>
                                </div>
                            )
                        })}

                        {stations.length === 0 && !loading && (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                                <MapPin className="h-10 w-10 mb-3 opacity-50" />
                                <p>No police stations found nearby.</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default NearbyStations;
