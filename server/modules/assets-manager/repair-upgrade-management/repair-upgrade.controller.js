const RepairUpgradeService = require('./repair-upgrade.service');
const {LogInfo, LogError} = require('../../../logs');

/**
 *  Lấy danh sách nghỉ phép
 */
exports.searchRepairUpgrades = async (req, res) => {
    try {
        var listRepairUpgrade = await RepairUpgradeService.searchRepairUpgrades(req.body, req.user.company._id);
        await LogInfo(req.user.email, 'GET_REPAIRUPGRADE', req.user.company);
        res.status(200).json({ success: true, messages: ["get_repair_upgrade_success"], content: listRepairUpgrade });
    } catch (error) {
        await LogError(req.user.email, 'GET_REPAIRUPGRADE', req.user.company);
        res.status(400).json({ success: false, messages: ["get_repair_upgrade_faile"], content: {error:error}});
    }
}

/**
 * Tạo mới thông tin nghỉ phép
 */ 
exports.createRepairUpgrade = async (req, res) => {
    try {
        if(req.body.typeNumber.trim()===""){
            await LogError(req.user.email, 'CREATE_REPAIRUPGRADE', req.user.company);
            res.status(400).json({ success: false, messages: ["type_number_required"], content:{ inputData: req.body } });
        } else if(req.body.dateCreate.trim()===""){
            await LogError(req.user.email, 'CREATE_REPAIRUPGRADE', req.user.company);
            res.status(400).json({ success: false, messages: ["date_create_repair_upgrade_required"], content:{ inputData: req.body } });
        } else if(req.body.type.trim()===""){
            await LogError(req.user.email, 'CREATE_REPAIRUPGRADE', req.user.company);
            res.status(400).json({ success: false, messages: ["type_repair_upgrade_required"], content:{ inputData: req.body } });
        } else if(req.body.assetNumber.trim()===""){
            await LogError(req.user.email, 'CREATE_REPAIRUPGRADE', req.user.company);
            res.status(400).json({ success: false, messages: ["asset_number_required"], content:{ inputData: req.body } });
        } else if(req.body.reason.trim()===""){
            await LogError(req.user.email, 'CREATE_REPAIRUPGRADE', req.user.company);
            res.status(400).json({ success: false, messages: ["reason_repair_upgrade_required"], content:{ inputData: req.body } });
        } else if(req.body.repairDate.trim()===""){
            await LogError(req.user.email, 'CREATE_REPAIRUPGRADE', req.user.company);
            res.status(400).json({ success: false, messages: ["repair_date_repair_upgrade_required"], content:{ inputData: req.body } });
        } else if(req.body.completeDate.trim()===""){
            await LogError(req.user.email, 'CREATE_REPAIRUPGRADE', req.user.company);
            res.status(400).json({ success: false, messages: ["complete_date_repair_upgrade_required"], content:{ inputData: req.body } });
        } else if(req.body.cost.trim()===""){
            await LogError(req.user.email, 'CREATE_REPAIRUPGRADE', req.user.company);
            res.status(400).json({ success: false, messages: ["cost_repair_upgrade_required"], content:{ inputData: req.body } });
        } else if(req.body.status.trim()===""){
            await LogError(req.user.email, 'CREATE_REPAIRUPGRADE', req.user.company);
            res.status(400).json({ success: false, messages: ["status_repair_upgrade_required"], content:{ inputData: req.body } });
        } else {
            var newRepairUpgrade = await RepairUpgradeService.createRepairUpgrade(req.body, req.user.company._id);
            if (newRepairUpgrade === null) {
                await LogError(req.user.email, 'CREATE_REPAIRUPGRADE', req.user.company);
                res.status(404).json({ success: false, messages: ["asset_code_not_find"], content:{ inputData: req.body } });
            } else { 
                await LogInfo(req.user.email, 'CREATE_REPAIRUPGRADE', req.user.company);
                res.status(200).json({
                    success: true,
                    messages: ["create_repair_upgrade_success"],
                    content: newRepairUpgrade 
                });
            }
        }
    } catch (error) {
        await LogError(req.user.email, 'CREATE_REPAIRUPGRADE', req.user.company);
        res.status(400).json({ success: false, messages: "create_repair_upgrade_faile", content: { inputData: req.body } });
    }
}

