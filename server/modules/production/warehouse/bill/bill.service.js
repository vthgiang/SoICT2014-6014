const { Bill, Lot, Stock, SalesOrder, PurchaseOrder } = require(`../../../../models`);
const { connect } = require(`../../../../helpers/dbHelper`);
const CustomerService = require('../../../crm/customer/customer.service');
const { updateCrmActionsTaskInfo, updateSearchingCustomerTaskInfo } = require('../../../crm/crmTask/crmTask.service');

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
                { path: 'approvers.approver' },
                { path: 'qualityControlStaffs.staff' },
                { path: 'responsibles' },
                { path: 'accountables' },
                { path: 'manufacturingMill' },
                { path: 'manufacturingCommand' },
                { path: 'fromStock' },
                { path: 'toStock' },
                { path: 'customer' },
                { path: 'supplier' },
                { path: 'bill' },
                { path: 'goods.lots.lot' },
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
                },
                {
                    approvers: { $elemMatch: { approver: userId } }
                },
                {
                    qualityControlStaffs: { $elemMatch: { staff: userId } }
                },
                {
                    responsibles: { $in: userId }
                },
                {
                    accountables: { $in: userId }
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
                    { path: 'approvers.approver' },
                    { path: 'qualityControlStaffs.staff' },
                    { path: 'responsibles' },
                    { path: 'accountables' },
                    { path: 'manufacturingMill' },
                    { path: 'manufacturingCommand' },
                    { path: 'fromStock' },
                    { path: 'toStock' },
                    { path: 'customer' },
                    { path: 'supplier' },
                    { path: 'bill' },
                    { path: 'goods.lots.lot' },
                    { path: 'goods.good' },
                    { path: 'logs.creator', select: "_id name email avatar" }
                ],
                sort: { 'updatedAt': 'desc' }
            })
    }
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
            { path: 'approvers.approver' },
            { path: 'qualityControlStaffs.staff' },
            { path: 'responsibles' },
            { path: 'accountables' },
            { path: 'manufacturingMill' },
            { path: 'manufacturingCommand' },
            { path: 'fromStock' },
            { path: 'toStock' },
            { path: 'customer' },
            { path: 'supplier' },
            { path: 'bill' },
            { path: 'goods.lots.lot' },
            { path: 'goods.good' },
            { path: 'logs.creator', select: "_id name email avatar" }
        ])
}


exports.getBillsByStatus = async (query, portal) => {
    const { group, status, fromStock, type } = query;
    let sourceType = type !== '13' ? (type === '11' ? '1' : '2') : null;
    let qualityControlStaffsStatus = type !== '13' ? "3" : '2';
    return await Bill(connect(DB_CONNECTION, portal)).find({ group, status, fromStock, sourceType, "qualityControlStaffs.status": qualityControlStaffsStatus })
        .populate([
            { path: 'creator', select: "_id name email avatar" },
            { path: 'approvers.approver', select: "_id name email avatar" },
            { path: 'manufacturingMill' },
            { path: 'manufacturingCommand' },
            { path: 'fromStock' },
            { path: 'toStock' },
            { path: 'customer' },
            { path: 'supplier' },
            { path: 'bill' },
            { path: 'goods.lots.lot' },
            { path: 'goods.good' },
            { path: 'logs.creator', select: "_id name email avatar" }
        ])
}

