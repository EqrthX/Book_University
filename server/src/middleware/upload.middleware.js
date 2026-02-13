import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname); // ดึงนามสกุลไฟล์
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    }
});

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