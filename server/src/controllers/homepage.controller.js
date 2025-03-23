import pool from "../config/DB.config.js";
import multer from "multer";
const upload = multer({ dest: 'uploads/' }).single('bookPic');

export const homepage = async(req, res) => {
    res.json({
        message: "Welcome to Homepage",
        user: req.user
    })
}

// แสดงรายชื่อวิชาทั้งหมด
export const getSubjects = async(req, res) => {
    try {

        const [fetchSubjectsAll] = await pool.execute(
            "SELECT * FROM subjects"
        )

        res.status(200).json({
            message: "Show All subjects",
            subjectCode: fetchSubjectsAll
        })

    } catch (error) {
        console.log("Error in add book controller: ",error.message);
        if (!res.headersSent) {
            return res.status(500).json({
                error: error.message || error
            });
        }
    }
}

// เพิ่มหนังสือใหม่สำหรับ User
export const addBook = async(req, res) => {
    try {
        
            console.log("File uploaded:", req.files );

            const {titleBook, price, description, contactInfo, subjectId} = req.body;
            const userId = req.user?.id;
            const canMeet = req.body.pickUp;

            if(!userId) {
                return res.status(401).json({
                    message: "Unauthorized: Please Login"
                });
            }

            if (!titleBook || !price || !subjectId) {
                console.error("❌ Missing required fields:", { titleBook, price, subjectId });
                return res.status(400).json({ message: "Missing required fields" });
            }

            const canMeetValue = canMeet === "yes" ? "yes" : "no";

            // จัดการไฟล์รูปภาพ รับ request.file
            const bookPic = req.files?.bookPic?.[0]?.path.replace(/\\/g, "/") || null;

            const bookData = [
                titleBook,
                price,
                description || "",
                canMeetValue,
                contactInfo || null,
                bookPic, //เก็บ path ไฟล์
                subjectId,
                userId
            ];

            console.log("📌 SQL Data:", bookData); // ✅ Debug ค่าที่จะส่งไปยัง Database

            try {
                const [result] = await pool.execute(
                    "INSERT INTO books (titleBook, price, description, canMeet, contactInfo, bookPic, subjectId, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    bookData
                );

                console.log("📌 SQL Result:", result); // ✅ Debug ผลลัพธ์จาก Database

                res.status(201).json({
                    message: "Add Book Successfully",
                    book: {
                        id: result.insertId,
                        titleBook,
                        price,
                        description,
                        canMeet: canMeetValue,
                        contactInfo,
                        bookPic: bookPic || "",
                        subjectId
                    }
                });
            } catch (sqlError) {
                console.error("❌ SQL Error:", sqlError.message);
                return res.status(500).json({
                    message: "Database error",
                    error: sqlError.message
                });
            }
    } catch (error) {
        console.log("Error in add book controller: ", error.message);
        if (!res.headersSent) {
            return res.status(500).json({
                error: error.message || error
            });
        }
    }
};

// เพิ่มสินค้าลงในตะกร้า
export const addToCart = async(req, res) => {

    try {
        const userId = req.user?.id;
        const bookId = req.params.id;

        const [book] = await pool.execute(
            "SELECT id FROM books WHERE id = ?", [bookId]
        )
        
        if(book.length === 0) {
            return res.status(404).json({ message: "Book not found" }); 
        }

        const [result] = await pool.execute(
            "INSERT INTO cart (userId, bookId) VALUES (?, ?)",
            [userId, bookId]
        )

        if(result.affectedRows === 0) {
            return res.status(404).json({ message: "Book not found or already in cart" });
        }

        res.status(201).json({
            message: "Add to Cart Successfully!",
            cart: {
                userId,
                bookId
            }
        })

    } catch (error) {
        console.error("Error in addToCart Controller: ", error.message);
        res.status(500).json({
            error: error.message || "Error Adding to Cart"
        })
    }

}

