const DistributeTransfer = require('../../../models/asset/distributeTransfer.model');

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
    var createDistributeTransfer = await DistributeTransfer.create({
        company: company,
        distributeNumber: data.distributeNumber,
        dateCreate: data.dateCreate,
        type: data.type,
        place: data.place,
        // handoverMan: data.handoverMan,
        handoverMan: null,
        // receiver: data.receiver,
        receiver: null,
        asset: null,
        nowLocation: data.nowLocation,
        nextLocation: data.nextLocation,
        reason: data.reason,
    });
    return createDistributeTransfer;
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
    var distributeTransferChange = {
        distributeNumber: data.distributeNumber,
        dateCreate: data.dateCreate,
        type: data.type,
        place: data.place,
        // handoverMan: data.handoverMan,
        handoverMan: null,
        // receiver: data.receiver,
        receiver: null,
        asset: null,
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