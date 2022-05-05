const DelegationService = require('./delegation.service');
const Log = require(`../../logs`);

// Thêm mới một ví dụ
exports.createDelegation = async (req, res) => {
    try {
        const newDelegation = await DelegationService.createDelegation(req.portal, req.body);

        await Log.info(req.user.email, 'CREATED_NEW_DELEGATION', req.portal);

        res.status(201).json({
            success: true,
            messages: ["add_success"],
            content: newDelegation
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "CREATED_NEW_DELEGATION", req.portal);

        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ["add_fail"],
            content: error.message
        })
    }
}

// Lấy ra đầy đủ thông tin tất cả các dịch vụ
exports.getDelegations = async (req, res) => {
    try {
        data = await DelegationService.getDelegations(req.portal, req.query);

        await Log.info(req.user.email, "GET_ALL_DELEGATIONS", req.portal);

        res.status(200).json({
            success: true,
            messages: ["get_all_delegations_success"],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, "GET_ALL_DELEGATIONS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_all_delegations_fail"],
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
            await Log.info(req.user.email, "GET_DELEGATION_BY_ID", req.portal);
            res.status(200).json({
                success: true,
                messages: ["get_delegation_by_id_success"],
                content: delegation
            });
        } else {
            throw Error("delegation is invalid")
        }
    } catch (error) {
        await Log.error(req.user.email, "GET_DELEGATION_BY_ID", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_delegation_by_id_fail"],
            content: error.message
        });
    }
}

// Sửa Ví dụ
exports.editDelegation = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let updatedDelegation = await DelegationService.editDelegation(req.portal, id, data);
        if (updatedDelegation !== -1) {
            await Log.info(req.user.email, "UPDATED_DELEGATION", req.portal);
            res.status(200).json({
                success: true,
                messages: ["edit_delegation_success"],
                content: updatedDelegation
            });
        } else {
            throw Error("Delegation is invalid");
        }

    } catch (error) {
        await Log.error(req.user.email, "UPDATED_DELEGATION", req.portal);

        res.status(400).json({
            success: false,
            messages: ["edit_delegation_fail"],
            content: error.message
        });
    }
}

// Xóa Ví dụ
exports.deleteDelegations = async (req, res) => {
    try {
        let deletedDelegation = await DelegationService.deleteDelegations(req.portal, req.body.delegationIds);
        if (deletedDelegation) {
            await Log.info(req.user.email, "DELETED_DELEGATION", req.portal);
            res.status(200).json({
                success: true,
                messages: ["delete_success"],
                content: deletedDelegation
            });
        } else {
            throw Error("Delegation is invalid");
        }
    } catch (error) {
        await Log.error(req.user.email, "DELETED_DELEGATION", req.portal);
        res.status(400).json({
            success: false,
            messages: ["delete_fail"],
            content: error.message
        });
    }
}

// Lấy ra tên của tất cả các Ví dụ
exports.getOnlyDelegationName = async (req, res) => {
    try {
        let data;
        data = await DelegationService.getOnlyDelegationName(req.portal, req.query);

        await Log.info(req.user.email, "GET_ONLY_NAME_ALL_DELEGATIONS", req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_only_name_all_delegations_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, "GET_ONLY_NAME_ALL_DELEGATIONS", req.portal);

        res.status(400).json({
            success: false,
            messages: ["get_only_name_all_delegations_fail"],
            content: error.message
        });
    }
}
