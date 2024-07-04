const { connect } = require('../../../helpers/dbHelper');
const { InternalServiceIdentity } = require('../../../models');
const InternalPolicyService = require('../internal-policies/internal-policies.service');
const ExternalPolicyService = require('../external-policies/external-policies.service');
const LoggingService = require('../logging/logging.service');
const { SystemApiServices } = require('../../system-admin/system-api/system-api-management/systemApi.service');
const crypto = require('crypto');
const LoggingType = {
  CREATE_INTERNAL_SERVICE_IDENTITY: 'CREATE_INTERNAL_SERVICE_IDENTITY',
  UPDATE_INTERNAL_SERVICE_IDENTITY: 'UPDATE_INTERNAL_SERVICE_IDENTITY',
};

exports.create = async (portal, internalServiceIdentityDto) => {
  if (internalServiceIdentityDto.name.length <= 0 || internalServiceIdentityDto.apiPrefix.length <= 0) {
    throw ['invalid_request'];
  }

  const checkExisted = await InternalServiceIdentity(connect(DB_CONNECTION, portal)).exists({
    name: internalServiceIdentityDto.name,
  });
  if (checkExisted) {
    throw ['internal_policy_name_existed'];
  }

  const newInternalServiceIdentity = {
    name: internalServiceIdentityDto.name,
    apiPrefix: internalServiceIdentityDto.apiPrefix,
    description: internalServiceIdentityDto.description,
    clientCredential: {
      clientId: crypto.randomUUID(),
      clientSecret: crypto.randomUUID(),
    },
    internalPolicies: internalServiceIdentityDto.internalPolicies,
    externalPolicies: internalServiceIdentityDto.externalPolicies,
  };

  const { id, name, apiPrefix, clientCredential, description, internalPolicies, externalPolicies } = await InternalServiceIdentity(
    connect(DB_CONNECTION, portal)
  ).create(newInternalServiceIdentity);

  const internalPolicyPromises = [];
  const externalPolicyPromises = [];

  internalPolicyPromises.push(...internalPolicies.map((policy) => InternalPolicyService.findOne(portal, policy)));
  externalPolicyPromises.push(...externalPolicies.map((policy) => ExternalPolicyService.findOne(portal, policy)));

  const listInternalPolicy = await Promise.all(internalPolicyPromises);
  const listExternalPolicy = await Promise.all(externalPolicyPromises);

  const response = {
    id: id,
    name: name,
    apiPrefix: apiPrefix,
    description: description,
    clientCredential: clientCredential,
    internalPolicies: listInternalPolicy,
    externalPolicies: listExternalPolicy,
  };

  LoggingService.create(portal, LoggingType.CREATE_INTERNAL_SERVICE_IDENTITY, 'SUCCESSFUL', response.name, {
    id: response.id,
    name: response.name,
    apiPrefix: response.apiPrefix,
    internalPolicies: response.internalPolicies,
    externalPolicies: response.externalPolicies,
  });

  return response;
};

