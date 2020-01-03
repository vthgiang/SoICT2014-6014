const jwt = require('jsonwebtoken');

exports.auth = async (req, res, next) => {
    const token = req.header('auth-token');
    if(!token) return res.status(400).send({
        tag: 'Error',
        message: 'Acccess Denied!'
    });
    try {
        const verified = await jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified; //thêm xác minh token vào cho user
        console.log(`User: ${req.user.email} request!`);
        next(); //thực hiện yêu cầu tiếp theo
    } catch (error) {
        res.status(400).send({
            tag: 'Error',
            message: 'Auth-Token invalid!'
        });
    }   
}