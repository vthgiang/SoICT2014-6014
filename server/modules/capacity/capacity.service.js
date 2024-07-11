const mongoose = require("mongoose");
const { Capacity } = require("../../models")
const { connect } = require('../../helpers/dbHelper')

/**
 * Lấy danh sách capacity
 * @param params
 */
exports.getAllCapacities = async (portal, params) => {
  const { name, key, limit, page } = params;
  let searchConditions = {};

  if (name && name.length !== 0) {
    searchConditions = {
      ...searchConditions,
      name: {
        $regex: name,
        $options: "i"
      }
    };
  }
  if (key && key.length !== 0) {
    searchConditions = {
      ...searchConditions,
      key: {
        $regex: key,
        $options: "i"
      }
    };
  }

  if (limit === undefined || page === undefined) {
    const data = await Capacity(connect(DB_CONNECTION, portal)).find(searchConditions)
      .sort({ createdAt: -1 });

    return {
      listCapacity: data,
      totalList: data.length
    };
  } else {
    const skip = parseInt(page - 1) * parseInt(limit);
    const limitNumber = parseInt(limit);

    const listCapacity = await Capacity(connect(DB_CONNECTION, portal))
      .find(searchConditions)
      .sort({
        createdAt: -1
      })
      .skip(skip)
      .limit(limitNumber)

    // You need to calculate the total number of documents that match the search conditions for pagination
    const totalList = await Capacity(connect(DB_CONNECTION, portal)).countDocuments(searchConditions);

    return {
      listCapacity,
      totalList
    };
  }
};


exports.createNewCapacity = async (portal, data) => {
  try {
    const existingCapacity = await Capacity(connect(DB_CONNECTION, portal)).findOne({
      $or: [
        { name: data.name },
        { key: data.key }
      ]
    });

    if (existingCapacity) {
      throw ['capacity_already_exist']
    }

    const newCapacity = await Capacity(connect(DB_CONNECTION, portal)).create({
      ...data
    });
    return newCapacity
  } catch (error) {
    throw error
  }
}

exports.getOneCapacity = async (portal, id) => {
  try {
    let findCapacity = await Capacity(connect(DB_CONNECTION, portal)).findOne({
      _id: id
    })
    return findCapacity
  } catch (error) {
    throw error
  }
}

exports.updateCapacity = async (portal, id, data) => {
  try {
    let findCapacity = await Capacity(connect(DB_CONNECTION, portal)).findOne({
      _id: id
    })
    if (!findCapacity) {
      throw ['capacity_not_found']
    }
    const updatedCapacity = await Capacity(connect(DB_CONNECTION, portal)).findByIdAndUpdate(id, data, { new: true });
    return updatedCapacity
  } catch (error) {
    throw error
  }
}

exports.deleteCapacity = async (portal, id) => {
  try {
    let findCapacity = await Capacity(connect(DB_CONNECTION, portal)).findOne({
      _id: id
    })
    if (!findCapacity) {
      throw ['capacity_not_found']
    }
    await Capacity(connect(DB_CONNECTION, portal)).deleteOne({
      _id: id,
    })
    return findCapacity
  } catch (error) {
    throw error
  }
} 