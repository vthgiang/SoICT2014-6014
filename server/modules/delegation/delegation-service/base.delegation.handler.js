const {
    Delegation,
    Resource,
    Requester,
    DynamicAssignment,
    DelegationPolicy
} = require('../../../models');
const {
    connect,
} = require(`../../../helpers/dbHelper`);
const { isToday, compareDate } = require('../../../helpers/functionHelper');
const schedule = require('node-schedule');
const PolicyService = require('../../super-admin/policy/policy.service');
const NotificationServices = require(`../../notification/notification.service`);
const mongoose = require('mongoose');

function BaseDelegationHandler() {
    this.populateArray = [
        { path: 'delegateObject', select: '_id name' },
        { path: 'delegatee', select: '_id name refId type' },
        { path: 'policy', select: '_id name refId type' },
        { path: 'delegator', select: '_id name refId type' }
    ];
    this.delegateType = '';
}

Object.assign(BaseDelegationHandler.prototype, {
    constructor: BaseDelegationHandler,

    checkDelegationPolicy: function (policy, delegator, delegatee, delegateObject) {
        if (PolicyService.ruleCheck([delegator], policy.delegatorRequirements.attributes, policy.delegatorRequirements.rule).length == 0) {
            throw ['delegator_invalid_policy']
        }

        if (PolicyService.ruleCheck([delegateObject], policy.delegateObjectRequirements.attributes, policy.delegateObjectRequirements.rule).length == 0) {
            throw ['resource_invalid_policy']
        }
    
        if (PolicyService.ruleCheck([delegatee], policy.delegateeRequirements.attributes, policy.delegateeRequirements.rule).length == 0) {
            throw ['delegatee_invalid_policy']
        }
    },

    getDelegations: async function(portal, data) {
        if (!data.requesterId && data.userId) {
            const requester = await Requester(connect(DB_CONNECTION, portal)).findOne({ refId: data.userId });
            data.requesterId = requester._id;
        }

        let keySearch = { delegator: data.requesterId, delegateObjectType: this.delegateType };
        if (data?.name?.length > 0) {
            keySearch = {
                ...keySearch,
                name: {
                    $regex: data.name,
                    $options: 'i'
                }
            }
        }
    
        let page, perPage;
        page = data?.page ? Number(data.page) : 1;
        perPage = data?.perPage ? Number(data.perPage) : 20;
    
        let totalList = await Delegation(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
        let delegations = await Delegation(connect(DB_CONNECTION, portal)).find(keySearch)
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate(this.populateArray);
    
        return {
            data: delegations,
            totalList
        }
    },

    getDelegationsReceive: async function(portal, data) {
        if (!data.requesterId && data.userId) {
            const requester = await Requester(connect(DB_CONNECTION, portal)).findOne({ refId: data.userId });
            data.requesterId = requester._id;
        }

        let keySearch = { delegatee: data.requesterId, delegateObjectType: this.delegateType };
        if (data?.name?.length > 0) {
            keySearch = {
                ...keySearch,
                name: {
                    $regex: data.name,
                    $options: 'i'
                }
            }
        }
    
        let page, perPage;
        page = data?.page ? Number(data.page) : 1;
        perPage = data?.perPage ? Number(data.perPage) : 20;
    
        let totalList = await Delegation(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
        let delegations = await Delegation(connect(DB_CONNECTION, portal)).find(keySearch)
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate(this.populateArray);
    
        return {
            data: delegations,
            totalList
        }
    },

    getDelegationById: async function(portal, id) {
        const delegation = await Delegation(connect(DB_CONNECTION, portal)).findById(id)
            .populate(this.populateArray);

        return delegation;
    },

    cancelJobDelegation: function(delegationId) {
        if (schedule.scheduledJobs['Revoke_' + delegationId]) {
            schedule.scheduledJobs['Revoke_' + delegationId].cancel()
        }
    
        if (schedule.scheduledJobs['Activate_' + delegationId]) {
            schedule.scheduledJobs['Activate_' + delegationId].cancel()
        }
    },

    autoActivateDelegation: async function(portal, delegationId) {
        const delegation = await Delegation(connect(DB_CONNECTION, portal)).findById(delegationId);
        const date = new Date(delegation.startDate);
        const a = this;
        const job = schedule.scheduleJob('Activate_' + delegation._id, date, async function () {
            await a.assignDelegation(portal, delegation._id?.toString())
        });

        return job;
    },

    autoRevokeDelegation: async function(portal, delegationId) {
        const delegation = await Delegation(connect(DB_CONNECTION, portal)).findById(delegationId);
        if (!delegation.endDate) {
            return;
        };
        const date = new Date(delegation.endDate);
        const a = this;
        const job = schedule.scheduleJob('Revoke_' + delegation._id, date, async function () {
            await a.revokeDelegation(portal, [delegation._id], 'Automatic revocation')
        });

        return job;
    },

    editDelegation: async function(portal, delegationId, data) {
        let updatedDelegation = await this.getNewlyCreateDelegation(portal, delegationId, data);

        if (updatedDelegation !== -1) {
            this.cancelJobDelegation(delegationId)
            await this.revokeDelegation(req.portal, [delegationId]);
            await this.deleteDelegations(req.portal, [delegationId]);
        }

        return updatedDelegation;
    },

    deleteDelegations: async function(portal, delegationIds) {
        delegationIds.forEach(x => this.cancelJobDelegation(x));

        let delegations = await Delegation(connect(DB_CONNECTION, portal))
            .deleteMany({ _id: { $in: delegationIds.map(item => mongoose.Types.ObjectId(item)) } });

        return delegations;
    },

    confirmDelegation: async function(portal, delegationId) {
        const delegation = await Delegation(connect(DB_CONNECTION, portal)).findOne({ _id: delegationId });
        if (!delegation) {
            throw ['delegation_invalid']
        }
        delegation.replyStatus = 'confirmed';
        delegation.declineReason = null;
        await delegation.save();

        const newDelegation = this.getDelegationById(delegation._id);
        return newDelegation;
    },

    rejectDelegation: async function(portal, delegationId, reason) {
        const delegation = await Delegation(connect(DB_CONNECTION, portal)).findOne({ _id: delegationId });
        if (!delegation) {
            throw ['delegation_invalid']
        }
        delegation.replyStatus = 'declined';
        delegation.declineReason = !reason ? null : reason;
        await delegation.save();
    
        const newDelegation = this.getDelegationById(delegation._id);
        return newDelegation;
    },

    sendNotification: async function(portal, delegationId, type, auto = false) {
        const delegation = await this.getDelegationById(portal, delegationId);

        if (delegation.delegatee.type !== 'User' || delegation.delegator.type !== 'User')
            return;

        let content;
        let notification;
        if (type == 'create') {
            if (delegation.delegateObjectType == 'Role') {
                content = `
                <p>Bạn được ủy quyền vai trò: ${delegation.delegateObject.name}. </p>
                <p>Người ủy quyền: ${delegation.delegator.name}.</p>
                <p>Mã ủy quyền: ${delegation.name}<p>
                <p>Xem danh sách ủy quyền nhận <a target='_blank' href='${process.env.WEBSITE}/delegation-receive'>tại đây</a><p>
                <br/>
                <p>You received delegation of role: ${delegation.delegateObject.name}. </p>
                <p>Delegator: ${delegation.delegator.name}.</p>
                <p>Delegation code: ${delegation.name}<p>
                <p>View delegation received <a target='_blank' href='${process.env.WEBSITE}/delegation-receive'>here</a><p>
            `
            }

            if (delegation.delegateObjectType == 'Task') {
                content = `
                <p>Bạn được ủy quyền công việc: ${delegation.delegateObject.name}. </p>
                <p>Người ủy quyền: ${delegation.delegator.name}.</p>
                <p>Mã ủy quyền: ${delegation.name}<p>
                <p>Xem danh sách ủy quyền nhận <a target='_blank' href='${process.env.WEBSITE}/delegation-receive'>tại đây</a><p>
                <br/>
                <p>You received delegation of task: ${delegation.delegateObject.name}. </p>
                <p>Delegator: ${delegation.delegator.name}.</p>
                <p>Delegation code: ${delegation.name}<p>
                <p>View delegation received <a target='_blank' href='${process.env.WEBSITE}/delegation-receive'>here</a><p>
            `
            }

            // users = users.map(x => x._id);
            // users = [...users, ...annualLeave.userReceiveds];

            notification = {
                users: [delegation.delegatee._id],
                organizationalUnits: [],
                title: 'Nhận ủy quyền - Receive delegation',
                level: 'general',
                content: content,
                sender: delegation.delegator.name,
            }
        }

        if (type == 'revoke') {
            if (delegation.delegateObjectType == 'Role') {
                content = `
                <p>Đã thu hồi ủy quyền vai trò: ${delegation.delegateObject.name}. </p>
                <p>Người thu hồi: ${!auto ? delegation.delegator.name : 'Hệ thống'}.</p>
                <p>Mã ủy quyền: ${delegation.name}<p>
                <p>Xem danh sách ủy quyền <a target='_blank' href='${process.env.WEBSITE}/delegation-receive'>tại đây</a><p>
                <br/>
                <p>Revoked delegation of role: ${delegation.delegateObject.name}. </p>
                <p>Delegator: ${!auto ? delegation.delegator.name : 'System'}.</p>
                <p>Delegation code: ${delegation.name}<p>
                <p>View delegation <a target='_blank' href='${process.env.WEBSITE}/delegation-receive'>here</a><p>
            `
            }

            if (delegation.delegateObjectType == 'Task') {
                content = `
                <p>Đã thu hồi ủy quyền công việc: ${delegation.delegateObject.name}. </p>
                <p>Người thu hồi: ${!auto ? delegation.delegator.name : 'Hệ thống'}.</p>
                <p>Mã ủy quyền: ${delegation.name}<p>
                <p>Xem danh sách ủy quyền <a target='_blank' href='${process.env.WEBSITE}/delegation-receive'>tại đây</a><p>
                <br/>
                <p>Revoked delegation of task: ${delegation.delegateObject.name}. </p>
                <p>Delegator: ${!auto ? delegation.delegator.name : 'System'}.</p>
                <p>Delegation code: ${delegation.name}<p>
                <p>View delegation <a target='_blank' href='${process.env.WEBSITE}/delegation-receive'>here</a><p>
            `
            }

            // users = users.map(x => x._id);
            // users = [...users, ...annualLeave.userReceiveds];

            notification = {
                users: [delegation.delegatee._id],
                organizationalUnits: [],
                title: 'Đã thu hồi ủy quyền - Revoked delegation',
                level: 'general',
                content: content,
                sender: delegation.delegator.name,
            }
        }

        if (type == 'confirm') {
            if (delegation.delegateObjectType == 'Role') {

                content = `
                <p>Đã xác nhận ủy quyền vai trò: ${delegation.delegateObject.name}. </p>
                <p>Người nhận ủy quyền: ${delegation.delegatee.name}.</p>
                <p>Mã ủy quyền: ${delegation.name}<p>
                <p>Xem danh sách ủy quyền <a target='_blank' href='${process.env.WEBSITE}/delegation-list'>tại đây</a><p>
                <br/>
                <p>Confirmed role delegation: ${delegation.delegateObject.name}. </p>
                <p>Delegatee: ${delegation.delegatee.name}.</p>
                <p>Delegation code: ${delegation.name}<p>
                <p>View delegation <a target='_blank' href='${process.env.WEBSITE}/delegation-list'>here</a><p>
            `
            }

            if (delegation.delegateObjectType == 'Task') {

                content = `
                    <p>Đã xác nhận ủy quyền công việc: ${delegation.delegateObject.name}. </p>
                    <p>Người nhận ủy quyền: ${delegation.delegatee.name}.</p>
                    <p>Mã ủy quyền: ${delegation.name}<p>
                    <p>Xem danh sách ủy quyền <a target='_blank' href='${process.env.WEBSITE}/delegation-list'>tại đây</a><p>
                    <br/>
                    <p>Confirmed task delegation: ${delegation.delegateObject.name}. </p>
                    <p>Delegatee: ${delegation.delegatee.name}.</p>
                    <p>Delegation code: ${delegation.name}<p>
                    <p>View delegation <a target='_blank' href='${process.env.WEBSITE}/delegation-list'>here</a><p>
                `
            }

            // users = users.map(x => x._id);
            // users = [...users, ...annualLeave.userReceiveds];

            notification = {
                users: [delegation.delegator._id],
                organizationalUnits: [],
                title: 'Đã xác nhận ủy quyền - Confirmed delegation',
                level: 'general',
                content: content,
                sender: delegation.delegatee.name,
            }
        }

        if (type == 'reject') {
            if (delegation.delegateObjectType == 'Role') {

                content = `
            <p>Có yêu cầu từ chối ủy quyền vai trò: ${delegation.delegateObject.name}. </p>
            <p>Người nhận ủy quyền: ${delegation.delegatee.name}.</p>
            <p>Mã ủy quyền: ${delegation.name}<p>
            <p>Xem danh sách ủy quyền <a target='_blank' href='${process.env.WEBSITE}/delegation-list'>tại đây</a><p>
            <br/>
            <p>Request to reject role delegation: ${delegation.delegateObject.name}. </p>
            <p>Delegatee: ${delegation.delegatee.name}.</p>
            <p>Delegation code: ${delegation.name}<p>
            <p>View delegation <a target='_blank' href='${process.env.WEBSITE}/delegation-list'>here</a><p>
        `

            }

            if (delegation.delegateObjectType == 'Task') {

                content = `
                <p>Có yêu cầu từ chối ủy quyền công việc: ${delegation.delegateObject.name}. </p>
                <p>Người nhận ủy quyền: ${delegation.delegatee.name}.</p>
                <p>Mã ủy quyền: ${delegation.name}<p>
                <p>Xem danh sách ủy quyền <a target='_blank' href='${process.env.WEBSITE}/delegation-list'>tại đây</a><p>
                <br/>
                <p>Request to reject task delegation: ${delegation.delegateObject.name}. </p>
                <p>Delegatee: ${delegation.delegatee.name}.</p>
                <p>Delegation code: ${delegation.name}<p>
                <p>View delegation <a target='_blank' href='${process.env.WEBSITE}/delegation-list'>here</a><p>
            `

            }
            // users = users.map(x => x._id);
            // users = [...users, ...annualLeave.userReceiveds];

            notification = {
                users: [delegation.delegator._id],
                organizationalUnits: [],
                title: 'Có yêu cầu từ chối ủy quyền - Request to reject delegation',
                level: 'general',
                content: content,
                sender: delegation.delegatee.name,
            }
        }

        await NotificationServices.createNotification(portal, delegation.delegator.company, notification)

    },

    saveLog: async function(portal, delegation, requesterId, content, category, time) {
        if ((!delegation.logs || delegation.logs.length == 0) || (delegation.logs.length > 0 && ((new Date()).getTime() - (new Date(delegation.logs[delegation.logs.length - 1].createdAt)).getTime()) / 1000 > 5) || category == 'logout') {
            await Delegation(connect(DB_CONNECTION, portal)).updateOne({ _id: delegation._id }, {
                logs: [
                    ...delegation.logs,
                    {
                        createdAt: new Date(),
                        requester: requesterId,
                        content: content,
                        time: new Date(time),
                        category: category
                    }
                ]
            })
        }
        
        const newDelegation = await this.getDelegationById(portal, delegation._id);
        return newDelegation;
    }
});

exports.BaseDelegationHandler = BaseDelegationHandler;