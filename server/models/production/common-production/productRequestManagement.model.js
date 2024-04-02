const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// bảng quản lý các yêu cầu liên quan đến các module sản xuất, đơn hàng, kho
const ProductRequestManagementSchema = new Schema({
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
    // approveType 3. Người phê duyệt gửi yêu cầu nhập, xuất kho trong đơn hàng
    // approveType 4. Người phê duyệt trong kho, nếu là luân chuyển hàng trong kho thì là kho xuất
    // approveType 5. Người phê duyệt trong kho nhập nếu là luân chuyển hàng trong kho

    approvers: [{ // Người phê duyệt
        information: [{
            approver: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            approvedTime: {
                type: Date
            },
            note: {
                type: String
            }
        }],
        approveType: {
            type: Number,
            required: true
        }
    }],
    refuser: { // Người từ chối yêu cầu
        refuser: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        refuserTime: {
            type: Date
        },
        note: {
            type: String
        }
    },

    goods: [{
        good: {
            type: Schema.Types.ObjectId,
            ref: "Good"
        },
        quantity: {
            type: Number
        },
        lots: [{
            lot: {
                type: Schema.Types.ObjectId,
                ref: 'Lot'
            },
            quantity: {
                type: Number,
                default: 0
            },
            returnQuantity: {
                type: Number,
                default: 0
            },
            note: {
                type: String
            }
        }],
    }],
    manufacturingWork: { // Nhà máy sản xuất
        type: Schema.Types.ObjectId,
        ref: "ManufacturingWorks"
    },
    stock: { // liên quan đến kho nào, nếu là luân chuyển hàng thì là kho xuất
        type: Schema.Types.ObjectId,
        ref: 'Stock'
    },
    toStock: { // Nếu là luân chuyển hàng thì là kho tiếp nhận
        type: Schema.Types.ObjectId,
        ref: 'Stock',
        default: null,
    },
    requestingDepartment: { // Phòng ban yêu cầu
        type: Schema.Types.ObjectId,
        ref: 'OrganizationalUnit',
        default: null,
    },
    orderUnit: {// Bộ phận đơn hàng
        type: Schema.Types.ObjectId,
        ref: "OrganizationalUnit",
        default: null,
    },
    supplier: { // nhà cung cấp
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    customer: { //Khách hàng
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    // 1: trong sản xuất
    // 2: trong đơn hàng
    // 3: Trong kho
    // 4: Vận chuyển
    requestType: {
        type: Number,
        default: 1
    },
    // requestType = 1: mua hàng: type = 1, nhập kho: type = 2, xuất kho : type = 3
    // requestType = 2: nhập kho: type = 1, xuất kho: type = 2
    // requestType = 3: nhập kho: type = 1, xuất kho: type = 2, trả hàng: type = 3, luân chuyển: type = 4 , vận chuyển: type = 5
    // requestType = 4: vận chuyển: type = 1: nhập kho type = 2: xuất kho, type = 3: trả hàng, type = 4: luân chuyển: type = 5
    type: { // loại yêu cầu
        type: Number,
        default: 1
    },

    desiredTime: { // Thời gian mong muốn nhận hàng hoặc nhập hàng
<<<<<<< HEAD
        type: String,
        default: null,
=======
        type: String
>>>>>>> 397a1b650 (add module transportation from qlcv)
    },
    /*yêu cầu mua hàng gửi từ sản xuất : requestType = 1, type = 1
    1: chờ phê duyệt, 2: đã gửi đến bộ phận mua hàng, 3: đã phê duyệt mua hàng, 4. Đã tạo đơn mua hàng
    5: Chờ phê duyệt yêu cầu,
    6: Đã gửi yêu cầu nhập kho, 7: Đã phê duyệt yêu cầu nhập kho, 8: Đang tiến hành nhập kho 9: Đã hoàn thành nhập kho, 
    10: Đã hủy yêu cầu mua hàng, 11: Đã hủy yêu cầu nhập kho
    */
    /* Yêu cầu nhập kho từ sản xuất: requestType = 1, type = 2
    1: Chờ phê duyệt, 2: Yêu cầu đã gửi đến kho, 3: Đã phê duyệt yêu cầu nhập kho, 4: Đang tiến hành nhập kho, 5: Đã hoàn thành nhập kho
    6: Đã hủy yêu cầu nhập kho
    */
    /* Yêu cầu xuất kho từ sản xuất: requestType = 1, type = 3
     1: Chờ phê duyệt, 2: Yêu cầu đã gửi đến kho, 3: Đã phê duyệt yêu cầu xuất kho, 4: Đang tiến hành xuất kho 5: Đã hoàn thành xuất kho
     6: Đã hủy yêu cầu xuất kho
     */
    /* Yêu cầu nhập kho từ đơn hàng: requestType = 2, type = 1
     1: Chờ phê duyệt, 2: Yêu cầu đã gửi đến kho, 3: Đã phê duyệt yêu cầu nhập kho, 4: Đang tiến hành nhập kho, 5: Đã hoàn thành nhập kho
     6: Đã hủy yêu cầu nhập kho
     */
    /* Yêu cầu nhập kho: requestType = 3, type = 1
     1: Chờ phê duyệt, 2: Đã phê duyệt yêu cầu nhập kho, 3: Đang tiến hành nhập kho, 4: Đã hoàn thành nhập kho
     5: Đã hủy yêu cầu nhập kho
     */
    /* Yêu cầu xuất kho : requestType = 3, type = 2
     1: Chờ phê duyệt, 2: Đã phê duyệt yêu cầu xuất kho, 3: Đang tiến hành xuất kho, 4: Đã hoàn thành xuất kho
     5: Đã hủy yêu cầu xuất kho
     */
    /* Yêu cầu nhập kho: requestType = 3, type = 3
     1: Chờ phê duyệt, 2: Đã phê duyệt yêu cầu trả hàng kho, 3: Đang tiến hành trả hàng, 4: Đã hoàn thành trả hàng
     5: Đã hủy yêu cầu trả hàng
     */
    /* Yêu cầu luân chuyển kho: requestType = 3, type = 4
     1: Chờ phê duyệt, 2: Đã phê duyệt yêu cầu luân chuyển kho, 3: Đang tiến hành luân chuyển kho, 4: Đã hoàn thành luân chuyển
     5: Đã hủy yêu cầu luân chuyển
     */
    /*
    Yêu cầu vận chuyển: requestType = 6
    1. chờ phê duyệt đề nghị vận chuyển, 2. đã phê duyệt đề nghị vận chuyển, sẵn sàng lập lịch; 3. đang tiến hành vận chuyển,
    4. Vận chuyển thành công;  5. Vận chuyển thất bại; 6. Bị từ chối yêu cầu vận chuyển
    */ 
    status: {
        type: Number,
        default: 1
    },
    description: { // Mô tả phiếu đề nghị mua 
        type: String
    },
    purchaseOrder: { // Mã đơn mua hàng
        type: Schema.Types.ObjectId,
        ref: "PurchaseOrder",
        default: null,
    },
    saleOrder: { // Mã đơn bán hàng
        type: Schema.Types.ObjectId,
        ref: "SalesOrder",
        default: null,
    },
    bill: { // Mã phiếu trong kho
        type: Schema.Types.ObjectId,
        ref: "Bill",
        default: null,
    },
}, {
    // Thời gian tạo, sửa yêu cầu
    timestamps: true

});

ProductRequestManagementSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.ProductRequestManagement)
        return db.model('ProductRequestManagement', ProductRequestManagementSchema);
    return db.models.ProductRequestManagement;
}
