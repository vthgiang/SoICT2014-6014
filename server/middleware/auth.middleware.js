const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
// var address = require('address');

exports.auth = async (req, res, next) => {
    const token = req.header('auth-token');
    // address(function (err, addrs) {
    //     console.log(addrs);
    //     // '192.168.0.2', 'fe80::7aca:39ff:feb0:e67d', '78:ca:39:b0:e6:7d'
    //   });
      
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