const { Customer, CustomerLocation, CustomerGroup, User, CustomerLiability } = require('../../models').schema;

// Customer
exports.getCustomers = async (company, query) => {
    var page = query.page;
    var limit = query.limit;
    
    if (!page && !limit) {
        return await Customer
            .find({ company })
            .populate([
                { path: 'location', model: CustomerLocation },
                { path: 'group', model: CustomerGroup },
                { path: 'liabilities', model: CustomerLiability, populate: [
                    { path: 'creator', model: User },
                ]}
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
                    { path: 'group', model: CustomerGroup },
                    { path: 'liabilities', model: CustomerLiability, populate: [
                        { path: 'creator', model: User },
                    ]}
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

// Customer liability
exports.getCustomerLiabilities = async (company, query) => {
    var page = query.page;
    var limit = query.limit;
    
    if (!page && !limit) {
        return await CustomerLiability.find({ company }).populate([
            { path: 'customer', model: Customer }, 
            { path: 'creator', model: User }
        ]);
    } else {
        const option = (query.key && query.value) ?
            Object.assign({company}, {[`${query.key}`]: new RegExp(query.value, "i")}) :
            {company};

        return await CustomerLiability
            .paginate( option , { 
                page, 
                limit,
                populate: [
                    { path: 'customer', model: Customer }, 
                    { path: 'creator', model: User },
                ]
            });
    }
}