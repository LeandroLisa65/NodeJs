// Error handling Middleware function for logging the error message
const errorLogger = (error, request, response, next) => {
    next(error) // calling next middleware
}

export default errorLogger;