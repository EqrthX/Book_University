import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const router = express.Router();

/**
 * @route GET /api/auth/google
 * @desc Scaffold to redirect users to Google Consent Screen
 * @todo Implement the redirection to Google OAuth Consent Screen.
 * 
 * Steps you should think about:
 * 1. Define your Google Client ID, Redirect URI, and Scopes (profile, email).
 * 2. Construct the Google OAuth authorization URL:
 *    https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=...&response_type=code&scope=...
 * 3. Redirect the client to that URL: res.redirect(googleAuthUrl);
 */
router.get('/google', (req, res) => {
    // TODO: Step 1: Check that GOOGLE_CLIENT_ID and redirect URI exist
    // TODO: Step 2: Construct the Google authorization URL
    // TODO: Step 3: Redirect the user
    res.status(501).json({
        message: "Google Auth redirect scaffold. Please implement the redirect in routes/oauth.route.js!"
    });
});

/**
 * @route GET /api/auth/google/callback
 * @desc Scaffold Callback route that Google redirects back to after authorization.
 * @todo Implement code exchange, profile verification, and JWT session generation.
 * 
 * Steps you should think about:
 * 1. Read the authorization 'code' from query parameters (req.query.code).
 * 2. Exchange the authorization code for tokens (access token, id token) by making a POST request to:
 *    https://oauth2.googleapis.com/token
 * 3. Decode or verify the ID token (you can use google-auth-library or jwt.decode).
 * 4. Extract user details: email, fullName, and googleId.
 * 5. Check if the user exists in the database.
 *    - If they exist, log them in (increment loginCount, update lastActiveAt).
 *    - If they don't, create a new User record with googleId, email, fullName, etc. (studentId can be filled later).
 * 6. Issue a JWT token cookie just like standard login and redirect the user back to the client home page!
 */
router.get('/google/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ message: "Authorization code not provided" });
    }

    try {
        // TODO: Exchange code for Google tokens
        // TODO: Verify the ID Token
        // TODO: Find or create User record in database
        // TODO: Sign JWT token and set in cookies
        // TODO: Redirect user to the frontend dashboard/homepage
        
        res.status(501).json({
            message: "Google Auth callback scaffold. Please implement token exchange and login in routes/oauth.route.js!",
            receivedCode: code
        });
    } catch (error) {
        console.error("OAuth Callback error:", error);
        res.status(500).json({ error: error.message || error });
    }
});

export default router;
