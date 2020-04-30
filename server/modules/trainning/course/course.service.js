const Course = require('../../../models/training/course.model');
const EducationProgram = require('../../../models/training/educationProgram.model');

//Lấy danh sách khoá học 
exports.get = async (data, company) => {
    var keySearch = {
        company: company
    }
    // Bắt sựu kiện mã khoá đào tạo khác ""
    if (data.numberCourse !== "") {
        keySearch = {
            ...keySearch,
            numberCourse: {
                $regex: data.numberCourse,
                $options: "i"
            }
        }
    }
    // Bắt sựu kiện loại đào tạo khác All
    if (data.typeCourse !== "All") {
        keySearch = {
            ...keySearch,
            typeCourse: data.typeCourse
        }
    }
    var totalList = await Course.count(keySearch);
    var allList = await Course.find(keySearch)
        .skip(data.page).limit(data.limit)
        .populate({
            path: 'educationProgram',
            model: EducationProgram
        });
    var content = {
        totalList,
        allList
    }
    return content;
}

//Lấy danh sách khoá học theo chương trình đào tạo
exports.getByEducation = async (data, company) => {
    var keySearch = {
        company: company,
        educationProgram: data._id
    }
    // Bắt sựu kiện mã khoá đào tạo khác ""
    if (data.numberCourse !== "") {
        keySearch = {
            ...keySearch,
            numberCourse: {
                $regex: data.numberCourse,
                $options: "i"
            }
        }
    }
    // Bắt sựu kiện loại đào tạo khác All
    if (data.typeCourse !== "All") {
        keySearch = {
            ...keySearch,
            typeCourse: data.typeCourse
        }
    }
    var totalList = await Course.count(keySearch);
    var allList = await Course.find(keySearch)
        .skip(data.page).limit(data.limit)
        .populate({
            path: 'educationProgram',
            model: EducationProgram
        });
    var content = {
        _id: data._id,
        totalList,
        allList
    }
    return content;
}

// Thêm mới khoá đào tạo
exports.create = async (data, company) => {
    var course = await Course.create({
        company: company,
        nameCourse: data.nameCourse,
        numberCourse: data.numberCourse,
        unitCourse: data.unitCourse,
        address: data.address,
        startDate: data.startDate,
        endDate: data.endDate,
        costsCourse: data.costsCourse + data.unit,
        teacherCourse: data.teacherCourse,
        typeCourse: data.typeCourse,
        educationProgram: data.educationProgram,
        time: data.time
    });
    var newcourse = await Course.findById(course._id).populate({
        path: 'educationProgram',
        model: EducationProgram
    });
    return newcourse;
}

// Xoá khoá học
exports.delete = async (id) => {
    var courseDelete = await Course.findOneAndDelete({
        _id: id
    });
    return courseDelete;
}

// Cập nhật thông tin khoá học
exports.update = async (id, data) => {
    var courseChange = {
        nameCourse: data.nameCourse,
        numberCourse: data.numberCourse,
        unitCourse: data.unitCourse,
        address: data.address,
        startDate: data.startDate,
        endDate: data.endDate,
        costsCourse: data.costsCourse + data.unit,
        teacherCourse: data.teacherCourse,
        typeCourse: data.typeCourse,
        educationProgram: data.educationProgram,
        time: data.time
    };
    await Course.findOneAndUpdate({
        _id: id
    }, {
        $set: courseChange
    });
    return await Course.findById(id).populate({
        path: 'educationProgram',
        model: EducationProgram
    });
}