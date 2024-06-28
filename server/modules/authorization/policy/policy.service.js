const {
    AuthorizationPolicy,
    Requester,
    Resource,
    DynamicAssignment,
    Attribute
} = require('../../../models');

const {
    connect
} = require(`../../../helpers/dbHelper`);
const mongoose = require('mongoose');

const RequesterService = require('../../auth-service/requester/requester.service')
const ResourceService = require('../../auth-service/resource/resource.service')

const filterValidAttributeArray = async (array) => {
    let resArray = [];
    if (array.length > 0) {

        if ((new Set(array.map(attr => attr.attributeId.toLowerCase().replace(/ /g, '')))).size !== array.length) {
            throw ['attribute_selected_duplicate'];
        }

        for (let i = 0; i < array.length; i++) {
            // const attribute = await Attribute(connect(DB_CONNECTION, portal)).findOne({ _id: array[i].attributeId });
            if (array[i]) {
                // array[i] = { ...array[i], name: attribute.attributeName };
                resArray = [...resArray, array[i]];
            }
        }

        return resArray;
    } else {
        return [];
    }
}

const filterValidRequirementData = async (requirement) => {
    const attrArray = await filterValidAttributeArray(requirement.attributes ?? []);
    const dataAttr = attrArray.map(attr => {
        return {
            attributeId: attr.attributeId,
            description: attr.description?.trim(),
            value: attr.value?.trim(),
        }
    });
    return {
        attributes: dataAttr,
        rule: dataAttr.length > 0 ? requirement.rule : ''
    }
}

// Tạo mới mảng Ví dụ
exports.createPolicy = async (portal, data) => {
    let newPolicy;

    const filterValidPolicyArray = async (array) => {
        let resArray = [];
        if (array.length > 0) {

            for (let i = 0; i < array.length; i++) {
                const checkPolicyCreated = await AuthorizationPolicy(connect(DB_CONNECTION, portal))
                    .exists({ name: array[i].name });
                if (checkPolicyCreated) {
                    throw ['policy_name_exist'];
                }
                if (array[i]) resArray = [...resArray, array[i]];
            }

            return resArray;
        } else {
            return [];
        }
    }

    const polArray = await filterValidPolicyArray(data);
    if (polArray && polArray.length !== 0) {
        for (let i = 0; i < polArray.length; i++) {
            const requesterRequirements = await filterValidRequirementData(polArray[i].requesterRequirements);
            const resourceRequirements = await filterValidRequirementData(polArray[i].resourceRequirements);
            const roleRequirements = await filterValidRequirementData(polArray[i].roleRequirements);
            const environmentRequirements = await filterValidRequirementData(polArray[i].environmentRequirements);

            newPolicy = await AuthorizationPolicy(connect(DB_CONNECTION, portal)).create({
                name: polArray[i].name.trim(),
                effect: polArray[i].effect,
                description: polArray[i].description.trim(),
                effectiveStartTime: polArray[i].effectiveStartTime,
                effectiveEndTime: polArray[i].effectiveEndTime,
                requesterRequirements,
                resourceRequirements,
                roleRequirements,
                environmentRequirements
            });
        }

    }

    let policy = await AuthorizationPolicy(connect(DB_CONNECTION, portal)).findById({ _id: newPolicy._id });;
    return policy;
}


/**
 * Thêm policy cho quan hệ cho userrole và privilege thỏa mãn
 * @portal portal của db
 * @policyId id của policy
 */
exports.cacheAuthorization = async (portal, policyId) => {
    const policy = await AuthorizationPolicy(connect(DB_CONNECTION, portal)).findById({ _id: policyId });
    const requesters = await Requester(connect(DB_CONNECTION, portal)).find();
    const resources = await Resource(connect(DB_CONNECTION, portal)).find();

    const authorizationAttributeIds = (await Attribute(connect(DB_CONNECTION, portal))
        .find({type: {$in: ['Authorization', 'Mixed']}})
        .select('_id')).map(x => x.id);

    let satisfiedRequesters = this.ruleCheck(authorizationAttributeIds, requesters, policy.requesterRequirements.attributes, policy.requesterRequirements.rule);
    let satisfiedResources = this.ruleCheck(authorizationAttributeIds, resources, policy.resourceRequirements.attributes, policy.resourceRequirements.rule);

    await DynamicAssignment(connect(DB_CONNECTION, portal)).create({
        policyId: policy._id,
        requesterIds: satisfiedRequesters,
        resourceIds: satisfiedResources
    });
}

// Lấy ra tất cả các thông tin Ví dụ theo mô hình lấy dữ liệu số  1
exports.getPolicies = async (portal, data) => {
    let keySearch = {};
    if (data?.name?.length > 0) {
        keySearch = {
            name: {
                $regex: data.name,
                $options: 'i'
            }
        }
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
        totalPages
    }
}

// Lấy ra tất cả các thông tin Ví dụ theo mô hình lấy dữ liệu số  1
exports.getAllPolicies = async (portal) => {
    let policies = await DelegationPolicy(connect(DB_CONNECTION, portal)).find();
    return {
        data: policies
    }
}

// Lấy ra Ví dụ theo id
exports.getPolicyById = async (portal, id) => {
    let policy = await AuthorizationPolicy(connect(DB_CONNECTION, portal)).findById({ _id: id });
    return policy;
}

exports.getDetailedPolicyById = async (portal, id) => {
    const policy = await AuthorizationPolicy(connect(DB_CONNECTION, portal)).findById({ _id: id });
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
    let oldPolicy = await AuthorizationPolicy(connect(DB_CONNECTION, portal)).findById(id);
    if (!oldPolicy) {
        throw [`policy_${id}_not_found`];
    }

    if (oldPolicy.name.trim().toLowerCase().replace(/ /g, '') !== data.name.trim().toLowerCase().replace(/ /g, '')) {
        const check = await AuthorizationPolicy(connect(DB_CONNECTION, portal)).exists({ name: data.name });
        if (check) throw ['policy_name_exist'];
    }

    const requesterRequirements = await filterValidRequirementData(data.requesterRequirements);
    const resourceRequirements = await filterValidRequirementData(data.resourceRequirements);
    const roleRequirements = await filterValidRequirementData(data.roleRequirements);
    const environmentRequirements = await filterValidRequirementData(data.environmentRequirements);

    await AuthorizationPolicy(connect(DB_CONNECTION, portal)).updateOne({ _id: id }, {
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

    await this.cleanAuthorizationPolicy(portal, id);
    await this.cacheAuthorization(portal, id);

    const policy = await AuthorizationPolicy(connect(DB_CONNECTION, portal)).findById(id);

    return policy;
}

// Xóa một Ví dụ
exports.deletePolicies = async (portal, policyIds) => {
    let policies = await AuthorizationPolicy(connect(DB_CONNECTION, portal))
        .deleteMany({ _id: { $in: policyIds.map(item => mongoose.Types.ObjectId(item)) } });

    policyIds.forEach(async policyId => {
        await this.cleanAuthorizationPolicy(portal, policyId)
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
exports.cleanAuthorizationPolicy = async (portal, policyId) => {
    await DynamicAssignment(connect(DB_CONNECTION, portal))
        .deleteMany({ policyId: policyId })
}

exports.checkAllPolicies = async (portal) => {
    const allPolicies = await AuthorizationPolicy(connect(DB_CONNECTION, portal)).find();
    allPolicies.map(p => p._id).forEach(async policyId => {
        await this.cleanAuthorizationPolicy(portal, policyId)
        await this.cacheAuthorization(portal, policyId)
    })
}
