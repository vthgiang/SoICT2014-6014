const VehicleService = require(`./vehicle.service`);
const Log = require(`../../../logs`);

// Lấy tất cả phương tiện vận chuyển 3
exports.getAllVehicleTransport3 = async (req, res) => {
  try {
    const {portal, query, currentRole} = req;
    const result = await VehicleService.getAllVehicleTransport3(portal, query, currentRole);
    res.status(200).json(result);
  } catch (error) {
    await Log.error(`Error at getAllVehicleTransport3: ${error}`);
    res.status(500).json({error: error.message});
  }
}
