const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AssetLotSchema = new Schema({
    company: {
        //thuộc công ty nào
        type: Schema.Types.ObjectId,
        ref: "Company",
    },

    code: { //1. Mã lô tài sản
        type: String,
        require: true
    },

    assetLotName: { //2. Tên lô tài sản
        type: String,
        require: true
    },

    total: { //3. số lượng tài sản
        type: String,
        require: true
    },

    price:{//4. giá trị 1 tài sản
        type: String
    },

    supplier: {
        type: String
    },

    //tài liệu đính kèm theo lô tài sản
    documents: [
        {
            name: {
                type: String,
            },
            description: {
                type: String,
            },
            files: [
                {
                    fileName: {
                        type: String,
                    },
                    url: {
                        type: String,
                        required: true,
                    },
                },
            ],
        },
    ]
},{
    timestamps: true,
    toJSON: { virtuals: true },
});

module.exports = (db) => {
    if (!db.models.AssetLot) return db.model("AssetLot", AssetLotSchema);
    return db.models.AssetLot;
};