// const AssetService = require('../asset-management/asset.service');
const { Asset, RepairUpgrade} = require('../../../models').schema;

/**
 * Lấy danh sách thông tin sửa chữa - thay thế - nâng cấp
 * @data: dữ liệu key tìm kiếm
 * @company: id công ty người dùng
 */ 
exports.searchRepairUpgrades = async (data, company) => {
    
}

/**
 * Thêm mới thông tin sửa chữa - thay thế - nâng cấp
 * @data: dữ liệu thông tin sửa chữa - thay thế - nâng cấp
 * @company: id công ty người tạo
 */ 
exports.createRepairUpgrade = async (data, company) => {
    // Lấy thông tin tài sản theo mã số tài sản
    var assetInfo = await Asset.findOne({ assetNumber: data.assetNumber, company: company }, { _id: 1, company: 1  });
    if(assetInfo!==null){
        // Tạo mới thông tin sửa chữa - thay thế - nâng cấp vào database
        var createRepairUpgrade = await RepairUpgrade.create({
            asset: assetInfo._id,
            company: company,
            repairNumber: data.repairNumber,
            type: data.type,
            dateCreate: data.dateCreate,
            reason: data.reason,
            repairDate: data.repairDate,
            completeDate: data.completeDate,
            cost: data.cost,
            status: data.status
        });
        
        return createRepairUpgrade;
    } else return null;
}

/**
 * Xoá thông tin sửa chữa - thay thế - nâng cấp
 * @id: id thông tin sửa chữa - thay thế - nâng cấp muốn xoá
 */ 
exports.deleteRepairUpgrade = async (id) => {
    return await RepairUpgrade.findOneAndDelete({ _id: id });
}

/**
 * Cập nhật thông tin sửa chữa - thay thế - nâng cấp
 * @id: id thông tin sửa chữa - thay thế - nâng cấp muốn chỉnh sửa
 * @data: dữ liệu thay đổi
 */ 
exports.updateRepairUpgrade = async (id, data) => {
    // Lấy thông tin tài sản theo mã số tài sản
    var assetInfo = await Asset.findOne({ assetNumber: data.assetNumber }, { _id: 1, company: 1 });
    if(assetInfo!==null){
        var RepairUpgradeChange = {
            asset: assetInfo._id,
            repairNumber: data.repairNumber,
            type: data.type,
            dateCreate: data.dateCreate,
            reason: data.reason,
            repairDate: data.repairDate,
            completeDate: data.completeDate,
            cost: data.cost,
            status: data.status
        };
        // Cập nhật thông tin nghỉ phép vào database
        await RepairUpgrade.findOneAndUpdate({ _id: id }, { $set: RepairUpgradeChange });
        
        return RepairUpgradeChange
    } else return null;
}