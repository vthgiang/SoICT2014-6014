const {
  connect
} = require(`../../../helpers/dbHelper`)

const { Requester } = require('../../../models');

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
          $options: "i"
        },
      };
    }
  }

  const page = queryParams?.page ? Number(queryParams.page) : 1;
  const perPage = queryParams?.perPage ? Number(queryParams.perPage) : 20;

  const requesters = await Requester(connect(DB_CONNECTION, portal))
    .find(query)
    .skip((page - 1) * perPage)
    .limit(perPage);

  const totalRequesters = await Requester(connect(DB_CONNECTION, portal)).countDocuments(
    query,
  );
  const totalPages = queryParams?.perPage
    ? Math.ceil(totalRequesters / queryParams.perPage)
    : 1;

  return {
    data: requesters.map(x => ({
      id: x.id,
      name: x.name,
      attributes: x.attributes,
      type: x.type
    })),
    totalRequesters,
    totalPages,
  };
}

exports.findOne = async (portal, id) => {
  const existent = await Requester(connect(DB_CONNECTION, portal)).exists({
    _id: id,
  });

  if (!existent) {
    throw [`requester_${id}_not_found`];
  }

  const requester = await Requester(connect(DB_CONNECTION, portal)).findById(id);

  return {
    id: requester.id,
    name: requester.name,
    attributes: requester.attributes,
    type: requester.type
  };
}

exports.updateAttributes = async (portal, id, data) => {
  const existent = await Requester(connect(DB_CONNECTION, portal)).exists({
    _id: id,
  });

  if (!existent) {
    throw [`requester_${id}_not_found`];
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

  const requester = await Requester(connect(DB_CONNECTION, portal)).findOneAndUpdate(
    { _id: id },
    { attributes: dataAttr },
    { new: true }
  );

  return {
    id: requester.id,
    name: requester.name,
    attributes: requester.attributes,
    type: requester.type
  };
}
