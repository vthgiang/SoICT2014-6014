/**
 * Các thông tin về tài sản cần lưu trữ trong model này:
 * 1. Công ty: company: lấy id của bên company.model.js
 * 2. Ảnh: avatar (String)
 * 3. Mã tài sản : code (String)
 * 4. Tên tài sản: assetName (String)
 * 5. Loại tài sản: lấy id của bên assetType.model.js
 * 6. Ngày nhập/ngày mua: datePurchase (date)
 * 7. Người quản lý: manager: lấy id của bên user.model.js
 * 8. Vị trí tài sản: location (String)
 * 9. Giá trị ban đầu: initialPrice (number)
 * 10. Tình trạng: status (String)
 * 11. Mô tả: description
 * 12. Thông tin chi tiết (để lưu các trường dữ liệu cần thêm đối với mỗi tài sản): detailInfo [ 1. Tên trường dữ liệu :nameField (String); 2. Giá trị trường dữ liệu: value (String); 3. đơn vị tính: unit (String)]
 * 13. Thông tin khấu hao: [
 *                           1. Nguyên giá: assetCosts = initialPrice(giá trị ban đầu)+ upgradeCosts (chi phí nâng cấp bên model repairUpgrade.model.js)
 *                           2. Thời gian bắt đầu trích khấu hao: startDepreciation = defaultValue(ngày nhập/ngày mua) (vẫn có thể tự nhập giá trị khác)
 *                           3. Thời gian trích khấu hao: timeDeprecition = defaultValue là thời gian trích khấu hao (timeDepreciation) của loại tài sản (bên assetType.model.js) (vẫn có thể tự nhập giá trị khác)
 *                           4. Thời gian kết thúc trích khấu hao: endDepreciation = startDepreciation + timeDepreciation
 *                           5. Mức độ khấu hao TB năm = nguyên giá/thời gian trích khấu hao
 *                           6. Mức độ khấu hao TB tháng = Mức độ khấu hao TB năm/12
 *                          ]
 * 14. Vị trí lưu trữ bản cứng tài liệu đính kèm: numberFile
 * 15. Tài liệu đính kèm
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Company = require('../system-admin/company.model');
const AssetType = require('./assetType.model');
const User = require('../auth/user.model');

// Create Schema
const AssetSchema = new Schema({
    company: {// công ty
        type: Schema.Types.ObjectId,
        ref: Company,
    },
    /**
     * Tab Thông tin chung
     */
    avatar: { // ảnh
        type: String
    },
    code: { // mã tài sản
        type: String,
        required: true
    },
    assetName: { // tên tài sản
        type: String,
        required: true
    },
    serial: { // số serial
    },
    assetType: { // loại tài sản
        type: Schema.Types.ObjectId,
        ref: AssetType,
    },
    datePurchase: { // ngày nhập, ngày mua
        type: String,
        defaut: Date.now,
        required: true
    },
    warrantyExpirationDate: { // ngày bảo hành (thời gian bảo hành)
        type: String,
        defaut: Date.now,
        required: true
    },
    manager: {// Người quản lý
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    person: {// Người được giao sử dụng
        type: Schema.Types.ObjectId,
        ref: User,
    },
    dateStartUse: { // Người được giao sử dụng từ ngày
        type: String,
        defaut: Date.now,
    },
    dateEndUse: { // Người được giao sử dụng đến ngày
        type: String,
        defaut: Date.now,
    },
    location: { //11.vị trí
        type: String,
        required: true
    },
    
    status: { // tình trạng: sẵn sàng sử dụng || đang sử dụng || hỏng hóc || mất || Thanh lý
        type: String,
    },
    description: { // mô tả
        type: String,
    },

    detailInfo: [{// thông tin chi tiết
        nameField: String,// tên trường dữ liệu
        value: String, //giá trị
    }],

    /**
     * Tab Thông tin khấu hao
     */
    cost: { // nguyên giá
        type: Number,
        required: true
    },
    residualValue: { // Giá trị thu hồi ước tính.
                    //Là giá trị ước tính của một tài sản vào cuối thời hạn thuê 
                    //hoặc thời gian sử dụng hữu ích.Theo nguyên tắc chung, 
                    //thời gian sử dụng hữu dụng hoặc thời gian thuê của một tài sản càng dài 
                    // thì giá trị còn lại của nó càng thấp
        type: Number
    },
    startDepreciation: {// thời gian bắt đầu trích khấu hao (VD: 20-02-2020)
        type: String,
    },
    timeDepreciation: { // thời gian trích khấu hao
        type: String,
    },

    /**
     * Tab Tài liệu đính kèm
     */
    numberFile: { // mã hồ sơ lưu trữ
        type: String
    },
    file: [{ // các file đính kèm
        nameFile: String,
        discFile: String,
        number: String,
        urlFile: String
    }],

    /**
     * Tab Thông tin thanh lý
     */
    disposalDate: { // ngày thanh lý
        type: String,
    },
    disposalType: { // hình thức thanh lý
        type: String,
    },
    disposalCost: { // Giá trị thanh lý
        type: Number,
    },
    disposalDescription: { // Mô tả
        type: String,
    },

    
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = Asset = mongoose.model("assets", AssetSchema);
