import userRouter from "./user.route.js";
import homepageRouter from "./homepage.route.js";
import productRouter from "./product.route.js";
import adminRouter from "./admin.route.js";
import cartRouter from "./cart.route.js";
import paymentRouter from "./payments.route.js";
import messagesRouter from "./messages.route.js";
import notificationRouter from "./notification.route.js";
import { verifyToken } from "../middleware/auth.middleware.js";

export const registerRoutes = (app) => {
    app.use("/api/auth", userRouter);
    app.use("/api/admin", verifyToken, adminRouter);
    app.use("/api", verifyToken, homepageRouter);
    app.use("/api/product", verifyToken, productRouter);
    app.use("/api/cart", verifyToken, cartRouter);
    app.use("/api/payment", verifyToken, paymentRouter);
    app.use("/api/messages", verifyToken, messagesRouter);
    app.use("/api/notifications", verifyToken, notificationRouter);
};
