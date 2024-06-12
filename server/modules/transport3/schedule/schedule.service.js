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
    let stock = await Stock(connect(DB_CONNECTION, portal)).aggregate([
        {
            $geoNear: {
            near: {
                type: 'Point',
                coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            distanceField: 'distance',
            maxDistance: 1000,
            spherical: true
            }
        },
        {
            $lookup: {
            from: 'transports3_schedules',
            localField: '_id',
            foreignField: 'stockId',
            as: 'schedule'
            }
        },
        {
            $unwind: {
            path: '$schedule',
            preserveNullAndEmptyArrays: true
            }
        },
        {
            $match: {
            'schedule.status': 'active'
            }
        },
        {
            $project: {
            _id: 1,
            name: 1,
            address: 1,
            phone: 1,
            email: 1,
            schedule: 1
            }
        }
        ]);
    console.log('stock', stock);
    return stock;
  } catch (error) {
    throw new Error(error.message);
  }
};
