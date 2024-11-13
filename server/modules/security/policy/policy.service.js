const {
    Entity,
    Object,
    Policy,
    Rule
} = require('../../../models');

const {
    connect
} = require(`../../../helpers/dbHelper`);
const mongoose = require('mongoose');

/**
 * Need populate 'policyId' when query DynamicAssignments
 * @param {*} dynamicAssignments 
 * @returns Active authorization assignments
 */
exports.filterActivePolicies = (dynamicAssignments = []) => {
    const activePolicies = dynamicAssignments.filter(x => 
        x.policyId &&
        (x.policyId.effectiveStartTime?.getTime() <= Date.now()) &&
        (x.policyId.effectiveEndTime ? x.policyId.effectiveEndTime?.getTime() >= Date.now() : true)
    );
    return activePolicies;
}

/**
 * Filter authorization policies that satisfied role requirements
 * @param {*} activePolicies list of authorization policies
 * @param {*} role role of user
 * @returns Authorization policies that satisfied role requirements
 */
exports.filterPoliciesSatisfiedRoleRequirement = async (portal, activePolicies, role) => {
    if (!activePolicies || !activePolicies.length) {
        return []
    };
    const authorizationAttributeIds = (await Attribute(connect(DB_CONNECTION, portal))
        .find({type: {$in: ['Authorization', 'Mixed']}})
        .select('_id')).map(x => x.id);

    const satisfiedRolePolicies = activePolicies.filter((x) => {
        if (!x.roleRequirements.attributes || x.roleRequirements.attributes.length == 0) {
            return true;
        }
        return this.ruleCheck(
            authorizationAttributeIds,
            [role],
            x.roleRequirements.attributes,
            x.roleRequirements.rule
        )?.length > 0
    });

    return satisfiedRolePolicies;
}

/**
 * Filter authorization dynamic assignments that satisfied role requirements
 * @param {*} activeAssignments list of policy dynamic assignments
 * @param {*} role role of user
 * @returns Authorization dynamic assignments that satisfied role requirements
 */
exports.filterAssignmentsSatisfiedRoleRequirement = async (portal, activeAssignments, role) => {
    if (!activeAssignments || !activeAssignments.length) {
        return []
    };
    const authorizationAttributeIds = (await Attribute(connect(DB_CONNECTION, portal))
        .find({type: {$in: ['Authorization', 'Mixed']}})
        .select('_id')).map(x => x.id);

    const satisfiedRoleAssignments = activeAssignments.filter((x) => {
        if (!x.policyId.roleRequirements.attributes || x.policyId.roleRequirements.attributes.length == 0) {
            return true;
        }
        return this.ruleCheck(
            authorizationAttributeIds,
            [role],
            x.policyId.roleRequirements.attributes,
            x.policyId.roleRequirements.rule
        )?.length > 0;
    });

    return satisfiedRoleAssignments;
}

// Tạo mới mảng Ví dụ
exports.createPolicy = async (portal, data) => {
    
    const authorizationRuleIds = [];
    const delegationRuleIds = [];
    for (let i=0; i< data.authorizationRules.length; i++) {
        const rule = await Rule(connect(DB_CONNECTION, portal)).create(data.authorizationRules[i]);
        authorizationRuleIds.push(rule.id);
    }

    for (let i=0; i< data.delegationRules.length; i++) {
        const rule = await Rule(connect(DB_CONNECTION, portal)).create(data.delegationRules[i]);
        delegationRuleIds.push(rule.id);
    }

    const newPolicy = await Policy(connect(DB_CONNECTION, portal)).create({
        name: data.name.trim(),
        priority: data.priority,
        authorizationRules: authorizationRuleIds,
        delegationRules: delegationRuleIds,
    });

    let policy = await Policy(connect(DB_CONNECTION, portal)).findById({ _id: newPolicy._id });;
    return policy;
}


// Lấy ra tất cả các thông tin Ví dụ theo mô hình lấy dữ liệu số  1
exports.getAllPolicies = async (portal) => {
    let policies = await Policy(connect(DB_CONNECTION, portal)).find();
    return {
        data: policies
    }
}

// Lấy ra Ví dụ theo id
exports.getPolicyById = async (portal, id) => {
    let policy = await Policy(connect(DB_CONNECTION, portal)).findById({ _id: id });
    return policy;
}

exports.getDetailedPolicyById = async (portal, id) => {
    const policy = await Policy(connect(DB_CONNECTION, portal)).findById({ _id: id });
    const authorization = await DynamicAssignment(connect(DB_CONNECTION, portal)).findOne({ policyId: id })

    if (!policy) {
        throw ['policy_invalid'];
    }

    let requesters, resources;
    if (authorization){
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
            resources: resources ?? []
        }
    };
}

