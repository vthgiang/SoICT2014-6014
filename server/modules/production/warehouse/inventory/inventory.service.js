const { Lot } = require(`${SERVER_MODELS_DIR}`);
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);

exports.getAllLots = async (query, portal) => {
    let { page, limit, stock } = query;
    console.log(query);
    if(!page && !limit) {
        if(stock) {
            return await Lot(connect(DB_CONNECTION, portal))
            .find({ stocks: { $elemMatch: { stock: stock } }, quantity: { $ne: 0 } })
            .populate([
                { path: 'good', select: 'id name baseUnit'},
                { path: 'stocks.binLocations.binlocation', select: 'id code name'},
                { path: 'lotLogs.bill', select: 'id code type'},
                { path: 'lotLogs.binLocations.binLocation', select: 'id code name'}
            ])
        }
        else {
            return await Lot(connect(DB_CONNECTION, portal))
            .find({ quantity: { $ne: 0 } })
            .populate([
                { path: 'good', select: 'id name baseUnit'},
                { path: 'stocks.binLocations.binlocation', select: 'id code name'},
                { path: 'lotLogs.bill', select: 'id code type'},
                { path: 'lotLogs.binLocations.binLocation', select: 'id code name'}
            ])
        }
    }
    else {
        if(stock) {
            let option = { stocks: { $elemMatch: { stock: stock } }, quantity: { $ne: 0 } };

            if(query.name) {
                option.name = new RegExp(query.name, "i")
            }

            if(query.expirationDate){
                option.expirationDate = query.expirationDate
            }

            return await Lot(connect(DB_CONNECTION, portal))
                .find(option)
                .populate([
                    { path: 'good', select: 'id name baseUnit'},
                    { path: 'stocks.binLocations.binlocation', select: 'id code name'},
                    { path: 'lotLogs.bill', select: 'id code type'},
                    { path: 'lotLogs.binLocations.binLocation', select: 'id code name'}
                ])
        }
        else {
            let option = { quantity: { $ne: 0 } };

            if(query.name) {
                option.name = new RegExp(query.name, "i")
            }

            if(query.expirationDate){
                option.expirationDate = query.expirationDate
            }

            return await Lot(connect(DB_CONNECTION, portal))
                .find(option)
                .populate([
                    { path: 'good', select: 'id name baseUnit'},
                    { path: 'stocks.binLocations.binlocation', select: 'id code name'},
                    { path: 'lotLogs.bill', select: 'id code type'},
                    { path: 'lotLogs.binLocations.binLocation', select: 'id code name'}
                ])
        }
    }
}