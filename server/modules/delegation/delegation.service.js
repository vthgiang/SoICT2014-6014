const {
    Delegation,
    Privilege,
    UserRole,
    Role,
    Attribute,
    User,
    Link,
    Policy,
    Task
} = require('../../models');

const {
    connect
} = require(`../../helpers/dbHelper`);
const mongoose = require('mongoose');
const { isToday, compareDate } = require('../../helpers/functionHelper');
const schedule = require('node-schedule');
const taskTemplateModel = require('../../models/task/taskTemplate.model');
const PolicyService = require('../super-admin/policy/policy.service');

// Tạo mới mảng Ví dụ
exports.createDelegation = async (portal, data, logs = []) => {
    let newDelegation;
    const filterValidDelegationArray = async (array) => {
        let resArray = [];
        if (array.length > 0) {

            for (let i = 0; i < array.length; i++) {
                const checkDelegationCreated = await Delegation(connect(DB_CONNECTION, portal)).findOne({ delegationName: array[i].delegationName }).collation({ "locale": "vi", strength: 2, alternate: "shifted", maxVariable: "space" })
                if (checkDelegationCreated && !array[i].notCheck) {
                    throw ['delegation_name_exist'];
                }
                if (array[i]) resArray = [...resArray, array[i]];
            }

            return resArray;
        } else {
            return [];
        }
    }

    const delArray = await filterValidDelegationArray(data);
    if (delArray && delArray.length !== 0) {
        for (let i = 0; i < delArray.length; i++) {
            let delegateRole = await Role(connect(DB_CONNECTION, portal)).findById({ _id: delArray[i].delegateRole });
            let delegatePrivileges = delArray[i].allPrivileges ? null : await Privilege(connect(DB_CONNECTION, portal)).find({ roleId: { $in: [delArray[i].delegateRole].concat(delegateRole.parents) }, resourceId: { $in: delArray[i].delegateLinks } })
            // console.log('delegatePrivileges', delegatePrivileges)
            let checkDelegationExist = await Delegation(connect(DB_CONNECTION, portal)).find({
                delegator: delArray[i].delegator,
                delegatee: delArray[i].delegatee,
                delegateType: "Role",
                delegateRole: delArray[i].delegateRole,
                status: {
                    $in: [
                        "activated", // Đang hoạt động
                        "pending", // Chờ xác nhận
                    ]
                }
            })

            if (checkDelegationExist.length > 0 && !delArray[i].notCheck) {
                throw ["delegation_role_exist"];
            }

            let checkUserHaveRole = await UserRole(connect(DB_CONNECTION, portal)).find({
                userId: delArray[i].delegatee,
                roleId: delArray[i].delegateRole,
                // TBD: Bỏ comment nếu enable 1 user có >1 ủy quyền từ >1 user khác nhau cho cùng 1 role
                // delegation: { $in: [[], undefined] }
            })

            if (checkUserHaveRole.length > 0 && !delArray[i].notCheck) {
                throw ["user_role_exist"]
            }

            if (!isToday(new Date(delArray[i].delegationStart)) && compareDate(new Date(delArray[i].delegationStart), new Date()) < 0) {
                throw ["start_date_past"]
            }

            if (delArray[i].delegationEnd != null && compareDate(new Date(delArray[i].delegationEnd), new Date()) < 0) {
                throw ["end_date_past"]
            }

            // console.log(new Date(delArray[i].delegationStart))
            if (delArray[i].notCheck || (checkDelegationExist.length == 0 && checkUserHaveRole.length == 0)) {

                if (await this.checkDelegationPolicy(delArray[i].delegatePolicy, delArray[i].delegator, delArray[i].delegateRole, delArray[i].delegateLinks, delArray[i].delegatee, portal)) {
                    newDelegation = await Delegation(connect(DB_CONNECTION, portal)).create({
                        delegationName: delArray[i].delegationName,
                        description: delArray[i].description,
                        delegator: delArray[i].delegator,
                        delegatee: delArray[i].delegatee,
                        delegateType: "Role",
                        delegateRole: delArray[i].delegateRole,
                        allPrivileges: delArray[i].allPrivileges,
                        delegatePrivileges: delegatePrivileges != null ? delegatePrivileges.map(p => p._id) : null,
                        startDate: delArray[i].delegationStart,
                        endDate: delArray[i].delegationEnd,
                        status: isToday(new Date(delArray[i].delegationStart)) ? "activated" : "pending",
                        delegatePolicy: delArray[i].delegatePolicy,
                        logs: logs
                    });
                }

            }


            // add delegationId to selected Privileges
            if (isToday(new Date(delArray[i].delegationStart))) {
                await this.assignDelegation(newDelegation, portal)
                // console.log(newDelegation.startDate)
            }
            else {
                await this.autoActivateDelegation(newDelegation, portal);
            }

            if (newDelegation.endDate != null) {
                await this.autoRevokeDelegation(newDelegation, portal);
            }

            // const date = new Date(delArray[i].delegationEnd);

            // const job = schedule.scheduleJob(date, function () {
            //     console.log('The world is going to end today.');
            // });
        }
    }

    let delegation = await Delegation(connect(DB_CONNECTION, portal)).findById({ _id: newDelegation._id }).populate([
        { path: 'delegateRole', select: '_id name' },
        { path: 'delegateTask' },
        { path: 'delegatee', select: '_id name' },
        { path: 'delegatePolicy', select: '_id policyName' },
        { path: 'delegator', select: '_id name' },
        {
            path: 'delegatePrivileges', select: '_id resourceId resourceType',
            populate: {
                path: 'resourceId',
                select: '_id url category description'
            }
        }
    ]);


    return delegation;
}

