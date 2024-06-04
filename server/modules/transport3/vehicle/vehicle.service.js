const {
  Transport3Vehicle,
} = require('../../../models');

const {
  connect
} = require(`../../../helpers/dbHelper`);
const mongoose = require('mongoose');
const {searchAssetProfiles} = require('../../asset/asset-management/asset.service');

exports.getAllVehicleTransport3 = async (portal, query, currentRole, companyId) => {
  let vehicles = await searchAssetProfiles(portal, companyId, {group: ['vehicle']});
  return vehicles;
}
