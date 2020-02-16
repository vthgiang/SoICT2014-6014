const Privilege = require('../../../models/privilege.model');
const Link = require('../../../models/link.model');
const Role = require('../../../models/role.model');

exports.addRoleToLink = async (idLink, arrRole) => {
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

//Lay cac links tuong ung voi role hien tai
exports.getLinksOfRole = async (idRole) => {
    const role = await Role.findById(idRole); //lay duoc role hien tai
    var roles = [role._id];
    roles = roles.concat(role.abstract); //thêm các role children vào mảng-> roles luc nay la 1 arr role can tim link tuong ung
    const privilege = await Privilege.find({ 
        roleId: { $in: roles },
        resourceType: 'Link'
    }).populate({ path: 'resourceId', model: Link }); 
    const links = await privilege.map( link => link.resourceId );

    return links;
}

exports.addRolesToLink = async (linkId, roleArr) => {
    var data = roleArr.map( role => {
        return {
            roleId: role,
            resourceId: linkId,
            resourceType: 'Link'
        }
    }); // tao data de truyen vao ham insert
    const privilege = await Privilege.insertMany(data);

    return privilege;
}