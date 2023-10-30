const errorResponder = (error, request, response, next) => {
    response.header("Content-Type", 'application/json')
      
    const status = error.status || 400
    response.status(status).send(error.message)
}

export default errorResponder;