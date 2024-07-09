const { connect } = require(`../../../helpers/dbHelper`);

const { Requester } = require('../../../models');

exports.findByIds = async (portal, ids) => {
  const requesters = await Requester(connect(DB_CONNECTION, portal)).find({ _id: { $in: ids } });
  return requesters.map((x) => ({
    id: x.id,
    name: x.name,
    attributes: x.attributes,
    type: x.type,
    refId: x.refId,
  }));
};
