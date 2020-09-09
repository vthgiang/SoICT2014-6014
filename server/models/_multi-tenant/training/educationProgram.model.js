const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EducationProgramSchema = new Schema({ // Chương trình đào tạo
    name: {
        type: String,
        required: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'companies'
    },
    programId: { // Mã chương trình đào tạo
        type: String,
        required: true
    },
    applyForOrganizationalUnits: [{ // Những đơn vị mà nhân viên bắt buộc phải tham gia chương trình này
        type: Schema.Types.ObjectId,
        ref: 'organizational_units'
    }],
    applyForPositions: [{ // Những chức vụ bắt buộc phải tham gia chương trình đào tạo
        type: Schema.Types.ObjectId,
        ref: 'roles'
    }]
}, {
    timestamps: true,
});
module.exports = EducationProgram = (db) => db.model("education_programs", EducationProgramSchema);