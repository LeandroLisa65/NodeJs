// Error handling Middleware function for logging the error message
const errorLogger = (error, request, response, next) => {
    console.log( `error ${error.message}`) 
    next(error) // calling next middleware
}

export default errorLogger;