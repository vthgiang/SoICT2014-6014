const { Asset, UserRole, RecommendDistribute } = require(`${SERVER_MODELS_DIR}/_multi-tenant`);

/**
 * Lấy danh sách phiếu đề nghị cấp thiết bị
 */
exports.searchRecommendDistributes = async (query, portal) => {
    const { receiptsCode, createReceiptsDate, reqUseStatus, reqUseEmployee, approver, page, limit, managedBy, assetId } = query;
    var keySearch = {};

    // Bắt sựu kiện mã phiếu tìm kiếm khác ""
    if (receiptsCode) {
        keySearch = { ...keySearch, recommendNumber: { $regex: receiptsCode, $options: "i" } }
    }

    // Thêm key tìm kiếm phiếu theo trạng thái vào keySearch
    if (reqUseStatus) {
        keySearch = { ...keySearch, status: { $in: reqUseStatus } };
    };

    // Thêm key tìm kiếm theo đăng ký vào keySearch
    if (reqUseEmployee) {
        keySearch = { ...keySearch, proponent: { $in: reqUseEmployee } };
    };

    // Thêm key tìm kiếm theo người phê duyệt vào keySearch
    if (approver) {
        keySearch = { ...keySearch, approver: { $in: approver } };
    };

    if (assetId) {
        keySearch = { ...keySearch, asset: { $in: assetId } };
    }
    // Thêm key tìm theo ngày lập phiếu vào keySearch
    if (createReceiptsDate) {
        let date = createReceiptsDate.split("-");
        let start = new Date(date[1], date[0] - 1, 1);
        let end = new Date(date[1], date[0], 1);

        keySearch = {
            ...keySearch,
            dateCreate: {
                $gt: start,
                $lte: end
            }
        }
    }

    var totalList = await RecommendDistribute(connect(DB_CONNECTION, portal)).count(keySearch);
    var listRecommendDistributes = await RecommendDistribute(connect(DB_CONNECTION, portal)).find(keySearch).populate({ path: 'asset proponent approver' }).sort({ 'createdAt': 'desc' }).skip(page ? parseInt(page) : 0).limit(limit ? parseInt(limit) : 0);
    var test = await RecommendDistribute(connect(DB_CONNECTION, portal)).find(keySearch);

    if (managedBy !== "" && managedBy !== undefined) {
        let tempListRecommendDistributes = listRecommendDistributes.filter(item => item.asset.managedBy.toString() === managedBy);
        listRecommendDistributes = tempListRecommendDistributes;
    }

    return { totalList, listRecommendDistributes };
}

/**
 * Thêm mới thông tin phiếu đề nghị cap phat thiết bị
 * @data: dữ liệu phiếu đề nghị cap phat thiết bị
 */
exports.createRecommendDistribute = async (data, portal) => {

    let dateStartUse, dateEndUse;
    if (data.startTime) {
        dateStartUse = data.startTime + ' ' + data.dateStartUse;
    } else {
        dateStartUse = data.dateStartUse;
    }
    if (data.stopTime) {
        dateEndUse = data.stopTime + ' ' + data.dateEndUse;
    } else {
        dateEndUse = data.dateEndUse;
    }

    var createRecommendDistribute = await RecommendDistribute(connect(DB_CONNECTION, portal)).create({
        recommendNumber: data.recommendNumber,
        dateCreate: data.dateCreate,
        proponent: data.proponent, // Người đề nghị
        reqContent: data.reqContent,
        asset: data.asset,
        dateStartUse: dateStartUse,
        dateEndUse: dateEndUse,
        approver: data.approver, // Người phê duyệt
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
    return await RecommendDistribute(connect(DB_CONNECTION, portal)).findOneAndDelete({
        _id: id
    });
}

/**
 * Update thông tin phiếu đề nghị cap phat thiết bị
 * @id: id phiếu đề nghị cap phat thiết bị muốn update
 */
exports.updateRecommendDistribute = async (id, data) => {
    let dateStartUse, dateEndUse;
    if (data.startTime) {
        dateStartUse = data.startTime + ' ' + data.dateStartUse;
    } else {
        dateStartUse = data.dateStartUse;
    }
    if (data.stopTime) {
        dateEndUse = data.stopTime + ' ' + data.dateEndUse;
    } else {
        dateEndUse = data.dateEndUse;
    }
    var recommendDistributeChange = {
        recommendNumber: data.recommendNumber,
        dateCreate: data.dateCreate,
        proponent: data.proponent, // Người đề nghị
        reqContent: data.reqContent, // Người đề nghị
        asset: data.asset,
        dateStartUse: dateStartUse,
        dateEndUse: dateEndUse,
        approver: data.approver, // Người phê duyệt
        note: data.note,
        status: data.status,
    };

    // Cập nhật thông tin phiếu đề nghị cap phat thiết bị vào database
    await RecommendDistribute(connect(DB_CONNECTION, portal)).findOneAndUpdate({
        _id: id
    }, {
        $set: recommendDistributeChange
    });
    return await RecommendDistribute(connect(DB_CONNECTION, portal)).findOne({
        _id: id
    })
}