exports.findAll = async (portal, queryParams = {}) => {
  let query = {};
  const { page, perPage } = queryParams;

  if (queryParams) {
    if (queryParams.name) {
      query = {
        ...query,
        name: queryParams.name,
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

    if (queryParams.apiPrefix) {
      query = { ...query, apiPrefix: queryParams.apiPrefix };
    }

    if (queryParams.internalPolicyId) {
      query = { ...query, internalPolicies: queryParams.internalPolicyId };
    }

    if (queryParams.externalPolicyId) {
      query = { ...query, externalPolicies: queryParams.externalPolicyId };
    }
  }

  const internalServiceIdentities = await InternalServiceIdentity(connect(DB_CONNECTION, portal)).find(query).skip(page).limit(perPage);

  let response = [];

  for (const identity of internalServiceIdentities) {
    const internalPolicyPromises = [];
    internalPolicyPromises.push(...identity.internalPolicies.map((policy) => InternalPolicyService.findOne(portal, policy)));

    const externalPolicyPromises = [];
    externalPolicyPromises.push(...identity.externalPolicies.map((policy) => ExternalPolicyService.findOne(portal, policy)));

    const internalPolicies = await Promise.all(internalPolicyPromises);
    const externalPolicies = await Promise.all(externalPolicyPromises);

    response = [
      ...response,
      {
        id: identity.id,
        name: identity.name,
        apiPrefix: identity.apiPrefix,
        description: identity.description,
        clientCredential: identity.clientCredential,
        internalPolicies: internalPolicies,
        externalPolicies: externalPolicies,
      },
    ];
  }

  const totalInternalServiceIdentities = await InternalServiceIdentity(connect(DB_CONNECTION, portal)).countDocuments(query);
  const totalPages = perPage ? Math.ceil(totalInternalServiceIdentities / perPage) : 1;

  return {
    data: response,
    totalInternalServiceIdentities,
    totalPages,
  };
};

exports.findOne = async (portal, id) => {
  const existent = await InternalServiceIdentity(connect(DB_CONNECTION, portal)).exists({
    _id: id,
  });

  if (!existent) {
    throw [`service_identity_${id}_not_found`];
  }

  const internalServiceIdentity = await InternalServiceIdentity(connect(DB_CONNECTION, portal)).findById(id);

  const { name, apiPrefix, description, clientCredential } = internalServiceIdentity;

  const internalPolicyPromises = [];
  const externalPolicyPromises = [];

  internalPolicyPromises.push(...internalServiceIdentity.internalPolicies.map((policy) => InternalPolicyService.findOne(portal, policy)));
  externalPolicyPromises.push(...internalServiceIdentity.externalPolicies.map((policy) => ExternalPolicyService.findOne(portal, policy)));

  const internalPolicies = await Promise.all(internalPolicyPromises);
  const externalPolicies = await Promise.all(externalPolicyPromises);

  const response = {
    id: id,
    name: name,
    apiPrefix: apiPrefix,
    description: description,
    clientCredential: clientCredential,
    internalPolicies: internalPolicies,
    externalPolicies: externalPolicies,
  };

  return response;
};

exports.update = async (portal, id, updateInternalServiceIdentityDto) => {
  const existent = await InternalServiceIdentity(connect(DB_CONNECTION, portal)).exists({
    _id: id,
  });
  if (!existent) {
    throw [`service_identity_${id}_not_found`];
  }

  if (updateInternalServiceIdentityDto.apiPrefix.length <= 0) {
    throw ['name_can_not_be_empty'];
  }

  const { name, apiPrefix, clientCredential, description, internalPolicies, externalPolicies } = await InternalServiceIdentity(
    connect(DB_CONNECTION, portal)
  ).findByIdAndUpdate(
    id,
    {
      name: updateInternalServiceIdentityDto.name,
      apiPrefix: updateInternalServiceIdentityDto.apiPrefix,
      description: updateInternalServiceIdentityDto.description,
      internalPolicies: updateInternalServiceIdentityDto.internalPolicies,
      externalPolicies: updateInternalServiceIdentityDto.externalPolicies,
    },
    { new: true }
  );

  const internalPolicyPromises = [];
  const externalPolicyPromises = [];

  internalPolicyPromises.push(...internalPolicies.map((policy) => InternalPolicyService.findOne(portal, policy)));
  externalPolicyPromises.push(...externalPolicies.map((policy) => ExternalPolicyService.findOne(portal, policy)));

  const listInternalPolicy = await Promise.all(internalPolicyPromises);
  const listExternalPolicy = await Promise.all(externalPolicyPromises);

  const response = {
    id: id,
    name: name,
    apiPrefix: apiPrefix,
    description: description,
    clientCredential: clientCredential,
    internalPolicies: listInternalPolicy,
    externalPolicies: listExternalPolicy,
  };

  LoggingService.create(portal, LoggingType.UPDATE_INTERNAL_SERVICE_IDENTITY, 'SUCCESSFUL', response.name, {
    id: response.id,
    name: response.name,
    apiPrefix: response.apiPrefix,
    internalPolicies: response.internalPolicies,
    externalPolicies: response.externalPolicies,
  });

  return response;
};

exports.remove = async (portal, id) => {
  const existent = await InternalServiceIdentity(connect(DB_CONNECTION, portal)).exists({
    _id: id,
  });

  if (!existent) {
    throw [`service_identity_${id}_not_found`];
  }

  return InternalServiceIdentity(connect(DB_CONNECTION, portal)).findByIdAndDelete(id);
};

exports.exists = async (portal, id) => {
  const existent = await InternalServiceIdentity(connect(DB_CONNECTION, portal)).exists({
    _id: id,
  });

  return existent;
};

exports.getApiServiceCanAccess = async (portal, id) => {
  const { systemApis } = await SystemApiServices.getSystemApis({
    page: 1,
    perPage: 10000,
  });
  const service = await this.findOne(portal, id);

  const doesPolicyContainResource = (policyResources, resource) => {
    return policyResources.some((r) => {
      const regex = new RegExp(`^${r.replace(/\*/g, '.*')}$`);
      return regex.test(resource);
    });
  };

  const isServiceCanAccessApi = (service, api) => {
    const internalPolicies = service.internalPolicies.filter(
      (policy) =>
        doesPolicyContainResource(policy.resources, api.path) &&
        policy.actions.includes(api.method) &&
        policy.effectiveStartTime.getTime() <= Date.now() &&
        policy.effectiveEndTime.getTime() >= Date.now()
    );
    if (internalPolicies.length > 0 && internalPolicies.every((policy) => policy.effect === 'Allow')) return true;

    return false;
  };

  let canAccessApis = [];

  let parttern = service.apiPrefix;
  parttern = new RegExp(`^${parttern.replace(/\*/g, '.*')}`);
  for (let i = 0; i < systemApis.length; i++) {
    const api = systemApis[i];
    if (parttern.test(api.path) || isServiceCanAccessApi(service, api)) canAccessApis.push(api);
  }

  return canAccessApis;
};
