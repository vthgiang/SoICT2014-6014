const biddingPackageService = require('./biddingPackage.service');
const CompanyServices = require(`../../system-admin/company/company.service`);

const Log = require(`../../../logs`);

/** Lấy danh sách vị trí công việc */
exports.searchBiddingPackage = async (req, res) => {
    try {
        let data = {};

        let params = {
            name: req.query.name,
            page: Number(req.query.page) ? Number(req.query.page) : 1,
            limit: Number(req.query.limit),
        }
        data = await biddingPackageService.searchBiddingPackage(req.portal, params);
        await Log.info(req.user.email, 'GET_BIDDING_PACKAGE', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_bidding_package_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'GET_BIDDING_PACKAGE', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_bidding_package_failure"],
            content: {
                error: error
            }
        });
    }
}

/** Lấy danh sách vị trí công việc */
exports.getDetailBiddingPackage = async (req, res) => {
    try {
        data = await biddingPackageService.getDetailBiddingPackage(req.portal, req.params);
        await Log.info(req.user.email, 'GET_DETAIL_BIDDING_PACKAGE', req.portal);
        res.status(200).json({
            success: true,
            messages: ["get_detail_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'GET_DETAIL_BIDDING_PACKAGE', req.portal);
        res.status(400).json({
            success: false,
            messages: ["get_detail_failure"],
            content: {
                error: error
            }
        });
    }
}

// =================CREATE====================

/** Tạo mới vị trí công việc */
exports.createNewBiddingPackage = async (req, res) => {
    try {
        data = await biddingPackageService.createNewBiddingPackage(req.portal, req.body);
        await Log.info(req.user.email, 'CREATE_BIDDING_PACKAGE', req.portal);
        res.status(200).json({
            success: true,
            messages: ["create_bidding_package_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'CREATE_BIDDING_PACKAGE', req.portal);
        res.status(400).json({
            success: false,
            messages: ["create_bidding_package_failure"],
            content: {
                error: error
            }
        });
    }
}

// ================EDIT===================

/** Chỉnh sửa vị trí công việc */
exports.editBiddingPackage = async (req, res) => {
    try {
        data = await biddingPackageService.editBiddingPackage(req.portal, req.body, req.params);
        await Log.info(req.user.email, 'EDIT_BIDDING_PACKAGE', req.portal);
        res.status(200).json({
            success: true,
            messages: ["update_bidding_package_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'EDIT_BIDDING_PACKAGE', req.portal);
        res.status(400).json({
            success: false,
            messages: ["update_bidding_package_failure"],
            content: {
                error: error
            }
        });
    }
}

// ====================DELETE=======================

/** Xóa vị trí công việc */
exports.deleteBiddingPackage = async (req, res) => {
    try {
        data = await biddingPackageService.deleteBiddingPackage(req.portal, req.params.id);
        await Log.info(req.user.email, 'DELETE_BIDDING_PACKGAGE', req.portal);
        res.status(200).json({
            success: true,
            messages: ["delete_bidding_package_success"],
            content: data
        });
    } catch (error) {
        await Log.error(req.user.email, 'DELETE_BIDDING_PACKGAGE', req.portal);
        res.status(400).json({
            success: false,
            messages: ["delete_bidding_package_failure"],
            content: {
                error: error
            }
        });
    }
}

exports.autoUpdateEmployeeBiddingStatus= async () => {
    let companys = await CompanyServices.getAllCompanies({
        page: undefined,
        limit: undefined
    });
    companys = companys.map(x => x.shortName);
    for (let n in companys) {
        await EmployeeService.autoUpdateEmployeeBiddingStatus(companys[n]);
    }
}