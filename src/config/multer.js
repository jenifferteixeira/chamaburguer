import multer from "multer";
import { v4 as uuidv4 } from 'uuid'
import { extname, resolve } from 'path'



const storage = multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'uploads'),
    filename: (request, file, callback) => {
        const fileExt = extname(file.originalname);
        const fileName = `${Date.now()}-${uuidv4()}${fileExt}`;

        callback(null, fileName);
    },
});

const upload = multer({ storage });

export default upload;