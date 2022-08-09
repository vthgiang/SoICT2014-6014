const { Bill, Lot, Stock, SalesOrder, PurchaseOrder, BinLocation } = require(`../../../../models`);
const { connect } = require(`../../../../helpers/dbHelper`);
const CustomerService = require('../../../crm/customer/customer.service');
const { updateCrmActionsTaskInfo, updateSearchingCustomerTaskInfo } = require('../../../crm/crmTask/crmTask.service');
const TaskManagementService = require('../../../task/task-management/task.service');
const { getStock } = require(`../../warehouse/stock/stock.service`);
const NotificationServices = require(`../../../notification/notification.service`)
const InventoryServices = require(`../inventory/inventory.service`);
const { getCustomers } = require("../../../crm/customer/customer.service");

exports.getBillsByType = async (query, userId, portal) => {
    var { page, limit, group, managementLocation } = query;
    if (!managementLocation) throw new Error("roles not avaiable");

    //lấy id các kho của role hiện tại
    const stocks = await Stock(connect(DB_CONNECTION, portal)).find({ managementLocation: { $elemMatch: { role: managementLocation } } })
    var arrayStock = [];
    if (stocks && stocks.length > 0) {
        for (let i = 0; i < stocks.length; i++) {
            arrayStock = [...arrayStock, stocks[i]._id];
        }
    }

    if (!page || !limit) {
        let options = { fromStock: { $in: arrayStock } };
        if (query.group) {
            options.group = query.group;
        }
        return await Bill(connect(DB_CONNECTION, portal)).find(options)
            .populate([
                { path: 'creator' },
                { path: 'manufacturingMill' },
                { path: 'manufacturingCommand' },
                { path: 'manufacturingWork' },
                { path: 'stockWorkAssignment.workAssignmentStaffs' },
                { path: 'fromStock' },
                { path: 'toStock' },
                { path: 'customer' },
                { path: 'supplier' },
                { path: 'bill' },
                { path: 'goods.lots.lot' },
                { path: 'goods.unpassed_quality_control_lots.lot' },
                { path: 'goods.good' },
                { path: 'logs.creator' }
            ])
            .sort({ 'updatedAt': 'desc' })
    } else {
        let option = {
            fromStock: arrayStock,
            $or: [
                {
                    creator: userId,
                }
            ]
        };

        if (query.group) {
            option.group = query.group;
        }

        if (query.stock) {
            option.fromStock = query.stock
        }

        if (query.toStock) {
            option.toStock = query.toStock
        }

        if (query.supplier) {
            option.supplier = query.supplier
        }

        if (query.creator) {
            option.creator = query.creator
        }

        if (query.type) {
            option.type = query.type
        }

        if (query.startDate && query.endDate) {
            let date1 = query.startDate.split("-");
            let date2 = query.endDate.split("-");
            let start = new Date(date1[1], date1[0] - 1, 1);
            let end = new Date(date2[1], date2[0], 1);

            option = {
                ...option,
                createdAt: {
                    $gt: start,
                    $lte: end
                }
            }
        } else {
            if (query.startDate) {
                let date1 = query.startDate.split("-");
                let start = new Date(date1[1], date1[0] - 1, 1);

                option = {
                    ...option,
                    createdAt: {
                        $gt: start
                    }
                }
            }
            if (query.endDate) {
                let date2 = query.endDate.split("-");
                let end = new Date(date2[1], date2[0], 1);

                option = {
                    ...option,
                    createdAt: {
                        $lte: end
                    }
                }
            }
        }

        if (query.code) {
            option.code = new RegExp(query.code, "i")
        }

        if (query.status) {
            option.status = query.status
        }

        if (query.customer) {
            option.customer = query.customer
        }

        if (query.toStock) {
            option.toStock = query.toStock
        }

        if (query.supplier) {
            option.supplier = query.supplier
        }

        return await Bill(connect(DB_CONNECTION, portal))
            .paginate(option, {
                page,
                limit,
                populate: [
                    { path: 'creator', select: "_id name email avatar" },
                    { path: 'manufacturingMill' },
                    { path: 'manufacturingCommand' },
                    { path: 'manufacturingWork' },
                    { path: 'stockWorkAssignment.workAssignmentStaffs' },
                    { path: 'fromStock' },
                    { path: 'toStock' },
                    { path: 'customer' },
                    { path: 'supplier' },
                    { path: 'bill' },
                    { path: 'goods.lots.lot' },
                    { path: 'goods.unpassed_quality_control_lots.lot' },
                    { path: 'goods.good' },
                    { path: 'logs.creator', select: "_id name email avatar" }
                ],
                sort: { 'updatedAt': 'desc' }
            })
    }
}

exports.getAllBillsByGroup = async (query, userId, portal) => {
    var { group, managementLocation } = query;
    if (!managementLocation) throw new Error("roles not avaiable");

    //lấy id các kho của role hiện tại
    const stocks = await Stock(connect(DB_CONNECTION, portal)).find({ managementLocation: { $elemMatch: { role: managementLocation } } })
    var arrayStock = [];
    if (stocks && stocks.length > 0) {
        for (let i = 0; i < stocks.length; i++) {
            arrayStock = [...arrayStock, stocks[i]._id];
        }
    }

    let options = { fromStock: { $in: arrayStock } };
    if (group) {
        options.group = group;
    }
    return await Bill(connect(DB_CONNECTION, portal)).find(options).select('status group')
}

exports.getBillByGood = async (query, portal) => {
    const { good, limit, page } = query;

    let option = { goods: { $elemMatch: { good: good } }, $or: [{ group: '1' }, { group: '2' }], status: '2' };

    if (query.startDate && query.endDate) {
        let date1 = query.startDate.split("-");
        let date2 = query.endDate.split("-");
        let start = new Date(date1[1], date1[0] - 1, 1);
        let end = new Date(date2[1], date2[0], 1);

        option = {
            ...option,
            createdAt: {
                $gt: start,
                $lte: end
            }
        }
    } else {
        if (query.startDate) {
            let date1 = query.startDate.split("-");
            let start = new Date(date1[1], date1[0] - 1, 1);

            option = {
                ...option,
                createdAt: {
                    $gt: start
                }
            }
        }
        if (query.endDate) {
            let date2 = query.endDate.split("-");
            let end = new Date(date2[1], date2[0], 1);

            option = {
                ...option,
                createdAt: {
                    $lte: end
                }
            }
        }
    }

    return await Bill(connect(DB_CONNECTION, portal))
        .paginate(option, {
            page,
            limit,
            populate: [
                { path: 'fromStock' }
            ],
            sort: { 'updatedAt': 'desc' }
        })
}

exports.getDetailBill = async (id, portal) => {
    return await Bill(connect(DB_CONNECTION, portal)).findById(id)
        .populate([
            { path: 'creator', select: "_id name email avatar" },
            { path: 'manufacturingMill' },
            { path: 'manufacturingCommand' },
            { path: 'manufacturingWork' },
            { path: 'stockWorkAssignment.workAssignmentStaffs' },
            { path: 'fromStock' },
            { path: 'toStock' },
            { path: 'customer' },
            { path: 'supplier' },
            { path: 'bill' },
            { path: 'goods.lots.lot' },
            { path: 'goods.unpassed_quality_control_lots.lot' },
            { path: 'goods.good' },
            { path: 'logs.creator', select: "_id name email avatar" }
        ])
}


