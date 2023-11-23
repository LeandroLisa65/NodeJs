const errorResponder = (error, request, response, next) => {
    response.header("Content-Type", 'application/json');

    console.log("Middleware Error Hadnling");
    const errStatus = error.statusCode || 500;
    const errMsg = error.message || 'Something went wrong';
    response.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMsg,
        stack: error.stack ? error.stack : {}
    })
}

export default errorResponder;