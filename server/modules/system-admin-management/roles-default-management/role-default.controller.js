const RoleDefaultServices = require('./role-default.service');

exports.get = async (req, res) => {
    try {
        var roleDefaults = await RoleDefaultServices.get();
        
        res.status(200).json(roleDefaults);
    } catch (error) {
        
        res.status(400).json(error);
    }
};
