const CompanyService = require('./company.service');
const { LogInfo, LogError } = require('../../../logs');

exports.get = async (req, res) => {
    try {
        const companies = await CompanyService.get();
        
        LogInfo(req.user.email, 'GET_COMPANIES');
        res.status(200).json(companies);
    } catch (error) {
        
        res.status(400).json(error);
    }
};


exports.getPaginate = async (req, res) => {
    try {
        var { limit, page } = req.body;
        delete req.body.limit;
        delete req.body.page;
        var companies = await CompanyService.getPaginate(limit, page, req.body);

        LogInfo(req.user.email, 'GET_COMPANIES_PAGINATE');
        res.status(200).json(companies);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.create = async (req, res) => {
    try {
        console.log("khởi tạo cty mới")
        //Tạo thông tin công ty mới(tên, tên ngắn, mô tả)
        const company = await CompanyService.create(req.body);
        console.log("Công ty: ", company);

        //Tạo 5 role abstract cho công ty mới
        const abstractRoles = await CompanyService.create5RoleAbstract(company._id);
        console.log("Tạo role abstract: ", abstractRoles);
        
        //Tạo tài khoản super admin cho công ty mới
        await CompanyService.createSuperAdminAccount(company._id, company.name, req.body.email, abstractRoles.superAdmin._id);
        console.log('Tạo và add tài khoản super admin');

        //Tạo link cho các trang mà công ty được phép truy cập
        const links = await CompanyService.createLinksForCompany(company._id, abstractRoles.superAdmin._id, abstractRoles.admin._id);
        console.log("Link của cty: ", links);
        
        LogInfo(req.user.email, 'CREATE_NEW_COMPANY');
        res.status(200).json(company);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.show = async (req, res) => {
    try {
        const company = await CompanyService.getById(req.params.id);
        
        LogInfo(req.user.email, 'SHOW_COMPANY_INFORMATION');
        res.status(200).json(company);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.edit = async (req, res) => {
    try {
        const company = await CompanyService.edit(req.params.id, req.body);
        
        LogInfo(req.user.email, 'EDIT_COMPANY');
        res.status(200).json(company);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.delete = async (req, res) => {
    try {
        const company = await CompanyService.delete(req.params.id);
        
        LogInfo(req.user.email, 'DELETE_COMPANY');
        res.status(200).json(company);
    } catch (error) {
        
        res.status(400).json(error);
    }
};
