const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

// Model quản lý dữ liệu của một mẫu công việc
const OrganizationalUnitKpiTemplateSchema = new Schema(
    {
        organizationalUnit: {
            type: Schema.Types.ObjectId,
            ref: "OrganizationalUnit",
        },
        name: {
            type: String,
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        numberOfDaysTaken: {
            type: Number,
            default: 1,
        },
        kpiActions: [
            {
                type: Schema.Types.ObjectId,
                ref: "OrganizationalUnitKpi",
            }
        ],

        description: {
            type: String,
        },
        status: {
            type: Boolean,
            default: false,
        },
        numberOfUse: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

OrganizationalUnitKpiTemplateSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.OrganizationalUnitKpiTemplate)
        return db.model("OrganizationalUnitKpiTemplate", OrganizationalUnitKpiTemplateSchema);
    return db.models.OrganizationalUnitKpiTemplate;
};