// เพิ่มข้อมูลลง table order, address, payment, order_item
export const addInfomationAndOrder = async(req, res) => {

    try {
        
        const {

            type, 
            fullName, 
            house_no, 
            street, 
            zone, 
            subdistrict, 
            district, 
            province, 
            zip_code, 
            phone,
            email, 
            other, 
            location,
            paymentMethod, 
            price, 
            userId, 
            date_and_time,
            total_price,
            orderData   

        } = req.body

        const connection = await pool.getConnection()
        connection.beginTransaction()       

        const [order] = await connection.query(
            "INSERT INTO orders(user_id, total_price, type, orther) VALUES(?, ?, ?, ?)",
            [userId, price || total_price, type, other]
        )



        const orderId = order.insertId;

        if(!orderId) {
            await connection.rollback();
            return res.status(400).json({ message: "Error adding order"})
        }

        if(type === "delivery") {

            await connection.query(
                "INSERT INTO addresses (order_id, full_name, phone, house_no, street, zone, subdistrict, district, province, zip_code, email) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [orderId, fullName, phone, house_no, street, zone, subdistrict, district, province, zip_code, email]
            )
            
            
        } else if(type === "pickup") {
            const [result_pickup] = await connection.query(
                "INSERT INTO pickups (order_id, full_name, pickup_datetime, location, email) VALUES(?, ?, ?, ?, ?)",
                [orderId, fullName, date_and_time, location, email]
            )
            
        }

        if(!Array.isArray(orderData) || orderData.length  === 0) {
            await connection.rollback()
            return res.status(400).json({
                message: "Invalid order data"
            })
        }

        const orderItems = orderData.map(item => [
            orderId,
            item.bookId,
            item.quantity || 1,
            item.price
        ])
        
        await connection.query(
            "INSERT INTO order_items(order_id, book_id, quantity, price) VALUES ?",
            [orderItems]
        )

        await connection.query(
            "INSERT INTO payments(order_id, payment_method ) VALUES(?, ?)",
            [orderId, paymentMethod]
        )

        await connection.commit()
        
        res.status(200).json({
            message: "Add Order compete!",
            orderId: orderId
        })

    } catch (error) {
        console.error("Error controller Add Information and Order ", error)
        res.status(500).json({
            message:error.message || error
        })
    }
}

// อัพเดตข้อมูลใน table payment
export const updatePayment = async(req, res) => {
    try {
        const {orderId, payment_date, payment_time} = req.body
        const slip_image = req.files?.paymentSlip?.[0]; // ✅ ดึงไฟล์จาก `req.files`

        const randomTransactioNumber = Math.floor(Math.random() * 9000000) + 1000000
        const paymentDateTime = payment_date + " " + payment_time

        const filePath = slip_image ? slip_image.path : null;

        const [payment] = await pool.execute(
            `UPDATE payments SET transaction_id = ?, payment_datetime = ?, slip_image = ? WHERE	order_id = ?`,
            [randomTransactioNumber, paymentDateTime, filePath, orderId]
        )

        if(payment) {
            return res.status(200).json({
                message: "Update Payments Successfully"
            })
        }

    } catch (error) {
        console.error("Error UpdatePayment Controller: ", error)
        return res.status(500).json({
            message: error.message || error
        })
    }
}

// update สถานะการเงิน
export const updateOrdersStatus = async(req, res) => {

    try {

        const {id} = req.params;
        const {status} = req.body

        const [resultOrderStatus] = await pool.execute(
            `
            UPDATE orders o
            JOIN payments p ON p.order_id = o.id
            SET o.status = ?
            WHERE p.transaction_id = ?
            `,
            [status, id]
        )

        return res.status(200).json({
            message: "Update orders status successfully",
        })

    } catch (error) {
        console.error("Error Update Orders Status Controller: ", error.message)
        return res.status(500).json({
            message: error.message
        })
    }
}

