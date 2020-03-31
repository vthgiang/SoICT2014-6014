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
            message: error.message !== undefined ? error.message : 'get_companies_faile',
            content: error
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
            message: error.message !== undefined ? error.message : 'paginate_companies_faile',
            content: error
        });
    }
};

exports.create = async (req, res) => {
    try {
        //Tạo thông tin công ty mới(tên, tên ngắn, mô tả)
        const company = await CompanyService.create(req.body);

        //Tạo 5 role abstract cho công ty mới
        const abstractRoles = await CompanyService.create5RoleAbstract(company._id);
        
        //Tạo tài khoản super admin cho công ty mới
        var superAdmin;
        for (let i = 0; i < abstractRoles.length; i++) {
            const role = abstractRoles[i];
            if(role.name === PREDEFINED_ROLES.SUPER_ADMIN.NAME){
                superAdmin = role;
                break;
            }
        }
        await CompanyService.createSuperAdminAccount(company._id, company.name, req.body.email, superAdmin._id);

        //Tạo link cho các trang mà công ty được phép truy cập
        const links = await CompanyService.createLinksForCompany(company._id, req.body.links, abstractRoles);
        
        LogInfo(req.user.email, 'CREATE_COMPANY');
        res.status(200).json({
            success: true,
            message: 'create_company_success',
            content: company
        });
    } catch (error) {
        
        LogError(req.user.email, 'CREATE_COMPANY');
        res.status(400).json({
            success: false,
            message: error.message !== undefined ? error.message : 'create_company_faile',
            content: error
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
            message: error.message !== undefined ? error.message : 'show_company_faile',
            content: error
        });
    }
};

exports.edit = async (req, res) => {
    try {
        const company = await CompanyService.edit(req.params.id, req.body);
        
        LogInfo(req.user.email, 'EDIT_COMPANY');
        res.status(200).json({
            success: true,
            message: 'edit_company_success',
            content: company
        });
    } catch (error) {
        
        LogError(req.user.email, 'EDIT_COMPANY');
        res.status(400).json({
            success: false,
            message: error.message !== undefined ? error.message : 'edit_company_faile',
            content: error
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
            message: error.message !== undefined ? error.message : 'delete_company_faile',
            content: error
        });
    }
};
