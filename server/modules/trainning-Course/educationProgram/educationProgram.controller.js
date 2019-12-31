const EducationProgramService = require('./educationProgram.service');

// get all list educationProgram

exports.get = async (req, res) => {
    try {
        var allEducationProgram = await EducationProgramService.get();

        res.status(200).json({
            message: "Lấy danh sách tất cả các chương trình đào tạo thành công",
            content: {
                ...allEducationProgram
            }
        });
    } catch (error) {
        rres.status(400).json({
            message: error
        });
    }
}

// create a new educationProgram
exports.create = async (req, res) => {
    var education = await EducationProgramService.create(req.body);
    try {
        res.status(200).json({
            message: "Thêm mới chương trình đào tạo thành công",
            content: education
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}

// delete a educationProgram
exports.delete = async (req, res) => {
    try {
        var educationDelete = await EducationProgramService.delete(req.params.numberEducation);
        if (educationDelete !== null) {
            res.status(200).json({
                message: "Xoá thành công một chương trình đào tạo",
                content: educationDelete
            });
        } else {
            res.status(400).json({
                message: "Không tìm thấy chương trình đào tạo cần xoá",
            });
        }
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}

// update a educationProgram
exports.update = async (req, res) => {
    try {
        var educationUpdate = await EducationProgramService.update(req.params.numberEducation, req.body)
        if (educationUpdate !== null) {
            res.status(200).json({
                message: "Update thành công chương trinh đào tạo",
            });
        } else {
            res.status(400).json({
                message: "Không tìm thấy chương trinh đào tạo cần update",
            });
        }
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}