// Chỉnh sửa một Ví dụ
exports.editPolicy = async (portal, id, data) => {
    let oldPolicy = await Policy(connect(DB_CONNECTION, portal)).findById(id);
    if (!oldPolicy) {
        throw [`policy_${id}_not_found`];
    }

    if (oldPolicy.name.trim().toLowerCase().replace(/ /g, '') !== data.name.trim().toLowerCase().replace(/ /g, '')) {
        const check = await Policy(connect(DB_CONNECTION, portal)).exists({ name: data.name });
        if (check) throw ['policy_name_exist'];
    }

    const requesterRequirements = await filterValidRequirementData(data.requesterRequirements);
    const resourceRequirements = await filterValidRequirementData(data.resourceRequirements);
    const roleRequirements = await filterValidRequirementData(data.roleRequirements);
    const environmentRequirements = await filterValidRequirementData(data.environmentRequirements);

    await Policy(connect(DB_CONNECTION, portal)).updateOne({ _id: id }, {
        $set: {
            name: data.name.trim(),
            effect: data.effect,
            description: data.description.trim(),
            effectiveStartTime: data.effectiveStartTime,
            effectiveEndTime: data.effectiveEndTime,
            requesterRequirements,
            resourceRequirements,
            roleRequirements,
            environmentRequirements
        }
    });

    await this.cleanPolicy(portal, id);
    await this.cacheAuthorization(portal, id);

    const policy = await Policy(connect(DB_CONNECTION, portal)).findById(id);

    return policy;
}

// Xóa một Ví dụ
exports.deletePolicies = async (portal, policyIds) => {
    let policies = await Policy(connect(DB_CONNECTION, portal))
        .deleteMany({ _id: { $in: policyIds.map(item => mongoose.Types.ObjectId(item)) } });

    policyIds.forEach(async policyId => {
        await this.cleanPolicy(portal, policyId)
    })

    return policies;
}


/**
 * Lấy ra danh sách thỏa mãn rule check thuộc tính
 * @input array đầu vào
 * @policyAttributes thuộc tính set trong policy
 * @policyRule rule check set trong policy
 */
exports.ruleCheck = (authorizationAttributeIds, input, policyAttributes, policyRule) => {
    let satisfied = [];
    let count = 0;

    // Kiểm tra rule EQUALS
    // 1. Nếu rule là EQUALS
    if (policyRule == 'EQUALS') {
        // 2. Với mỗi user lấy ra những element có tập thuộc tính giống hệt trong chính sách (số lượng thuộc tính == và giá trị giống) 
        input.forEach((element) => {
            const attributes = element.attributes.filter((x) => authorizationAttributeIds.includes(x.attributeId.toString()));
            // Kiểm tra length
            if (attributes.length > 0
                && attributes.length == policyAttributes.length
            ) {
                attributes.forEach((uAttr) => {
                    policyAttributes.forEach((pAttr) => {
                        // Kiểm tra id thuộc tính và value
                        if (pAttr.attributeId.equals(uAttr.attributeId) && pAttr.value == uAttr.value) {
                            count++;
                        }
                    })
                })
                if (count == policyAttributes.length
                ) {
                    // Nếu count bằng với length policy attribute thì add element vào array
                    satisfied = [...satisfied, element]
                }
                // Reset count
                count = 0;
            }

        })
    }

    // Kiểm tra rule BELONGS
    // 1. Nếu rule là BELONGS
    if (policyRule == 'BELONGS') {
        // 2. Với mỗi element lấy ra những element mà thuộc tính là tập con thuộc tính trong chính sách (số lượng thuộc tính <= và giá trị giống) 
        input.forEach((element) => {
            const attributes = element.attributes.filter((x) => authorizationAttributeIds.includes(x.attributeId.toString()));
            // Kiểm tra length
            if (attributes.length > 0 && attributes.length <= policyAttributes.length) {
                attributes.forEach((uAttr) => {
                    policyAttributes.forEach((pAttr) => {
                        // Kiểm tra id thuộc tính và value
                        if (pAttr.attributeId.equals(uAttr.attributeId) && pAttr.value == uAttr.value) {
                            count++;
                        }
                    })
                })
                if (count == attributes.length) {
                    // Nếu count == với length element attribute thì add element vào array
                    satisfied = [...satisfied, element]
                }
                // Reset count
                count = 0;
            }

        })
    }

    // Kiểm tra rule CONTAINS
    // 1. Nếu rule là CONTAINS
    if (policyRule == 'CONTAINS') {
        // 2. Với mỗi element lấy ra những element mà thuộc tính là tập cha thuộc tính trong chính sách (số lượng thuộc tính >= và giá trị giống) 
        input.forEach((element) => {
            const attributes = element.attributes.filter((x) => authorizationAttributeIds.includes(x.attributeId.toString()));
            // Kiểm tra length
            if (attributes.length > 0 && attributes.length >= policyAttributes.length) {
                attributes.forEach((uAttr) => {
                    policyAttributes.forEach((pAttr) => {
                        // Kiểm tra id thuộc tính và value
                        if (pAttr.attributeId.equals(uAttr.attributeId) && pAttr.value == uAttr.value) {
                            count++;
                        }
                    })
                })
                if (count == policyAttributes.length) {
                    // Nếu count == với length policy attribute thì add element vào array
                    satisfied = [...satisfied, element]
                }
                // Reset count
                count = 0;
            }

        })
    }

    return satisfied;
}

/**
 * Xóa policyId khỏi các privielges và userroles hiện có policyId
 * @portal portal của db
 * @policyId id của policy
 */
exports.cleanPolicy = async (portal, policyId) => {
    await DynamicAssignment(connect(DB_CONNECTION, portal))
        .deleteMany({ policyId: policyId })
}

exports.checkAllPolicies = async (portal) => {
    const allPolicies = await Policy(connect(DB_CONNECTION, portal)).find();
    allPolicies.map(p => p._id).forEach(async policyId => {
        await this.cleanPolicy(portal, policyId)
        await this.cacheAuthorization(portal, policyId)
    })
}
