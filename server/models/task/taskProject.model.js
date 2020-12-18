const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {generateUniqueCode} = require('../../helpers/functionHelper');

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

module.exports = (db) => {
    if (!db.models.TaskProject) return db.model("TaskProject", TaskProjectSchema);
    return db.models.TaskProject;
};