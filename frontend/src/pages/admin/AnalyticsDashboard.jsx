import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import api from '../../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const AnalyticsDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/admin/analytics'); // Changed to api/admin/analytics in server? no, we made a new route file.
                // Wait, logic check: I mapped '/api/analytics' in server.js.
                // I need to make sure the endpoint matches.
                // Correction: In server.js I added app.use('/api/analytics', ...)
                // So the endpoint is /api/analytics

                const response = await api.get('/analytics');
                setData(response.data);
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading Analytics...</div>;
    if (!data) return <div className="p-8 text-center">No Analytics Data Available</div>;

    return (
        <div className="p-6 space-y-8 bg-slate-50 min-h-screen">
            <h1 className="text-3xl font-bold text-slate-800">Crime Analytics Dashboard (AI-Assisted)</h1>
            <p className="text-slate-500 italic">Disclamer: Crime categorization and lethality data is AI-assisted and subject to police verification.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 1. Area Wise Crime */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Crime by Area</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.areaStats}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="_id" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#8884d8" name="Crimes" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Lethality Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Lethality Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.lethalityStats}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="count"
                                    nameKey="_id"
                                    label
                                >
                                    {data.lethalityStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Monthly Trends */}
                <div className="bg-white p-6 rounded-xl shadow-md md:col-span-2">
                    <h3 className="text-xl font-semibold mb-4">Monthly Trends</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.monthlyStats.map(item => ({
                                name: `${item._id.month}/${item._id.year}`,
                                count: item.count
                            }))}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="count" stroke="#82ca9d" name="Reports" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 4. Crime Type Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-md md:col-span-2">
                    <h3 className="text-xl font-semibold mb-4">Crime Type Distribution (AI-Classified)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.crimeTypeStats} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="_id" type="category" width={150} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#ff8042" name="Crimes" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
