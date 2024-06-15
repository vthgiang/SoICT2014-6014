const {
  Transport3Vehicle, Transport3Schedule,
} = require('../../../models');

const {
  connect
} = require(`../../../helpers/dbHelper`);
const {searchAssetProfiles} = require('../../asset/asset-management/asset.service');

// Lấy tất cả phương tiện vận chuyển 3
exports.getAllVehicleTransport3 = async (portal, query, currentRole, companyId) => {
  const {page, perPage} = query;
  let vehicle_assets = await searchAssetProfiles(portal, companyId, {group: ['vehicle']});
  let vehicles = await Transport3Vehicle(connect(DB_CONNECTION, portal)).find({})
    .populate('asset');
  // list nhung xe chua duoc gan tu vehicle_assets vao vehicles
  let list = [];
  vehicle_assets.data.map(vehicle => {
    let vehicleInVehicles = vehicles.find(v => v.asset._id.toString() === vehicle._id.toString());
    if (!vehicleInVehicles) {
      list.push(vehicle);
    }
  });

  list.length > 0 && await Transport3Vehicle(connect(DB_CONNECTION, portal)).insertMany(list.map(v => {
    return {
      asset: v._id,
      code: v.code,
      tonnage: v.tonnage,
      volume: v.volume,
      width: v.width,
      height: v.height,
      depth: v.depth,
      averageGasConsume: v.averageGasConsume,
      averageFeeTransport: v.averageFeeTransport,
      minVelocity: v.minVelocity,
      maxVelocity: v.maxVelocity,
    };
  }));

  vehicles = await Transport3Vehicle(connect(DB_CONNECTION, portal)).find({}).populate('asset').skip((page - 1) * perPage).limit(parseInt(perPage));
  return vehicles;
}

// Sửa thông tin phương tiện vận chuyển 3
exports.editVehicleTransport3 = async (portal, id, data) => {
  return await Transport3Vehicle(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id,
    {$set: data},
    {new: true});
}

// Danh sách các xe đang vận chuyển
exports.getVehicleTransporting = async (portal, companyId) => {
  let schedule_status_2 = await Transport3Schedule(connect(DB_CONNECTION, portal)).find({status: 2});
  let vehicles_id = schedule_status_2.map(s => s.vehicles);
  let vehicles = await Transport3Vehicle(connect(DB_CONNECTION, portal)).find({}).populate('asset');
  vehicles = vehicles.filter(v => {
    return vehicles_id.map(v => v.toString()).includes(v.asset._id.toString());
  });
  return vehicles;
}
