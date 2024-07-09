const { connect } = require('../../../helpers/dbHelper');

const { Resource } = require('../../../models');

exports.findByIds = async (portal, ids) => {
  const resources = await Resource(connect(DB_CONNECTION, portal))
    .find({ _id: { $in: ids } })
    .populate('refId');
  return resources.map((x) => enrich(x));
};

const enrich = (resource) => {
  let enrichResource = {
    id: resource.id,
    name: resource.name,
    attributes: resource.attributes,
    type: resource.type
  };

  let additionalInfo = {};
  switch (resource.type) {
    case 'Component':
      additionalInfo.description = resource.refId?.description;
      break;
    case 'Link':
      additionalInfo.description = resource.refId?.description;
      additionalInfo.category = resource.refId?.category;
      break;
    case 'SystemApi':
      additionalInfo.method = resource.refId?.method;
      additionalInfo.category = resource.refId?.category;
      break;
    case 'Task':
      additionalInfo.status = resource.refId?.status;
      break;
  }

  enrichResource.additionalInfo = additionalInfo;
  return enrichResource;
}
