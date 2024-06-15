const {
    Delegation,
    Privilege,
    UserRole,
    Role,
    Requester,
    Policy
} = require('../../../models');
const {
    connect
} = require(`../../../helpers/dbHelper`);
const mongoose = require('mongoose');
const { isToday, compareDate } = require('../../../helpers/functionHelper');
const schedule = require('node-schedule');
const { BaseDelegationHandler } = require('./base.delegation.handler');

function RoleDelegationHandler() {
    BaseDelegationHandler.call(this);
    this.populateArray.push(
        {
            path: 'metaData.delegatePrivileges', select: '_id resourceId resourceType',
            populate: {
                path: 'resourceId',
                select: '_id url category description'
            }
        }
    );
    this.delegateType = 'Role';
}

RoleDelegationHandler.prototype = Object.create(BaseDelegationHandler.prototype);

Object.assign(RoleDelegationHandler.prototype, {
    constructor: RoleDelegationHandler,
    createDelegation: async function(portal, data, logs = []) {
        const [delegateRole, policy, delegator, delegatee, checkUserHaveRole, checkDelegationNameExist] =
            await Promise.all([
                Role(connect(DB_CONNECTION, portal)).findById(data.delegateObject),
                Policy(connect(DB_CONNECTION, portal)).findById(data.policy),
                Requester(connect(DB_CONNECTION, portal)).findOne({ refId: data.delegator }),
                Requester(connect(DB_CONNECTION, portal)).findOne({ refId: data.delegatee }),
                UserRole(connect(DB_CONNECTION, portal)).exists({
                    userId: data.delegatee,
                    roleId: data.delegateObject
                }),
                Delegation(connect(DB_CONNECTION, portal)).exists({ name: data.name }),
            ]);

        // Check if data is valid
        if (checkDelegationNameExist && !data.notCheckName) {
            throw ["delegation_name_exist"];
        }

        if (!delegateRole) {
            throw ['role_not_found'];
        }

        const checkDelegationExist = await Delegation(connect(DB_CONNECTION, portal)).exists({
            delegator: delegator._id,
            delegateObject: data.delegateObject,
            status: {
                $in: [
                    "activated", // Đang hoạt động
                    "pending", // Chờ xác nhận
                ]
            }
        });

        if (checkDelegationExist && !data.notCheck) {
            throw ["delegation_exist"];
        }

        if (checkUserHaveRole && !data.notCheck) {
            throw ["user_role_exist"]
        }

        if (!isToday(new Date(data.startDate)) && compareDate(new Date(data.startDate), new Date()) < 0) {
            throw ["start_date_past"]
        }
        if (data.endDate != null && compareDate(new Date(data.endDate), new Date()) < 0) {
            throw ["end_date_past"]
        }

        // this.checkDelegationPolicy(policy, delegator, delegatee, delegateRole);

        const delegatePrivileges = data.allPrivileges ? null
        : await Privilege(connect(DB_CONNECTION, portal))
            .find({
                roleId: { $in: [delegateRole._id].concat(delegateRole.parents) },
                resourceId: { $in: data.delegateLinks }
            })
        
        const newDelegation = await Delegation(connect(DB_CONNECTION, portal)).create({
            name: data.name,
        	description: data.description,
        	delegator: delegator._id,
        	delegatee: delegatee._id,
        	delegateObject: data.delegateObject,
            delegateObjectType: 'Role',
        	startDate: data.startDate,
        	endDate: data.endDate,
        	// revokedDate: data.revokedDate,
            status: isToday(new Date(data.startDate)) ? "activated" : "pending",
        	// replyStatus: data.replyStatus,
        	// declineReason: data.declineReason,
        	// revokeReason: data.revokeReason,
        	policy: data.policy,
            metaData: {
                allPrivileges: data.allPrivileges,
                delegatePrivileges: delegatePrivileges != null ? delegatePrivileges.map(p => p._id) : null,
            },
        	logs: logs,
        });

        // for demo
        await this.assignDelegation(portal, newDelegation._id.toString());

        // add delegationId to selected Privileges
        if (isToday(new Date(data.startDate))) {
            await this.assignDelegation(portal, newDelegation._id.toString());
        }
        else {
            await this.autoActivateDelegation(portal, newDelegation._id.toString());
        }

        if (newDelegation.endDate != null) {
            await this.autoRevokeDelegation(portal, newDelegation._id.toString());
        }

        const delegationRes = await Delegation(connect(DB_CONNECTION, portal)).findById({ _id: newDelegation._id });
        return delegationRes;
    },

    getNewlyCreateDelegation: async function(portal, id, data) {
        let oldDelegation = await Delegation(connect(DB_CONNECTION, portal)).findById(id)
            .populate([
                { path: 'delegator', select: '_id refId'},
                { path: 'delegatee', select: '_id refId'},
            ]);
        const checkNameExisted = await Delegation(connect(DB_CONNECTION, portal)).exists({ name: data.name });
        let updatedDelegation = -1;
        if (oldDelegation.name.trim().toLowerCase().replace(/ /g, "") !== data.name.trim().toLowerCase().replace(/ /g, "")) {
            if (checkNameExisted) {
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
            ])
        const delegatePrivileges = newDelegation.metaData.delegatePrivileges == null || newDelegation.metaData.delegatePrivileges.length == 0 
            ? null
            : await Privilege(connect(DB_CONNECTION, portal)).find({ _id: { $in: newDelegation.metaData.delegatePrivileges } })

        if (delegatePrivileges != null) {
            delegatePrivileges.forEach(async pri => {
                pri.delegations.indexOf(newDelegation._id) === -1 ? pri.delegations.push(newDelegation._id) : null
                await pri.save();
            })
        }

        const newUserRole = await UserRole(connect(DB_CONNECTION, portal)).create({
            userId: newDelegation.delegatee.refId.toString(),
            roleId: newDelegation.delegateObject.toString(),
            delegation: newDelegation.id
        });
        // newUserRole.delegations.indexOf(delegation._id) === -1 ? newUserRole.delegations.push(delegation._id) : null
        newUserRole.save();
        
        newDelegation.status = "activated"
        newDelegation.logs.push(
            {
                createdAt: new Date(),
                requester: null,
                content: newDelegation.name,
                time: new Date(),
                category: "activate"
            })
        await newDelegation.save();
    },

    revokeDelegation: async function(portal, delegationIds, reason) {
        // let delegations = await Delegation(connect(DB_CONNECTION, portal))
        //     .deleteMany({ _id: { $in: delegationIds.map(item => mongoose.Types.ObjectId(item)) } });
        delegationIds.forEach(async delegationId => {
            await UserRole(connect(DB_CONNECTION, portal)).deleteMany({ delegation: delegationId });
        })

        let delegation = await Delegation(connect(DB_CONNECTION, portal)).find({ _id: { $in: delegationIds.map(item => mongoose.Types.ObjectId(item)) } });
        let result = delegation[0];
        if (result.metaData.delegatePrivileges != null) {
            let privileges = await Privilege(connect(DB_CONNECTION, portal)).find({ _id: { $in: result.metaData.delegatePrivileges } })
            privileges.forEach(async pri => {
                pri.delegations.splice(pri.delegations.indexOf(result._id), 1)
                await pri.save()
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

        const newDelegation = await this.getDelegationById(portal, delegationIds[0]);
        return newDelegation;
    },
})

exports.RoleDelegationHandler = RoleDelegationHandler;
