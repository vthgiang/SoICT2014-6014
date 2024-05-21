const {
  connect
} = require(`../../../helpers/dbHelper`)

const { LoggingRecord } = require("../../../models");


exports.create = (portal, type, status, target, payload) => {
  return LoggingRecord(connect(DB_CONNECTION, portal)).create({
    type: type,
    status: status,
    target: target,
    payload: payload,
    timestamp: new Date(),
  });
}

exports.findAll = async (portal, queryParams = {}) => {
  let query = {};
  const { page, perPage } = queryParams;

  if (queryParams) {
    if (queryParams.type) {
      query = {
        ...query,
        type: queryParams.type,
      };
    }

    if (queryParams.target) {
      query = {
        ...query,
        target: queryParams.target,
      };
    }
  }

  const loggingRecords = await LoggingRecord(connect(DB_CONNECTION, portal))
    .find(query)
    .skip(page)
    .limit(perPage)
    .sort({ timestamp: 'desc' });

  const totalLoggingRecords = await LoggingRecord(connect(DB_CONNECTION, portal)).countDocuments(query);
  const totalPages = perPage ? Math.ceil(totalLoggingRecords / perPage) : 1;

  return {
    data: loggingRecords,
    totalLoggingRecords,
    totalPages,
  };
}