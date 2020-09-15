const RecommendProcure = require('../../../models/asset/assetPurchaseRequest.model');

/**
 * Lấy danh sách phiếu đề nghị mua sắm thiết bị
 */
exports.searchRecommendProcures = async (query, portal) => {
    const { recommendNumber, approver, proponent, proposalDate, status, page, limit } = query;

    var keySearch = {};

    // Bắt sựu kiện mã phiếu tìm kiếm khác ""
    if (recommendNumber) {
        keySearch = { ...keySearch, recommendNumber: { $regex: recommendNumber, $options: "i" } }
    }

    //Bắt sựu kiện tháng tìm kiếm khác ""
    if (proposalDate) {
        keySearch = { ...keySearch, dateCreate: { $regex: month, $options: "i" } }
    }

    // Thêm người đề nghị vào trường tìm kiếm
    if (proponent) {
        keySearch = { ...keySearch, proponent: { $in: proponent } }
    }

    // Thêm người phê duyệt vào trường tìm kiếm
    if (approver) {
        keySearch = { ...keySearch, approver: { $in: approver } }
    }

    // Thêm key tìm kiếm phiếu theo trạng thái vào keySearch
    if (status) {
        keySearch = { ...keySearch, status: { $in: status } };
    };
    console.log(keySearch)
    var totalList = await RecommendProcure(connect(DB_CONNECTION, portal)).count(keySearch);
    var listRecommendProcures = await RecommendProcure(connect(DB_CONNECTION, portal)).find(keySearch).populate({ path: 'proponent approver' }).sort({ 'createdAt': 'desc' }).skip(page ? parseInt(page) : 0).limit(limit ? parseInt(limit) : 0);

    return { totalList, listRecommendProcures };
}

/**
 * Thêm mới thông tin phiếu đề nghị mua sắm thiết bị
 * @data: dữ liệu phiếu đề nghị mua sắm thiết bị
 */
exports.createRecommendProcure = async (data, portal) => {
    console.log(data);
    var createRecommendProcure = await RecommendProcure(connect(DB_CONNECTION, portal)).create({
        recommendNumber: data.recommendNumber,
        dateCreate: data.dateCreate,
        proponent: data.proponent, // Người đề nghị
        equipmentName: data.equipmentName,
        equipmentDescription: data.equipmentDescription,
        supplier: data.supplier,
        approver: data.approver, // Người phê duyệt
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
    return await RecommendProcure(connect(DB_CONNECTION, portal)).findOneAndDelete({
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
        proponent: data.proponent, // Người đề nghị
        equipmentName: data.equipmentName,
        equipmentDescription: data.equipmentDescription,
        supplier: data.supplier,
        approver: data.approver, // Người phê duyệt
        total: data.total,
        unit: data.unit,
        estimatePrice: data.estimatePrice,
        note: data.note,
        status: data.status,
    };

    // Cập nhật thông tin phiếu đề nghị mua sắm thiết bị vào database
    await RecommendProcure(connect(DB_CONNECTION, portal)).findOneAndUpdate({
        _id: id
    }, {
        $set: recommendProcureChange
    });
    return await RecommendProcure(connect(DB_CONNECTION, portal)).findOne({
        _id: id
    })
}
