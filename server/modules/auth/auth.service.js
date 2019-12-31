const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');
const UserRole = require('../../models/user_role.model');
const {loginValidation} = require('./auth.validation');

exports.login = async (data) => { // data bao gom email va password
    const {error} = loginValidation(data);
    if(error) throw {msg: error.details[0].message};

    const user = await User
        .findOne({email : data.email})
        .populate([
            { path: 'roles', model: UserRole, populate: { path: 'roleId' } }, 
            { path: 'company' }
        ]);

    if(!user) throw {msg: "Email invalid"};

    const validPass = await bcrypt.compare(data.password, user.password);

    if(!validPass) {
        if(user.active) user.status = user.status + 1;
        if(user.status > 5){
            user.active = false;
            user.status = 0;
            user.save();

            throw { msg: 'Enter the wrong password more than 5 times. The account has been locked.'};
        }
        user.save();

        throw {msg: 'Password invalid'};
    }

    if(!user.active) throw { msg: ' Cannot login! The account has been locked !'};
    
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