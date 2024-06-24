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
    res.status(500).json({messages: [`Lấy thông tin phương tiện thất bại`]});
  }
}

// Sửa thông tin phương tiện vận chuyển 3
exports.editVehicleTransport3 = async (req, res) => {
  try {
    const {portal, id, data} = req;
    const result = await VehicleService.editVehicleTransport3(portal, id, data);
    res.status(200).json(result);
  } catch (error) {
    await Log.error(`Error at editVehicleTransport3: ${error}`);
    res.status(500).json({messages: [`Cập nhật thông tin phương tiện thất bại`]});
  }
}

// Danh sách các xe đang vận chuyển
exports.getVehicleTransporting = async (req, res) => {
  try {
    const {portal, companyId} = req;
    const result = await VehicleService.getVehicleTransporting(portal, companyId);
    res.status(200).json(result);
  } catch (error) {
    await Log.error(`Error at getVehicleTransport3: ${error}`);
    res.status(500).json({messages: [`Lấy thông tin phương tiện thất bại`]});
  }
}
