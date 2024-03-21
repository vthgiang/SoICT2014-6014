const DelegationService = require('./delegation.service');
const Log = require('../../logs');

// Thêm mới một ví dụ
exports.createDelegation = async (req, res) => {
    try {
        let newDelegation = await DelegationService.createDelegation(req.portal, req.body);

        newDelegation = await DelegationService.saveLog(req.portal, newDelegation, newDelegation.delegator, newDelegation.delegationName, 'create', newDelegation.createdAt)
        await DelegationService.sendNotification(req.portal, newDelegation, 'create')
        await Log.info(req.user.email, 'CREATED_NEW_DELEGATION', req.portal);

        res.status(201).json({
            success: true,
            messages: ['add_success'],
            content: newDelegation
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, 'CREATED_NEW_DELEGATION', req.portal);

        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['add_fail'],
            content: error.message
        })
    }
}

exports.createTaskDelegation = async (req, res) => {
    try {
        let newDelegation = await DelegationService.createTaskDelegation(req.portal, req.body);

        newDelegation = await DelegationService.saveLog(req.portal, newDelegation, newDelegation.delegator, newDelegation.delegationName, 'create', newDelegation.createdAt)
        await DelegationService.sendNotification(req.portal, newDelegation, 'create')

        await Log.info(req.user.email, 'add_task_delegation_success', req.portal);

        res.status(201).json({
            success: true,
            messages: ['add_task_delegation_success'],
            content: newDelegation
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, 'add_task_delegation_faile', req.portal);

        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['add_task_delegation_faile'],
            content: error.message
        })
    }
}

