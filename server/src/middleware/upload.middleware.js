import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // ยอมรับไฟล์
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed.'), false); // ปฏิเสธไฟล์
    }
};

const upload = multer({ 
    storage, 
    fileFilter 
}).fields([
    { name: "bookPic", maxCount: 1 },
    { name: "paymentSlip", maxCount: 1 },
    { name: "picture_message", maxCount: 1 } // รองรับไฟล์เดียว
]);

export default upload;