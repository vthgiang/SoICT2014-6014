const { Bill, Lot } = require(`${SERVER_MODELS_DIR}`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

exports.getBillsByType = async (query, portal) => {
    var { page, limit, group } = query;
    if(!page && !limit) {
        if(group) {
            return await Bill(connect(DB_CONNECTION, portal)).find({ group: group })
            .populate([
                { path: 'users' },
                { path: 'creator' },
                { path: 'approver' },
                { path: 'fromStock' },
                { path: 'toStock' },
                { path: 'customer' },
                // { path: 'partner.supplier' },
                { path: 'goods.lots.lot' },
                { path: 'goods.good' }
            ])
            .sort({ 'timestamp': 'desc' })
        } else {
            return await Bill(connect(DB_CONNECTION, portal)).find()
            .populate([
                { path: 'users' },
                { path: 'creator' },
                { path: 'approver' },
                { path: 'fromStock' },
                { path: 'toStock' },
                { path: 'customer' },
                // { path: 'partner.supplier' },
                { path: 'goods.lots.lot' },
                { path: 'goods.good' }
            ])
            .sort({ 'timestamp': 'desc' })
        }
    } else {
        if(group) {
            let option = { group: group }

        if(query.stock) {
            option.fromStock = query.stock
        }

        if(query.creator) {
            option.creator = query.creator
        }

        if(query.type) {
            option.type = query.type
        }

        if(query.startDate && query.endDate) {
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
            if(query.startDate) {
                let date1 = query.startDate.split("-");
                let start = new Date(date1[1], date1[0] - 1, 1);

                option = {
                    ...option,
                    timestamp: {
                        $gt: start
                    }
                }
            }
            if(query.endDate) {
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

        if(query.code) {
            option.code = new RegExp(query.code, "i")
        }

        if(query.status) {
            option.status = query.status
        }

        if(query.customer) {
            option.customer = query.customer
        }

        return await Bill(connect(DB_CONNECTION, portal))
            .paginate(option, {
                page,
                limit,
                populate: [
                    { path: 'users' },
                    { path: 'creator' },
                    { path: 'approver' },
                    { path: 'fromStock' },
                    { path: 'toStock' },
                    { path: 'customer' },
                    // { path: 'partner.supplier' },
                    { path: 'goods.lots.lot' },
                    { path: 'goods.good' }
                ],
                sort: { 'timestamp': 'desc' }
            })
        } else {
            let option = {};

        if(query.stock) {
            option.fromStock = query.stock
        }

        if(query.creator) {
            option.creator = query.creator
        }

        if(query.type) {
            option.type = query.type
        }

        if(query.startDate && query.endDate) {
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
            if(query.startDate) {
                let date1 = query.startDate.split("-");
                let start = new Date(date1[1], date1[0] - 1, 1);

                option = {
                    ...option,
                    timestamp: {
                        $gt: start
                    }
                }
            }
            if(query.endDate) {
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

        if(query.code) {
            option.code = new RegExp(query.code, "i")
        }

        if(query.status) {
            option.status = query.status
        }

        if(query.customer) {
            option.customer = query.customer
        }

        return await Bill(connect(DB_CONNECTION, portal))
            .paginate(option, {
                page,
                limit,
                populate: [
                    { path: 'users' },
                    { path: 'creator' },
                    { path: 'approver' },
                    { path: 'fromStock' },
                    { path: 'toStock' },
                    { path: 'customer' },
                    // { path: 'partner.supplier' },
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

    let option = { goods: { $elemMatch: { good: good } }, $or: [ { group: '1'}, { group: '2'}] };

    if(query.startDate && query.endDate) {
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
        if(query.startDate) {
            let date1 = query.startDate.split("-");
            let start = new Date(date1[1], date1[0] - 1, 1);

            option = {
                ...option,
                timestamp: {
                    $gt: start
                }
            }
        }
        if(query.endDate) {
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
            { path: 'users' },
            { path: 'creator' },
            { path: 'approver' },
            { path: 'fromStock' },
            { path: 'toStock' },
            { path: 'customer' },
            // { path: 'partner.supplier' },
            { path: 'goods.lots.lot' },
            { path: 'goods.good' }
        ])
}

exports.createBill = async (userId, data, portal) => {
    let query = {
        fromStock: data.fromStock,
        group: data.group,
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
                description: item.description,
                lots: item.lots.map(x => {
                    return {
                        lot: x.lot,
                        quantity: x.quantity,
                        returnQuantity: x.returnQuantity,
                        damagedQuantity: x.damagedQuantity,
                        note: x.note
                    }
                })
            }
        })
    }

    const bill = await Bill(connect(DB_CONNECTION, portal)).create(query);
    if(bill.group === '2') {
        if(data.goods && data.goods.length > 0) {
            for(let i = 0; i < data.goods.length; i++) {
                
            }
        }
    }
    return await Bill(connect(DB_CONNECTION, portal))
        .findById(bill._id)
        .populate([
            { path: 'users' },
            { path: 'creator' },
            { path: 'approver' },
            { path: 'fromStock' },
            { path: 'toStock' },
            { path: 'customer' },
            // { path: 'partner.supplier' },
            { path: 'goods.lots.lot' },
            { path: 'goods.good' }
        ])
}

exports.editBill = async (id, data, portal) => {
    let bill = await Bill(connect(DB_CONNECTION, portal)).findById(id);
    bill.fromStock = bill.fromStock;
    bill.toStock = data.toStock ? data.toStock : bill.toStock;
    bill.group = bill.group;
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
            description: item.description,
            lots: item.lots.map(x => {
                return {
                    lot: x.lot,
                    quantity: x.quantity,
                    returnQuantity: x.returnQuantity,
                    damagedQuantity: x.damagedQuantity,
                    note: x.note
                }
            })
        }
    }) : bill.goods;
    await bill.save();

    return await Bill(connect(DB_CONNECTION, portal))
        .findById(bill._id)
        .populate([
            { path: 'users' },
            { path: 'creator' },
            { path: 'approver' },
            { path: 'fromStock' },
            { path: 'toStock' },
            { path: 'customer' },
            // { path: 'partner.supplier' },
            { path: 'goods.lots.lot' },
            { path: 'goods.good' }
        ])

}