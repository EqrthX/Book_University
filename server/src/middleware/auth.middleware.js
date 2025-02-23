import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if(!token) {
        return res.status(401).json({ message: "Unauthorized! Token is required."})
    }

    try {

        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decode
        next()

    } catch (error) {

        return res.status(403).json({message: "Invalid or Expired Token"})

    }
}