exports.getNewlyCreateDelegation = async (id, data, portal) => {
    let oldDelegation = await this.getDelegationById(portal, id);
    const checkDelegationCreated = await Delegation(connect(DB_CONNECTION, portal)).findOne({ delegationName: data.delegationName }).collation({ "locale": "vi", strength: 2, alternate: "shifted", maxVariable: "space" })
    let updatedDelegation = -1;
    if (oldDelegation.delegationName.trim().toLowerCase().replace(/ /g, "") !== data.delegationName.trim().toLowerCase().replace(/ /g, "")) {
        if (checkDelegationCreated) {
            throw ['delegation_name_exist'];
        }
    } else {
        if (oldDelegation.delegator.toString() == data.delegator.toString() &&
            oldDelegation.delegatee.toString() == data.delegatee.toString() &&
            oldDelegation.delegateRole.toString() == data.delegateRole.toString()
        ) {
            data.notCheck = true;
        }

    }

    updatedDelegation = await this.createDelegation(portal, [data], oldDelegation.logs);

    return updatedDelegation;
}

exports.autoActivateDelegation = async (delegation, portal) => {
    const date = new Date(delegation.startDate);
    const a = this;
    const job = schedule.scheduleJob("Activate_" + delegation._id, date, async function () {
        await a.assignDelegation(delegation, portal)
        delegation.status = "activated"
        delegation.logs.push(
            {
                createdAt: new Date(),
                user: null,
                content: delegation.delegationName,
                time: new Date(delegation.startDate),
                category: "activate"
            })
        await delegation.save();
    });


    return job;
}

exports.autoRevokeDelegation = async (delegation, portal) => {
    const date = new Date(delegation.endDate);
    const a = this;
    const job = schedule.scheduleJob("Revoke_" + delegation._id, date, async function () {
        await a.revokeDelegation(portal, [delegation._id], "Automatic revocation")
        await Delegation(connect(DB_CONNECTION, portal)).updateOne({ _id: delegation._id }, {
            logs: [
                ...delegation.logs,
                {
                    createdAt: new Date(),
                    user: null,
                    content: delegation.delegationName,
                    time: new Date(delegation.endDate),
                    category: "revoke"
                }
            ]
        })
    });

    return job;
}

exports.assignDelegation = async (newDelegation, portal) => {
    // Tách hàm để check delegationStart = currentTime chạy bấm giờ
    // add delegationId to selected Privileges
    let delegatePrivileges = newDelegation.delegatePrivileges == null || newDelegation.delegatePrivileges.length == 0 ? null : await Privilege(connect(DB_CONNECTION, portal)).find({ _id: { $in: newDelegation.delegatePrivileges } })

    if (delegatePrivileges != null) {
        delegatePrivileges.forEach(async pri => {
            pri.delegations.indexOf(newDelegation._id) === -1 ? pri.delegations.push(newDelegation._id) : null
            await pri.save();
        })
    }

    let newUserRole = await UserRole(connect(DB_CONNECTION, portal)).create({
        userId: newDelegation.delegatee,
        roleId: newDelegation.delegateRole,
        delegation: newDelegation._id
    });
    // newUserRole.delegations.indexOf(delegation._id) === -1 ? newUserRole.delegations.push(delegation._id) : null
    newUserRole.save();
}

exports.updateMissedDelegation = async (portal) => {

    const allDelegations = await Delegation(connect(DB_CONNECTION, portal)).find({ status: { $in: ['pending', 'activated'] }, delegateType: "Role" });
    // Kích hoạt ủy quyền nếu startDate < now và chưa đến thời hạn thu hồi hoặc thu hồi nếu endDate < now  
    allDelegations.forEach(async delegation => {

        if (delegation.endDate != null && compareDate(delegation.endDate, new Date()) < 0) {

            await this.revokeDelegation(portal, [delegation._id], "Automatic revocation");
            await Delegation(connect(DB_CONNECTION, portal)).updateOne({ _id: delegation._id }, {
                logs: [
                    ...delegation.logs,
                    {
                        createdAt: new Date(),
                        user: null,
                        content: delegation.delegationName,
                        time: new Date(delegation.endDate),
                        category: "revoke"
                    }
                ]
            })
        }
        else {
            if (delegation.status == 'pending' && delegation.startDate != null && compareDate(delegation.startDate, new Date()) < 0) {
                await this.assignDelegation(delegation, portal)
                delegation.status = "activated"
                delegation.logs.push(
                    {
                        createdAt: new Date(),
                        user: null,
                        content: delegation.delegationName,
                        time: new Date(delegation.startDate),
                        category: "activate"
                    })
                await delegation.save();
            }
        }
    })
}


exports.checkDelegationPolicy = async (policyId, delegatorId, delegatedObjectId, delegateLinksIds, delegateeId, portal) => {

    let policy = await Policy(connect(DB_CONNECTION, portal)).findById({ _id: policyId });
    let delegator = await User(connect(DB_CONNECTION, portal)).findById({ _id: delegatorId })
    let delegatee = await User(connect(DB_CONNECTION, portal)).findById({ _id: delegateeId })
    let delegateRole = await Role(connect(DB_CONNECTION, portal)).findById({ _id: delegatedObjectId })
    let delegateTask = await Task(connect(DB_CONNECTION, portal)).findById({ _id: delegatedObjectId })

    if (PolicyService.ruleCheck([delegator], policy.delegator.delegatorAttributes, policy.delegator.delegatorRule).length == 0) {
        throw ["delegator_invalid_policy"]
    }
    if (delegateRole) {
        if (PolicyService.ruleCheck([delegateRole], policy.delegatedObject.delegatedObjectAttributes, policy.delegatedObject.delegatedObjectRule).length == 0) {
            throw ["role_invalid_policy"]
        }
    }
    if (delegateTask) {
        if (PolicyService.ruleCheck([delegateTask], policy.delegatedObject.delegatedObjectAttributes, policy.delegatedObject.delegatedObjectRule).length == 0) {
            throw ["task_invalid_policy"]
        }
    }

    if (PolicyService.ruleCheck([delegatee], policy.delegatee.delegateeAttributes, policy.delegatee.delegateeRule).length == 0) {
        throw ["delegatee_invalid_policy"]
    }
    if (delegateLinksIds) {
        let delegateLinks = await Link(connect(DB_CONNECTION, portal)).find({ _id: { $in: delegateLinksIds } })
        delegateLinks = delegateLinks.filter(link => link.url != "/home" && link.url != "/notifications");

        if (PolicyService.ruleCheck(delegateLinks, policy.resource.resourceAttributes, policy.resource.resourceRule).length != delegateLinks.length) {
            throw ["link_invalid_policy"]
        }
    }

    return true;

}


