import express from 'express';
import Admin from '../models/AdminSchema.js';
import Manager from '../models/ManagerSchema.js';
import Employee from '../models/EmployeeSchema.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = null;
        let role = null;

        // 1. Check Admin
        user = await Admin.findOne({ email });
        if (user) {
            role = 'admin';
        } else {
            // 2. Check Manager
            user = await Manager.findOne({ emailId: email }); // Note: ManagerSchema uses emailId
            if (user) {
                role = 'manager';
            } else {
                // 3. Check Employee
                user = await Employee.findOne({ emailId: email }); // Note: EmployeeSchema uses emailId
                if (user) role = 'employee';
            }
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Handle missing password (Legacy Data Support)
        if (!user.password) {
             const defaultPass = role === 'manager' ? 'manager' : (role === 'employee' ? 'employee' : 'admin');
             
             if (password === defaultPass) {
                 // Auto-repair: Hash and save the default password
                 // Use findByIdAndUpdate to bypass strict schema validation (e.g. missing required fields in legacy data)
                 const hashedPassword = await bcrypt.hash(defaultPass, 10);
                 
                 if (role === 'admin') await Admin.findByIdAndUpdate(user._id, { password: hashedPassword });
                 else if (role === 'manager') await Manager.findByIdAndUpdate(user._id, { password: hashedPassword });
                 else if (role === 'employee') await Employee.findByIdAndUpdate(user._id, { password: hashedPassword });
                 
                 // Update local user object so login continues
                 user.password = hashedPassword;
             } else {
                 return res.status(400).json({ message: 'Account has no password set. Try default password.' });
             }
        }

        // Verify Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Fallback for plain text (migration support)
            if (user.password !== password) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
        }

        // Return user info
        const userData = user.toObject();
        delete userData.password;

        // Add role explicitly if not present in schema (though we added it)
        userData.role = role;
        // Normalize ID for frontend
        userData._id = user._id;
        userData.username = user.username || user.firstName; // Fallback for name display

        res.status(200).json({
            message: 'Login successful',
            user: userData
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Temporary Seed Admin Route
router.get('/seed-admin', async (req, res) => {
    try {
        const adminEmail = "admin@kaka.com";
        const existingAdmin = await Admin.findOne({ email: adminEmail });
        if (existingAdmin) {
            return res.json({ message: "Admin already exists", admin: existingAdmin });
        }

        const newAdmin = new Admin({
            username: "Super Admin",
            email: adminEmail,
            password: "admin", // Will be hashed by pre-save
            role: "admin"
        });
        await newAdmin.save();
        res.json({ message: "Admin created successfully", admin: newAdmin });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
