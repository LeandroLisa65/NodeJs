import { Schema, model } from 'mongoose';

const cartSchema = new Schema
(
    {
        products : {
            type: Array,
            required: true,
            default: []
        }
    }
)

export const cartModel = model('carts', cartSchema);