const LinkService = require('./link.service');

exports.get = async (req, res) => {
    try {
        var links = await LinkService.get(req.user.company._id);
        
        res.status(200).json(links);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.getPaginate = async (req, res) => {
    try {
        var { limit, page } = req.body;
        console.log("GET LINK PAGINATE")
        delete req.body.limit;
        delete req.body.page;
        var links = await LinkService.getPaginate(req.user.company._id, limit, page, req.body); //truyen vao id cua cong ty
        res.status(200).json(links);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.create = async (req, res) => {
    try {
        var createLink = await LinkService.create(req.body, req.user.company._id);
        console.log("create link: ", createLink)
        await LinkService.relationshipLinkRole(createLink._id, req.body.roles);
        var link = await LinkService.getById(createLink._id);

        res.status(200).json(link);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.show = async (req, res) => {
    try {
        var link = await LinkService.getById(req.params.id);
        
        res.status(200).json(link);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.edit = async (req, res) => {
    try {
        console.log("edit link")
        await LinkService.relationshipLinkRole(req.params.id, req.body.roles);
        var link = await LinkService.edit(req.params.id, req.body);
        
        res.status(200).json(link);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.delete = async (req, res) => {
    try {
        var link = await LinkService.delete(req.params.id );
        
        res.status(200).json(link);
    } catch (error) {
        
        res.status(400).json(error);
    }
};


/* ------manage links of 1 company ------------------*/
exports.getLinksOfCompany = async (req, res) => {
    try {
        var links = await LinkService.getLinksOfCompany(req.user.company._id);

        res.status(200).json(links);
    } catch (error) {

        res.status(400).json(error);
    }
}