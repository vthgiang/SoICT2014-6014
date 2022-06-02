const { Stock } = require(`../../../../models`);
const { connect } = require(`../../../../helpers/dbHelper`);

exports.getAllStocks = async (company, query, portal) => {
    var { page, limit, managementLocation } = query;
    
    // if(!company) throw['company_invalid'];
    if(!page || !limit){
        let options = {};
        if(managementLocation) {
            options.managementLocation = { $elemMatch: { role: managementLocation }};
        }
        return await Stock(connect(DB_CONNECTION, portal))
            .find(options)
            .populate([
                { path: 'goods.good', select: 'id name'},
                { path: 'managementLocation.role', select: 'id name'},
                {
                    path: "organizationalUnit",
                    populate: [{
                        path: 'managers',
                        populate: [{
                            path: "users",
                            populate: [{
                                path: "userId"
                            }]
                        }]
                    },
                    { path: 'deputyManagers' },
                    { path: 'employees' }]
                }
            ])
    }
    else{
        if (!managementLocation) {
            throw Error("Role is not defined")
        }
        // let option = { managementLocation: { $elemMatch: { role: managementLocation }} } // bên client comment trường này khi tạo, khi lọc thêm điều kiện này thì làm sao lấy dc dữ liệu ???
        let option = {}
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
                    { path: 'managementLocation.role', select: 'id name'},
                    {
                        path: "organizationalUnit",
                        populate: [{
                            path: 'managers',
                            populate: [{
                                path: "users",
                                populate: [{
                                    path: "userId"
                                }]
                            }]
                        },
                        { path: 'deputyManagers' },
                        { path: 'employees' }]
                    }
                ]
            })
    }
}

exports.getStock = async (id, portal) => {
    return await Stock(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate([
            { path: 'goods.good', select: 'id name'},
            { path: 'managementLocation.role', select: 'id name'},
            {
                path: "organizationalUnit",
                populate: [{
                    path: 'managers',
                    populate: [{
                        path: "users",
                        populate: [{
                            path: "userId"
                        }]
                    }]
                },
                { path: 'deputyManagers' },
                { path: 'employees' }]
            }
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
        organizationalUnit: data.organizationalUnitValue,
        startTime: data.startTime,
        endTime: data.endTime,
    })
    return await Stock(connect(DB_CONNECTION, portal))
        .findById(stock._id)
        .populate([
            { path: 'goods.good', select: 'id name'},
            { path: 'managementLocation.role', select: 'id name'},
            {
                path: "organizationalUnit",
                populate: [{
                    path: 'managers',
                    populate: [{
                        path: "users",
                        populate: [{
                            path: "userId"
                        }]
                    }]
                },
                { path: 'deputyManagers' },
                { path: 'employees' }]
            }
        ])
}

exports.editStock = async (id, data, portal) => {
    let stock = await Stock(connect(DB_CONNECTION, portal)).findById(id);

    stock.code = data.code ? data.code : stock.code,
    stock.name = data.name ? data.name : stock.name,
    stock.status = data.status ? data.status : stock.status,
    stock.description = data.description ? data.description : stock.description,
    stock.address = data.address ? data.address : stock.address,
    stock.goods = data.goods ? data.goods.map(item => {
        return {
            good: item.good,
            maxQuantity: item.maxQuantity,
            minQuantity: item.minQuantity
        }
    }) : stock.goods,
    stock.managementLocation = data.managementLocation ? data.managementLocation.map(item => {
        return {
            role: item.role,
            managementGood: item.managementGood
        }
    }) : stock.managementLocation,
    stock.organizationalUnit = data.organizationalUnitValue ? data.organizationalUnitValue : stock.organizationalUnit,
    stock.startTime = data.startTime ? data.startTime : stock.startTime,
    stock.endTime = data.endTime ? data.endTime : stock.endTime,

    await stock.save();

    return await Stock(connect(DB_CONNECTION, portal))
        .findById(stock._id)
        .populate([
            { path: 'goods.good', select: 'id name'},
            { path: 'managementLocation.role', select: 'id name'},
            {
                path: "organizationalUnit",
                populate: [{
                    path: 'managers',
                    populate: [{
                        path: "users",
                        populate: [{
                            path: "userId"
                        }]
                    }]
                },
                { path: 'deputyManagers' },
                { path: 'employees' }]
            }
        ])
}

exports.deleteStock = async (id, portal) => {
    await Stock(connect(DB_CONNECTION, portal)).deleteOne({_id: id});
    return id;
}
