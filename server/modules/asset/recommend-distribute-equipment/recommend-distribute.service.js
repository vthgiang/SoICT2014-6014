const RecommendDistribute = require('../../../models/asset/recommendDistribute.model');
const {Asset, UserRole} = require('../../../models').schema;
/**
 * Lấy danh sách phiếu đề nghị cấp thiết bị
 */
exports.searchRecommendDistributes = async (query, company) => {
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

    var totalList = await RecommendDistribute.count(keySearch);
    var listRecommendDistributes = await RecommendDistribute.find(keySearch).populate('asset proponent approver').sort({'createdAt': 'desc'}).skip(page ? parseInt(page) : 0).limit(limit ? parseInt(limit) : 0);
    
    return { totalList, listRecommendDistributes };
}

/**
 * Thêm mới thông tin phiếu đề nghị cap phat thiết bị
 * @data: dữ liệu phiếu đề nghị cap phat thiết bị
 * @company: id công ty người tạo
 */
exports.createRecommendDistribute = async (data, company) => {
    console.log(data);
    var createRecommendDistribute = await RecommendDistribute.create({
        company: company,
        recommendNumber: data.recommendNumber,
        dateCreate: data.dateCreate,
        proponent: data.proponent, //người đề nghị
        reqContent: data.reqContent,
        asset: data.asset,
        dateStartUse: data.dateStartUse,
        dateEndUse: data.dateEndUse,
        approver: data.approver, // người phê duyệt
        note: data.note,
        status: data.status,
    });
    return createRecommendDistribute;
}

/**
 * Xoá thông tin phiếu đề nghị cap phat thiết bị
 * @id: id phiếu đề nghị cap phat thiết bị muốn xoá
 */
exports.deleteRecommendDistribute = async (id) => {
    return await RecommendDistribute.findOneAndDelete({
        _id: id
    });
}

/**
 * Update thông tin phiếu đề nghị cap phat thiết bị
 * @id: id phiếu đề nghị cap phat thiết bị muốn update
 */
exports.updateRecommendDistribute = async (id, data) => {
    var recommendDistributeChange = {
        recommendNumber: data.recommendNumber,
        dateCreate: data.dateCreate,
        proponent: data.proponent, //người đề nghị
        reqContent: data.reqContent, //người đề nghị
        asset: data.asset,
        dateStartUse: data.dateStartUse,
        dateEndUse: data.dateEndUse,
        approver: data.approver, // người phê duyệt
        note: data.note,
        status: data.status,
    };
    // Cập nhật thông tin phiếu đề nghị cap phat thiết bị vào database
    await RecommendDistribute.findOneAndUpdate({
        _id: id
    }, {
        $set: recommendDistributeChange
    });
    return await RecommendDistribute.findOne({
        _id: id
    })
}

// Kiểm tra sự tồn tại của mã phiếu
exports.checkRecommendDistributeExisted = async (recommendNumber, company) => {
    var idRecommendNumber = await RecommendDistribute.find({
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
