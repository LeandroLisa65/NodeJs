import multer from 'multer'
import { logger } from '../config/logger.js'
import { __dirname } from '../dirname.js';

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        let folder
        switch(file.fieldname){
            case 'profile': 
                folder = 'profiles'; 
                break;
            case 'product': 
                folder = 'products'; 
                break;
            case 'identification':
            case 'addressProof':
            case 'accountStatement': 
                folder = 'documents'; 
                break;
        }
        cb(null, `${__dirname}/public/uploads/${folder}`)
    },
    filename: function(req, file, cb){
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const uploader = multer({
    storage,
    onError: function(err, next){
        logger.error(err)
        next()
    }
})

export default uploader