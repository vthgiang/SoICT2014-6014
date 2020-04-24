const Link = require('../../../models/super-admin/link.model');
const Privilege = require('../../../models/auth/privilege.model');

exports.getAllLinks = async (company) => {
    return await Link
        .find({ company })
        .populate({ path: 'roles', model: Privilege });
}

exports.getPaginatedLinks = async (company, limit, page, data={}) => {
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

exports.getLinkById = async (id) => {

    return await Link
        .findById(id)
        .populate({ path: 'roles', model: Privilege, populate: {path: 'roleId', model: Role }});
}

exports.createLink = async(data, companyId) => {
    if(data.url === '/system') throw ['cannot_create_this_url', 'this_url_cannot_be_use'];
    const check = await Link.findOne({company: componentId, url: data.url});
    if(check !== null) throw ['url_exist'];

    return await Link.create({
        url: data.url,
        description: data.description,
        company: companyId
    });
}

exports.editLink = async(id, data) => {
    const link = await Link.findById(id);

    link.url = data.url;
    link.description = data.description;
    link.company = data.company ? data.company : link.company;
    await link.save();

    return link;
}

exports.deleteLink = async(id) => {
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
    await Privilege.deleteMany({
        resourceId: linkId,
        resourceType: 'Link'
    });
    var data = roleArr.map( role => {
        return {
            resourceId: linkId,
            resourceType: 'Link',
            roleId: role
        };
    });
    var privilege = await Privilege.insertMany(data);

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