const {
  Transport3Schedule,
  Stock
} = require('../../../models');

const {
  connect
} = require(`../../../helpers/dbHelper`);
const mongoose = require('mongoose');

exports.getNearestDepot = async (portal, query) => {
  try {
    let { lat, lng } = query;
    let stock = await Stock.find({
      portal,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          }
        }
      }
    }).limit(1);
    return stock;
  } catch (error) {
    throw new Error(error.message);
  }
};
