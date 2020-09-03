const { CrmCustomer, CrmGroup } = require(SERVER_MODELS_DIR).schema;

exports.getCustomers = async (query) => {
    var { company, page, limit } = query;
    if(!company) throw['company_invalid'];
    if (!page && !limit) {

        return await CrmCustomer
            .find({ company })
            .populate([
                { path: 'group', model: CrmGroup }
            ]);
    } else {
        const option = (query.key && query.value) ?
            Object.assign({company}, {[`${query.key}`]: new RegExp(query.value, "i")}) :
            {company};

        return await CrmCustomer
            .paginate( option , { 
                page, 
                limit,
                populate: [
                    { path: 'group', model: CrmGroup }
                ]
            });
    }
}

exports.createCustomer = async (data) => {
    const company = await Company.findById(data.company);
    if(company === null) throw ['company_not_found'];

    return await CrmCustomer.create({
        company: data.company,
        name: data.name,
        code: data.code,
        phone: data.phone,
        address: data.address,
        location: data.location,
        email: data.email,
        group: data.group,
        birth: data.birth
    });
}

exports.getCustomer = async (id) => {

    return await CrmCustomer.findById(id)
        .populate([
            { path: 'group', model: CrmGroup }
        ])
}

exports.editCustomer = async (id, data) => {
    const customer = await CrmCustomer.findById(id);
    customer.name = data.name;
    customer.code = data.code;
    customer.phone = data.phone;
    customer.address = data.address;
    customer.location = data.location;
    customer.email = data.email;
    customer.group = data.group;
    customer.birth = data.birth;
    await customer.save();

    return await CrmCustomer.findById(id)
        .populate([
            { path: 'group', model: CrmGroup }
        ]);
}

exports.deleteCustomer = async (id) => {
    await CrmCustomer.deleteOne({_id: id});

    return id;
}
