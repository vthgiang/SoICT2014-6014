const AuthorizationPolicyService = require('../modules/authorization/policy/policy.service')
const DelegationPolicyService = require('../modules/delegation/policy/policy.service')

const call_service = async (link, params) => {
  console.log(link[0], params);
  if (link[0] === 'authorization-policy') {
    switch (link[1]) {
      case 'getPolicies': {
        const { portal, data } = params;
        return await AuthorizationPolicyService.getPolicies(portal, data);
      }
      case 'getAllPolicies': {
        const { portal } = params;
        return await AuthorizationPolicyService.getAllPolicies(portal);
      }
      case 'getPolicyById': {
        const { portal, id } = params;
        return await AuthorizationPolicyService.getPolicyById(portal, id);
      }
      case 'getDetailedPolicyById': {
        const { portal, id } = params;
        return await AuthorizationPolicyService.getDetailedPolicyById(portal, id);
      }
      default:
        break;
    }
  }
  else if (link[0] === 'delegation-policy') {
    switch (link[1]) {
      case 'getPolicies': {
        const { portal, data } = params;
        return await DelegationPolicyService.getPolicies(portal, data);
      }
      case 'getPolicyById': {
        const { portal, id } = params;
        return await DelegationPolicyService.getPolicyById(portal, id);
      }
      case 'getDetailedPolicyById': {
        const { portal, id } = params;
        return await DelegationPolicyService.getDetailedPolicyById(portal, id);
      }
      default:
        break;
    }
  }
};
const internalCall = async (link, params) => {
  try {
    console.log(params.params);
    const response = await call_service(link.split('.'), params);
    return response;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  internalCall,
};
