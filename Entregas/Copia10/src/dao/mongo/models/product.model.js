import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const collection = 'products'

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    thumbnails: Array,
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        set: value => parseFloat(value).toFixed(2)
    },
    stock: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    code: {
        type: String,
        unique: true,
        required: true,
    },
    owner: {
        type: String,
        ref: 'users',
        default: 'admin'
    },
    createdAt: {
        type: Date,
        default: Date.now 
    }
})

productSchema.plugin(mongoosePaginate)
const productModel = mongoose.model(collection, productSchema)

export default productModel