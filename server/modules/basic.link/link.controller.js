const LinkService = require('./link.service');

exports.get = async (req, res) => {
    try {
        var roles = await LinkService.get();
        
        res.status(200).json(roles);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.create = async (req, res) => {
    try {
        var role = await LinkService.create(req.body);
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.show = async (req, res) => {
    try {
        var role = await LinkService.getById(req.params.id);
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.edit = async (req, res) => {
    try {
        var role = await LinkService.edit(id, req.body);
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.delete = async (req, res) => {
    try {
        var role = await LinkService.delete(req.params.id );
        
        res.status(200).json(role);
    } catch (error) {
        
        res.status(400).json(error);
    }
};


/* ------manage links of 1 company ------------------*/
exports.getLinksOfCompany = async (req, res) => {
    try {
        var links = await LinkService.getLinksOfCompany(req.params.idCompany);

        res.status(200).json(links);
    } catch (error) {

        res.status(400).json(error);
    }
}