// Lấy ra đầy đủ thông tin tất cả các dịch vụ
exports.getDelegations = async (req, res) => {
    try {
        let data = await DelegationService.getDelegations(req.portal, req.query);

        await Log.info(req.user.email, 'GET_ALL_DELEGATIONS', req.portal);

        res.status(200).json({
            success: true,
            messages: ['get_all_delegations_success'],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, 'GET_ALL_DELEGATIONS', req.portal);

        res.status(400).json({
            success: false,
            messages: ['get_all_delegations_fail'],
            content: error.message
        });
    }
}



exports.getDelegationsReceive = async (req, res) => {
    try {
        let data = await DelegationService.getDelegationsReceive(req.portal, req.query);

        await Log.info(req.user.email, 'GET_ALL_DELEGATIONS', req.portal);

        res.status(200).json({
            success: true,
            messages: ['get_all_delegations_success'],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, 'GET_ALL_DELEGATIONS', req.portal);

        res.status(400).json({
            success: false,
            messages: ['get_all_delegations_fail'],
            content: error.message
        });
    }
}

exports.getDelegationsReceiveTask = async (req, res) => {
    try {
        let data = await DelegationService.getDelegationsReceiveTask(req.portal, req.query);

        await Log.info(req.user.email, 'GET_ALL_DELEGATIONS', req.portal);

        res.status(200).json({
            success: true,
            messages: ['get_all_delegations_success'],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, 'GET_ALL_DELEGATIONS', req.portal);

        res.status(400).json({
            success: false,
            messages: ['get_all_delegations_fail'],
            content: error.message
        });
    }
}

exports.rejectDelegation = async (req, res) => {
    try {
        let rejectedDelegation = await DelegationService.rejectDelegation(req.portal, req.body.delegationId, req.body.reason);
        rejectedDelegation = await DelegationService.saveLog(req.portal, rejectedDelegation, rejectedDelegation.delegatee, rejectedDelegation.delegationName, 'reject', new Date())
        await DelegationService.sendNotification(req.portal, rejectedDelegation, 'reject')

        if (rejectedDelegation) {
            await Log.info(req.user.email, 'REJECTED_DELEGATION', req.portal);
            res.status(200).json({
                success: true,
                messages: rejectedDelegation.delegateType == 'Role' ? ['reject_success'] : ['reject_task_delegation_success'],
                content: rejectedDelegation
            });
        } else {
            throw Error('Delegation is invalid');
        }
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, 'REJECTED_DELEGATION', req.portal);
        res.status(400).json({
            success: false,
            messages: rejectedDelegation.delegateType == 'Role' ? ['reject_fail'] : ['reject_task_delegation_faile'],
            content: error.message
        });
    }
}

exports.confirmDelegation = async (req, res) => {
    try {
        let confirmedDelegation = await DelegationService.confirmDelegation(req.portal, req.body.delegationId);
        confirmedDelegation = await DelegationService.saveLog(req.portal, confirmedDelegation, confirmedDelegation.delegatee, confirmedDelegation.delegationName, 'confirm', new Date())
        await DelegationService.sendNotification(req.portal, confirmedDelegation, 'confirm')

        if (confirmedDelegation) {
            await Log.info(req.user.email, 'CONFIRMED_DELEGATION', req.portal);
            res.status(200).json({
                success: true,
                messages: confirmedDelegation.delegateType == 'Role' ? ['confirm_success'] : ['confirm_task_delegation_success'],
                content: confirmedDelegation
            });
        } else {
            throw Error('Delegation is invalid');
        }
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, 'CONFIRMED_DELEGATION', req.portal);
        res.status(400).json({
            success: false,
            messages: confirmedDelegation.delegateType == 'Role' ? ['confirm_fail'] : ['confirm_task_delegation_faile'],
            content: error.message
        });
    }
}

//  Lấy ra Ví dụ theo id
exports.getDelegationById = async (req, res) => {
    try {
        let { id } = req.params;
        let delegation = await DelegationService.getDelegationById(req.portal, id);
        if (delegation !== -1) {
            await Log.info(req.user.email, 'GET_DELEGATION_BY_ID', req.portal);
            res.status(200).json({
                success: true,
                messages: ['get_delegation_by_id_success'],
                content: delegation
            });
        } else {
            throw Error('delegation is invalid')
        }
    } catch (error) {
        await Log.error(req.user.email, 'GET_DELEGATION_BY_ID', req.portal);

        res.status(400).json({
            success: false,
            messages: ['get_delegation_by_id_fail'],
            content: error.message
        });
    }
}

// Sửa Ví dụ
exports.editDelegation = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let updatedDelegation = await DelegationService.getNewlyCreateDelegation(id, data, req.portal);
        await DelegationService.sendNotification(req.portal, updatedDelegation, 'create')

        if (updatedDelegation !== -1) {
            DelegationService.cancelJobDelegation(id)
            await DelegationService.revokeDelegation(req.portal, [id]);
            await DelegationService.deleteDelegations(req.portal, [id]);
            updatedDelegation = await DelegationService.saveLog(req.portal, updatedDelegation, updatedDelegation.delegator, updatedDelegation.delegationName, 'edit', updatedDelegation.createdAt)
            await Log.info(req.user.email, 'UPDATED_DELEGATION', req.portal);
            res.status(200).json({
                success: true,
                messages: ['edit_delegation_success'],
                content: [id, updatedDelegation]
            });
        } else {
            throw Error('Delegation is invalid');
        }

    } catch (error) {
        await Log.error(req.user.email, 'UPDATED_DELEGATION', req.portal);
        console.log(error)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_delegation_fail'],
            content: error.message
        });
    }
}

exports.editTaskDelegation = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let updatedDelegation = await DelegationService.getNewlyCreateTaskDelegation(id, data, req.portal);
        await DelegationService.sendNotification(req.portal, updatedDelegation, 'create')

        if (updatedDelegation !== -1) {
            DelegationService.cancelJobDelegation(id)
            await DelegationService.revokeTaskDelegation(req.portal, [id]);
            await DelegationService.deleteTaskDelegation(req.portal, [id]);
            updatedDelegation = await DelegationService.saveLog(req.portal, updatedDelegation, updatedDelegation.delegator, updatedDelegation.delegationName, 'edit', updatedDelegation.createdAt)
            await Log.info(req.user.email, 'edit_task_delegation_success', req.portal);
            res.status(200).json({
                success: true,
                messages: ['edit_task_delegation_success'],
                content: [id, updatedDelegation]
            });
        } else {
            throw Error('Delegation is invalid');
        }

    } catch (error) {
        await Log.error(req.user.email, 'edit_task_delegation_faile', req.portal);
        console.log(error)
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_task_delegation_faile'],
            content: error.message
        });
    }
}

