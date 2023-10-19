import { Schema, model } from 'mongoose';

const usersSchema = new Schema({
    first_name : {
        type: String,
        required: true
    }
    , last_name : {
        type: String
        , required: true
    }
    , email: {
        type: String
        , required: true
        , unique: true
    }
    , password: {
        type: String
        , required: true
    }
    , age: {
        type: Number
    }
    , isSingle: {
        type: Boolean
        , default: false
    }
});

export const usersModel = model('users', usersSchema);

