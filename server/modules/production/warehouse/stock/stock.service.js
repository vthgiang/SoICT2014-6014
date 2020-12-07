const { Stock } = require(`${SERVER_MODELS_DIR}`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

exports.getAllStocks = async (company, query, portal) => {
    var { page, limit, managementLocation } = query;
    
    if(!company) throw['company_invalid'];
    if(!page || !limit){
        let options = {};
        if(managementLocation) {
            options.managementLocation = { $elemMatch: { role: managementLocation }};
        }
        return await Stock(connect(DB_CONNECTION, portal))
            .find(options)
            .populate([
                { path: 'goods.good', select: 'id name'},
                { path: 'managementLocation.role', select: 'id name'}
            ])
    }
    else{
        if (!managementLocation) {
            throw Error("Role is not defined")
        }
        let option = { managementLocation: { $elemMatch: { role: managementLocation }} }

        if(query.code){
            option.code = new RegExp(query.code, "i")
        }

        if(query.name){
            option.name = new RegExp(query.name, "i")
        }

        if(query.status){
            option.status = query.status
        }

        return await Stock(connect(DB_CONNECTION, portal))
            .paginate(option, {
                page,
                limit,
                populate: [
                    { path: 'goods.good', select: 'id name'},
                    { path: 'managementLocation.role', select: 'id name'}
                ]
            })
    }
}

exports.getStock = async (id, portal) => {
    return await Stock(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate([
            { path: 'goods.good', select: 'id name'},
            { path: 'managementLocation.role', select: 'id name'}
        ])
}

exports.createStock = async (company, data, portal) => {
    let stock = await Stock(connect(DB_CONNECTION, portal)).create({
        company: company,
        code: data.code,
        name: data.name,
        status: data.status,
        description: data.description,
        address: data.address,
        goods: data.goods.map(item => {
            return {
                good: item.good,
                maxQuantity: item.maxQuantity,
                minQuantity: item.minQuantity
            }
        }),
        managementLocation: data.managementLocation ? data.managementLocation.map(item => {
            return {
                role: item.role,
                managementGood: item.managementGood
            }
        }) : [],
    })
    return await Stock(connect(DB_CONNECTION, portal))
        .findById(stock._id)
        .populate([
            { path: 'goods.good', select: 'id name'},
            { path: 'managementLocation.role', select: 'id name'}
        ])
}

exports.editStock = async (id, data, portal) => {
    let stock = await Stock(connect(DB_CONNECTION, portal)).findById(id);

    stock.code = data.code,
    stock.name = data.name,
    stock.status = data.status,
    stock.description = data.description,
    stock.address = data.address,
    stock.goods = data.goods.map(item => {
        return {
            good: item.good,
            maxQuantity: item.maxQuantity,
            minQuantity: item.minQuantity
        }
    }),
    stock.managementLocation = data.managementLocation ? data.managementLocation.map(item => {
        return {
            role: item.role,
            managementGood: item.managementGood
        }
    }) : stock.managementLocation,

    await stock.save();

    return await Stock(connect(DB_CONNECTION, portal))
        .findById(stock._id)
        .populate([
            { path: 'goods.good', select: 'id name'},
            { path: 'managementLocation.role', select: 'id name'}
        ])
}

exports.deleteStock = async (id, portal) => {
    await Stock(connect(DB_CONNECTION, portal)).deleteOne({_id: id});
    return id;
}