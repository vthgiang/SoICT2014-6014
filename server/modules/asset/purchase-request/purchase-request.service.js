const Models = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const { freshObject } = require(`../../../helpers/functionHelper`);
const { RecommendProcure, User, Link, Privilege, UserRole } = Models;
const { freshArray } = require("../../../helpers/functionHelper");

/**
 * Lấy danh sách phiếu đề nghị mua sắm thiết bị
 */
exports.searchPurchaseRequests = async (portal, company, query) => {
    const {
        recommendNumber,
        approver,
        proponent,
        proposalDate,
        status,
        page,
        limit,
        month
    } = query; // tại sao check theo tháng mà lại ko khai báo month

    var keySearch = {};

    // Bắt sựu kiện mã phiếu tìm kiếm khác ""
    if (recommendNumber) {
        keySearch = {
            ...keySearch,
            recommendNumber: { $regex: recommendNumber, $options: "i" },
        };
    }

    //Bắt sựu kiện tháng tìm kiếm khác ""
    if (proposalDate) {
        // Convert lại do bên client gửi dữ liệu month dạng month-year
        let date = proposalDate.split("-"); 0
        let start = new Date(date[1], date[0] - 1, 1); //ngày cuối cùng của tháng trước
        let end = new Date(date[1], date[0], 1); // ngày cuối cùng của tháng

        keySearch = {
            ...keySearch,
            dateCreate: {
                $gt: start,
                $lte: end,
            },
        };
    }

    if (month) {
        // Convert lại do bên client gửi dữ liệu month dạng month-year
        let date = month.split("-"); 0
        let start = new Date(date[1], date[0] - 1, 1); //ngày cuối cùng của tháng trước
        let end = new Date(date[1], date[0], 1); // ngày cuối cùng của tháng

        keySearch = {
            ...keySearch,
            dateCreate: {
                $gt: start,
                $lte: end,
            },
        };
    }

    // Thêm người đề nghị vào trường tìm kiếm
    if (proponent) {
        let user = await User(connect(DB_CONNECTION, portal))
            .find({
                $or: [
                    { email: { $regex: proponent, $options: "i" } },
                    { name: { $regex: proponent, $options: "i" } }
                ]
            })
            .select("_id");
        let userIds = [];
        user.map((x) => {
            userIds.push(x._id);
        });
        keySearch = { ...keySearch, proponent: { $in: userIds } };
    }

    // Thêm người phê duyệt vào trường tìm kiếm
    if (approver) {
        let user = await User(connect(DB_CONNECTION, portal))
            .find({
                $or: [
                    { email: { $regex: approver, $options: "i" } },
                    { name: { $regex: approver, $options: "i" } }
                ]
            })
            .select("_id");
        let userIds = [];
        user.map((x) => {
            userIds.push(x._id);
        });
        keySearch = { ...keySearch, approver: { $in: userIds } };
    }

    // Thêm key tìm kiếm phiếu theo trạng thái vào keySearch
    if (status) {
        keySearch = { ...keySearch, status: { $in: status } };
    }

    var totalList = await RecommendProcure(
        connect(DB_CONNECTION, portal)
    )
        .countDocuments(keySearch);

    var listRecommendProcures = await RecommendProcure(
        connect(DB_CONNECTION, portal)
    )
        .find(keySearch)
        .populate([
            {path: "recommendUnits" },
            {path: "proponent approver", select: "_id name email avatar"}
        ])
        .sort({ createdAt: "desc" })
        .skip(page ? parseInt(page) : 0)
        .limit(limit ? parseInt(limit) : 0);
    
    console.log("total List phake", totalList)
    return { totalList, listRecommendProcures };
};

exports.searchUserApprover = async (portal, company) => {
    let manager, roleIds = [], userRolesIds = [];
    let link = await Link(connect(DB_CONNECTION, portal)).find({ url: "/manage-asset-purchase-request" });
    if (link.length) {
        privilege = await Privilege(connect(DB_CONNECTION, portal)).find({ resourceId: link[0]._id });
        if (privilege.length) {
            for (let i in privilege) {
                roleIds.push(privilege[i].roleId);
            }
            userRoles = await UserRole(connect(DB_CONNECTION, portal)).find({ roleId: { $in: roleIds } })
            if (userRoles.length) {
                for (let i in userRoles) {
                    userRolesIds.push(userRoles[i].userId)
                }
                manager = await User(connect(DB_CONNECTION, portal)).find({ _id: { $in: userRolesIds } }).select("name email");
            }
        }
    }

    return manager;
};
/**
 * Gửi email khi đăng ký sử dụng tài sản
 * @param {*} portal id công ty
 */
