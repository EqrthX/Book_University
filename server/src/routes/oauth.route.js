import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const getOAuthClient = () => {
    return new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );
};

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

/**
 * @route GET /api/auth/google
 * @desc Redirect users to Google OAuth Consent Screen
 */
router.get('/google', (req, res) => {
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const URI = process.env.GOOGLE_REDIRECT_URI;

    if (!CLIENT_ID || !URI) {
        return res.status(400).json({
            message: "Google Client ID or Redirect URI is not defined in environment variables",
            uri: URI
        });
    }

    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: URI,
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
        prompt: "consent"
    });

    const authUrl = `${GOOGLE_AUTH_URL}?${params.toString()}`;
    return res.redirect(authUrl);
});

/**
 * @route GET /api/auth/callback (or /api/auth/google/callback)
 * @desc Callback route that Google redirects back to after authorization.
 * Handles token exchange, Google ID Token verification, User creation/login, JWT signing, and session cookies.
 */
const handleCallback = async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ message: "Authorization code not provided" });
    }

    try {
        const client = getOAuthClient();

        // 1. Exchange code for Google tokens (explicitly passing redirect_uri to prevent invalid_grant mismatches)
        const tokenResponse = await client.getToken({
            code,
            redirect_uri: process.env.GOOGLE_REDIRECT_URI
        });
        const tokens = tokenResponse.tokens;
        if (!tokens || !tokens.id_token) {
            return res.status(400).json({ message: "No ID token returned from Google" });
        }

        // 2. Verify ID Token
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const googleId = payload['sub'];
        const email = payload['email'];
        const name = payload['name'];

        if (!email) {
            return res.status(400).json({ message: "Google account does not provide an email address" });
        }

        // 3. Find existing user or Create new User (Google Signup)
        let user = await User.findOne({ where: { email } });

        if (user) {
            // Existing user: Link googleId if missing, update login count & last active timestamp
            if (!user.googleId) {
                user.googleId = googleId;
            }
            user.loginCount = (user.loginCount || 0) + 1;
            user.lastActiveAt = new Date();
            await user.save();
        } else {
            // New user: Automatically register/signup with Google profile details
            user = await User.create({
                email,
                fullName: name || "Google User",
                googleId,
                loginCount: 1,
                lastActiveAt: new Date(),
                user_role: "student"
            });
        }

        // 4. Generate JWT Token
        const jwtSecret = process.env.JWT_SECRET || "secret_key";
        const token = jwt.sign(
            { id: user.id, studentId: user.studentId, email: user.email, role: user.user_role },
            jwtSecret,
            { expiresIn: "7d" }
        );

        // 5. Set Cookie (matching user.controller.js)
        const isProduction = process.env.NODE_ENV === "production" || !process.env.DB_HOST?.includes("localhost");

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: isProduction ? "none" : "strict",
            secure: isProduction,
            maxAge: 3 * 60 * 60 * 1000
        });

        // 6. Redirect to frontend dashboard/homepage
        const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
        const redirectPath = user.user_role === "admin" ? "/admin/AdminHomePage" : "/user/HomePage";

        return res.redirect(`${clientUrl}${redirectPath}`);
    } catch (error) {
        console.error("OAuth Callback error:", error?.response?.data || error?.message || error);
        
        // If code was already used (invalid_grant) or expired, redirect gracefully back to frontend login page
        const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
        return res.redirect(`${clientUrl}/`);
    }
};

// Register callback handlers for both /callback and /google/callback for flexibility
router.get('/callback', handleCallback);
router.get('/google/callback', handleCallback);

export default router;
