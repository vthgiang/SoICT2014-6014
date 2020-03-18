const CompanyService = require('./company.service');
const RoleSerVice = require('../../super-admin-management/roles-management/role.service');
const UserService = require('../../super-admin-management/users-management/user.service');
const LinkService = require('../links-management/link.service');
const PrivilegeService = require('../../super-admin-management/privileges/privilege.service');
const { Log} = require('../../../logs');

exports.get = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'GET COMPANIES');
    try {
        const companies = await CompanyService.get();
        
        isLog && Logger.info(req.user.email);
        res.status(200).json(companies);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};


exports.getPaginate = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'GET_PAGINATE_COMPANIES');
    try {
        var { limit, page } = req.body;
        delete req.body.limit;
        delete req.body.page;
        var companies = await CompanyService.getPaginate(limit, page, req.body);

        isLog && Logger.info(req.user.email);
        res.status(200).json(companies);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.create = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'CREATE_COMPANY');
    try {
        //tao cong ty
        const company = await CompanyService.create(req.body);

        //Tao 5 role abstract cho cong ty 
        var admin = await RoleSerVice.createAbstract({ name: "Admin" }, company._id );
        var superAdmin = await RoleSerVice.createAbstract({ name: "Super Admin", parents: [admin._id] }, company._id); //Superadmin sẽ kế thừa admin
        var dean = await RoleSerVice.createAbstract({ name: "Dean" }, company._id );
        var viceDean = await RoleSerVice.createAbstract({ name: "Vice Dean" }, company._id );
        var employee = await RoleSerVice.createAbstract({ name: "Employee" }, company._id );
        
        //add tai khoan superadmin cho cong ty do
        const superAdminUser = await UserService.create({ name: `Super Admin - ${company.short_name}`, email: req.body.email }, company._id );
        //add quyen superadmin cho tai khoan do
        const user_role = await UserService.relationshipUserRole(superAdminUser._id, superAdmin._id);

        //Create manage link for company------------------------------------------------
        var homePage = await LinkService.create({ url: '/', description: `HomePage of ${company.name}`}, company._id);
        var manageUser = await LinkService.create({ url: '/users-management', description: `Manage user of ${company.name}`}, company._id);
        var manageRole = await LinkService.create({ url: '/roles-management', description: `Manage role of ${company.name}`}, company._id);
        var manageDepartment = await LinkService.create({ url: '/departments-management', description: `Manage department of ${company.name}`}, company._id);
        var manageLink = await LinkService.create({ url: '/pages-management', description: `Manage link of ${company.name}`}, company._id);
        var manageComponentUI = await LinkService.create({ url: '/components-management', description: `Manage component UI of ${company.name}`}, company._id);
        var manageDocument = await LinkService.create({ url: '/documents-management', description: `Manage Documents of ${company.name}`}, company._id);
        var notifications = await LinkService.create({ url: '/notifications', description: `Notifications`}, company._id);

        await PrivilegeService.addRolesToLink( homePage._id, [ superAdmin._id, admin._id, dean._id, viceDean._id, employee._id ] );
        await PrivilegeService.addRolesToLink( manageUser._id, [ superAdmin._id, admin._id ] );
        await PrivilegeService.addRolesToLink( manageRole._id, [ superAdmin._id, admin._id ] );
        await PrivilegeService.addRolesToLink( manageDepartment._id, [ superAdmin._id, admin._id ] );
        await PrivilegeService.addRolesToLink( manageLink._id, [ superAdmin._id, admin._id ] );
        await PrivilegeService.addRolesToLink( manageComponentUI._id, [ superAdmin._id, admin._id ] );
        await PrivilegeService.addRolesToLink( manageDocument._id, [ superAdmin._id, admin._id ] );
        await PrivilegeService.addRolesToLink( notifications._id, [ superAdmin._id, admin._id, dean._id, viceDean._id, employee._id ] );

        isLog && Logger.info(req.user.email);
        res.status(200).json(company);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.show = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'SHOW_COMPANY');
    try {
        const company = await CompanyService.getById(req.params.id);
        
        isLog && Logger.info(req.user.email);
        res.status(200).json(company);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.edit = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'EDIT_COMPANY');
    try {
        console.log("REQ", req.body);
        const company = await CompanyService.edit(req.params.id, req.body);
        console.log("RES", company);
        
        isLog && Logger.info(req.user.email);
        res.status(200).json(company);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};

exports.delete = async (req, res) => {
    const Logger = await Log(req.user.company.short_name, 'DELETE_COMPANY');
    try {
        const company = await CompanyService.delete(req.params.id);
        
        isLog && Logger.info(req.user.email);
        res.status(200).json(company);
    } catch (error) {
        
        isLog && Logger.error(req.user.email);
        res.status(400).json(error);
    }
};
