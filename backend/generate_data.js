const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Citizen = require('./models/Citizen');
const Complaint = require('./models/Complaint');

dotenv.config();
connectDB();

const scenarios = [
    // 1. Theft - Non-Violent
    {
        name: "Aarav Patel", incidentType: "Theft", location: "Connaught Place, Delhi",
        desc: "My wallet was stolen from my back pocket while I was shopping in the inner circle market. It contained my ID and 2000 rupees.",
        crimeType: "Theft", lethality: "Non-Violent"
    },
    // 2. Cyber Crime - Non-Violent
    {
        name: "Priya Sharma", incidentType: "Cyber Crime", location: "Online",
        desc: "I received a phishing email claiming to be from my bank. I clicked the link and entered my details, and 10,000 rupees were deducted.",
        crimeType: "Cyber Crime", lethality: "Non-Violent"
    },
    // 3. Assault - Violent
    {
        name: "Rohan Singh", incidentType: "Physical Assault", location: "Sector 18, Noida",
        desc: "Two men pushed me and started beating me up near the metro station parking lot. I have sustained injuries on my face.",
        crimeType: "Assault", lethality: "Violent"
    },
    // 4. Harassment - Low Violence
    {
        name: "Aditi Gupta", incidentType: "Harassment", location: "Bus Stop, Karol Bagh",
        desc: "A group of boys has been following me and making inappropriate comments every time I wait for the bus.",
        crimeType: "Sexual Harassment", lethality: "Low Violence"
    },
    // 5. Fraud - Non-Violent
    {
        name: "Vikram Malhotra", incidentType: "Fraud", location: "Gurgaon",
        desc: "I was promised a job and asked to pay a registration fee of 5000. After payment, the contact person blocked my number.",
        crimeType: "Fraud", lethality: "Non-Violent"
    },
    // 6. Domestic Violence - Violent
    {
        name: "Suman Verma", incidentType: "Other", location: "Dwarka, Delhi",
        desc: "My husband beat me last night after an argument. This has happened multiple times. I am scared for my safety.",
        crimeType: "Domestic Violence", lethality: "Violent"
    },
    // 7. Murder Attempt - Life Threatening
    {
        name: "Karan Johar", incidentType: "Physical Assault", location: "Highway near Murthal",
        desc: "Someone shot at my car while I was driving on the highway. The bullet hit the window. It was definitely an attempt on my life.",
        crimeType: "Murder Attempt", lethality: "Life Threatening"
    },
    // 8. Missing Person - Low Violence
    {
        name: "Anjali Devi", incidentType: "Other", location: "Chandni Chowk",
        desc: "My 10-year-old son went to the market and hasn't returned for 5 hours. We have searched everywhere.",
        crimeType: "Missing Person", lethality: "Low Violence"
    },
    // 9. Robbery - Violent
    {
        name: "Suresh Raina", incidentType: "Theft", location: "Lajpat Nagar",
        desc: "Two men on a bike snatched my gold chain at gunpoint. They threatened to shoot if I shouted.",
        crimeType: "Robbery", lethality: "Violent"
    },
    // 10. Theft - Non-Violent
    {
        name: "Meera Reddy", incidentType: "Theft", location: "Hauz Khas",
        desc: "My bicycle was stolen from outside my gym. I had locked it, but the lock was broken.",
        crimeType: "Theft", lethality: "Non-Violent"
    },
    // 11. Cyber Crime - Non-Violent
    {
        name: "Arjun Rampal", incidentType: "Cyber Crime", location: "Mumbai (Remote)",
        desc: "Someone hacked my Instagram account and is sending message to my friends asking for money.",
        crimeType: "Cyber Crime", lethality: "Non-Violent"
    },
    // 12. Lost Property - Non-Violent
    {
        name: "Nita Ambani", incidentType: "Lost Property", location: "Airport T3",
        desc: "I lost my handbag at the airport terminal. It contains important documents and keys.",
        crimeType: "Theft", lethality: "Non-Violent" // Auto-classified as theft/loss
    },
    // 13. Traffic Violation - Non-Violent
    {
        name: "Ranveer Singh", incidentType: "Traffic Violation", location: "CP Outer Circle",
        desc: "A car jumped the red light and hit my bumper. The driver fled the scene.",
        crimeType: "Theft", lethality: "Non-Violent" // Misclassification test or simple non-violent
    },
    // 14. Sexual Harassment - Low Violence
    {
        name: "Deepika P", incidentType: "Harassment", location: "Office, Cyber City",
        desc: "My colleague keeps sending me unwelcome inappropriate messages and staring at me.",
        crimeType: "Sexual Harassment", lethality: "Low Violence"
    },
    // 15. Assault - Life Threatening
    {
        name: "John Abraham", incidentType: "Physical Assault", location: "Saket Mall",
        desc: "A gang attacked a shopkeeper with knives. He is critically injured and taken to the hospital.",
        crimeType: "Assault", lethality: "Life Threatening"
    },
    // 16. Fraud - Non-Violent
    {
        name: "Vijay Mallya", incidentType: "Fraud", location: "Bank Street",
        desc: "Use credit card skimmed. Unauthorized transaction of 50,000 rupees happened.",
        crimeType: "Fraud", lethality: "Non-Violent"
    },
    // 17. Robbery - Violent
    {
        name: "Shahrukh Khan", incidentType: "Theft", location: "Mannat Area",
        desc: "Thieves broke into my house while we were sleeping and took jewelry. They had knives.",
        crimeType: "Robbery", lethality: "Violent"
    },
    // 18. Domestic Violence - Life Threatening
    {
        name: "Kangana R", incidentType: "Other", location: "Bandra",
        desc: "My neighbor looks badly beaten and I heard screaming that 'he will kill me'. Please help.",
        crimeType: "Domestic Violence", lethality: "Life Threatening"
    },
    // 19. Cyber Crime - Non-Violent
    {
        name: "Hrithik Roshan", incidentType: "Cyber Crime", location: "Online",
        desc: "My identity was used to create a fake profile to scam people.",
        crimeType: "Cyber Crime", lethality: "Non-Violent"
    },
    // 20. Theft - Non-Violent
    {
        name: "Varun Dhawan", incidentType: "Theft", location: "Juhu Beach",
        desc: "My shoes were stolen while I was walking on the beach.",
        crimeType: "Theft", lethality: "Non-Violent"
    }
];

const generateData = async () => {
    try {
        console.log("Creating 20 users and complaints...");
        
        // await Citizen.deleteMany({ email: { $regex: 'testuser' } }); // Optional: Clean up old test users

        for (let i = 0; i < scenarios.length; i++) {
            const s = scenarios[i];
            const email = `testuser${i + 1}@example.com`;
            
            // Check if user exists, else create
            let user = await Citizen.findOne({ email });
            if (!user) {
                user = await Citizen.create({
                    name: s.name,
                    email: email,
                    password: 'password123',
                    phone: '9876543210',
                    address: s.location
                });
            }

            // Create Complaint
            await Complaint.create({
                user: user._id,
                onModel: 'Citizen',
                title: `${s.incidentType} Incident`,
                description: s.desc,
                incidentType: s.incidentType,
                location: s.location,
                incidentDate: new Date(),
                incidentTime: '12:00 PM',
                status: 'Pending',
                // Pre-filling AI fields for accurate analysis testing
                crimeType: s.crimeType,
                lethality: s.lethality,
                crimeConfidence: 0.95,
                lethalityConfidence: 0.90
            });
            
            console.log(`Created record for ${s.name} - ${s.crimeType}`);
        }

        console.log("Successfully generated 20 records!");
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

generateData();
