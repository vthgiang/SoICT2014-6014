const { connect } = require('../../../helpers/dbHelper');

const { Resource } = require('../../../models');

exports.findByIds = async (portal, ids) => {
  const resources = await Resource(connect(DB_CONNECTION, portal))
    .find({ _id: { $in: ids } })
    .populate('refId');
  return resources.map((x) => enrich(x));
};
