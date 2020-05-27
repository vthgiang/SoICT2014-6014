const {
    EducationProgram,
    Course,
    EmployeeCourse
} = require('../../../models').schema;

/**
 * Lấy danh sách khoá học theo key
 * @params : dữ liệu key tìm kiếm
 * @company : Id công ty
 */
exports.searchCourses = async (params, company) => {
    var keySearch = {
        company: company
    }
    if (params._id !== undefined) {
        keySearch = {
            ...keySearch,
            educationProgram: params._id
        }
    }
    // Bắt sựu kiện mã khoá đào tạo khác ""
    if (params.courseId !== undefined && params.courseId.length !== 0) {
        keySearch = {
            ...keySearch,
            courseId: {
                $regex: params.courseId,
                $options: "i"
            }
        }
    }
    // Bắt sựu kiện loại đào tạo khác null
    if (params.type !== undefined) {
        keySearch = {
            ...keySearch,
            type: params.type
        }
    }
    var totalList = await Course.count(keySearch);
    var listCourses = await Course.find(keySearch)
        .skip(params.page).limit(params.limit)
        .populate({
            path: 'educationProgram',
            model: EducationProgram
        });
    for (let n in listCourses) {
        let listEmployees = await EmployeeCourse.find({
            course: listCourses[n]._id
        });
        listCourses[n] = {
            ...listCourses[n]._doc,
            listEmployees: listEmployees
        }
    }
    return {
        totalList,
        listCourses
    }
}

/**
 * Thêm mới khoá đào tạo
 * @data : dữ liệu khoá đào tạo cần thêm
 * @company : id công ty 
 */
exports.createCourse = async (data, company) => {
    var isCourse = await Course.findOne({
        courseId: data.courseId,
        company: company
    }, {
        _id: 1
    });
    if (isCourse !== null) {
        return "have_exist"
    } else {
        var course = await Course.create({
            company: company,
            name: data.name,
            courseId: data.courseId,
            offeredBy: data.offeredBy,
            coursePlace: data.coursePlace,
            startDate: data.startDate,
            endDate: data.endDate,
            cost: {
                number: data.cost,
                unit: data.unit
            },
            lecturer: data.lecturer,
            type: data.type,
            educationProgram: data.educationProgram,
            employeeCommitmentTime: data.employeeCommitmentTime
        });
        // listEmployees
        // await EmployeeCourse.create

        return await Course.findById(course._id).populate({
            path: 'educationProgram',
            model: EducationProgram
        });
    }
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