exports.getBillsByStatus = async (query, portal) => {
    const { group, status, fromStock, type } = query;
    return await Bill(connect(DB_CONNECTION, portal)).find({ group, status, fromStock })
        .populate([
            { path: 'creator', select: "_id name email avatar" },
            { path: 'approvers.approver', select: "_id name email avatar" },
            { path: 'manufacturingMill' },
            { path: 'manufacturingCommand' },
            { path: 'manufacturingWork' },
            { path: 'stockWorkAssignment.workAssignmentStaffs' },
            { path: 'fromStock' },
            { path: 'toStock' },
            { path: 'customer' },
            { path: 'supplier' },
            { path: 'bill' },
            { path: 'goods.lots.lot' },
            { path: 'goods.unpassed_quality_control_lots.lot' },
            { path: 'goods.good' },
            { path: 'logs.creator', select: "_id name email avatar" }
        ])
}

function convertDateTime(date, time) {
    let splitter = date.split("-");
    let strDateTime = `${splitter[2]}/${splitter[1]}/${splitter[0]} ${time}`;
    return new Date(strDateTime);
}

exports.createBill = async (user, data, portal) => {
    var logs = [];
    let log = {};
    log.creator = user._id;
    log.createAt = new Date(Date.now());
    log.title = "Tạo phiếu";
    log.versions = "versions 1";
    logs = [...logs, log];
    let query = {
        fromStock: data.fromStock,
        group: data.group,
        bill: data.bill,
        toStock: data.toStock ? data.toStock : null,
        code: data.code,
        type: data.type,
        status: data.status,
        users: data.users,
        creator: user._id,
        customer: data.customer ? data.customer : null,
        supplier: data.supplier ? data.supplier : null,
        receiver: {
            name: data.name,
            phone: data.phone,
            email: data.email,
            address: data.address,
        },
        description: data.description,
        sourceType: data.sourceType ? data.sourceType : null,
        goods: data.goods ? data.goods.map(item => {
            return {
                good: item.good,
                quantity: item.quantity,
                returnQuantity: item.returnQuantity,
                realQuantity: item.realQuantity,
                damagedQuantity: item.damagedQuantity,
                description: item.description,
                lots: item.lots ? item.lots.map(x => {
                    return {
                        lot: x.lot,
                        quantity: x.quantity,
                        returnQuantity: x.returnQuantity,
                        damagedQuantity: x.damagedQuantity,
                        realQuantity: x.realQuantity,
                        note: x.note
                    }
                }) : undefined
            }
        }) : undefined,
        manufacturingMill: data.manufacturingMill,
        manufacturingCommand: data.manufacturingCommand,
        manufacturingWork: data.manufacturingWork ? data.manufacturingWork : null,
        stockWorkAssignment: data.dataStockWorkAssignment ? data.dataStockWorkAssignment.map(item => {
            return {
                workAssignmentStaffs: item.workAssignmentStaffs,
                nameField: item.nameField,
                startDate: item.startDate.split("-").reverse().join("-"),
                endDate: item.endDate.split("-").reverse().join("-"),
                startTime: item.startTime,
                endTime: item.endTime,
            }
        }) : [],
        logs: logs
    }

    const bill = await Bill(connect(DB_CONNECTION, portal)).create(query);

    //Thêm vào đơn bán hàng trường bill xuất bán sản phẩm
    if (data.salesOrderId) {
        let salesOrder = await SalesOrder(connect(DB_CONNECTION, portal)).findById({ _id: data.salesOrderId });
        salesOrder.bill = bill._id; //Gắn bill vào đơn hàng
        salesOrder.status = 5; //Thay đổi trạng thái đơn là yêu cầu xuất kho
        salesOrder.save();
    }

    //Thêm vào đơn mua nguyên vật liệu trường bill nhập kho nguyên vật liệu
    if (data.purchaseOrderId) {
        let purchaseOrder = await PurchaseOrder(connect(DB_CONNECTION, portal)).findById({ _id: data.purchaseOrderId });
        purchaseOrder.bill = bill._id; //Gắn bill vào đơn hàng
        purchaseOrder.status = 3; //Thay đổi trạng thái đơn là yêu cầu nhập kho
        purchaseOrder.save();
    }

    // Phần phục vụ cho việc tạo mới công việc cho nhân viên kho khi tạo phiếu
    if (data.dataStockWorkAssignment) {
        let stock = await getStock(data.fromStock, portal);
        // Tạo công việc cha, công việc quản lý
        let body = {
            accountableEmployees: [user._id],
            responsibleEmployees: data.dataStockWorkAssignment[0].workAssignmentStaffs,
            consultedEmployees: [user._id].concat(data.dataStockWorkAssignment[1].workAssignmentStaffs),
            informedEmployees: data.dataStockWorkAssignment[1].workAssignmentStaffs.concat(data.dataStockWorkAssignment[2].workAssignmentStaffs),
            creator: user._id,
            endDate: convertDateTime(data.dataStockWorkAssignment[0].endDate, data.dataStockWorkAssignment[0].endTime),
            startDate: convertDateTime(data.dataStockWorkAssignment[0].startDate, data.dataStockWorkAssignment[0].startTime),
            name: data.dataStockWorkAssignment[0].nameField,
            priority: 3,
            parent: null,
            collaboratedWithOrganizationalUnits: [],
            organizationalUnit: stock.organizationalUnit,
            description: data.dataStockWorkAssignment[0].nameField,
            imgs: null,
            quillDescriptionDefault: "",
            tags: [],
            taskProject: "",
            taskTemplate: "",
        }
        var parentTask = await TaskManagementService.createTask(portal, body);
        // Các công việc con
        for (let i = 1; i < data.dataStockWorkAssignment.length; i++) {
            let consultedEmployees = [];
            let informedEmployees = [];
            if (i == 1) {
                consultedEmployees = data.dataStockWorkAssignment[0].workAssignmentStaffs;
                informedEmployees = data.dataStockWorkAssignment[0].workAssignmentStaffs.concat(data.dataStockWorkAssignment[2].workAssignmentStaffs);
            } else {
                consultedEmployees = data.dataStockWorkAssignment[0].workAssignmentStaffs.concat(data.dataStockWorkAssignment[1].workAssignmentStaffs);
                informedEmployees = data.dataStockWorkAssignment[0].workAssignmentStaffs.concat(data.dataStockWorkAssignment[1].workAssignmentStaffs);
            }
            let body = {
                accountableEmployees: data.dataStockWorkAssignment[0].workAssignmentStaffs,
                responsibleEmployees: data.dataStockWorkAssignment[i].workAssignmentStaffs,
                consultedEmployees: consultedEmployees,
                informedEmployees: informedEmployees,
                creator: user._id,
                endDate: convertDateTime(data.dataStockWorkAssignment[i].endDate, data.dataStockWorkAssignment[i].endTime),
                startDate: convertDateTime(data.dataStockWorkAssignment[i].startDate, data.dataStockWorkAssignment[i].startTime),
                name: data.dataStockWorkAssignment[i].nameField,
                priority: 3,
                parent: parentTask.task._id,
                collaboratedWithOrganizationalUnits: [],
                organizationalUnit: stock.organizationalUnit,
                description: data.dataStockWorkAssignment[i].nameField,
                imgs: null,
                quillDescriptionDefault: "",
                tags: [],
                taskProject: "",
                taskTemplate: "",
            }
            await TaskManagementService.createTask(portal, body);
        }
        // Gửi thông báo đến những người được assign công việc
        data.dataStockWorkAssignment.forEach(item => {
            const dataNotification = {
                organizationalUnits: [],
                title: `Bạn có công việc mới được tạo`,
                level: "general",
                content: `<p>Bạn có công việc mới: ${item.nameField} được tạo bởi: <strong>${user.name}</strong> từ <strong>${item.startTime} ngày ${item.startDate}</strong> 
                đến <strong>${item.endTime} ngày ${item.endDate}</strong>, <a href="${process.env.WEBSITE}/task-management">Xem ngay</a></p>`,
                sender: `${user.name}`,
                users: item.workAssignmentStaffs,
                associatedDataObject: {
                    dataType: 1,
                    description: `<p><strong>${user.name}</strong>: Tạo công việc trong kho mới.</p>`
                }
            };
            NotificationServices.createNotification(portal, portal, dataNotification)
        })
    }
    return await Bill(connect(DB_CONNECTION, portal))
        .findById(bill._id)
        .populate([
            { path: 'creator', select: "_id name email avatar" },
            { path: 'manufacturingMill' },
            { path: 'manufacturingCommand' },
            { path: 'manufacturingWork' },
            { path: 'stockWorkAssignment.workAssignmentStaffs' },
            { path: 'fromStock' },
            { path: 'toStock' },
            { path: 'customer' },
            { path: 'supplier' },
            { path: 'bill' },
            { path: 'goods.lots.lot' },
            { path: 'goods.unpassed_quality_control_lots.lot' },
            { path: 'goods.good' },
            { path: 'logs.creator', select: "_id name email avatar" }
        ])
}


