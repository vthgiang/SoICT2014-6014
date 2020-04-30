const DistributeTransferService = require('./distribute-transfer.service');
const {LogInfo, LogError} = require('../../../logs');

/**
 * Lấy danh sách phiếu sửa chữa - thay thế - nâng cấp
 */
exports.searchDistributeTransfers = async (req, res) => {
    // console.log('req.body',req.body);
    try {
        var listDistributeTransfer = await DistributeTransferService.searchDistributeTransfers(req.user.company._id);
        await LogInfo(req.user.email, 'GET_DISTRIBUTETRANSFER', req.user.company);
        res.status(200).json({ success: true, message: ["get_distribute_transfer_success"], content: listDistributeTransfer });
    } catch (error) {
        await LogError(req.user.email, 'GET_DISTRIBUTETRANSFER', req.user.company);
        res.status(400).json({ success: false, message: ["get_distribute_transfer_faile"], content: {error:error}});
    }
}

// Kiểm tra sự tồn tại của mã phiếu
exports.checkDistributeNumber = async (req, res) => {
    try {
        var checkDistributeNumber = await DistributeTransferService.checkDistributeTransferExisted(req.params.distributeNumber, req.user.company._id);
        res.status(200).json({
            message: "success",
            content: checkDistributeNumber
        });
    } catch (error) {
        res.status(400).json({
            message: error,
        });
    }
}

/**
 * Tạo mới thông tin phiếu sửa chữa - thay thế - nâng cấp
 */
exports.createDistributeTransfer = async (req, res) => {
    try {
        if(req.body.distributeNumber.trim()===""){
            await LogError(req.user.email, 'CREATE_DISTRIBUTETRANSFER', req.user.company);
            res.status(400).json({ success: false, message: ["type_number_required"], content:{ inputData: req.body } });
        // } else if(req.body.typeName.trim()===""){
        //     await LogError(req.user.email, 'CREATE_DISTRIBUTETRANSFER', req.user.company);
        //     res.status(400).json({ success: false, message: ["type_name_required"], content:{ inputData: req.body } });
        } else {
            var newDistributeTransfer = await DistributeTransferService.createDistributeTransfer(req.body, req.user.company._id);
            await LogInfo(req.user.email, 'CREATE_DISTRIBUTETRANSFER', req.user.company);
            res.status(200).json({
                success: true,
                message: ["create_distribute_transfer_success"],
                content: newDistributeTransfer
            });
        }
    } catch (error) {
        await LogError(req.user.email, 'CREATE_DISTRIBUTETRANSFER', req.user.company);
        res.status(400).json({ success: false, message: "create_distribute_transfer_faile", content: { inputData: req.body } });
    }
}

/**
 * Xoá thông tin phiếu sửa chữa - thay thế - nâng cấp
 */
exports.deleteDistributeTransfer = async (req, res) => {
    try {
        var distributetransferDelete = await DistributeTransferService.deleteDistributeTransfer(req.params.id);
        await LogInfo(req.user.email, 'DELETE_DISTRIBUTETRANSFER', req.user.company);
        res.status(200).json({
            success: true,
            message: ["delete_distribute_transfer_success"],
            content: distributetransferDelete
        });
    } catch (error) {
        await LogError(req.user.email, 'DELETE_DISTRIBUTETRANSFER', req.user.company);
        res.status(400).json({ success: false, message: ["delete_distribute_transfer_success"], content:{ error: error } });
    }
}

/**
 * Cập nhật thông tin phiếu sửa chữa - thay thế - nâng cấp
 */
exports.updateDistributeTransfer = async (req, res) => {
    try {
        if(req.body.distributeNumber.trim()===""){
            await LogError(req.user.email, 'EDIT_DISTRIBUTETRANSFER', req.user.company);
            res.status(400).json({ success: false, message: ["type_number_required"], content:{ inputData: req.body } });
        // } else if(req.body.typeName.trim()===""){
        //     await LogError(req.user.email, 'EDIT_DISTRIBUTETRANSFER', req.user.company);
        //     res.status(400).json({ success: false, message: ["type_name_required"], content: { inputData: req.body } });
        } else {
            var distributetransferUpdate = await DistributeTransferService.updateDistributeTransfer(req.params.id, req.body);
            await LogInfo(req.user.email, 'EDIT_DISTRIBUTETRANSFER', req.user.company);
            res.status(200).json({
                success: true,
                message: ["edit_distribute_transfer_success"],
                content: distributetransferUpdate
            });
        }
    } catch (error) {
        await LogError(req.user.email, 'EDIT_DISTRIBUTETRANSFER', req.user.company);
        res.status(400).json({ success: false, message: ['edit_distribute_transfer_faile'], content: { error: error } });
    }
}
