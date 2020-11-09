const { Lot, BinLocation } = require(`${SERVER_MODELS_DIR}`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

exports.getAllLots = async (query, portal) => {
    let { stock, good, page, limit, type } = query;
    let lots;
    if(!limit && !page){
        if(stock) {
            if(good) {
                lots = await Lot(connect(DB_CONNECTION, portal))
                .find({ stocks: { $elemMatch: { stock: stock } }, quantity: { $ne: 0 }, good, type })
                .populate([
                    { path: 'good', select: 'id name baseUnit type'},
                    { path: 'stocks.binLocations.binlocation', select: 'id code name'},
                    { path: 'lotLogs.bill', select: 'id code type'},
                    { path: 'lotLogs.binLocations.binLocation', select: 'id code name'}
                ])
                .sort({ 'expirationDate': 'asc' })
            }
            else {
                lots = await Lot(connect(DB_CONNECTION, portal))
                .find({ stocks: { $elemMatch: { stock: stock } }, quantity: { $ne: 0 }, type })
                .populate([
                    { path: 'good', select: 'id name baseUnit type'},
                    { path: 'stocks.binLocations.binlocation', select: 'id code name'},
                    { path: 'lotLogs.bill', select: 'id code type'},
                    { path: 'lotLogs.binLocations.binLocation', select: 'id code name'}
                ])
                .sort({ 'expirationDate': 'asc' })
            }
        }
        else {
            if(good){
                lots = await Lot(connect(DB_CONNECTION, portal))
                .find({ quantity: { $ne: 0 }, good, type })
                .populate([
                    { path: 'good', select: 'id name baseUnit type'},
                    { path: 'stocks.binLocations.binlocation', select: 'id code name'},
                    { path: 'lotLogs.bill', select: 'id code type'},
                    { path: 'lotLogs.binLocations.binLocation', select: 'id code name'}
                ])
                .sort({ 'expirationDate': 'asc' })
            }
            else {
                lots = await Lot(connect(DB_CONNECTION, portal))
                .find({ quantity: { $ne: 0 }, type })
                .populate([
                    { path: 'good', select: 'id name baseUnit type'},
                    { path: 'stocks.binLocations.binlocation', select: 'id code name'},
                    { path: 'lotLogs.bill', select: 'id code type'},
                    { path: 'lotLogs.binLocations.binLocation', select: 'id code name'}
                ])
                .sort({ 'expirationDate': 'asc' })
            }
        }
    }
    else {
        if(stock) {
            let option = { stocks: { $elemMatch: { stock: stock } }, quantity: { $ne: 0 }, type: type };

            if(query.name) {
                option.name = new RegExp(query.name, "i");
            }

            if(query.expirationDate){
                let date = query.expirationDate.split("-");
                let end = new Date(date[2], date[1] - 1, date[0]);

                option = {
                    ...option,
                    expirationDate: {
                        $lte: end
                    }
                }
            }

            if(query.good){
                option.good = query.good;
            }

            lots = await Lot(connect(DB_CONNECTION, portal))
                .paginate(option, {
                    limit,
                    page,
                    populate: [
                        { path: 'good', select: 'id name baseUnit type'},
                        { path: 'stocks.binLocations.binlocation', select: 'id code name'},
                        { path: 'lotLogs.bill', select: 'id code type'},
                        { path: 'lotLogs.binLocations.binLocation', select: 'id code name'}
                    ],
                    sort: { 'expirationDate': 'asc' }
                })
        }
        else {
            let option = { quantity: { $ne: 0 }, type: type };

            if(query.name) {
                option.name = new RegExp(query.name, "i");
            }

            if(query.expirationDate){
                let date = query.expirationDate.split("-");
                let end = new Date(date[2], date[1] - 1, date[0]);

                option = {
                    ...option,
                    expirationDate: {
                        $lte: end
                    }
                }
            }

            if(query.good){
                option.good = query.good;
            }

            lots = await Lot(connect(DB_CONNECTION, portal))
                .paginate(option, {
                    limit,
                    page,
                    populate: [
                        { path: 'good', select: 'id name baseUnit type'},
                        { path: 'stocks.binLocations.binlocation', select: 'id code name'},
                        { path: 'lotLogs.bill', select: 'id code type'},
                        { path: 'lotLogs.binLocations.binLocation', select: 'id code name'}
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
            { path: 'good'},
            { path: 'stocks.binLocations.binLocation', select: 'id path'},
            { path: 'stocks.stock'},
            { path: 'lotLogs.bill', select: 'id code type'},
            { path: 'lotLogs.binLocations.binLocation'},
            { path: 'lotLogs.stock', select: 'id name'}
        ])
    return lot;
}

exports.editLot = async (id, data, portal) => {
    let lot = await Lot(connect(DB_CONNECTION, portal)).findById(id);
    const oldLot = lot;
    
    if(oldLot.stocks.length > 0) {
        for(let i = 0; i < oldLot.stocks.length; i++) {
            if(oldLot.stocks[i].binLocations.length > 0) {
                console.log(oldLot.stocks[i].binLocations.length);
                for(let j = 0; j < oldLot.stocks[i].binLocations.length; j++) {
                    let binLocation = await BinLocation(connect(DB_CONNECTION, portal)).findById(oldLot.stocks[i].binLocations[j].binLocation._id )
                    let number = oldLot.stocks[i].binLocations[j].quantity;
                    if(binLocation.enableGoods.length > 0) {
                        for (let k = 0; k < binLocation.enableGoods.length; k++) {
                            if(binLocation.enableGoods[k].good._id.toString() === lot.good._id.toString()){
                                if(binLocation.enableGoods[k].contained !== null){
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

    lot.name = data.name ? data.name : lot.name;
    lot.good = data.good ? data.good : lot.good;
    lot.stocks = data.stocks ? data.stocks.map(item => {
        return {
            stock: item.stock,
            quantity: item.quantity,
            binLocations: item.binLocations.map(x => { return { binLocation: x.binLocation, quantity: x.quantity }}),
        }
    }) : lot.stocks;
    lot.originalQuantity = lot.originalQuantity;
    lot.quantity = lot.quantity;
    lot.expirationDate = lot.expirationDate;
    lot.description = lot.description;
    lot.lotLogs = data.lotLogs ? data.lotLogs.map(item => {
        return {
            bill: item.bill,
            quantity: item.quantity,
            description: item.description,
            type: item.type,
            createdAt: item.createdAt,
            stock: item.stock,
            binLocations: item.binLocations.map(x => { return { binLocation: x.binLocation, quantity: x.quantity }}),
        }
    }) : lot.lotLogs;
    
    await lot.save();

    if(data.stocks.length > 0) {
        for(let i = 0; i < data.stocks.length; i++) {
            if(data.stocks[i].binLocations.length > 0) {
                for(let j = 0; j < data.stocks[i].binLocations.length; j++) {
                    let binLocation = await BinLocation(connect(DB_CONNECTION, portal)).findById(data.stocks[i].binLocations[j].binLocation._id )
                    let number = data.stocks[i].binLocations[j].quantity;
                    if(binLocation.enableGoods.length > 0) {
                        for (let k = 0; k < binLocation.enableGoods.length; k++) {
                            if(binLocation.enableGoods[k].good._id.toString() === lot.good._id.toString()){
                                if(binLocation.enableGoods[k].contained !==null){
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
            { path: 'good'},
            { path: 'stocks.binLocations.binLocation'},
            { path: 'stocks.stock'},
            { path: 'lotLogs.bill', select: 'id code type'},
            { path: 'lotLogs.binLocations.binLocation'},
            { path: 'lotLogs.stock', select: 'id name'}
        ])
}

exports.getLotsByGood = async (query, portal) => {
    const { good, stock } = query;
    if(!stock) {
        return [];
    }
    const lots = await Lot(connect(DB_CONNECTION, portal))
        .find({ good: good, stocks: { $elemMatch: { stock: stock } } })
        .populate([
            { path: 'good'},
            { path: 'stocks.binLocations.binLocation', select: 'id path'},
            { path: 'stocks.stock'},
            { path: 'lotLogs.bill', select: 'id code type'},
            { path: 'lotLogs.binLocations.binLocation'},
            { path: 'lotLogs.stock', select: 'id name'}
        ])
    return lots;
}