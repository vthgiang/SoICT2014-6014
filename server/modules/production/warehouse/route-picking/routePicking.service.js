const { RoutePicking } = require('../../../../models');
const { connect } = require(`../../../../helpers/dbHelper`);
const moment = require('moment');
const mongoose = require('mongoose');

exports.getAllChemins = async (portal, data) => {
  return await RoutePicking(connect(DB_CONNECTION, portal))
    .find()
    .populate([
      {
        path: 'orderId',
        select: 'code',
      },
      {
        path: 'listInfoOrders.good',
        select: 'name',
      },
    ]);
  // console.log(allChemins)
};

// api get chemin detail
exports.getChemin = async (id, portal) => {
  return await RoutePicking(connect(DB_CONNECTION, portal))
    .findById(id)
    .populate([
      {
        path: 'orderId',
        select: 'code',
      },
      {
        path: 'listInfoOrders.good',
        select: 'name',
      },
    ]);
};
