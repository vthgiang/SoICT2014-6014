const AssetCrash = require('../../../models/asset/assetCrash.model');
const {Asset, UserRole} = require('../../../models').schema;
/**
 * Lấy danh sách phiếu sửa chữa - thay thế - nâng cấp
 * Hiện tại đang lấy theo mã công ty
 * Sau làm lấy theo các keysearch: chức năng tìm kiếm
 */
exports.searchAssetCrashs = async (data, company) => {
    var keySearch = { company: company};

    // // Bắt sựu kiện phân loại tìm kiếm khác ""
    // if (data.type !== "") {
    //     keySearch = {...keySearch, type: {$regex: data.type, $options: "i"}}
    // }

    var totalList = await AssetCrash.count(keySearch);
    var listAssetCrashs = await AssetCrash.find({
        company: company
    }).populate('asset annunciator').sort({'createdAt': 'desc'}).skip(data.page).limit(data.limit);
    
    return {totalList,listAssetCrashs};
}

/**
 * Thêm mới thông tin phiếu sửa chữa - thay thế - nâng cấp
 * @data: dữ liệu phiếu sửa chữa - thay thế - nâng cấp
 */
exports.createAssetCrash = (data, company) => {
    data = {...data, company};
    delete data.assetIndex;
    delete data.userAnnunciatorIndex;
    return new AssetCrash(data);

}

/**
 * Xoá thông tin phiếu sửa chữa - thay thế - nâng cấp
 * @id: id phiếu sửa chữa - thay thế - nâng cấp muốn xoá
 */
exports.deleteAssetCrash = async (id) => {
    return await AssetCrash.findOneAndDelete({
        _id: id
    });
}

/**
 * Update thông tin phiếu sửa chữa - thay thế - nâng cấp
 * @id: id phiếu sửa chữa - thay thế - nâng cấp muốn update
 */
exports.updateAssetCrash = async (id, data) => {
    return await AssetCrash.findByIdAndUpdate(id, data, {new: true}).populate('asset annunciator');
};

// // Kiểm tra sự tồn tại của mã phiếu
// exports.checkDistributeTransferExisted = async (distributeNumber, company) => {
//     var idDistributeNumber = await DistributeTransfer.find({
//         distributeNumber: distributeNumber,
//         company: company
//     }, {
//         field1: 1
//     })
//     var checkDistributeNumber = false;
//     if (idDistributeNumber.length !== 0) {
//         checkDistributeNumber = true
//     }
//     return checkDistributeNumber;
// }