function formatDataLots(lot, stock, billId, typeBill, goodId, type, passedQualityControl) {
    let data = {
        lots: [lot],
        stock: stock,
        bill: billId,
        typeBill: typeBill,
        good: goodId,
        type: type,
        passedQualityControl: passedQualityControl
    }
    return data;
}

function formatDataBinLocations(lot, stock) {
    let binLocationInfo = lot.binLocations ? lot.binLocations.map(item => {
        return {
            binLocation: {
                _id: item.id,
            },
            quantity: item.quantity,
        }
    }) : [];
    let stocks = {
        binLocations: binLocationInfo,
        stock: {
            _id: stock._id,
        },
        quantity: lot.quantity
    }
    let data = {
        stocks: [stocks]
    }
    return data;
}

function formatDataLotsForBillTake(lot, stock) {
    let binLocationInfo = lot.binLocations ? lot.binLocations.map(item => {
        return {
            binLocation: {
                _id: item.binLocation,
            },
            quantity: item.realQuantity,
        }
    }) : [];
    let stocks = {
        binLocations: binLocationInfo,
        stock: {
            _id: stock._id,
        },
        quantity: lot.realQuantity,
    }
    let data = {
        quantity: lot.realQuantity,
        originalQuantity: lot.quantity,
        stocks: [stocks]
    }
    return data;
}

