
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { roles } = require('../roles')
const _ = require('lodash')
async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

exports.signup = async (req, res, next) => {
    try {
        let { userId, name, email, password, role } = req.body
        let userExist = await User.findOne({ email: email }, { _id: 0, email: 1 })
        if (!_.isEmpty(userExist)) {
            res.status(403).json({ "error": `user with email '${email}' already exists.` })
            return;
        }
        let userID = await User.findOne({ userId: userId }, { _id: 0, userId: 1 })
        if (!_.isEmpty(userID)) {
            res.status(403).json({ "error": `user with userId '${userId}' already exists. Try some other userId` })
            return;
        }
        let hashedPassword = await hashPassword(password);
        let newUser = new User({ userId, name, email, password: hashedPassword, role: role || "basic" });
        const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });
        newUser.accessToken = accessToken;
        await newUser.save();
        res.json({data: newUser})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}


exports.login = async (req, res, next) => {
    try {
        let { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user){
            res.status(400).json({ "error": `user with email '${email}' does not exist.` })
            return;
        }
        let validPassword = await validatePassword(password, user.password);
        if (!validPassword)
        {
            res.status(400).json({ "error": `Incorrect password` })
            return;
        }
        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });
        await User.findByIdAndUpdate(user._id, { accessToken })
        res.status(200).json({data: { email: user.email, role: user.role }, accessToken})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

exports.getUsers = async (req, res, next) => {
    const users = await User.find({});
    res.status(200).json({data: users});
}

exports.getUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await User.findOne({userId: userId},{_id:0});
        if (!user){
            res.status(400).json({error: `No user exist with userId '${userId}'`});
            return;
        }
        res.status(200).json({data: user });
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        const update = req.body
        const userId = req.params.userId;
        const user = await User.findOne({userId: userId},{_id:0});
        if (!user){
            res.status(400).json({error: `No user exist with userId '${userId}'`});
            return;
        }
        await User.findOneAndUpdate({userId: userId}, update);
        res.status(200).json({message: 'User has been updated'});
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await User.findOne({userId: userId},{_id:0});
        if (!user){
            res.status(400).json({error: `No user exist with userId '${userId}'`});
            return;
        }
        await User.findOneAndDelete({userId: userId});
        res.status(200).json({data: null, message: 'User has been deleted'});
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

exports.grantAccess = function (action, resource) {
    return async (req, res, next) => {
        try {
            const permission = roles.can(req.user.role)[action](resource);
            if (!permission.granted) {
                return res.status(401).json({
                    error: "You don't have enough permission to perform this action"
                });
            }
            next()
        } catch (error) {
            res.status(500).json({error: error.message})
        }
    }
}

exports.allowIfLoggedin = async (req, res, next) => {
    try {
        const user = res.locals.loggedInUser;
        if (!user) {
            return res.status(401).json({ error: "You need to be logged in to access this route" });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}