const { CostFormula } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);

exports.createOrUpdateVehicleCostFormula = async (portal, data) => {
    let vehicleCostFormula;

    vehicleCostFormula = await CostFormula(connect(DB_CONNECTION,portal)).findOne({});

    if (vehicleCostFormula) {
        if (data.shipper) {
            vehicleCostFormula.shipper = data.shipper;
        }
        if (data.vehicle) {
            vehicleCostFormula.vehicle = data.vehicle;
        }
        vehicleCostFormula.save();
    } else {
        vehicleCostFormula = await CostFormula(connect(DB_CONNECTION, portal)).create({
            vehicle: data.vehicle ? data.vehicle : "",
            shipper: data.shipper ? data.shipper : ""
        });
    }
    let newCost = await CostFormula(connect(DB_CONNECTION, portal)).findOne({_id: vehicleCostFormula._id});

    return newCost;
}

exports.getVehicleCostFormula = async (portal) => {
    let costFormula = await CostFormula(connect(DB_CONNECTION, portal)).findOne();
    return {
        data: costFormula
    }
}