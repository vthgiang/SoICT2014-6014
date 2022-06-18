const {
    ProductRequestManagement, ManufacturingCommand, ManufacturingMill, Stock
} = require(`../../../../models`);
const { getAllManagersOfUnitByRole } = require("../../../super-admin/user/user.service");
const NotificationServices = require(`../../../notification/notification.service`)
const { getStock } = require(`../../warehouse/stock/stock.service`);

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

/* Tạo yêu cầu*/

exports.createRequest = async (user, data, portal) => {
    let stockManagersArray = [];
    if (data.requestType != 3) { // lấy dữ liệu người phê duyệt trong kho trong trường hợp tạo phiếu ở trong module kho
        let stock = await Stock(connect(DB_CONNECTION, portal))
            .findById({ _id: data.stock })
            .populate({ path: "organizationalUnit" });
        stockManagersArray = await getAllManagersOfUnitByRole(portal, stock.organizationalUnit.managers);
    }
    let newRequest = await ProductRequestManagement(connect(DB_CONNECTION, portal)).create({
        code: data.code,
        bill: data.bill ? data.bill : null,
        creator: user._id,
        goods: data.goods.map(item => {
            return {
                good: item.good,
                quantity: item.quantity,
                lots: item.lots ? item.lots.map(lot => {
                    return {
                        lot: lot.lot,
                        quantity: lot.quantity,
                        returnQuantity: lot.returnQuantity,
                        note: lot.note
                    }
                }) : []
            }
        }),
        desiredTime: data.desiredTime ? data.desiredTime.split("-").reverse().join("-") : null,
        description: data.description ? data.description : null,
        status: data.status ? data.status : null,
        manufacturingWork: data.manufacturingWork ? data.manufacturingWork : null,
        approvers: data.approvers ? data.approvers.map((item1) => {
            return {
                information: item1.information ? item1.information.map((item2) => {
                    return {
                        approver: item2.approver,
                        approvedTime: item2.approvedTime,
                        note: item2.note ? item2.note : null,
                    }
                }) : [],
                approveType: item1.approveType
            }
        }) : [],
        stock: data.stock,
        orderUnit: data.orderUnit,
        requestType: data.requestType ? data.requestType : 1,
        type: data.type ? data.type : 1,
        supplier: data.supplier ? data.supplier : null,
    });

    /* Tạo thông báo cho người phê duyệt khi tạo yêu cầu */
    let approvers = [];
    let notificationText = "";
    let url = "";
    if (data.approvers) {
        data.approvers.map((item) => {
            item.information.map((item1) => {
                approvers.push(item1.approver);
            })
        })
    }
    switch (data.requestType) {
        case 1:
            switch (data.type) {
                case 1:
                    notificationText = "mua hàng";
                    break;
                case 2:
                    notificationText = "nhập kho hàng hóa";
                    break;
                case 3:
                    notificationText = "xuất kho hàng hóa";
                    break;
            }
            url = 'manufacturing';
            break;
        case 2:
            notificationText = "nhập kho hàng hóa";
            url = 'order';
            break;
        case 3:
            switch (data.type) {
                case 1:
                    notificationText = "nhập kho hàng hóa";
                    break;
                case 2:
                    notificationText = "xuất kho hàng hóa";
                    break;
                case 3:
                    notificationText = "trả hàng";
                    break;
                case 4:
                    notificationText = "luân chuyển hàng hóa";
                    break;
            }
            url = 'stock';
            break;
    }

    const date = data.desiredTime;
    const dataNotification = {
        organizationalUnits: [],
        title: `Xin phê duyệt yêu cầu ${notificationText}`,
        level: "general",
        content: `<p><strong>${user.name}</strong> đã gửi yêu cầu phê duyệt ${notificationText} đến trước ngày <strong>${date}</strong>, <a href="${process.env.WEBSITE}/request-management/${url}">Xem ngay</a></p>`,
        sender: `${user.name}`,
        users: approvers,
        associatedDataObject: {
            dataType: 5,
            description: `<p><strong>${user.name}</strong>: Đã gửi yêu cầu ${notificationText}.</p>`
        }
    };
    NotificationServices.createNotification(portal, portal, dataNotification)

    let request = await ProductRequestManagement(connect(DB_CONNECTION, portal)).findById({ _id: newRequest._id })
        .populate([
            { path: "creator", select: "name" },
            { path: "goods.good", select: "code name baseUnit" },
            { path: "goods.lots.lot" },
            { path: "bill", select: "code" },
            { path: "approvers.information.approver" },
            { path: "refuser.refuser", select: "name" },
            { path: "stock" },
            { path: "manufacturingWork", select: "name" },
            { path: "supplier", select: "name" },
            { path: "orderUnit", select: "name" },
        ]);
    return { request }
}

