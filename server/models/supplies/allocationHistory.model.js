const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// New
const AllocationHistorySchema = new Schema({
    date: {//ngày cấp phát
        type: Date,
        require: true
    },
    supplies: {
        //vật tư cấp 
        type: Schema.Types.ObjectId,
        ref: "Supplies",
    },
    quantity: { //số lượng đã cấp
        type: Number, //sửa thành number
        require: true
    },
    allocationToOrganizationalUnit: { //đơn vị được cấp
        type: Schema.Types.ObjectId,
        ref: "OrganizationalUnit"
    },
    allocationToUser: {
        //Người được cấp phát
        type: Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
});

module.exports = (db) => {
    if (!db.models.AllocationHistory)
        return db.model('AllocationHistory', AllocationHistorySchema);
    return db.models.AllocationHistory;
};


