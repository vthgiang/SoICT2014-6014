const biddingPackageService = require('./biddingPackage.service');
const UserService = require(`../../super-admin/user/user.service`);
const NotificationServices = require(`../../notification/notification.service`);
const EmployeeService = require('../profile/profile.service');

const {
    sendEmail
} = require(`../../../helpers/emailHelper`);

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
        // await Log.error(req.user.email, 'EDIT_BIDDING_PACKAGE', req.portal);
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
    // try {
        data = await biddingPackageService.deleteBiddingPackage(req.portal, req.body, req.params);
        // await Log.info(req.user.email, 'DELETE_FIELD', req.portal);
        res.status(200).json({
            success: true,
            messages: ["delete_bidding_package_success"],
            content: data
        });
    // } catch (error) {
    //     // await Log.error(req.user.email, 'DELETE_FIELD', req.portal);
    //     res.status(400).json({
    //         success: false,
    //         messages: ["delete_field_failure"],
    //         content: {
    //             error: error
    //         }
    //     });
    // }
}
