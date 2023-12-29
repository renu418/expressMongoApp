const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');

router.post('/signup', userController.signup);

router.post('/login', userController.login);

router.get('/user/:userId', userController.allowIfLoggedin,userController.grantAccess('readAny', 'profile'), userController.getUser);

router.get('/users', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'), userController.getUsers);

router.put('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'profile'), userController.updateUser);

router.delete('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'profile'), userController.deleteUser);

router.post('/product', productController.addProduct);

router.get('/product', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'), productController.getProductFromApi);

router.put('/product/:productName', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'profile'), productController.updateProduct);

router.delete('/product/:productName', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'profile'), productController.deleteProduct);


module.exports = router;