const { DelegationPolicy, Delegation } = require('../../../models');

const { connect } = require('../../../helpers/dbHelper');

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

  let totalPolicies = await DelegationPolicy(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
  let policies = await DelegationPolicy(connect(DB_CONNECTION, portal))
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

// Lấy ra Ví dụ theo id
exports.getPolicyById = async (portal, id) => {
  let policy = await DelegationPolicy(connect(DB_CONNECTION, portal)).findById({ _id: id });
  return policy;
};

exports.getDetailedPolicyById = async (portal, id) => {
  const policy = await DelegationPolicy(connect(DB_CONNECTION, portal)).findById({ _id: id });
  const delegations = await Delegation(connect(DB_CONNECTION, portal))
    .find({ policy: id })
    .populate([
      { path: 'delegateObject', select: '_id name' },
      { path: 'delegatee', select: '_id name' },
      { path: 'delegator', select: '_id name' },
    ]);

  return {
    id: policy.id,
    name: policy.name,
    description: policy.description,
    delegatorRequirements: policy.delegatorRequirements,
    delegateeRequirements: policy.delegateeRequirements,
    delegateObjectRequirements: policy.delegateObjectRequirements,
    environmentRequirements: policy.environmentRequirements,
    delegations,
  };
};
