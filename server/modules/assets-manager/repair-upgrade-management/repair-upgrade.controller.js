const RepairUpgradeService = require('./repair-upgrade.service');
const {LogInfo, LogError} = require('../../../logs');

/**
 * Lấy danh sách phiếu sửa chữa - thay thế - nâng cấp
 */
exports.searchRepairUpgrades = async (req, res) => {
    // console.log('req.body',req.body);
    try {
        var listRepairUpgrades = await RepairUpgradeService.searchRepairUpgrades(req.body, req.user.company._id);
        await LogInfo(req.user.email, 'GET_REPAIRUPGRADE', req.user.company);
        res.status(200).json({success: true, messages: ["get_repair_upgrade_success"], content: listRepairUpgrades});
    } catch (error) {
        await LogError(req.user.email, 'GET_REPAIRUPGRADE', req.user.company);
        res.status(400).json({success: false, messages: ["get_repair_upgrade_faile"], content: {error: error}});
    }
}

// Kiểm tra sự tồn tại của mã phiếu
exports.checkRepairNumber = async (req, res) => {
    try {
        var checkRepairNumber = await RepairUpgradeService.checkRepairUpgradeExisted(req.params.repairNumber, req.user.company._id);
        res.status(200).json({
            messages: "success",
            content: checkRepairNumber
        });
    } catch (error) {
        res.status(400).json({
            messages: error,
        });
    }
}

/**
 * Tạo mới thông tin phiếu sửa chữa - thay thế - nâng cấp
 */
exports.createRepairUpgrade = async (req, res) => {
    try {
        if (req.body.repairNumber.trim() === "") {
            await LogError(req.user.email, 'CREATE_REPAIRUPGRADE', req.user.company);
            res.status(400).json({success: false, messages: ["type_number_required"], content: {inputData: req.body}});
            // } else if(req.body.typeName.trim()===""){
            //     await LogError(req.user.email, 'CREATE_REPAIRUPGRADE', req.user.company);
            //     res.status(400).json({ success: false, messages: ["type_name_required"], content:{ inputData: req.body } });
        } else {
            var newRepairUpgrade = await RepairUpgradeService.createRepairUpgrade(req.body, req.user.company._id);
            await LogInfo(req.user.email, 'CREATE_REPAIRUPGRADE', req.user.company);
            res.status(200).json({
                success: true,
                messages: ["create_repair_upgrade_success"],
                content: newRepairUpgrade
            });
        }
    } catch (error) {
        await LogError(req.user.email, 'CREATE_REPAIRUPGRADE', req.user.company);
        res.status(400).json({success: false, messages: "create_repair_upgrade_faile", content: {inputData: req.body}});
    }
}

/**
 * Xoá thông tin phiếu sửa chữa - thay thế - nâng cấp
 */
exports.deleteRepairUpgrade = async (req, res) => {
    try {
        var repairupgradeDelete = await RepairUpgradeService.deleteRepairUpgrade(req.params.id);
        await LogInfo(req.user.email, 'DELETE_REPAIRUPGRADE', req.user.company);
        res.status(200).json({
            success: true,
            messages: ["delete_repair_upgrade_success"],
            content: repairupgradeDelete
        });
    } catch (error) {
        await LogError(req.user.email, 'DELETE_REPAIRUPGRADE', req.user.company);
        res.status(400).json({success: false, messages: ["delete_repair_upgrade_success"], content: {error: error}});
    }
}

/**
 * Cập nhật thông tin phiếu sửa chữa - thay thế - nâng cấp
 */
exports.updateRepairUpgrade = async (req, res) => {
    try {
        if (req.body.repairNumber.trim() === "") {
            await LogError(req.user.email, 'EDIT_REPAIRUPGRADE', req.user.company);
            res.status(400).json({success: false, messages: ["type_number_required"], content: {inputData: req.body}});
            // } else if(req.body.typeName.trim()===""){
            //     await LogError(req.user.email, 'EDIT_REPAIRUPGRADE', req.user.company);
            //     res.status(400).json({ success: false, messages: ["type_name_required"], content: { inputData: req.body } });
        } else {
            var repairupgradeUpdate = await RepairUpgradeService.updateRepairUpgrade(req.params.id, req.body);
            await LogInfo(req.user.email, 'EDIT_REPAIRUPGRADE', req.user.company);
            res.status(200).json({
                success: true,
                messages: ["edit_repair_upgrade_success"], // thì biết r mà chỗ gọi aler translate đâu
                content: repairupgradeUpdate
            });
        }
    } catch (error) {
        await LogError(req.user.email, 'EDIT_REPAIRUPGRADE', req.user.company);
        res.status(400).json({success: false, messages: ['edit_repair_upgrade_faile'], content: {error: error}});
    }
}
