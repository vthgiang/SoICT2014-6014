const {
    Delegation,
    Resource,
    Requester,
    DynamicAssignment,
    DelegationPolicy,
    UserRole
} = require('../../../models');
const {
    connect,
} = require(`../../../helpers/dbHelper`);
const mongoose = require('mongoose'); 
const { isToday, compareDate } = require('../../../helpers/functionHelper');
const schedule = require('node-schedule');
const { BaseDelegationHandler } = require('./base.delegation.handler');
const RequesterService = require('../../auth-service/requester/requester.service')

function ResourceDelegationHandler() {
    BaseDelegationHandler.call(this);
    this.populateArray.push(
        { path: 'delegateObject', select: '_id name type' }
    );
    this.delegateType = 'Resource';
}

ResourceDelegationHandler.prototype = Object.create(BaseDelegationHandler.prototype);

Object.assign(ResourceDelegationHandler.prototype, {
    constructor: ResourceDelegationHandler,

    isRequesterCanAccessResources: async function(portal, requesterId, resourcesId) {
        const requester = await Requester(connect(DB_CONNECTION, portal)).findById(requesterId);
        if (requester.type === 'User') {
            const userRoles = await UserRole(connect(DB_CONNECTION, portal)).find({ userId: requester.refId }).select('roleId');
            const roleIds = userRoles.map(x => x.roleId);
            for (let i=0; i<roleIds.length; i++) {
                const accessibleResources = await RequesterService.getAccessibleResources(portal, requesterId, roleIds[i]);
                const canAccess = accessibleResources.some(x => x.id == resourcesId);
                if (canAccess) {
                    return true;
                }
            }
        }

        const accessibleResources = await RequesterService.getAccessibleResources(portal, requesterId);
        const canAccess = accessibleResources.some(x => x.id == resourcesId);
        
        return canAccess;
    },

    createDelegation: async function(portal, data, logs = []) {
        if (data.delegator == data.delegatee) {
            throw ['delegator_same_delegatee'];
        }

        if (!isToday(new Date(data.startDate)) && compareDate(new Date(data.startDate), new Date()) < 0) {
            throw ['start_date_past']
        }
        if (data.endDate != null && compareDate(new Date(data.endDate), new Date()) < 0) {
            throw ['end_date_past']
        }

        const [delegator, delegatee, delegateObject, policy, checkDelegationNameExist] =
            await Promise.all([
                Requester(connect(DB_CONNECTION, portal)).findById(data.delegator),
                Requester(connect(DB_CONNECTION, portal)).findById(data.delegatee),
                Resource(connect(DB_CONNECTION, portal)).findById(data.delegateObject),
                DelegationPolicy(connect(DB_CONNECTION, portal)).findById(data.policy),
                Delegation(connect(DB_CONNECTION, portal)).exists({ name: data.name }),
            ]);

        if (checkDelegationNameExist && !data.notCheckName) {
            throw ['delegation_name_exist'];
        }

        if (!(await this.isRequesterCanAccessResources(portal, delegator._id, data.delegateObject))){
            throw ['delegator_can_not_access_resources'];
        }

        if ((await this.isRequesterCanAccessResources(portal, delegatee._id, data.delegateObject))){
            throw ['delegatee_already_has_access_right'];
        }

        await this.checkDelegationPolicy(portal, policy, delegator, delegatee, delegateObject);

        const newDelegation = await Delegation(connect(DB_CONNECTION, portal)).create({
            name: data.name,
        	description: data.description,
        	delegator: delegator._id,
        	delegatee: delegatee._id,
        	delegateObject: data.delegateObject,
            delegateObjectType: 'Resource',
        	startDate: data.startDate,
        	endDate: data.endDate,
        	// revokedDate: data.revokedDate,
            status: isToday(new Date(data.startDate)) ? 'activated' : 'pending',
        	// replyStatus: data.replyStatus,
        	// declineReason: data.declineReason,
        	// revokeReason: data.revokeReason,
        	policy: data.policy,
        	logs: logs,
        });

        // for demo
        // await this.assignDelegation(portal, newDelegation._id.toString());

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
        let oldDelegation = await Delegation(connect(DB_CONNECTION, portal)).findById(id);
        const checkNameExisted = await Delegation(connect(DB_CONNECTION, portal)).exists({ name: data.name });
        let updatedDelegation = -1;
        if (oldDelegation.name.trim().toLowerCase().replace(/ /g, '') !== data.name.trim().toLowerCase().replace(/ /g, '')) {
            if (checkNameExisted) {
                throw ['delegation_name_exist'];
            }
        } else {
            data.notCheckName = true
        }

        if (oldDelegation.delegator.toString() !== data.delegator.toString() ||
            oldDelegation.delegatee.toString() !== data.delegatee.toString() ||
            oldDelegation.delegateObject.toString() !== data.delegateObject.toString()
        ) {
            data.notCheck = false;
        } else {
            data.notCheck = true;
        }
    
        updatedDelegation = await this.createDelegation(portal, data, oldDelegation.logs);
    
        return updatedDelegation;
    },

    assignDelegation: async function(portal, newDelegationId) {
        const delegation = await Delegation(connect(DB_CONNECTION, portal)).findById(newDelegationId);

        await DynamicAssignment(connect(DB_CONNECTION, portal)).create({
            delegationId: delegation._id,
            requesterIds: [delegation.delegatee],
            resourceIds: [delegation.delegateObject]
        });

        delegation.status = 'activated'
        delegation.logs.push(
            {
                createdAt: new Date(),
                requester: null,
                content: delegation.name,
                time: new Date(delegation.startDate),
                category: 'activate'
            });
        await delegation.save();
    },

    revokeDelegation: async function(portal, delegationIds, reason) {
        for (let i=0; i<delegationIds.length; i++) {
            const delegation = await Delegation(connect(DB_CONNECTION, portal)).findById(delegationIds[i]);

            await DynamicAssignment(connect(DB_CONNECTION, portal))
                .deleteMany({ delegationId: delegation._id });
            
            delegation.status = 'revoked';
            delegation.revokeReason = !reason ? null : reason;
            delegation.revokedDate = new Date();
            // await this.sendNotification(portal, revokedDelegation, 'revoke', true)
            delegation.logs.push(
                {
                    createdAt: new Date(),
                    requester: null,
                    content: delegation.name,
                    time: new Date(),
                    category: 'revoke'
                }
            )
            if (delegation.endDate && compareDate(delegation.endDate, new Date()) > 0) {
                if (schedule.scheduledJobs['Revoke_' + delegation._id]) {
                    schedule.scheduledJobs['Revoke_' + delegation._id].cancel()
                }
            }
            if (schedule.scheduledJobs['Activate_' + delegation._id]) {
                schedule.scheduledJobs['Activate_' + delegation._id].cancel()
            }

            await delegation.save();
        }

        // return same with previous delegation type, need recheck logic
        let newDelegation = await Delegation(connect(DB_CONNECTION, portal)).findById(delegationIds[0]).populate(this.populateArray);

        return newDelegation;
    },
});

exports.ResourceDelegationHandler = ResourceDelegationHandler;
