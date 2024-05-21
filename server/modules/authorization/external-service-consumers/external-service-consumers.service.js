const {
  connect
} = require(`../../../helpers/dbHelper`)
const { ExternalServiceConsumer } = require("../../../models");
const crypto = require('crypto');

exports.create = async(portal, createExternalServiceConsumerDto) => {
  const { name, description, attributes } = createExternalServiceConsumerDto;

  if (name.length <= 0) {
    throw ['name_can_not_be_empty'];
  }

  const checkExisted = await ExternalServiceConsumer(connect(DB_CONNECTION, portal)).exists({
    name: name,
  });
  if (checkExisted) {
    throw ['internal_policy_name_existed'];
  }

  const newExternalServiceConsumer = {
    name: name,
    portal: portal,
    description: description,
    clientCredential: {
      clientId: crypto.randomUUID(),
      clientSecret: crypto.randomUUID(),
    },
    attributes: attributes,
  };

  const newRecord = await ExternalServiceConsumer(connect(DB_CONNECTION, portal)).create(
    newExternalServiceConsumer,
  );

  return {
    id: newRecord.id,
    name: newRecord.name,
    description: newRecord.description,
    clientCredential: newRecord.clientCredential,
    attributes: newRecord.attributes,
  };
}

exports.findAll = async (portal, queryParams = {}) => {
  let query = {};
  const { page, perPage } = queryParams;

  if (queryParams) {
    if (queryParams.portal) {
      query = {
        ...query,
        portal: queryParams.portal,
      };
    }
    if (queryParams.name) {
      query = {
        ...query,
        name: { $regex: queryParams.name },
      };
    }

    if (queryParams.description) {
      query = {
        ...query,
        description: { $regex: queryParams.description },
      };
    }
    if (queryParams.clientId && queryParams.clientSecret) {
      query = {
        ...query,
        clientCredential: {
          clientId: queryParams.clientId,
          clientSecret: queryParams.clientSecret,
        },
      };
    }
  }


  const externalServiceConsumers = await ExternalServiceConsumer(connect(DB_CONNECTION, portal))
    .find(query)
    .skip(page)
    .limit(perPage);

  const totalExternalServiceConsumers = await ExternalServiceConsumer(connect(DB_CONNECTION, portal)).countDocuments(query);
  const totalPages = perPage
    ? Math.ceil(totalExternalServiceConsumers / perPage)
    : 1;

  return {
    data: externalServiceConsumers.map((consumer) => {
      return {
        id: consumer.id,
        name: consumer.name,
        description: consumer.description,
        clientCredential: consumer.clientCredential,
        attributes: consumer.attributes,
      };
    }),
    totalExternalServiceConsumers,
    totalPages,
  };
}

exports.findOne = async (portal, id)  => {
  const existent = await ExternalServiceConsumer(connect(DB_CONNECTION, portal)).exists({
    _id: id,
  });

  if (!existent) {
    throw [`customer_${id}_not_found`];
  }

  const { name, description, clientCredential, attributes } =
    await ExternalServiceConsumer(connect(DB_CONNECTION, portal)).findById(id);

  return {
    id,
    name,
    description,
    clientCredential,
    attributes,
  };
}

exports.update = async (portal, id, updateExternalServiceConsumerDto) => {
  const existent = await ExternalServiceConsumer(connect(DB_CONNECTION, portal)).exists({
    _id: id,
  });

  if (!existent) {
    throw [`customer_${id}_not_found`];
  }

  const { name, description, clientCredential, attributes } =
    await ExternalServiceConsumer(connect(DB_CONNECTION, portal)).findByIdAndUpdate(
      id,
      {
        name: updateExternalServiceConsumerDto.name,
        description: updateExternalServiceConsumerDto.description,
        attributes: updateExternalServiceConsumerDto.attributes,
      },
      { new: true },
    );

  return { id, name, description, clientCredential, attributes };
}

exports.remove = async (portal, id) => {
  const existent = await ExternalServiceConsumer(connect(DB_CONNECTION, portal)).exists({
    _id: id,
  });

  if (!existent) {
    throw [`service_consumer_${id}_not_found`];
  }

  return ExternalServiceConsumer(connect(DB_CONNECTION, portal)).findByIdAndDelete(id);
}

