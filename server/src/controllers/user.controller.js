import jwt from 'jsonwebtoken';
import * as userService from '../services/user.service.js';

export const signup = async (req, res) => {
    try {
        const { studentId, fullName, email, password } = req.body;

        if (!studentId || !fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const newUser = await userService.registerUser(studentId, fullName, email, password);

        res.status(201).json({
            message: "User created!",
            newStudent: newUser
        });
    } catch (error) {
        res.status(500).json({
            error: error.message || error
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, studentId, password } = req.body;

        if (!email && !studentId) {
            return res.status(400).json({ message: "Email or Student ID are required!" });
        }

        if (!password) {
            return res.status(400).json({ message: "Password is required!" });
        }

        const user = await userService.authenticateUser(email, studentId, password);

        const token = jwt.sign(
            { id: user.id, studentId: user.studentId, email: user.email, role: user.user_role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const isProduction = process.env.NODE_ENV === "production" || !process.env.DB_HOST?.includes("localhost");

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: isProduction ? "none" : "strict",
            secure: isProduction,
            maxAge: 3 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Login Successfully",
            user: {
                studentId: user.studentId,
                email: user.email,
                user_role: user.user_role,
                password: undefined
            },
        });
    } catch (error) {
        res.status(500).json({
            error: error.message || error
        });
    }
}

export const protectedToken = async(req, res) => {
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({message: "Unauthorized"})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        res.json({
            message: "Protected Data",
            user: decoded
        })
    } catch (error) {
        res.status(403).json({
            message: "Invalid Token"
        })
    }
}

export const logout = async (req, res) => {
    res.clearCookie("token")
    res.status(200).json({
        message: "Logout Successfully"
    })
}
