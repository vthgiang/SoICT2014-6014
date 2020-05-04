const {
    Asset,
    RepairUpgrade,
    DistributeTransfer,
    UserRole
} = require('../../../models').schema;

/**
 * Lấy danh sách tài sản
 * @data: dữ liệu key tìm kiếm
 * @company: Id công ty người tìm kiếm
 */
exports.searchAssetProfiles = async (data, company) => {
    var keySearch = {company: company};

    // Bắt sựu kiện mã tài sản tìm kiếm khác "Null"
    if (data.assetNumber !== "") {
        keySearch = {...keySearch, assetNumber: {$regex: data.assetNumber, $options: "i"}}
    }
    ;

    // Bắt sựu kiện tên tài sản tìm kiếm khác ""
    if (data.assetName !== "") {
        keySearch = {...keySearch, assetName: {$regex: data.assetName, $options: "i"}}
    }
    ;

    // Thêm key tìm kiếm tài sản theo trạng thái vào keySearch
    if (data.status !== null) {
        keySearch = {...keySearch, status: {$in: data.status}};
    }
    ;

    // Lấy danh sách tài sản
    var totalList = await Asset.count(keySearch);
    var listAssets = await Asset.find(keySearch, {field1: 1, emailInCompany: 1})
        .sort({'createdAt': 'desc'}).skip(data.page).limit(data.limit);
    var data = [];
    var position = {};
    var newAssetManager = {};
    for (let n in listAssets) {
        var asset = await Asset.find({_id: listAssets[n]._id}).populate('assetType').populate('manager');
        if (asset.length) {
            position = await UserRole.find({userId: asset[0].manager.id}).populate('roleId');

            if (position) {
                newAssetManager = asset[0].manager.toObject();
                newAssetManager.position = position.pop().roleId;
            }
        }
        var repairUpgrade = await RepairUpgrade.find({asset: listAssets[n]._id})
        var distributeTransfer = await DistributeTransfer.find({asset: listAssets[n]._id});

        data[n] = {asset: {...asset[0].toObject(), manager: newAssetManager}, repairUpgrade, distributeTransfer}
    }
    return {data, totalList}
}

// Thêm mới tài sản
exports.create = (data) => {
    console.log(data);
    var createAsset = new Asset(data).save((err, res) => {
        if (err) throw err;


    });
    return createAsset;
}

// Cập nhât thông tin tài sản theo id
exports.updateInfoAsset = async (id, data) => {

}

// Cập nhật(thêm mới) Avatar tài sản
exports.updateAvatar = async (assetNumber, url, company) => {
    
}

// Cập nhật(thêm) thông tin tài liệu đính kèm theo mã tài sản AssetNumber
exports.updateFile = async (assetNumber, data, url, company) => {

}

//  Xoá thông tin tài sản theo id
exports.delete = async (id) => {

}
// Kiểm tra sự tồn tại của mã tài sản
exports.checkAssetExisted = async (assetNumber, company) => {
    var idAsset = await Asset.find({
        assetNumber: assetNumber,
        company: company
    }, {
        field1: 1
    })
    var checkAssetNumber = false;
    if (idAsset.length !== 0) {
        checkAssetNumber = true
    }
    return checkAssetNumber;
}


