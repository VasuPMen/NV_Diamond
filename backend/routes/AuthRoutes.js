import express from 'express';
import User from '../models/UserSchema.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check password (supports both plain text and bcrypt hash)
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`Login Attempt: ${email}`);
        console.log(`Stored Hash: ${user.password}`);
        console.log(`Input Password: ${password}`);
        console.log(`Bcrypt Match: ${isMatch}`);

        if (!isMatch) {
            // Fallback for legacy plain text passwords (optional, remove in prod)
            if (user.password !== password) {
                console.log("Plain text match failed too");
                return res.status(400).json({
                    message: 'Invalid credentials',
                    debug: {
                        isBcryptMatch: isMatch,
                        storedStartsWith: user.password ? user.password.substring(0, 10) : "null",
                        inputLength: password.length
                    }
                });
            }
        }

        // Return user info (excluding password)
        const { password: _, ...userInfo } = user.toObject();

        res.status(200).json({
            message: 'Login successful',
            user: userInfo
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Register Route
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Check availability
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or Email already exists' });
        }

        const newUser = new User({
            username,
            email,
            password, // In production, hash this!
            role: role || 'employee'
        });

        await newUser.save();

        const { password: _, ...userInfo } = newUser.toObject();

        res.status(201).json({
            message: 'User registered successfully',
            user: userInfo
        });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
});

export default router;
