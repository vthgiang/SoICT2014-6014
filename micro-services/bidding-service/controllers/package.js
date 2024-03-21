const biddingPackageService = require('../services').PACKAGE;
const CompanyServices = require('../services').COMPANY;
const fs = require('fs');
const Logger = require('../logs');
const archiver = require('archiver');
const exec = require('child_process').exec;

/** Lấy danh sách gói thầu */
exports.searchBiddingPackage = async (req, res) => {
    try {
        let data = {};

        let params = {
            name: req.query.name,
            code: req.query.code,
            page: Number(req.query.page) ? Number(req.query.page) : 0,
            limit: Number(req.query.limit),
            status: req.query.status,
            type: req.query.type,
            startDate: req.query.startDateSearch,
            endDate: req.query.endDateSearch,
        };
        data = await biddingPackageService.searchBiddingPackage(
            req.portal,
            params,
            req.user.company._id
        );
        await Logger.info(req.user.email, 'GET_BIDDING_PACKAGE', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_bidding_package_success'],
            content: data,
        });
    } catch (error) {
        await Logger.error(req.user.email, 'GET_BIDDING_PACKAGE', req.portal);
        res.status(400).json({
            success: false,
            messages: ['get_bidding_package_failure'],
            content: {
                error: error,
            },
        });
    }
};

/** Lấy danh sách gói thầu */
exports.getDetailBiddingPackage = async (req, res) => {
    try {
        let data = await biddingPackageService.getDetailBiddingPackage(
            req.portal,
            req.params,
            req.user.company._id
        );
        await Logger.info(
            req.user.email,
            'GET_DETAIL_BIDDING_PACKAGE',
            req.portal
        );
        res.status(200).json({
            success: true,
            messages: ['get_detail_success'],
            content: data,
        });
    } catch (error) {
        await Logger.error(
            req.user.email,
            'GET_DETAIL_BIDDING_PACKAGE',
            req.portal
        );
        res.status(400).json({
            success: false,
            messages: ['get_detail_failure'],
            content: {
                error: error,
            },
        });
    }
};

/** Lấy danh sách gói thầu */
exports.getDetailBiddingPackageToEdit = async (req, res) => {
    try {
        let data = await biddingPackageService.getDetailBiddingPackageToEdit(
            req.portal,
            req.params,
            req.user.company._id
        );
        await Logger.info(
            req.user.email,
            'GET_DETAIL_BIDDING_PACKAGE',
            req.portal
        );
        res.status(200).json({
            success: true,
            messages: ['get_detail_success'],
            content: data,
        });
    } catch (error) {
        await Logger.error(
            req.user.email,
            'GET_DETAIL_BIDDING_PACKAGE',
            req.portal
        );
        res.status(400).json({
            success: false,
            messages: ['get_detail_failure'],
            content: {
                error: error,
            },
        });
    }
};

// =================CREATE====================

/** Tạo mới gói thầu */
exports.createNewBiddingPackage = async (req, res) => {
    try {
        let data = await biddingPackageService.createNewBiddingPackage(
            req.portal,
            req.body,
            req.user.company._id
        );
        await Logger.info(req.user.email, 'CREATE_BIDDING_PACKAGE', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_bidding_package_success'],
            content: data,
        });
    } catch (error) {
        await Logger.error(req.user.email, 'CREATE_BIDDING_PACKAGE', req.portal);
        res.status(400).json({
            success: false,
            messages: ['create_bidding_package_failure'],
            content: {
                error: error,
            },
        });
    }
};

// ================EDIT===================

/** Chỉnh sửa gói thầu */
exports.editBiddingPackage = async (req, res) => {
    try {
        let data = await biddingPackageService.editBiddingPackage(
            req.portal,
            req.body,
            req.params,
            req.user.company._id
        );
        await Logger.info(req.user.email, 'EDIT_BIDDING_PACKAGE', req.portal);
        res.status(200).json({
            success: true,
            messages: ['update_bidding_package_success'],
            content: data,
        });
    } catch (error) {
        console.log(error);
        await Logger.error(req.user.email, 'EDIT_BIDDING_PACKAGE', req.portal);
        res.status(400).json({
            success: false,
            messages: ['update_bidding_package_failure'],
            content: {
                error: error,
            },
        });
    }
};

// ====================DELETE=======================

/** Xóa gói thầu */
exports.deleteBiddingPackage = async (req, res) => {
    try {
        let data = await biddingPackageService.deleteBiddingPackage(
            req.portal,
            req.params.id,
            req.user.company._id
        );
        await Logger.info(req.user.email, 'DELETE_BIDDING_PACKGAGE', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_bidding_package_success'],
            content: data,
        });
    } catch (error) {
        await Logger.error(req.user.email, 'DELETE_BIDDING_PACKGAGE', req.portal);
        res.status(400).json({
            success: false,
            messages: ['delete_bidding_package_failure'],
            content: {
                error: error,
            },
        });
    }
};

exports.autoUpdateEmployeeBiddingStatus = async () => {
    let companys = await CompanyServices.getAllCompanies({
        page: undefined,
        limit: undefined,
    });
    companys = companys.map((x) => x.shortName);
    for (let n in companys) {
        await biddingPackageService.autoUpdateEmployeeBiddingStatus(
            companys[n]
        );
    }
};

exports.getBiddingPackageDocument = async (req, res) => {
    try {
        const rootPath = await biddingPackageService.getBiddingPackageDocument(
            req.params.id,
            req.portal
        );
        await Logger.info(
            req.user.email,
            'download_all_file_of_document_success',
            req.portal
        );
        if (rootPath) {
            const output = fs.createWriteStream(rootPath + '/document.zip');
            const archive = archiver('zip');

            archive.pipe(output);
            archive.directory(rootPath + '/document', false);
            archive.on('error', (err) => {
                throw err;
            });
            archive.on('end', function () {
                setTimeout(() => {
                    console.log('gửi file');
                    res.download(rootPath + '/document.zip');
                    // xong rồi xóa thư mục đi
                    console.log('xóa file');
                    if (
                        fs.existsSync(
                            // eslint-disable-next-line no-undef
                            `${SERVER_BACKUP_DIR}/${req.portal}/document`
                        )
                    ) {
                        exec(
                            // eslint-disable-next-line no-undef
                            `rm -rf ${SERVER_BACKUP_DIR}/${req.portal}/document`,
                            function (err) {
                                console.log('er', err);
                            }
                        );
                    }
                }, 3000);
            });
            archive.finalize('close');
        }
    } catch (error) {
        console.log('error', error);
        await Logger.error(
            req.user.email,
            'download_all_file_of_document_faile',
            req.portal
        );
        res.status(400).json({
            success: false,
            messages: Array.isArray(error)
                ? error
                : ['download_all_file_of_document_faile'],
            content: error,
        });
    }
};

/** đề xuất bán tự động cho gói thầu */
exports.proposalForBiddingPackage = async (req, res) => {
    try {
        let data = await biddingPackageService.proposalForBiddingPackage(
            req.portal,
            req.body,
            req.params,
            req.user.company._id
        );
        await Logger.info(req.user.email, 'PROPOSE_BIDDING_PACKAGE', req.portal);
        res.status(200).json({
            success: true,
            messages: ['propose_bidding_package_success'],
            content: data,
        });
    } catch (error) {
        console.log(error);
        await Logger.error(req.user.email, 'PROPOSE_BIDDING_PACKAGE', req.portal);
        res.status(400).json({
            success: false,
            messages: ['propose_bidding_package_failure'],
            content: {
                error: error,
            },
        });
    }
};
