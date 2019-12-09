const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');
const {loginValidation} = require('./auth.validation');

exports.login = async (req, res) => {
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).json({msg: error.details[0].message});

    const user = await User
        .findOne({email: req.body.email})
        .populate([
            { path: 'roles' }, 
            { path: 'company' }
        ]);

    if(!user) return res.status(400).json({msg: 'Email invalid'});
    const validPass = await bcrypt.compare(req.body.password, user.password);

    if(!validPass) {
        if(user.active) user.status = user.status + 1;
        if(user.status > 5){
            user.active = false;
            user.status = 0;
            user.save();

            return res.status(400).json({ msg: 'Enter the wrong password more than 5 times. The account has been locked.'});
        }
        user.save();

        return res.status(400).json({msg: 'Password invalid'});
    }

    if(!user.active) return res.status(400).json({ msg: ' Cannot login! The account has been locked !'});
    
    //Check user info OK. => Login success to user
    const token = await jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    user.status = 0; 
    user.save();
    
    return { 
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            roles: user.roles,
            company: user.company
        }
    };
}

exports.logout = async (req, res) => {
    
    return req.logout();
}