// exports.checkDelegationAttribute = async (delegatorId, delegateRoleId, delegateLinksIds, delegateeId, portal) => {
//     let result = true;
//     let delegator = await User(connect(DB_CONNECTION, portal)).findById({ _id: delegatorId })
//     let delegatorAttributes = delegator.attributes
//     let delegatee = await User(connect(DB_CONNECTION, portal)).findById({ _id: delegateeId })
//     let delegateeAttributes = delegatee.attributes
//     let delegateRole = await Role(connect(DB_CONNECTION, portal)).findById({ _id: delegateRoleId })
//     let delegateRoleAttributes = delegateRole.attributes

//     let canDelegateRole = await Attribute(connect(DB_CONNECTION, portal)).findOne({ attributeName: "can_delegate_role" })
//     let canBeDelegated = await Attribute(connect(DB_CONNECTION, portal)).findOne({ attributeName: "can_be_delegated" })
//     let canReceiveRoleDelegation = await Attribute(connect(DB_CONNECTION, portal)).findOne({ attributeName: "can_receive_role_delegation" })

//     const indexOfAttributeInArray = (attributeId, attributes) => {
//         return attributes.findIndex(a => a.attributeId.equals(attributeId))
//     }

//     let indexOfCanDelegateRole = indexOfAttributeInArray(canDelegateRole._id, delegatorAttributes != null ? delegatorAttributes : [])
//     let indexOfCanBeDelegated = indexOfAttributeInArray(canBeDelegated._id, delegateRoleAttributes != null ? delegateRoleAttributes : [])
//     let indexOfCanReceiveRoleDelegation = indexOfAttributeInArray(canReceiveRoleDelegation._id, delegateeAttributes != null ? delegateeAttributes : [])

//     // console.log("delegator", delegator)
//     // console.log("delegatorAttributes", delegatorAttributes)
//     // console.log("delegatee", delegatee)
//     // console.log("delegateeAttributes", delegateeAttributes)
//     // console.log("delegateRole", delegateRole)
//     // console.log("delegateRoleAttributes", delegateRoleAttributes)

//     // console.log("canDelegateRole", canDelegateRole)
//     // console.log("canBeDelegated", canBeDelegated)
//     // console.log("canReceiveRoleDelegation", canReceiveRoleDelegation)

//     // console.log("indexOfCanDelegateRole", indexOfCanDelegateRole)
//     // console.log("indexOfCanBeDelegated", indexOfCanBeDelegated)
//     // console.log("indexOfCanReceiveRoleDelegation", indexOfCanReceiveRoleDelegation)


//     if (indexOfCanDelegateRole == -1 || delegatorAttributes[indexOfCanDelegateRole].value.toLowerCase() != "true") {
//         throw ["delegator_cant_delegate_role"]
//     }
//     else if (indexOfCanBeDelegated == -1 || delegateRoleAttributes[indexOfCanBeDelegated].value.toLowerCase() != "true") {
//         throw ["role_cant_be_delegate"]
//     }
//     else if (indexOfCanReceiveRoleDelegation == -1 || delegateeAttributes[indexOfCanReceiveRoleDelegation].value.toLowerCase() != "true") {
//         throw ["delegatee_cant_receive_role_delegation"]
//     }
//     else {
//         let canDelegateChosenRole = await Attribute(connect(DB_CONNECTION, portal)).findOne({ attributeName: "can_delegate_role_" + delegateRole.name })
//         // let canBeDelegatedByUser = await Attribute(connect(DB_CONNECTION, portal)).findOne({ attributeName: "can_be_delegated_by_" + delegator.email })
//         let canReceiveChosenRole = await Attribute(connect(DB_CONNECTION, portal)).findOne({ attributeName: "can_receive_role_" + delegateRole.name })

//         let indexOfCanDelegateChosenRole = indexOfAttributeInArray(canDelegateChosenRole._id, delegatorAttributes != null ? delegatorAttributes : [])
//         // let indexOfCanBeDelegatedByUser = indexOfAttributeInArray(canBeDelegatedByUser._id, delegateRoleAttributes != null ? delegateRoleAttributes : [])
//         let indexOfCanReceiveChosenRole = indexOfAttributeInArray(canReceiveChosenRole._id, delegateeAttributes != null ? delegateeAttributes : [])

//         // console.log("canDelegateChosenRole", canDelegateChosenRole)
//         // console.log("canReceiveChosenRole", canReceiveChosenRole)

//         // console.log("indexOfCanDelegateChosenRole", indexOfCanDelegateChosenRole)
//         // console.log("indexOfCanReceiveChosenRole", indexOfCanReceiveChosenRole)