exports.editBill = async (id, userId, data, portal, companyId) => {
    let bill = await Bill(connect(DB_CONNECTION, portal)).findById(id);
    bill.fromStock = bill.fromStock;
    bill.toStock = data.toStock ? data.toStock : bill.toStock;
    bill.group = bill.group;
    bill.bill = bill.bill;
    bill.code = bill.code;
    bill.type = bill.type;
    bill.users = data.users ? data.users : bill.users;
    bill.creator = data.creator ? data.creator : bill.creator;
    bill.customer = data.customer ? data.customer : bill.customer;
    bill.supplier = data.supplier ? data.supplier : bill.supplier;
    bill.manufacturingMill = data.manufacturingMill ? data.manufacturingMill : bill.manufacturingMill;
    bill.manufacturingCommand = data.manufacturingCommand ? data.manufacturingCommand : bill.manufacturingCommand;
    bill.receiver = {
        name: data.name ? data.name : bill.receiver.name,
        phone: data.phone ? data.phone : bill.receiver.phone,
        email: data.email ? data.email : bill.receiver.email,
        address: data.address ? data.address : bill.receiver.address
    };
    bill.description = data.description ? data.description : bill.description;
    bill.sourceType = data.sourceType ? data.sourceType : bill.sourceType;
    bill.goods = data.goods ? data.goods.map(item => {
        return {
            good: item.good,
            quantity: item.quantity,
            returnQuantity: item.returnQuantity,
            realQuantity: item.realQuantity ? item.realQuantity : item.quantity,
            // damagedQuantity: item.quantity - item.realQuantity,
            description: item.description,
            lots: item.lots.map(x => {
                let rfid = {
                    rfidCode: x.rfidCode,
                    quantity: x.rfidQuantity
                }
                return {
                    lot: x.lot,
                    quantity: x.quantity,
                    returnQuantity: x.returnQuantity,
                    // damagedQuantity: x.damagedQuantity ? x.damagedQuantity : 0,
                    realQuantity: x.realQuantity,
                    note: x.note,
                    code: x.code,
                    expirationDate: x.expirationDate,
                    rfid: rfid,
                    binLocations: x.binLocations ? x.binLocations.map(y => {
                        return {
                            binLocation: y.id,
                            quantity: y.quantity,
                            name: y.name,
                            realQuantity: y.realQuantity ? y.realQuantity : 0,
                            status: y.status,
                        }
                    }
                    ) : []
                }
            }),
            unpassed_quality_control_lots: item.unpassed_quality_control_lots ? item.unpassed_quality_control_lots.map(x => {
                let rfid = {
                    rfidCode: x.rfidCode,
                    quantity: x.rfidQuantity
                }
                return {
                    lot: x.lot,
                    quantity: x.quantity,
                    returnQuantity: x.returnQuantity,
                    // damagedQuantity: x.damagedQuantity,
                    realQuantity: x.realQuantity,
                    note: x.note,
                    code: x.code,
                    expirationDate: x.expirationDate,
                    rfid: rfid,
                    binLocations: x.binLocations ? x.binLocations.map(y => {
                        return {
                            binLocation: y.id,
                            quantity: y.quantity,
                            name: y.name,
                        }
                    }
                    ) : []
                }
            }) : []
        }
    }) : bill.goods;

    bill.status = data.status ? data.status : bill.status;
    bill.manufacturingWork = data.manufacturingWork ? data.manufacturingWork : bill.manufacturingWork;
    bill.stockWorkAssignment = data.dataStockWorkAssignment ? data.dataStockWorkAssignment.map(item => {
        return {
            workAssignmentStaffs: item.workAssignmentStaffs,
            nameField: item.nameField,
            startDate: item.startDate,
            endDate: item.endDate,
            startTime: item.startTime,
            endTime: item.endTime,
        }
    }) : bill.stockWorkAssignment;
    bill.statusSteps = data.statusSteps ? data.statusSteps : bill.statusArray;
    var log = {};
    log.creator = userId;
    log.createAt = new Date(Date.now());
    log.title = data.type;
    log.versions = "versions " + (bill.logs.length + 1);
    bill.logs = [...bill.logs, log];

    /*Tạo lô hàng và lưu hàng vào trong kho khi hoàn tất công việc trong phiếu*/
    if (data.statusAll && data.statusAll == 2) {
        bill.status = '2';
        // phiếu nhập kho
        if (bill.group === '1') {
            // chuyển trạng thái sang đã hoàn thành
            //Tạo lô hàng
            data.goods.forEach(item => {
                if (item.lots && item.lots.length > 0) {
                    item.lots.forEach(async x => {
                        let dataLots = formatDataLots(x, bill.fromStock, bill.bill, bill.group, item.good._id, item.good.type, 1);
                        let lot = await InventoryServices.createOrUpdateLots(dataLots, portal);
                        //Lưu hàng vào kho
                        let dataBinLocations = formatDataBinLocations(x, bill.fromStock);
                        await InventoryServices.editLot(lot[0]._id, dataBinLocations, portal);
                    })
                }
                if (item.unpassed_quality_control_lots && item.unpassed_quality_control_lots.length > 0) {
                    item.unpassed_quality_control_lots.forEach(async x => {
                        let dataUnpassedLots = formatDataLots(x, bill.fromStock, bill.bill, bill.group, item.good._id, item.good.type, 0);
                        let lot = await InventoryServices.createOrUpdateLots(dataUnpassedLots, portal);
                        //Lưu hàng vào kho
                        let dataBinLocations = formatDataBinLocations(x, bill.fromStock);
                        await InventoryServices.editLot(lot[0]._id, dataBinLocations, portal);
                    })
                }
            })
        }
        // phiếu xuất kho
        if (data.group === '2') {
            if (data.goods && data.goods.length > 0) {
                for (let i = 0; i < data.goods.length; i++) {
                    if (data.goods[i].lots && data.goods[i].lots.length > 0) {
                        for (let j = 0; j < data.goods[i].lots.length; j++) {
                            var quantity = data.goods[i].lots[j].quantity;
                            let lotId = data.goods[i].lots[j].lot._id;
                            let lot = await Lot(connect(DB_CONNECTION, portal)).findById(lotId);
                            lot.quantity = Number(lot.quantity) - Number(quantity);
                            if (lot.stocks && lot.stocks.length > 0) {
                                for (let k = 0; k < lot.stocks.length; k++) {
                                    if (lot.stocks[k].stock.toString() === data.fromStock._id.toString()) {
                                        lot.stocks[k].quantity = Number(lot.stocks[k].quantity) - Number(quantity);
                                        if (lot.stocks[k].binLocations.length > 0) {
                                            for (let j = 0; j < lot.stocks[k].binLocations.length; j++) {
                                                let binLocation = await BinLocation(connect(DB_CONNECTION, portal)).findById(lot.stocks[k].binLocations[j].binLocation._id)
                                                let number = lot.stocks[k].binLocations[j].quantity;
                                                if (binLocation.enableGoods.length > 0) {
                                                    for (let k = 0; k < binLocation.enableGoods.length; k++) {
                                                        if (binLocation.enableGoods[k].good._id.toString() === lot.good._id.toString()) {
                                                            if (binLocation.enableGoods[k].contained !== null) {
                                                                binLocation.enableGoods[k].contained = Number(binLocation.enableGoods[k].contained) - Number(number);
                                                                await binLocation.save();
                                                            } else {
                                                                binLocation.enableGoods[k].contained = 0 - Number(number);
                                                                await binLocation.save();
                                                            }
                                                        }

                                                    }
                                                }
                                            }
                                        }
                                        lot.stocks[k].binLocations = [];
                                    }
                                }
                            }
                            lot.stocks[0].binLocations = data.goods[i].lots[j].binLocations;
                            let lotLog = {};
                            lotLog.bill = bill._id;
                            lotLog.quantity = quantity;
                            lotLog.inventory = lot.quantity;
                            lotLog.description = data.goods[i].description ? data.goods[i].description : '';
                            lotLog.type = bill.group;
                            lotLog.createdAt = bill.updatedAt;
                            lotLog.stock = data.fromStock;
                            lot.lotLogs = [...lot.lotLogs, lotLog];
                            await lot.save();
                            let dataBinLocations = formatDataBinLocations(data.goods[i].lots[j], data.fromStock);
                            await InventoryServices.loadingGoodIntoBinLocation(dataBinLocations, lot, portal);
                        }
                    }
                }
            }
        }
        // phiếu trả hàng
        if (bill.group === '3') {
            //Tạo lô hàng không đạt kiểm định khi trả hàng
            data.goods.forEach(item => {
                if (item.unpassed_quality_control_lots && item.unpassed_quality_control_lots.length > 0) {
                    item.unpassed_quality_control_lots.forEach(async x => {
                        let dataUnpassedLots = formatDataLots(x, bill.fromStock, bill.bill, "1", item.good._id, item.good.type, 0);
                        let lot = await InventoryServices.createOrUpdateLots(dataUnpassedLots, portal);
                        //Lưu hàng vào kho
                        let dataBinLocations = formatDataBinLocations(x, bill.fromStock);
                        await InventoryServices.editLot(lot[0]._id, dataBinLocations, portal);
                    })
                }
            })
            if (data.goods && data.goods.length > 0) {
                for (let i = 0; i < data.goods.length; i++) {
                    if (data.goods[i].lots && data.goods[i].lots.length > 0) {
                        for (let j = 0; j < data.goods[i].lots.length; j++) {
                            var passedReturnQuantity = data.goods[i].lots[j].passedQuantity;
                            if (passedReturnQuantity > 0) {
                                let lotId = data.goods[i].lots[j].lot._id;
                                let lot = await Lot(connect(DB_CONNECTION, portal)).findById(lotId);
                                lot.quantity = Number(lot.quantity) + Number(passedReturnQuantity);
                                if (lot.stocks && lot.stocks.length > 0) {
                                    for (let k = 0; k < lot.stocks.length; k++) {
                                        if (lot.stocks[k].stock.toString() === data.fromStock._id.toString()) {
                                            lot.stocks[k].quantity = Number(lot.stocks[k].quantity) + Number(passedReturnQuantity);
                                            // lot.stocks[k].binLocations = [];
                                        }
                                    }
                                }
                                let dataBinLocations = formatDataBinLocations(data.goods[i].lots[j], data.fromStock);
                                await InventoryServices.loadingGoodIntoBinLocation(dataBinLocations, lot, portal);
                                data.goods[i].lots[j].binLocations.forEach(bin => {
                                    lot.stocks[0].binLocations.push(bin);
                                })
                                let lotLog = {};
                                lotLog.bill = bill._id;
                                lotLog.quantity = passedReturnQuantity;
                                lotLog.inventory = lot.quantity;
                                lotLog.description = data.goods[i].description ? data.goods[i].description : '';
                                lotLog.type = bill.group;
                                lotLog.createdAt = bill.updatedAt;
                                lotLog.stock = data.fromStock;
                                lot.lotLogs = [...lot.lotLogs, lotLog];
                                await lot.save();
                            }
                        }
                    }
                }
            }
        }
        //phiếu kiểm kê
        if (bill.group === '4') {
            //Chỉnh sửa lô hàng khi kiểm kê
            data.goods.forEach(item => {
                if (item.lots && item.lots.length > 0) {
                    item.lots.forEach(async x => {
                        let dataLots = formatDataLotsForBillTake(x, bill.fromStock);
                        await InventoryServices.editLot(x.lot, dataLots, portal);
                    })
                }
            })
        }
    }
    await bill.save();
    //--------------------PHẦN PHỤC VỤ CHO QUẢN LÝ ĐƠN HÀNG------------------------
    if (parseInt(bill.status) === 5) {//Nếu bill đã hoàn thành
        let purchaseOrder = await PurchaseOrder(connect(DB_CONNECTION, portal)).findOne({ bill: bill._id.toString() })
        if (purchaseOrder) {
            purchaseOrder.status = 4;
            purchaseOrder.save()
        }

        //Cập nhật trạng thái đơn mua hàng là đà hoàn thành khi bill xuất kho hoàn thành
        let salesOrder = await SalesOrder(connect(DB_CONNECTION, portal)).findOne({
            bill: bill._id.toString()
        });
        if (salesOrder) {
            salesOrder.status = 7;
            salesOrder.save();
            // Them rankPoint cho khach hang
            //id, userId, data, portal, companyId
            await CustomerService.addRankPoint(portal, companyId, salesOrder.customer, { paymentAmount: salesOrder.paymentAmount }, userId)
            // cập nhật công việc chăm sóc khách hàng
            const customer = CustomerService.getCustomerById(salesOrder.customer);

            //role đang bị sai
            updateCrmActionsTaskInfo(portal, companyId, customer.owner._id, '60da891d418c1834643ab74a');
            updateSearchingCustomerTaskInfo(portal, companyId, customer.owner._id, '60da891d418c1834643ab74a');

            //Cập nhật số xu cho khách hàng
            let customerPoint = await CustomerService.getCustomerPoint(portal, companyId, salesOrder.customer);
            if (customerPoint && salesOrder.allCoin) {
                await CustomerService.editCustomerPoint(portal, companyId, customerPoint._id, { point: salesOrder.allCoin + customerPoint.point }, userId)
            }
        }
    } else if (parseInt(bill.status) === 7) {//Nếu bill bị hủy
        let purchaseOrder = await PurchaseOrder(connect(DB_CONNECTION, portal)).findOne({ bill: bill._id.toString() })
        if (purchaseOrder) {
            purchaseOrder.status = 5;
            purchaseOrder.save()
        }

        //Cập nhật trạng thái đơn mua hàng là đã hủy
        let salesOrder = await SalesOrder(connect(DB_CONNECTION, portal)).findOne({
            bill: bill._id.toString()
        });

        if (salesOrder) {
            salesOrder.status = 8;
            salesOrder.save();
            //Cập nhật số xu cho khách hàng
            let customerPoint = await CustomerService.getCustomerPoint(portal, companyId, salesOrder.customer);
            if (customerPoint && salesOrder.coin) {
                await CustomerService.editCustomerPoint(portal, companyId, customerPoint._id, { point: salesOrder.coin + customerPoint.point }, userId)
            }
        }
    }
    //------------------KẾT THÚC PHẦN PHỤC VỤ CHO QUẢN LÝ ĐƠN HÀNG-----------------

    // Nếu trạng thái chuyển từ đang thực hiện sang trạng thái đã hoàn thành thì
    //Nếu là phiếu xuất kho hệ thống cập nhật lại số lượng tồn kho

    // if (data.group === '1' && data.type === '1' && data.oldStatus === '4' && data.status === '5') {
    //     if (data.goods && data.goods.length > 0) {
    //         for (let i = 0; i < data.goods.length; i++) {
    //             if (data.goods[i].lots && data.goods[i].lots.length > 0) {
    //                 for (let j = 0; j < data.goods[i].lots.length; j++) {
    //                     var quantity = data.goods[i].lots[j].quantity;
    //                     let lotId = data.goods[i].lots[j].lot;
    //                     let lot = await Lot(connect(DB_CONNECTION, portal)).findById(lotId);
    //                     let stock = {};
    //                     stock.stock = data.fromStock;
    //                     stock.quantity = quantity;
    //                     stock.binLocation = [];
    //                     lot.stocks = [...lot.stocks, stock];
    //                     let lotLog = {};
    //                     lotLog.bill = bill._id;
    //                     lotLog.quantity = quantity;
    //                     lotLog.description = data.goods[i].description ? data.goods[i].description : '';
    //                     lotLog.type = bill.type;
    //                     lotLog.createdAt = bill.updatedAt;
    //                     lotLog.stock = data.fromStock;
    //                     lot.lotLogs = [...lot.lotLogs, lotLog];
    //                     await lot.save();
    //                 }
    //             }
    //         }
    //     }

    // }

    // if (data.group === '4' && data.oldStatus === '4' && data.status === '5') {
    //     if (data.goods && data.goods.length > 0) {
    //         for (let i = 0; i < data.goods.length; i++) {
    //             if (data.goods[i].lots && data.goods[i].lots.length > 0) {
    //                 for (let j = 0; j < data.goods[i].lots.length; j++) {
    //                     var damagedQuantity = data.goods[i].lots[j].damagedQuantity;
    //                     if (damagedQuantity !== 0) {
    //                         let lotId = data.goods[i].lots[j].lot._id;
    //                         let lot = await Lot(connect(DB_CONNECTION, portal)).findById(lotId);
    //                         lot.quantity = Number(lot.quantity) + Number(damagedQuantity);
    //                         if (lot.stocks && lot.stocks.length > 0) {
    //                             for (let k = 0; k < lot.stocks.length; k++) {
    //                                 if (lot.stocks[k].stock.toString() === data.fromStock.toString()) {
    //                                     lot.stocks[k].quantity = Number(lot.stocks[k].quantity) + Number(damagedQuantity);
    //                                 }
    //                             }
    //                         }
    //                         let lotLog = {};
    //                         lotLog.bill = bill._id;
    //                         lotLog.quantity = damagedQuantity;
    //                         lotLog.description = data.goods[i].description ? data.goods[i].description : '';
    //                         lotLog.type = bill.type;
    //                         lotLog.createdAt = bill.updatedAt;
    //                         lotLog.stock = data.fromStock;
    //                         lot.lotLogs = [...lot.lotLogs, lotLog];
    //                         await lot.save();
    //                     }

    //                 }
    //             }
    //         }
    //     }
    // }

    // Nếu trạng thái đơn chuyển từ đã hoàn thành sang đã hủy
    // if (data.oldStatus === '5' && data.status === '7') {
    //Phiếu xuất kho
    // if (data.group === '2') {
    //     if (data.oldGoods && data.oldGoods.length > 0) {
    //         for (let i = 0; i < data.oldGoods.length; i++) {
    //             if (data.oldGoods[i].lots && data.oldGoods[i].lots.length > 0) {
    //                 for (let j = 0; j < data.oldGoods[i].lots.length; j++) {
    //                     var quantity = data.oldGoods[i].lots[j].quantity;
    //                     let lotId = data.oldGoods[i].lots[j].lot._id;
    //                     let lot = await Lot(connect(DB_CONNECTION, portal)).findById(lotId);
    //                     lot.quantity = Number(lot.quantity) + Number(quantity);
    //                     if (lot.stocks && lot.stocks.length > 0) {
    //                         for (let k = 0; k < lot.stocks.length; k++) {
    //                             if (lot.stocks[k].stock.toString() === data.fromStock.toString()) {
    //                                 lot.stocks[k].quantity = Number(lot.stocks[k].quantity) + Number(quantity);
    //                             }
    //                         }
    //                     }
    //                     lot.lotLogs = lot.lotLogs.filter(item => item.bill !== bill._id);
    //                     await lot.save();
    //                 }
    //             }
    //         }
    //     }
    // }

    //Nếu là phiếu trả hàng
    // if (data.group === '3') {
    //     if (data.oldGoods && data.oldGoods.length > 0) {
    //         for (let i = 0; i < data.oldGoods.length; i++) {
    //             if (data.oldGoods[i].lots && data.oldGoods[i].lots.length > 0) {
    //                 for (let j = 0; j < data.oldGoods[i].lots.length; j++) {
    //                     var returnQuantity = data.oldGoods[i].lots[j].returnQuantity;
    //                     if (returnQuantity > 0) {
    //                         let lotId = data.oldGoods[i].lots[j].lot._id;
    //                         let lot = await Lot(connect(DB_CONNECTION, portal)).findById(lotId);
    //                         lot.quantity = Number(lot.quantity) - Number(returnQuantity);
    //                         if (lot.stocks && lot.stocks.length > 0) {
    //                             for (let k = 0; k < lot.stocks.length; k++) {
    //                                 if (lot.stocks[k].stock.toString() === data.fromStock.toString()) {
    //                                     lot.stocks[k].quantity = Number(lot.stocks[k].quantity) - Number(returnQuantity);
    //                                 }
    //                             }
    //                         }
    //                         lot.lotLogs = lot.lotLogs.filter(item => item.bill !== bill._id);
    //                         await lot.save();
    //                     }

    //                 }
    //             }
    //         }
    //     }
    // }

    //     if (data.group === '4') {
    //         if (data.oldGoods && data.oldGoods.length > 0) {
    //             for (let i = 0; i < data.oldGoods.length; i++) {
    //                 if (data.oldGoods[i].lots && data.oldGoods[i].lots.length > 0) {
    //                     for (let j = 0; j < data.oldGoods[i].lots.length; j++) {
    //                         var damagedQuantity = data.oldGoods[i].lots[j].damagedQuantity;
    //                         if (damagedQuantity !== 0) {
    //                             let lotId = data.oldGoods[i].lots[j].lot._id;
    //                             let lot = await Lot(connect(DB_CONNECTION, portal)).findById(lotId);
    //                             lot.quantity = Number(lot.quantity) - Number(damagedQuantity);
    //                             if (lot.stocks && lot.stocks.length > 0) {
    //                                 for (let k = 0; k < lot.stocks.length; k++) {
    //                                     if (lot.stocks[k].stock.toString() === data.fromStock.toString()) {
    //                                         lot.stocks[k].quantity = Number(lot.stocks[k].quantity) - Number(damagedQuantity);
    //                                     }
    //                                 }
    //                             }
    //                             lot.lotLogs = lot.lotLogs.filter(item => item.bill !== bill._id);
    //                             await lot.save();
    //                         }

    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }

    // if (data.group === '5') {
    //chuyển trạng thái từ đã phê duyệt sang thực hiện
    //Thực hiện việc xuất kho của kho xuất
    // if (data.oldStatus === '2' && data.status === '3') {
    //     if (data.goods && data.goods.length > 0) {
    //         for (let i = 0; i < data.goods.length; i++) {
    //             if (data.goods[i].lots && data.goods[i].lots.length > 0) {
    //                 for (let j = 0; j < data.goods[i].lots.length; j++) {
    //                     var quantity = data.goods[i].lots[j].quantity;
    //                     let lotId = data.goods[i].lots[j].lot._id;
    //                     let lot = await Lot(connect(DB_CONNECTION, portal)).findById(lotId);
    //                     lot.quantity = Number(lot.quantity) - Number(quantity);
    //                     if (lot.stocks && lot.stocks.length > 0) {
    //                         for (let k = 0; k < lot.stocks.length; k++) {
    //                             if (lot.stocks[k].stock.toString() === data.fromStock.toString()) {
    //                                 lot.stocks[k].quantity = Number(lot.stocks[k].quantity) - Number(quantity);
    //                             }
    //                         }
    //                     }
    //                     await lot.save();
    //                 }
    //             }
    //         }
    //     }
    // }
    // chuyển trạng thái từ đang thực hiện sang đã hoàn thành
    // thực hiện việc nhập kho và lưu thông tin
    // if (data.oldStatus === '4' && data.status === '5') {
    //     if (data.goods && data.goods.length > 0) {
    //         for (let i = 0; i < data.goods.length; i++) {
    //             if (data.goods[i].lots && data.goods[i].lots.length > 0) {
    //                 for (let j = 0; j < data.goods[i].lots.length; j++) {
    //                     var quantity = data.goods[i].lots[j].quantity;
    //                     let lotId = data.goods[i].lots[j].lot._id;
    //                     let lot = await Lot(connect(DB_CONNECTION, portal)).findById(lotId);
    //                     lot.quantity = Number(lot.quantity) + Number(quantity);
    //                     if (lot.stocks && lot.stocks.length > 0) {
    //                         let check = 0;
    //                         for (let k = 0; k < lot.stocks.length; k++) {
    //                             if (lot.stocks[k].stock.toString() === data.toStock.toString()) {
    //                                 lot.stocks[k].quantity = Number(lot.stocks[k].quantity) + Number(quantity);
    //                                 check = 1;
    //                             }
    //                         }
    //                         if (check === 0) {
    //                             let stock = {};
    //                             stock.stock = data.toStock;
    //                             stock.quantity = quantity;
    //                             lot.stocks = [...lot.stocks, stock];
    //                         }
    //                     }
    //                     let lotLog = {};
    //                     lotLog.bill = bill._id;
    //                     lotLog.quantity = quantity;
    //                     lotLog.description = data.goods[i].description ? data.goods[i].description : '';
    //                     lotLog.type = bill.type;
    //                     lotLog.createdAt = bill.updatedAt;
    //                     lotLog.stock = data.fromStock;
    //                     lotLog.toStock = data.toStock;
    //                     lot.lotLogs = [...lot.lotLogs, lotLog];
    //                     await lot.save();
    //                 }
    //             }
    //         }
    //     }
    // }

    //chuyển trạng thái từ đang thực hiện sang trạng thái đã hủy
    // Thực hiện lại việc nhập kho, trả lại thông tin cho từng lô hàng
    //     if (data.oldStatus === '1' && data.status === '3') {
    //         if (data.goods && data.goods.length > 0) {
    //             for (let i = 0; i < data.goods.length; i++) {
    //                 if (data.goods[i].lots && data.goods[i].lots.length > 0) {
    //                     for (let j = 0; j < data.goods[i].lots.length; j++) {
    //                         var quantity = data.goods[i].lots[j].quantity;
    //                         let lotId = data.goods[i].lots[j].lot._id;
    //                         let lot = await Lot(connect(DB_CONNECTION, portal)).findById(lotId);
    //                         lot.quantity = Number(lot.quantity) + Number(quantity);
    //                         if (lot.stocks && lot.stocks.length > 0) {
    //                             for (let k = 0; k < lot.stocks.length; k++) {
    //                                 if (lot.stocks[k].stock.toString() === data.fromStock.toString()) {
    //                                     lot.stocks[k].quantity = Number(lot.stocks[k].quantity) + Number(quantity);
    //                                 }
    //                             }
    //                         }
    //                         await lot.save();
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }
    //Nếu nhập kho thành phẩm từ xưởng sản xuất
    //Chuyển trạng thái đơn hàng từ đang thực hiện sang hoàn Thành
    //Thay đổi trạng thái lô sản xuất thành đã nhập kho
    // if (data.group === '1') {
    //     if (data.oldStatus === '1' && data.status === '2') {
    //         if (data.goods && data.goods.length > 0) {
    //             for (let i = 0; i < data.goods.length; i++) {
    //                 if (data.goods[i].lots && data.goods[i].lots.length > 0) {
    //                     for (let j = 0; j < data.goods[i].lots.length; j++) {
    //                         let lotId = data.goods[i].lots[j].lot._id;
    //                         let lot = await Lot(connect(DB_CONNECTION, portal)).findById(lotId);
    //                         if (lot && lot.status) {
    //                             lot.status = '3';
    //                             await lot.save();
    //                         }

    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }

    //Nhập kho: Chuyển trạng thái từ đã hoàn thành sang đã Hủy
    // if (data.group === '1') {
    //     if (data.oldStatus === '2' && data.status === '3') {
    //         if (data.goods && data.goods.length > 0) {
    //             for (let i = 0; i < data.goods.length; i++) {
    //                 if (data.goods[i].lots && data.goods[i].lots.length > 0) {
    //                     for (let j = 0; j < data.goods[i].lots.length; j++) {
    //                         let lotId = data.goods[i].lots[j].lot._id;
    //                         await Lot(connect(DB_CONNECTION, portal)).deleteOne({ _id: lotId });
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }

    return await Bill(connect(DB_CONNECTION, portal))
        .findById(bill._id)
        .populate([
            { path: 'creator', select: "_id name email avatar" },
            { path: 'manufacturingMill' },
            { path: 'manufacturingCommand' },
            { path: 'manufacturingWork' },
            { path: 'stockWorkAssignment.workAssignmentStaffs' },
            { path: 'fromStock' },
            { path: 'toStock' },
            { path: 'customer' },
            { path: 'supplier' },
            { path: 'bill' },
            { path: 'goods.lots.lot' },
            { path: 'goods.lots.lot.binLocations.binLocation' },
            { path: 'goods.unpassed_quality_control_lots.lot' },
            { path: 'goods.unpassed_quality_control_lots.lot.binLocations.binLocation' },
            { path: 'goods.good' },
            { path: 'logs.creator', select: "_id name email avatar" }
        ])

}

