const mongoose = require('mongoose');
const Router = require('express').Router;
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { json } = require('express');
const jwt = require('jsonwebtoken');
const UserAuth = require('../middlewares/UserAuth');


const router = new Router();

const Secret = process.env.SECRET;

router.post('/register', async (req, res) => {
    try {
        console.log(req.body);
        const name = req.body.name;
        const email = req.body.email;
        const password = await bcrypt.hash(req.body.password, 10);
        const user = new User({ name, email, password });
        await user.save();
        res.json(user);
    }
    catch (err) {
        console.log('Error in registration');
        res.json(err);

    }
});

router.post('/login', async (req, res) => {
    const { name, password } = req.body;

    try {
        const user = await User.findOne({ name });

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        //generate token
        const token = jwt.sign({ id: user._id , name: user.name}, Secret);
       

        user.token = token;
        await user.save();

        res.json({ token });


    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: 'Invalid credentials' });
    }

}); 

router.put('/update-password', UserAuth, async (req, res) => {
    try {
        const { name, password } = req.body;

        const user = await User.findOne({ name });

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Update the password
        user.password = await bcrypt.hash(password, 10);
        await user.save();

        res.json('Password updated successfully');
    } catch (err) {
        console.error('Error in updating password:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post ('/logout', UserAuth, async (req, res) => {
    try {
        const user = req.user;
        user.token = '';
        await user.save();

        res.json('Logged out successfully');
    } catch (err) {
        console.error('Error in logging out:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;