const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// Model quản lý dữ liệu của một mẫu Kpi
const OrganizationalUnitKpiTemplateSetSchema = new Schema(
    {
        organizationalUnit: {
            type: Schema.Types.ObjectId,
            ref: 'OrganizationalUnit',
        },
        name: {
            type: String,
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        kpis: [
            {
                type: Schema.Types.ObjectId,
                ref: 'OrganizationalUnitKpiTemplate',
            }
        ],
        kpiSet: [
            {
                type: Schema.Types.ObjectId,
                ref: 'OrganizationalUnitKpiSet',
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

OrganizationalUnitKpiTemplateSetSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models || !db.models.OrganizationalUnitKpiTemplateSetSchema)
        return db.model('OrganizationalUnitKpiSetTemplate', OrganizationalUnitKpiTemplateSetSchema);
    return db.models.OrganizationalUnitKpiTemplateSetSchema;
};
