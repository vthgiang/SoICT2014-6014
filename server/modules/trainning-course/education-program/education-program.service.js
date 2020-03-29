const EducationProgram = require('../../../models/educationProgram.model');
const Department = require('../../../models/department.model');
const Role = require('../../../models/role.model')
//get list educationProgram
exports.get = async (data, company) => {
    var keySearch = {
        company: company
    }
    // Bắt sựu kiện đơn vị tìm kiếm khác All 
    if(data.department!=="All"){
        keySearch={
            ...keySearch,
            unitEducation:data.department
        }
    }
    if(data.position!=="All"){
        keySearch={
            ...keySearch,
            positionEducation:data.position
        }
    }
    var totalList = await EducationProgram.count(keySearch);
    var allList = await EducationProgram.find(keySearch)
        .skip(data.page).limit(data.limit)
        .populate([{
            path: 'unitEducation',
            model: Department
        }, {
            path: 'positionEducation',
            model: Role
        }]);
    var content ={
        totalList,
        allList
    }
    return content;
}

// add a new educationProgram
exports.create = async (data, company) => {
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
exports.delete = async (id) => {
    console.log(id);
    var educationDelete = await EducationProgram.findOneAndDelete({
        _id: id
    });
    return educationDelete;
}

// Update educationProgram
exports.update = async (id, data) => {
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