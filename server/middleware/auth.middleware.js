const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.auth = async (req, res, next) => {
    const token = req.header('auth-token');
    if(!token) return res.status(400).json({ msg: 'ACCESS_DENIED' });
    try {
        const verified = await jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified; 
        req.token = token;

        var logged = await User.findOne({ _id: req.user._id,  token: token });
        if(logged === null) return res.status(400).send({ msg: 'ACC_LOGGED_OUT'}) 

        next();

    } catch (error) {
        res.status(400).json({ msg: 'TOKEN_INVALID' });
    }   
}