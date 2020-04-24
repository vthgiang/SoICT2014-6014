const CompanyService = require('./company.service');
const { LogInfo, LogError } = require('../../../logs');
const { ROOT_ROLES: PREDEFINED_ROLES } = require('../../../seed/terms');

exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await CompanyService.getAllCompanies();
        
        LogInfo(req.user.email, 'GET_COMPANIES');
        res.status(200).json({
            success: true,
            message: ['get_companies_success'],
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


exports.getPaginatedCompanies = async (req, res) => {
    try {
        var { limit, page } = req.body;
        delete req.body.limit;
        delete req.body.page;
        var companies = await CompanyService.getPaginatedCompanies(limit, page, req.body);

        LogInfo(req.user.email, 'PAGINATE_COMPANIES');
        res.status(200).json({
            success: true,
            message: ['paginate_companies_success'],
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

exports.createCompany = async (req, res) => {
    try {
        const company = await CompanyService.createCompany(req.body);

        const abstractRoles = await CompanyService.createCompanyRootRoles(company._id);
        await CompanyService.createCompanySuperAdminAccount(company._id, company.name, req.body.email);
        await CompanyService.createCompanyLinks(company._id, req.body.links, abstractRoles);
        await CompanyService.createCompanyComponents(company._id, req.body.links);
        
        const resCompany = await CompanyService.getCompany(company._id);
        
        LogInfo(req.user.email, 'CREATE_COMPANY');
        res.status(200).json({
            success: true,
            message: ['create_company_success'],
            content: resCompany
        });
    } catch (error) {
        LogError(req.user.email, 'CREATE_COMPANY');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.getCompany = async (req, res) => {
    try {
        const company = await CompanyService.getCompany(req.params.id);
        
        LogInfo(req.user.email, 'SHOW_COMPANY_INFORMATION');
        res.status(200).json({
            success: true,
            message: ['show_company_success'],
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

exports.editCompany = async (req, res) => {
    try {
        const company = await CompanyService.editCompany(req.params.id, req.body);
        await CompanyService.editCompanySuperAdmin(company._id, req.body.email);
        const resCompany = await CompanyService.getCompany(company._id);

        LogInfo(req.user.email, 'EDIT_COMPANY');
        res.status(200).json({
            success: true,
            message: ['edit_company_success'],
            content: resCompany
        });
    } catch (error) {
        LogError(req.user.email, 'EDIT_COMPANY');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.deleteCompany = async (req, res) => {
    try {
        const company = await CompanyService.deleteCompany(req.params.id);
        
        LogInfo(req.user.email, 'DELETE_COMPANY');
        res.status(200).json({
            success: true,
            message: ['delete_company_success'],
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

exports.getCompanyLinks = async (req, res) => {
    try {
        const links = await CompanyService.getCompanyLinks(req.params.id);
        
        LogInfo(req.user.email, 'GET_LINKS_OF_COMPANY');
        res.status(200).json({
            success: true,
            message: ['get_links_of_company_success'],
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

exports.addCompanyLink = async (req, res) => {
    try {
        const link = await CompanyService.addCompanyLink(req.params.id, req.body.url, req.body.description);
        
        LogInfo(req.user.email, 'ADD_NEW_LINK_FOR_COMPANY');
        res.status(200).json({
            success: true,
            message: ['add_new_link_for_company_success'],
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

exports.deleteCompanyLink = async (req, res) => {
    try {
        const link = await CompanyService.deleteCompanyLink(req.params.id, req.params.linkId);
        
        LogInfo(req.user.email, 'DELETE_LINK_FOR_COMPANY');
        res.status(200).json({
            success: true,
            message: ['delete_link_for_company_success'],
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

exports.addCompanyComponent = async (req, res) => {
    try {
        const component = await CompanyService.addCompanyComponent(req.params.id, req.body.name, req.body.description, req.body.link);
        const resComponent = await CompanyService.getComponentById(component._id);  

        LogInfo(req.user.email, 'ADD_NEW_COMPONENT_FOR_COMPANY');
        res.status(200).json({
            success: true,
            message: ['add_new_component_for_company_success'],
            content: resComponent
        });
    } catch (error) {
        
        LogError(req.user.email, 'ADD_NEW_COMPONENT_FOR_COMPANY');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.deleteCompanyComponent = async (req, res) => {
    try {
        const component = await CompanyService.deleteCompanyComponent(req.params.id, req.params.componentId);
        
        LogInfo(req.user.email, 'DELETE_COMPONENT_FOR_COMPANY');
        res.status(200).json({
            success: true,
            message: ['delete_component_for_company_success'],
            content: component
        });
    } catch (error) {
        
        LogError(req.user.email, 'DELETE_COMPONENT_FOR_COMPANY');
        res.status(400).json({
            success: false,
            message: error
        });
    }
};

exports.getCompanyLinks = async (req, res) => {
    try {
        const links = await CompanyService.getCompanyLinks(req.params.id);
        
        LogInfo(req.user.email, 'GET_LINKS_LIST_OF_COMPANY');
        res.status(200).json({
            success: true,
            message: ['get_links_list_of_company_success'],
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

exports.getPaginatedCompanyLinks = async (req, res) => {
    try {
        const links = await CompanyService.getPaginatedCompanyLinks(
            req.params.id, 
            req.params.page, 
            req.params.limit, 
            req.body
        );
        
        LogInfo(req.user.email, 'LINKS_PAGINATE_OF_COMPANY');
        res.status(200).json({
            success: true,
            message: ['get_links_paginate_of_company_success'],
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

exports.getCompanyComponents = async (req, res) => {
    try {
        const components = await CompanyService.getCompanyComponents(req.params.id);
        
        LogInfo(req.user.email, 'GET_COMPONENTS_LIST_OF_COMPANIES');
        res.status(200).json({
            success: true,
            message: ['get_components_list_of_company'],
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

exports.getPaginatedCompanyComponents = async (req, res) => {
    try {
        const components = await CompanyService.getPaginatedCompanyComponents(
            req.params.id,
            req.params.page,
            req.params.limit,
            req.body
        );
        
        LogInfo(req.user.email, 'GET_COMPONENTS_PAGINATE_OF_COMPANY');
        res.status(200).json({
            success: true,
            message: ['get_components_paginate_of_company_success'],
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
