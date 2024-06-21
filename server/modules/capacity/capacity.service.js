const mongoose = require("mongoose");
const { Capacity } = require("../../models")
const { connect } = require('../../helpers/dbHelper')

/**
 * Lấy danh sách capacity
 * @param params
 */
exports.getAllCapacities = async (portal, params) => {
  const { name, key, limit, page } = params
  let searchConditions = {};
  if (name && name.length !== 0) {
    searchConditions = {
      ...searchConditions,
      name: {
        $regex: name,
        $option: "i"
      }
    }
  }
  if (key && key.length !== 0) {
    searchConditions = {
      ...searchConditions,
      name: {
        $regex: key,
        $option: "i"
      }
    }
  }

  if (limit === undefined || page === undefined) {
    const data = await Capacity(connect(DB_CONNECTION, portal)).find(searchConditions)
      .sort({ createdAt: -1 })
    
    return {
      listCapacity: data,
      totalList: data?.length
    }
  } else {
    const skip = parseInt(page) * parseInt(limit);
    const limitNumber = parseInt(limit);
    // console.log("page: ", page)
    // console.log("limit: ", limit)
    const data = await Capacity(connect(DB_CONNECTION, portal)).find(searchConditions)
    const listCapacity = await Capacity(connect(DB_CONNECTION, portal))
      .find(searchConditions)
      .sort({
        createdAt: 'desc'
      })
      .limit(limitNumber)
      .skip(skip)
    
    return {
      listCapacity,
      totalList: data?.length
    }
  }
}
