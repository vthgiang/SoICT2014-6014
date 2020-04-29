const RepairUpgrade = require('../../../models/asset/repairUpgrade.model');

/**
 * Lấy danh sách phiếu sửa chữa - thay thế - nâng cấp
 */
exports.searchRepairUpgrades = async (company) => {
    var listRepairUpgrades = await RepairUpgrade.find({
        company: company
    })
    return listRepairUpgrades;
}

/**
 * Thêm mới thông tin phiếu sửa chữa - thay thế - nâng cấp
 * @data: dữ liệu phiếu sửa chữa - thay thế - nâng cấp
 */
exports.createRepairUpgrade = async (data, company) => {
    console.log(data);
    var createRepairUpgrade = await RepairUpgrade.create({
        company: company,
        repairNumber: data.repairNumber,
        dateCreate: data.dateCreate,
        type: data.type,
        asset: null,
        reason: data.reason,
        repairDate: data.repairDate,
        completeDate: data.completeDate,
        cost: data.cost,
        status: data.status
    });
    return createRepairUpgrade;
}

/**
 * Xoá thông tin phiếu sửa chữa - thay thế - nâng cấp
 * @id: id phiếu sửa chữa - thay thế - nâng cấp muốn xoá
 */
exports.deleteRepairUpgrade = async (id) => {
    return await RepairUpgrade.findOneAndDelete({
        _id: id
    });
}

/**
 * Update thông tin phiếu sửa chữa - thay thế - nâng cấp
 * @id: id phiếu sửa chữa - thay thế - nâng cấp muốn update
 */
exports.updateRepairUpgrade = async (id, data) => {
    var repairUpgradeChange = {
        repairNumber: data.repairNumber,
        dateCreate: data.dateCreate,
        type: data.type,
        asset: null,
        reason: data.reason,
        repairDate: data.repairDate,
        completeDate: data.completeDate,
        cost: data.cost,
        status: data.status
    };
    // Cập nhật thông tin phiếu sửa chữa - thay thế - nâng cấp vào database
    await RepairUpgrade.findOneAndUpdate({
        _id: id
    }, {
        $set: repairUpgradeChange
    });
    return await RepairUpgrade.findOne({
        _id: id
    })
}

// Kiểm tra sự tồn tại của mã phiếu
exports.checkRepairUpgradeExisted = async (repairNumber, company) => {
    var idRepairNumber = await RepairUpgrade.find({
        repairNumber: repairNumber,
        company: company
    }, {
        field1: 1
    })
    var checkRepairNumber = false;
    if (idRepairNumber.length !== 0) {
        checkRepairNumber = true
    }
    return checkRepairNumber;
}