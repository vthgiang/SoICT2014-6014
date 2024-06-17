const {
    DelegationPolicy,
    Requester,
    Resource,
    Delegation
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

        if ((new Set(array.map(attr => attr.attributeId.toLowerCase().replace(/ /g, "")))).size !== array.length) {
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
                const checkPolicyCreated = await DelegationPolicy(connect(DB_CONNECTION, portal))
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
            const delegatorRequirements = await filterValidRequirementData(polArray[i].delegatorRequirements);
            const delegateeRequirements = await filterValidRequirementData(polArray[i].delegateeRequirements);
            const delegateObjectRequirements = await filterValidRequirementData(polArray[i].delegateObjectRequirements);
            const environmentRequirements = await filterValidRequirementData(polArray[i].environmentRequirements);

            newPolicy = await DelegationPolicy(connect(DB_CONNECTION, portal)).create({
                name: polArray[i].name.trim(),
                description: polArray[i].description.trim(),
                delegatorRequirements,
                delegateeRequirements,
                delegateObjectRequirements,
                environmentRequirements
            });
        }

    }

    let policy = await DelegationPolicy(connect(DB_CONNECTION, portal)).findById({ _id: newPolicy._id });;
    return policy;
}

// Lấy ra tất cả các thông tin Ví dụ theo mô hình lấy dữ liệu số  1
exports.getPolicies = async (portal, data) => {
    let keySearch = {};
    if (data?.name?.length > 0) {
        keySearch = {
            name: {
                $regex: data.name,
                $options: "i"
            }
        }
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
        totalPages
    }
}

// Lấy ra Ví dụ theo id
exports.getPolicyById = async (portal, id) => {
    let policy = await DelegationPolicy(connect(DB_CONNECTION, portal)).findById({ _id: id });
    return policy;
}

exports.getDetailedPolicyById = async (portal, id) => {
    const policy = await DelegationPolicy(connect(DB_CONNECTION, portal)).findById({ _id: id });
    const delegations = await Delegation(connect(DB_CONNECTION, portal)).find({ policy: id }).select('name description status');

    return {
        id: policy.id,
        name: policy.name,
        description: policy.description,
        delegatorRequirements: policy.delegatorRequirements,
        delegateeRequirements: policy.delegateeRequirements,
        delegateObjectRequirements: policy.delegateObjectRequirements,
        environmentRequirements: policy.environmentRequirements,
        delegations
    };
}

// Chỉnh sửa một Ví dụ
exports.editPolicy = async (portal, id, data) => {
    let oldPolicy = await DelegationPolicy(connect(DB_CONNECTION, portal)).findById(id);
    if (!oldPolicy) {
        throw [`policy_${id}_not_found`];
    }

    if (oldPolicy.name.trim().toLowerCase().replace(/ /g, "") !== data.name.trim().toLowerCase().replace(/ /g, "")) {
        const check = await DelegationPolicy(connect(DB_CONNECTION, portal)).exists({ name: data.name });
        if (check) throw ['policy_name_exist'];
    }

    const delegatorRequirements = await filterValidRequirementData(data.delegatorRequirements);
    const delegateeRequirements = await filterValidRequirementData(data.delegateeRequirements);
    const delegateObjectRequirements = await filterValidRequirementData(data.delegateObjectRequirements);
    const environmentRequirements = await filterValidRequirementData(data.environmentRequirements);

    await DelegationPolicy(connect(DB_CONNECTION, portal)).updateOne({ _id: id }, {
        $set: {
            name: data.name.trim(),
            description: data.description.trim(),
            delegatorRequirements,
            delegateeRequirements,
            delegateObjectRequirements,
            environmentRequirements
        }
    });

    const policy = await this.getPolicyById(portal, id);

    return policy;
}

// Xóa một Ví dụ
exports.deletePolicies = async (portal, policyIds) => {
    const delegationsHavePolicy = await Delegation(connect(DB_CONNECTION, portal)).exists({ policy: { $in: policyIds } });

    if (delegationsHavePolicy.length > 0) {
        throw ['policy_delegation_exist']
    }

    let policies = await DelegationPolicy(connect(DB_CONNECTION, portal))
        .deleteMany({ _id: { $in: policyIds.map(item => mongoose.Types.ObjectId(item)) } });

    return policies;
}


/**
 * Lấy ra danh sách thỏa mãn rule check thuộc tính
 * @input array đầu vào
 * @policyAttributes thuộc tính set trong policy
 * @policyRule rule check set trong policy
 */
exports.ruleCheck = (input, policyAttributes, policyRule) => {
    let satisfied = [];
    let count = 0;

    // Kiểm tra rule EQUALS
    // 1. Nếu rule là EQUALS
    if (policyRule == "EQUALS") {
        // 2. Với mỗi user lấy ra những element có tập thuộc tính giống hệt trong chính sách (số lượng thuộc tính == và giá trị giống) 
        input.forEach((element) => {
            // Kiểm tra length
            if (element.attributes.length > 0
                && element.attributes.length == policyAttributes.length
            ) {
                element.attributes.forEach((uAttr) => {
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
    if (policyRule == "BELONGS") {
        // 2. Với mỗi element lấy ra những element mà thuộc tính là tập con thuộc tính trong chính sách (số lượng thuộc tính <= và giá trị giống) 
        input.forEach((element) => {
            // Kiểm tra length
            if (element.attributes.length > 0 && element.attributes.length <= policyAttributes.length) {
                element.attributes.forEach((uAttr) => {
                    policyAttributes.forEach((pAttr) => {
                        // Kiểm tra id thuộc tính và value
                        if (pAttr.attributeId.equals(uAttr.attributeId) && pAttr.value == uAttr.value) {
                            count++;
                        }
                    })
                })
                if (count == element.attributes.length) {
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
    if (policyRule == "CONTAINS") {
        // 2. Với mỗi element lấy ra những element mà thuộc tính là tập cha thuộc tính trong chính sách (số lượng thuộc tính >= và giá trị giống) 
        input.forEach((element) => {
            // Kiểm tra length
            if (element.attributes.length > 0 && element.attributes.length >= policyAttributes.length) {
                element.attributes.forEach((uAttr) => {
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
