const ComponentDefaultServices = require('./component-default.service');

exports.get = async (req, res) => {
    try {
        var components = await ComponentDefaultServices.get();
        
        res.status(200).json(components);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.getPaginate = async (req, res) => {
    try {
        var { limit, page } = req.body;
        delete req.body.limit;
        delete req.body.page;
        var components = await ComponentDefaultServices.getPaginate(limit, page, req.body);
        
        res.status(200).json(components);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.create = async (req, res) => {
    try {
        var { name, description, link, roles } = req.body;
        var component = await ComponentDefaultServices.create(name, description, link, roles);
        await ComponentDefaultServices.addComponentsToLink(link, component._id);
        var data = await ComponentDefaultServices.show(component._id);

        res.status(200).json(data);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.show = async (req, res) => {
    try {
        var component = await ComponentDefaultServices.show(req.params.id);
        
        res.status(200).json(component);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.edit = async (req, res) => {
    try {
        var {name, description, link, roles} = req.body;
        var component = await ComponentDefaultServices.edit(req.params.id, name, description, link, roles);
        
        res.status(200).json(component);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.delete = async (req, res) => {
    try {
        var component = await ComponentDefaultServices.delete(req.params.id);
        await ComponentDefaultServices.deleteComponentInLink(component.link, component._id);
        
        res.status(200).json(component);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

