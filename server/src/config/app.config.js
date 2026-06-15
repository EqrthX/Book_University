import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 5001;

const defaultClientOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
];

const envClientOrigins = [
    process.env.REACT_URL,
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
]
    .filter(Boolean)
    .flatMap((origin) => origin.split(","))
    .map((origin) => origin.trim())
    .filter(Boolean);

export const allowedClientOrigins = [
    ...new Set([...envClientOrigins, ...defaultClientOrigins]),
];

const isAllowedOrigin = (origin) => {
    if (!origin) {
        return true;
    }

    return allowedClientOrigins.includes(origin);
};

export const corsOptions = {
    origin(origin, callback) {
        if (isAllowedOrigin(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

export const socketCorsOptions = {
    origin: allowedClientOrigins,
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
};
