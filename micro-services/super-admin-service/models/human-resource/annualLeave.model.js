const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnnualLeaveSchema = new Schema(
    {
        employee: {
            type: Schema.Types.ObjectId,
            ref: 'Employee',
            required: true,
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
        },
        organizationalUnit: {
            type: Schema.Types.ObjectId,
            ref: 'OrganizationalUnit',
        },
        type: {
            // true: nghỉ phép theo ngày, false: nghỉ phép theo giờ
            type: Boolean,
        },
        startTime: {
            type: String,
        },
        endTime: {
            type: String,
        },
        totalHours: {
            type: Number,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ['approved', 'waiting_for_approval', 'disapproved'], // approved-đã chấp nhận, waiting_for_approval-chờ phê duyệt, disapproved-Không cấp nhận  ,
        },
        requestToChange: {
            type: {
                // true: nghỉ phép theo ngày, false: nghỉ phép theo giờ
                type: Boolean,
            },
            startTime: {
                type: String,
            },
            endTime: {
                type: String,
            },
            totalHours: {
                type: Number,
            },
            startDate: {
                type: Date,
            },
            endDate: {
                type: Date,
            },
            reason: {
                type: String,
            },

        }
    },
    {
        timestamps: true,
    }
);

module.exports = (db) => {
    if (!db.models || !db.models.AnnualLeave)
        return db.model('AnnualLeave', AnnualLeaveSchema);
    return db.models.AnnualLeave;
};
