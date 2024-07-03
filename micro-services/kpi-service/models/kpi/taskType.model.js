const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;

// Create Schema
const TaskTypeSchema = new Schema({
    name: {
        type: String,
    },
    company_id: {
        type: ObjectId,
        ref: 'Company',
    },
});

module.exports = (db) => {
    if (!db.models.TaskTypeSchema) return db.model('TaskType', TaskTypeSchema);
    return db.models.TaskTypeSchema;
};
