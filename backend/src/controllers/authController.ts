import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import { AuthRequest } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

interface RegisterBody {
    name: string;
    email: string;
    password: string;
    phone: string;
    city: string;
    municipalityType: 'Municipal Corporation' | 'Municipal Council' | 'Nagar Panchayat';
}

interface LoginBody {
    email: string;
    password: string;
}

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, phone, city, municipalityType }: RegisterBody = req.body;

        // Validate required fields
        if (!name || !email || !password || !phone || !city || !municipalityType) {
            res.status(400).json({ error: 'All fields are required' });
            return;
        }

        // Check if user already exists
        const existingUser = await pool.query(
            'SELECT id FROM authorities WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            res.status(400).json({ error: 'User with this email already exists' });
            return;
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create new user
        const result = await pool.query(
            `INSERT INTO authorities (name, email, password_hash, phone, city, municipality_type)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, phone, city, municipality_type`,
            [name, email, passwordHash, phone, city, municipalityType]
        );

        const newUser = result.rows[0];

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                city: newUser.city,
                municipalityType: newUser.municipality_type,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password }: LoginBody = req.body;

        // Validate required fields
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }

        // Find user by email
        const result = await pool.query(
            `SELECT id, name, email, password_hash, phone, city, municipality_type
       FROM authorities WHERE email = $1`,
            [email]
        );

        if (result.rows.length === 0) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const user = result.rows[0];

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                city: user.city,
                municipalityType: user.municipality_type,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const result = await pool.query(
            `SELECT id, name, email, phone, city, municipality_type
       FROM authorities WHERE id = $1`,
            [req.user.userId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const user = result.rows[0];

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            city: user.city,
            municipalityType: user.municipality_type,
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
