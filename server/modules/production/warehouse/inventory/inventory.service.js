
const { Lot, BinLocation, Stock, ManufacturingCommand, OrganizationalUnit, ManufacturingWorks, ManufacturingMill } = require(`${SERVER_MODELS_DIR}`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

exports.getAllLots = async (query, portal) => {
    const lotType = '2';
    let { stock, good, page, limit, type, managementLocation } = query;
    let lots;

    if (!managementLocation) throw new Error("roles not avaiable");

    //lấy id các kho của role hiện tại
    const stocks = await Stock(connect(DB_CONNECTION, portal)).find({ managementLocation: { $in: managementLocation } })
    var arrayStock = [];
    if (stocks && stocks.length > 0) {
        for (let i = 0; i < stocks.length; i++) {
            arrayStock = [...arrayStock, stocks[i]._id];
        }
    }

    if (!limit && !page) {
        if (stock) {
            if (good) {
                lots = await Lot(connect(DB_CONNECTION, portal))
                    .find({ stocks: { $elemMatch: { stock: stock } }, quantity: { $ne: 0 }, good, type, lotType: lotType })
                    .populate([
                        { path: 'good', select: 'id name baseUnit type' },
                        { path: 'stocks.binLocations.binlocation', select: 'id code name' },
                        { path: 'lotLogs.bill', select: 'id code type' },
                        { path: 'lotLogs.binLocations.binLocation', select: 'id code name' }
                    ])
                    .sort({ 'expirationDate': 'asc' })
            }
            else {
                lots = await Lot(connect(DB_CONNECTION, portal))
                    .find({ stocks: { $elemMatch: { stock: stock } }, quantity: { $ne: 0 }, type, lotType: lotType })
                    .populate([
                        { path: 'good', select: 'id name baseUnit type' },
                        { path: 'stocks.binLocations.binlocation', select: 'id code name' },
                        { path: 'lotLogs.bill', select: 'id code type' },
                        { path: 'lotLogs.binLocations.binLocation', select: 'id code name' }
                    ])
                    .sort({ 'expirationDate': 'asc' })
            }
        }
        else {
            if (good) {
                lots = await Lot(connect(DB_CONNECTION, portal))
                    .find({ stocks: { $elemMatch: { stock: arrayStock } }, quantity: { $ne: 0 }, good, type, lotType: lotType })
                    .populate([
                        { path: 'good', select: 'id name baseUnit type' },
                        { path: 'stocks.binLocations.binlocation', select: 'id code name' },
                        { path: 'lotLogs.bill', select: 'id code type' },
                        { path: 'lotLogs.binLocations.binLocation', select: 'id code name' }
                    ])
                    .sort({ 'expirationDate': 'asc' })
            }
            else {
                lots = await Lot(connect(DB_CONNECTION, portal))
                    .find({ stocks: { $elemMatch: { stock: arrayStock } }, quantity: { $ne: 0 }, type, lotType: lotType })
                    .populate([
                        { path: 'good', select: 'id name baseUnit type' },
                        { path: 'stocks.binLocations.binlocation', select: 'id code name' },
                        { path: 'lotLogs.bill', select: 'id code type' },
                        { path: 'lotLogs.binLocations.binLocation', select: 'id code name' }
                    ])
                    .sort({ 'expirationDate': 'asc' })
            }
        }
    }
    else {
        if (stock) {
            let option = { stocks: { $elemMatch: { stock: stock } }, quantity: { $ne: 0 }, type: type, lotType: lotType };

            if (query.code) {
                option.code = new RegExp(query.code, "i");
            }

            if (query.expirationDate) {
                let date = query.expirationDate.split("-");
                let end = new Date(date[2], date[1] - 1, date[0]);

                option = {
                    ...option,
                    expirationDate: {
                        $lte: end
                    }
                }
            }

            if (query.good) {
                option.good = query.good;
            }

            lots = await Lot(connect(DB_CONNECTION, portal))
                .paginate(option, {
                    limit,
                    page,
                    populate: [
                        { path: 'good', select: 'id name baseUnit type' },
                        { path: 'stocks.binLocations.binlocation', select: 'id code name' },
                        { path: 'lotLogs.bill', select: 'id code type' },
                        { path: 'lotLogs.binLocations.binLocation', select: 'id code name' }
                    ],
                    sort: { 'expirationDate': 'asc' }
                })
        }
        else {
            let option = { stocks: { $elemMatch: { stock: arrayStock } }, quantity: { $ne: 0 }, type: type, lotType: lotType };

            if (query.code) {
                option.code = new RegExp(query.code, "i");
            }

            if (query.expirationDate) {
                let date = query.expirationDate.split("-");
                let end = new Date(date[2], date[1] - 1, date[0]);

                option = {
                    ...option,
                    expirationDate: {
                        $lte: end
                    }
                }
            }

            if (query.good) {
                option.good = query.good;
            }

            lots = await Lot(connect(DB_CONNECTION, portal))
                .paginate(option, {
                    limit,
                    page,
                    populate: [
                        { path: 'good', select: 'id name baseUnit type' },
                        { path: 'stocks.binLocations.binlocation', select: 'id code name' },
                        { path: 'lotLogs.bill', select: 'id code type' },
                        { path: 'lotLogs.binLocations.binLocation', select: 'id code name' }
                    ],
                    sort: { 'expirationDate': 'asc' }
                })
        }
    }
    return lots;
}

exports.getDetailLot = async (id, portal) => {
    const lot = await Lot(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate([
            { path: 'good' },
            { path: 'stocks.binLocations.binLocation', select: 'id path' },
            { path: 'stocks.stock' },
            { path: 'lotLogs.bill', select: 'id code type' },
            { path: 'lotLogs.binLocations.binLocation' },
            { path: 'lotLogs.stock', select: 'id name' }
        ])
    return lot;
}

exports.createOrUpdateLots = async (data, portal) => {
    let lots = [];
    if (data.lots && data.lots.length > 0) {
        for (let i = 0; i < data.lots.length; i++) {
            let date = data.lots[i].expirationDate.split("-");
            let expirationDate = new Date(date[2], date[1] - 1, date[0]);
            let lot = await Lot(connect(DB_CONNECTION, portal)).find({ code: data.lots[i].code });
            if (lot && lot.length > 0) {
                lot[0].stocks[0].stock = data.stock;
                lot[0].stocks[0].quantity = data.lots[i].quantity;
                lot[0].originalQuantity = data.lots[i].quantity;
                lot[0].quantity = data.lots[i].quantity;
                lot[0].expirationDate = expirationDate;
                lot[0].code = lot[0].code;
                lot[0].good = lot[0].good;
                lot[0].lotType = lot[0].lotType;
                lot[0].type = data.type;
                lot[0].description = data.lots[i].note;
                lot[0].lotLogs[0].bill = data.bill;
                lot[0].lotLogs[0].quantity = data.lots[i].quantity;
                lot[0].lotLogs[0].description = data.lots[0].note;
                lot[0].lotLogs[0].type = data.typeBill;
                lot[0].lotLogs[0].stock = data.stock;

                await lot[0].save();
                lots.push(lot[0]);
            }
            else {
                const lotType = '2';
                let stock = {
                    stock: data.stock,
                    quantity: data.lots[i].quantity
                }
                let stocks = [];
                stocks.push(stock);

                let lotLog = {
                    bill: data.bill,
                    stock: data.stock,
                    quantity: data.lots[i].quantity,
                    type: data.typeBill,
                    description: data.lots[i].note,
                }
                let lotLogs = [];
                lotLogs.push(lotLog);

                let query = {
                    code: data.lots[i].code,
                    good: data.good,
                    type: data.type,
                    lotType: lotType,
                    stocks: stocks,
                    originalQuantity: data.lots[i].quantity,
                    quantity: data.lots[i].quantity,
                    expirationDate: expirationDate,
                    description: data.lots[i].note,
                    lotLogs: lotLogs

                }

                let lot = await Lot(connect(DB_CONNECTION, portal)).create(query);
                lots.push(lot);
            }
        }
    }

    return lots;
}

exports.deleteManyLots = async (arrayId, portal) => {
    for (let i = 0; i < arrayId.length; i++) {
        await Lot(connect(DB_CONNECTION, portal)).deleteOne({ _id: arrayId[i] });
    }
    return arrayId;
}

exports.editLot = async (id, data, portal) => {
    console.log(data);
    let lot = await Lot(connect(DB_CONNECTION, portal)).findById(id);
    const oldLot = lot;

    if (oldLot.stocks && oldLot.stocks.length > 0) {
        for (let i = 0; i < oldLot.stocks.length; i++) {
            if (oldLot.stocks[i].binLocations.length > 0) {
                for (let j = 0; j < oldLot.stocks[i].binLocations.length; j++) {
                    let binLocation = await BinLocation(connect(DB_CONNECTION, portal)).findById(oldLot.stocks[i].binLocations[j].binLocation._id)
                    let number = oldLot.stocks[i].binLocations[j].quantity;
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
        }
    }

    lot.code = data.code ? data.code : lot.code;
    lot.good = data.good ? data.good : lot.good;
    lot.stocks = data.stocks ? data.stocks.map(item => {
        return {
            stock: item.stock,
            quantity: item.quantity,
            binLocations: item.binLocations.map(x => { return { binLocation: x.binLocation, quantity: x.quantity } }),
        }
    }) : lot.stocks;
    lot.originalQuantity = data.originalQuantity ? data.originalQuantity : lot.originalQuantity;
    lot.quantity = data.originalQuantity ? data.originalQuantity : lot.quantity;
    lot.expirationDate = data.expirationDate ? data.expirationDate : lot.expirationDate;
    lot.description = data.description ? data.description : lot.description;
    lot.lotLogs = data.lotLogs ? data.lotLogs.map(item => {
        return {
            bill: item.bill,
            quantity: item.quantity,
            description: item.description,
            type: item.type,
            createdAt: item.createdAt,
            stock: item.stock,
            binLocations: item.binLocations.map(x => { return { binLocation: x.binLocation, quantity: x.quantity } }),
        }
    }) : lot.lotLogs;

    // Phần lô sản xuất
    lot.manufacturingCommand = data.manufacturingCommand ? data.manufacturingCommand : lot.manufacturingCommand;
    lot.productType = data.productType ? data.productType : lot.productType;
    lot.status = data.status ? data.status : lot.status;
    lot.creator = data.creator ? data.creator : lot.creator;

    await lot.save();

    if (data.stocks && data.stocks.length > 0) {
        for (let i = 0; i < data.stocks.length; i++) {
            if (data.stocks[i].binLocations.length > 0) {
                for (let j = 0; j < data.stocks[i].binLocations.length; j++) {
                    let binLocation = await BinLocation(connect(DB_CONNECTION, portal)).findById(data.stocks[i].binLocations[j].binLocation._id)
                    let number = data.stocks[i].binLocations[j].quantity;
                    if (binLocation.enableGoods.length > 0) {
                        for (let k = 0; k < binLocation.enableGoods.length; k++) {
                            if (binLocation.enableGoods[k].good._id.toString() === lot.good._id.toString()) {
                                if (binLocation.enableGoods[k].contained !== null) {
                                    binLocation.enableGoods[k].contained = Number(binLocation.enableGoods[k].contained) + Number(number);
                                    await binLocation.save();
                                }
                                else {
                                    binLocation.enableGoods[k].contained = 0 + Number(number);
                                    await binLocation.save();
                                }
                            }

                        }
                    }
                }
            }
        }
    }

    return await Lot(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate([
            { path: 'good' },
            { path: 'stocks.binLocations.binLocation' },
            { path: 'stocks.stock' },
            { path: 'lotLogs.bill', select: 'id code type' },
            { path: 'lotLogs.binLocations.binLocation' },
            { path: 'lotLogs.stock', select: 'id name' },
            { path: 'manufacturingCommand' },
            { path: 'creator' }
        ])
}

exports.getLotsByGood = async (query, portal) => {
    const { good, stock } = query;
    const lotType = '2';
    if (!stock) {
        return [];
    }
    const lots = await Lot(connect(DB_CONNECTION, portal))
        .find({ good: good, lotType: lotType, stocks: { $elemMatch: { stock: stock } } })
        .populate([
            { path: 'good' },
            { path: 'stocks.binLocations.binLocation', select: 'id path' },
            { path: 'stocks.stock' },
            { path: 'lotLogs.bill', select: 'id code type' },
            { path: 'lotLogs.binLocations.binLocation' },
            { path: 'lotLogs.stock', select: 'id name' }
        ])
    return lots;
}


exports.createManufacturingLot = async (data, portal) => {
    // data là một  mảng các lô
    let lots = await Lot(connect(DB_CONNECTION, portal)).insertMany(data);

    return { lots }

}

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

exports.getAllManufacturingLot = async (query, user, portal) => {
    let { page, limit, code, manufacturingCommandCode, good, createdAt, expirationDate, status, currentRole } = query;

    // Lọc lô sản xuất theo từng nhà máy (role truyền vào)

    // Lọc lô sản xuất theo người giám sát (Người tạo ra lô cũng có quyền xem)
    // Xử lý giống lọc lệnh sản xuất

    if (!currentRole) {
        throw Error("currentRole is not defined")
    }

    let option = {};
    option.type = "product";
    // Xử  lý các quyền trước để tìm ra các kế hoạch trong các nhà máy được phân quyền
    let role = [currentRole];
    const departments = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find({ 'deans': { $in: role } });
    let organizationalUnitId = departments.map(department => department._id);
    let listManufacturingWorks = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
        organizationalUnit: {
            $in: organizationalUnitId
        }
    });
    // Lấy ra các nhà máy mà currentRole cũng quản lý
    let listWorksByManageRole = await ManufacturingWorks(connect(DB_CONNECTION, portal)).find({
        manageRoles: {
            $in: role
        }
    })
    listManufacturingWorks = [...listManufacturingWorks, ...listWorksByManageRole];

    let listWorksId = listManufacturingWorks.map(x => x._id);


    // Kiểm tra userId hiện tại có giám sát lệnh nào không
    let userId = [user._id];
    let manufacturingCommand = await ManufacturingCommand(connect(DB_CONNECTION, portal))
        .find({
            accountables: {
                $in: userId
            }
        });
    let manufacturingCommandIds = manufacturingCommand.map(x => x._id);

    if (manufacturingCommandIds.length == 0) { // Nếu userId không có giám sát lệnh nào thì role kiểm soát nhà máy được xét đến
        // Lấy ra tất cả các xưởng mà quyền này được xem
        let listManufacturingMills = await ManufacturingMill(connect(DB_CONNECTION, portal)).find({
            manufacturingWorks: {
                $in: listWorksId
            }
        });

        let listMillIds = listManufacturingMills.map(x => x._id);
        // Lấy ra tất cả các lệnh của các xưởng này
        let listManufacturingCommands = await ManufacturingCommand(connect(DB_CONNECTION, portal))
            .find({
                manufacturingMill: {
                    $in: listMillIds
                }
            });
        let listManufacturingCommandIds = listManufacturingCommands.map(x => x._id);

        option.manufacturingCommand = {
            $in: listManufacturingCommandIds
        }
    } else if (manufacturingCommandIds.length != 0 && listWorksId.length != 0) {// Trường hợp cả kiểm soát nhà máy cả kiểm soát lệnh
        let manufacturingCommands = await ManufacturingCommand(connect(DB_CONNECTION, portal))
            .find({
                $or: [
                    {
                        _id: {
                            $in: manufacturingCommandIds
                        },
                    }, {
                        manufacturingMill: {
                            $in: listWorksId
                        }
                    }
                ]
            });
        option.manufacturingCommand = {
            $in: manufacturingCommands
        }
    }
    else { // Trường hợp kiểm soát lệnh không kiểm soát nhà máy
        option.manufacturingCommand = {
            $in: manufacturingCommandIds
        }
    }

    if (code) {
        option.code = new RegExp(code, "i");
    }
    if (manufacturingCommandCode) {
        let manufacturingCommands = await ManufacturingCommand(connect(DB_CONNECTION, portal))
            .find({
                code: new RegExp(manufacturingCommandCode, "i")
            });
        let manufacturingCommandIds = manufacturingCommands.map(x => x._id);
        option.manufacturingCommand = {
            $in: manufacturingCommandIds
        }
    }
    if (good) {
        option.good = good
    }

    if (createdAt) {
        option.createdAt = {
            '$gte': getArrayTimeFromString(createdAt)[0],
            '$lte': getArrayTimeFromString(createdAt)[1]
        }
    }

    if (expirationDate) {
        option.expirationDate = {
            '$gte': getArrayTimeFromString(expirationDate)[0],
            '$lte': getArrayTimeFromString(expirationDate)[1]
        }
    }

    if (status) {
        option.status = {
            $in: status
        }
    }

    if (!page || !limit) {
        let lots = await Lot(connect(DB_CONNECTION, portal)).find(option);
        return { lots }
    } else {
        let lots = await Lot(connect(DB_CONNECTION, portal))
            .paginate(option, {
                limit: limit,
                page: page,
                populate: [{
                    path: "good"
                }, {
                    path: "manufacturingCommand",
                    select: "code manufacturingMill",
                }, {
                    path: "creator"
                }]
            });

        return { lots }
    }

}

exports.getDetailManufacturingLot = async (id, portal) => {
    let lot = await Lot(connect(DB_CONNECTION, portal)).findById(id)
        .populate([{
            path: "good"
        }, {
            path: "manufacturingCommand",
            populate: [{
                path: "manufacturingMill",
                select: "code name",
                populate: [{
                    path: "teamLeader"
                }]
            }, {
                path: "responsibles"
            }, {
                path: "accountables"
            }, {
                path: "qualityControlStaffs.staff"
            }]
        }, {
            path: "creator"
        }, {
            path: 'lotLogs.bill', select: 'id code type'
        }, {
            path: 'lotLogs.binLocations.binLocation'
        }, {
            path: 'lotLogs.stock', select: 'id name'
        }]);
    return { lot }
}