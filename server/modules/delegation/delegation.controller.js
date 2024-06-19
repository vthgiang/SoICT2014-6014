const DelegationService = require('./delegation.service');
const Log = require(`../../logs`);
const { createDelegationHandler } = require('./delegation-service/delegation.handler.factory');

const checkValidDelegateType = (delegateType) => {
    return ['Role', 'Task', 'Resource'].includes(delegateType);
}

exports.createDelegation = async (req, res) => {
    const delegateType = req.query.delegateType ?? '';
    if (!checkValidDelegateType(delegateType)) {
        res.status(400).json({
            success: false,
            messages: [`delegation_type_invalid`]
        })
        return;
    }
    try {
        const delegationHandler = createDelegationHandler(delegateType);
        const newDelegation = await delegationHandler.createDelegation(req.portal, req.body[0]);

        const delegation = await delegationHandler.saveLog(req.portal, newDelegation, newDelegation.delegator, newDelegation.name, 'create', newDelegation.createdAt)
        await delegationHandler.sendNotification(req.portal, newDelegation._id, 'create')
        await Log.info(req.user.email, `created_new_${delegateType}_delegation`, req.portal);

        res.status(201).json({
            success: true,
            messages: [`add_${delegateType}_delegation_success`],
            content: delegation
        });
    } catch (error) {
        await Log.error(req.user.email, `created_new_${delegateType}_delegation`, req.portal);

        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : [`add_${delegateType}_delegation_fail`],
            content: error.message
        })
    }
}

