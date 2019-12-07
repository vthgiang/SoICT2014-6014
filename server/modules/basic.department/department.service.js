const Department = require('../../models/department.model');

exports.get = async (req, res) => {

    //find department with id company
    return await Department.find({ company: req.body.company });
}

exports.getById = async (req, res) => {

    return await Department.findById(req.params.id);
}

exports.create = async(req, res) => {

    return await Department.create({
        name: req.body.name,
        description: req.body.description,
        company: req.body.company,
        dean: req.body.dean,
        vice_dean: req.body.vice_dean,
        employee: req.body.employee,
        parents: req.body.parents
    });
}

exports.edit = async(req, res) => {
    var department = await Department.findById(req.params.id);
    department.name = req.body.name;
    department.description = req.body.description;
    department.dean = req.body.dean;
    department.vice_dean = req.body.vice_dean;
    department.employee = req.body.employee;
    department.parents = req.body.parents;
    department.save();

    return department;
}

exports.delete = async(req, res) => {
    
    return await Department.deleteOne({ _id: req.params.id });
}