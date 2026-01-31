const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const createAdmin = async () => {
    try {
        const adminEmail = 'admin@police.gov.in';
        
        // Always delete first to ensure we set the correct password
        await Admin.deleteOne({ email: adminEmail });
        console.log('Cleaned up any existing admin user');

        const admin = await Admin.create({
            name: 'System Admin',
            email: adminEmail,
            password: 'adminpassword123',
            role: 'admin',
            phone: '9999999999'
        });
        console.log('Admin user created successfully with password: adminpassword123');
        
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createAdmin();