//         // check delegator can delegate specific role
//         if (indexOfCanDelegateChosenRole == -1 || delegatorAttributes[indexOfCanDelegateChosenRole].value.toLowerCase() != "true") {
//             throw ["delegator_cant_delegate_chosen_role"]
//         }
//         // check specific role can be delegated by delegator
//         // else if (indexOfCanBeDelegatedByUser == -1 || delegateRoleAttributes[indexOfCanBeDelegatedByUser].value.toLowerCase() != "true") {
//         //     throw ["role_cant_be_delegated_by_delegator"]
//         // }
//         // check delegatee can receive specific role
//         else if (indexOfCanReceiveChosenRole == -1 || delegateeAttributes[indexOfCanReceiveChosenRole].value.toLowerCase() != "true") {
//             throw ["delegatee_cant_receive_chosen_role"]
//         }
//         // if delegateLinks not null
//         // check each link can be delegated for specific role 
//         else {
//             if (delegateLinksIds != null) {
//                 let count = 0;

//                 let delegateLinks = await Link(connect(DB_CONNECTION, portal)).find({ _id: { $in: delegateLinksIds } })
//                 let delegatableLinkForChosenRole = await Attribute(connect(DB_CONNECTION, portal)).findOne({ attributeName: "delegatable_link_for_" + delegateRole.name })
//                 // console.log("delegateLinks", delegateLinks.filter(link => link.url != "/home" && link.url != "/notifications"))
//                 // console.log("delegatableLinkForChosenRole", delegatableLinkForChosenRole)

//                 delegateLinks.filter(link => link.url != "/home" && link.url != "/notifications").every(async link => {
//                     let delegateLinkAttributes = link.attributes
//                     let indexOfDelegatableLinkForChosenRole = indexOfAttributeInArray(delegatableLinkForChosenRole._id, delegateLinkAttributes != null ? delegateLinkAttributes : [])
//                     // console.log("delegateLinkAttributes", delegateLinkAttributes)
//                     // console.log("indexOfDelegatableLinkForChosenRole", indexOfDelegatableLinkForChosenRole)
//                     if (indexOfDelegatableLinkForChosenRole == -1 || delegateLinkAttributes[indexOfDelegatableLinkForChosenRole].value.toLowerCase() != "true") {
//                         count++;
//                         return false;
//                     }
//                     return true;
//                 });

//                 if (count > 0) {
//                     throw ["link_cant_be_delegated_for_chosen_role"]
//                 }

//             }

//         }

//     }


//     return result

// }

