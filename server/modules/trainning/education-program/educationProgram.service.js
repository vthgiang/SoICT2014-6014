const EducationProgram = require('../../../models/training/educationProgram.model');
const Department = require('../../../models/super-admin/organizationalUnit.model');
const Course = require('../../../models/training/course.model');
const Role = require('../../../models/auth/role.model')

// Lấy danh sách tất cả các chương trình đào tạo
exports.getAllEducationPrograms = async (company) => {
    return await EducationProgram.find({
        company: company
    })
}

//get list educationProgram
exports.searchEducationPrograms = async (data, company) => {
    var keySearch = {
        company: company
    }
    // Bắt sựu kiện đơn vị tìm kiếm khác All 
    if (data.department !== "All") {
        keySearch = {
            ...keySearch,
            unitEducation: data.department
        }
    }
    if (data.position !== "All") {
        keySearch = {
            ...keySearch,
            positionEducation: data.position
        }
    }
    var totalList = await EducationProgram.count(keySearch);
    var allEducation = await EducationProgram.find(keySearch)
        .skip(data.page).limit(data.limit)
        .populate([{
            path: 'unitEducation',
            model: Department
        }, {
            path: 'positionEducation',
            model: Role
        }]);
    var allList = []
    for (let n in allEducation) {
        let total = await Course.count({
            educationProgram: allEducation[n]._id
        });
        let listCourse = await Course.find({
            educationProgram: allEducation[n]._id
        }).skip(0).limit(5)
        allList[n] = {
            ...allEducation[n]._doc,
            listCourse: listCourse,
            totalList: total
        }
    }
    var content = {
        totalList,
        allList
    }
    return content;
}

// add a new educationProgram
exports.createEducationProgram = async (data, company) => {
    var education = await EducationProgram.create({
        company: company,
        nameEducation: data.nameEducation,
        numberEducation: data.numberEducation,
        unitEducation: data.unitEducation,
        positionEducation: data.positionEducation,
    });
    var neweducation = await EducationProgram.findById(education._id).populate([{
        path: 'unitEducation',
        model: Department
    }, {
        path: 'positionEducation',
        model: Role
    }])
    return neweducation;
}

// Delete educationProgram
exports.deleteEducationProgram = async (id) => {
    var educationDelete = await EducationProgram.findOneAndDelete({
        _id: id
    });
    return educationDelete;
}

// Update educationProgram
exports.updateEducationProgram = async (id, data) => {
    var eduacationChange = {
        numberEducation: data.numberEducation,
        nameEducation: data.nameEducation,
        unitEducation: data.unitEducation,
        positionEducation: data.positionEducation
    };
    await EducationProgram.findOneAndUpdate({
        _id: id
    }, {
        $set: eduacationChange
    });

    return await EducationProgram.findOne({
        _id: id
    }).populate([{
        path: 'unitEducation',
        model: Department
    }, {
        path: 'positionEducation',
        model: Role
    }]);
}