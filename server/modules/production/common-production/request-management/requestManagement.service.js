const {
    RequestManagement, ManufacturingCommand, ManufacturingMill
} = require(`../../../../models`);
const { getAllEmployeeOfUnitByRole } = require("../../../super-admin/user/user.service");

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

exports.createRequest = async (userId, data, portal) => {
    let newRequest = await RequestManagement(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        creator: userId,
        goods: data.goods.map(item => {
            return {
                good: item.good,
                quantity: item.quantity
            }
        }),
        desiredTime: data.desiredTime ? data.desiredTime : null,
        description: data.description ? data.description : null,
        status: data.status ? data.status : null,
        manufacturingWork: data.manufacturingWork ? data.manufacturingWork : null,
        approverInFactory: data.approverInFactory ? data.approverInFactory.map((item) => {
            return {
                approver: item.approver,
                approvedTime: item.approvedTime
            }
        }) : [],
        approverInWarehouse: data.approverInWarehouse ? data.approverInWarehouse.map((item) => {
            return {
                approver: item.approver,
                approvedTime: item.approvedTime
            }
        }) : [],
        approverInOrder: data.approverInOrder ? data.approverInOrder.map((item) => {
            return {
                approver: item.approver,
                approvedTime: item.approvedTime
            }
        }) : [],
        approverReceiptRequestInOrder: data.approverReceiptRequestInOrder ? data.approverReceiptRequestInOrder.map((item) => {
            return {
                approver: item.approver,
                approvedTime: item.approvedTime
            }
        }) : [],
        stock: data.stock,
        orderUnit: data.orderUnit,
        requestType: data.requestType ? data.requestType : 1,
        type: data.type ? data.type : 1,
    });

    let request = await RequestManagement(connect(DB_CONNECTION, portal)).findById({ _id: newRequest._id })
        .populate([
            { path: "creator", select: "name" },
            { path: "goods.good", select: "code name baseUnit" },
            { path: "approverInFactory.approver", select: "name" },
            { path: "approverInWarehouse.approver", select: "name" },
            { path: "approverInOrder.approver", select: "name" },
            { path: "approverReceiptRequestInOrder", select: "name" },
            { path: "stock", select: "name" },
            { path: "manufacturingWork", select: "name" },
            { path: "orderUnit", select: "name" },
        ]);
    return { request }
}

exports.getAllRequestByCondition = async (query, portal) => {
    let { page, limit } = query;
    let option = {};
    let conditionInStock = {};
    if (query.requestFrom == 'stock') {
        if (query.type == 1) {
            option = {
                $or: [
                    {
                        $and: [ // nhập kho khi mua hàng 
                            { requestType: 1 },
                            { type: 1 },
                            { status: {'$gte': 6}}
                        ],
                    },
                    {
                        $and: [ // nhập kho khi sản xuất xong
                            { requestType: 1 },
                            { type: 2 },
                            { status: {'$gte': 2}}
                        ],
                    },
                    {
                        $and: [ // nhập kho khi tronng bộ phận đơn hàng tự tạo
                            { requestType: 2 },
                            { type: 1 },
                            { status: {'$gte': 2}}
                        ],
                    },
                    {
                        $and: [ // nhập kho trong kho tự tạo
                            { requestType: 3 },
                            { type: 1 }
                        ],
                    }
                ],
            };
        } else if (query.type == 2) {
            option = {
                $or: [
                    {
                        $and: [
                            { requestType: 1 },
                            { type: 3 },
                            { status: {'$gte': 2}}
                        ],
                    },
                    {
                        $and: [
                            { requestType: 3 },
                            { type: 2 }
                        ],
                    },
                ],
            };
        }
    }
    if (query.code) {
        option.code = new RegExp(query.code, "i");
    }

    if (query.status) {
        option.status = query.status;
    }
    if (query.desiredTime) {
        option.desiredTime = {
            '$gte': getArrayTimeFromString(query.desiredTime)[0],
            '$lte': getArrayTimeFromString(query.desiredTime)[1]
        }
    }
    if (query.requestFrom !== 'stock' || (query.requestType == 3 && query.type != 1 && query.type != 2)) {
        if (query.requestType) {
            option.requestType = query.requestType;
        }

        if (query.type) {
            option.type = query.type;
        }
    }

    if (query.creator) {
        option.creator = query.creator;
    }

    if (query.requestType == 1 && query.type == 1 && query.requestFrom == 'order') {
        option.status = {
            '$gte': 2,
        }
    }

    if (query.status) {
        option.status = query.status;
    }

    if (query.createdAt) {
        option.createdAt = {
            '$gte': getArrayTimeFromString(query.createdAt)[0],
            '$lte': getArrayTimeFromString(query.createdAt)[1]
        }
    }
    if (!limit || !page) {
        let docs = await RequestManagement(connect(DB_CONNECTION, portal))
            .find(option)
            .populate([
                { path: "creator", select: "name" },
                { path: "goods.good", select: "code name baseUnit" },
                { path: "approverInFactory.approver", select: "name" },
                { path: "approverInWarehouse.approver", select: "name" },
                { path: "approverInOrder.approver", select: "name" },
                { path: "approverReceiptRequestInOrder", select: "name" },
                { path: "stock", select: "name" },
                { path: "manufacturingWork", select: "name" },
                { path: "orderUnit", select: "name" },
            ]);
        let requests = {};
        requests.docs = docs;
        return { requests }
    } else {
        let requests = await RequestManagement(connect(DB_CONNECTION, portal))
            .paginate(option, {
                limit: limit,
                page: page,
                populate: [{ path: "creator", select: "name" },
                { path: "goods.good", select: "code name baseUnit" },
                { path: "approverInFactory.approver", select: "name" },
                { path: "approverInWarehouse.approver", select: "name" },
                { path: "approverInOrder.approver", select: "name" },
                { path: "approverReceiptRequestInOrder", select: "name" },
                { path: "stock", select: "name" },
                { path: "manufacturingWork", select: "name" },
                { path: "orderUnit", select: "name" },
                ],
                sort: {
                    'updatedAt': 'desc'
                }
            });
        return { requests }
    }
}