exports.sendEmailToManager = async (portal, equipmentName, approver, userId, type) => {
    let idManager = [], privilege, roleIds = [], userRoles, email = [];
    if (approver !== "undefined" && approver !== "" && approver) {
        for (let i in approver) {
            idManager.push(approver[i]);
        }
    }

    let link = await Link(connect(DB_CONNECTION, portal)).find({ url: "/manage-info-asset" });
    if (link.length) {
        privilege = await Privilege(connect(DB_CONNECTION, portal)).find({ resourceId: link[0]._id });
        if (privilege.length) {
            for (let i in privilege) {
                roleIds.push(privilege[i].roleId);
            }
            userRoles = await UserRole(connect(DB_CONNECTION, portal)).find({ roleId: { $in: roleIds } })
            if (userRoles.length) {
                for (let j in userRoles) {
                    let check = true;
                    for (let i in approver) {
                        if (userRoles[j].userId == approver[i]) {
                            check = false;
                            break;
                        }
                    }
                    if (check) {
                        idManager.push(userRoles[j].userId);
                    }
                }
            }
        }
    }

    let manager = await User(connect(DB_CONNECTION, portal)).find({ _id: { $in: idManager } });
    let currentUser = await User(connect(DB_CONNECTION, portal)).findById(
        userId
    );
    if (manager.length) {
        for (i in manager) {
            email.push(manager.email)
        }
    }

    let body = `<p>Mô tả : ${currentUser.name} đã ${type}   </p>`;
    let html = `<p>Bạn có thông báo mới: ` + body;
    return {
        equipmentName: equipmentName,
        manager: idManager,
        user: currentUser,
        email: email,
        html: html,
    };
};

exports.getUrl = (destination, filename) => {
    let url = `${destination}/${filename}`;
    return url.substr(1, url.length);
}
/**
 * Thêm mới thông tin phiếu đề nghị mua sắm thiết bị
 * @data: dữ liệu phiếu đề nghị mua sắm thiết bị
 */
exports.createPurchaseRequest = async (portal, company, data, files) => {
    const checkPur = await RecommendProcure(
        connect(DB_CONNECTION, portal)
    ).findOne({ recommendNumber: data.recommendNumber });
    if (checkPur) throw ["recommend_number_exist"];
    data = freshObject(data);

    if (files) {
        filesConvert = files.map(obj => ({
            fileName: obj.originalname,
            url: this.getUrl(obj.destination, obj.filename),
        }))
    }
    var createRecommendProcure = await RecommendProcure(
        connect(DB_CONNECTION, portal)
    ).create({
        company: company,
        recommendNumber: data.recommendNumber,
        dateCreate: data.dateCreate,
        proponent: data.proponent, // Người đề nghị
        equipmentName: data.equipmentName,
        equipmentDescription: data.equipmentDescription,
        supplier: data.supplier,
        approver: data.approver, // Người phê duyệt
        total: data.total,
        unit: data.unit,
        estimatePrice: data.estimatePrice,
        note: data.note,
        status: data.status,
        files: filesConvert,
        recommendUnits: data.recommendUnits,
    });

    if (createRecommendProcure) {
        let type = "đăng ký mua sắm thiết bị" + " " + data.equipmentName + " " + "số lượng" + " " + data.total + " " + data.unit;
        var mail = await this.sendEmailToManager(
            portal,
            data.equipmentName,
            data.approver,
            data.proponent,
            type
        );
        return {
            createRecommendProcure: createRecommendProcure,
            manager: mail.manager,
            user: mail.user,
            email: mail.email,
            html: mail.html,
            equipmentName: mail.equipmentName
        };
    }
    return createRecommendProcure;
};

/**
 * Xoá thông tin phiếu đề nghị mua sắm thiết bị
 * @id: id phiếu đề nghị mua sắm thiết bị muốn xoá
 */
exports.deletePurchaseRequest = async (portal, id) => {
    return await RecommendProcure(
        connect(DB_CONNECTION, portal)
    ).findOneAndDelete({
        _id: id,
    });
};

/**
 * Update thông tin phiếu đề nghị mua sắm thiết bị
 * @id: id phiếu đề nghị mua sắm thiết bị muốn update
 */
exports.updatePurchaseRequest = async (portal, id, data, files, userId) => {
    let filesConvert = [];
    if (files) {
        filesConvert = files.map(obj => ({
            fileName: obj.originalname,
            url: this.getUrl(obj.destination, obj.filename),
        }))
    }
    if (data.oldFiles && filesConvert) {
        filesConvert = [...data.oldFiles, ...filesConvert]
    }

    let recommendProcureChange = {
        recommendNumber: data.recommendNumber,
        dateCreate: data.dateCreate,
        proponent: data.proponent._id, // Người đề nghị
        equipmentName: data.equipmentName,
        equipmentDescription: data.equipmentDescription,
        supplier: data.supplier,
        approver: data.approver, // Người phê duyệt
        total: data.total,
        unit: data.unit,
        estimatePrice: data.estimatePrice,
        note: data.note,
        status: data.status,
        recommendUnits: data.recommendUnits,
        files: filesConvert,
    };

    recommendProcureChange = freshObject(recommendProcureChange)
    // Cập nhật thông tin phiếu đề nghị mua sắm thiết bị vào database

    const recommendProcure = await RecommendProcure(connect(DB_CONNECTION, portal)).findByIdAndUpdate(
        id,
        {
            $set: recommendProcureChange,
        }, { new: true }
    );

    if (recommendProcure) {
        let type = "sửa đăng ký mua sắm thiết bị" + " " + data.equipmentName;
        var mail = await this.sendEmailToManager(
            portal,
            data.equipmentName,
            data.approver,
            userId,
            type
        );
        return {
            recommendProcure: recommendProcure,
            manager: mail.manager,
            user: mail.user,
            email: mail.email,
            html: mail.html,
            equipmentName: mail.equipmentName
        };
    }
    return recommendProcure;
};
