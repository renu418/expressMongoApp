const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({

    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    display: {
        type: Boolean,
        required: true,
        default: false
    }

}, { collection: 'Product data'})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;