
const { Lot, Good, Bill, BinLocation, Stock, ManufacturingCommand, OrganizationalUnit, ManufacturingWorks, ManufacturingMill } = require(`../../../../models`);
const { connect } = require(`../../../../helpers/dbHelper`);

exports.getAllLots = async (query, portal) => {
    let { page, limit, managementLocation } = query;

    if (!managementLocation) throw new Error("roles not avaiable");

    //lấy id các kho của role hiện tại
    const stocks = await Stock(connect(DB_CONNECTION, portal)).find({ managementLocation: { $elemMatch: { role: managementLocation } } })
    var arrayStock = [];
    if (stocks && stocks.length > 0) {
        for (let i = 0; i < stocks.length; i++) {
            arrayStock = [...arrayStock, stocks[i]._id];
        }
    }

    if (!limit || !page) {

        let options = { quantity: { $ne: 0 } };
        if (query.type)
            options.type = query.type;

        if (query.stock) {
            options.stocks = { $elemMatch: { stock: query.stock } };
        } else {
            options.stocks = { $elemMatch: { stock: arrayStock } };
        }

        if (query.good) {
            options.good = query.good;
        }

        let lots = await Lot(connect(DB_CONNECTION, portal))
            .find(options)
            .populate([
                { path: 'good', select: 'id name baseUnit type' },
                { path: 'stocks.binLocations.binlocation', select: 'id code name' },
                { path: 'lotLogs.bill', select: 'id code type' },
                { path: 'lotLogs.binLocations.binLocation', select: 'id code name' }
            ])
            .sort({ 'updatedAt': 'desc' })
        return lots
    }
    else {
        let option = { quantity: { $ne: 0 } };
        if (query.type)
            option.type = query.type;

        if (query.stock) {
            option.stocks = { $elemMatch: { stock: query.stock } };
        } else {
            option.stocks = { $elemMatch: { stock: arrayStock } };
        }

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

        let lots = await Lot(connect(DB_CONNECTION, portal))
            .paginate(option, {
                limit,
                page,
                populate: [
                    { path: 'good', select: 'id name baseUnit type' },
                    { path: 'stocks.binLocations.binlocation', select: 'id code name' },
                    { path: 'lotLogs.bill', select: 'id code type' },
                    { path: 'lotLogs.binLocations.binLocation', select: 'id code name' }
                ],
                sort: { 'updatedAt': 'desc' }
            })
        return lots;
    }
}

