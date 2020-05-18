const RecommendProcure = require('../../../models/asset/recommendProcure.model');

/**
 * Lấy danh sách phiếu đề nghị mua sắm thiết bị
 */
exports.searchRecommendProcures = async (company) => {
    var listRecommendProcures = await RecommendProcure.find({
        company: company
    })
    return listRecommendProcures;
//
}

/**
 * Thêm mới thông tin phiếu đề nghị mua sắm thiết bị
 * @data: dữ liệu phiếu đề nghị mua sắm thiết bị
 * @company: id công ty người tạo
 */
exports.createRecommendProcure = async (data, company) => {
    console.log(data);
    var createRecommendProcure = await RecommendProcure.create({
        company: company,
        recommendNumber: data.recommendNumber,
        dateCreate: data.dateCreate,
        // proponent: data.proponent, //người đề nghị
        proponent: null, //người đề nghị
        equipment: data.equipment,
        supplier: data.supplier,
        // approver: data.approver, // người phê duyệt
        approver: null, // người phê duyệt
        total: data.total,
        unit: data.unit,
        estimatePrice: data.estimatePrice,
        note: data.note,
        status: data.status,
    });
    return createRecommendProcure;
}

/**
 * Xoá thông tin phiếu đề nghị mua sắm thiết bị
 * @id: id phiếu đề nghị mua sắm thiết bị muốn xoá
 */
exports.deleteRecommendProcure = async (id) => {
    return await RecommendProcure.findOneAndDelete({
        _id: id
    });
}

/**
 * Update thông tin phiếu đề nghị mua sắm thiết bị
 * @id: id phiếu đề nghị mua sắm thiết bị muốn update
 */
exports.updateRecommendProcure = async (id, data) => {
    var recommendProcureChange = {
        recommendNumber: data.recommendNumber,
        dateCreate: data.dateCreate,
        // proponent: data.proponent, //người đề nghị
        proponent: null, //người đề nghị
        equipment: data.equipment,
        supplier: data.supplier,
        // approver: data.approver, // người phê duyệt
        approver: null, // người phê duyệt
        total: data.total,
        unit: data.unit,
        estimatePrice: data.estimatePrice,
        note: data.note,
        status: data.status,
    };
    // Cập nhật thông tin phiếu đề nghị mua sắm thiết bị vào database
    await RecommendProcure.findOneAndUpdate({
        _id: id
    }, {
        $set: recommendProcureChange
    });
    return await RecommendProcure.findOne({
        _id: id
    })
}

// Kiểm tra sự tồn tại của mã phiếu
exports.checkRecommendProcureExisted = async (recommendNumber, company) => {
    var idRecommendNumber = await RecommendProcure.find({
        recommendNumber: recommendNumber,
        company: company
    }, {
        field1: 1
    })
    var checkRecommendNumber = false;
    if (idRecommendNumber.length !== 0) {
        checkRecommendNumber = true
    }
    return checkRecommendNumber;
}
