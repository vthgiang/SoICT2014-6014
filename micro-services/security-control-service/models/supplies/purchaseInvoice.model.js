const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// New
const PurchaseInvoiceSchema = new Schema({
    codeInvoice: {
        type: String,
        require: true
    },
    supplies: {
        //vật tư
        type: Schema.Types.ObjectId,
        ref: "Supplies",
    },
    date: { //ngày nhập hóa đơn
        type: Date,
        require: true
    },
    quantity: { //so luong mua
        type: Number,
        require: true
    },
    price: { //don gia
        type: Number,
        require: true,
    },
    supplier: { //nha cung cap
        type: String
    },

    logs: [
        {
            createdAt: {
                type: Date,
                default: Date.now,
            },
            creator: {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
            title: {
                type: String,
            },
            description: {
                type: String,
            },
        },
    ],

}, {
    timestamps: true,
    toJSON: { virtuals: true },
});

module.exports = (db) => {
    if (!db.models.PurchaseInvoice) return db.model("PurchaseInvoice", PurchaseInvoiceSchema);
    return db.models.PurchaseInvoice;
};