exports.getDetailLot = async (id, portal) => {
    const lot = await Lot(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate([
            { path: 'good' },
            { path: 'stocks.binLocations.binLocation', select: 'id path name' },
            { path: 'stocks.stock' },
            { path: "manufacturingCommand" },
            {
                path: 'lotLogs.bill',
                populate: [
                    { path: 'supplier' },
                    { path: 'customer' },
                    { path: 'manufacturingMill' },
                    { path: 'toStock' }
                ]
            },
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
            let rfid = {
                rfidCode: data.lots[i].rfidCode,
                quantity: data.lots[i].rfidQuantity
            }
            let rfids = [];
            rfids.push(rfid);
            let lot = await Lot(connect(DB_CONNECTION, portal)).findOne({ code: data.lots[i].code });
            if (lot) {
                lot.stocks[0].stock = data.stock;
                lot.stocks[0].quantity = data.lots[i].quantity;
                lot.originalQuantity = data.lots[i].quantity;
                lot.quantity = data.lots[i].quantity;
                lot.expirationDate = expirationDate;
                lot.code = lot.code;
                lot.good = lot.good;
                lot.type = data.type;
                lot.passedQualityControl = data.passedQualityControl;
                lot.rfid = rfids;
                lot.description = data.lots[i].note;
                lot.lotLogs[0].bill = data.bill;
                lot.lotLogs[0].quantity = data.lots[i].quantity;
                lot.lotLogs[0].inventory = data.lots[i].quantity;
                lot.lotLogs[0].description = data.lots[0].note;
                lot.lotLogs[0].type = data.typeBill;
                lot.lotLogs[0].stock = data.stock;

                await lot.save();
                lots.push(lot);
            }
            else {
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
                    inventory: data.lots[i].quantity,
                    type: data.typeBill,
                    description: data.lots[i].note,
                }
                let lotLogs = [];
                lotLogs.push(lotLog);

                let rfid = {
                    rfidCode: data.lots[i].rfidCode,
                    quantity: data.lots[i].rfidQuantity
                }
                let rfids = [];
                rfids.push(rfid);

                let query = {
                    code: data.lots[i].code,
                    good: data.good,
                    type: data.type,
                    passedQualityControl: data.passedQualityControl,
                    rfid: rfids,
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

exports.loadingGoodIntoBinLocation = async (data, lot, portal) => {
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
}


exports.editLot = async (id, data, portal) => {
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
            binLocations: item.binLocations.map(x => { return { binLocation: x.binLocation._id, quantity: x.quantity } }),
        }
    }) : lot.stocks;
    lot.originalQuantity = data.originalQuantity ? data.originalQuantity : lot.originalQuantity;
    lot.quantity = lot.stocks.map(item => { return item.quantity }).reduce((a, b) => a + b, 0);
    lot.expirationDate = data.expirationDate ? data.expirationDate : lot.expirationDate;
    lot.description = data.description ? data.description : lot.description;
    lot.lotLogs = data.lotLogs ? data.lotLogs.map(item => {
        return {
            bill: item.bill,
            quantity: item.quantity,
            inventory: lot.quantity,
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

    this.loadingGoodIntoBinLocation(data, lot, portal);

    return await Lot(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate([
            { path: 'good' },
            { path: 'stocks.binLocations.binLocation' },
            // { path: 'stocks.stock' },
            { path: 'lotLogs.bill', select: 'id code type' },
            { path: 'lotLogs.binLocations.binLocation' },
            { path: 'lotLogs.stock', select: 'id name' },
            { path: 'manufacturingCommand' },
            { path: 'creator', select: "_id name email avatar" }
        ])
}

exports.getLotsByGood = async (query, portal) => {
    const { good, stock, type } = query;
    let passedQualityControl = type ? (type === '1' || type === '2' ? 1 : 0) : null;
    let goodData = '';
    let option = {};
    if (Array.isArray(good) && good.length > 0) {
        var arrayGood = [];
        for (let i = 0; i < good.length; i++) {
            arrayGood = [...arrayGood, good[i]];
        }
        goodData = {
            $in: arrayGood
        }
    } else {
        goodData = good;
    }
    if (goodData)
        option.good = goodData;
    if (stock)
        option.stocks = { $elemMatch: { stock: stock } }
    else option.stocks = [];
    if (passedQualityControl)
        option.passedQualityControl = passedQualityControl;
    const lots = await Lot(connect(DB_CONNECTION, portal))
        .find(option)
        .populate([
            { path: 'good' },
            { path: 'stocks.binLocations.binLocation', select: 'id path name' },
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
    const departments = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find({ 'managers': { $in: role } });
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
                    populate: [{
                        path: "good",
                        select: "code name baseUnit numberExpirationDate materials",
                        populate: [{
                            path: "materials.good",
                            select: "code name baseUnit",
                        }]
                    }]
                }, {
                    path: "creator", select: "_id name email avatar"
                }],
                sort: {
                    "updatedAt": "desc"
                }
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
            }, {
                path: "good",
                select: "code name baseUnit numberExpirationDate materials",
                populate: [{
                    path: "materials.good",
                    select: "code name baseUnit",
                }]
            }]
        }, {
            path: "creator", select: "_id name email avatar"
        }, {
            path: 'lotLogs.bill', select: 'id code type'
        }, {
            path: 'lotLogs.binLocations.binLocation'
        }, {
            path: 'lotLogs.stock', select: 'id name'
        }, {
            path: 'bills',
            select: 'code'
        }]);
    return { lot }
}

exports.getInventoryByGoods = async (data, portal) => {
    const { array } = data;
    const group = '2';
    const status = ['1', '2'];
    let arrayGoods = [];
    for (let i = 0; i < array.length; i++) {
        let inventory = 0;
        let goodInventory = {};
        const lots = await Lot(connect(DB_CONNECTION, portal)).find({ good: array[i], quantity: { $ne: 0 } });
        if (lots.length > 0) {
            for (let j = 0; j < lots.length; j++) {
                inventory += Number(lots[j].quantity);
            }
            const good = await Good(connect(DB_CONNECTION, portal)).findById({ _id: lots[0].good });

            const bills = await Bill(connect(DB_CONNECTION, portal)).find({ goods: { $elemMatch: { good: good._id } }, group: group, status: { $in: status } });
            if (bills.length > 0) {
                for (let k = 0; k < bills.length; k++) {
                    for (let x = 0; x < bills[k].goods.length; x++) {
                        if (bills[k].goods[x].good.toString() === good._id.toString()) {
                            inventory -= Number(bills[k].goods[x].quantity)
                        }
                    }
                }
            }

            goodInventory.good = good;
            goodInventory.inventory = inventory;
            arrayGoods = [...arrayGoods, goodInventory];
        }
        else {
            const good = await Good(connect(DB_CONNECTION, portal)).findById({ _id: array[i] });
            goodInventory.good = good;
            goodInventory.inventory = 0;
            arrayGoods = [...arrayGoods, goodInventory];
        }
    }

    return arrayGoods;
}

exports.getInventories = async (query, portal) => {
    const { stock, category, type, managementLocation } = query;
    let data = [];
    let optionGood = { type: type };
    if (category) {
        optionGood.category = category;
    }

    if (!managementLocation) throw new Error("roles not avaiable");

    //lấy id các kho của role hiện tại
    const stocks = await Stock(connect(DB_CONNECTION, portal)).find({ managementLocation: { $elemMatch: { role: managementLocation } } })
    var arrayStock = [];
    if (stocks && stocks.length > 0) {
        for (let i = 0; i < stocks.length; i++) {
            arrayStock = [...arrayStock, stocks[i]._id];
        }
    }

    const goods = await Good(connect(DB_CONNECTION, portal)).find(optionGood);
    if (goods.length > 0) {
        for (let i = 0; i < goods.length; i++) {
            let inventory = 0;
            let goodIssue = 0;
            let goodReceipt = 0;
            let goodIssued = 0;
            let goodReceipted = 0;
            let goodInventory = {};
            let options = { good: goods[i]._id };
            let optionBill = {};
            if (query.stock) {
                options.stocks = { $elemMatch: { stock: query.stock } };
                optionBill.fromStock = query.stock;
            }
            else {
                options.stocks = { $elemMatch: { stock: arrayStock } };
            }

            if (query.startDate && query.endDate) {
                let date1 = query.startDate.split("-");
                let date2 = query.endDate.split("-");
                let start = new Date(date1[1], date1[0] - 1, 1);
                let end = new Date(date2[1], date2[0], 1);

                optionBill = {
                    ...optionBill,
                    createdAt: {
                        $gt: start,
                        $lte: end
                    }
                }
            } else {
                if (query.startDate) {
                    let date1 = query.startDate.split("-");
                    let start = new Date(date1[1], date1[0] - 1, 1);

                    optionBill = {
                        ...optionBill,
                        createdAt: {
                            $gt: start
                        }
                    }
                }
                if (query.endDate) {
                    let date2 = query.endDate.split("-");
                    let end = new Date(date2[1], date2[0], 1);

                    optionBill = {
                        ...optionBill,
                        createdAt: {
                            $lte: end
                        }
                    },

                        options = {
                            ...options,
                            createdAt: {
                                $lte: end
                            }
                        }
                }
            }

            //Lấy số lượng tồn kho
            const lots = await Lot(connect(DB_CONNECTION, portal)).find(options);
            if (lots.length > 0) {
                for (let j = 0; j < lots.length; j++) {
                    if (stock === undefined) {
                        inventory += Number(lots[j].quantity);
                    }
                    else {
                        stock.map(stockId => {
                            lots[j].stocks.map(stockLot => {
                                if (stockId.toString() === stockLot.stock.toString()) {
                                    inventory += Number(stockLot.quantity);
                                }
                            })
                        })
                    }
                }
            }

            //Lấy số lượng sắp xuất kho
            optionBill.goods = { $elemMatch: { good: goods[i]._id } };
            optionBill.status = "1";
            optionBill.group = '2';
            const goodIssueBills = await Bill(connect(DB_CONNECTION, portal)).find(optionBill);
            if (goodIssueBills.length > 0) {
                for (let k = 0; k < goodIssueBills.length; k++) {
                    for (let x = 0; x < goodIssueBills[k].goods.length; x++) {
                        if (goodIssueBills[k].goods[x].good.toString() === goods[i]._id.toString()) {
                            goodIssue += Number(goodIssueBills[k].goods[x].quantity)
                        }
                    }
                }
            }

            //Lấy số lượng sắp nhập kho
            optionBill.group = '1';
            const goodReceiptBills = await Bill(connect(DB_CONNECTION, portal)).find(optionBill);
            if (goodReceiptBills.length > 0) {
                for (let k = 0; k < goodReceiptBills.length; k++) {
                    for (let x = 0; x < goodReceiptBills[k].goods.length; x++) {
                        if (goodReceiptBills[k].goods[x].good.toString() === goods[i]._id.toString()) {
                            goodReceipt += Number(goodReceiptBills[k].goods[x].quantity)
                        }
                    }
                }
            }

            //Lấy số lượng đã xuất kho
            optionBill.goods = { $elemMatch: { good: goods[i]._id } };
            optionBill.status = '2';
            optionBill.group = '2';
            const goodIssuedBills = await Bill(connect(DB_CONNECTION, portal)).find(optionBill);
            if (goodIssuedBills.length > 0) {
                for (let k = 0; k < goodIssuedBills.length; k++) {
                    for (let x = 0; x < goodIssuedBills[k].goods.length; x++) {
                        if (goodIssuedBills[k].goods[x].good.toString() === goods[i]._id.toString()) {
                            goodIssued += Number(goodIssuedBills[k].goods[x].quantity)
                        }
                    }
                }
            }

            //Lấy số lượng đã nhập kho
            optionBill.group = '1';
            const goodReceiptedBills = await Bill(connect(DB_CONNECTION, portal)).find(optionBill);
            if (goodReceiptedBills.length > 0) {
                for (let k = 0; k < goodReceiptedBills.length; k++) {
                    for (let x = 0; x < goodReceiptedBills[k].goods.length; x++) {
                        if (goodReceiptedBills[k].goods[x].good.toString() === goods[i]._id.toString()) {
                            goodReceipted += Number(goodReceiptedBills[k].goods[x].quantity)
                        }
                    }
                }
            }

            goodInventory.name = goods[i].name;
            goodInventory.inventory = inventory;
            goodInventory.goodIssue = goodIssue;
            goodInventory.goodReceipt = goodReceipt;
            goodInventory.goodIssued = goodIssued;
            goodInventory.goodReceipted = goodReceipted;
            data = [...data, goodInventory];
        }
    }
    return data;
}

exports.getInventoryInStockByGoods = async (query, portal) => {
    let { goodId, managementLocation, stock, startMonth, endMonth } = query;
    let optionBill = {};
    let optionLot = {};
    var arrayStock = [];
    if (!managementLocation) throw new Error("roles not avaiable");
    if (!goodId) {
        const optionGood = { type: 'material' };
        const goods = await Good(connect(DB_CONNECTION, portal)).find(optionGood);
        goodId = goods[0]._id;
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

    optionBill = {
        ...optionBill,
        createdAt: {
            $gt: start,
            $lte: end
        }
    }

    optionLot = {
        ...optionLot,
        createdAt: {
            $gt: start,
            $lte: end
        }
    }
    optionLot.good = goodId;
    optionLot.quantity = { $ne: 0 };
    optionLot = {
        ...optionLot,
        stocks: { $elemMatch: { stock: arrayStock } }
    }
    let lots = await Lot(connect(DB_CONNECTION, portal)).find(optionLot);

    optionBill = {
        ...optionBill,
        goods: { $elemMatch: { good: [goodId] } }
    }
    optionBill.status = '1';
    optionBill.group = '1';
    optionBill = {
        ...optionBill,
        fromStock: query.stock ? query.stock : arrayStock,
    }

    let billsWillReceipt = await Bill(connect(DB_CONNECTION, portal)).find(optionBill);

    optionBill.group = '2';
    let billsWillIssue = await Bill(connect(DB_CONNECTION, portal)).find(optionBill);

    optionBill.status = '2';
    optionBill.group = '1';
    let billsReceipted = await Bill(connect(DB_CONNECTION, portal)).find(optionBill);

    optionBill.status = '2';
    optionBill.group = '2';
    let billsIssued = await Bill(connect(DB_CONNECTION, portal)).find(optionBill);
    
    return {
        "billsWillReceipt": billsWillReceipt,
        "billsWillIssue": billsWillIssue,
        "billsReceipted": billsReceipted,
        "billsIssued": billsIssued,
        "lots": lots
    };
}

exports.getManufacturingLotNumber = async (query, portal) => {
    const { currentRole, manufacturingWorks, fromDate, toDate } = query;
    if (!currentRole) {
        throw Error("CurrentRole is not defined");
    }
    // Lấy ra list các nhà máy là currentRole là trưởng phòng hoặc currentRole là role quản lý khác
    // Lấy ra list nhà máy mà currentRole là quản đốc nhà máy
    let role = [currentRole];
    const departments = await OrganizationalUnit(connect(DB_CONNECTION, portal)).find({ 'managers': { $in: role } });
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

    if (manufacturingWorks) {
        listWorksId = manufacturingWorks;
    }

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

    let options = {};
    options.manufacturingCommand = {
        $in: listManufacturingCommandIds
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
    const lot1 = await Lot(connect(DB_CONNECTION, portal)).find(options).count();

    options.status = 2;
    const lot2 = await Lot(connect(DB_CONNECTION, portal)).find(options).count();

    options.status = 3;
    const lot3 = await Lot(connect(DB_CONNECTION, portal)).find(options).count();

    return { lot1, lot2, lot3 }
}