exports.getDelegations = async (req, res) => {
    const delegateType = req.query.delegateType ?? '';
    if (!checkValidDelegateType(delegateType)) {
        res.status(400).json({
            success: false,
            messages: [`delegation_type_invalid`]
        })
        return;
    }
    try {
        const delegationHandler = createDelegationHandler(delegateType);
        const delegations = await delegationHandler.getDelegations(req.portal, req.query);

        await Log.info(req.user.email, `got_all_${delegateType}_delegations`, req.portal);

        res.status(200).json({
            success: true,
            messages: [`get_all_${delegateType}_delegations_success`],
            content: delegations
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "GET_ALL_DELEGATIONS", req.portal);

        res.status(400).json({
            success: false,
            messages: [`get_all_${delegateType}_delegations_fail`],
            content: error.message
        });
    }
}

exports.getDelegationsReceive = async (req, res) => {
    const delegateType = req.query.delegateType ?? '';
    if (!checkValidDelegateType(delegateType)) {
        res.status(400).json({
            success: false,
            messages: [`delegation_type_invalid`]
        })
        return;
    }
    try {
        const delegationHandler = createDelegationHandler(delegateType);
        const delegations = await delegationHandler.getDelegationsReceive(req.portal, req.query);
        await Log.info(req.user.email, `got_all_${delegateType}_delegations`, req.portal);

        res.status(200).json({
            success: true,
            messages: [`get_all_${delegateType}_delegations_success`],
            content: delegations
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, `get_all_${delegateType}_delegations`, req.portal);

        res.status(400).json({
            success: false,
            messages: [`got_all_${delegateType}_delegations_fail`],
            content: error.message
        });
    }
}

exports.getDelegationById = async (req, res) => {
    const delegateType = req.query.delegateType ?? '';
    if (!checkValidDelegateType(delegateType)) {
        res.status(400).json({
            success: false,
            messages: [`delegation_type_invalid`]
        })
        return;
    }
    try {
        const delegationHandler = createDelegationHandler(delegateType);
        let { id } = req.params;
        let delegation = await delegationHandler.getDelegationById(req.portal, id);
        await Log.info(req.user.email, "get_delegation_by_id", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_delegation_by_id_success"],
            content: delegation
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "get_delegation_by_id", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_delegation_by_id_fail"],
            content: error.message
        });
    }
}

exports.rejectDelegation = async (req, res) => {
    const delegateType = req.query.delegateType ?? '';
    if (!checkValidDelegateType(delegateType)) {
        res.status(400).json({
            success: false,
            messages: [`delegation_type_invalid`]
        })
        return;
    }
    try {
        const delegationHandler = createDelegationHandler(delegateType);
        let rejectedDelegation = await delegationHandler.rejectDelegation(req.portal, req.body.delegationId, req.body.reason);
        rejectedDelegation = await delegationHandler.saveLog(req.portal, rejectedDelegation, rejectedDelegation.delegatee, rejectedDelegation.name, 'reject', new Date());
        await delegationHandler.sendNotification(req.portal, rejectedDelegation._id, 'reject');

        await Log.info(req.user.email, `rejected_${delegateType}_delegation`, req.portal);
        res.status(200).json({
            success: true,
            messages: [`reject_${delegateType}_delegation_success`],
            content: rejectedDelegation
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, `rejected_${delegateType}_delegation`, req.portal);
        res.status(400).json({
            success: false,
            messages: [`reject_${delegateType}_delegation_fail`],
            content: error.message
        });
    }
}

exports.confirmDelegation = async (req, res) => {
    const delegateType = req.query.delegateType ?? '';
    if (!checkValidDelegateType(delegateType)) {
        res.status(400).json({
            success: false,
            messages: [`delegation_type_invalid`]
        })
        return;
    }
    try {
        const delegationHandler = createDelegationHandler(delegateType);

        let confirmedDelegation = await delegationHandler.confirmDelegation(req.portal, req.body.delegationId);
        confirmedDelegation = await delegationHandler.saveLog(req.portal, confirmedDelegation, confirmedDelegation.delegatee, confirmedDelegation.delegationName, 'confirm', new Date())
        await delegationHandler.sendNotification(req.portal, confirmedDelegation, 'confirm')

        await Log.info(req.user.email, `confirmed_${delegateType}_delegation`, req.portal);
        res.status(200).json({
            success: true,
            messages: [`confirm_${delegateType}_delegation_success`],
            content: confirmedDelegation
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, `confirmed_${delegateType}_delegation`, req.portal);
        res.status(400).json({
            success: false,
            messages: [`confirm_${delegateType}_delegation_fail`],
            content: error.message
        });
    }
}

exports.editDelegation = async (req, res) => {
    const delegateType = req.query.delegateType ?? '';
    if (!checkValidDelegateType(delegateType)) {
        res.status(400).json({
            success: false,
            messages: [`delegation_type_invalid`]
        })
        return;
    }
    try {
        const delegationHandler = createDelegationHandler(delegateType);
        let { id } = req.params;
        let data = req.body;
        let updatedDelegation = await delegationHandler.getNewlyCreateDelegation(req.portal, id, data);
        updatedDelegation = await delegationHandler.saveLog(req.portal, updatedDelegation, updatedDelegation.delegator, updatedDelegation.name, 'edit', updatedDelegation.createdAt)
        await Log.info(req.user.email, `edited_${delegateType}_delegation`, req.portal);
        res.status(200).json({
            success: true,
            messages: [`edit_${delegateType}_delegation_success`],
            content: [id, updatedDelegation]
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, `edited_${delegateType}_delegation`, req.portal);
        res.status(400).json({
            success: false,
            messages: [`edit_${delegateType}_delegation_fail`],
            content: error.message
        });
    }
}

exports.deleteDelegations = async (req, res) => {
    const delegateType = req.query.delegateType ?? '';
    if (!checkValidDelegateType(delegateType)) {
        res.status(400).json({
            success: false,
            messages: [`delegation_type_invalid`]
        })
        return;
    }
    try {
        const delegationHandler = createDelegationHandler(delegateType);

        let deletedDelegation = await delegationHandler.deleteDelegations(req.portal, req.body.delegationIds);
        if (deletedDelegation) {
            await Log.info(req.user.email, `deleted_${delegateType}_delegations`, req.portal);
            res.status(200).json({
                success: true,
                messages: [`delete_${delegateType}_success`],
                content: deletedDelegation
            });
        } else {
            throw Error('Delegation is invalid');
        }
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, `deleted_${delegateType}_delegations`, req.portal);
        res.status(400).json({
            success: false,
            messages: [`delete_${delegateType}_fail`],
            content: error.message
        });
    }
}

exports.revokeDelegation = async (req, res) => {
    const delegateType = req.query.delegateType ?? '';
    if (!checkValidDelegateType(delegateType)) {
        res.status(400).json({
            success: false,
            messages: [`delegation_type_invalid`]
        })
        return;
    }
    try {
        const delegationHandler = createDelegationHandler(delegateType);
        let revokedDelegation = await delegationHandler.revokeDelegation(req.portal, req.body.delegationIds, req.body.reason);
        revokedDelegation = await delegationHandler.saveLog(req.portal, revokedDelegation, revokedDelegation.delegator, revokedDelegation.delegationName, 'revoke', revokedDelegation.revokedDate)
        await delegationHandler.sendNotification(req.portal, revokedDelegation, 'revoke')

        if (revokedDelegation) {
            await Log.info(req.user.email, `revoked_${delegateType}_delegations`, req.portal);
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
        await Log.error(req.user.email, `revoked_${delegateType}_delegations`, req.portal);
        res.status(400).json({
            success: false,
            messages: ['revoke_fail'],
            content: error.message
        });
    }
}
