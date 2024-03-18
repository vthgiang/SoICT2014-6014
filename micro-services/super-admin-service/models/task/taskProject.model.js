const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const { generateUniqueCode } = require('../../helpers/functionHelper');

const TaskProjectSchema = new Schema(
    {
        code: {
            type: String,
            default: generateUniqueCode('PJ', 'v1')
        },
        name: {
            type: String
        },
        parent: {
            type: Schema.Types.ObjectId,
            replies: this
        }
    },
    {
        timestamps: true,
    }
);
TaskProjectSchema.plugin(mongoosePaginate);
module.exports = (db) => {
    if (!db.models || !db.models.TaskProject) return db.model('TaskProject', TaskProjectSchema);
    return db.models.TaskProject;
};
