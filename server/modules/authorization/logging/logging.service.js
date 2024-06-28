const {
  connect
} = require(`../../../helpers/dbHelper`)

const { AuthorizationAccessLog } = require("../../../models");


exports.create = (portal, requesterId, resourceId, accessStatus, policyId) => {
  AuthorizationAccessLog(connect(DB_CONNECTION, portal)).create({
    requesterId,
    resourceId,
    accessStatus,
    policyId
  });
}

exports.getLogs = async (portal, queryParams = {}) => {
  let query = {};
  const page = queryParams?.page ? Number(queryParams.page) : 1;
  const perPage = queryParams?.perPage ? Number(queryParams?.perPage) : 20;

  if (queryParams) {
    if (queryParams.accessStatus) {
      query = {
        ...query,
        accessStatus: {$in: queryParams.accessStatus}
      };
    }

    if (queryParams.requesterId) {
      query = {
        ...query,
        requesterId: queryParams.requesterId,
      };
    }

    if (queryParams.resourceId) {
      query = {
        ...query,
        resourceId: queryParams.resourceId,
      };
    }
  }

  const loggingRecords = await AuthorizationAccessLog(connect(DB_CONNECTION, portal))
    .find(query)
    .skip((page - 1) * perPage)
    .limit(perPage)
    .sort({ accessTime: 'desc' })
    .populate('requesterId resourceId policyId');

  const totalLoggingRecords = await AuthorizationAccessLog(connect(DB_CONNECTION, portal)).countDocuments(query);
  const totalPages = perPage ? Math.ceil(totalLoggingRecords / perPage) : 1;

  return {
    data: loggingRecords,
    totalLoggingRecords,
    totalPages,
  };
}