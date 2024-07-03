const ExternalServiceConsumerService = require('../external-service-consumers/external-service-consumers.service');
const InternalServiceIdentityService = require('../internal-service-identities/internal-service-identities.service');
const LoggingService = require('../logging/logging.service');

/**
 * Determines whether an external service consumer can do Action on Resource
 * @param externalServiceConsumer information of the consumer
 * @param resource URL of the API call
 * @param action HTTP method of the API call
 * @returns true if consumer is authorized, false otherwise
 */
const authorizeExternalServiceConsumer = async (portal, externalServiceConsumer, resource, action) => {
  /**
   * Step 1: Split `resource` to get `resourceApiPrefix`
   * Step 2: Find internal service identity that has `apiPrefix` matching to `resourceApiPrefix`
   * Step 3: Destructure to get `externalPolicies`
   * Step 4: Find `externalPolicies` which has `condition` matching to external consumer's `attributes`
   */
  const resourceApiPrefix = `/${resource.split('/')[1]}`;

  const internalServiceIdentity = await InternalServiceIdentityService.findAll(portal, {
    apiPrefix: resourceApiPrefix,
  });

  if (!internalServiceIdentity.data || internalServiceIdentity.data.length == 0) {
    return false;
  }

  const doesPolicyContainResource = (policyResources, resource) => {
    return policyResources.some((r) => {
      const regex = new RegExp(`^${r.replace(/\*/g, '.*')}$`);
      return regex.test(resource);
    });
  };

  /**
   * A function to check if internal service identity supports service consumer.
   * @param condition `condition` of a external policy
   * @param consumerAttributes `attributes` in external consumer
   * @returns true if external policies (condition) contains external consumer attributes
   */
  const isServiceConsumerSupportedByInternalService = (condition, consumerAttributes) => {
    if (condition.and) {
      return condition.and.every((c) => isServiceConsumerSupportedByInternalService(c, consumerAttributes));
    }

    if (condition.or) {
      return condition.or.some((c) => isServiceConsumerSupportedByInternalService(c, consumerAttributes));
    }

    if (condition.equals) {
      const key = Object.keys(condition.equals)[0];
      return consumerAttributes[key] === condition.equals[key];
    }

    if (condition.notEquals) {
      const key = Object.keys(condition.notEquals)[0];
      return consumerAttributes[key] !== condition.notEquals[key];
    }

    throw ['unsupported_operation'];
  };

  const externalPolicies = internalServiceIdentity.data[0].externalPolicies.filter((policy) =>
    isServiceConsumerSupportedByInternalService(policy.condition, externalServiceConsumer.attributes)
  );

  return externalPolicies.some(
    (policy) => doesPolicyContainResource(policy.resources, resource) && policy.actions.includes(action) && policy.enabled
  );
};

const authorizeInternalServiceIdentity = (internalServiceIdentity, resource, action) => {
  const doesPolicyContainResource = (policyResources, resource) => {
    return policyResources.some((r) => {
      const regex = new RegExp(`^${r.replace(/\*/g, '.*')}$`);
      return regex.test(resource);
    });
  };

  const internalPolicies = internalServiceIdentity.internalPolicies.filter(
    (policy) =>
      doesPolicyContainResource(policy.resources, resource) &&
      policy.actions.includes(action) &&
      policy.effectiveStartTime.getTime() <= Date.now() &&
      policy.effectiveEndTime.getTime() >= Date.now()
  );

  return internalPolicies.length > 0 && internalPolicies.every((policy) => policy.effect === 'Allow');
};

exports.authorizeServiceConsumer = async (portal, authorizerServiceAccount) => {
  const { clientId, clientSecret, resource, action } = authorizerServiceAccount;

  const externalServiceConsumer = await ExternalServiceConsumerService.findAll(portal, {
    clientId,
    clientSecret,
  });

  // if an external service consumer is found, then authorize it
  if (externalServiceConsumer.data.length == 1) {
    const result = await authorizeExternalServiceConsumer(portal, externalServiceConsumer.data[0], resource, action);

    LoggingService.create(
      portal,
      'AUTHORIZE_EXTERNAL_SERVICE_CONSUMER',
      result ? 'SUCCESSFUL' : 'FAILED',
      externalServiceConsumer.data[0].name,
      result
    );

    return result;
  }

  // else, check if it is internal service identity
  const { data } = await InternalServiceIdentityService.findAll(portal, {
    clientId,
    clientSecret,
  });

  // if an internal service identity is found, then authorize it
  if (data.length == 1) {
    const result = authorizeInternalServiceIdentity(data[0], resource, action);

    LoggingService.create(portal, 'AUTHORIZE_INTERNAL_SERVICE_IDENTITY', result ? 'SUCCESSFUL' : 'FAILED', data[0].name, result);

    return result;
  }

  LoggingService.create(portal, 'AUTHORIZE_SERVICE', 'FAILED', 'Not found', 'Service not found');

  // otherwise, throw error
  throw ['service_not_found'];
};
