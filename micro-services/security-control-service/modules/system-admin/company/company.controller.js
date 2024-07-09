const CompanyServices = require('./company.service');
const ConfigurationServices = require(`../../super-admin/module-configuration/moduleConfiguration.service`);
const Logger = require(`../../../logs`);

/**
 * Lấy danh sách tất cả các công ty
 */
exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await CompanyServices.getAllCompanies(req.query);
        
        Logger.info(req.user.email, 'get_companies_success');
        res.status(200).json({
            success: true,
            messages: ['get_companies_success'],
            content: companies
        });
    } catch (error) {
        
        Logger.error(req.user.email, 'get_companies_failure');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_companies_failure'],
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
        
        Logger.info(req.user.email, 'show_company_success');
        res.status(200).json({
            success: true,
            messages: ['show_company_success'],
            content: company
        });
    } catch (error) {

        Logger.error(req.user.email, 'show_company_failure');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['show_company_failure'],
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
        await CompanyServices.initConfigBackup(company.shortName);
        const abstractRoles = await CompanyServices.createCompanyRootRoles(company.shortName, company._id);

        await CompanyServices.createCompanySuperAdminAccount(company.shortName, req.body.email, company._id);
        await CompanyServices.createCompanyLinks(company.shortName, req.body.links, abstractRoles, company._id);
        await CompanyServices.createCompanyComponents(company.shortName, req.body.links, company._id);
        
        const resCompany = await CompanyServices.getCompany(company._id);
        await ConfigurationServices.createHumanResourceConfiguration(company.shortName);
        
        Logger.info(req.user.email, 'create_company_success');
        res.status(200).json({
            success: true,
            messages: ['create_company_success'],
            content: resCompany
        });
    } catch (error) {

        Logger.error(req.user.email, 'create_company_failure');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_company_failure'],
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
        await CompanyServices.editCompanySuperAdmin(company.shortName, req.body.email);
        const resCompany = await CompanyServices.getCompany(company._id);

        Logger.info(req.user.email, 'edit_company_success');
        res.status(200).json({
            success: true,
            messages: ['edit_company_success'],
            content: resCompany
        });
    } catch (error) {
        
        Logger.error(req.user.email, 'edit_company_failure');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_company_failure'],
            content: error
        });
    }
};

/**
 * Lấy thông tin cấu hình file import
 * @type Thể loại file cấu hình(salary, taskTemplate);
 * @company id công ty
 */
exports.getImportConfiguration =  async (req, res) => {
    try {
        const data = await CompanyServices.getImportConfiguration(req.query.type, req.user.company._id);

        Logger.info(req.user.email, 'get_import_configuration_success', req.user.company);
        res.status(200).json({ 
            success: true, 
            messages: ['get_import_configuration_success'], 
            content: data
        });
    } catch (error) {

        Logger.error(req.user.email, 'get_import_configuration_failure', req.user.company);
        res.status(400).json({
            success: false, 
            messages: ['get_import_configuration_failure'], 
            content: error
        });
    }
};

/**
 * Tạo thông tin cấu hình file import
 * @body Thông tin cấu hình file import
 * @company id công ty
 */
exports.createImportConfiguration = async (req, res) => {
    try {
        const data = await CompanyServices.createImportConfiguration(req.body, req.user.company._id);

        Logger.info(req.user.email, 'create_import_configuration_success', req.user.company);
        res.status(200).json({ 
            success: true, 
            messages: ['create_import_configuration_success'], 
            content: data
        });
    } catch (error) {

        Logger.error(req.user.email, 'create_import_configuration_failure', req.user.company);
        res.status(400).json({
            success: false, 
            messages: ['create_import_configuration_failure'], 
            content: error
        });
    }
};

/**
 * Chỉnh sửa thông tin cấu hình file import
 * @id id thông tin cấu hình file import cần sửa
 * @body Dữ liệu chinhe sửa file cấu hình
 */
exports.editImportConfiguration =  async (req, res) => {
    try {
        const data = await CompanyServices.editImportConfiguration(req.params.id, req.body);

        Logger.info(req.user.email, 'edit_import_configuration_success', req.user.company);
        res.status(200).json({ 
            success: true, 
            messages: ['edit_import_configuration_success'], 
            content: data
        });
    } catch (error) {
        
        Logger.error(req.user.email, 'edit_import_configuration_failure', req.user.company);
        res.status(400).json({
            success: false, 
            messages: ['edit_import_configuration_failure'], 
            content: error
        });
    }
};

exports.editCompanyOrgInformation =  async (req, res) => {
    try {
        let organizationalUnitImage;
        //upload organizationalUnitImage cho form xem chi tiết
        if (req.files && req.files.organizationalUnitImage) {
            let path = `${req.files.organizationalUnitImage[0].destination}/${req.files.organizationalUnitImage[0].filename}`;
            organizationalUnitImage = path.substr(1, path.length)
        }
        const data = await CompanyServices.editCompanyOrgInformation(req.user.company.shortName, organizationalUnitImage);

        Logger.info(req.user.email, 'edit_organizationalUnitImage_success', req.user.company);
        res.status(200).json({ 
            success: true, 
            messages: ['edit_organizationalUnitImage_success'], 
            content: data
        });
    } catch (error) {
        
        Logger.error(req.user.email, 'edit_organizationalUnitImage_failure', req.user.company);
        res.status(400).json({
            success: false, 
            messages: ['edit_organizationalUnitImage_failure'], 
            content: error
        });
    }
};

exports.getCompanyInformation = async (req, res) => {
    try {
        const data = await CompanyServices.getCompanyInformation(req.user.company.shortName);

        Logger.info(req.user.email, 'get_organizationalUnitImage_success', req.user.company);
        res.status(200).json({ 
            success: true, 
            messages: ['get_organizationalUnitImage_success'], 
            content: data
        });
    } catch (error) {
        
        Logger.error(req.user.email, 'get_organizationalUnitImage_failure', req.user.company);
        res.status(400).json({
            success: false, 
            messages: ['get_organizationalUnitImage_failure'], 
            content: error
        });
    }
}

exports.requestService = async (req, res) => {
    try {
        const data = await CompanyServices.requestService(req.body);

        Logger.info(req.body.email, 'request_service_success');
        res.status(200).json({ 
            success: true, 
            messages: ['request_service_success'], 
            content: data
        });
    } catch (error) {
        
        Logger.error(req.body.email, 'request_service_failure');
        res.status(400).json({
            success: false, 
            messages: ['request_service_failure'], 
            content: error
        });
    }
}
