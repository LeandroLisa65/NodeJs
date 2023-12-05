import EErrors from '../utils/CustomErrors/EErrors.js'

function errorHandler(error, req, res, next){
    switch (error.code) {
        case EErrors.INVALID_TYPE_ERROR: 
            res.status(400).send({status: "error", error: error});
            break;
        default: 
            res.status(500).send({status: "error", error: error});
    }
};

export default errorHandler;