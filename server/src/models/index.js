import sequelize from "../config/sequelize.config.js";
import User from "./user.model.js";
import Subject from "./subject.model.js";
import Book from "./book.model.js";
import Cart from "./cart.model.js";
import Order from "./order.model.js";
import OrderItem from "./orderItem.model.js";
import Address from "./address.model.js";
import Pickup from "./pickup.model.js";
import Payment from "./payment.model.js";
import SoldBook from "./soldBook.model.js";
import Notification from "./notification.model.js";
import Message from "./message.model.js";

// --- ASSOCIATIONS ---

// User <-> Book
User.hasMany(Book, { foreignKey: "userId", as: "books" });
Book.belongsTo(User, { foreignKey: "userId", as: "user" });

// Subject <-> Book
Subject.hasMany(Book, { foreignKey: "subjectId", as: "books" });
Book.belongsTo(Subject, { foreignKey: "subjectId", as: "subject" });

// User <-> Cart
User.hasMany(Cart, { foreignKey: "userId", as: "carts" });
Cart.belongsTo(User, { foreignKey: "userId", as: "user" });

// Book <-> Cart
Book.hasMany(Cart, { foreignKey: "bookId", as: "carts" });
Cart.belongsTo(Book, { foreignKey: "bookId", as: "book" });

// User <-> Order
User.hasMany(Order, { foreignKey: "user_id", as: "orders" });
Order.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Order <-> OrderItem
Order.hasMany(OrderItem, { foreignKey: "order_id", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "order_id", as: "order" });

// Book <-> OrderItem
Book.hasMany(OrderItem, { foreignKey: "book_id", as: "orderItems" });
OrderItem.belongsTo(Book, { foreignKey: "book_id", as: "book" });

// Order <-> Address
Order.hasOne(Address, { foreignKey: "order_id", as: "address" });
Address.belongsTo(Order, { foreignKey: "order_id", as: "order" });

// Order <-> Pickup
Order.hasOne(Pickup, { foreignKey: "order_id", as: "pickup" });
Pickup.belongsTo(Order, { foreignKey: "order_id", as: "order" });

// Order <-> Payment
Order.hasOne(Payment, { foreignKey: "order_id", as: "payment" });
Payment.belongsTo(Order, { foreignKey: "order_id", as: "order" });

// User <-> Notification
User.hasMany(Notification, { foreignKey: "user_id", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Order <-> Notification
Order.hasMany(Notification, { foreignKey: "order_id", as: "notifications" });
Notification.belongsTo(Order, { foreignKey: "order_id", as: "order" });

// User <-> Message (sender / receiver)
Message.belongsTo(User, { foreignKey: "sender_id", as: "sender" });
Message.belongsTo(User, { foreignKey: "receiver_id", as: "receiver" });

export {
    sequelize,
    User,
    Subject,
    Book,
    Cart,
    Order,
    OrderItem,
    Address,
    Pickup,
    Payment,
    SoldBook,
    Notification,
    Message
};
