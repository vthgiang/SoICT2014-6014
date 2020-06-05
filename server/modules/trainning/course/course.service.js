const {
    EducationProgram,
    Course,
    EmployeeCourse,
    Employee
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
        }).populate({
            path: 'employee',
            model:Employee,
            select: {'_id': 1, 'fullName': 1, 'employeeNumber': 1}
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
    }, {_id: 1});
    if (isCourse !== null) {
        return "have_exist"
    } else {
        let course = await Course.create({
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
        if(data.listEmployees.length !==0){
            data.listEmployees =data.listEmployees.map(x=> {return {course: course._id, employee: x._id, result: x.result}});
            await EmployeeCourse.insertMany([...data.listEmployees]);
        }
        let newCourse = await Course.findById(course._id).populate({
            path: 'educationProgram',
            model: EducationProgram
        });
        let listEmployees = await EmployeeCourse.find({
            course: newCourse._id
        }).populate({
            path: 'employee',
            model:Employee,
            select: {'_id': 1, 'fullName': 1, 'employeeNumber': 1}
        });
        return {...newCourse._doc, listEmployees}
    }
}

/**
 * Xoá khoá đào tạo
 * @id :id khoá đào tạo cần xoá
 */
exports.deleteCourse = async (id) => {
    let courseDelete = await Course.findOneAndDelete({
        _id: id
    });
    let listEmployees = await EmployeeCourse.deleteMany({
        course:id
    })
    return {...courseDelete._doc, listEmployees: listEmployees };
}

/**
 * Cập nhật thông tin khoá học
 * @id : id khoá đào tạo cần xoá
 * @data : dữ liệu chỉnh sửa khoá đào tạo
 */
exports.updateCourse = async (id, data) => {
    var courseChange = {
        name: data.name,
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
    };
    await Course.findOneAndUpdate({_id: id}, {$set: courseChange});
    await EmployeeCourse.deleteMany({course: id});
    if(data.listEmployees.length !==0){
        data.listEmployees = data.listEmployees.map(x=> {return {course: id, employee: x._id, result: x.result}});
        await EmployeeCourse.insertMany([...data.listEmployees]);
    }

    let updateCourse = await Course.findById(id).populate({
        path: 'educationProgram',
        model: EducationProgram
    });
    let listEmployees = await EmployeeCourse.find({
        course: id
    }).populate({
        path: 'employee',
        model:Employee,
        select: {'_id': 1, 'fullName': 1, 'employeeNumber': 1}
    });
    return {...updateCourse._doc, listEmployees}
}