const CertificateService = require('./certificate.service');
// const UserService = require(`${SERVER_MODULES_DIR}/super-admin/user/user.service`);
// const NotificationServices = require(`${SERVER_MODULES_DIR}/notification/notification.service`);
// const EmployeeService = require('../profile/profile.service');

// const { sendEmail } = require(`${SERVER_HELPERS_DIR}/emailHelper`);

const Log = require(`${SERVER_LOGS_DIR}`);

/** Lấy danh sách chứng chỉ */
exports.searchCertificate = async (req, res) => {
    try {
        let data = {};

        let params = {
            certificateName: req.query.name,
            page: Number(req.query.page),
            limit: Number(req.query.limit),
        };
        data = await CertificateService.searchCertificate(req.portal, params);

        await Log.info(req.user.email, 'GET_CERTIFICATE', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_certificate_success'],
            content: data,
        });
    } catch (error) {
        await Log.error(req.user.email, 'GET_CERTIFICATE', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_certificate_faile'],
            content: {
                error: error,
            },
        });
    }
};

/** Tạo mới chứng chỉ */
exports.createNewCertificate = async (req, res) => {
    try {
        data = await CertificateService.createNewCertificate(req.portal, req.body, req.user.company._id);
        await Log.info(req.user.email, 'GET_CERTIFICATE', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_certificate_success'],
            content: data,
        });
    } catch (error) {
        await Log.error(req.user.email, 'GET_CERTIFICATE', req.portal);
        res.status(400).json({
            success: false,
            messages: ['create_certificate_faile'],
            content: {
                error: error,
            },
        });
    }
};

/** Chỉnh sửa chuyên ngành */
exports.editCertificate = async (req, res) => {
    try {
        data = await CertificateService.updateCertificate(req.portal, req.body, req.params.id, req.user.company._id);
        await Log.info(req.user.email, 'EDIT_CERTIFICATE', req.portal);
        res.status(200).json({
            success: true,
            messages: ['edit_certificate_success'],
            content: data,
        });
    } catch (error) {
        await Log.error(req.user.email, 'EDIT_CERTIFICATE', req.portal);
        res.status(400).json({
            success: false,
            messages: ['edit_certificate_failure'],
            content: {
                error: error,
            },
        });
    }
};

// ====================DELETE=======================

/** Xóa chuyên ngành */
exports.deleteCertificate = async (req, res) => {
    try {
        data = await CertificateService.deleteCertificate(req.portal, req.params.id);
        await Log.info(req.user.email, 'DELETE_CERTIFICATE', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_certificate_success'],
            content: data,
        });
    } catch (error) {
        await Log.error(req.user.email, 'DELETE_CERTIFICATE', req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_certificate_failure'],
            content: {
                error: error,
            },
        });
    }
};