exports.getRequestById = async (id, portal) => {
    let request = await RequestManagement(connect(DB_CONNECTION, portal))
        .findById({ _id: id })
        .populate([{ path: "creator", select: "name" },
        { path: "goods.good", select: "_id code name baseUnit" },
        { path: "approverInFactory.approver", select: "name" },
        { path: "approverInWarehouse.approver", select: "name" },
        { path: "approverInOrder.approver", select: "name" },
        { path: "approverReceiptRequestInOrder", select: "name" },
        { path: "stock", select: "name" },
        { path: "manufacturingWork", select: "name" },
        { path: "orderUnit", select: "name" },
        ]);
    if (!request) {
        throw Error("request is not existing");
    }

    return { request }

}

function findIndexOfApprover(array, id) {
    let result = -1;
    array.forEach((element, index) => {
        if (element.approver == id) {
            result = index;
        }
    });
    return result;
}

exports.editRequest = async (id, data, portal) => {
    let oldRequest = await RequestManagement(connect(DB_CONNECTION, portal))
        .findById({ _id: id })
        .populate([
            { path: "orderUnit" },
        ]);
    if (!oldRequest) {
        throw Error("request is not existing");
    }

    oldRequest.code = data.code ? data.code : oldRequest.code;
    oldRequest.creator = data.creator ? data.creator : oldRequest.creator;
    oldRequest.desiredTime = data.desiredTime ? data.desiredTime : oldRequest.desiredTime;
    oldRequest.description = data.description ? data.description : oldRequest.description;
    if (data.approverIdInFactory) {
        let index = findIndexOfApprover(oldRequest.approverInFactory, data.approverIdInFactory);

        if (index !== -1) {
            oldRequest.approverInFactory[index].approvedTime = new Date(Date.now());
        }

        let quantityApproved = 1;
        oldRequest.approverInFactory.forEach((element, index1) => {
            if (index1 !== index && element.approvedTime == null) {
                quantityApproved = 0;
            }
        });
        if (quantityApproved) {
            oldRequest.status = 2;
        }
    }
    else {
        oldRequest.status = data.status ? data.status : oldRequest.status;
    }
    // phê duyệt yêu cầu mua hàng
    if (data.approverIdInOrder) {
        let index = findIndexOfApprover(oldRequest.approverInOrder, data.approverIdInOrder);
        if (index !== -1) {
            oldRequest.approverInOrder[index].approvedTime = new Date(Date.now());
            oldRequest.status = 3;
        }
    }
    else {
        oldRequest.status = data.status ? data.status : oldRequest.status;
    }
    // Phê duyệt yêu cầu gửi yêu cầu nhập kho,Chuyển trạng thái từ 5. Chờ phê duyệt yêu cầu nhập kho => 6: Đã gửi yêu cầu nhập kho
    if (data.approverIdReceiptRequestInOrder) {
        let index = findIndexOfApprover(oldRequest.approverReceiptRequestInOrder, data.approverIdReceiptRequestInOrder);
        if (index !== -1) {
            oldRequest.approverReceiptRequestInOrder[index].approvedTime = new Date(Date.now());
            oldRequest.status = oldRequest.status == 5 ? 6 : 2;
        }
    }
    else {
        oldRequest.status = data.status ? data.status : oldRequest.status;
    }
    oldRequest.manufacturingWork = data.manufacturingWork ? data.manufacturingWork : oldRequest.manufacturingWork;
    oldRequest.requestType = data.requestType ? data.requestType : oldRequest.requestType;
    oldRequest.type = data.type ? data.type : oldRequest.type;
    oldRequest.stock = data.stock ? data.stock : oldRequest.stock;
    oldRequest.orderUnit = data.orderUnit ? data.orderUnit : oldRequest.orderUnit;
    oldRequest.goods = data.goods ? data.goods.map((good) => {
        return {
            good: good.good,
            quantity: good.quantity
        }
    }) : oldRequest.goods;
    oldRequest.approverInFactory = data.approverInFactory ? data.approverInFactory.map((item) => {
        return {
            approver: item.approver,
            approvedTime: item.approvedTime
        }
    }) : oldRequest.approverInFactory;
    // Thêm người phê duyệt yêu cầu nhập kho trong bộ phận đơn hàng
    if (data.status == 5) {
        oldRequest.approverReceiptRequestInOrder = data.approverReceiptRequestInOrder ? data.approverReceiptRequestInOrder.map((item) => {
            return {
                approver: item.approver,
                approvedTime: item.approvedTime
            }
        }) : oldRequest.approverReceiptRequestInOrder;
    }
    oldRequest.approverInWarehouse = data.approverInWarehouse ? data.approverInWarehouse.map((item) => {
        return {
            approver: item.approver,
            approvedTime: item.approvedTime
        }
    }) : oldRequest.approverInWarehouse;

    if (oldRequest.requestType == 1 && oldRequest.type == 1 && oldRequest.status == 2) {
        let orderManagerArray = await getAllEmployeeOfUnitByRole(portal, oldRequest.orderUnit.managers);
        oldRequest.approverInOrder = orderManagerArray ? orderManagerArray.map((item) => {
            return {
                approver: item.userId._id,
                approvedTime: null
            }
        }) : oldRequest.approverInOrder;
    }

    await oldRequest.save();
    let request = await RequestManagement(connect(DB_CONNECTION, portal))
        .findById({ _id: oldRequest._id })
        .populate([
            { path: "creator", select: "name" },
            { path: "goods.good", select: "code name baseUnit" },
            { path: "approverInFactory.approver", select: "name" },
            { path: "approverInWarehouse.approver", select: "name" },
            { path: "approverInOrder.approver", select: "name" },
            { path: "approverReceiptRequestInOrder", select: "name" },
            { path: "stock", select: "name" },
            { path: "manufacturingWork", select: "name" },
            { path: "orderUnit", select: "name" },
        ]);

    return { request }
}

