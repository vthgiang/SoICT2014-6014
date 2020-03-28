const RoleService = require('./role.service');

exports.get = async (req, res) => {
    try {
        var roles = await RoleService.get(req.user.company._id); //truyen vao id cua cong ty
        
        res.status(200).json(roles);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.getPaginate = async (req, res) => {
    try {
        var { limit, page } = req.body;
        delete req.body.limit;
        delete req.body.page;
        var roles = await RoleService.getPaginate(req.user.company._id, limit, page, req.body); //truyen vao id cua cong ty

        res.status(200).json(roles);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.create = async (req, res) => {
    try {
        var role = await RoleService.create(req.body, req.user.company._id);
        await RoleService.editRelationshiopUserRole(role._id, req.body.users);
        var data = await RoleService.getById(req.user.company._id, role._id);
        
        res.status(200).json(data);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.show = async (req, res) => {
    try {
        var role = await RoleService.getById(req.user.company._id, req.params.id);
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.edit = async (req, res) => {
    try {
        await RoleService.editRelationshiopUserRole(req.params.id, req.body.users);
        var role = await RoleService.edit(req.params.id, req.body); //truyền vào id role và dữ liệu chỉnh sửa
        var data = await RoleService.getById(req.user.company._id, role._id);
        
        res.status(200).json(data);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.delete = async (req, res) => {
    try {
        var role = await RoleService.delete(req.params.id);
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.test = async (req, res) => {
    try {
        var role = await RoleService.editRelationshiopUserRole( req.params.id, req.body.users );
        
        res.status(200).json(role);
    } catch (error) {
             
        res.status(400).json(error);
    }
};

exports.getRoleSameDepartment = (req, res) => {
    return RoleService.getRoleSameDepartment(req, res);
};
