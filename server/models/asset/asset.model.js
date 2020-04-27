/**
 * Các thông tin về tài sản cần lưu trữ trong model này:
 * 1. Công ty: company: lấy id của bên company.model.js
 * 2. Ảnh: avatar (String)
 * 3. Mã tài sản : assetNumber (String)
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
 *     //phần này bạn xem xét giúp mình có cần phải lưu trữ các giá trị: Nguyên giá, thời gian kết thúc trích khấu hao, mức độ KH tb năm/tháng hay ko ? Vì Nguyên giá nó thay đổi khi mà tài sản có sự phát sinh nâng cấp, thời gian kết thúc khấu hao thay đổi khi thời gian bắt đầu và thời gian trích khấu hay thay đổi, Giá trị KH tb tháng/năm thì cũng thay đổi theo nguyên giá
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
    avatar: { //2.ảnh
        type: String
    },
    assetNumber: { //3.mã tài sản
        type: String,
        required: true
    },
    assetName: { //4.tên tài sản
        type: String,
        required: true
    },
    assetType: { //5.loại tài sản
        type: Schema.Types.ObjectId,
        ref: AssetType,
    },
    datePurchase: { //6.ngày nhập, ngày mua
        type: String,
        defaut: Date.now,
        required: true
    },
    manager: {//7.Người quản lý
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    location: { //8.vị trí
        type: String,
        required: true
    },
    initialPrice: { //9.giá trị ban đầu
        type: String,
        required: true
    },
    status: { //10.tình trạng: sẵn sàng sử dụng || đang sử dụng || hỏng hóc || mất || Thanh lý
        type: String,
    },
    description: { //11.mô tả
        type: String,
    },
    
    detailInfo: [{//thông tin chi tiết
        nameField: String,// tên trường dữ liệu
        value: String, //giá trị 
    }],
    
    depreciationInfo: [{ //thông tin khấu hao
        startDepreciation: String, //thời gian bắt đầu trích khấu hao (VD: 20-02-2020)
        timeDeprecition: String //thời gian tính khấu hao (VD: 5 năm)

    }],
    numberFile: {
        type: String
    },
    file: [{
        nameFile: String,
        discFile: String,
        number: String,
        file: String,
        urlFile: String
    }],
    createDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    }
    
});

module.exports = Asset = mongoose.model("assets", AssetSchema);
