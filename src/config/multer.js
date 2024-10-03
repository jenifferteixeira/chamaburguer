import multer from "multer";
import { v4 } from 'uuid'
import { extname, resolve } from 'path'



export default {
    storage: multer.diskStorage({
        destination: resolve(__dirname, '..', '..', 'uploads'),
        filename: (request, file, callback) => {
            const fileExt = v4() + extname(file.originalname);
            const fileName = `${Date.now()}${fileExt}`;

            callback(null, fileName);
        },
    })

}
