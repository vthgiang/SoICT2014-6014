const { Bill, Lot, Stock } = require(`${SERVER_MODELS_DIR}`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

exports.getBillsByType = async (query, portal) => {
    var { page, limit, group, managementLocation } = query;

    if(!managementLocation) throw new Error("roles not avaiable");

    //lấy id các kho của role hiện tại
    const stocks = await Stock(connect(DB_CONNECTION, portal)).find({ managementLocation: { $in: managementLocation } })
    var arrayStock = [];
    if(stocks && stocks.length > 0) {
        for(let i = 0; i < stocks.length; i++) {
            arrayStock = [ ...arrayStock, stocks[i]._id ];
        }
    }

    if (!page && !limit) {
        if (group) {
            return await Bill(connect(DB_CONNECTION, portal)).find({ group: group, fromStock: { $in: arrayStock } })
                .populate([
                    { path: 'creator' },
                    { path: 'approver' },
                    { path: 'fromStock' },
                    { path: 'toStock' },
                    { path: 'customer' },
                    { path: 'supplier' },
                    { path: 'bill' },
                    { path: 'goods.lots.lot' },
                    { path: 'goods.good' }
                ])
                .sort({ 'timestamp': 'desc' })
        } else {
            return await Bill(connect(DB_CONNECTION, portal)).find({ fromStock: { $in: arrayStock } })
                .populate([
                    { path: 'creator' },
                    { path: 'approver' },
                    { path: 'fromStock' },
                    { path: 'toStock' },
                    { path: 'customer' },
                    { path: 'supplier' },
                    { path: 'bill' },
                    { path: 'goods.lots.lot' },
                    { path: 'goods.good' }
                ])
                .sort({ 'timestamp': 'desc' })
        }
    } else {
        if (group) {
            let option = { group: group, fromStock: arrayStock }

            if (query.stock) {
                option.fromStock = query.stock
            }

            if (query.toStock) {
                option.toStock = query.toStock
            }

            if(query.supplier) {
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
                    timestamp: {
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
                        timestamp: {
                            $gt: start
                        }
                    }
                }
                if (query.endDate) {
                    let date2 = query.endDate.split("-");
                    let end = new Date(date2[1], date2[0], 1);

                    option = {
                        ...option,
                        timestamp: {
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

            if(query.supplier) {
                option.supplier = query.supplier
            }

            return await Bill(connect(DB_CONNECTION, portal))
                .paginate(option, {
                    page,
                    limit,
                    populate: [
                        { path: 'creator' },
                        { path: 'approver' },
                        { path: 'fromStock' },
                        { path: 'toStock' },
                        { path: 'customer' },
                        { path: 'supplier' },
                        { path: 'bill' },
                        { path: 'goods.lots.lot' },
                        { path: 'goods.good' }
                    ],
                    sort: { 'timestamp': 'desc' }
                })
        } else {
            let option = { fromStock: arrayStock };

            if (query.stock) {
                option.fromStock = query.stock
            }

            if (query.toStock) {
                option.toStock = query.toStock
            }

            if(query.supplier) {
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
                    timestamp: {
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
                        timestamp: {
                            $gt: start
                        }
                    }
                }
                if (query.endDate) {
                    let date2 = query.endDate.split("-");
                    let end = new Date(date2[1], date2[0], 1);

                    option = {
                        ...option,
                        timestamp: {
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

            if(query.supplier) {
                option.supplier = query.supplier
            }

            return await Bill(connect(DB_CONNECTION, portal))
                .paginate(option, {
                    page,
                    limit,
                    populate: [
                        { path: 'creator' },
                        { path: 'approver' },
                        { path: 'fromStock' },
                        { path: 'toStock' },
                        { path: 'customer' },
                        { path: 'supplier' },
                        { path: 'bill' },
                        { path: 'goods.lots.lot' },
                        { path: 'goods.good' }
                    ],
                    sort: { 'timestamp': 'desc' }
                })
        }
    }
}

exports.getBillByGood = async (query, portal) => {
    const { good, limit, page } = query;

    let option = { goods: { $elemMatch: { good: good } }, $or: [{ group: '1' }, { group: '2' }] };

    if (query.startDate && query.endDate) {
        let date1 = query.startDate.split("-");
        let date2 = query.endDate.split("-");
        let start = new Date(date1[1], date1[0] - 1, 1);
        let end = new Date(date2[1], date2[0], 1);

        option = {
            ...option,
            timestamp: {
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
                timestamp: {
                    $gt: start
                }
            }
        }
        if (query.endDate) {
            let date2 = query.endDate.split("-");
            let end = new Date(date2[1], date2[0], 1);

            option = {
                ...option,
                timestamp: {
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
            sort: { 'timestamp': 'desc' }
        })
}

exports.getDetailBill = async (id, portal) => {
    return await Bill(connect(DB_CONNECTION, portal)).findById(id)
        .populate([
            { path: 'creator' },
            { path: 'approver' },
            { path: 'fromStock' },
            { path: 'toStock' },
            { path: 'customer' },
            { path: 'supplier' },
            { path: 'bill' },
            { path: 'goods.lots.lot' },
            { path: 'goods.good' }
        ])
}


exports.getBillsByStatus = async (query, portal) => {
    const { group, status, fromStock } = query;
    return await Bill(connect(DB_CONNECTION, portal)).find({ group, status, fromStock })
        .populate([
            { path: 'creator' },
            { path: 'approver' },
            { path: 'fromStock' },
            { path: 'toStock' },
            { path: 'customer' },
            { path: 'supplier' },
            { path: 'bill' },
            { path: 'goods.lots.lot' },
            { path: 'goods.good' }
        ])
}

exports.createBill = async (userId, data, portal) => {
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
        approver: data.approver,
        customer: data.customer ? data.customer : null,
        supplier: data.supplier ? data.supplier : null,
        receiver: {
            name: data.name,
            phone: data.phone,
            email: data.email,
            address: data.address,
        },
        // timestamp: new Date.now,
        description: data.description,
        goods: data.goods.map(item => {
            return {
                good: item.good,
                quantity: item.quantity,
                returnQuantity: item.returnQuantity,
                realQuantity: item.realQuantity,
                damagedQuantity: item.damagedQuantity,
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
        })
    }

    const bill = await Bill(connect(DB_CONNECTION, portal)).create(query);
    return await Bill(connect(DB_CONNECTION, portal))
        .findById(bill._id)
        .populate([
            { path: 'creator' },
            { path: 'approver' },
            { path: 'fromStock' },
            { path: 'toStock' },
            { path: 'customer' },
            { path: 'supplier' },
            { path: 'bill' },
            { path: 'goods.lots.lot' },
            { path: 'goods.good' }
        ])
}

exports.editBill = async (id, data, portal) => {
    let bill = await Bill(connect(DB_CONNECTION, portal)).findById(id);
    bill.fromStock = bill.fromStock;
    bill.toStock = data.toStock ? data.toStock : bill.toStock;
    bill.group = bill.group;
    bill.bill = bill.bill;
        bill.code = bill.code;
    bill.type = bill.type;
    bill.status = data.status ? data.status : bill.status;
    bill.users = data.users ? data.users : bill.users;
    bill.creator = data.creator ? data.creator : bill.creator;
    bill.approver = data.approver ? data.approver : bill.approver;
    bill.customer = data.customer ? data.customer : bill.customer;
    bill.supplier = data.supplier ? data.supplier : bill.supplier;
    bill.receiver = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address
    };
    bill.description = data.description ? data.description : bill.description;
    bill.goods = data.goods ? data.goods.map(item => {
        return {
            good: item.good,
            quantity: item.quantity,
            returnQuantity: item.returnQuantity,
            realQuantity: item.realQuantity,
            damagedQuantity: item.damagedQuantity,
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
    await bill.save();
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
                                    }
                                }
                            }
                            let lotLog = {};
                            lotLog.bill = bill._id;
                            lotLog.quantity = quantity;
                            lotLog.description = data.goods[i].description ? data.goods[i].description : '';
                            lotLog.type = bill.type;
                            lotLog.createdAt = bill.timestamp;
                            lotLog.stock = data.fromStock;
                            lot.lotLogs = [...lot.lotLogs, lotLog];
                            await lot.save();
                        }
                    }
                }
            }
        }

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
                                        }
                                    }
                                }
                                let lotLog = {};
                                lotLog.bill = bill._id;
                                lotLog.quantity = returnQuantity;
                                lotLog.description = data.goods[i].description ? data.goods[i].description : '';
                                lotLog.type = bill.type;
                                lotLog.createdAt = bill.timestamp;
                                lotLog.stock = data.fromStock;
                                lot.lotLogs = [...lot.lotLogs, lotLog];
                                await lot.save();
                            }

                        }
                    }
                }
            }
        }

        if(data.group === '4') {
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
                                lotLog.createdAt = bill.timestamp;
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
    if(data.oldStatus === '2' && data.status === '4') {
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

        if(data.group === '4') {
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
                            lotLog.createdAt = bill.timestamp;
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
    
    return await Bill(connect(DB_CONNECTION, portal))
        .findById(bill._id)
        .populate([
            { path: 'creator' },
            { path: 'approver' },
            { path: 'fromStock' },
            { path: 'toStock' },
            { path: 'customer' },
            { path: 'supplier' },
            { path: 'bill' },
            { path: 'goods.lots.lot' },
            { path: 'goods.good' }
        ])

}