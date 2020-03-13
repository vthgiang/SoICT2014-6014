const Link = require('../../../models/link.model');
const Privilege = require('../../../models/privilege.model');

exports.get = async (company) => {
    return await Link
        .find({ company })
        .populate({ path: 'roles', model: Privilege });
}

exports.getPaginate = async (company, limit, page, data={}) => {
    const newData = await Object.assign({ company }, data );
    return await Link
        .paginate( newData , { 
            page, 
            limit,
            populate: [
                { path: 'roles', model: Privilege, populate: {path: 'roleId', model: Role }}
            ]
        });
}

exports.getById = async (id) => {

    return await Link
        .findById(id)
        .populate({ path: 'roles', model: Privilege });
}

exports.create = async(data, companyId) => {
    if(data.url === '/system') throw { msg: 'The url " /system " cannot create'};
    return await Link.create({
        url: data.url,
        description: data.description,
        company: companyId
    });
}

exports.edit = async(id, data) => {
    var link = await Link
        .findById(id)
        .populate({ path: 'roles', model: Privilege });

    link.url = data.url;
    link.description = data.description;
    link.company = data.company ? data.company : link.company;
    link.save();

    return link;
}

exports.delete = async(id) => {
    var relationshiopDelete = await Privilege.deleteMany({
        resourceId: id,
        resourceType: 'Link'
    });
    var deleteRole = await Link.deleteOne({ _id: id});

    return {relationshiopDelete, deleteRole};
}

/*----------------------------------------------------------
-----------------Manage links of 1 company -----------------
-----------------------------------------------------------*/

exports.getLinksOfCompany = async(id) => {

    return await Link
        .find({ company: id })
        .populate({ path: 'roles', model: Privilege });
} 

exports.relationshipLinkRole = async(linkId, roleArr) => {
    console.log("relation ship: ", linkId, roleArr)
    await Privilege.deleteMany({
        resourceId: linkId,
        resourceType: 'Link'
    });
    console.log('creat data')
    var data = roleArr.map( role => {
        return {
            resourceId: linkId,
            resourceType: 'Link',
            roleId: role
        };
    });
    var privilege = await Privilege.insertMany(data);
    console.log("Created data: ", privilege)

    return privilege;
}


exports.addComponentOfLink = async(id, componentId) => { //thêm component(button thêm, sửa, xóa,..) trên trang web 
    var link = await Link
        .findById(id)
        .populate({ path: 'roles', model: Privilege }); //Lấy thông tin trang hiện tại

    link.components.push(componentId); //thêm id của component vào trong mảng các component của trang này
    link.save();

    return link;
}