exports.createBill = async (userId, data, portal) => {
    var logs = [];
    let log = {};
    log.creator = userId;
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
        creator: userId,
        approvers: data.approvers ? data.approvers.map((item) => {
            return {
                approver: item.approver,
                status: item.status,
                content: item.content,
                approvedTime: item.approvedTime
            }
        }) : [],
        accountables: data.accountables,
        responsibles: data.responsibles,
        qualityControlStaffs: data.qualityControlStaffs ? data.qualityControlStaffs.map(item => {
            return {
                staff: item.staff,
                status: item.status,
                content: item.content,
                time: item.time
            }
        }) : [],
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

    return await Bill(connect(DB_CONNECTION, portal))
        .findById(bill._id)
        .populate([
            { path: 'creator', select: "_id name email avatar" },
            { path: 'approvers.approver', select: "_id name email avatar" },
            { path: 'qualityControlStaffs.staff' },
            { path: 'responsibles' },
            { path: 'accountables' },
            { path: 'manufacturingMill' },
            { path: 'manufacturingCommand' },
            { path: 'fromStock' },
            { path: 'toStock' },
            { path: 'customer' },
            { path: 'supplier' },
            { path: 'bill' },
            { path: 'goods.lots.lot' },
            { path: 'goods.good' },
            { path: 'logs.creator', select: "_id name email avatar" }
        ])
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

function findIndexOfQuatityStaff(array, id) {
    let result = -1;
    array.forEach((element, index) => {
        if (element.staff == id) {
            result = index;
        }
    });
    return result;
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
    bill.approvers = data.approvers ? data.approvers.map(item => {
        return {
            approver: item.approver,
            approvedTime: item.approvedTime
        }
    }) : bill.approvers;
    bill.accountables = data.accountables ? data.accountables : bill.accountables;
    bill.responsibles = data.responsibles ? data.responsibles : bill.responsibles;
    bill.qualityControlStaffs = data.qualityControlStaffs ? data.qualityControlStaffs : bill.qualityControlStaffs;
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
            realQuantity: item.realQuantity,
            damagedQuantity: item.quantity - item.realQuantity,
            description: item.description,
            lots: item.lots.map(x => {
                return {
                    lot: x.lot,
                    quantity: x.quantity,
                    returnQuantity: x.returnQuantity,
                    damagedQuantity: x.damagedQuantity,
                    realQuantity: x.realQuantity,
                    note: x.note
                }
            })
        }
    }) : bill.goods;

    if (data.approverId) {
        let index = findIndexOfApprover(bill.approvers, data.approverId);

        if (index !== -1) {
            bill.approvers[index].approvedTime = new Date(Date.now());
        }

        let quantityApproved = 1;
        bill.approvers.forEach((element, index1) => {
            if (index1 !== index && element.approvedTime == null) {
                quantityApproved = 0;
            }
        });
        if (quantityApproved) {
            bill.status = 3;
        }
    }
    else {
        bill.status = data.status ? data.status : bill.status;
    }

    if (data.qualityControlStaffs) {
        let index = findIndexOfQuatityStaff(bill.qualityControlStaffs, data.qualityControlStaffs.staff);

        if (index !== -1) {
            bill.qualityControlStaffs[index].time = new Date(Date.now());
            bill.qualityControlStaffs[index].status = data.qualityControlStaffs.status;
            bill.qualityControlStaffs[index].code = data.qualityControlStaffs.content;
        }

        let qualityControlStaff = 1;
        bill.qualityControlStaffs.forEach((element, index1) => {
            if (index1 !== index && element.time == null) {
                quantityqualityControlStaff = 0;
            }
        });
        if (qualityControlStaff) {
            bill.status = 5;
        }
    }
    bill.status = data.status ? data.status : bill.status;

    var log = {};
    log.creator = userId;
    log.createAt = new Date(Date.now());
    log.title = data.type;
    log.versions = "versions " + (bill.logs.length + 1);
    bill.logs = [...bill.logs, log];

    await bill.save();

    //--------------------PHẦN PHỤC VỤ CHO QUẢN LÝ ĐƠN HÀNG------------------------
    if (parseInt(bill.status) === 2) {//Nếu bill đã hoàn thành
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
    } else if (parseInt(bill.status) === 4) {//Nếu bill bị hủy
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
    if (data.oldStatus === '5' && data.status === '2') {
        //Nếu là phiếu xuất kho hệ thống cập nhật lại số lượng tồn kho
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
                                    if (lot.stocks[k].stock.toString() === data.fromStock.toString()) {
                                        lot.stocks[k].quantity = Number(lot.stocks[k].quantity) - Number(quantity);
                                        lot.stocks[k].binLocations = [];
                                    }
                                }
                            }
                            let lotLog = {};
                            lotLog.bill = bill._id;
                            lotLog.quantity = quantity;
                            lotLog.description = data.goods[i].description ? data.goods[i].description : '';
                            lotLog.type = bill.type;
                            lotLog.createdAt = bill.updatedAt;
                            lotLog.stock = data.fromStock;
                            lot.lotLogs = [...lot.lotLogs, lotLog];
                            await lot.save();
                        }
                    }
                }
            }
        }

        // if (data.group === '1' && data.type === '1') {
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

        //Nếu là phiếu trả hàng
        if (data.group === '3') {
            if (data.goods && data.goods.length > 0) {
                for (let i = 0; i < data.goods.length; i++) {
                    if (data.goods[i].lots && data.goods[i].lots.length > 0) {
                        for (let j = 0; j < data.goods[i].lots.length; j++) {
                            var returnQuantity = data.goods[i].lots[j].returnQuantity;
                            if (returnQuantity > 0) {
                                let lotId = data.goods[i].lots[j].lot._id;
                                let lot = await Lot(connect(DB_CONNECTION, portal)).findById(lotId);
                                lot.quantity = Number(lot.quantity) + Number(returnQuantity);
                                if (lot.stocks && lot.stocks.length > 0) {
                                    for (let k = 0; k < lot.stocks.length; k++) {
                                        if (lot.stocks[k].stock.toString() === data.fromStock.toString()) {
                                            lot.stocks[k].quantity = Number(lot.stocks[k].quantity) + Number(returnQuantity);
                                            lot.stocks[k].binLocations = [];
                                        }
                                    }
                                }
                                let lotLog = {};
                                lotLog.bill = bill._id;
                                lotLog.quantity = returnQuantity;
                                lotLog.description = data.goods[i].description ? data.goods[i].description : '';
                                lotLog.type = bill.type;
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

        if (data.group === '4') {
            if (data.goods && data.goods.length > 0) {
                for (let i = 0; i < data.goods.length; i++) {
                    if (data.goods[i].lots && data.goods[i].lots.length > 0) {
                        for (let j = 0; j < data.goods[i].lots.length; j++) {
                            var damagedQuantity = data.goods[i].lots[j].damagedQuantity;
                            if (damagedQuantity !== 0) {
                                let lotId = data.goods[i].lots[j].lot._id;
                                let lot = await Lot(connect(DB_CONNECTION, portal)).findById(lotId);
                                lot.quantity = Number(lot.quantity) + Number(damagedQuantity);
                                if (lot.stocks && lot.stocks.length > 0) {
                                    for (let k = 0; k < lot.stocks.length; k++) {
                                        if (lot.stocks[k].stock.toString() === data.fromStock.toString()) {
                                            lot.stocks[k].quantity = Number(lot.stocks[k].quantity) + Number(damagedQuantity);
                                        }
                                    }
                                }
                                let lotLog = {};
                                lotLog.bill = bill._id;
                                lotLog.quantity = damagedQuantity;
                                lotLog.description = data.goods[i].description ? data.goods[i].description : '';
                                lotLog.type = bill.type;
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
    }

    // Nếu trạng thái đơn chuyển từ đã hoàn thành sang đã hủy
    if (data.oldStatus === '2' && data.status === '4') {
        //Phiếu xuất kho
        if (data.group === '2') {
            if (data.oldGoods && data.oldGoods.length > 0) {
                for (let i = 0; i < data.oldGoods.length; i++) {
                    if (data.oldGoods[i].lots && data.oldGoods[i].lots.length > 0) {
                        for (let j = 0; j < data.oldGoods[i].lots.length; j++) {
                            var quantity = data.oldGoods[i].lots[j].quantity;
                            let lotId = data.oldGoods[i].lots[j].lot._id;
                            let lot = await Lot(connect(DB_CONNECTION, portal)).findById(lotId);
                            lot.quantity = Number(lot.quantity) + Number(quantity);
                            if (lot.stocks && lot.stocks.length > 0) {
                                for (let k = 0; k < lot.stocks.length; k++) {
                                    if (lot.stocks[k].stock.toString() === data.fromStock.toString()) {
                                        lot.stocks[k].quantity = Number(lot.stocks[k].quantity) + Number(quantity);
                                    }
                                }
                            }
                            lot.lotLogs = lot.lotLogs.filter(item => item.bill !== bill._id);
                            await lot.save();
                        }
                    }
                }
            }
        }

        //Nếu là phiếu trả hàng
        if (data.group === '3') {
            if (data.oldGoods && data.oldGoods.length > 0) {
                for (let i = 0; i < data.oldGoods.length; i++) {
                    if (data.oldGoods[i].lots && data.oldGoods[i].lots.length > 0) {
                        for (let j = 0; j < data.oldGoods[i].lots.length; j++) {
                            var returnQuantity = data.oldGoods[i].lots[j].returnQuantity;
                            if (returnQuantity > 0) {
                                let lotId = data.oldGoods[i].lots[j].lot._id;
                                let lot = await Lot(connect(DB_CONNECTION, portal)).findById(lotId);
                                lot.quantity = Number(lot.quantity) - Number(returnQuantity);
                                if (lot.stocks && lot.stocks.length > 0) {
                                    for (let k = 0; k < lot.stocks.length; k++) {
                                        if (lot.stocks[k].stock.toString() === data.fromStock.toString()) {
                                            lot.stocks[k].quantity = Number(lot.stocks[k].quantity) - Number(returnQuantity);
                                        }
                                    }
                                }
                                lot.lotLogs = lot.lotLogs.filter(item => item.bill !== bill._id);
                                await lot.save();
                            }

                        }
                    }
                }
            }
        }

        if (data.group === '4') {
            if (data.oldGoods && data.oldGoods.length > 0) {
                for (let i = 0; i < data.oldGoods.length; i++) {
                    if (data.oldGoods[i].lots && data.oldGoods[i].lots.length > 0) {
                        for (let j = 0; j < data.oldGoods[i].lots.length; j++) {
                            var damagedQuantity = data.oldGoods[i].lots[j].damagedQuantity;
                            if (damagedQuantity !== 0) {
                                let lotId = data.oldGoods[i].lots[j].lot._id;
                                let lot = await Lot(connect(DB_CONNECTION, portal)).findById(lotId);
                                lot.quantity = Number(lot.quantity) - Number(damagedQuantity);
                                if (lot.stocks && lot.stocks.length > 0) {
                                    for (let k = 0; k < lot.stocks.length; k++) {
                                        if (lot.stocks[k].stock.toString() === data.fromStock.toString()) {
                                            lot.stocks[k].quantity = Number(lot.stocks[k].quantity) - Number(damagedQuantity);
                                        }
                                    }
                                }
                                lot.lotLogs = lot.lotLogs.filter(item => item.bill !== bill._id);
                                await lot.save();
                            }

                        }
                    }
                }
            }
        }
    }

    if (data.group === '5') {
        //chuyển trạng thái từ đã phê duyệt sang thực hiện
        //Thực hiện việc xuất kho của kho xuất
        if (data.oldStatus === '3' && data.status === '5') {
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
                                    if (lot.stocks[k].stock.toString() === data.fromStock.toString()) {
                                        lot.stocks[k].quantity = Number(lot.stocks[k].quantity) - Number(quantity);
                                    }
                                }
                            }
                            await lot.save();
                        }
                    }
                }
            }
        }
        // chuyển trạng thái từ đang thực hiện sang đã hoàn thành
        // thực hiện việc nhập kho và lưu thông tin
        if (data.oldStatus === '5' && data.status === '2') {
            if (data.goods && data.goods.length > 0) {
                for (let i = 0; i < data.goods.length; i++) {
                    if (data.goods[i].lots && data.goods[i].lots.length > 0) {
                        for (let j = 0; j < data.goods[i].lots.length; j++) {
                            var quantity = data.goods[i].lots[j].quantity;
                            let lotId = data.goods[i].lots[j].lot._id;
                            let lot = await Lot(connect(DB_CONNECTION, portal)).findById(lotId);
                            lot.quantity = Number(lot.quantity) + Number(quantity);
                            if (lot.stocks && lot.stocks.length > 0) {
                                let check = 0;
                                for (let k = 0; k < lot.stocks.length; k++) {
                                    if (lot.stocks[k].stock.toString() === data.toStock.toString()) {
                                        lot.stocks[k].quantity = Number(lot.stocks[k].quantity) + Number(quantity);
                                        check = 1;
                                    }
                                }
                                if (check === 0) {
                                    let stock = {};
                                    stock.stock = data.toStock;
                                    stock.quantity = quantity;
                                    lot.stocks = [...lot.stocks, stock];
                                }
                            }
                            let lotLog = {};
                            lotLog.bill = bill._id;
                            lotLog.quantity = quantity;
                            lotLog.description = data.goods[i].description ? data.goods[i].description : '';
                            lotLog.type = bill.type;
                            lotLog.createdAt = bill.updatedAt;
                            lotLog.stock = data.fromStock;
                            lotLog.toStock = data.toStock;
                            lot.lotLogs = [...lot.lotLogs, lotLog];
                            await lot.save();
                        }
                    }
                }
            }
        }

        //chuyển trạng thái từ đang thực hiện sang trạng thái đã hủy
        // Thực hiện lại việc nhập kho, trả lại thông tin cho từng lô hàng
        if (data.oldStatus === '5' && data.status === '4') {
            if (data.goods && data.goods.length > 0) {
                for (let i = 0; i < data.goods.length; i++) {
                    if (data.goods[i].lots && data.goods[i].lots.length > 0) {
                        for (let j = 0; j < data.goods[i].lots.length; j++) {
                            var quantity = data.goods[i].lots[j].quantity;
                            let lotId = data.goods[i].lots[j].lot._id;
                            let lot = await Lot(connect(DB_CONNECTION, portal)).findById(lotId);
                            lot.quantity = Number(lot.quantity) + Number(quantity);
                            if (lot.stocks && lot.stocks.length > 0) {
                                for (let k = 0; k < lot.stocks.length; k++) {
                                    if (lot.stocks[k].stock.toString() === data.fromStock.toString()) {
                                        lot.stocks[k].quantity = Number(lot.stocks[k].quantity) + Number(quantity);
                                    }
                                }
                            }
                            await lot.save();
                        }
                    }
                }
            }
        }
    }
    //Nếu nhập kho thành phẩm từ xưởng sản xuất
    //Chuyển trạng thái đơn hàng từ đang thực hiện sang hoàn Thành
    //Thay đổi trạng thái lô sản xuất thành đã nhập kho
    if (data.group === '1') {
        if (data.oldStatus === '5' && data.status === '2') {
            if (data.goods && data.goods.length > 0) {
                for (let i = 0; i < data.goods.length; i++) {
                    if (data.goods[i].lots && data.goods[i].lots.length > 0) {
                        for (let j = 0; j < data.goods[i].lots.length; j++) {
                            let lotId = data.goods[i].lots[j].lot._id;
                            let lot = await Lot(connect(DB_CONNECTION, portal)).findById(lotId);
                            if (lot && lot.status) {
                                lot.status = '3';
                                await lot.save();
                            }

                        }
                    }
                }
            }
        }
    }

    //Nhập kho: Chuyển trạng thái từ đã hoàn thành sang đã Hủy
    if (data.group === '1') {
        if (data.oldStatus === '2' && data.status === '4') {
            if (data.goods && data.goods.length > 0) {
                for (let i = 0; i < data.goods.length; i++) {
                    if (data.goods[i].lots && data.goods[i].lots.length > 0) {
                        for (let j = 0; j < data.goods[i].lots.length; j++) {
                            let lotId = data.goods[i].lots[j].lot._id;
                            await Lot(connect(DB_CONNECTION, portal)).deleteOne({ _id: lotId });
                        }
                    }
                }
            }
        }
    }

    return await Bill(connect(DB_CONNECTION, portal))
        .findById(bill._id)
        .populate([
            { path: 'creator', select: "_id name email avatar" },
            { path: 'approvers.approver', select: "_id name email avatar" },
            { path: 'qualityControlStaffs.staff' },
            { path: 'responsibles' },
            { path: 'accountables' },
            { path: 'manufacturingMill' },
            { path: 'manufacturingCommand' },
            { path: 'fromStock' },
            { path: 'toStock' },
            { path: 'customer' },
            { path: 'supplier' },
            { path: 'bill' },
            { path: 'goods.lots.lot' },
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
            { path: 'approvers.approver', select: "_id name email avatar" },
            { path: 'qualityControlStaffs.staff' },
            { path: 'responsibles' },
            { path: 'accountables' },
            { path: 'fromStock' },
            { path: 'toStock' },
            { path: 'customer' },
            { path: 'supplier' },
            { path: 'bill' },
            { path: 'goods.lots.lot' },
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
            approvers: x.approvers ? x.approvers.map((item) => {
                return {
                    approver: item.approver,
                    role: item.role,
                    approvedTime: item.approvedTime
                }
            }) : [],
            accountables: x.accountables,
            responsibles: x.responsibles,
            qualityControlStaffs: x.qualityControlStaffs ? x.qualityControlStaffs.map(item => {
                return {
                    staff: item.staff,
                    status: item.status
                }
            }) : [],
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

exports.getNumberBills = async (query, portal) => {
    let options = {};
    if (query.stock) {
        options.fromStock = query.stock
    }

    if (query.createdAt) {
        let date = query.createdAt.split("-");
        let start = new Date(date[1], date[0] - 1, 1);
        let end = new Date(date[1], date[0], 1);

        options = {
            ...options,
            createdAt: {
                $gt: start,
                $lte: end
            }
        }
    }

    const totalBills = await Bill(connect(DB_CONNECTION, portal)).find(options).count();
    options.group = '1';
    const totalGoodReceipts = await Bill(connect(DB_CONNECTION, portal)).find(options).count();
    options.group = '2';
    const totalGoodIssues = await Bill(connect(DB_CONNECTION, portal)).find(options).count();
    options.group = '3';
    const totalGoodReturns = await Bill(connect(DB_CONNECTION, portal)).find(options).count();

    return { totalBills, totalGoodReturns, totalGoodReceipts, totalGoodIssues };
}
