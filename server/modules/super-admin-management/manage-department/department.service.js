const Department = require('../../../models/department.model');

const arrayToTree = require('array-to-tree');

exports.get = async (id) => {

    return await Department.find({ company: id });
}

exports.getTree = async (id) => {
    var data = await Department.find({ company: id });
    var newData = data.map( department => {
        return {
            id: department._id.toString(),
            name: department.name,
            parent_id: department.parent.toString()
        }
    })
    var tree = await arrayToTree(newData);

    return tree;
}

exports.getById = async (req, res) => {

    return await Department.findById(req.params.id);
}

exports.create = async(data, deanId, vice_deanId, employeeId) => {

    return await Department.create({
        name: data.name,
        description: data.description,
        company: data.company,
        dean: deanId,
        vice_dean: vice_deanId,
        employee: employeeId,
        parent: data.parent
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