exports.getBillsByCommand = async (query, portal) => {
    const { manufacturingCommandId } = query;
    return await Bill(connect(DB_CONNECTION, portal))
        .find({
            manufacturingCommand: manufacturingCommandId,
            type: "3"
        })
        .populate([
            { path: 'creator', select: "_id name email avatar" },
            { path: 'fromStock' },
            { path: 'toStock' },
            { path: 'customer' },
            { path: 'supplier' },
            { path: 'bill' },
            { path: 'goods.lots.lot' },
            { path: 'goods.unpassed_quality_control_lots.lot' },
            { path: 'goods.good' },
            { path: 'logs.creator', select: "_id name email avatar" }
        ])
}


exports.createManyProductBills = async (data, portal) => {
    var logs = [];
    let log = {};
    log.creator = data[0].creator;
    log.createAt = new Date(Date.now());
    log.title = "Tạo phiếu";
    log.versions = "versions 1";
    logs = [...logs, log];
    let query = data.map(x => {
        return {
            fromStock: x.fromStock,
            group: x.group,
            bill: x.bill,
            toStock: x.toStock ? x.toStock : null,
            code: x.code,
            type: x.type,
            status: x.status,
            users: x.users,
            creator: x.creator,
            customer: x.customer ? x.customer : null,
            supplier: x.supplier ? x.supplier : null,
            receiver: {
                name: x.receiver.name,
                phone: x.receiver.phone,
                email: x.receiver.email,
                address: x.receiver.address,
            },
            description: x.description,
            goods: x.goods.map(item => {
                return {
                    good: item.good,
                    quantity: item.quantity,
                    returnQuantity: item.returnQuantity,
                    realQuantity: item.realQuantity,
                    damagedQuantity: item.damagedQuantity,
                    description: item.description,
                    lots: item.lots ? item.lots.map(x => {
                        return {
                            lot: x.lot,
                            quantity: x.quantity,
                            returnQuantity: x.returnQuantity,
                            damagedQuantity: x.damagedQuantity,
                            realQuantity: x.realQuantity,
                            note: x.note
                        }
                    }) : []
                }
            }),
            manufacturingMill: x.manufacturingMill,
            manufacturingCommand: x.manufacturingCommand,
            logs: logs
        }
    });

    const bills = await Bill(connect(DB_CONNECTION, portal)).insertMany(query);
    if (data[0].goods[0].lots && data[0].goods[0].lots[0].lot) {
        const lotId = data[0].goods[0].lots[0].lot;
        const lot = await Lot(connect(DB_CONNECTION, portal)).findById(lotId);
        lot.bills = bills.map(bill => bill._id);
        await lot.save();
    }
    return { bills }
}

