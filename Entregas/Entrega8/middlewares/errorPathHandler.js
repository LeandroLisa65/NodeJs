const invalidPathHandler = (request, response, next) => {
    response.status(404)
    response.send('Invalid path')
}

export default invalidPathHandler;