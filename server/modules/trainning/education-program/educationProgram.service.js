
const { EducationProgram, Course, OrganizationalUnit, Role } = require('../../../models').schema;

/**
 * Lấy danh sách tất cả các chương trình đào tạo
 * @company : Id công ty
 */
exports.getAllEducationPrograms = async (company) => {
    return await EducationProgram.find({
        company: company
    })
}

/**
 * Lấy danh sách chương trinh đào tạo theo key
 * @data : Dữ liệu key tìm kiếm
 * @company : Id công ty
 */
exports.searchEducationPrograms = async (data, company) => {
    var keySearch = {
        company: company
    }
    // Bắt sựu kiện đơn vị tìm kiếm khác null
    if (data.organizationalUnit !== null) {
        keySearch = {
            ...keySearch,
            applyForOrganizationalUnits: {$in: data.organizationalUnit} 
        }
    }
    if (data.position !== null) {
        keySearch = {
            ...keySearch,
            applyForPositions: {$in: data.position}
        }
    }
    var totalList = await EducationProgram.count(keySearch);
    var educations = await EducationProgram.find(keySearch)
        .skip(data.page).limit(data.limit)
        .populate([{
            path: 'applyForOrganizationalUnits',
            model: OrganizationalUnit
        }, {
            path: 'applyForPositions',
            model: Role
        }]);
    var listEducations = []
    for (let n in educations) {
        let total = await Course.count({
            educationProgram: educations[n]._id
        });
        let listCourses = await Course.find({
            educationProgram: educations[n]._id
        }).skip(0).limit(5)
        listEducations[n] = {
            ...educations[n]._doc,
            listCourses: listCourses,
            totalList: total
        }
    }
    return {totalList, listEducations}
}

/**
 * Thêm mới chương trình đào tạo
 * @data : dữ liệu chương trình đào tạo cần thêm
 * @company : Id công ty
 */
exports.createEducationProgram = async (data, company) => {
    var isEducationProgram = await EducationProgram.find({programId: data.programId, company:company}, {_id:1});
    if(isEducationProgram !== null){
        return 'have_exist'
    } else{
        var createEducation = await EducationProgram.create({
            company: company,
            name: data.name,
            programId: data.programId,
            applyForOrganizationalUnits: data.organizationalUnit,
            applyForPositions: data.position,
        });
        return await EducationProgram.findById(createEducation._id).populate([{
            path: 'applyForOrganizationalUnits',
            model: OrganizationalUnit
        }, {
            path: 'applyForPositions',
            model: Role
        }])
    }
    
}

/**
 * Xoá chương trình đào tạo
 * @id : Id chương trình đào tạo cần xoá
 */
exports.deleteEducationProgram = async (id) => {
    var educationDelete = await EducationProgram.findOneAndDelete({
        _id: id
    });
    console.log(educationDelete);
    return educationDelete;
}

/**
 * Cập nhật thông tin chương trình đào tạo
 * @id : Id chương trình đào tạo cần chỉnh sửa
 * @data : dữ liệu chỉnh sửa chương trình đào tạo
 */
exports.updateEducationProgram = async (id, data) => {
    var eduacationChange = {
        name: data.name,
        programId: data.programId,
        applyForOrganizationalUnits: data.organizationalUnit,
        applyForPositions: data.position
    };
    await EducationProgram.findOneAndUpdate({
        _id: id
    }, {
        $set: eduacationChange
    });

    return await EducationProgram.findOne({
        _id: id
    }).populate([{
        path: 'applyForOrganizationalUnits',
        model: OrganizationalUnit
    }, {
        path: 'applyForPositions',
        model: Role
    }]);
}