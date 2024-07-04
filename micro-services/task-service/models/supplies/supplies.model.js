const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// New
const SuppliesSchema = new Schema({
    company: {
        //thuộc công ty nào
        type: Schema.Types.ObjectId,
        ref: "Company"
    },
    code: { // mã vật tư
        type: String,
        require: true
    },

    suppliesName: { // tên vật tư
        type: String,
        require: true,
    },

    totalPurchase: { //số lượng đã mua
        type: Number,
        require: true
    },

    totalAllocation: { //số lượng đã cấp phát
        type: Number,
    },

    price: { //Giá tham khảo
        type: Number,
        require: true
    },

    allocationHistories: [{
        type: Schema.Types.ObjectId,
        ref: 'AllocationHistory'
    }],

    purchaseInvoices: [{
        type: Schema.Types.ObjectId,
        ref: 'PurchaseInvoice'
    }]

}, {
    timestamps: true,
    toJSON: { virtuals: true },
});

module.exports = (db, portal) => {
    if (!db.models.Supplies) return db.model("Supplies", SuppliesSchema);
    return db.models.Supplies;
};