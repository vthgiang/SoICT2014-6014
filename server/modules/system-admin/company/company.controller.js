const CompanyServices = require('./company.service');
const { LogInfo, LogError } = require(SERVER_LOGS_DIR);
const { ROOT_ROLES: PREDEFINED_ROLES, CATEGORY_LINKS } = require(SERVER_SEED_DIR+'/terms');

/**
 * Lấy danh sách tất cả các công ty
 */
exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await CompanyServices.getAllCompanies(req.query);
        
        LogInfo(req.user.email, 'GET_COMPANIES');
        res.status(200).json({
            success: true,
            messages: ['get_companies_success'],
            content: companies
        });
    } catch (error) {
        LogInfo(req.user.email, 'GET_COMPANIES');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_companies_faile'],
            content: error
        });
    }
};

/**
 * Lấy thông tin về 1 công ty theo id
 * @companyId id của công ty
 */
exports.getCompany = async (req, res) => {
    try {
        const company = await CompanyServices.getCompany(req.params.companyId);
        
        LogInfo(req.user.email, 'SHOW_COMPANY_INFORMATION');
        res.status(200).json({
            success: true,
            messages: ['show_company_success'],
            content: company
        });
    } catch (error) {
        LogError(req.user.email, 'SHOW_COMPANY_INFORMATION');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['show_company_faile'],
            content: error
        });
    }
};

/**
 * Tạo dữ liệu mới về 1 công ty
 * @data dữ liệu để tạo thông tin về công ty (tên, mô tả, tên ngắn)
 */
exports.createCompany = async (req, res) => {
    try {
        const company = await CompanyServices.createCompany(req.body);
        const abstractRoles = await CompanyServices.createCompanyRootRoles(company._id);

        await CompanyServices.createCompanySuperAdminAccount(company._id, company.name, req.body.email);
        await CompanyServices.createCompanyLinks(company._id, req.body.links, abstractRoles);
        await CompanyServices.createCompanyComponents(company._id, req.body.links);
        
        const resCompany = await CompanyServices.getCompany(company._id);
        
        LogInfo(req.user.email, 'CREATE_COMPANY');
        res.status(200).json({
            success: true,
            messages: ['create_company_success'],
            content: resCompany
        });
    } catch (error) {

        LogError(req.user.email, 'CREATE_COMPANY');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_company_faile'],
            content: error
        });
    }
};

/**
 * Chỉnh sửa thông tin 1 công ty
 * @id id của công ty trong database
 * @data dữ liệu muốn chỉnh sửa (tên, mô tả, tên ngắn, log, active)
 */
exports.editCompany = async (req, res) => {
    try {
        const company = await CompanyServices.editCompany(req.params.companyId, req.body);
        await CompanyServices.editCompanySuperAdmin(company._id, req.body.email);

        const resCompany = await CompanyServices.getCompany(company._id);

        LogInfo(req.user.email, 'EDIT_COMPANY');
        res.status(200).json({
            success: true,
            messages: ['edit_company_success'],
            content: resCompany
        });
    } catch (error) {
        LogError(req.user.email, 'EDIT_COMPANY');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_company_faile'],
            content: error
        });
    }
};

/**
 * Lấy thông tin cấu hình file import
 * @type Thể loại file cấu hình(salary, taskTemplate);
 * @company id công ty
 */
exports.getImportConfiguraion =  async (req, res) => {
    try {
        const data = await CompanyServices.getImportConfiguraion(req.query.type, req.user.company._id);

        await LogInfo(req.user.email, 'GET_IMPORT_CONFIGURATION', req.user.company);
        res.status(200).json({ 
            success: true, 
            messages: ['get_import_configuration_success'], 
            content: data
        });
    } catch (error) {
        await LogError(req.user.email, 'GET_IMPORT_CONFIGURATION', req.user.company);
        res.status(400).json({
            success: false, 
            messages: ['get_import_configuration_faile'], 
            content: error
        });
    }
};

/**
 * Tạo thông tin cấu hình file import
 * @body Thông tin cấu hình file import
 * @company id công ty
 */
exports.createImportConfiguraion = async (req, res) => {
    try {
        const data = await CompanyServices.createImportConfiguraion(req.body, req.user.company._id);

        await LogInfo(req.user.email, 'CREATE_IMPORT_CONFIGURATION', req.user.company);
        res.status(200).json({ 
            success: true, 
            messages: ['create_import_configuration_success'], 
            content: data
        });
    } catch (error) {
        await LogError(req.user.email, 'CRETATE_IMPORT_CONFIGURATION', req.user.company);
        res.status(400).json({
            success: false, 
            messages: ['create_import_configuration_faile'], 
            content: error
        });
    }
};

/**
 * Chỉnh sửa thông tin cấu hình file import
 * @id id thông tin cấu hình file import cần sửa
 * @body Dữ liệu chinhe sửa file cấu hình
 */
exports.editImportConfiguraion =  async (req, res) => {
    try {
        const data = await CompanyServices.editImportConfiguraion(req.params.id, req.body);

        await LogInfo(req.user.email, 'EDIT_IMPORT_CONFIGURATION', req.user.company);
        res.status(200).json({ 
            success: true, 
            messages: ['edit_import_configuration_success'], 
            content: data
        });
    } catch (error) {
        await LogError(req.user.email, 'EDIT_IMPORT_CONFIGURATION', req.user.company);
        res.status(400).json({
            success: false, 
            messages: ['edit_import_configuration_faile'], 
            content: error
        });
    }
};