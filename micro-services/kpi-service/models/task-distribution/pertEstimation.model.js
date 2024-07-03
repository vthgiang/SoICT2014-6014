
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PertEstimationSchema = mongoose.Schema({
    taskID:{
        type:String
    },
    opt:{
        type:Number,
    },
    mos:{
        type:Number,
    },
    pes:{
        type:Number,
    }

})
module.exports = (db) => {
    if (!db.models.PertEstimation) {
        return db.model('PertEstimation', PertEstimationSchema);
    }

    return db.models.PertEstimation;
}