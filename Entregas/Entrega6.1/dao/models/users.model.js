import { model, mongoose } from 'mongoose';

const collection = 'users'

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isGithub: {
        type: Boolean,
        default: false
    }
})

export const userModel = model(collection, userSchema);