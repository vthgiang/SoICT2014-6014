const {
  connect
} = require(`../../../helpers/dbHelper`)

const { Requester, DynamicAssignment, Resource, Role, Privilege, UserRole } = require('../../../models');
const AuthorizationPolicyService = require(`../../authorization/policy/policy.service`);
const DelegationPolicyService = require(`../../delegation/policy/policy.service`);

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
      type: x.type,
      refId: x.refId
    })),
    totalRequesters,
    totalPages,
  };
}

exports.findAll = async (portal) => {
  const requesters = await Requester(connect(DB_CONNECTION, portal)).find();

  return {
    data: requesters.map(x => ({
      id: x.id,
      name: x.name,
      attributes: x.attributes,
      type: x.type,
      refId: x.refId
    }))
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
    type: requester.type,
    refId: x.refId
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

  const attrArray = await filterValidAttributeArray(data.attributes ?? []);
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

  await AuthorizationPolicyService.checkAllPolicies(portal);

  return {
    id: requester.id,
    name: requester.name,
    attributes: requester.attributes,
    type: requester.type,
    refId: requester.refId
  };
}

exports.findByIds = async(portal, ids) => {
  const requesters = await Requester(connect(DB_CONNECTION, portal)).find( {_id: {$in: ids} });
  return requesters.map(x => ({
    id: x.id,
    name: x.name,
    attributes: x.attributes,
    type: x.type,
    refId: x.refId
  }));
}

exports.getAccessibleResources = async(portal, requesterId, roleId = undefined) => {
  //TODO: implement later
  const requester = await Requester(connect(DB_CONNECTION, portal)).findById(requesterId)
    .populate('refId');

  let allowOriginalResourceIds = [];
  if (requester.type == 'User' && roleId) {
    // get accessible resources RBAC
    const role = await Role(connect(DB_CONNECTION, portal)).findById(roleId); //lay duoc role hien tai
    let roles = [role._id, ...role.parents];
    const privilege = await Privilege(connect(DB_CONNECTION, portal))
        .find({
            roleId: { $in: roles }
        })
        .populate({ path: "resourceId" });
    // const userrole = await UserRole(connect(DB_CONNECTION, portal)).findOne({ userId: requester.refId, roleId: role._id });


    // Lấy ds các link theo RBAC original và ko có policy
    allowOriginalResourceIds = await privilege
        .filter((pri) => pri.resourceId.deleteSoft === false && pri.policies.length == 0)
        .map((pri) => pri.resourceId._id);

    // Gán thêm các link được phân quyền theo policy với những user có UserRole và Privilege khớp policy
    // privilege.forEach(pri => {
    //     if (pri.policies.length > 0) {
    //         if (userrole.policies.length > 0) {
    //             if (pri.policies.some(policy => userrole.policies.includes(policy)) && pri.resourceId.deleteSoft === false) {
    //               allowOriginalResourceIds = allowOriginalResourceIds.concat(pri.resourceId)
    //             }
    //         }
    //     }
    // })
  }
  // const allowResourcesByRole = await Resource(connect(DB_CONNECTION, portal)).find({ refId: {$in: allowOriginalResourceIds }});
  let allowResourceIds = [];
  let denyResourceIds = [];
  
  const dynamicAssignments = await DynamicAssignment(connect(DB_CONNECTION, portal))
      .find({ requesterIds: requester._id })
      .populate('policyId delegationId');

  const activePolicyAssignments = AuthorizationPolicyService.filterActiveAuthorizationPolicies(dynamicAssignments);
  const activeDelegationAssignments = DelegationPolicyService.filterActiveDelegations(dynamicAssignments);

  activePolicyAssignments.forEach(x => {
      if (x.policyId.effect == 'Allow') {
          allowResourceIds = allowResourceIds.concat(x.resourceIds);
      }
      else {
          denyResourceIds = denyResourceIds.concat(x.resourceIds);
      }
  });
  activeDelegationAssignments.forEach(x => {
      allowResourceIds = allowResourceIds.concat(x.resourceIds);
  });

  let allowResources = await Resource(connect(DB_CONNECTION, portal))
    .find({
      $or: [
        {_id: {$in: allowResourceIds}},
        {refId: {$in: allowOriginalResourceIds}},
        {owner: requester.refId, ownerType: requester.type}
      ]
    });

  allowResources = allowResources.filter(x => !denyResourceIds.includes(x._id));
  return allowResources;
}
