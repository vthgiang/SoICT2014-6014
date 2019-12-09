const CompanyService = require('./company.service');

exports.get = async (req, res) => {
    try {
        const companies = await CompanyService.get(req, res);
        
        console.log("get all companies");
        res.status(200).json(companies);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.create = async (req, res) => {
    try {
        const company = await CompanyService.create(req, res);
        
        res.status(200).json(company);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.show = async (req, res) => {
    try {
        const company = await CompanyService.getById(req, res);
        
        res.status(200).json(company);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.edit = async (req, res) => {
    try {
        const company = await CompanyService.edit(req, res);
        
        res.status(200).json(company);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.delete = async (req, res) => {
    try {
        const company = await CompanyService.delete(req, res);
        
        res.status(200).json(company);
    } catch (error) {
        
        res.status(400).json(error);
    }
};
