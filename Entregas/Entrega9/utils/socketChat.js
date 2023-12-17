import { messageModel } from './../dao/mongo/models/messages.model.js'

const socketChat = async (io) => {
    let logs = [];

    io.on('connection', socket => {
        socket.on("message", data =>{
            const newMessage = {user: data.email, message: data.message}
            logs.push(newMessage)
            messageModel.create(newMessage)
            io.emit('log', {logs});
        })
    })
}

export default socketChat