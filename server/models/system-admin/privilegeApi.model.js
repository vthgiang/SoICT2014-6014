const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PrivilegeApiSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    apis: [{
        type: Schema.Types.ObjectId,
        ref: 'SystemApi',
        required: true
        
    }],
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    }
});

module.exports = (db) => {
    if(!db.models.PrivilegeApiSchema) 
        return db.model('PrivilegeApi', PrivilegeApiSchema);
    return db.models.PrivilegeApiSchema;
}