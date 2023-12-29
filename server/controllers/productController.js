
const ProductSchema = require('../models/productModel');
const _ = require('lodash')
const axios = require('axios');

exports.addProduct = async (req, res, next) => {
    try {
        let { productName, price } = req.body;
        let productExist = await ProductSchema.findOne({ productName: productName }, { _id: 0, productName: 1 })
        if (!_.isEmpty(productExist)) {
            res.status(403).json({ "error": `Product with product Name '${productName}' already exists.` })//avoid error
            return;
        }
        let newProduct = new ProductSchema({productName, price});
        await newProduct.save();
        res.json({data: newProduct})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

exports.getProduct = async (req, res, next) => {
        const products = await ProductSchema.find({});
        res.status(200).json({data: products});
}

exports.updateProduct = async (req, res, next) => {
    try {
        const update = req.body
        const productName = req.params.productName;
        const product = await ProductSchema.findOne({productName: productName},{_id:0});
        if(!product){
            res.status(400).json({ message: `No product found with '${productName}'`});
            return;
        }
        await ProductSchema.findOneAndUpdate({productName: productName}, update);
        res.status(200).json({message: 'Product has been updated'});
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

exports.deleteProduct = async (req, res, next) => {
    try {
        const productName = req.params.productName;
        const product = await ProductSchema.findOne({productName: productName},{_id:0});
        if(!product){
            res.status(400).json({message: `No product found with '${productName}'`});
            return;
        }
        await ProductSchema.findOneAndDelete({productName: productName});
        res.status(200).json({data: null, message: 'Product has been deleted'});
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

exports.getProductFromApi = async (req, res, next) => {
    try {
        const response = await axios.get('https://dummyjson.com/products');
        if (!response.data || !response.data["products"] || response.data["products"].length == 0) {
            res.status(400).json({ data: response.data, message: "Data received not in standard format" });
            return;
        }
        let productData = response.data["products"];
        let categoryArr = [];
        let categoryWiseObject = {};
        for (let i = 0; i < productData.length; i++) {
            if (productData[i]["category"] && categoryArr.includes(productData[i]["category"])) {
                categoryWiseObject[productData[i]["category"]].push(productData[i])
            } else if (productData[i]["category"] && !categoryArr.includes(productData[i]["category"])) {
                categoryArr.push(productData[i]["category"])
                categoryWiseObject[productData[i]["category"]] = [];
                categoryWiseObject[productData[i]["category"]].push(productData[i])
            }
        }
        res.status(200).json({ data: categoryWiseObject, message: 'Successfully fetched Data' });
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
};
  

