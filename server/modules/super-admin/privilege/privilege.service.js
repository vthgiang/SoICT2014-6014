const {Privilege} = require('../../../models').schema;
const Link = require('../../../models/super-admin/link.model');
const Role = require('../../../models/auth/role.model');

/**
 * Thêm quyền truy cập tới Link cho một Role truyền vào
 */
exports.addLinkThatRoleCanAccess = async (idLink, arrRole) => {
    const check = await Privilege.findOne({ resource: idLink });
    if(check === null){
        //Chua co privilege cho link hien tai
        const privilege = await Privilege.create({
            resource: idLink,
            resource_type: 'Link',
            role: arrRole
        });

        return privilege;
    }else{
        //Privilege cho link hien tai da ton tai
        check.role = check.role.concat(arrRole);
        check.save();

        return check;
    }
    
}

/**
 * Thêm quyền truy cập tới Link cho một MẢNG Roles truyền vào
 */
exports.addLinkThatRolesCanAccess = async (linkId, roleArr) => {
    var data = roleArr.map( role => {
        return {
            roleId: role,
            resourceId: linkId,
            resourceType: 'Link'
        }
    });
    const privilege = await Privilege.insertMany(data);

    return privilege;
}

/**
 * Lấy ra mảng links mà một role được quyền truy cập
 */
exports.getLinksThatRoleCanAccess = async (idRole) => {
    const role = await Role.findById(idRole); //lay duoc role hien tai
    var roles = [role._id];
    roles = roles.concat(role.parents);
    const privilege = await Privilege.find({ 
        roleId: { $in: roles },
        resourceType: 'Link'
    }).populate({ path: 'resourceId', model: Link }); 
    const links = await privilege.map( link => link.resourceId );

    return links;
}

