const Privilege = require('../../models/privilege.model');
const Link = require('../../models/link.model');
const Role = require('../../models/role.model');

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