function compare(a, b) {
    if (parseInt(a.quantity) < parseInt(b.quantity)) {
        return -1;
    }
    if (parseInt(a.quantity) > parseInt(b.quantity)) {
        return 1;
    }
    return 0;
}

async function getDataIssueReceiptChart(options, portal) {
    let dataIssueReceipt = [];
    let dataIssueReceiptChart = await Bill(connect(DB_CONNECTION, portal)).find(options).populate([
        { path: 'goods.good' },
    ]);
    if (dataIssueReceiptChart && dataIssueReceiptChart.length > 0) {
        dataIssueReceiptChart.forEach(bill => {
            if (bill.goods) {
                bill.goods.forEach(good => {
                    let index = dataIssueReceipt.findIndex(x => x.good._id.toString() === good.good._id.toString());
                    if (index != -1) {
                        dataIssueReceipt[index].quantity += good.quantity;
                    } else {
                        dataIssueReceipt.push({
                            good: good.good,
                            quantity: good.quantity
                        })
                    }
                })
            }
        })
    }

    return dataIssueReceipt.sort(compare);
}

async function getDataBillsReceiptedFromSupplierByTime(options, portal, arrayCustomer) {
    let dataBillsReceiptedFromSupplierByTime = [];
    let dataBillsReceiptedFromSupplier = await Bill(connect(DB_CONNECTION, portal)).find(options).populate([
        { path: 'supplier' },
    ]);
    if (dataBillsReceiptedFromSupplier && dataBillsReceiptedFromSupplier.length > 0) {
        dataBillsReceiptedFromSupplier.forEach(bill => {
            if (arrayCustomer && arrayCustomer.length > 0) {
                arrayCustomer.forEach(customer => {
                    if (bill.supplier._id.toString() === customer.toString()) {
                        let index = dataBillsReceiptedFromSupplierByTime.findIndex(x => x.supplier._id.toString() === customer.toString());
                        if (index != -1) {
                            dataBillsReceiptedFromSupplierByTime[index].quantity++;
                            dataBillsReceiptedFromSupplierByTime[index].bill.push(bill);
                        } else {
                            dataBillsReceiptedFromSupplierByTime.push({
                                supplier: bill.supplier,
                                quantity: 1,
                                bill: [bill]
                            })
                        }
                    }
                })
            }
        })
    }
    
    return dataBillsReceiptedFromSupplierByTime;
}

