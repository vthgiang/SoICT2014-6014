const {
    Policy,
    Attribute,
    User,
    UserRole,
    Role,
    Link,
    Component,
    Privilege,
    Delegation
} = require('../../../models');

const {
    connect
} = require(`../../../helpers/dbHelper`);
const mongoose = require('mongoose');

// Tạo mới mảng Ví dụ
exports.createPolicy = async (portal, data) => {
    let newPolicy;

    const filterValidPolicyArray = async (array) => {
        let resArray = [];
        if (array.length > 0) {

            for (let i = 0; i < array.length; i++) {
                const checkPolicyCreated = await Policy(connect(DB_CONNECTION, portal)).findOne({ policyName: array[i].policyName, category: "Authorization" }).collation({ "locale": "vi", strength: 2, alternate: "shifted", maxVariable: "space" })
                if (checkPolicyCreated && checkPolicyCreated.category == "Authorization") {
                    throw ['policy_name_exist'];
                }
                if (array[i]) resArray = [...resArray, array[i]];
            }

            return resArray;
        } else {
            return [];
        }
    }
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
    const filterValidAttributeData = async (array) => {
        const attrArray = await filterValidAttributeArray(array);
        const dataAttr = attrArray.map(attr => {
            return {
                attributeId: attr.attributeId,
                // name: attr.name.trim(),
                value: attr.value.trim(),
            }
        });
        return dataAttr
    }

    const polArray = await filterValidPolicyArray(data);
    console.log(data)
    if (polArray && polArray.length !== 0) {
        for (let i = 0; i < polArray.length; i++) {
            const userDataAttr = await filterValidAttributeData(polArray[i].subject.user.userAttributes);
            const roleDataAttr = await filterValidAttributeData(polArray[i].subject.role.roleAttributes);
            const resourceDataAttr = await filterValidAttributeData(polArray[i].resource.resourceAttributes);

            newPolicy = await Policy(connect(DB_CONNECTION, portal)).create({
                policyName: polArray[i].policyName.trim(),
                description: polArray[i].description.trim(),
                category: "Authorization",
                subject: {
                    user: {
                        userAttributes: userDataAttr,
                        userRule: polArray[i].subject.user.userRule
                    },
                    role: {
                        roleAttributes: roleDataAttr,
                        roleRule: polArray[i].subject.role.roleRule
                    }
                },
                resource: {
                    resourceAttributes: resourceDataAttr,
                    resourceRule: polArray[i].resource.resourceRule
                },
            });
        }

    }

    let policy = await Policy(connect(DB_CONNECTION, portal)).findById({ _id: newPolicy._id });;
    return policy;
}

