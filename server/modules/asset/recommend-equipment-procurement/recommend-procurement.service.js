const RecommendProcure = require('../../../models/asset/recommendProcure.model');

/**
 * Lấy danh sách phiếu đề nghị mua sắm thiết bị
 */
exports.searchRecommendProcures = async (query, company) => {
    const { recommendNumber, month, status, page, limit } = query;

    var keySearch = { company: company};

    // Bắt sựu kiện mã phiếu tìm kiếm khác ""
    if (recommendNumber) {
        keySearch = { ...keySearch, recommendNumber: { $regex: recommendNumber, $options: "i" } }
    }

    //Bắt sựu kiện tháng tìm kiếm khác ""
    if (month) {
        keySearch = { ...keySearch, dateCreate: { $regex: month, $options: "i" } }
    }

    // Thêm key tìm kiếm phiếu theo trạng thái vào keySearch
    if (status) {
        keySearch = { ...keySearch, status: { $in: status } };
    };

    var totalList = await RecommendProcure.count(keySearch);
    var listRecommendProcures = await RecommendProcure.find(keySearch).populate('proponent approver').sort({'createdAt': 'desc'}).skip(page ? parseInt(page) : 0).limit(limit ? parseInt(limit) : 0);
    
    return { totalList, listRecommendProcures };
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
        proponent: data.proponent, // Người đề nghị
        equipment: data.equipment,
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
        proponent: data.proponent, // Người đề nghị
        equipment: data.equipment,
        supplier: data.supplier,
        approver: data.approver, // Người phê duyệt
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
