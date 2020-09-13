const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnnualLeaveSchema = new Schema({
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    organizationalUnit: {
        type: Schema.Types.ObjectId,
        ref: 'OrganizationalUnit',
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pass', 'process', 'faile'], // pass-đã chấp nhận, process-chờ phê duyệt, faile-Không cấp nhận  , 
    }
}, {
    timestamps: true,
});

module.exports = (db) => {
    if(!db.models.AnnualLeave)
        return db.model('AnnualLeave', AnnualLeaveSchema);
    return db.models.AnnualLeave;
}