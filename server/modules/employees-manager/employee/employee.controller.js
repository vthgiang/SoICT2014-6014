const EmployeeService = require('./employee.service');
const multer = require('multer');
const DIR = '../client/public/uploadAvatar';

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, Date.now() + '-' + fileName)
    }
});
const upload = multer({
    storage: multerStorage,
    fileFilter: (req, file, cb) => {
        cb(null, true);
    }
});

exports.uploadFile = upload.single("file");

exports.getInforFile = (req, res) => {
    res.status(200).json({
        message: "success",
        content: req.body
    });
}
// get all list employee
exports.get = async (req, res) => {
    try {
        var allEmployee = await EmployeeService.get(req.body);
        res.status(200).json({
            message: "success",
            content: {
                allEmployee
            }
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}

// get imformation employee by id
exports.getById = async (req, res) => {
    try {
        var inforEmployee = await EmployeeService.getById(req.params.id);
        res.status(200).json({
            message: "success",
            content: inforEmployee
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}

// create a new employee
exports.create = async (req, res) => {
    try {
        var data = await EmployeeService.create(req.body);
        res.status(200).json({
            message: "success",
            content: data
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}

// update information employee
exports.updateInformationEmployee = async (req, res) => {
    try {
        var data = await EmployeeService.updateById(req.params.id, req.body);
        res.status(200).json({
            message: "success",
            content: data
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}