export const fetchInfomation = async(req, res) => {

    // SELECT o.id, o.status, p.* FROM payments AS p 
    // INNER JOIN orders as o ON p.order_id = o.id
    try {
        const {id} = req.params;

        if(!id) {
            return res.status(400).json({
                message: "Transaction Id not found"
            })
        } 

        const [orderResult] = await pool.execute(
            `
            SELECT 
                users.id AS user_id, 
                users.fullName AS user_fullName, 
                users.email AS user_email,

                orders.id AS order_id, 
                orders.user_id AS order_user_id,
                orders.status AS order_status,
                orders.total_price AS total_price,

                order_items.order_id as order_id,
                order_items.book_id as book_id,

                books.bookPic AS BookPic,

                payments.* 
            FROM users
            INNER JOIN orders ON users.id = orders.user_id
            INNER JOIN order_items ON order_items.order_id = orders.id
            INNER JOIN books ON books.id = order_items.book_id
            INNER JOIN payments ON payments.order_id = orders.id
            WHERE payments.transaction_id = ?
            `,
            [id]
        )

        if(orderResult.length === 0) {
            return res.status(404).json({
                message: "No information found for the given transaction ID"
            })
        }

        const orderInfo = orderResult[0]

        const [sellerResult] = await pool.execute(
            `
            SELECT
                users.id AS seller_id,
                users.fullName AS seller_fullName,
                users.email AS seller_email
            FROM users
            INNER JOIN books ON books.userId = users.id
            WHERE books.id = ?
            `,
            [orderInfo.book_id]
        )

        if(sellerResult.length === 0) {
            return res.status(404).json({
                message: "No seller information found for the given book ID"
            });
        }

        const sellerInfo = sellerResult[0]

        const combinedInfo = {
            ...orderInfo,
            seller: sellerInfo
        }

        return res.status(200).json({
            message: "Fetch orders successfully",
            infomation: combinedInfo
        })
        

    } catch (error) {
        console.error("Error Fetch Information controller: ", error.message);
        return res.status(500).json({
            error: error.message || "Error fetching information"
        })
    }
}
// แสดงหนังสือที่ได้รับการยืนยันแล้วและไม่ใช่ของตัวเอง
export const showBooks = async(req, res) => {
    try {
        const userId = req.user?.id;

        const [books] = await pool.execute(
            "SELECT * FROM books WHERE checkStatusBooks = 'available' AND userId != ?",
            [userId]
        )

        if(books.length === 0) {
            return res.status(404).json({ message: "Books not found" });
        }

        res.status(200).json({
            message: "Show All Books",
            books: books
        })

    } catch (error) {
        console.log("Error in showBooks: ", error.message);
        res.status(500).json({
            error: error.message || "Error fetching books"
        });
    }
}

// แสดงหนังสือที่ยังไม่ได้รับการยืนยันสำหรับ Admin
export const showBooksUnavailable = async(req, res) => {

    try {
        const [books] = await pool.execute(
            "SELECT * FROM books WHERE checkStatusBooks = 'unavailable'"
        )
        console.log("Database Query Result:", books);

        res.status(200).json({
            message: "Show All Books are unavailable",
            books: books
        })
    } catch (error) {
        console.error("Error controller showBooksUnavailable: ", error.message);
        res.status(500).json({
            error: error.message || "Error fetching books"
        })
    }

}

// แสดงรายละเอียดหนังสือของแต่ละเล่มโดยมีการเชื่อมโยงกับตาราง subjects
export const showDetailBook = async(req, res) => {
    const bookId = req.params.id

    try {

        const [result] = await pool.execute(
            "SELECT b.*, s.subjectCode FROM books AS b INNER JOIN subjects AS s ON b.subjectId = s.id WHERE b.id = ?",
            [bookId]
        )  

        res.status(200).json({
            message: "Selected one book!",
            book: result[0]
        })

    } catch (error) {
        console.log("Error in show detail book: ", error.message);
        res.status(500).json({
            error: error.message || "Error fetch one book"
        })
    }
}

// แสดงสินค้าสำหรับ User คนนั้นๆด้วย userId ที่ลงขาย
export const showUserBooks = async(req, res) => {
    try {

        const userId = req.user?.id;

        const [books] = await pool.execute(
            "SELECT * FROM books WHERE userId = ?",
            [userId]
        )

        if(books.length === 0) {
            return res.status(404).json({ message: "Books not found" });
        }

        res.status(200).json({
            message: "Show All Books",
            books: books
        })

    } catch (error) {
        console.log("Error in showUserBooks Controller: ", error.message);
        res.status(500).json({
            error: error.message || "Error fetching books"
        })
    }
}

