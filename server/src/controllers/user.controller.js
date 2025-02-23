import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/DB.config.js';

export const signup = async (req, res) => {
    try {
        const {studentId, fullName, email, password} = req.body;

        if(!studentId || !fullName || !email || !password) {
            return res.status(400).json({message: "All fields are required!"});
        }

        const [existingUser] = await pool.execute(
            "SELECT * FROM users WHERE studentId = ? or email = ?",
            [studentId, email]
        )

        if(existingUser.length > 0) {
            return res.status(400).json({message: "Student Id of Email already exists!"})
        }

        const salt  = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const [result] = await pool.execute(
            "INSERT INTO users (studentId, fullName, email, password) VALUES(?, ?, ?, ?)",
            [studentId, fullName, email, hashedPassword]
        )

        const [newUser] = await pool.execute(
            "SELECT id, studentId, fullName, email FROM users WHERE id = ?",
            [result.insertId]
        )

        res.status(201).json({
            message: "User created!",
            newStudent: newUser[0]
        })

    } catch (error) {
        console.log("Error to signup controller: ", error.message);
        res.status(500).json({
            error: error.message || error
        })
    }
}

export const login = async (req, res) => {
    try {

        const {email, studentId, password} = req.body

        if(!email, !studentId) {
            return res.status(400).json({message: "Email or Student ID are required!"});
        }

        if(!password) {
            return res.status(400).json({message: "Password is required!"});
        }

        const [rows] = await pool.execute(
            "SELECT * FROM users WHERE studentId = ? or email = ?",
            [studentId || null, email || null]
        )

        const user = rows[0]

        if(!user) {
            return res.status(401).json({ message: "Invalid Student ID or Email"});
        }

        const isPasswordValid  = await bcryptjs.compare(password, user.password);

        if(!isPasswordValid) {
            return res.status(401).json({message: "Password not match"});
        }

        const token = jwt.sign(
            {id: user.id, studentId: user.studentId, email: user.email, role: user.user_role},
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 3 * 60 * 60 * 1000
        })
        
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

        console.log("Error to login controller: ", error.message);
        res.status(500).json({
            error: error.message || error
        })
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