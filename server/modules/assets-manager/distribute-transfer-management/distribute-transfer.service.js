const DistributeTransfer = require('../../../models/asset/distributeTransfer.model');
const { Asset, UserRole } = require('../../../models').schema;
/**
 * Lấy danh sách phiếu sửa chữa - thay thế - nâng cấp
 * Hiện tại đang lấy theo mã công ty
 * Sau làm lấy theo các keysearch: chức năng tìm kiếm
 */
exports.searchDistributeTransfers = async (company) => {
    var listDistributeTransfers = await DistributeTransfer.find({
        company: company
    })
    return listDistributeTransfers;
}

/**
 * Thêm mới thông tin phiếu sửa chữa - thay thế - nâng cấp
 * @data: dữ liệu phiếu sửa chữa - thay thế - nâng cấp
 */
exports.createDistributeTransfer = async (data, company) => {
    console.log(data);

    // Lấy thông tin tài sản theo mã tài sản
    var assetInfo = await Asset.findOne({ assetNumber: data.assetNumber, company: company }, { _id: 1, emailInCompany: 1 });
    if (assetInfo !== null) {
        var createDistributeTransfer = await DistributeTransfer.create({
            asset: assetInfo._id,
            company: company,
            distributeNumber: data.distributeNumber,
            dateCreate: data.dateCreate,
            type: data.type,
            place: data.place,
            manager: data.manager,
            handoverMan: data.handoverMan,
            receiver: data.receiver,
            dateStartUse: data.dateStartUse,
            dateEndUse: data.dateEndUse,
            nowLocation: data.nowLocation,
            nextLocation: data.nextLocation,
            reason: data.reason,
        });
        return createDistributeTransfer;
    } else return null;

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

    // Lấy thông tin tài sản theo mã tài sản
    var assetInfo = await Asset.findOne({ assetNumber: data.assetNumber, company: company }, { _id: 1, emailInCompany: 1 });
    if (assetInfo !== null) {
        var distributeTransferChange = {
            asset: assetInfo._id,
            distributeNumber: data.distributeNumber,
            dateCreate: data.dateCreate,
            type: data.type,
            place: data.place,
            manager: data.manager,
            handoverMan: data.handoverMan,
            receiver: data.receiver,
            dateStartUse: data.dateStartUse,
            dateEndUse: data.dateEndUse,
            nowLocation: data.nowLocation,
            nextLocation: data.nextLocation,
            reason: data.reason,
        };

        // Cập nhật thông tin phiếu sửa chữa - thay thế - nâng cấp vào database
        await DistributeTransfer.findOneAndUpdate({
            _id: id
        }, {
            $set: distributeTransferChange
        });
        return await DistributeTransfer.findOne({
            _id: id
        })
    }else return null;
}

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