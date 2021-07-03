const {
    EducationProgram,
    Course
} = require(`../../../models`);

const {
    connect
} = require(`../../../helpers/dbHelper`);
const courseModel = require("../../../models/training/course.model");

const mongoose = require('mongoose')

/**
 * Lấy danh sách các khoá đào tạo theo phòng ban(đơn vị), chức vụ
 * @organizationalUnits : Array id đơn vị
 * @positions : Array id chức vụ    // Note: positions --> role ??
 * @company : Id công ty
 */
exports.getAllCourses = async (portal, company, organizationalUnits, positions) => {
    let keySearch = {
        company: company
    };
    if (organizationalUnits && organizationalUnits.length !== 0) {
        keySearch = {
            ...keySearch,
            applyForOrganizationalUnits: {
                $in: organizationalUnits
            },
        }
    }
    if (positions) {
        keySearch = {
            ...keySearch,
            applyForPositions: {
                $in: positions
            }
        }
    }
    let listEducations = await EducationProgram(connect(DB_CONNECTION, portal)).find(keySearch)

    listEducations = listEducations.map(x => {
        return x._id
    });

    let listCourses = await Course(connect(DB_CONNECTION, portal)).find({
        educationProgram: {
            $in: listEducations
        }
    })
    return {
        listCourses
    }
}


/**
 * Lấy danh sách khoá học theo key
 * @params : Dữ liệu key tìm kiếm
 * @company : Id công ty
 */
exports.searchCourses = async (portal, params, company) => {
    // Note: nên khai báo các biến params ở đầu
    const { educationProgram, courseId, name, type } = params
    let keySearch = {
        company: mongoose.Types.ObjectId(company)
    };

    // Bắt sựu kiện tên chương trình khoá đào tạo khác ""
    if (educationProgram) {    // Note: if (params?.educationProgram)
        keySearch = {
            ...keySearch,
            educationProgram: educationProgram
        }
    }

    // Bắt sựu kiện mã khoá đào tạo khác ""
    if (courseId?.length > 0) {    // Note: if (params?.courseId?.length > 0)
        keySearch = {
            ...keySearch,
            courseId: {
                $regex: courseId,
                $options: "i"
            }
        }
    }

    // Bắt sựu kiện tên khoá đào tạo khác ""
    if (name?.length > 0) {
        keySearch = {
            ...keySearch,
            name: {
                $regex: name,
                $options: "i"
            }
        }
    }

    // Bắt sựu kiện loại đào tạo khác null
    if (type) {
        keySearch = {
            ...keySearch,
            type: {
                $in: type
            }
        }
    }

    let totalList = await Course(connect(DB_CONNECTION, portal)).countDocuments(keySearch);

    // Note: Đoạn code này thử dùng aggregate, dùng aggregate 1 câu truy vấn, thay vì vòng for như bên dưới (keyword: aggregate addField)
    // let listCourses = await Course(connect(DB_CONNECTION, portal)).find(keySearch)
    //     .skip(params.page).limit(params.limit)  // Note: trường hợp API k có params page và limit, cần khai báo mặc định giá trị ban đầu
    //     .populate({
    //         path: 'educationProgram',
    //     });
    console.log(keySearch)
    let listCourses = await Course(connect(DB_CONNECTION, portal))
        .aggregate([
            {
                $match: keySearch
            },
            {
                $lookup: {
                    from: "educationprograms",
                    localField: "educationProgram",
                    foreignField: "_id",
                    as: "educationProgram"
                }
            },
            {
                $addFields: {
                    listEmployees: "$results.employee"
                }
            },
            {
                $lookup: {
                    from: 'employees',
                    localField: 'listEmployees',
                    foreignField: '_id',
                    as: 'listEmployees'
                }
            },
            {
                $skip: params.page 
            },
            {
                $limit: params.limit
            }
        ])

    console.log(listCourses)

    listCourses = listCourses.map(course => {
        const infoEmployees = course.listEmployees.map((employee, index) => {
            return {
                employee: {
                    _id: employee._id,
                    fullName: employee.fullName,
                    employeeNumber: employee.employeeNumber
                },
                result: course.results[index].result
            }
        })
        return {
            ...course,
            listEmployees: infoEmployees,
            educationProgram: course.educationProgram[0]
        }
    })

    return {
        totalList,
        listCourses
    }
}

/**
 * Thêm mới khoá đào tạo
 * @data : Dữ liệu khoá đào tạo cần thêm
 * @company : Id công ty 
 */
exports.createCourse = async (portal, data, company) => {
    let isCourse = await Course(connect(DB_CONNECTION, portal)).findOne({
        courseId: data.courseId,
        company: company
    }, {
        _id: 1
    });
    if (isCourse) { // Note: Sửa toàn bộ các chỗ khác, chỉ cần if (isCourse), k sử dụng !== null hay !== undefined
        return "have_exist" //  Note: sử dụng throw để catch lỗi, tham khảo service thêm tài sản
    } else {
        let course = await Course(connect(DB_CONNECTION, portal)).create({
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
        if (data.listEmployees.length !== 0) {
            data.listEmployees = data.listEmployees.map(x => {
                return {
                    course: course._id,
                    employee: x._id,
                    result: x.result
                }
            }); 
            data.listEmployees.map(async i => {
                await Course(connect(DB_CONNECTION, portal)).update(
                    { _id: i.course},
                    {
                        $push: {
                            results: {
                                employee: i.employee,
                                result: i.result
                            }
                        }
                    }
                )
            })
        }

        //  Note: có thể  gộp 2 câu truy vấn dưới thành 1, hạn chế sử dụng nhiều câu truy vấn
        let newCourse = await Course(connect(DB_CONNECTION, portal)).findById(course._id).populate({
            path: 'educationProgram',
        }).populate({
            path: 'results.employee',
            select: {
                '_id': 1,
                'fullName': 1,
                'employeeNumber': 1
            }
        });

        return {
            ...newCourse._doc,
            listEmployees: newCourse.results
        }
    }
}

/**
 * Xoá khoá đào tạo
 * @id : Id khoá đào tạo cần xoá
 */
exports.deleteCourse = async (portal, id) => {
    let courseDelete = await Course(connect(DB_CONNECTION, portal)).findOneAndDelete({
        _id: id
    });
    let listEmployees = courseDelete.results
    return {
        ...courseDelete._doc,
        listEmployees
    };
}

/**
 * Cập nhật thông tin khoá học
 * @id : Id khoá đào tạo cần xoá
 * @data : Dữ liệu chỉnh sửa khoá đào tạo
 */
exports.updateCourse = async (portal, id, data) => {
    let courseChange = {
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


    if (data.listEmployees.length !== 0) {
        const listEmployees = data.listEmployees.map(i => ({
            employee: i._id,
            result: i.result
        }))
        courseChange = {
            ...courseChange,
            listEmployees
        }
    }

    const updateCourse = await Course(connect(DB_CONNECTION, portal)).findOneAndUpdate({
        _id: id
    }, {
        $set: courseChange
    }, {
        new: true
    }).populate({
        path: 'results.employee',
        select: {
            '_id': 1,
            'fullName': 1,
            'employeeNumber': 1
        }
    }).lean();
    
    return {
        ...updateCourse,
        listEmployees: updateCourse.results
    }
}