const PolicyService = require('./policy.service');
const Log = require(`../../../logs`);

// Thêm mới một ví dụ
exports.createPolicy = async (req, res) => {
    try {
        const newPolicy = await PolicyService.createPolicy(req.portal, req.body);
        await PolicyService.cacheAuthorization(req.portal, newPolicy._id)

        await Log.info(req.user.email, 'CREATED_NEW_POLICY', req.portal);

        res.status(201).json({
            success: true,
            messages: ['add_success'],
            content: newPolicy
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, 'CREATED_NEW_POLICY', req.portal);

        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['add_fail'],
            content: error.message
        })
    }
}

// Lấy ra đầy đủ thông tin tất cả các dịch vụ
exports.getPolicies = async (req, res) => {
    try {
        let data = await PolicyService.getPolicies(req.portal, req.query);

        await Log.info(req.user.email, 'GET_POLICIES', req.portal);

        res.status(200).json({
            success: true,
            messages: ['get_policies_success'],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, 'GET_POLICIES', req.portal);

        res.status(400).json({
            success: false,
            messages: ['get_policies_fail'],
            content: error.message
        });
    }
}

// Lấy ra đầy đủ thông tin tất cả các dịch vụ
exports.getAllPolicies = async (req, res) => {
    try {
        let data = await PolicyService.getPolicies(req.portal, req.query);

        await Log.info(req.user.email, 'GET_ALL_POLICIES', req.portal);

        res.status(200).json({
            success: true,
            messages: ['get_all_policies_success'],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, 'GET_ALL_POLICIES', req.portal);

        res.status(400).json({
            success: false,
            messages: ['get_all_policies_fail'],
            content: error.message
        });
    }
}

//  Lấy ra Ví dụ theo id
exports.getPolicyById = async (req, res) => {
    try {
        let { id } = req.params;
        let policy = await PolicyService.getPolicyById(req.portal, id);

        await Log.info(req.user.email, 'GET_POLICY_BY_ID', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_policy_by_id_success'],
            content: policy
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, 'GET_POLICY_BY_ID', req.portal);

        res.status(400).json({
            success: false,
            messages: ['get_policy_by_id_fail'],
            content: error.message
        });
    }
}

exports.getDetailedPolicyById = async (req, res) => {
    try {
        let { id } = req.params;
        let policy = await PolicyService.getDetailedPolicyById(req.portal, id);

        await Log.info(req.user.email, 'GET_DETAILED_POLICY_BY_ID', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_detailed_policy_by_id_success'],
            content: policy
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, 'GET_DETAILED_POLICY_BY_ID', req.portal);

        res.status(400).json({
            success: false,
            messages: ['get_detailed_policy_by_id_fail'],
            content: error.message
        });
    }
}

// Sửa Ví dụ
exports.editPolicy = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let updatedPolicy = await PolicyService.editPolicy(req.portal, id, data);

        await Log.info(req.user.email, 'UPDATED_POLICY', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_policy_success'],
            content: updatedPolicy
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, 'UPDATED_POLICY', req.portal);

        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_policy_fail'],
            content: error.message
        });
    }
}

// Xóa Ví dụ
exports.deletePolicies = async (req, res) => {
    try {
        let deletedPolicy = await PolicyService.deletePolicies(req.portal, req.body.policyIds);
        if (deletedPolicy) {
            await Log.info(req.user.email, 'DELETED_POLICY', req.portal);
            res.status(200).json({
                success: true,
                messages: ['delete_success'],
                content: deletedPolicy
            });
        } else {
            throw Error('Policy is invalid');
        }
    } catch (error) {
        await Log.error(req.user.email, 'DELETED_POLICY', req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_fail'],
            content: error.message
        });
    }
}



// Chính sách ủy quyền

// Thêm mới một ví dụ
exports.createPolicyDelegation = async (req, res) => {
    try {
        const newPolicy = await PolicyService.createPolicyDelegation(req.portal, req.body);

        await Log.info(req.user.email, 'CREATED_NEW_POLICY', req.portal);

        res.status(201).json({
            success: true,
            messages: ['add_success'],
            content: newPolicy
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, 'CREATED_NEW_POLICY', req.portal);

        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['add_fail'],
            content: error.message
        })
    }
}

// Lấy ra đầy đủ thông tin tất cả các dịch vụ
exports.getPoliciesDelegation = async (req, res) => {
    try {
        let data = await PolicyService.getPoliciesDelegation(req.portal, req.query);

        await Log.info(req.user.email, 'GET_ALL_POLICIES', req.portal);

        res.status(200).json({
            success: true,
            messages: ['get_all_policies_success'],
            content: data
        });
    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, 'GET_ALL_POLICIES', req.portal);

        res.status(400).json({
            success: false,
            messages: ['get_all_policies_fail'],
            content: error.message
        });
    }
}

//  Lấy ra Ví dụ theo id
exports.getPolicyByIdDelegation = async (req, res) => {
    try {
        let { id } = req.params;
        let policy = await PolicyService.getPolicyById(req.portal, id);
        if (policy !== -1) {
            await Log.info(req.user.email, 'GET_POLICY_BY_ID', req.portal);
            res.status(200).json({
                success: true,
                messages: ['get_policy_by_id_success'],
                content: policy
            });
        } else {
            throw Error('policy is invalid')
        }
    } catch (error) {
        await Log.error(req.user.email, 'GET_POLICY_BY_ID', req.portal);

        res.status(400).json({
            success: false,
            messages: ['get_policy_by_id_fail'],
            content: error.message
        });
    }
}

// Sửa Ví dụ
exports.editPolicyDelegation = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let updatedPolicy = await PolicyService.editPolicyDelegation(req.portal, id, data);

        if (updatedPolicy !== -1) {
            await Log.info(req.user.email, 'UPDATED_POLICY', req.portal);
            res.status(200).json({
                success: true,
                messages: ['edit_policy_success'],
                content: updatedPolicy
            });
        } else {
            throw Error('Policy is invalid');
        }

    } catch (error) {
        console.log(error)
        await Log.error(req.user.email, 'UPDATED_POLICY', req.portal);

        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['edit_policy_fail'],
            content: error.message
        });
    }
}

// Xóa Ví dụ
exports.deletePoliciesDelegation = async (req, res) => {
    try {
        let deletedPolicy = await PolicyService.deletePoliciesDelegation(req.portal, req.body.policyIds);
        if (deletedPolicy) {
            await Log.info(req.user.email, 'DELETED_POLICY', req.portal);
            res.status(200).json({
                success: true,
                messages: ['delete_success'],
                content: deletedPolicy
            });
        } else {
            throw Error('Policy is invalid');
        }
    } catch (error) {
        await Log.error(req.user.email, 'DELETED_POLICY', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_fail'],
            content: error.message
        });
    }
}

// Lấy ra tên của tất cả các Ví dụ
exports.getOnlyPolicyName = async (req, res) => {
    try {
        let data = await PolicyService.getOnlyPolicyName(req.portal, req.query);

        await Log.info(req.user.email, 'GET_ONLY_NAME_ALL_POLICIES', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_only_name_all_policies_success'],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'GET_ONLY_NAME_ALL_POLICIES', req.portal);

        res.status(400).json({
            success: false,
            messages: ['get_only_name_all_policies_fail'],
            content: error.message
        });
    }
}
