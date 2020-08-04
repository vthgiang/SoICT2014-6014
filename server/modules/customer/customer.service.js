const { Customer, CustomerLocation, CustomerGroup } = require('../../models').schema;

// Customer
exports.getCustomers = async (company, query) => {
    var page = query.page;
    var limit = query.limit;
    
    if (!page && !limit) {
        return await Customer
            .find({ company })
            .populate([
                { path: 'location', model: CustomerLocation },
                { path: 'group', model: CustomerGroup }
            ]);
    } else {
        const option = (query.key && query.value) ?
            Object.assign({company}, {[`${query.key}`]: new RegExp(query.value, "i")}) :
            {company};

        return await Customer
            .paginate( option , { 
                page, 
                limit,
                populate: [
                    { path: 'location', model: CustomerLocation },
                    { path: 'group', model: CustomerGroup }
                ]
            });
    }
}

// Customer group
exports.getCustomerGroups = async (company, query) => {
    var page = query.page;
    var limit = query.limit;
    
    if (!page && !limit) {
        return await CustomerGroup.find({ company });
    } else {
        const option = (query.key && query.value) ?
            Object.assign({company}, {[`${query.key}`]: new RegExp(query.value, "i")}) :
            {company};

        return await CustomerGroup
            .paginate( option , { 
                page, 
                limit
            });
    }
}