// แสดงหนังสือที่เลือกและของ user คนนั้นๆ โดยใช้ userId และ bookId
export const showBookWithId = async(req, res) => {
    try {
        
        const bookId = req.params.id;

        const [books] = await pool.execute(
            "SELECT * FROM books WHERE id = ?",
            [bookId]
        )

        if(books.length === 0) {
            return res.status(404).json({ message: "Books not found" });
        }

        res.status(200).json({
            message: "Show Book with Id it table",
            books: books[0]
        })

    } catch (error) {
        
        console.log("Error in showBookWithId Controller: ", error.message);
        res.status(500).json({
            error: error.message || "Error fetching books"
        })
        
    }
}

export const showBookWithCart = async(req, res) => {

    try {
        
        const userId = req.user?.id;

        const [books] = await pool.execute(
            "SELECT c.id AS cartId, b.* FROM books AS b INNER JOIN cart AS c ON b.id = c.bookId WHERE c.userId = ?",
            [userId]
        )

        if(books.length === 0) {
            return res.status(200).json({ message: "Books not found",
                books: []
            });
        }

        res.status(200).json({
            message: "Show Book with Cart",
            books: books
        })

    } catch (error) {
        console.error("Error in showBookWithCart Controller: ", error.message);
        res.status(500).json({
            error: error.message || "Error fetching books"
        })
    }

}

// แสดงสถานะการจ่ายเงิน
export const showStatusPayment = async(req, res) => {
    try {
        //"SELECT c.id AS cartId, b.* FROM books AS b INNER JOIN cart AS c ON b.id = c.bookId WHERE c.userId = ?",

        const [statusPayment] = await pool.execute(
            `
            SELECT o.id, o.status, p.* FROM payments AS p 
            INNER JOIN orders as o ON p.order_id = o.id
            `
        )

        return res.status(200).json({
            message: "Fetch statusPayment Successfully",
            statusPayment: statusPayment
        })
    } catch (error) {
        console.error("Error Show Status Payment Controller: ", error)
        return res.status(500).json({
            message:error.message
        })
    }
}

export const showHistory = async(req, res) => {
    try {
        
        const userId = req.user?.id

        const [history] = await pool.execute(
            `
            SELECT
                users.id AS id,

                orders.id AS order_id,
                orders.user_id AS user_id,
                orders.type AS type,
                orders.status AS status,
                orders.delivery_status AS delivery_status,

                books.id AS bookId,
                books.titleBook AS titleBook,
                books.description AS description,
                books.price AS price,
                books.bookPic AS bookPic,

                order_items.book_id AS book_id

            FROM users
            INNER JOIN orders ON orders.user_id = users.id
            INNER JOIN order_items ON order_items.order_id = orders.id
            INNER JOIN books ON books.id = order_items.book_id
            WHERE orders.status = 'completed' AND orders.user_id = ?
            
            `,
            [userId]
        )

        return res.status(200).json({
            message:"Fetech History",
            books: history
        })

    } catch (error) {
        console.error("Error Show History Controller: ", error.message)
        return res.status(500).json({
            message: error.message
        })
    }
}

export const showHistoryOrders = async(req, res) => {
    try {
        const userId = req.user?.id

        const [result] = await pool.execute(
            `
            SELECT  
                users.id AS id,
                
                orders.id AS order_id,
                orders.user_id AS user_id,
                orders.type AS type,
                
                addresses.order_id AS Address_order_id,
                addresses.full_name AS Address_full_name,
                addresses.house_no AS house_no,
                addresses.street AS street,
                addresses.zone AS zone,
                addresses.subdistrict AS subdistrict,
                addresses.district AS district,
                addresses.province AS province,
                addresses.zip_code AS zip_code,
                addresses.email AS Address_email,

                pickups.order_id AS pickup_order_id,
                pickups.full_name AS fullName,
                pickups.pickup_datetime AS pickup_datetime,
                pickups.location AS location,
                pickups.email AS email,

                payments.order_id AS p_order_id,    
                payments.payment_method AS payment_method,
                payments.payment_datetime AS payment_datetime,

                order_items.book_id AS book_id,
                books.id AS bookId,
                books.bookPic AS bookPic,
                books.titleBook AS titleBook

            FROM users
            INNER JOIN orders ON orders.user_id = users.id
            LEFT JOIN addresses ON addresses.order_id = orders.id
            LEFT JOIN pickups ON pickups.order_id = orders.id
            INNER JOIN payments ON payments.order_id = orders.id
            INNER JOIN order_items ON order_items.order_id = orders.id
            INNER JOIN books ON books.id = order_items.book_id
            WHERE users.id = ?
            `,
            [userId]
        )

        if(result) {
            return res.status(200).json({
                message: "Show History Orders",
                historyOrder: result
            })
        }
    } catch (error) {
        console.error("Error Show History Orders Controller: ", error.message)
        return res.status(500).json({
            message: error.message
        })
    }
}