async function getDataBillsIssuedForCustomerByTime(options, portal, arrayCustomer) {
    let billArray = [];
    let dataBillsIssuedForCustomerByTime = [];
    let dataBillsIssuedForCustomer = await Bill(connect(DB_CONNECTION, portal)).find(options).populate([
        { path: 'customer' },
    ]);
    if (dataBillsIssuedForCustomer && dataBillsIssuedForCustomer.length > 0) {
        dataBillsIssuedForCustomer.forEach(bill => {
            if (arrayCustomer && arrayCustomer.length > 0) {
                arrayCustomer.forEach(customer => {
                    if (bill.customer._id.toString() === customer.toString()) {
                        let index = dataBillsIssuedForCustomerByTime.findIndex(x => x.customer._id.toString() === customer.toString());
                        if (index != -1) {
                            dataBillsIssuedForCustomerByTime[index].quantity++;
                            dataBillsReceiptedFromSupplierByTime[index].bill.push(bill);
                        } else {
                            dataBillsIssuedForCustomerByTime.push({
                                customer: bill.customer,
                                quantity: 1,
                                bill: [bill]
                            })
                        }
                    }
                })
            }
        })
    }
    return dataBillsIssuedForCustomerByTime;
}

exports.getNumberBills = async (user, query, portal) => {
    let { managementLocation, stock, startMonth, endMonth, customer, supplier, type, number, chart } = query;
    let options = {};
    let arrayStock = [];
    let arrayCustomer = [];
    let dataTopIssueReceipt = [];
    let dataTopAtLeastIssueReceipt = [];
    let dataBillsIssuedForCustomerByTime = [];
    let dataBillsReceiptedFromSupplierByTime = [];

    if (!managementLocation) throw new Error("roles not avaiable");

    //lấy id các khách hàng của role hiện tại
    const allCustomers = await getCustomers(portal, user.company, { customerOwner: [user._id] }, user._id, managementLocation);
    if (allCustomers && allCustomers.customers.length > 0) {
        for (let i = 0; i < allCustomers.customers.length; i++) {
            arrayCustomer = [...arrayCustomer, allCustomers.customers[i]._id];
        }
    }

    //lấy id các kho của role hiện tại
    if (!stock || stock.length === 0) {
        const stocks = await Stock(connect(DB_CONNECTION, portal)).find({ managementLocation: { $elemMatch: { role: managementLocation } } })
        if (stocks && stocks.length > 0) {
            for (let i = 0; i < stocks.length; i++) {
                arrayStock = [...arrayStock, stocks[i]._id];
            }
        }
    }

    let month1 = startMonth.split("-");
    let month2 = endMonth.split("-");
    let start = new Date(month1[0], month1[1] - 1, 1);
    let end = new Date(month2[0], month2[1], 1);

    options = {
        ...options,
        createdAt: {
            $gt: start,
            $lte: end
        }
    }

    options = {
        ...options,
        fromStock: query.stock ? query.stock : arrayStock,
    }
    options.status = "2";

    // Dữ liệu cho biểu đồ Tốp những mặt hàng nhập, xuất nhiều nhất và biểu đồ tốp những mặt hàng nhập, xuất ít nhất
    let dataIssueReceipt = [];
    if (chart === undefined) {
        options.group = "1";
        dataIssueReceipt = await getDataIssueReceiptChart(options, portal);
        if (dataIssueReceipt && dataIssueReceipt.length > 0) {
            dataTopAtLeastIssueReceipt = dataIssueReceipt.slice(0, 5);
            dataTopIssueReceipt = dataIssueReceipt.slice(dataIssueReceipt.length - 5, dataIssueReceipt.length);
        }
    } else if (chart === 'topIssueReceipt') {
        if (type === '1')
            options.group = "1";
        else if (type === '2')
            options.group = "2";
        dataIssueReceipt = await getDataIssueReceiptChart(options, portal);
        if (dataIssueReceipt && dataIssueReceipt.length > 0) {
            dataTopAtLeastIssueReceipt = dataIssueReceipt.slice(0, 5);
        }
    } else if (chart === 'topAtLeastIssueReceipt') {
        if (type === '1')
            options.group = "1";
        else if (type === '2')
            options.group = "2";
        dataIssueReceipt = await getDataIssueReceiptChart(options, portal);
        if (dataIssueReceipt && dataIssueReceipt.length > 0) {
            dataTopIssueReceipt = dataIssueReceipt.slice(dataIssueReceipt.length - 5, dataIssueReceipt.length);
        }
    }

    // Dữ liệu cho phiếu nhập theo từng nhóm nhà cung cấp
    if (chart === undefined || chart === 'receiptedFromSupplier') {
        options.group = "1";
        dataBillsReceiptedFromSupplierByTime = await getDataBillsReceiptedFromSupplierByTime(options, portal, arrayCustomer);
    }

    // Dữ liệu cho phiếu xuất theo từng nhóm khách hàng
    if (chart === undefined || chart === 'issuedForCustomer') {
        options.group = "2";
        dataBillsIssuedForCustomerByTime = await getDataBillsIssuedForCustomerByTime(options, portal, arrayCustomer);
    }

    const totalBills = await Bill(connect(DB_CONNECTION, portal)).find(options).count();
    options.group = '1';
    const totalGoodReceipts = await Bill(connect(DB_CONNECTION, portal)).find(options).count();
    options.group = '2';
    const totalGoodIssues = await Bill(connect(DB_CONNECTION, portal)).find(options).count();
    options.group = '3';
    const totalGoodReturns = await Bill(connect(DB_CONNECTION, portal)).find(options).count();

    return {
        totalBills,
        totalGoodReturns,
        totalGoodReceipts,
        totalGoodIssues,
        dataTopIssueReceipt,
        dataTopAtLeastIssueReceipt,
        dataBillsIssuedForCustomerByTime,
        dataBillsReceiptedFromSupplierByTime
    };
}
