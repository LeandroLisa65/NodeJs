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
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    },
    role: {
        type: String,
        enum: ['Admin', 'User', 'Premium'],
        default: 'User'
    },
})

export const userModel = model(collection, userSchema);