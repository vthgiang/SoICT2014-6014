const {
    Delegation,
    Task,
    Requester,
    Policy
} = require('../../../models');
const {
    connect
} = require(`../../../helpers/dbHelper`);
const mongoose = require('mongoose');
const { isToday, compareDate } = require('../../../helpers/functionHelper');
const schedule = require('node-schedule');
const PolicyService = require('../../super-admin/policy/policy.service');
const { BaseDelegationHandler } = require('./base.delegation.handler');

function TaskDelegationHandler() {
    BaseDelegationHandler.call(this);
    this.populateArray.push(
        {
            path: 'delegateObject', select: '_id name taskActions logs timesheetLogs',
            populate: [
                { path: "taskActions.creator", select: "name email avatar" },
                {
                    path: "taskActions.evaluations.creator",
                    select: "name email avatar ",
                },
                { path: "taskActions.timesheetLogs.creator", select: "_id name email avatar" },
                { path: "timesheetLogs.creator", select: "name avatar _id email" },
                { path: "logs.creator", select: "_id name avatar email " }
            ]
        },
    );
    this.delegateType = 'Task';
}

TaskDelegationHandler.prototype = Object.create(BaseDelegationHandler.prototype);

Object.assign(TaskDelegationHandler.prototype, {
    constructor: TaskDelegationHandler,
    createDelegation: async function(portal, data, logs = []) {
        const [delegateTask, policy, delegator, delegatee] =
            await Promise.all([
                Task(connect(DB_CONNECTION, portal)).findById(data.delegateObject).populate({
                    path: "delegations", populate: [
                        { path: 'delegatee', select: '_id name' },
                        { path: 'delegator', select: '_id name company' },
                    ]
                }),
                Policy(connect(DB_CONNECTION, portal)).findById(data.policy),
                Requester(connect(DB_CONNECTION, portal)).findOne({ refId: data.delegator }),
                Requester(connect(DB_CONNECTION, portal)).findOne({ refId: data.delegatee }),
            ]);
            
        const checkDelegationExist = await Delegation(connect(DB_CONNECTION, portal)).find({
            delegator: delegator._id,
            // delegatee: data.delegatee,
            delegateObjectType: "Task",
            delegateObject: data.delegateObject,
            status: {
                $in: [
                    "activated", // Đang hoạt động
                    "pending", // Chờ xác nhận
                ]
            }
        }).populate([
            { path: 'delegator', select: '_id refId'},
            { path: 'delegatee', select: '_id refId'},
        ])

        let delegationToDelegatee = checkDelegationExist.filter(e => e.delegatee?.refId.toString() == data.delegatee.toString());
        if (delegationToDelegatee.length > 0 && delegationToDelegatee.map(e => e.metaData.delegateTaskRoles).flat().some(e => { return data.delegateTaskRoles.includes(e) }) && !data.notCheck) {
            throw ["delegation_task_exist"]; // Đã tồn tại ủy quyền công việc với vai trò cho người nhận ủy quyền
        }

        let delegateTaskRolesExist = checkDelegationExist.map(e => e.metaData.delegateTaskRoles).flat();

        if (delegateTaskRolesExist.length > 0 && delegateTaskRolesExist.some(e => { return data.delegateTaskRoles.includes(e) }) && !data.notCheck) {
            throw ['delegation_task_role_exist'];  // Đã tồn tại ủy quyền công việc với vai trò dã chọn
        }

        if (delegateTask.delegations.map(d => d.delegatee._id).includes(data.delegator)) {
            throw ['delegator_is_delegatee']; // Người nhận ủy quyền không thể ủy quyền cho một người khác
        }


        let errorRole;
        // const delegatee = await Requester(connect(DB_CONNECTION, portal)).findOne({ refId: data.delegatee });
        // const userId = delegatee.refId.toString();
        data.delegateTaskRoles.every(r => {
            if (r == 'responsible') {
                if (delegateTask.responsibleEmployees.includes(data.delegatee)) {
                    errorRole = r;
                    return false;
                }
            }
            if (r == 'accountable') {
                if (delegateTask.accountableEmployees.includes(data.delegatee)) {
                    errorRole = r;
                    return false;
                }
            }
            if (r == 'consulted') {
                if (delegateTask.consultedEmployees.includes(data.delegatee)) {
                    errorRole = r;
                    return false;
                }
            }
            if (r == 'informed') {
                if (checkDelegationExist.map(d => d.metaData.delegatorHasInformed).includes(false)) {
                    throw ["informed_get_by_delegation"] // Vai trò quan sát có qua ủy quyền không thể ủy
                }
                if (delegateTask.informedEmployees.includes(data.delegatee)) {
                    errorRole = r;
                    return false;
                }
            }
            return true;
        })

        if (errorRole) {
            throw ["delegatee_already_in_task_" + errorRole] // Người nhận đã đảm nhận vai trò errorRole trong công việc
        }

        if (!isToday(new Date(data.startDate)) && compareDate(new Date(data.startDate), new Date()) < 0) {
            throw ["start_date_past"]
        }

        if (data.endDate != null && compareDate(new Date(data.endDate), new Date()) < 0) {
            throw ["end_date_past"]
        }

        // this.checkDelegationPolicy(policy, delegator, delegatee, delegateTask);

        const newDelegation = await Delegation(connect(DB_CONNECTION, portal)).create({
            name: data.name,
        	description: data.description,
        	delegator: delegator._id,
        	delegatee: delegatee._id,
        	delegateObject: data.delegateObject,
            delegateObjectType: 'Task',
        	startDate: data.startDate,
        	endDate: data.endDate,
        	// revokedDate: data.revokedDate,
            status: isToday(new Date(data.startDate)) ? "activated" : "pending",
        	// replyStatus: data.replyStatus,
        	// declineReason: data.declineReason,
        	// revokeReason: data.revokeReason,
        	policy: data.policy,
            metaData: {
                delegateTaskRoles: data.delegateTaskRoles,
            },
        	logs: logs
        });

        // For demo
        // await this.assignDelegation(portal, newDelegation._id.toString())

        // For auto activate revoke
        if (isToday(new Date(data.startDate))) {
            await this.assignDelegation(porta, newDelegation._id.toString())
        }
        else {
            await this.autoActivateDelegation(portal, newDelegation._id.toString());
        }

        if (newDelegation.endDate != null) {
            await this.autoRevokeDelegation(portal, newDelegation._id.toString());
        }

        let task = await Task(connect(DB_CONNECTION, portal)).findOne({ _id: newDelegation.delegateObject })
        await Task(connect(DB_CONNECTION, portal)).updateOne({ _id: newDelegation.delegateObject }, {
            delegations: [
                ...task.delegations,
                newDelegation._id
            ]
        })


        const delegation = await Delegation(connect(DB_CONNECTION, portal)).findById({ _id: newDelegation._id });

        return delegation;
    },

    getNewlyCreateDelegation: async function(portal, id, data) {
        let oldDelegation = await Delegation(connect(DB_CONNECTION, portal)).findById(id)
        .populate([
            { path: 'delegator', select: '_id refId'},
            { path: 'delegatee', select: '_id refId'},
        ]);
        const checkDelegationExisted = await Delegation(connect(DB_CONNECTION, portal)).findOne({ name: data.name })
        let updatedDelegation = -1;
        if (oldDelegation.name.trim().toLowerCase().replace(/ /g, "") !== data.name.trim().toLowerCase().replace(/ /g, "")) {
            if (checkDelegationExisted) {
                throw ['delegation_name_exist'];
            }
            if (oldDelegation.delegator.refId.toString() !== data.delegator.toString() ||
                oldDelegation.delegatee.refId.toString() !== data.delegatee.toString() ||
                oldDelegation.delegateObject.toString() !== data.delegateObject.toString()
            ) {
                data.notCheck = false;
            } else {
                data.notCheck = true;
            }
        } else {
            if (oldDelegation.delegator.refId.toString() !== data.delegator.toString() ||
                oldDelegation.delegatee.refId.toString() !== data.delegatee.toString() ||
                oldDelegation.delegateObject.toString() !== data.delegateObject.toString()
            ) {
                data.notCheck = false;
            } else {
                data.notCheck = true;
            }
            data.notCheckName = true
        }

        updatedDelegation = await this.createDelegation(portal, data, oldDelegation.logs);

        return updatedDelegation;
    },

    assignDelegation: async function(portal, newDelegationId) {
        const newDelegation = await Delegation(connect(DB_CONNECTION, portal)).findById(newDelegationId)
            .populate([
                { path: 'delegator', select: '_id refId'},
                { path: 'delegatee', select: '_id refId'},
            ]);
        let delegateTaskRoles = newDelegation.metaData.delegateTaskRoles
        let delegateTask = await Task(connect(DB_CONNECTION, portal)).findById(newDelegation.delegateObject)
            .populate({
                path: "delegations", select: "_id status metaData"
            })

        // ???
        let delegatee = newDelegation.delegatee.refId
        let delegator = newDelegation.delegator.refId

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
                $set: { 'metaData.delegatorHasInformed': false },
                status: 'activated'
            })
        } else {
            await Delegation(connect(DB_CONNECTION, portal)).updateOne({ _id: newDelegation._id }, {
                $set: { 'metaData.delegatorHasInformed': true },
                status: 'activated'
            })
        }

        newDelegation.status = "activated"
        newDelegation.logs.push(
            {
                createdAt: new Date(),
                requester: null,
                content: newDelegation.name,
                time: new Date(newDelegation.startDate),
                category: "activate"
            })
        await newDelegation.save();
    },

    revokeDelegation: async function(portal, delegationIds, reason) {
        let delegation = await Delegation(connect(DB_CONNECTION, portal))
            .find({ _id: { $in: delegationIds.map(item => mongoose.Types.ObjectId(item)) } })
            .populate([
                { path: 'delegator', select: '_id refId'},
                { path: 'delegatee', select: '_id refId'},
            ]);
        let result = delegation[0];

        let delegateTaskRoles = result.metaData.delegateTaskRoles
        let delegateTask = await Task(connect(DB_CONNECTION, portal)).findOne({ _id: result.delegateObject }).populate({
            path: "delegations", select: "_id status metaData"
        })
        let delegatee = result.delegatee.refId;
        let delegator = result.delegator.refId;

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
        if (delegateTask.delegations.map(d => d.metaData.delegatorHasInformed).includes(false) && delegateTask.delegations.filter(d => d._id.toString() !== result._id.toString() && d.status == 'activated').length == 0) {
            await Task(connect(DB_CONNECTION, portal)).updateOne({ _id: delegateTask._id }, {
                informedEmployees: [
                    ...delegateTask.informedEmployees.filter(e => e.toString() !== delegator.toString()),
                ]
            })

        }

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
        
        result.logs.push(
            {
                createdAt: new Date(),
                requester: null,
                content: result.name,
                time: new Date(),
                category: "revoke"
            }
        )

        await result.save();
        await this.sendNotification(portal, result.id, "revoke", true)
        
        let newDelegation = this.getDelegationById(portal, delegationIds[0])
        return newDelegation;
    },
})

exports.TaskDelegationHandler = TaskDelegationHandler;
