const { connect } = require('../../../helpers/dbHelper');
const { ExternalPolicy } = require('../../../models');
const InternalServiceIdentityService = require('../internal-service-identities/internal-service-identities.service');
const LoggingService = require('../logging/logging.service');

const LoggingType = {
  CREATE_INTERNAL_POLICY: 'CREATE_INTERNAL_POLICY',
  UPDATE_INTERNAL_POLICY: 'UPDATE_INTERNAL_POLICY',
};

exports.create = async (portal, externalServiceIdentityDto) => {
  const { name, description, actions, resources, enabled, condition } = externalServiceIdentityDto;

  const newExternalPolicy = {
    name: name,
    description: description,
    actions: actions,
    resources: resources,
    enabled: enabled,
    condition: condition,
  };

  if (name.length <= 0) {
    throw ['name_can_not_be_empty'];
  }

  const checkExisted = await ExternalPolicy(connect(DB_CONNECTION, portal)).exists({
    name: name,
  });
  if (checkExisted) {
    throw ['internal_policy_name_existed'];
  }

  const policy = await ExternalPolicy(connect(DB_CONNECTION, portal)).create(newExternalPolicy);

  LoggingService.create(portal, LoggingType.CREATE_EXTERNAL_POLICY, 'SUCCESSFUL', policy.name, policy);

  return {
    id: policy.id,
    name: policy.name,
    description: policy.description,
    actions: policy.actions,
    resources: policy.resources,
    enabled: policy.enabled,
    condition: policy.condition,
  };
};

exports.findAll = async (portal, queryParams) => {
  let query = {};

  if (queryParams) {
    if (queryParams.name) {
      query = {
        ...query,
        name: queryParams.name,
      };
    }
  }

  const policies = await ExternalPolicy(connect(DB_CONNECTION, portal)).find(query).skip(queryParams?.page).limit(queryParams?.perPage);

  const totalExternalPolicies = await ExternalPolicy(connect(DB_CONNECTION, portal)).countDocuments(query);
  const totalPages = queryParams?.perPage ? Math.ceil(totalExternalPolicies / queryParams.perPage) : 1;

  return {
    data: policies.map((policy) => {
      return {
        id: policy.id,
        name: policy.name,
        description: policy.description,
        actions: policy.actions,
        resources: policy.resources,
        enabled: policy.enabled,
        condition: policy.condition,
      };
    }),
    totalExternalPolicies,
    totalPages,
  };
};

exports.findOne = async (portal, id) => {
  const existent = await ExternalPolicy(connect(DB_CONNECTION, portal)).exists({
    _id: id,
  });

  if (!existent) {
    throw [`external_policy_${id}_not_found`];
  }

  const policy = await ExternalPolicy(connect(DB_CONNECTION, portal)).findById(id);

  return {
    id: policy.id,
    name: policy.name,
    description: policy.description,
    actions: policy.actions,
    resources: policy.resources,
    enabled: policy.enabled,
    condition: policy.condition,
  };
};

exports.update = async (portal, id, updateExternalPolicyDto) => {
  const existent = await ExternalPolicy(connect(DB_CONNECTION, portal)).exists({
    _id: id,
  });

  if (!existent) {
    throw [`external_policy_${id}_not_found`];
  }

  const { description, actions, resources, enabled, condition } = updateExternalPolicyDto;

  const policy = await ExternalPolicy(connect(DB_CONNECTION, portal)).findByIdAndUpdate(
    id,
    {
      description: description,
      actions: actions,
      resources: resources,
      enabled: enabled,
      condition: condition,
    },
    { new: true }
  );

  LoggingService.create(portal, LoggingType.UPDATE_EXTERNAL_POLICY, 'SUCCESSFUL', policy.name, policy);

  return {
    id: policy.id,
    name: policy.name,
    description: policy.description,
    actions: policy.actions,
    resources: policy.resources,
    enabled: policy.enabled,
    condition: policy.condition,
  };
};

exports.remove = async (portal, id) => {
  const existent = await ExternalPolicy(connect(DB_CONNECTION, portal)).exists({
    _id: id,
  });

  if (!existent) {
    throw [`external_policy_${id}_not_found`];
  }

  const serviceIdentitiesHaveThisPolicy = await InternalServiceIdentityService.findAll(portal, {
    externalPolicyId: id,
  });

  if (serviceIdentitiesHaveThisPolicy.data.length > 0) {
    throw ['external_policy_is_attached'];
  }

  return ExternalPolicy(connect(DB_CONNECTION, portal)).findByIdAndDelete(id);
};
