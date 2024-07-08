const {
  connect
} = require(`../../../helpers/dbHelper`)
const LoggingType = {
  CREATE_INTERNAL_POLICY: 'CREATE_INTERNAL_POLICY',
  UPDATE_INTERNAL_POLICY: 'UPDATE_INTERNAL_POLICY',
}

const LoggingService = require('../logging/logging.service');
const InternalServiceIdentityService = require('../internal-service-identities/internal-service-identities.service');
const { InternalPolicy } = require('../../../models');

exports.create = async (portal, internalPolicyDto) => {
  const {
    name,
    description,
    effect,
    actions,
    resources,
    effectiveStartTime,
    effectiveEndTime,
  } = internalPolicyDto;

  if (
    new Date(effectiveEndTime).getTime() <
    new Date(effectiveStartTime).getTime()
  ) {
    throw ['invalid_effective_range'];
  }

  if (name.length <= 0) {
    throw ['name_can_not_be_empty'];
  }

  const checkExisted = await InternalPolicy(connect(DB_CONNECTION, portal)).exists({
    name: name,
  });
  if (checkExisted) {
    throw ['internal_policy_name_existed'];
  }

  const newInternalPolicy = {
    name: name,
    description: description,
    effect: effect,
    actions: actions,
    resources: resources,
    effectiveStartTime: effectiveStartTime,
    effectiveEndTime: effectiveEndTime,
  };

  const policy = await InternalPolicy(connect(DB_CONNECTION, portal)).create(newInternalPolicy);

  LoggingService.create(
    portal,
    LoggingType.CREATE_INTERNAL_POLICY,
    'SUCCESSFUL',
    policy.name,
    policy,
  );

  return {
    id: policy.id,
    name: policy.name,
    description: policy.description,
    effect: policy.effect,
    actions: policy.actions,
    resources: policy.resources,
    effectiveStartTime: policy.effectiveStartTime,
    effectiveEndTime: policy.effectiveEndTime,
  };
}

exports.findAll = async (portal, queryParams = {}) => {
  let query = {};

  if (queryParams) {
    if (queryParams.name) {
      query = {
        ...query,
        name: queryParams.name,
      };
    }

    if (queryParams.resource) {
      query = {
        ...query,
        resources: queryParams.resource,
      };
    }
  }

  const policies = await InternalPolicy(connect(DB_CONNECTION, portal))
    .find(query)
    .skip(queryParams?.page)
    .limit(queryParams?.perPage);

  const totalInternalPolicies = await InternalPolicy(connect(DB_CONNECTION, portal)).countDocuments(
    query,
  );
  const totalPages = queryParams?.perPage
    ? Math.ceil(totalInternalPolicies / queryParams.perPage)
    : 1;

  return {
    data: policies.map((policy) => {
      return {
        id: policy.id,
        name: policy.name,
        description: policy.description,
        effect: policy.effect,
        actions: policy.actions,
        resources: policy.resources,
        effectiveStartTime: policy.effectiveStartTime,
        effectiveEndTime: policy.effectiveEndTime,
      };
    }),
    totalInternalPolicies,
    totalPages,
  };
}

exports.findOne = async (portal, id) => {
  const existent = await InternalPolicy(connect(DB_CONNECTION, portal)).exists({
    _id: id,
  });

  if (!existent) {
    throw [`internal_policy_${id}_not_found`];
  }

  const {
    name,
    description,
    effect,
    actions,
    resources,
    effectiveStartTime,
    effectiveEndTime,
  } = await InternalPolicy(connect(DB_CONNECTION, portal)).findById(id);

  return {
    id,
    name,
    description,
    effect,
    actions,
    resources,
    effectiveStartTime,
    effectiveEndTime,
  };
}

exports.update = async (portal, id, updateInternalPolicyDto) => {
  const existent = await InternalPolicy(connect(DB_CONNECTION, portal)).exists({
    _id: id,
  });

  if (!existent) {
    throw [`internal_policy_${id}_not_found`];
  }

  const {
    description,
    effect,
    actions,
    resources,
    effectiveStartTime,
    effectiveEndTime,
  } = updateInternalPolicyDto;

  if (
    new Date(effectiveEndTime).getTime() <
    new Date(effectiveStartTime).getTime()
  ) {
    throw ['invalid_effective_range'];
  }

  const policy = await InternalPolicy(connect(DB_CONNECTION, portal)).findByIdAndUpdate(
    id,
    {
      description: description,
      effect: effect,
      actions: actions,
      resources: resources,
      effectiveStartTime: effectiveStartTime,
      effectiveEndTime: effectiveEndTime,
    },
    { new: true },
  );

  LoggingService.create(
    portal,
    LoggingType.UPDATE_INTERNAL_POLICY,
    'SUCCESSFUL',
    policy.name,
    policy,
  );

  return {
    id: policy.id,
    name: policy.name,
    description: policy.description,
    effect: policy.effect,
    actions: policy.actions,
    resources: policy.resources,
    effectiveStartTime: policy.effectiveStartTime,
    effectiveEndTime: policy.effectiveEndTime,
  };
}

exports.remove = async (portal, id) => {
  const existent = await InternalPolicy(connect(DB_CONNECTION, portal)).exists({
    _id: id,
  });

  if (!existent) {
    throw [`internal_policy_${id}_not_found`];
  }

  const serviceIdentitiesHaveThisPolicy =
    await InternalServiceIdentityService.findAll(portal, {
      internalPolicyId: id,
    });

  if (serviceIdentitiesHaveThisPolicy.data.length > 0) {
    throw ['internal_policy_is_attached'];
  }

  return InternalPolicy(connect(DB_CONNECTION, portal)).findByIdAndDelete(id);
}

