import mongoose from 'mongoose'

const collection = 'messages'

const messageSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        required: true
    }
})

const messageModel = mongoose.model(collection, messageSchema)

export default messageModel