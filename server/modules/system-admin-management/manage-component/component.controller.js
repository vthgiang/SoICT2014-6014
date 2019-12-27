const ComponentService = require('./component.service');

exports.get = async (req, res) => {
    try {
        var roles = await ComponentService.get();
        
        res.status(200).json(roles);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.getComponentOfCompany = async (req, res) => {
    try {
        var roles = await ComponentService.getComponentOfCompany(req.params.id);
        
        res.status(200).json(roles);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.create = async (req, res) => {
    try {
        console.log("Create component")
        var createComponent = await ComponentService.create(req.body);
        await ComponentService.relationshipComponentRole(createComponent._id, req.body.roles);
        var component = await ComponentService.getById(createComponent._id);

        res.status(200).json(component);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.show = async (req, res) => {
    try {
        var role = await ComponentService.getById(req.params.id);
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.edit = async (req, res) => {
    try {
        await ComponentService.relationshipComponentRole(req.params.id, req.body.roles);
        var component = await ComponentService.edit(req.params.id, req.body);
        
        res.status(200).json(component);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.delete = async (req, res) => {
    try {
        var link = await ComponentService.delete(req.params.id );
        
        res.status(200).json(link);
    } catch (error) {
        
        res.status(400).json(error);
    }
};
