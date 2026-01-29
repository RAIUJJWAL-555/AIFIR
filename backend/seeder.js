const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Citizen = require('./models/Citizen');
const Complaint = require('./models/Complaint');

dotenv.config();
connectDB();

const importData = async () => {
    try {
        await Complaint.deleteMany();
        await User.deleteMany();
        await Citizen.deleteMany();

        console.log('DB Cleared...');

        // 1. Create Citizen
        const citizen = await Citizen.create({
            name: 'Rahul Sharma',
            email: 'user@example.com',
            password: '123', 
            role: 'citizen',
            phone: '9876543210',
            address: 'New Delhi, India'
        });

        // 2. Create Officials (Police/Admin)
        const admin = await User.create({
            name: 'System Admin',
            email: 'admin@police.gov.in',
            password: '123',
            role: 'police', // Admin logic
            badgeId: 'POLICE-ADMIN-001',
            phone: '100'
        });
        
         const officer = await User.create({
            name: 'Inspector Vikram',
            email: 'vikram@police.gov.in',
            password: '123',
            role: 'police',
            badgeId: 'POLICE-007',
            phone: '112'
        });

        console.log('Users & Citizens Created.');

        // 3. Create Complaints linked to Citizen
        await Complaint.create([
            {
                user: citizen._id,
                onModel: 'Citizen',
                title: 'Mobile Phone Theft',
                description: 'Stolen iPhone at Metro Station.',
                incidentType: 'Theft',
                location: 'Delhi Metro',
                incidentDate: new Date(),
                incidentTime: '10:00 AM',
                status: 'Pending'
            },
             {
                user: citizen._id,
                onModel: 'Citizen',
                title: 'Online Fraud',
                description: 'Lost 5000 via UPI scam.',
                incidentType: 'Fraud',
                location: 'Online',
                incidentDate: new Date(),
                incidentTime: '2:00 PM',
                status: 'FIR Registered'
            }
        ]);
        
        console.log('Sample Complaints Imported.');
        process.exit();

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

importData();
