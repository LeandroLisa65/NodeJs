import { model, mongoose } from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products'
        },
        quantity: Number
    }]
})

export const cartModel = model('carts', cartSchema, 'carts');