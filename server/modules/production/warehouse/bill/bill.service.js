const { Bill } = require(`${SERVER_MODELS_DIR}`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

exports.getBillsByType = async (query, portal) => {
    var { page, limit, group } = query;
    if(!page && !limit) {
        if(group) {
            return await Bill(connect(DB_CONNECTION, portal)).find({ group: group })
            .populate([
                { path: 'users' },
                { path: 'creator' },
                { path: 'fromStock' },
                { path: 'toStock' },
                { path: 'partner' },
                { path: 'goodReceipts.lots.lot' },
                { path: 'goodReceipts.good' },
                { path: 'goodIssues.lots.lot' },
                { path: 'goodIssues.good' },
                { path: 'goodReturns.lots.lot' },
                { path: 'goodReturns.bill' },
                { path: 'goodReturns.good' },
                { path: 'stockTakes.lots.lot' },
                { path: 'stockTakes.good' }
            ])
            .sort({ 'timestamp': 'desc' })
        } else {
            return await Bill(connect(DB_CONNECTION, portal)).find()
            .populate([
                { path: 'users' },
                { path: 'creator' },
                { path: 'fromStock' },
                { path: 'toStock' },
                { path: 'partner' },
                { path: 'goodReceipts.lots.lot' },
                { path: 'goodReceipts.good' },
                { path: 'goodIssues.lots.lot' },
                { path: 'goodIssues.good' },
                { path: 'goodReturns.lots.lot' },
                { path: 'goodReturns.bill' },
                { path: 'goodReturns.good' },
                { path: 'stockTakes.lots.lot' },
                { path: 'stockTakes.good' }
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

        if(query.partner) {
            option.partner = query.partner
        }

        return await Bill(connect(DB_CONNECTION, portal))
            .paginate(option, {
                page,
                limit,
                populate: [
                    { path: 'users' },
                    { path: 'creator' },
                    { path: 'fromStock' },
                    { path: 'toStock' },
                    { path: 'partner' },
                    { path: 'goodReceipts.lots.lot' },
                    { path: 'goodReceipts.good' },
                    { path: 'goodIssues.lots.lot' },
                    { path: 'goodIssues.good' },
                    { path: 'goodReturns.lots.lot' },
                    { path: 'goodReturns.bill' },
                    { path: 'goodReturns.good' },
                    { path: 'stockTakes.lots.lot' },
                    { path: 'stockTakes.good' }
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

        if(query.partner) {
            option.partner = query.partner
        }

        return await Bill(connect(DB_CONNECTION, portal))
            .paginate(option, {
                page,
                limit,
                populate: [
                    { path: 'users' },
                    { path: 'creator' },
                    { path: 'fromStock' },
                    { path: 'toStock' },
                    { path: 'partner' },
                    { path: 'goodReceipts.lots.lot' },
                    { path: 'goodReceipts.good' },
                    { path: 'goodIssues.lots.lot' },
                    { path: 'goodIssues.good' },
                    { path: 'goodReturns.lots.lot' },
                    { path: 'goodReturns.bill' },
                    { path: 'goodReturns.good' },
                    { path: 'stockTakes.lots.lot' },
                    { path: 'stockTakes.good' }
                ],
                sort: { 'timestamp': 'desc' }
            })
        }
    }
}

exports.getBillByGood = async (query, portal) => {
    const { good, limit, page } = query;

    let option = { $or: [ { goodReceipts: { $elemMatch: { good: good } } }, { goodIssues: { $elemMatch: { good: good } } } ] };

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
            { path: 'fromStock' },
            { path: 'toStock' },
            { path: 'partner' },
            { path: 'goodReceipts.lots.lot' },
            { path: 'goodReceipts.good' },
            { path: 'goodIssues.lots.lot' },
            { path: 'goodIssues.good' },
            { path: 'goodReturns.lots.lot' },
            { path: 'goodReturns.bill' },
            { path: 'goodReturns.good' },
            { path: 'stockTakes.lots.lot' },
            { path: 'stockTakes.good' }
        ])
}