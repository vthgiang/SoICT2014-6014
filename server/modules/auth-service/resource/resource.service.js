const {
  connect
} = require(`../../../helpers/dbHelper`)

const { Resource } = require('../../../models');

const AuthorizationPolicyService = require('../../authorization/policy/policy.service')

exports.find = async (portal, queryParams = {}) => {
  let query = {};

  if (queryParams) {
    if (queryParams.type) {
      query = {
        ...query,
        type: {
          $in: queryParams.type,
        }
      };
    }
    if (queryParams.name) {
      query = {
        ...query,
        name: {
          $regex: queryParams.name,
          $options: 'i'
        },
      };
    }
  }

  const page = queryParams?.page ? Number(queryParams.page) : 1;
  const perPage = queryParams?.perPage ? Number(queryParams.perPage) : 20;

  const resources = await Resource(connect(DB_CONNECTION, portal))
    .find(query)
    .skip((page - 1) * perPage)
    .limit(perPage)
    .populate('refId');

  const totalResources = await Resource(connect(DB_CONNECTION, portal)).countDocuments(
    query,
  );
  const totalPages = queryParams?.perPage
    ? Math.ceil(totalResources / queryParams.perPage)
    : 1;

  return {
    data: resources.map(x => enrich(x)),
    totalResources,
    totalPages,
  };
}

exports.findAll = async (portal) => {
  const resources = await Resource(connect(DB_CONNECTION, portal)).find();

  return {
    data: resources.map(x => ({
      id: x.id,
      name: x.name,
      attributes: x.attributes,
      type: x.type,
      refId: x.refId
    }))
  };
}


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

exports.findOne = async (portal, id) => {
  const existent = await Resource(connect(DB_CONNECTION, portal)).exists({
    _id: id,
  });

  if (!existent) {
    throw [`resource_${id}_not_found`];
  }

  const resource = await Resource(connect(DB_CONNECTION, portal)).findById(id).populate('refId');

  return enrich(resource);
}

exports.updateAttributes = async (portal, id, data) => {
  const existent = await Resource(connect(DB_CONNECTION, portal)).exists({
    _id: id,
  });

  if (!existent) {
    throw [`resource_${id}_not_found`];
  }

  const filterValidAttributeArray = async (array) => {
    let resArray = [];
    if (array.length > 0) {
        if (new Set(array.map((attr) => attr.attributeId.toLowerCase().replace(/ /g, ''))).size !== array.length) {
            throw ['attribute_selected_duplicate'];
        }

        for (let i = 0; i < array.length; i++) {
            if (array[i]) {
                resArray = [...resArray, array[i]];
            }
        }
        return resArray;
    } else {
        return [];
    }
  };

  const attrArray = await filterValidAttributeArray(data.attributes);
  const dataAttr = attrArray.map((attr) => {
      return {
          attributeId: attr.attributeId,
          value: attr.value.trim(),
          description: attr.description?.trim(),
      };
  });

  const resource = await Resource(connect(DB_CONNECTION, portal)).findOneAndUpdate(
    { _id: id },
    { attributes: dataAttr },
    { new: true }
  ).populate('refId');

  await AuthorizationPolicyService.checkAllPolicies(portal);

  return enrich(resource);
}

exports.findByIds = async(portal, ids) => {
  const resources = await Resource(connect(DB_CONNECTION, portal)).find( {_id: {$in: ids} }).populate('refId');
  return resources.map(x => enrich(x));
}
