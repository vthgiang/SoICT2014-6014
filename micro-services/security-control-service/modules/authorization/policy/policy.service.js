const { AuthorizationPolicy, DynamicAssignment } = require('../../../models');

const { connect } = require(`../../../helpers/dbHelper`);

const RequesterService = require('../../auth-service/requester/requester.service');
const ResourceService = require('../../auth-service/resource/resource.service');

// Lấy ra tất cả các thông tin Ví dụ theo mô hình lấy dữ liệu số  1
exports.getPolicies = async (portal, data) => {
  let keySearch = {};
  if (data?.name?.length > 0) {
    keySearch = {
      name: {
        $regex: data.name,
        $options: 'i',
      },
    };
  }

  let page, perPage;
  page = data?.page ? Number(data.page) : 1;
  perPage = data?.perPage ? Number(data.perPage) : 20;

  let totalPolicies = await AuthorizationPolicy(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
  let policies = await AuthorizationPolicy(connect(DB_CONNECTION, portal))
    .find(keySearch)
    .skip((page - 1) * perPage)
    .limit(perPage);

  const totalPages = Math.ceil(totalPolicies / perPage);

  return {
    data: policies,
    totalPolicies,
    totalPages,
  };
};

// Lấy ra tất cả các thông tin Ví dụ theo mô hình lấy dữ liệu số  1
exports.getAllPolicies = async (portal) => {
  let policies = await AuthorizationPolicy(connect(DB_CONNECTION, portal)).find();
  return {
    data: policies,
  };
};

// Lấy ra Ví dụ theo id
exports.getPolicyById = async (portal, id) => {
  let policy = await AuthorizationPolicy(connect(DB_CONNECTION, portal)).findById({ _id: id });
  return policy;
};

exports.getDetailedPolicyById = async (portal, id) => {
  const policy = await AuthorizationPolicy(connect(DB_CONNECTION, portal)).findById({ _id: id });
  const authorization = await DynamicAssignment(connect(DB_CONNECTION, portal)).findOne({ policyId: id });

  if (!policy) {
    throw ['policy_invalid'];
  }

  let requesters, resources;
  if (authorization) {
    requesters = await RequesterService.findByIds(portal, authorization.requesterIds);
    resources = await ResourceService.findByIds(portal, authorization.resourceIds);
  }

  return {
    id: policy.id,
    name: policy.name,
    description: policy.description,
    effect: policy.effect,
    effectiveStartTime: policy.effectiveStartTime,
    effectiveEndTime: policy.effectiveEndTime,
    requesterRequirements: policy.requesterRequirements,
    resourceRequirements: policy.resourceRequirements,
    roleRequirements: policy.roleRequirements,
    environmentRequirements: policy.environmentRequirements,
    authorization: {
      requesters: requesters ?? [],
      resources: resources ?? [],
    },
  };
};
