const CompanyService = require('./company.service');
const RoleSerVice = require('../basic.role/role.service');
const UserService = require('../basic.user/user.service');

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
        await RoleSerVice.create({ name: "Admin", company: company._id });
        await RoleSerVice.create({ name: "Dean", company: company._id });
        await RoleSerVice.create({ name: "Vice Dean", company: company._id });
        await RoleSerVice.create({ name: "Employee", company: company._id });
        
        //add tai khoan superadmin cho cong ty do
        const superAdminUser = await UserService.create({
            name: `Super Admin - ${company.short_name}`,
            email: req.body.email,
            roles: [superAdmin._id],
            company: company._id
        });
        
        await RoleSerVice.edit(superAdmin._id, { users: [superAdminUser._id] } );

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
