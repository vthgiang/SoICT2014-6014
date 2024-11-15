const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttributeSchema = new Schema({
    attributeName: { // Tên Ví dụ
        type: String,
        required: true
    },
    description: { // Mô tả Ví dụ
        type: String
    },
    type: {
        type: String,
        enum: ['Authorization', 'Delegation', 'Mixed'],
    }
});

module.exports = (db) => {
    if (!db.models || !db.models.Attribute)
        return db.model('Attribute', AttributeSchema);
    return db.models.Attribute;
}
