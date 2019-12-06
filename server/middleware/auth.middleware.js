const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
    const token = req.header('VNIST-Authentication-Token');
    if(!token) return res.status(400).send({
        tag: 'Error',
        message: 'Acccess Denied!'
    });
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified; //thêm xác minh token vào cho user
        next(); //thực hiện yêu cầu tiếp theo
    } catch (error) {
        res.status(400).send({
            tag: 'Error',
            message: 'Auth-Token invalid!'
        });
    }   
}