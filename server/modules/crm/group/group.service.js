const { CrmGroup } = require(SERVER_MODELS_DIR).schema;

exports.getGroups = async (company, query) => {
    var { page, limit } = query;
    if(!company) throw['company_invalid'];
    if (!page && !limit) {

        return await CrmGroup.find({ company });
    } else {
        const option = (query.key && query.value) ?
            Object.assign({company}, {[`${query.key}`]: new RegExp(query.value, "i")}) :
            {company};

        return await CrmGroup.paginate( option , { page, limit });
    }
}

exports.getGroup = async (id) => {
    if(!company) throw['company_invalid'];
    if (!page && !limit) {

        return await CrmGroup.find({ company });
    } else {
        const option = (query.key && query.value) ?
            Object.assign({company}, {[`${query.key}`]: new RegExp(query.value, "i")}) :
            {company};

        return await CrmGroup.paginate( option , { page, limit });
    }
}

exports.createGroup = async (data) => {
    return await CrmGroup.create(data);
}

exports.deleteGroup = async (id) => {
    await CrmGroup.deleteOne({_id: id});
    return id;
}