exports.createPolicyDelegation = async (portal, data) => {
    let newPolicy;

    const filterValidPolicyArray = async (array) => {
        let resArray = [];
        if (array.length > 0) {

            for (let i = 0; i < array.length; i++) {
                const checkPolicyCreated = await Policy(connect(DB_CONNECTION, portal)).findOne({ policyName: array[i].policyName, category: "Delegation" }).collation({ "locale": "vi", strength: 2, alternate: "shifted", maxVariable: "space" })
                if (checkPolicyCreated && checkPolicyCreated.category == "Delegation") {
                    throw ['policy_name_exist'];
                }
                if (array[i]) resArray = [...resArray, array[i]];
            }

            return resArray;
        } else {
            return [];
        }
    }
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
    const filterValidAttributeData = async (array) => {
        const attrArray = await filterValidAttributeArray(array);
        const dataAttr = attrArray.map(attr => {
            return {
                attributeId: attr.attributeId,
                // name: attr.name.trim(),
                value: attr.value.trim(),
            }
        });
        return dataAttr
    }

    const polArray = await filterValidPolicyArray(data);
    console.log(data)
    if (polArray && polArray.length !== 0) {
        for (let i = 0; i < polArray.length; i++) {
            const delegatorDataAttr = await filterValidAttributeData(polArray[i].delegator.delegatorAttributes);
            const delegateeDataAttr = await filterValidAttributeData(polArray[i].delegatee.delegateeAttributes);
            const resourceDataAttr = await filterValidAttributeData(polArray[i].resource.resourceAttributes);
            const delegatedObjectDataAttr = await filterValidAttributeData(polArray[i].delegatedObject.delegatedObjectAttributes);

            newPolicy = await Policy(connect(DB_CONNECTION, portal)).create({
                policyName: polArray[i].policyName.trim(),
                description: polArray[i].description.trim(),
                category: "Delegation",
                delegator: {
                    delegatorAttributes: delegatorDataAttr,
                    delegatorRule: polArray[i].delegator.delegatorRule
                },
                delegatee: {
                    delegateeAttributes: delegateeDataAttr,
                    delegateeRule: polArray[i].delegatee.delegateeRule
                },
                delegatedObject: {
                    delegatedObjectAttributes: delegatedObjectDataAttr,
                    delegatedObjectRule: polArray[i].delegatedObject.delegatedObjectRule
                },
                resource: {
                    resourceAttributes: resourceDataAttr,
                    resourceRule: polArray[i].resource.resourceRule
                },
            });
        }

    }

    let policy = await Policy(connect(DB_CONNECTION, portal)).findById({ _id: newPolicy._id });;
    return policy;
}
// Lấy ra tất cả các thông tin Ví dụ theo mô hình lấy dữ liệu số  1
exports.getPolicies = async (portal, data) => {
    let keySearch = { category: "Authorization" };
    if (data?.policyName?.length > 0) {
        keySearch = {
            policyName: {
                $regex: data.policyName,
                $options: "i"
            }
        }
    }

    let page, perPage;
    page = data?.page ? Number(data.page) : 1;
    perPage = data?.perPage ? Number(data.perPage) : 20;

    let totalList = await Policy(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let policies = await Policy(connect(DB_CONNECTION, portal)).find(keySearch)
        .skip((page - 1) * perPage)
        .limit(perPage);

    return {
        data: policies,
        totalList
    }
}

// Lấy ra tất cả các thông tin Ví dụ theo mô hình lấy dữ liệu số  1
exports.getPoliciesDelegation = async (portal, data) => {
    let keySearch = { category: "Delegation" };
    if (data?.policyName?.length > 0) {
        keySearch = {
            policyName: {
                $regex: data.policyName,
                $options: "i"
            }
        }
    }

    let page, perPage;
    page = data?.page ? Number(data.page) : 1;
    perPage = data?.perPage ? Number(data.perPage) : 20;

    let totalList = await Policy(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let policies = await Policy(connect(DB_CONNECTION, portal)).find(keySearch)
        .skip((page - 1) * perPage)
        .limit(perPage);

    return {
        data: policies,
        totalList
    }
}

// Lấy ra một phần thông tin Ví dụ (lấy ra policyName) theo mô hình dữ liệu số  2
exports.getOnlyPolicyName = async (portal, data) => {
    let keySearch;
    if (data?.policyName?.length > 0) {
        keySearch = {
            policyName: {
                $regex: data.policyName,
                $options: "i"
            }
        }
    }

    let page, perPage;
    page = data?.page ? Number(data.page) : 1;
    perPage = data?.perPage ? Number(data.perPage) : 20;

    let totalList = await Policy(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let PolicyCollection = await Policy(connect(DB_CONNECTION, portal)).find(keySearch, { policyName: 1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

    return {
        data: PolicyCollection,
        totalList
    }
}

// Lấy ra Ví dụ theo id
exports.getPolicyById = async (portal, id) => {
    let policy = await Policy(connect(DB_CONNECTION, portal)).findById({ _id: id });
    if (policy) {
        return policy;
    }
    return -1;
}

// Chỉnh sửa một Ví dụ
exports.editPolicy = async (portal, id, data) => {
    let oldPolicy = await Policy(connect(DB_CONNECTION, portal)).findById(id);
    if (!oldPolicy) {
        return -1;
    }
    const check = await Policy(connect(DB_CONNECTION, portal)).findOne({ policyName: data.policyName, category: "Authorization" }).collation({ "locale": "vi", strength: 2, alternate: "shifted", maxVariable: "space" })

    if (oldPolicy.policyName.trim().toLowerCase().replace(/ /g, "") !== data.policyName.trim().toLowerCase().replace(/ /g, "")) {
        if (check && check.category == "Authorization") throw ['policy_name_exist'];
    }

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
    const filterValidAttributeData = async (array) => {
        const attrArray = await filterValidAttributeArray(array);
        const dataAttr = attrArray.map(attr => {
            return {
                attributeId: attr.attributeId,
                // name: attr.name.trim(),
                value: attr.value.trim(),
            }
        });
        return dataAttr
    }

    const userDataAttr = await filterValidAttributeData(data.subject.user.userAttributes);
    const roleDataAttr = await filterValidAttributeData(data.subject.role.roleAttributes);
    const resourceDataAttr = await filterValidAttributeData(data.resource.resourceAttributes);

    await Policy(connect(DB_CONNECTION, portal)).updateOne({ _id: id }, {
        $set: {
            policyName: data.policyName.trim(),
            description: data.description.trim(),
            subject: {
                user: {
                    userAttributes: userDataAttr,
                    userRule: data.subject.user.userRule
                },
                role: {
                    roleAttributes: roleDataAttr,
                    roleRule: data.subject.role.roleRule
                }
            },
            resource: {
                resourceAttributes: resourceDataAttr,
                resourceRule: data.resource.resourceRule
            },
        }
    });


    // Cach 2 de update
    // await Policy(connect(DB_CONNECTION, portal)).update({ _id: id }, { $set: data });
    let policy = await Policy(connect(DB_CONNECTION, portal)).findById({ _id: oldPolicy._id });

    return policy;
}

exports.editPolicyDelegation = async (portal, id, data) => {
    let oldPolicy = await Policy(connect(DB_CONNECTION, portal)).findById(id);
    if (!oldPolicy) {
        return -1;
    }
    const check = await Policy(connect(DB_CONNECTION, portal)).findOne({ policyName: data.policyName, category: "Delegation" }).collation({ "locale": "vi", strength: 2, alternate: "shifted", maxVariable: "space" })

    if (oldPolicy.policyName.trim().toLowerCase().replace(/ /g, "") !== data.policyName.trim().toLowerCase().replace(/ /g, "")) {
        if (check && check.category == "Delegation") throw ['policy_name_exist'];
    }

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
    const filterValidAttributeData = async (array) => {
        const attrArray = await filterValidAttributeArray(array);
        const dataAttr = attrArray.map(attr => {
            return {
                attributeId: attr.attributeId,
                // name: attr.name.trim(),
                value: attr.value.trim(),
            }
        });
        return dataAttr
    }

    const delegatorDataAttr = await filterValidAttributeData(data.delegator.delegatorAttributes);
    const delegateeDataAttr = await filterValidAttributeData(data.delegatee.delegateeAttributes);
    const resourceDataAttr = await filterValidAttributeData(data.resource.resourceAttributes);
    const delegatedObjectDataAttr = await filterValidAttributeData(data.delegatedObject.delegatedObjectAttributes);

    await Policy(connect(DB_CONNECTION, portal)).updateOne({ _id: id }, {
        $set: {
            policyName: data.policyName.trim(),
            description: data.description.trim(),
            delegator: {
                delegatorAttributes: delegatorDataAttr,
                delegatorRule: data.delegator.delegatorRule
            },
            delegatee: {
                delegateeAttributes: delegateeDataAttr,
                delegateeRule: data.delegatee.delegateeRule
            },
            delegatedObject: {
                delegatedObjectAttributes: delegatedObjectDataAttr,
                delegatedObjectRule: data.delegatedObject.delegatedObjectRule
            },
            resource: {
                resourceAttributes: resourceDataAttr,
                resourceRule: data.resource.resourceRule
            },
        }
    });


    // Cach 2 de update
    // await Policy(connect(DB_CONNECTION, portal)).update({ _id: id }, { $set: data });
    let policy = await Policy(connect(DB_CONNECTION, portal)).findById({ _id: oldPolicy._id });

    return policy;
}


exports.deletePoliciesDelegation = async (portal, policyIds) => {
    const delegationsHavePolicy = await Delegation(connect(DB_CONNECTION, portal)).find({ delegatePolicy: { $in: policyIds } });

    let policies;
    if (delegationsHavePolicy.length > 0) {
        throw ['policy_delegation_exist']
    } else {

        policies = await Policy(connect(DB_CONNECTION, portal))
            .deleteMany({ _id: { $in: policyIds.map(item => mongoose.Types.ObjectId(item)) } });
    }

    return policies;
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

/**
 * Xóa policyId khỏi các privielges và userroles hiện có policyId
 * @portal portal của db
 * @policyId id của policy
 */
exports.cleanPolicy = async (portal, policyId) => {
    // xóa các privilege có only policyId hoặc remove policyId khỏi Privilege nếu policies > 1
    let currentPrivilegesHaveThisPolicy = await Privilege(connect(DB_CONNECTION, portal))
        .find({ policies: policyId });
    if (currentPrivilegesHaveThisPolicy.length > 0) {
        console.log('currentPrivilegesHaveThisPolicy', currentPrivilegesHaveThisPolicy)

        currentPrivilegesHaveThisPolicy.forEach(async p => {
            if (p.policies.length == 1) {
                await Privilege(connect(DB_CONNECTION, portal)).deleteOne({ _id: p._id })
            }
            else {
                p.policies.splice(p.policies.indexOf(policyId), 1)
                p.save()
            }
        })
    }

    // Xóa policyId khỏi UserRole policies
    let currentUserRoleHaveThisPolicy = await UserRole(connect(DB_CONNECTION, portal)).find({ policies: policyId });
    if (currentUserRoleHaveThisPolicy.length > 0) {
        console.log('currentUserRoleHaveThisPolicy', currentUserRoleHaveThisPolicy)
        currentUserRoleHaveThisPolicy.forEach(async ur => {
            // await UserRole(connect(DB_CONNECTION, portal)).updateOne({ _id: ur._id }, {
            //     $set: {
            //         policies: ur.policies.splice(ur.policies.indexOf(policyId), 1)
            //     }
            // });
            // let urr = await UserRole(connect(DB_CONNECTION, portal)).find({ _id: ur.id })
            ur.policies.splice(ur.policies.indexOf(policyId), 1)
            ur.save()
            // console.log("urr", urr)
        })
    }
}

exports.checkAllPolicies = async (portal) => {
    const allPolicies = await Policy(connect(DB_CONNECTION, portal)).find({ category: "Authorization" });
    allPolicies.map(p => p._id).forEach(async policyId => {
        await this.cleanPolicy(portal, policyId)
        await this.addPolicyToRelationship(portal, policyId)
    })
}

/**
 * Thêm policy cho quan hệ cho userrole và privilege thỏa mãn
 * @portal portal của db
 * @policyId id của policy
 */
exports.addPolicyToRelationship = async (portal, policyId) => {
    const policy = await Policy(connect(DB_CONNECTION, portal)).findById({ _id: policyId });
    const users = await User(connect(DB_CONNECTION, portal)).find().populate(
        {
            path: "roles",
            populate: {
                path: "roleId",
            },
        },
    );
    const links = await Link(connect(DB_CONNECTION, portal)).find().populate([{ path: 'roles', populate: { path: 'roleId' } }, { path: 'components' }]);
    const components = await Component(connect(DB_CONNECTION, portal)).find().populate([{ path: 'roles', populate: { path: 'roleId' } }, { path: 'links' }]);


    let satisfiedSubjects = [];
    let satisfiedUsers = [];
    let satisfiedRoles = [];
    let satisfiedUserRoles = [];
    let satisfiedLinks = [];
    let satisfiedComponents = [];


    // lấy ds các user thỏa mãn policy
    if (policy.subject.user.userAttributes) {
        satisfiedUsers = this.ruleCheck(users, policy.subject.user.userAttributes, policy.subject.user.userRule);

        console.log('satisfiedUsers', satisfiedUsers)

        // lấy ds các role thỏa của các user bên trên, đẩy vào satisfiedSubjects
        satisfiedUsers.forEach((user) => {
            // nếu roleAttribute rỗng thì lấy tất cả role hiện có của satisfiedUser, nếu khỗng rỗng thì checkRule
            satisfiedUserRoles = policy.subject.role.roleAttributes ? this.ruleCheck(user.roles.filter(r => !r.delegation).map((ur) => ur.roleId), policy.subject.role.roleAttributes, policy.subject.role.roleRule) : user.roles.filter(r => !r.delegation).map((ur) => ur.roleId)
            satisfiedRoles = satisfiedRoles.concat(satisfiedUserRoles)
            satisfiedSubjects = [...satisfiedSubjects, { user: user._id, roles: satisfiedUserRoles.map(ur => ur._id) }]
        })
    }
    console.log('satisfiedRoles', satisfiedRoles)
    console.log('satisfiedSubjects', satisfiedSubjects)

    // let data = [];
    // Thêm policy vào quan hệ user role
    satisfiedSubjects.forEach(async subject => {
        subject.roles.forEach(async role => {
            // data = [
            //     ...data,
            //     {
            //         userId: subject.user,
            //         roleId: role,
            //     }
            // ]
            let userRole = await UserRole(connect(DB_CONNECTION, portal)).findOne({
                userId: subject.user,
                roleId: role
            });
            console.log("userRole", userRole)
            userRole.policies.indexOf(policyId) === -1 ? userRole.policies.push(policyId) : null
            userRole.save();
        })

    });

    // Note: Xử lý từng phần link và component riêng
    // Link: Thêm privilege nếu chưa exist
    // Component: Lấy ra các link mà role đó dc truy cập, nếu link chứa satisfiedComponent thì tạo privilege giữa role và component, nếu không thì ko tạo privilege

    // Lấy ds các resource thỏa mãn policy
    if (policy.resource.resourceAttributes) {
        satisfiedLinks = this.ruleCheck(links, policy.resource.resourceAttributes, policy.resource.resourceRule);
        satisfiedComponents = this.ruleCheck(components, policy.resource.resourceAttributes, policy.resource.resourceRule);
        console.log("satisfiedLinks", satisfiedLinks)
        console.log("satisfiedComponents", satisfiedComponents)
    }

    let newPrivilegeLink;
    let newPrivilegeComponent;

    // Lấy unique role nếu duplicate
    satisfiedRoles = satisfiedRoles.filter((value, index, self) => {
        return self.indexOf(value) === index
    })

    // Thêm privilege giữa role và link thỏa mãn nếu chưa tồn tại privilege giữa role hoặc role parents với link
    satisfiedLinks.forEach(async link => {
        satisfiedRoles.forEach(async role => {
            const existPrivilegeLink = await Privilege(connect(DB_CONNECTION, portal)).findOne({
                roleId: {
                    $in: [role._id].concat(role.parents),
                },
                resourceId: link._id
            })
            if (!existPrivilegeLink) {
                newPrivilegeLink = await Privilege(connect(DB_CONNECTION, portal)).create({
                    roleId: role._id,
                    resourceId: link._id,
                    resourceType: 'Link',
                });
                const newPl = await Privilege(connect(DB_CONNECTION, portal)).findOne({
                    _id: newPrivilegeLink._id
                });
                newPl.policies.indexOf(policyId) === -1 ? newPl.policies.push(policyId) : null
                await newPl.save();

                console.log('newPrivilegeLink', newPl)
            }
        })
    })

    // Thêm privilege giữa role và component thỏa mãn nếu chưa tồn tại privilege giữa role hoặc role parents với component
    satisfiedComponents.forEach(async component => {
        satisfiedRoles.forEach(async role => {
            const hasPrivilegeToComponentLink = await Privilege(connect(DB_CONNECTION, portal)).find({
                roleId: {
                    $in: [role._id].concat(role.parents),
                },
                resourceId: { $in: component.links }
            })
            const existPrivilegeComponent = await Privilege(connect(DB_CONNECTION, portal)).findOne({
                roleId: {
                    $in: [role._id].concat(role.parents),
                },
                resourceId: component._id
            })
            // Kiểm tra được phép truy cập link chứa component và chưa tồn tại privilege componnt-role thì mới thêm mới privilege
            if (hasPrivilegeToComponentLink && !existPrivilegeComponent) {
                newPrivilegeComponent = await Privilege(connect(DB_CONNECTION, portal)).create({
                    roleId: role._id,
                    resourceId: component._id,
                    resourceType: 'Component',
                });
                const newPc = await Privilege(connect(DB_CONNECTION, portal)).findOne({
                    _id: newPrivilegeComponent._id
                });
                newPc.policies.indexOf(policyId) === -1 ? newPc.policies.push(policyId) : null
                await newPc.save();
                console.log("newPrivilegeComponent", newPc)
            }
        })
    })



    return policy;
}