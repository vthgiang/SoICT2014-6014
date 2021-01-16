const {
    PurchasingRequest, ManufacturingCommand
} = require(`../../../../models`);

const {
    connect
} = require(`../../../../helpers/dbHelper`);

function getArrayTimeFromString(stringDate) {
    arrayDate = stringDate.split('-');
    let year = arrayDate[2];
    let month = arrayDate[1];
    let day = arrayDate[0];
    const date = new Date(year, month - 1, day);
    const moment = require('moment');

    // start day of createdAt
    var start = moment(date).startOf('day');
    // end day of createdAt
    var end = moment(date).endOf('day');

    return [start, end];
}

exports.createPurchasingRequest = async (userId, data, portal) => {
    let newPurchasingRequest = await PurchasingRequest(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        creator: userId,
        materials: data.materials.map(item => {
            return {
                good: item.good,
                quantity: item.quantity
            }
        }),
        intendReceiveTime: data.intendReceiveTime,
        planCode: data.planCode,
        description: data.description,
        status: data.status,
        manufacturingCommand: data.manufacturingCommand
    });

    let purchasingRequest = await PurchasingRequest(connect(DB_CONNECTION, portal)).findById({ _id: newPurchasingRequest._id })
        .populate([{
            path: "creator", select: "name"
        }, {
            path: "materials.good", select: "_id code name baseUnit"
        }, {
            path: "manufacturingCommand",
            populate: [{
                path: "good",
                select: "code name baseUnit materials",
                populate: [{
                    path: "materials.good",
                    select: "code name baseUnit",
                }]
            }]
        }]);
    if (data.manufacturingCommand) {
        let command = await ManufacturingCommand(connect(DB_CONNECTION, portal)).findById({ _id: data.manufacturingCommand });
        command.purchasingRequest = purchasingRequest._id;
        await command.save();
    }
    return { purchasingRequest }
}

exports.getAllPurchasingRequest = async (query, portal) => {
    let option = {};
    let { page, limit } = query;
    if (query.code) {
        option.code = new RegExp(query.code, "i");
    }
    if (query.planCode) {
        option.planCode = new RegExp(query.planCode, "i");
    }
    if (query.status) {
        option.status = {
            '$in': query.status
        }
    }
    if (query.intendReceiveTime) {
        option.intendReceiveTime = {
            '$gte': getArrayTimeFromString(query.intendReceiveTime)[0],
            '$lte': getArrayTimeFromString(query.intendReceiveTime)[1]
        }
    }
    if (query.createdAt) {
        option.createdAt = {
            '$gte': getArrayTimeFromString(query.createdAt)[0],
            '$lte': getArrayTimeFromString(query.createdAt)[1]
        }
    }
    if (!limit || !page) {
        let docs = await PurchasingRequest(connect(DB_CONNECTION, portal))
            .find(option)
            .populate([{
                path: "creator", select: "name"
            }, {
                path: "materials.good", select: "_id code name baseUnit"
            }, {
                path: "manufacturingCommand",
                populate: [{
                    path: "good",
                    select: "code name baseUnit materials",
                    populate: [{
                        path: "materials.good",
                        select: "code name baseUnit",
                    }]
                }],
                sort: {
                    'updatedAt': 'desc'
                }
            }]);
        let purchasingRequests = {};
        purchasingRequests.docs = docs;
        return { purchasingRequests }
    } else {
        let purchasingRequests = await PurchasingRequest(connect(DB_CONNECTION, portal))
            .paginate(option, {
                limit: limit,
                page: page,
                populate: [{
                    path: "creator", select: "name"
                }, {
                    path: "materials.good", select: "_id code name baseUnit"
                }, {
                    path: "manufacturingCommand",
                    populate: [{
                        path: "good",
                        select: "code name baseUnit materials",
                        populate: [{
                            path: "materials.good",
                            select: "code name baseUnit",
                        }]
                    }]
                }],
                sort: {
                    'updatedAt': 'desc'
                }
            });
        return { purchasingRequests }
    }
}

exports.getPurchasingRequestById = async (id, portal) => {
    let purchasingRequest = await PurchasingRequest(connect(DB_CONNECTION, portal))
        .findById({ _id: id })
        .populate([{
            path: "creator", select: "name"
        }, {
            path: "materials.good", select: "_id code name baseUnit"
        }, {
            path: "manufacturingCommand",
            populate: [{
                path: "good",
                select: "code name baseUnit materials",
                populate: [{
                    path: "materials.good",
                    select: "code name baseUnit",
                }]
            }]
        }]);
    if (!purchasingRequest) {
        throw Error("purchasingRequest is not existing");
    }

    return { purchasingRequest }

}

exports.editPurchasingRequest = async (id, data, portal) => {
    console.log(data);
    let oldPurchasingRequest = await PurchasingRequest(connect(DB_CONNECTION, portal))
        .findById({ _id: id });
    if (!oldPurchasingRequest) {
        throw Error("purchasingRequest is not existing");
    }

    oldPurchasingRequest.code = data.code ? data.code : oldPurchasingRequest.code;
    oldPurchasingRequest.creator = data.creator ? data.creator : oldPurchasingRequest.creator;
    oldPurchasingRequest.intendReceiveTime = data.intendReceiveTime ? data.intendReceiveTime : oldPurchasingRequest.intendReceiveTime;
    oldPurchasingRequest.description = data.description ? data.description : oldPurchasingRequest.description;
    oldPurchasingRequest.status = data.status ? data.status : oldPurchasingRequest.status;
    oldPurchasingRequest.materials = data.materials ? data.materials.map((material) => {
        return {
            good: material.good,
            quantity: material.quantity
        }
    }) : oldPurchasingRequest.materials;




    await oldPurchasingRequest.save();
    let purchasingRequest = await PurchasingRequest(connect(DB_CONNECTION, portal))
        .findById({ _id: oldPurchasingRequest._id })
        .populate([{
            path: "creator", select: "name"
        }, {
            path: "materials.good", select: "_id code name baseUnit"
        }, {
            path: "manufacturingCommand",
            populate: [{
                path: "good",
                select: "code name baseUnit materials",
                populate: [{
                    path: "materials.good",
                    select: "code name baseUnit",
                }]
            }]
        }]);

    return { purchasingRequest }
}