exports.getNumberRequest = async (query, portal) => {
    const { manufacturingWorks, fromDate, toDate } = query;
    let options = {};
    if (manufacturingWorks) {
        let listManufacturingMills = await ManufacturingMill(connect(DB_CONNECTION, portal)).find({
            manufacturingWorks: {
                $in: manufacturingWorks
            }
        });
        let listMillIds = listManufacturingMills.map(x => x._id);
        let manufacturingCommands = await ManufacturingCommand(connect(DB_CONNECTION, portal)).find({
            manufacturingMill: {
                $in: listMillIds
            }
        });
        if (manufacturingCommands.length == 0) {
            manufacturingCommands = [1]
        }
        options.manufacturingCommand = {
            $in: manufacturingCommands
        }
    }

    if (fromDate) {
        options.createdAt = {
            $gte: getArrayTimeFromString(fromDate)[0]
        }
    }

    if (toDate) {
        options.createdAt = {
            ...options.createdAt,
            $lte: getArrayTimeFromString(toDate)[1]
        }
    }

    options.status = 1;
    const request1 = await RequestManagement(connect(DB_CONNECTION, portal)).find(options).count();

    options.status = 2;
    const request2 = await RequestManagement(connect(DB_CONNECTION, portal)).find(options).count();

    options.status = 3;
    const request3 = await RequestManagement(connect(DB_CONNECTION, portal)).find(options).count();

    return { request1, request2, request3 }
}