// อัปเดตสถานะหนังสือเมื่อ Admin ยืนยัน
export const updateStatusBook = async(req, res) => {
    try {
        const bookId = req.params.id

        const [result] = await pool.execute(
            "UPDATE books SET checkStatusBooks = 'available' WHERE id = ?",
            [bookId]
        )

        if(result.affectedRows === 0) {
            return res.status(404).json({ message: "Book not found or already updated" });
        }

        res.status(200).json({

            message: "Update Status Book Successfully!",
            book: {
                bookId,
                
            }

        })
    } catch (error) {
        console.log("Error in updateStatusBook Controller: ", error.message);
        res.status(500).json({
            error: error.message || "Error Updating Status book"
        })
        
    }
}

export const updateBook = async(req, res) => {

    try {
        
        const {titleBook, price, description, contactInfo, subjectId} = req.body;
        const bookId = req.params.id;
        const canMeet = req.body.pickUp;
        
        const [result] = await pool.execute(

            "UPDATE books SET titleBook = ?, price = ?, description = ?, canMeet = ?, contactInfo = ?, subjectId = ? WHERE id = ?",
            [titleBook, price, description, canMeet, contactInfo, subjectId, bookId]
        )

        if(result.affectedRows === 0) {
            return res.status(404).json({ message: "Book not found or already updated" });
        }
        
        res.status(200).json({
            message: "Book Update Successfully!",
            book: {
                bookId,
                titleBook,
                price,
                description,
                canMeet,
                contactInfo,
                subjectId
            }
        })

    } catch (error) {
        console.log("Error in updateBook Controller: ", error.message);
        res.status(500).json({
            error: error.message || "Error Updating book"
        })
    }
}

export const searchKeyword = async(req, res) => {
    try {
        const {book} = req.query || ""

        const [search] = await pool.execute(
            "SELECT * FROM books WHERE titleBook LIKE ?",
            [`%${book}%`]
        )

        return res.status(200).json({
            message: `Search keyword ${book}`,
            books: search
        })
    } catch (error) {
        console.error("Error Search keyword controller: ", error.message)
        return res.status(500).json({
            message: error.message
        })
    }
}

export const deleteBook = async (req, res) => {
    try {
        const {bookId} = req.body

        if(!bookId) {
            return res.status(400).json({ message: "Book ID is required" });
        }

        const [result] = await pool.execute(
            "DELETE FROM books WHERE id = ?",
            [bookId]
        )

        if(result.affectedRows === 0) {
            return res.status(404).json({ message: "Book not found or already deleted" });
        }

        res.status(200).json({
            message: "Delete book Successfully!",
            books: bookId
        })

    } catch (error) {
        console.log("Error in Delete Book Controller: ", error.message);
        res.status(500).json({
            error: error.message || "Error Delete book"
        })
    }
}

export const deleteItemCart = async(req, res) => {
    try {
        const cartId = req.params.id;

        const [cart] = await pool.execute(
            "DELETE FROM cart WHERE id = ?",
            [cartId]
        )

        res.status(200).json({
            message: "Delete Item Cart Successfully!",
            cart: cartId
        })


    } catch (error) {
        console.error("Error in deleteItemCart Controller: ", error.message);
        res.status(500).json({
            error: error.message || "Error Delete Item Cart"
        })
        
    }
}