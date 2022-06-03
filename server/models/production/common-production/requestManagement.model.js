const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// bảng quản lý các yêu cầu liên quan đến các module sản xuất, đơn hàng, kho
const RequestManagementSchema = new Schema({
    code: { // Mã phiếu
        type: String,
        required: true
    },
    creator: { // Người tạo
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    // approveType 1. Người phê duyệt trong nhà máy sản xuất
    // approveType 2. Người phê duyệt mua hàng trong đơn hàng
    // approveType 3. Người phê duyệt nhập kho trong đơn hàng
    // approveType 4. Người phê duyệt trong kho

    approvers: [{ // Người phê duyệt
        information: [{
            approver: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            approvedTime: {
                type: Date
            },
        }],
        approveType: {
            type: Number,
            required: true
        }
    }],
    goods: [{
        good: {
            type: Schema.Types.ObjectId,
            ref: "Good"
        },
        quantity: {
            type: Number
        },
    }],
    manufacturingWork: { // Nhà máy sản xuất
        type: Schema.Types.ObjectId,
        ref: "ManufacturingWorks"
    },
    stock: { // liên quan đến kho nào
        type: Schema.Types.ObjectId,
        ref: 'Stock'
    },
    orderUnit: {// Bộ phận đơn hàng
        type: Schema.Types.ObjectId,
        ref: "OrganizationalUnit"
    },
    supplier: { // nhà cung cấp
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    // 1: trong sản xuất
    // 2: trong đơn hàng
    // 3: Trong kho
    requestType: {
        type: Number,
        default: 1
    },
    // requestType = 1: mua hàng: type = 1, nhập kho: type = 2, xuất kho : type = 3
    // requestType = 2: nhập kho: type = 1
    // requestType = 3: nhập kho: type = 1, xuất kho: type = 2, trả hàng: type = 3, luân chuyển: type = 4 , vận chuyển: type = 5
    type: { // loại yêu cầu
        type: Number,
        default: 1
    },

    desiredTime: { // Thời gian mong muốn nhận hàng hoặc nhập hàng
        type: Date
    },
    /*yêu cầu mua hàng gửi từ sản xuất : requestType = 1, type = 1
    1: chờ phê duyệt, 2: đã gửi đến bộ phận mua hàng, 3: đã phê duyệt mua hàng, 4. Đã tạo đơn mua hàng
    5. Chờ phê duyệt yêu cầu, 
    6: Đã gửi yêu cầu nhập kho, 7: Đã phê duyệt yêu cầu nhập kho, 8: Đã hoàn thành nhập kho, 
    9: Đã hủy yêu cầu mua hàng, 10: Đã hủy yêu cầu nhập kho
    */
    /* Yêu cầu nhập kho từ sản xuất: requestType = 1, type = 2
    1: Chờ phê duyệt, 2: Yêu cầu đã gửi đến kho, 3: Đã phê duyệt yêu cầu nhập kho, 4: Đã hoàn thành nhập kho
    5: Đã hủy yêu cầu nhập kho
    */
    /* Yêu cầu xuất kho từ sản xuất: requestType = 1, type = 3
     1: Chờ phê duyệt, 2: Yêu cầu đã gửi đến kho, 3: Đã phê duyệt yêu cầu xuất kho, 4: Đã hoàn thành xuất kho
     5: Đã hủy yêu cầu xuất kho
     */
    /* Yêu cầu nhập kho từ đơn hàng: requestType = 2, type = 1
     1: Chờ phê duyệt, 2: Yêu cầu đã gửi đến kho, 3: Đã phê duyệt yêu cầu nhập kho, 4: Đã hoàn thành nhập kho
     5: Đã hủy yêu cầu nhập kho
     */
    /* Yêu cầu nhập kho: requestType = 3, type = 1
     1: Chờ phê duyệt, 2: Đã phê duyệt yêu cầu nhập kho, 3: Đã hoàn thành nhập kho
     4: Đã hủy yêu cầu nhập kho
     */
    /* Yêu cầu xuất kho : requestType = 3, type = 2
     1: Chờ phê duyệt, 2: Đã phê duyệt yêu cầu xuất kho, 3: Đã hoàn thành xuất kho
     4: Đã hủy yêu cầu xuất kho
     */
    /* Yêu cầu nhập kho: requestType = 3, type = 3
     1: Chờ phê duyệt, 2: Đã phê duyệt yêu cầu trả hàng kho, 3: Đã hoàn thành trả hàng
     4: Đã hủy yêu cầu trả hàng
     */
    /* Yêu cầu luân chuyển kho: requestType = 3, type = 4
     1: Chờ phê duyệt, 2: Đã phê duyệt yêu cầu luân chuyển kho, 3: Đã hoàn thành luân chuyển
     4: Đã hủy yêu cầu luân chuyển
     */
    status: {
        type: Number,
        default: 1
    },
    description: { // Mô tả phiếu đề nghị mua 
        type: String
    },

}, {
    // Thời gian tạo, sửa yêu cầu
    timestamps: true

});

RequestManagementSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.RequestManagement)
        return db.model('RequestManagement', RequestManagementSchema);
    return db.models.RequestManagement;
}
