const EmployeeService = require('./profile.service');
const {LogInfo, LogError} = require('../../../logs');

const multer = require('multer');
const DIRAVATAR = '../client/public/fileupload/employee-manage/avatar';
const DIRCONTRACT = '../client/public/fileupload/employee-manage/contract';
const DIRCERTIFICATE = '../client/public/fileupload/employee-manage/certificate';
const DIRCERTIFICATESHORT = '../client/public/fileupload/employee-manage/certificateshort';
const DIRFILE = '../client/public/fileupload/employee-manage/file';


/*********************************************
 *  upload file tài liệu đính kèm 
******************************************** */
const multerStorageFile = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIRFILE);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, Date.now() + '-' + fileName)
    }
});
const uploadFile = multer({
    storage: multerStorageFile,
    fileFilter: (req, file, cb) => {cb(null, true);}
});
exports.uploadFile = uploadFile.single("fileUpload");

/*********************************************
 *  upload file hợp đồng lao động
******************************************** */
const multerStorageContract = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIRCONTRACT);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, Date.now() + '-' + fileName)
    }
});
const uploadContract = multer({
    storage: multerStorageContract,
    fileFilter: (req, file, cb) => {cb(null, true);}
});
exports.uploadContract = uploadContract.single("fileUpload");

/*********************************************
 *  upload file bằng cấp
******************************************** */
const multerStorageCertificate = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIRCERTIFICATE);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, Date.now() + '-' + fileName)
    }
});
const uploadCertificate = multer({
    storage: multerStorageCertificate,
    fileFilter: (req, file, cb) => {cb(null, true);}
});
exports.uploadCertificate = uploadCertificate.single("fileUpload");

/*********************************************
 *  upload tài liệu chứng chỉ
******************************************** */
const multerStorageCertificateshort = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIRCERTIFICATESHORT);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, Date.now() + '-' + fileName)
    }
});
const uploadCertificateshort = multer({
    storage: multerStorageCertificateshort,
    fileFilter: (req, file, cb) => {cb(null, true);}
});
exports.uploadCertificateshort = uploadCertificateshort.single("fileUpload");

/*********************************************
 *  upload Avatar
******************************************** */
const multerStorageAvatar = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIRAVATAR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, Date.now() + '-' + fileName)
    }
});
const uploadAvatar = multer({
    storage: multerStorageAvatar,
    fileFilter: (req, file, cb) => {cb(null, true);}
});
exports.uploadAvatar = uploadAvatar.single("fileUpload");

/**
 * Lấy thông tin cá nhân theo emailCompany
 */ 
exports.getEmployeeProfile = async (req, res) => {
    try {
        var inforEmployee = await EmployeeService.getEmployeeProfile(req.params.email);
        await LogInfo(req.user.email, 'GET_INFOR_PERSONAL', req.user.company);
        res.status(200).json({ success: true, messages: ["get_infor_personal_success"], content: inforEmployee });
    } catch (error) {
        await LogError(req.user.email, 'GET_INFOR_PERSONAL', req.user.company);
        res.status(400).json({ success: false, messages: ["get_infor_personal_false"], content: {error: error} });
    }
}

/**
 * Cập nhật thông tin cá nhân
 */
exports.updateEmployeeInformation = async (req, res) => {
    try {
        var data = await EmployeeService.updateEmployeeInformation(req.params.email, req.body);
        await LogInfo(req.user.email, 'EDIT_INFOR_PERSONAL', req.user.company);
        res.status(200).json({ success: true, messages: ["edit_infor_personal_success"], content: data });
    } catch (error) {
        await LogError(req.user.email, 'EDIT_INFOR_PERSONAL', req.user.company);
        res.status(400).json({ success: false, messages: ["edit_infor_personal_false"], content: {error: error} });
    }
}

/**
 * Lấy danh sách nhân viên
 */ 
exports.searchEmployeeProfiles = async (req, res) => {
    try {
        var allEmployees = await EmployeeService.searchEmployeeProfiles(req.body, req.user.company._id);
        await LogInfo(req.user.email, 'GET_EMPLOYEE', req.user.company);
        res.status(200).json({ success: true, messages: ["get_employee_success"], content: allEmployees });
    } catch (error) {
        await LogError(req.user.email, 'GET_EMPLOYEE', req.user.company);
        res.status(400).json({ success: false, messages: ["get_employee_false"], content: {error: error} });
    }
}

// Kiểm tra sự tồn tại của MSNV
exports.checkEmployeeExisted = async (req, res) => {
    try {
        var checkMSNV = await EmployeeService.checkEmployeeExisted(req.params.employeeNumber, req.user.company._id);
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
exports.checkEmployeeCompanyEmailExisted = async (req, res) => {
    try {
        var checkEmail = await EmployeeService.checkEmployeeCompanyEmailExisted(req.params.email);
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



// Tạo nhân viên mới
exports.createEmployee = async (req, res) => {
    try {
        var data = await EmployeeService.createEmployee(req.body, req.user.company._id);
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
exports.updateEmployeeInformation = async (req, res) => {
    try {
        var data = await EmployeeService.updateEmployeeInformation(req.params.id, req.body);
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
exports.updateEmployeeAvatar = async (req, res) => {
    try {
        var updateAvatar = await EmployeeService.updateEmployeeAvatar(req.params.employeeNumber, req.file.filename, req.user.company._id);
        await LogInfo(req.user.email, 'UPDATE_AVATAR', req.user.company);
        res.status(200).json({ success: true, message: ["update_avatar_success"], content: updateAvatar });
    } catch (error) {
        await LogError(req.user.email, 'EDIT_INFOR_PERSONAL', req.user.company);
        res.status(400).json({ success: false, message: ["update_avatar_faile"], content: {error: error} });
    }
}
// Cập nhật(thêm) thông tin hợp đồng lao động theo MSNV
exports.updateEmployeeContract = async (req, res) => {
    try {
        var updateContract = await EmployeeService.updateEmployeeContract(req.params.employeeNumber, req.body, req.file.filename, req.user.company._id);
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
        var updateCertificate = await EmployeeService.updateEmployeeDegrees(req.params.employeeNumber, req.body, req.file.filename, req.user.company._id);
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
exports.updateEmployeeCertificates = async (req, res) => {
    try {
        var updateCertificateShort = await EmployeeService.updateEmployeeCertificates(req.params.employeeNumber, req.body, req.file.filename, req.user.company._id);
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

// delete thông tin nhân viên
exports.deleteEmployee = async (req, res) => {
    try {
        var infoEmployeeDelete = await EmployeeService.deleteEmployee(req.params.id);
        res.status(200).json({
            message: "success",
            content: infoEmployeeDelete
        });
    } catch (error) {
        res.status(400).json({
            message: error
        });
    }
}

// Kiểm tra sự tồn tại của MSNV trong array
exports.checkEmployeesExisted = async (req, res) => {
    try {
        var checkArrayMSNV = await EmployeeService.checkEmployeesExisted(req.body, req.user.company._id);
        res.status(200).json({
            message: "success",
            content: checkArrayMSNV
        });
    } catch (error) {
        res.status(400).json({
            message: error,
        });
    }
}

