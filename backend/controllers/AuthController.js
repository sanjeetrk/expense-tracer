const UserModel = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {oauth2client} = require('../utils/googleConfig');
const axios = require('axios');

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists, you can login', success: false });
        }
        const userModel = new UserModel({ name, email, password });
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        res.status(201).json({ message: "signup successfully", success: true });

    } catch (error) {
        res.status(500).json({ message: "internal server error", success: false });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        const errorMessage = "Auth failed, email or password is incorrect";
        if (!user) {
            return res.status(400).json({ message: errorMessage, success: false });
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(400).json({ message: errorMessage, success: false });

        }

        const token = jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({ message: 'login success', success: true, token, email: user.email, name: user.name });
    } catch (error) {
        res.status(500).json({ message: "internal server error", success: false });
    }
};

const googlelogin = async (req, res) => {
    try {
        const { code } = req.query;
        const googleRes = await oauth2client.getToken(code);
        oauth2client.setCredentials(googleRes.tokens);
        const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`);
        const { email, name, picture, id } = userRes.data;

        let user = await UserModel.findOne({ email });
        if (user) {
            // Update existing user's image if it's not set
            if (!user.Image) {
                user.Image = picture;
                await user.save();
            }

            const token = jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
            
            return res.status(200).json({ 
                message: 'Login successful', 
                success: true, 
                token, 
                email: user.email, 
                name: user.name,
                Image: user.Image || picture // Fallback to Google picture if user.Image is still undefined
            });
        }

        // Create new user if doesn't exist
        user = new UserModel({ 
            name, 
            email, 
            Image: picture,
            googleId: id
        });
        await user.save(); 
        const token = jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        
        return res.status(200).json({ 
            message: 'Registration and login successful', 
            success: true, 
            token, 
            email: user.email, 
            name: user.name,
            Image: picture
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", success: false });
    } 
}

module.exports = { signup, login, googlelogin };