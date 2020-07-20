const CompanyServices = require('./company.service');
const { LogInfo, LogError } = require('../../../logs');
const { ROOT_ROLES: PREDEFINED_ROLES, CATEGORY_LINKS } = require('../../../seed/terms');

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
 * @id id của công ty
 */
exports.getCompany = async (req, res) => {
    try {
        const company = await CompanyServices.getCompany(req.params.id);
        
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
        const company = await CompanyServices.editCompany(req.params.id, req.body);
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
 * Xóa dữ liệu 1 công ty
 * @id id của công ty trong database
 */
exports.deleteCompany = async (req, res) => {
    try {
        const company = await CompanyServices.deleteCompany(req.params.id);
        
        LogInfo(req.user.email, 'DELETE_COMPANY');
        res.status(200).json({
            success: true,
            messages: ['delete_company_success'],
            content: company
        });
    } catch (error) {
        LogError(req.user.email, 'DELETE_COMPANY');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_company_faile'],
            content: error
        });
    }
};

/**
 * Lấy danh sách tất cả các link của công ty
 * @id id của công ty muốn lấy danh sách các link
 */
exports.getCompanyLinks = async (req, res) => {
    try {
        const links = await CompanyServices.getCompanyLinks(req.params.id, req.query);
        
        LogInfo(req.user.email, 'GET_LINKS_OF_COMPANY');
        res.status(200).json({
            success: true,
            messages: ['get_links_of_company_success'],
            content: links
        });
    } catch (error) {
        LogError(req.user.email, 'GET_LINKS_OF_COMPANY');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_links_of_company_faile'],
            content: error
        });
    }
};

/**
 * Thêm link mới cho công ty
 * @id id của công ty
 * @body
    * @linkUrl đường dẫn cho link muốn tạo
    * @linkDescription mô tả về link
 */
exports.addCompanyLink = async (req, res) => {
    try {
        const link = await CompanyServices.addCompanyLink(req.params.id, req.body);
        
        LogInfo(req.user.email, 'ADD_NEW_LINK_FOR_COMPANY');
        res.status(200).json({
            success: true,
            messages: ['add_new_link_for_company_success'],
            content: link
        });
    } catch (error) {
        
        LogError(req.user.email, 'ADD_NEW_LINK_FOR_COMPANY');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['add_new_link_for_company_faile'],
            content: error
        });
    }
};

/**
 * Xóa 1 link của công ty
 * @id id của công ty
 * @linkId id của link muốn xóa
 */
exports.deleteCompanyLink = async (req, res) => {
    try {
        const link = await CompanyServices.deleteCompanyLink(req.params.id, req.params.linkId);
        
        LogInfo(req.user.email, 'DELETE_LINK_FOR_COMPANY');
        res.status(200).json({
            success: true,
            messages: ['delete_link_for_company_success'],
            content: link
        });
    } catch (error) {
        LogError(req.user.email, 'DELETE_LINK_FOR_COMPANY');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_link_for_company_faile'],
            content: error
        });
    }
};

/**
 * Thêm mới 1 component cho công ty
 * @id id của công ty
 * @body 
    * @componentname tên của component
    * @componentDescription mô tả về component
    * @linkId id của link được chứa component này
 */
exports.addCompanyComponent = async (req, res) => {
    try {
        const component = await CompanyServices.addCompanyComponent(req.params.id, req.body);
        const resComponent = await CompanyServices.getComponentById(component._id);  

        LogInfo(req.user.email, 'ADD_NEW_COMPONENT_FOR_COMPANY');
        res.status(200).json({
            success: true,
            messages: ['add_new_component_for_company_success'],
            content: resComponent
        });
    } catch (error) {
        LogError(req.user.email, 'ADD_NEW_COMPONENT_FOR_COMPANY');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['add_new_component_for_company_faile'],
            content: error
        });
    }
};

/**
 * Xóa một của component của công ty
 * @id id của công ty
 * @componentId id của component muốn xóa
 */
exports.deleteCompanyComponent = async (req, res) => {
    try {
        const component = await CompanyServices.deleteCompanyComponent(req.params.id, req.params.componentId);
        
        LogInfo(req.user.email, 'DELETE_COMPONENT_FOR_COMPANY');
        res.status(200).json({
            success: true,
            messages: ['delete_component_for_company_success'],
            content: component
        });
    } catch (error) {
        
        LogError(req.user.email, 'DELETE_COMPONENT_FOR_COMPANY');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_component_for_company_faile'],
            content: error
        });
    }
};

/**
 * Lấy danh sách tất cả các link của công ty
 * @companyId id của công ty muốn lấy danh sách các link
 */
exports.getCompanyLinks = async (req, res) => {
    try {
        const links = await CompanyServices.getCompanyLinks(req.params.id, req.query);
        
        LogInfo(req.user.email, 'GET_LINKS_LIST_OF_COMPANY');
        res.status(200).json({
            success: true,
            messages: ['get_links_list_of_company_success'],
            content: links
        });
    } catch (error) {
        LogInfo(req.user.email, 'GET_LINKS_LIST_OF_COMPANY');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_links_list_of_company_faile'],
            content: error
        });
    }
};

/**
 * Lấy danh sách các component của công ty
 * @id id của công ty
 */
exports.getCompanyComponents = async (req, res) => {
    try {
        const components = await CompanyServices.getCompanyComponents(req.params.id, req.query);
        
        LogInfo(req.user.email, 'GET_COMPONENTS_LIST_OF_COMPANIES');
        res.status(200).json({
            success: true,
            messages: ['get_components_list_of_company_success'],
            content: components
        });
    } catch (error) {
        LogInfo(req.user.email, 'GET_COMPONENTS_LIST_OF_COMPANIES');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_components_list_of_company_faile'],
            content: error
        });
    }
};

exports.getAllLinkCategories = async (req, res) => {
    try {
        await LogInfo(req.user.email, 'GET_ALL_LINK_CATEGORIES');
        res.status(200).json({
            success: true,
            messages: ['get_all_link_categories_success'],
            content: CATEGORY_LINKS
        });
    } catch (error) {
        await LogInfo(req.user.email, 'GET_ALL_LINK_CATEGORIES');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_all_link_categories_faile'],
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
        const data = await CompanyServices.getImportConfiguraion(req.params.type, req.user.company._id);

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