// Lấy ra tất cả các thông tin Ví dụ theo mô hình lấy dữ liệu số  1
exports.getDelegations = async (portal, data) => {
    console.log(schedule)
    let keySearch = { delegator: data.userId, delegateType: data.delegateType };
    if (data?.delegationName?.length > 0) {
        keySearch = {
            ...keySearch,
            delegationName: {
                $regex: data.delegationName,
                $options: "i"
            }
        }
    }

    let page, perPage;
    page = data?.page ? Number(data.page) : 1;
    perPage = data?.perPage ? Number(data.perPage) : 20;

    let totalList = await Delegation(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let delegations = await Delegation(connect(DB_CONNECTION, portal)).find(keySearch)
        .populate([
            { path: 'delegateRole', select: '_id name' },
            { path: 'delegateTask' },
            { path: 'delegatee', select: '_id name' },
            { path: 'delegatePolicy', select: '_id policyName' },
            { path: 'delegator', select: '_id name' },
            {
                path: 'delegatePrivileges', select: '_id resourceId resourceType',
                populate: {
                    path: 'resourceId',
                    select: '_id url category description'
                }
            }
        ])
        .skip((page - 1) * perPage)
        .limit(perPage);

    return {
        data: delegations,
        totalList
    }
}


exports.getDelegationsReceive = async (portal, data) => {
    let keySearch = { delegatee: data.userId, delegateType: 'Role' };
    if (data?.delegationName?.length > 0) {
        keySearch = {
            ...keySearch,
            delegationName: {
                $regex: data.delegationName,
                $options: "i"
            }
        }
    }

    let page, perPage;
    page = data?.page ? Number(data.page) : 1;
    perPage = data?.perPage ? Number(data.perPage) : 20;

    let totalList = await Delegation(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let delegations = await Delegation(connect(DB_CONNECTION, portal)).find(keySearch)
        .populate([
            { path: 'delegateRole', select: '_id name' },
            { path: 'delegatee', select: '_id name' },
            { path: 'delegatePolicy', select: '_id policyName' },
            { path: 'delegator', select: '_id name' },
            {
                path: 'delegatePrivileges', select: '_id resourceId resourceType',
                populate: {
                    path: 'resourceId',
                    select: '_id url category description'
                }
            }
        ])
        .skip((page - 1) * perPage)
        .limit(perPage);

    console.log(delegations)
    return {
        data: delegations,
        totalList
    }
}

exports.getDelegationsReceiveTask = async (portal, data) => {
    let keySearch = { delegatee: data.userId, delegateType: 'Task' };
    if (data?.delegationName?.length > 0) {
        keySearch = {
            ...keySearch,
            delegationName: {
                $regex: data.delegationName,
                $options: "i"
            }
        }
    }

    let page, perPage;
    page = data?.page ? Number(data.page) : 1;
    perPage = data?.perPage ? Number(data.perPage) : 20;

    let totalList = await Delegation(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let delegations = await Delegation(connect(DB_CONNECTION, portal)).find(keySearch)
        .populate([
            { path: 'delegateTask' },
            { path: 'delegatee', select: '_id name' },
            { path: 'delegatePolicy', select: '_id policyName' },
            { path: 'delegator', select: '_id name' },

        ])
        .skip((page - 1) * perPage)
        .limit(perPage);

    return {
        dataTask: delegations,
        totalListTask: totalList
    }
}

// Lấy ra một phần thông tin Ví dụ (lấy ra delegationName) theo mô hình dữ liệu số  2
exports.getOnlyDelegationName = async (portal, data) => {
    let keySearch;
    if (data?.delegationName?.length > 0) {
        keySearch = {
            delegationName: {
                $regex: data.delegationName,
                $options: "i"
            }
        }
    }

    let page, perPage;
    page = data?.page ? Number(data.page) : 1;
    perPage = data?.perPage ? Number(data.perPage) : 20;

    let totalList = await Delegation(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    let DelegationCollection = await Delegation(connect(DB_CONNECTION, portal)).find(keySearch, { delegationName: 1 })
        .skip((page - 1) * perPage)
        .limit(perPage);

    return {
        data: DelegationCollection,
        totalList
    }
}

// Lấy ra Ví dụ theo id
exports.getDelegationById = async (portal, id) => {
    let delegation = await Delegation(connect(DB_CONNECTION, portal)).findById({ _id: id }).populate([
        { path: 'delegateRole', select: '_id name' },
        { path: 'delegateTask' },
        { path: 'delegatee', select: '_id name' },
        { path: 'delegatePolicy', select: '_id policyName' },
        { path: 'delegator', select: '_id name' },
        {
            path: 'delegatePrivileges', select: '_id resourceId resourceType',
            populate: {
                path: 'resourceId',
                select: '_id url category description'
            }
        }
    ]);
    if (delegation) {
        return delegation;
    }
    return -1;
}

// Chỉnh sửa một Ví dụ
exports.cancelJobDelegation = (delegationId) => {

    if (schedule.scheduledJobs['Revoke_' + delegationId]) {
        schedule.scheduledJobs['Revoke_' + delegationId].cancel()
    }

    if (schedule.scheduledJobs['Activate_' + delegationId]) {
        schedule.scheduledJobs['Activate_' + delegationId].cancel()
    }

}

// Xóa một Ví dụ
exports.deleteDelegations = async (portal, delegationIds) => {
    if (schedule.scheduledJobs['Revoke_' + delegationIds[0]]) {
        schedule.scheduledJobs['Revoke_' + delegationIds[0]].cancel()
    }

    if (schedule.scheduledJobs['Activate_' + delegationIds[0]]) {
        schedule.scheduledJobs['Activate_' + delegationIds[0]].cancel()
    }

    let delegations = await Delegation(connect(DB_CONNECTION, portal))
        .deleteMany({ _id: { $in: delegationIds.map(item => mongoose.Types.ObjectId(item)) } });
    // delegationIds.forEach(async delegationId => {
    //     await UserRole(connect(DB_CONNECTION, portal)).deleteOne({ delegation: delegationId });
    // })
    return delegations;
}

exports.revokeDelegation = async (portal, delegationIds, reason) => {
    // let delegations = await Delegation(connect(DB_CONNECTION, portal))
    //     .deleteMany({ _id: { $in: delegationIds.map(item => mongoose.Types.ObjectId(item)) } });
    delegationIds.forEach(async delegationId => {

        await UserRole(connect(DB_CONNECTION, portal)).deleteMany({ delegation: delegationId });
    })

    let delegation = await Delegation(connect(DB_CONNECTION, portal)).find({ _id: { $in: delegationIds.map(item => mongoose.Types.ObjectId(item)) } });
    let result = delegation[0];
    if (result.delegatePrivileges != null) {
        let privileges = await Privilege(connect(DB_CONNECTION, portal)).find({ _id: { $in: result.delegatePrivileges } })
        privileges.forEach(async pri => {
            pri.delegations.splice(pri.delegations.indexOf(result._id), 1)
            await pri.save()
        })
    }
    console.log('delegation', delegation)
    result.status = "revoked";
    result.revokeReason = !reason ? null : reason;
    result.revokedDate = new Date();
    if (result.endDate && compareDate(result.endDate, new Date()) > 0) {
        if (schedule.scheduledJobs['Revoke_' + result._id]) {
            schedule.scheduledJobs['Revoke_' + result._id].cancel()
        }
    }
    if (schedule.scheduledJobs['Activate_' + result._id]) {
        schedule.scheduledJobs['Activate_' + result._id].cancel()
    }

    await result.save();

    let newDelegation = await Delegation(connect(DB_CONNECTION, portal)).findOne({ _id: delegationIds[0] }).populate([
        { path: 'delegateRole', select: '_id name' },
        { path: 'delegateTask' },
        { path: 'delegatee', select: '_id name' },
        { path: 'delegatePolicy', select: '_id policyName' },
        { path: 'delegator', select: '_id name' },
        {
            path: 'delegatePrivileges', select: '_id resourceId resourceType',
            populate: {
                path: 'resourceId',
                select: '_id url category description'
            }
        }
    ]);

    return newDelegation;
}

exports.rejectDelegation = async (portal, delegationId, reason) => {

    let delegation = await Delegation(connect(DB_CONNECTION, portal)).findOne({ _id: delegationId });

    delegation.replyStatus = "declined";
    delegation.declineReason = !reason ? null : reason;

    await delegation.save();

    let newDelegation = await Delegation(connect(DB_CONNECTION, portal)).findOne({ _id: delegationId }).populate([
        { path: 'delegateRole', select: '_id name' },
        { path: 'delegateTask' },
        { path: 'delegatee', select: '_id name' },
        { path: 'delegatePolicy', select: '_id policyName' },
        { path: 'delegator', select: '_id name' },
        {
            path: 'delegatePrivileges', select: '_id resourceId resourceType',
            populate: {
                path: 'resourceId',
                select: '_id url category description'
            }
        }
    ]);

    return newDelegation;
}

exports.confirmDelegation = async (portal, delegationId) => {

    let delegation = await Delegation(connect(DB_CONNECTION, portal)).findOne({ _id: delegationId });

    delegation.replyStatus = "confirmed";
    delegation.declineReason = null;

    await delegation.save();

    let newDelegation = await Delegation(connect(DB_CONNECTION, portal)).findOne({ _id: delegationId }).populate([
        { path: 'delegateRole', select: '_id name' },
        { path: 'delegateTask' },
        { path: 'delegatee', select: '_id name' },
        { path: 'delegatePolicy', select: '_id policyName' },
        { path: 'delegator', select: '_id name' },
        {
            path: 'delegatePrivileges', select: '_id resourceId resourceType',
            populate: {
                path: 'resourceId',
                select: '_id url category description'
            }
        }
    ]);

    return newDelegation;
}

exports.saveLog = async (portal, delegation, userId, content, category, time) => {
    if ((!delegation.logs || delegation.logs.length == 0) || (delegation.logs.length > 0 && ((new Date()).getTime() - (new Date(delegation.logs[delegation.logs.length - 1].createdAt)).getTime()) / 1000 > 5) || category == "logout") {
        console.log("alo")
        await Delegation(connect(DB_CONNECTION, portal)).updateOne({ _id: delegation._id }, {
            logs: [
                ...delegation.logs,
                {
                    createdAt: new Date(),
                    user: userId,
                    content: content,
                    time: new Date(time),
                    category: category
                }
            ]
        })
    }


    let newDelegation = await Delegation(connect(DB_CONNECTION, portal)).findOne({ _id: delegation._id }).populate([
        { path: 'delegateRole', select: '_id name' },
        { path: 'delegateTask' },
        { path: 'delegatee', select: '_id name' },
        { path: 'delegatePolicy', select: '_id policyName' },
        { path: 'delegator', select: '_id name' },
        {
            path: 'delegatePrivileges', select: '_id resourceId resourceType',
            populate: {
                path: 'resourceId',
                select: '_id url category description'
            }
        }
    ]);

    return newDelegation;
}


exports.createTaskDelegation = async (portal, data, logs = []) => {
    let newDelegation;
    const filterValidDelegationArray = async (array) => {
        let resArray = [];
        if (array.length > 0) {

            for (let i = 0; i < array.length; i++) {
                const checkDelegationCreated = await Delegation(connect(DB_CONNECTION, portal)).findOne({ delegationName: array[i].delegationName }).collation({ "locale": "vi", strength: 2, alternate: "shifted", maxVariable: "space" })
                if (checkDelegationCreated && !array[i].notCheck) {
                    throw ['delegation_name_exist'];
                }
                if (array[i]) resArray = [...resArray, array[i]];
            }

            return resArray;
        } else {
            return [];
        }
    }

    const delArray = await filterValidDelegationArray(data);
    if (delArray && delArray.length !== 0) {
        for (let i = 0; i < delArray.length; i++) {

            let checkDelegationExist = await Delegation(connect(DB_CONNECTION, portal)).find({
                delegator: delArray[i].delegator,
                // delegatee: delArray[i].delegatee,
                delegateType: "Task",
                delegateTask: delArray[i].delegateTask,
                status: {
                    $in: [
                        "activated", // Đang hoạt động
                        "pending", // Chờ xác nhận
                    ]
                }
            })
            // console.log('checkDelegationExist', checkDelegationExist)


            let count1 = 0;
            let delegationToDelegatee = checkDelegationExist.filter(e => e.delegatee.toString() == delArray[i].delegatee.toString());
            console.log('delegationToDelegatee', delegationToDelegatee.map(e => e.delegateTaskRoles).flat())
            if (delegationToDelegatee.length > 0 && delegationToDelegatee.map(e => e.delegateTaskRoles).flat().some(e => { return delArray[i].delegateTaskRoles.includes(e) }) && !delArray[i].notCheck) {
                count1++;
                throw ["delegation_task_exist"]; // Đã tồn tại ủy quyền công việc với vai trò cho người nhận ủy quyền
            }

            let delegateTaskRolesExist = checkDelegationExist.map(e => e.delegateTaskRoles).flat();
            // console.log('delegateTaskRolesExist', delegateTaskRolesExist)

            if (delegateTaskRolesExist.length > 0 && delegateTaskRolesExist.some(e => { return delArray[i].delegateTaskRoles.includes(e) }) && !delArray[i].notCheck) {
                count1++;
                throw ['delegation_task_role_exist'];  // Đã tồn tại ủy quyền công việc với vai trò dã chọn
            }

            let checkDelegateTask = await Task(connect(DB_CONNECTION, portal)).findOne({
                _id: delArray[i].delegateTask
                // $or: [
                //     { 'responsibleEmployees': delArray[i].delegatee },
                //     { 'accountableEmployees': delArray[i].delegatee },
                //     { 'consultedEmployees': delArray[i].delegatee },
                //     { 'informedEmployees': delArray[i].delegatee }
                // ]
            }).populate({
                path: "delegations", populate: [
                    { path: 'delegatee', select: '_id name' },
                    { path: 'delegator', select: '_id name' },
                ]
            })

            if (checkDelegateTask.delegations.map(d => d.delegatee._id).includes(delArray[i].delegator)) {
                throw ['delegator_is_delegatee']; // Người nhận ủy quyền không thể ủy quyền cho một người khác
            }

            // console.log('checkDelegateTask', checkDelegateTask.responsibleEmployees)

            let count2 = 0;
            let errorRole = '';

            delArray[i].delegateTaskRoles.every(r => {
                if (r == 'responsible') {
                    if (checkDelegateTask.responsibleEmployees.includes(delArray[i].delegatee.toString())) {
                        count2++;
                        errorRole = r;
                        return false;
                    }
                }
                if (r == 'accountable') {
                    if (checkDelegateTask.accountableEmployees.includes(delArray[i].delegatee.toString())) {
                        count2++;
                        errorRole = r;
                        return false;
                    }
                }
                if (r == 'consulted') {
                    if (checkDelegateTask.consultedEmployees.includes(delArray[i].delegatee.toString())) {
                        count2++;
                        errorRole = r;
                        return false;
                    }
                }
                if (r == 'informed') {
                    if (checkDelegationExist.map(d => d.delegatorHasInformed).includes(false)) {
                        throw ["informed_get_by_delegation"] // Vai trò quan sát có qua ủy quyền không thể ủy
                    }
                    if (checkDelegateTask.informedEmployees.includes(delArray[i].delegatee.toString())) {
                        count2++;
                        errorRole = r;
                        return false;
                    }
                }
                return true;
            })

            if (count2 > 0) {
                throw ["delegatee_already_in_task_" + errorRole] // Người nhận đã đảm nhận vai trò errorRole trong công việc
            }


            if (!isToday(new Date(delArray[i].delegationStart)) && compareDate(new Date(delArray[i].delegationStart), new Date()) < 0) {
                throw ["start_date_past"]
            }

            if (delArray[i].delegationEnd != null && compareDate(new Date(delArray[i].delegationEnd), new Date()) < 0) {
                throw ["end_date_past"]
            }

            // console.log(new Date(delArray[i].delegationStart))
            if (delArray[i].notCheck || (count1 == 0 && count2 == 0)) {
                console.log('hello')
                if (await this.checkDelegationPolicy(delArray[i].delegatePolicy, delArray[i].delegator, delArray[i].delegateTask, null, delArray[i].delegatee, portal)) {
                    newDelegation = await Delegation(connect(DB_CONNECTION, portal)).create({
                        delegationName: delArray[i].delegationName,
                        description: delArray[i].description,
                        delegator: delArray[i].delegator,
                        delegatee: delArray[i].delegatee,
                        delegateType: "Task",
                        delegateTask: delArray[i].delegateTask,
                        delegateTaskRoles: delArray[i].delegateTaskRoles,
                        startDate: delArray[i].delegationStart,
                        endDate: delArray[i].delegationEnd,
                        status: isToday(new Date(delArray[i].delegationStart)) ? "activated" : "pending",
                        delegatePolicy: delArray[i].delegatePolicy,
                        logs: logs
                    });
                }

            }



            // For demo
            await this.assignTaskDelegation(newDelegation, portal)
            // 
            // if (isToday(new Date(delArray[i].delegationStart))) {
            //     await this.assignTaskDelegation(newDelegation, portal)
            // }
            // else {
            //     await this.autoActivateTaskDelegation(newDelegation, portal);
            // }

            // if (newDelegation.endDate != null) {
            //     await this.autoRevokeDelegation(newDelegation, portal);
            // }


        }
    }

    let delegation = await Delegation(connect(DB_CONNECTION, portal)).findById({ _id: newDelegation._id }).populate([
        { path: 'delegateTask' },
        { path: 'delegatee', select: '_id name' },
        { path: 'delegatePolicy', select: '_id policyName' },
        { path: 'delegator', select: '_id name' }

    ]);


    return delegation;
}

exports.autoActivateTaskDelegation = async (delegation, portal) => {
    const date = new Date(delegation.startDate);
    const a = this;
    const job = schedule.scheduleJob("Activate_" + delegation._id, date, async function () {
        await a.assignTaskDelegation(delegation, portal)
        delegation.logs.push(
            {
                createdAt: new Date(),
                user: null,
                content: delegation.delegationName,
                time: new Date(delegation.startDate),
                category: "activate"
            })
        await delegation.save();
    });


    return job;
}

exports.assignTaskDelegation = async (newDelegation, portal) => {
    let delegateTaskRoles = newDelegation.delegateTaskRoles
    let delegateTask = await Task(connect(DB_CONNECTION, portal)).findOne({ _id: newDelegation.delegateTask }).populate({
        path: "delegations", select: "_id status delegatorHasInformed"
    })
    let delegatee = newDelegation.delegatee
    let delegator = newDelegation.delegator

    // Thêm delegatee vào RACI tương ứng được ủy và remove delegator khỏi RACI đó trừ người quan sát
    delegateTaskRoles.forEach(async r => {
        if (r == 'responsible') {
            await Task(connect(DB_CONNECTION, portal)).updateOne({ _id: delegateTask._id }, {
                responsibleEmployees: [
                    ...delegateTask.responsibleEmployees.filter(e => e.toString() !== delegator.toString()),
                    delegatee
                ]
            })
        }
        if (r == 'accountable') {
            await Task(connect(DB_CONNECTION, portal)).updateOne({ _id: delegateTask._id }, {
                accountableEmployees: [
                    ...delegateTask.accountableEmployees.filter(e => e.toString() !== delegator.toString()),
                    delegatee
                ]
            })
        }
        if (r == 'consulted') {
            await Task(connect(DB_CONNECTION, portal)).updateOne({ _id: delegateTask._id }, {
                consultedEmployees: [
                    ...delegateTask.consultedEmployees.filter(e => e.toString() !== delegator.toString()),
                    delegatee
                ]
            })
        }
        if (r == 'informed') {
            await Task(connect(DB_CONNECTION, portal)).updateOne({ _id: delegateTask._id }, {
                informedEmployees: [
                    ...delegateTask.informedEmployees,
                    delegatee
                ]
            })
        }
    })


    // Chuyển delegator thành Người quan sát
    if (!delegateTask.informedEmployees.includes(delegator)) {
        await Task(connect(DB_CONNECTION, portal)).updateOne({ _id: delegateTask._id }, {
            informedEmployees: [
                ...delegateTask.informedEmployees,
                delegator
            ]
        })
        // Flag xem delegator có inform role từ đầu hay không, chuyển trạng thái sang activate
        await Delegation(connect(DB_CONNECTION, portal)).updateOne({ _id: newDelegation._id }, {
            delegatorHasInformed: false,
            status: 'activated'
        })
    } else {
        await Delegation(connect(DB_CONNECTION, portal)).updateOne({ _id: newDelegation._id }, {
            delegatorHasInformed: true,
            status: 'activated'
        })

    }
}

exports.autoRevokeTaskDelegation = async (delegation, portal) => {
    const date = new Date(delegation.endDate);
    const a = this;
    const job = schedule.scheduleJob("Revoke_" + delegation._id, date, async function () {
        await a.revokeTaskDelegation(portal, [delegation._id], "Automatic revocation")
        await Delegation(connect(DB_CONNECTION, portal)).updateOne({ _id: delegation._id }, {
            logs: [
                ...delegation.logs,
                {
                    createdAt: new Date(),
                    user: null,
                    content: delegation.delegationName,
                    time: new Date(delegation.endDate),
                    category: "revoke"
                }
            ]
        })
    });

    return job;
}

exports.revokeTaskDelegation = async (portal, delegationIds, reason) => {

    let delegation = await Delegation(connect(DB_CONNECTION, portal)).find({ _id: { $in: delegationIds.map(item => mongoose.Types.ObjectId(item)) } });
    let result = delegation[0];

    let delegateTaskRoles = result.delegateTaskRoles
    let delegateTask = await Task(connect(DB_CONNECTION, portal)).findOne({ _id: result.delegateTask }).populate({
        path: "delegations", select: "_id status delegatorHasInformed"
    })
    let delegatee = result.delegatee
    let delegator = result.delegator

    // Add lại delegator vào RACI tương ứng được ủy và remove delegatee khỏi RACI đó trừ người quan sát
    if (result.status == 'activated') {
        delegateTaskRoles.forEach(async r => {
            if (r == 'responsible') {
                await Task(connect(DB_CONNECTION, portal)).updateOne({ _id: delegateTask._id }, {
                    responsibleEmployees: [
                        ...delegateTask.responsibleEmployees.filter(e => e.toString() !== delegatee.toString()),
                        delegator
                    ]
                })
            }
            if (r == 'accountable') {
                await Task(connect(DB_CONNECTION, portal)).updateOne({ _id: delegateTask._id }, {
                    accountableEmployees: [
                        ...delegateTask.accountableEmployees.filter(e => e.toString() !== delegatee.toString()),
                        delegator
                    ]
                })
            }
            if (r == 'consulted') {
                await Task(connect(DB_CONNECTION, portal)).updateOne({ _id: delegateTask._id }, {
                    consultedEmployees: [
                        ...delegateTask.consultedEmployees.filter(e => e.toString() !== delegatee.toString()),
                        delegator
                    ]
                })
            }
            if (r == 'informed') {
                await Task(connect(DB_CONNECTION, portal)).updateOne({ _id: delegateTask._id }, {
                    informedEmployees: [
                        ...delegateTask.informedEmployees.filter(e => e.toString() !== delegatee.toString())
                    ]
                })
            }
        })
    }


    // Kiểm tra xem task còn delegation nào active ko, ko còn thì revoke ng quan sát nếu ng quan sát không có từ đầu
    // Nếu delegator không có vai trò quan sát từ đầu thì remove khỏi ng quan sát
    if (delegateTask.delegations.map(d => d.delegatorHasInformed).includes(false) && delegateTask.delegations.filter(d => d._id.toString() !== result._id.toString() && d.status == 'activated').length == 0) {
        await Task(connect(DB_CONNECTION, portal)).updateOne({ _id: delegateTask._id }, {
            informedEmployees: [
                ...delegateTask.informedEmployees.filter(e => e.toString() !== delegator.toString()),
            ]
        })

    }

    result.status = "revoked";
    result.revokeReason = !reason ? null : reason;
    result.revokedDate = new Date();
    // if (result.endDate && compareDate(result.endDate, new Date()) > 0) {
    //     if (schedule.scheduledJobs['Revoke_' + result._id]) {
    //         schedule.scheduledJobs['Revoke_' + result._id].cancel()
    //     }
    // }
    // if (schedule.scheduledJobs['Activate_' + result._id]) {
    //     schedule.scheduledJobs['Activate_' + result._id].cancel()
    // }

    await result.save();

    let newDelegation = await Delegation(connect(DB_CONNECTION, portal)).findOne({ _id: delegationIds[0] }).populate([
        { path: 'delegateTask' },
        { path: 'delegatee', select: '_id name' },
        { path: 'delegatePolicy', select: '_id policyName' },
        { path: 'delegator', select: '_id name' },
    ]);

    return newDelegation;
}

exports.deleteTaskDelegation = async (portal, delegationIds) => {
    // if (schedule.scheduledJobs['Revoke_' + delegationIds[0]]) {
    //     schedule.scheduledJobs['Revoke_' + delegationIds[0]].cancel()
    // }

    // if (schedule.scheduledJobs['Activate_' + delegationIds[0]]) {
    //     schedule.scheduledJobs['Activate_' + delegationIds[0]].cancel()
    // }
    let delegation = await Delegation(connect(DB_CONNECTION, portal)).find({ _id: { $in: delegationIds.map(item => mongoose.Types.ObjectId(item)) } });
    let result = delegation[0];

    let task = await Task(connect(DB_CONNECTION, portal)).findOne({ _id: result.delegateTask })

    await Task(connect(DB_CONNECTION, portal)).updateOne({ _id: task._id }, {
        delegations: task.delegations.filter(d => d.toString() !== result._id.toString())
    })
    if (!result.delegatorHasInformed) {
        await Delegation(connect(DB_CONNECTION, portal)).updateMany({ delegateTask: result.delegateTask, delegator: result.delegator }, {
            delegatorHasInformed: false,
        })
    }

    let delegationDelete = await Delegation(connect(DB_CONNECTION, portal))
        .deleteOne({ _id: result._id });


    return delegationDelete;
}

