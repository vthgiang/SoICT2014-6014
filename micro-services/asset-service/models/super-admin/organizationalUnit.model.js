const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrganizationalUnitSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        managers: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Role',
            },
        ],
        deputyManagers: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Role',
            },
        ],
        employees: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Role',
            },
        ],
        parent: {
            type: Schema.Types.ObjectId,
            replies: this,
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = (db) => {
    if (!db.models || !db.models.OrganizationalUnit)
        return db.model('OrganizationalUnit', OrganizationalUnitSchema);
    return db.models.OrganizationalUnit;
};
