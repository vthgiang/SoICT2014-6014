
const { Lot } = require(`../../../../models`);
const { connect } = require(`../../../../helpers/dbHelper`);

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