// Xóa Ví dụ
exports.deleteDelegations = async (req, res) => {
    try {
        let deletedDelegation = await DelegationService.deleteDelegations(req.portal, req.body.delegationIds);
        if (deletedDelegation) {
            await Log.info(req.user.email, 'DELETED_DELEGATION', req.portal);
            res.status(200).json({
                success: true,
                messages: ['delete_success'],
                content: deletedDelegation
            });
        } else {
            throw Error('Delegation is invalid');
        }
    } catch (error) {
        await Log.error(req.user.email, 'DELETED_DELEGATION', req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_fail'],
            content: error.message
        });
    }
}

exports.revokeDelegation = async (req, res) => {
    try {
        let revokedDelegation = await DelegationService.revokeDelegation(req.portal, req.body.delegationIds, req.body.reason);
        revokedDelegation = await DelegationService.saveLog(req.portal, revokedDelegation, revokedDelegation.delegator, revokedDelegation.delegationName, 'revoke', revokedDelegation.revokedDate)
        await DelegationService.sendNotification(req.portal, revokedDelegation, 'revoke')

        if (revokedDelegation) {
            await Log.info(req.user.email, 'REVOKED_DELEGATION', req.portal);
            res.status(200).json({
                success: true,
                messages: ['revoke_success'],
                content: revokedDelegation
            });
        } else {
            throw Error('Delegation is invalid');
        }
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, 'REVOKED_DELEGATION', req.portal);
        res.status(400).json({
            success: false,
            messages: ['revoke_fail'],
            content: error.message
        });
    }
}

exports.deleteTaskDelegations = async (req, res) => {
    try {
        let deletedDelegation = await DelegationService.deleteTaskDelegation(req.portal, req.body.delegationIds);
        if (deletedDelegation) {
            await Log.info(req.user.email, 'delete_task_delegation_success', req.portal);
            res.status(200).json({
                success: true,
                messages: ['delete_task_delegation_success'],
                content: deletedDelegation
            });
        } else {
            throw Error('Delegation is invalid');
        }
    } catch (error) {
        await Log.error(req.user.email, 'delete_task_delegation_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_task_delegation_faile'],
            content: error.message
        });
    }
}

exports.revokeTaskDelegation = async (req, res) => {
    try {
        let revokedDelegation = await DelegationService.revokeTaskDelegation(req.portal, req.body.delegationIds, req.body.reason);
        revokedDelegation = await DelegationService.saveLog(req.portal, revokedDelegation, revokedDelegation.delegator, revokedDelegation.delegationName, 'revoke', revokedDelegation.revokedDate)
        await DelegationService.sendNotification(req.portal, revokedDelegation, 'revoke')

        if (revokedDelegation) {
            await Log.info(req.user.email, 'revoke_task_delegation_success', req.portal);
            res.status(200).json({
                success: true,
                messages: ['revoke_task_delegation_success'],
                content: revokedDelegation
            });
        } else {
            throw Error('Delegation is invalid');
        }
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, 'revoke_task_delegation_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: ['revoke_task_delegation_faile'],
            content: error.message
        });
    }
}

// Lấy ra tên của tất cả các Ví dụ
exports.getOnlyDelegationName = async (req, res) => {
    try {
        let data;
        data = await DelegationService.getOnlyDelegationName(req.portal, req.query);

        await Log.info(req.user.email, 'GET_ONLY_NAME_ALL_DELEGATIONS', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_only_name_all_delegations_success'],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'GET_ONLY_NAME_ALL_DELEGATIONS', req.portal);

        res.status(400).json({
            success: false,
            messages: ['get_only_name_all_delegations_fail'],
            content: error.message
        });
    }
}
