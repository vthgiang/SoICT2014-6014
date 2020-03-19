const Link = require('../../../models/link.model');

exports.get = async (companyId) => {

    return await Link
        .find({
            company: companyId,
            type: 'service'
        });
}

exports.getPaginate = async (company, limit, page, data={}) => {
    const newData = await Object.assign({ company }, data );
    return await Link
        .paginate( newData , { 
            page, 
            limit
        });
}

exports.show = async (id) => {

    return await Link.findById(id);
}

exports.create = async(data, companyId) => {
    const link = Link.findOne({ url: data.url, company: companyId });
    if(link === null) throw ({msg: 'link_does_not_exist'});

    return await Link.create({
        url: data.url,
        description: data.description,
        company: companyId
    });
}

exports.edit = async(id, data) => {
    var link = await Link.findById(id);
    link.url = data.url;
    link.description = data.description;
    await link.save();

    return link;
}

exports.delete = async(id) => {
    return await Link.deleteOne({ _id: id });
}