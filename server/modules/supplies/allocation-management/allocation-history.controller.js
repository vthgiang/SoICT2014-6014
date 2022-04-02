const AllocationService = require('./allocation-history.service');
const Logger = require(`../../../logs`);
const NotificationServices = require(`../../notification/notification.service`);

/**
 * Lấy danh sách lịch sử cấp phát
 */
exports.searchAllocation = async (req, res) => {
    try {
        let data;
        let params = {
            supplies: req.query.supplies,
            date: req.query.date,
            allocationToOrganizationalUnit: req.query.allocationToOrganizationalUnit,
            allocationToUser: req.query.allocationToUser,
            page: Number(req.query.page),
            limit: Number(req.query.limit),
        }
        data = await AllocationService.searchAllocation(req.portal, params);
        await Logger.info(req.user.email, 'SEARCH_ALLOCATION', req.portal);
        res.status(200).json({
            success: true,
            messages: ["search_allocation_success"],
            content: data
        });
    } catch (error) {
        await Logger.error(req.user.email, 'SEARCH_ALLOCATION', req.portal);
        res.status(400).json({
            success: false,
            messages: ["search_allocation_failed"],
            content: {
                error: error
            }
        });
    }
}

/**
* Thêm danh sách lịch sử cấp phát
*/
exports.createAllocations = async (req, res) => {
    try {
        let data = await AllocationService.createAllocations(req.portal, req.body);
        await Logger.info(req.user.email, 'CREATE_ALLOCATIONS', req.portal);
        res.status(200).json({
            success: true,
            messages: ["create_allocations_success"],
            content: data
        });
    } catch (error) {
        await Logger.error(req.user.email, 'CREATE_ALLOCATIONS', req.portal);
        res.status(400).json({
            success: false,
            messages: ["create_allocations_failed"],
            content: { error: error }
        });
    }
}

/**
 * Cập nhật thông tin lịch sử cấp phát
 */
exports.updateAllocation = async (req, res) => {
    try {
        let data = await AllocationService.updateAllocation(req.portal, req.params.id, req.body);
        await Logger.info(req.user.email, 'UPDATE_ALLOCATION', req.portal);
        res.status(200).json({
            success: true,
            messages: ["update_allocation_success"],
            content: data
        });
    } catch (error) {
        await Logger.error(req.user.email, 'UPDATE_ALLOCATION', req.portal);
        res.status(400).json({
            success: false,
            messages: ["update_allocation_failed"],
            content: { error: error }
        });
    }
}

/**
* Xóa danh sách lịch sử cấp phát
*/
exports.deleteAllocations = async (req, res) => {
    try {
        let data = await AllocationService.deleteAllocations(req.portal, req.body.ids);
        res.status(200).json({
            success: true,
            messages: ["delete_allocations_success"],
            content: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: ["delete_allocations_failed"],
            content: { error: error }
        });
    }
}

/**
 * Lấy thông tin 1 lịch sử cấp phát theo id
 */
exports.getAllocationById = async (req, res) => {
    try {
        let data;
        data = await AllocationService.getAllocationById(req.portal, req.params.id);
        await Logger.info(req.user.email, 'GET_ALLOCATION_BY_ID', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_allocation_by_id_success"],
            content: data
        });
    } catch (error) {
        await Logger.error(req.user.email, 'GET_ALLOCATION_BY_ID', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_allocation_by_id_failed"],
            content: {
                error: error
            }
        });
    }
}