/**
 * Xoá thông tin nghỉ phép
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
        res.status(400).json({ success: false, messages: ["delete_repair_upgrade_success"], content:{ error: error } });
    }
}

/**
 * Cập nhật thông tin nghỉ phép
 */ 
exports.updateRepairUpgrade = async (req, res) => {
    try {
        if(req.body.typeNumber.trim()===""){
            await LogError(req.user.email, 'EDIT_REPAIRUPGRADE', req.user.company);
            res.status(400).json({ success: false, messages: ["type_number_required"], content:{ inputData: req.body } });
        } else if(req.body.dateCreate.trim()===""){
            await LogError(req.user.email, 'EDIT_REPAIRUPGRADE', req.user.company);
            res.status(400).json({ success: false, messages: ["date_create_repair_upgrade_required"], content:{ inputData: req.body } });
        } else if(req.body.type.trim()===""){
            await LogError(req.user.email, 'EDIT_REPAIRUPGRADE', req.user.company);
            res.status(400).json({ success: false, messages: ["type_repair_upgrade_required"], content:{ inputData: req.body } });
        } else if(req.body.assetNumber.trim()===""){
            await LogError(req.user.email, 'EDIT_REPAIRUPGRADE', req.user.company);
            res.status(400).json({ success: false, messages: ["asset_number_required"], content:{ inputData: req.body } });
        } else if(req.body.reason.trim()===""){
            await LogError(req.user.email, 'EDIT_REPAIRUPGRADE', req.user.company);
            res.status(400).json({ success: false, messages: ["reason_repair_upgrade_required"], content:{ inputData: req.body } });
        } else if(req.body.repairDate.trim()===""){
            await LogError(req.user.email, 'EDIT_REPAIRUPGRADE', req.user.company);
            res.status(400).json({ success: false, messages: ["repair_date_repair_upgrade_required"], content:{ inputData: req.body } });
        } else if(req.body.completeDate.trim()===""){
            await LogError(req.user.email, 'EDIT_REPAIRUPGRADE', req.user.company);
            res.status(400).json({ success: false, messages: ["complete_date_repair_upgrade_required"], content:{ inputData: req.body } });
        } else if(req.body.cost.trim()===""){
            await LogError(req.user.email, 'EDIT_REPAIRUPGRADE', req.user.company);
            res.status(400).json({ success: false, messages: ["cost_repair_upgrade_required"], content:{ inputData: req.body } });
        } else if(req.body.status.trim()===""){
            await LogError(req.user.email, 'EDIT_REPAIRUPGRADE', req.user.company);
            res.status(400).json({ success: false, messages: ["status_repair_upgrade_required"], content:{ inputData: req.body } });
        } else {
            var repairupgradeUpdate = await RepairUpgradeService.updateRepairUpgrade(req.params.id, req.body);
            if(repairupgradeUpdate===null){
                await LogError(req.user.email, 'EDIT_REPAIRUPGRADE', req.user.company);
                res.status(404).json({ success: false, messages: ["asset_code_not_find"], content: { inputData: req.body } });
            }else{
                await LogInfo(req.user.email, 'EDIT_REPAIRUPGRADE', req.user.company);
                res.status(200).json({ 
                    success: true, 
                    messages: ["edit_repair_upgrade_success"], 
                    content: repairupgradeUpdate 
                });
            }
        }
    } catch (error) {
        await LogError(req.user.email, 'EDIT_REPAIRUPGRADE', req.user.company);
        res.status(400).json({ success: false, messages: ['edit_repair_upgrade_faile'], content: { error: error } });
    }
}