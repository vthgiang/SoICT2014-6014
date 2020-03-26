const LinkDefaultService = require('./link-default.service');

exports.get = async (req, res) => {
    try {
        var links = await LinkDefaultService.get();
        
        res.status(200).json(links);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.getPaginate = async (req, res) => {
    try {
        var { limit, page } = req.body;
        delete req.body.limit;
        delete req.body.page;
        var links = await LinkDefaultService.getPaginate(limit, page, req.body);

        res.status(200).json(links);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.create = async (req, res) => {
    try {
        var { url, description, roles } = req.body;
        var link = await LinkDefaultService.create(url, description, roles);

        res.status(200).json(link);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.show = async (req, res) => {
    try {
        var link = await LinkDefaultService.getById(req.params.id);
        
        res.status(200).json(link);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.edit = async (req, res) => {
    try {
        var { url, description, roles } = req.body;
        var link = await LinkDefaultService.edit(req.params.id, url, description, roles);
        var data = await LinkDefaultService.getById(link._id);

        res.status(200).json(data);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.delete = async (req, res) => {
    try {
        var link = await LinkDefaultService.delete(req.params.id);
        
        res.status(200).json(link);
    } catch (error) {
        
        res.status(400).json(error);
    }
};