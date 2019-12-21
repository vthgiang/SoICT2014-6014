const CompanyService = require('./company.service');
const RoleSerVice = require('../basic.role/role.service');
const UserService = require('../basic.user/user.service');
const LinkService = require('../basic.link/link.service');
const PrivilegeService = require('../basic.privilege/privilege.service');

exports.get = async (req, res) => {
    try {
        const companies = await CompanyService.get();
        
        res.status(200).json(companies);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.create = async (req, res) => {
    try {
        //tao cong ty
        const company = await CompanyService.create(req.body);

        //Tao 5 role abstract cho cong ty 
        const superAdmin = await RoleSerVice.create({ name: "Super Admin", company: company._id });
        var admin = await RoleSerVice.create({ name: "Admin", company: company._id });
        var dean = await RoleSerVice.create({ name: "Dean", company: company._id });
        var viceDean = await RoleSerVice.create({ name: "Vice Dean", company: company._id });
        var employee = await RoleSerVice.create({ name: "Employee", company: company._id });
        
        //add tai khoan superadmin cho cong ty do
        const superAdminUser = await UserService.create({ name: `Super Admin - ${company.short_name}`, email: req.body.email, company: company._id });
        //add quyen superadmin cho tai khoan do
        const user_role = await UserService.relationshipUserRole(superAdminUser._id, superAdmin._id);

        //Create manage link for company------------------------------------------------
        var homePage = await LinkService.create({ url: '/', description: `HomePage of ${company.name}`, company: company._id });
        var manageUser = await LinkService.create({ url: '/manage-user', description: `Manage user of ${company.name}`, company: company._id });
        var manageRole = await LinkService.create({ url: '/manage-role', description: `Manage role of ${company.name}`, company: company._id });
        var manageDepartment = await LinkService.create({ url: '/manage-department', description: `Manage department of ${company.name}`, company: company._id });
        var manageLink = await LinkService.create({ url: '/manage-link', description: `Manage link of ${company.name}`, company: company._id });
        var manageComponentUI = await LinkService.create({ url: '/manage-component-ui', description: `Manage component UI of ${company.name}`, company: company._id });

        await PrivilegeService.addRoleToLink( homePage._id, [ superAdmin._id, admin._id, dean._id, viceDean._id, employee._id ] );
        await PrivilegeService.addRoleToLink( manageUser._id, [ superAdmin._id, admin._id ] );
        await PrivilegeService.addRoleToLink( manageRole._id, [ superAdmin._id, admin._id ] );
        await PrivilegeService.addRoleToLink( manageDepartment._id, [ superAdmin._id, admin._id ] );
        await PrivilegeService.addRoleToLink( manageLink._id, [ superAdmin._id, admin._id ] );
        await PrivilegeService.addRoleToLink( manageComponentUI._id, [ superAdmin._id, admin._id ] );

        res.status(200).json(company);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.show = async (req, res) => {
    try {
        const company = await CompanyService.getById(req.params.id);
        
        res.status(200).json(company);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.edit = async (req, res) => {
    try {
        const company = await CompanyService.edit(req.params.id, req.body);
        
        res.status(200).json(company);
    } catch (error) {
        
        res.status(400).json(error);
    }
};

exports.delete = async (req, res) => {
    try {
        const company = await CompanyService.delete(req.params.id);
        
        res.status(200).json(company);
    } catch (error) {
        
        res.status(400).json(error);
    }
};
