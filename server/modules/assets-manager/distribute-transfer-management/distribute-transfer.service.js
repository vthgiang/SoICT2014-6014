const DistributeTransfer = require('../../../models/asset/distributeTransfer.model');
const {Asset, UserRole} = require('../../../models').schema;
/**
 * Lấy danh sách phiếu sửa chữa - thay thế - nâng cấp
 * Hiện tại đang lấy theo mã công ty
 * Sau làm lấy theo các keysearch: chức năng tìm kiếm
 */
exports.searchDistributeTransfers = async (data, company) => {
    var keySearch = { company: company};

    // Bắt sựu kiện mã phiếu tìm kiếm khác ""
    if (data.distributeNumber !== "") {
        keySearch = {...keySearch, distributeNumber: {$regex: data.distributeNumber, $options: "i"}}
    }

    var totalList = await DistributeTransfer.count(keySearch);
    var listDistributeTransfers = await DistributeTransfer.find({
        company: company
    }).populate('asset handoverMan receiver').sort({'createdAt': 'desc'}).skip(data.page).limit(data.limit);
    
    return {totalList,listDistributeTransfers};
}

/**
 * Thêm mới thông tin phiếu sửa chữa - thay thế - nâng cấp
 * @data: dữ liệu phiếu sửa chữa - thay thế - nâng cấp
 */
exports.createDistributeTransfer = (data, company) => {
    data = {...data, company};
    delete data.assetIndex;
    delete data.userReceiveIndex;
    return new DistributeTransfer(data);

}

/**
 * Xoá thông tin phiếu sửa chữa - thay thế - nâng cấp
 * @id: id phiếu sửa chữa - thay thế - nâng cấp muốn xoá
 */
exports.deleteDistributeTransfer = async (id) => {
    return await DistributeTransfer.findOneAndDelete({
        _id: id
    });
}

/**
 * Update thông tin phiếu sửa chữa - thay thế - nâng cấp
 * @id: id phiếu sửa chữa - thay thế - nâng cấp muốn update
 */
exports.updateDistributeTransfer = async (id, data) => {
    return await DistributeTransfer.findByIdAndUpdate(id, data, {new: true}).populate('asset handoverMan receiver');
};

// Kiểm tra sự tồn tại của mã phiếu
exports.checkDistributeTransferExisted = async (distributeNumber, company) => {
    var idDistributeNumber = await DistributeTransfer.find({
        distributeNumber: distributeNumber,
        company: company
    }, {
        field1: 1
    })
    var checkDistributeNumber = false;
    if (idDistributeNumber.length !== 0) {
        checkDistributeNumber = true
    }
    return checkDistributeNumber;
}
