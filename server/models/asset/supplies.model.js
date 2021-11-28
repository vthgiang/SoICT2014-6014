const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

    total: {
        type: Number,
        require: true
    },

    price: {
        type: Number,
        require: true
    },
    /*
    Hóa đơn mua vật tư
     */
    purchaseInvoice: [
        {
            codeInvoice: {
                type: String,
                require: true
            },
            date: { //ngày nhập hóa đơn
                type: Date,
                require: true
            },
            quantity: {
                type: String,
                require: true
            },
            supplier: {
                type: String
            },
        }
    ],
    /**
     * Lịch sử cấp phát vật tư
     */
    allocationHistory: [
        {
            date: {//ngày cấp phát
                type: Date,
                require: true
            },
            quantity: {
                type: String,
                require: true
            },
            organizationalUnit: {
                type: Schema.Types.ObjectId,
                ref: "OrganizationalUnit"
            }
        }
    ]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
});

module.exports = (db) => {
    if (!db.models.Supplies) return db.model("Supplies", SuppliesSchema);
    return db.models.Supplies;
};