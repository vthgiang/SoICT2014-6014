const CompanyService = require('./company.service');
const { LogInfo, LogError } = require('../../../logs');
const { PREDEFINED_ROLES } = require('../../../seed/terms');

exports.get = async (req, res) => {
    try {
        const companies = await CompanyService.get();
        
        LogInfo(req.user.email, 'GET_COMPANIES');
        res.status(200).json({
            success: true,
            message: 'get_companies_success',
            content: companies
        });
    } catch (error) {
        LogInfo(req.user.email, 'GET_COMPANIES');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};


exports.getPaginate = async (req, res) => {
    try {
        var { limit, page } = req.body;
        delete req.body.limit;
        delete req.body.page;
        var companies = await CompanyService.getPaginate(limit, page, req.body);

        LogInfo(req.user.email, 'PAGINATE_COMPANIES');
        res.status(200).json({
            success: true,
            message: 'paginate_companies_success',
            content: companies
        });
    } catch (error) {
        
        LogInfo(req.user.email, 'PAGINATE_COMPANIES');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.create = async (req, res) => {
    try {
        //Tạo thông tin công ty mới(tên, tên ngắn, mô tả)
        const company = await CompanyService.create(req.body);
        console.log("tao cty", company)

        //Tạo 5 role abstract cho công ty mới
        const abstractRoles = await CompanyService.create5RoleAbstract(company._id);
        console.log("tao role abs: ", abstractRoles)
        
        //Super admin cho công ty mới
        const superadmin = await CompanyService.editSuperAdminOfCompany(company._id, req.body.email);
        console.log("tao superadmin abs: ", superadmin)

        //Tạo link và các component tương ứng cho các trang mà công ty được phép truy cập
        const links = await CompanyService.createLinksForCompany(company._id, req.body.links, abstractRoles);
        console.log("tạo các links: ", links);

        const components = await CompanyService.createComponentsForCompany(company._id, req.body.links);
        console.log("tạo các components: ", components);

        const resCompany = await CompanyService.getById(company._id);
        
        LogInfo(req.user.email, 'CREATE_COMPANY');
        res.status(200).json({
            success: true,
            message: 'create_company_success',
            content: resCompany
        });
    } catch (error) {
        console.log("err-com: ", error);
        LogError(req.user.email, 'CREATE_COMPANY');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.show = async (req, res) => {
    try {
        const company = await CompanyService.getById(req.params.id);
        
        LogInfo(req.user.email, 'SHOW_COMPANY_INFORMATION');
        res.status(200).json({
            success: true,
            message: 'show_company_success',
            content: company
        });
    } catch (error) {
        
        LogError(req.user.email, 'SHOW_COMPANY_INFORMATION');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.edit = async (req, res) => {
    try {
        const company = await CompanyService.edit(req.params.id, req.body);
        await CompanyService.editSuperAdminOfCompany(company._id, req.body.email);
        const resCompany = await CompanyService.getById(company._id);
        LogInfo(req.user.email, 'EDIT_COMPANY');
        res.status(200).json({
            success: true,
            message: 'edit_company_success',
            content: resCompany
        });
    } catch (error) {
        
        console.log("err-com: ", error);
        LogError(req.user.email, 'EDIT_COMPANY');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.delete = async (req, res) => {
    try {
        const company = await CompanyService.delete(req.params.id);
        
        LogInfo(req.user.email, 'DELETE_COMPANY');
        res.status(200).json({
            success: true,
            message: 'delete_company_success',
            content: company
        });
    } catch (error) {
        
        LogError(req.user.email, 'DELETE_COMPANY');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.getLinksOfCompany = async (req, res) => {
    try {
        const links = await CompanyService.getLinksOfCompany(req.params.id);
        
        LogInfo(req.user.email, 'GET_LINKS_OF_COMPANY');
        res.status(200).json({
            success: true,
            message: 'get_links_of_company_success',
            content: links
        });
    } catch (error) {
        
        LogError(req.user.email, 'GET_LINKS_OF_COMPANY');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.addNewLinkForCompany = async (req, res) => {
    try {
        const link = await CompanyService.addNewLinkForCompany(req.params.id, req.body.url, req.body.description);
        
        LogInfo(req.user.email, 'ADD_NEW_LINK_FOR_COMPANY');
        res.status(200).json({
            success: true,
            message: 'add_new_link_for_company_success',
            content: link
        });
    } catch (error) {
        
        LogError(req.user.email, 'ADD_NEW_LINK_FOR_COMPANY');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.deleteLinkForCompany = async (req, res) => {
    try {
        const link = await CompanyService.deleteLinkForCompany(req.params.id, req.params.linkId);
        
        LogInfo(req.user.email, 'DELETE_LINK_FOR_COMPANY');
        res.status(200).json({
            success: true,
            message: 'delete_link_for_company_success',
            content: link
        });
    } catch (error) {
        
        LogError(req.user.email, 'DELETE_LINK_FOR_COMPANY');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.getLinksListOfCompany = async (req, res) => {
    try {
        const links = await CompanyService.getLinksListOfCompany(req.params.id);
        
        LogInfo(req.user.email, 'GET_LINKS_LIST_OF_COMPANY');
        res.status(200).json({
            success: true,
            message: 'get_links_list_of_company_success',
            content: links
        });
    } catch (error) {
        LogInfo(req.user.email, 'GET_LINKS_LIST_OF_COMPANY');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.getLinksPaginateOfCompany = async (req, res) => {
    try {
        console.log('company link paginate: ', req.params.id, req.params.page, req.params.limit, req.body);
        const links = await CompanyService.getLinksPaginateOfCompany(
            req.params.id, 
            req.params.page, 
            req.params.limit, 
            req.body
        );
        
        LogInfo(req.user.email, 'LINKS_PAGINATE_OF_COMPANY');
        res.status(200).json({
            success: true,
            message: 'get_links_paginate_of_company_success',
            content: links
        });
    } catch (error) {
        LogInfo(req.user.email, 'LINKS_PAGINATE_OF_COMPANY');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.getComponentsListOfCompany = async (req, res) => {
    try {
        const components = await CompanyService.getComponentsListOfCompany(req.params.id);
        
        LogInfo(req.user.email, 'GET_COMPONENTS_LIST_OF_COMPANIES');
        res.status(200).json({
            success: true,
            message: 'get_components_list_of_company',
            content: components
        });
    } catch (error) {
        LogInfo(req.user.email, 'GET_COMPONENTS_LIST_OF_COMPANIES');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.getComponentsPaginateOfCompany = async (req, res) => {
    try {
        const components = await CompanyService.getComponentsPaginateOfCompany(
            req.params.id,
            req.params.page,
            req.params.limit,
            req.body
        );
        
        LogInfo(req.user.email, 'GET_COMPONENTS_PAGINATE_OF_COMPANY');
        res.status(200).json({
            success: true,
            message: 'get_components_paginate_of_company_success',
            content: components
        });
    } catch (error) {
        LogInfo(req.user.email, 'GET_COMPONENTS_PAGINATE_OF_COMPANY');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};
