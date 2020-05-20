const {
    EducationProgram,
    Course
} = require('../../../models').schema;

/**
 * Lấy danh sách khoá học theo key
 * @data : dữ liệu key tìm kiếm
 * @company : Id công ty
 */
exports.searchCourses = async (data, company) => {
    var keySearch = {
        company: company
    }
    if(data._id!==undefined){
        keySearch={
            ...keySearch,
            educationProgram: data._id
        }
    }
    // Bắt sựu kiện mã khoá đào tạo khác ""
    if (data.courseId !== "") {
        keySearch = {
            ...keySearch,
            courseId: {
                $regex: data.courseId,
                $options: "i"
            }
        }
    }
    // Bắt sựu kiện loại đào tạo khác null
    if (data.type !== null) {
        keySearch = {
            ...keySearch,
            type: data.type
        }
    }
    var totalList = await Course.count(keySearch);
    var listCourses = await Course.find(keySearch)
        .skip(data.page).limit(data.limit)
        .populate({
            path: 'educationProgram',
            model: EducationProgram
        });
    return {
        totalList,
        listCourses
    }
}

/** Lấy danh sách khóa học của một chương trình đào tạo */
exports.getCoursesOfEducationProgram = async (data, company) => {
    // var keySearch = {
    //     company: company,
    //     educationProgram: data._id
    // }
    // // Bắt sựu kiện mã khoá đào tạo khác ""
    // if (data.numberCourse !== "") {
    //     keySearch = {
    //         ...keySearch,
    //         numberCourse: {
    //             $regex: data.numberCourse,
    //             $options: "i"
    //         }
    //     }
    // }
    // // Bắt sựu kiện loại đào tạo khác All
    // if (data.typeCourse !== "All") {
    //     keySearch = {
    //         ...keySearch,
    //         typeCourse: data.typeCourse
    //     }
    // }
    // var totalList = await Course.count(keySearch);
    // var allList = await Course.find(keySearch)
    //     .skip(data.page).limit(data.limit)
    //     .populate({
    //         path: 'educationProgram',
    //         model: EducationProgram
    //     });
    // var content = {
    //     _id: data._id,
    //     totalList,
    //     allList
    // }
    // return content;
}
/**
 * Thêm mới khoá đào tạo
 * @data : dữ liệu khoá đào tạo cần thêm
 * @company : id công ty 
 */
exports.createCourse = async (data, company) => {
    var partStart = data.startDate.split('-');
    var startDate = new Date(partStart[2], partStart[1] - 1, partStart[0]);
    var partEnd = data.endDate.split('-');
    var endDate = new Date(partEnd[2], partEnd[1] - 1, partEnd[0]);
    var course = await Course.create({
        company: company,
        name: data.name,
        courseId: data.courseId,
        offeredBy: data.offeredBy,
        coursePlace: data.coursePlace,
        startDate: startDate,
        endDate: endDate,
        cost: {
            number: data.cost,
            unit: data.unit
        },
        lecturer: data.lecturer,
        type: data.type,
        educationProgram: data.educationProgram,
        employeeCommitmentTime: data.employeeCommitmentTime
    });
    return await Course.findById(course._id).populate({
        path: 'educationProgram',
        model: EducationProgram
    });
}

/**
 * Xoá khoá đào tạo
 * @id :id khoá đào tạo cần xoá
 */
exports.deleteCourse = async (id) => {
    var courseDelete = await Course.findOneAndDelete({
        _id: id
    });
    return courseDelete;
}

/**
 * Cập nhật thông tin khoá học
 * @id : id khoá đào tạo cần xoá
 * @data : dữ liệu chỉnh sửa khoá đào tạo
 */
exports.updateCourse = async (id, data) => {
    var partStart = data.startDate.split('-');
    var startDate = new Date(partStart[2], partStart[1] - 1, partStart[0]);
    var partEnd = data.endDate.split('-');
    var endDate = new Date(partEnd[2], partEnd[1] - 1, partEnd[0]);
    console.log(endDate);
    var courseChange = {
        name: data.name,
        offeredBy: data.offeredBy,
        coursePlace: data.coursePlace,
        startDate: startDate,
        endDate: endDate,
        cost: {
            number: data.cost,
            unit: data.unit
        },
        lecturer: data.lecturer,
        type: data.type,
        educationProgram: data.educationProgram,
        employeeCommitmentTime: data.employeeCommitmentTime
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