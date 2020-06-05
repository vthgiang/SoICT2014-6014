const RepairUpgrade = require('../../../models/asset/repairUpgrade.model');

/**
 * Lấy danh sách phiếu sửa chữa - thay thế - nâng cấp
 */
exports.searchRepairUpgrades = async (data, company) => {
    var keySearch = { company: company };

    // Bắt sựu kiện mã phiếu tìm kiếm khác ""
    if (data.repairNumber !== "") {
        keySearch = { ...keySearch, repairNumber: { $regex: data.repairNumber, $options: "i" } }
    }

    // Thêm key tìm kiếm phiếu theo loại phiếu vào keySearch
    if (data.type && data.type !== null) {
        keySearch = { ...keySearch, type: { $in: data.type } }
    }

    //Bắt sựu kiện tháng tìm kiếm khác ""
    if (data.month !== "" && data.month !== null) {
        keySearch = { ...keySearch, dateCreate: { $regex: data.month, $options: "i" } }
    }

    // Thêm key tìm kiếm phiếu theo trạng thái vào keySearch
    if (data.status && data.status !== null) {
        keySearch = { ...keySearch, status: { $in: data.status } };
    };

    var totalList = await RepairUpgrade.count(keySearch);
    var listRepairUpgrades = await RepairUpgrade.find(keySearch).populate('asset').sort({ 'createdAt': 'desc' }).skip(data.page).limit(data.limit);

    return { totalList, listRepairUpgrades };
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
        asset: data.asset,
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
        asset: data.asset,
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