/* Lấy dữ liệu yêu cầu theo điều kiện*/

exports.getAllRequestByCondition = async (query, portal) => {
    let { page, limit } = query;
    let option = {};
    if (query.requestFrom == 'stock') {
        if (query.type == 1) {
            option = {
                $or: [
                    {
                        $and: [ // nhập kho khi mua hàng 
                            { requestType: 1 },
                            { type: 1 },
                            { status: { '$gte': 6 } }
                        ],
                    },
                    {
                        $and: [ // nhập kho khi sản xuất xong
                            { requestType: 1 },
                            { type: 2 },
                            { status: { '$gte': 2 } }
                        ],
                    },
                    {
                        $and: [ // nhập kho khi tronng bộ phận đơn hàng tự tạo
                            { requestType: 2 },
                            { type: 1 },
                            { status: { '$gte': 2 } }
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
                            { status: { '$gte': 2 } }
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
        let docs = await ProductRequestManagement(connect(DB_CONNECTION, portal))
            .find(option)
            .populate([
                { path: "creator", select: "name" },
                { path: "goods.good", select: "code name baseUnit" },
                { path: "goods.lots.lot" },
                { path: "bill", select: "code" },
                { path: "approvers.information.approver" },
                { path: "refuser.refuser", select: "name" },
                { path: "stock" },
                { path: "manufacturingWork", select: "name" },
                { path: "supplier", select: "name" },
                { path: "orderUnit", select: "name" },
            ]);
        let requests = {};
        requests.docs = docs;
        return { requests }
    } else {
        let requests = await ProductRequestManagement(connect(DB_CONNECTION, portal))
            .paginate(option, {
                limit: limit,
                page: page,
                populate: [{ path: "creator", select: "name" },
                { path: "goods.good", select: "code name baseUnit" },
                { path: "goods.lots.lot" },
                { path: "bill", select: "code" },
                { path: "approvers.information.approver" },
                { path: "refuser.refuser", select: "name" },
                { path: "stock" },
                { path: "manufacturingWork", select: "name" },
                { path: "supplier", select: "name" },
                { path: "orderUnit", select: "name" },
                ],
                sort: {
                    'updatedAt': 'desc'
                }
            });
        return { requests }
    }
}

/* Lấy yêu cầu theo id*/


exports.getRequestById = async (id, portal) => {
    let request = await ProductRequestManagement(connect(DB_CONNECTION, portal))
        .findById({ _id: id })
        .populate([{ path: "creator", select: "name" },
        { path: "goods.good", select: "_id code name baseUnit" },
        { path: "goods.lots.lot" },
        { path: "bill", select: "code" },
        { path: "approvers.information.approver" },
        { path: "refuser.refuser", select: "name" },
        { path: "stock" },
        { path: "manufacturingWork", select: "name" },
        { path: "supplier", select: "name" },
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

function findIndexOfRole(array, approveType) {
    let result = -1;
    array.forEach((element, index) => {
        if (element.approveType == approveType) {
            result = index;
        }
    });
    return result;
}

/* Chỉnh sửa yêu cầu*/

exports.editRequest = async (user, id, data, portal) => {
    let oldRequest = await ProductRequestManagement(connect(DB_CONNECTION, portal))
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
    if (data.approvedUser && data.approveType) {
        let index1 = findIndexOfRole(oldRequest.approvers, data.approveType);
        let index2 = findIndexOfApprover(oldRequest.approvers[index1].information, data.approvedUser);

        if (index2 !== -1) {
            oldRequest.approvers[index1].information[index2].approvedTime = new Date(Date.now());
            oldRequest.approvers[index1].information[index2].note = data.note;
            switch (data.approveType) {
                case 1: oldRequest.status = 2;
                    break;
                case 2: oldRequest.status = 3;
                    break;
                case 3: oldRequest.status = oldRequest.status == 5 ? 6 : 2;
                    break;
                case 4: oldRequest.status = oldRequest.status == 6 ? 7 : 2;
                    break;
            }
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
    oldRequest.supplier = data.supplier ? data.supplier : oldRequest.supplier;
    oldRequest.refuser = data.refuser ? data.refuser : oldRequest.refuser;
    // Chỉnh sửa người phê duyệt hoặc thêm người phê duyệt mới
    if (data.approvers && data.approvers.length > 0) {
        let counter = 0;
        oldRequest.approvers.forEach((item, index) => {
            if (item.approveType == data.approvers[0].approveType) {
                oldRequest.approvers[index].information = data.approvers[0].information.map((item1) => {
                    return {
                        approver: item1.approver,
                        approvedTime: item1.approvedTime,
                        note: item1.note ? item1.note : null,
                    }
                });
                oldRequest.approvers[index].approveType = item.approveType
                counter++;
            }
        });
        if (counter == 0) {
            oldRequest.approvers.push({
                information: data.approvers[0].information.map((item) => {
                    return {
                        approver: item.approver,
                        approvedTime: item.approvedTime,
                        note: item.note ? item.note : null,
                    }
                }),
                approveType: data.approvers[0].approveType
            });
        }
    }

    // Tự động Thêm người phê duyệt trong đơn hàng vào approvers

    if (oldRequest.requestType == 1 && oldRequest.type == 1 && oldRequest.status == 2) {
        let orderManagerArray = await getAllManagersOfUnitByRole(portal, oldRequest.orderUnit.managers);
        let information = orderManagerArray ? orderManagerArray.map((item) => {
            return {
                approver: item.userId._id,
                approvedTime: null,
                note: item.note ? item.note : null,
            }
        }) : [];
        let data = {
            information: information,
            approveType: 2
        }
        oldRequest.approvers.push(data);
    }
    // Tự động Thêm người phê duyệt trong kho vào approvers
    if (oldRequest.requestType == 1 && oldRequest.type == 1 && oldRequest.status == 6) {
        let stock = await getStock(oldRequest.stock, portal);
        let warehouseManagerArray = await getAllManagersOfUnitByRole(portal, stock.organizationalUnit.managers[0]._id);
        let information = warehouseManagerArray ? warehouseManagerArray.map((item) => {
            return {
                approver: item.userId._id,
                approvedTime: null,
                note: item.note ? item.note : null,
            }
        }) : [];
        let data = {
            information: information,
            approveType: 4
        }
        oldRequest.approvers.push(data);
    }
    await oldRequest.save();

    /* Quản lý thông báo khi chỉnh sửa yêu cầu */
    let approvers = [];
    let notificationText = "";
    let url = "";
    let index = 0;
    if (oldRequest.requestType == 1) {
        switch (oldRequest.status) {
            case 2:
                index = findIndexOfRole(oldRequest.approvers, 2);
                notificationText = "mua hàng";
                url = 'order';
                break;
            case 5:
                index = findIndexOfRole(oldRequest.approvers, 3);
                notificationText = "nhập kho hàng hóa";
                url = 'order';
                break;
            case 6:
                index = findIndexOfRole(oldRequest.approvers, 4);
                notificationText = "nhập kho hàng hóa";
                url = 'stock';
                break;
        }
    }

    if ((oldRequest.requestType == 1 && (oldRequest.type == 2 || oldRequest.type == 3)) || (oldRequest.requestType == 2 && oldRequest.type == 1)) {
        index = findIndexOfRole(oldRequest.approvers, 4);
        notificationText = oldRequest.type == 3 ? "xuất kho hàng hóa" : 'nhập kho hàng hóa';
        url = 'stock';
    }
    if (oldRequest.approvers[index].information.length > 0) {
        oldRequest.approvers[index].information.map((item) => {
            approvers.push(item.approver);
        })
    }

    const date = oldRequest.desiredTime;
    const dataNotification = {
        organizationalUnits: [],
        title: `Xin phê duyệt yêu cầu ${notificationText}`,
        level: "general",
        content: `<p><strong>${user.name}</strong> đã gửi yêu cầu phê duyệt ${notificationText} đến trước ngày <strong>${date}</strong>, <a href="${process.env.WEBSITE}/request-management/${url}">Xem ngay</a></p>`,
        sender: `${user.name}`,
        users: approvers,
        associatedDataObject: {
            dataType: 5,
            description: `<p><strong>${user.name}</strong>: Đã gửi yêu cầu ${notificationText}.</p>`
        }
    };
    NotificationServices.createNotification(portal, portal, dataNotification)

    let request = await ProductRequestManagement(connect(DB_CONNECTION, portal))
        .findById({ _id: oldRequest._id })
        .populate([
            { path: "creator", select: "name" },
            { path: "goods.good", select: "code name baseUnit" },
            { path: "goods.lots.lot" },
            { path: "bill", select: "code" },
            { path: "approvers.information.approver" },
            { path: "refuser.refuser", select: "name" },
            { path: "stock" },
            { path: "manufacturingWork", select: "name" },
            { path: "supplier", select: "name" },
            { path: "orderUnit", select: "name" },
        ]);

    return { request }
}

// Lấy số lượng request

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
    const request1 = await ProductRequestManagement(connect(DB_CONNECTION, portal)).find(options).count();

    options.status = 2;
    const request2 = await ProductRequestManagement(connect(DB_CONNECTION, portal)).find(options).count();

    options.status = 3;
    const request3 = await ProductRequestManagement(connect(DB_CONNECTION, portal)).find(options).count();

    return { request1, request2, request3 }
}
