const EmployeeService = require('./employee.service');
const multer = require('multer');
const DIR = '../client/public/lib/fileEmployee';

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

// upload file lên server
exports.uploadFile = upload.single("fileUpload");

// Lấy danh sách nhân viên
exports.get = async (req, res) => {
    try {
        var allEmployee = await EmployeeService.get(req.body, req.user.company._id);
        res.status(200).json({
            message: "success",
            content: allEmployee
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}

// Kiểm tra sự tồn tại của MSNV
exports.checkMSNV = async (req, res) => {
    try {
        var checkMSNV = await EmployeeService.checkMSNV(req.params.employeeNumber, req.user.company._id);
        res.status(200).json({
            message: "success",
            content: checkMSNV
        });
    } catch (error) {
        res.status(400).json({
            message: error,
        });
    }
}
// Kiểm tra sự tồn tại của email công ty
exports.checkEmail = async (req, res) => {
    try {
        var checkEmail = await EmployeeService.checkEmail(req.params.email);
        res.status(200).json({
            message: "success",
            content: checkEmail
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}

// get imformation employee by id
exports.getInforPersonal = async (req, res) => {
    try {
        var inforEmployee = await EmployeeService.getInforPersonal(req.params.email);
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

// Tạo nhân viên mới
exports.create = async (req, res) => {
    try {
        var data = await EmployeeService.create(req.body, req.user.company._id);
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

// Cập nhật thông tin cá nhân
exports.updateInforPersonal = async (req, res) => {
    try {
        var data = await EmployeeService.updateInforPersonal(req.params.email, req.body);
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

// Cập nhật thông tin nhân viên
exports.updateInfoEmployee = async (req, res) => {
    try {
        var data = await EmployeeService.updateInfoEmployee(req.params.id, req.body);
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

// Cập nhật avater nhân viên
exports.updateAvatar = async (req, res) => {
    try {
        var updateAvatar = await EmployeeService.updateAvatar(req.params.employeeNumber, req.file.filename, req.user.company._id);
        res.status(200).json({
            message: "success",
            content: updateAvatar
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}
// Cập nhật(thêm) thông tin hợp đồng lao động theo MSNV
exports.updateContract = async (req, res) => {
    try {
        var updateContract = await EmployeeService.updateContract(req.params.employeeNumber, req.body, req.file.filename, req.user.company._id);
        res.status(200).json({
            message: "success",
            content: updateContract
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}
// Cập nhật(thêm) thông tin bằng cấp theo MSNV
exports.updateCertificate = async (req, res) => {
    try {
        var updateCertificate = await EmployeeService.updateCertificate(req.params.employeeNumber, req.body, req.file.filename, req.user.company._id);
        res.status(200).json({
            message: "success",
            content: updateCertificate
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}

// Cập nhật(thêm) thông tin chứng chỉ theo MSNV
exports.updateCertificateShort = async (req, res) => {
    try {
        var updateCertificateShort = await EmployeeService.updateCertificateShort(req.params.employeeNumber, req.body, req.file.filename, req.user.company._id);
        res.status(200).json({
            message: "success",
            content: updateCertificateShort
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}

// Cập nhật(thêm) thông tin tài liệu đính kèm theo MSNV
exports.updateFile = async (req, res) => {
    try {
        var updateFile = await EmployeeService.updateFile(req.params.employeeNumber, req.body, req.file.filename, req.user.company._id);
        res.status(200).json({
            message: "success",
            content: updateFile
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}