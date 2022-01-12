const Models = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const { RecommendDistribute, User, Asset, Link, Privilege, UserRole } = Models;
const mongoose = require("mongoose");


/**
 * Gửi email khi đăng ký sử dụng tài sản
 * @param {*} portal id công ty
 */
exports.sendEmailToManager = async (portal, asset, userId, type) => {
    let idManager = [], privilege, roleIds = [], userRoles, email = [];

    idManager.push(asset.managedBy);
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
                    if (userRoles[j].userId != asset.managedBy) {
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

    let body = `<p>Mô tả : ${currentUser.name} đã ${type} tài sản mã ${asset.code}  </p>`;
    let html = `<p>Bạn có thông báo mới: ` + body;

    return {
        asset: asset,
        manager: idManager,
        user: currentUser,
        email: email,
        html: html,
    };
};
/**
 * Lấy danh sách phiếu đề nghị cấp thiết bị
 */
exports.searchUseRequests = async (portal, company, query) => {
    const { receiptsCode, createReceiptsDate, reqUseStatus, reqUseEmployee, approver, page, limit, managedBy, assetId, codeAsset } = query;
    var keySearch = { company: company };

    // Bắt sựu kiện mã phiếu tìm kiếm khác ""
    if (receiptsCode) {
        keySearch = { ...keySearch, recommendNumber: { $regex: receiptsCode, $options: "i" } }
    }

    // Thêm key tìm kiếm phiếu theo trạng thái vào keySearch
    if (reqUseStatus) {
        keySearch = { ...keySearch, status: { $in: reqUseStatus } };
    };

    // Thêm key tìm kiếm theo người đăng ký vào keySearch
    if (reqUseEmployee) {
        let user = await User(connect(DB_CONNECTION, portal)).find({
            $or: [
                { email: { $regex: reqUseEmployee, $options: "i" } },
                { name: { $regex: reqUseEmployee, $options: "i" } }
            ]
        }).select('_id');
        let userIds = [];
        user.map(x => {
            userIds.push(x._id)
        })
        keySearch = { ...keySearch, proponent: { $in: userIds } };
    };

    // Thêm key tìm kiếm theo người phê duyệt vào keySearch
    if (approver) {
        let user = await User(connect(DB_CONNECTION, portal)).find({
            $or: [
                { email: { $regex: approver, $options: "i" } },
                { name: { $regex: approver, $options: "i" } }
            ]
        }).select('_id');
        let userIds = [];
        user.map(x => {
            userIds.push(x._id)
        })
        keySearch = { ...keySearch, approver: { $in: userIds } };
    };

    if (assetId) {
        keySearch = { ...keySearch, asset: { $in: assetId } };
    }

    // Thêm key tìm theo mã tài sản vào keySearch
    if (codeAsset) {
        let asset = await Asset(connect(DB_CONNECTION, portal)).find({
            code: { $regex: codeAsset, $options: "i" }
        }).select('_id');
        let assetIds = [];
        asset.map(x => {
            assetIds.push(x._id)
        })
        keySearch = { ...keySearch, asset: { $in: assetIds } };
    }
    // Thêm key tìm theo ngày lập phiếu vào keySearch
    if (createReceiptsDate) {
        let date = createReceiptsDate.split("-");
        let start = new Date(date[1], date[0] - 1, 1);
        let end = new Date(date[1], date[0], 1);

        keySearch = {
            ...keySearch,
            dateCreate: {
                $gt: start,
                $lte: end
            }
        }
    }

    var totalList = await RecommendDistribute(connect(DB_CONNECTION, portal)).countDocuments(keySearch);
    var listRecommendDistributes = await RecommendDistribute(connect(DB_CONNECTION, portal)).find(keySearch)
        .populate([
            { path: "asset" },
            { path: "proponent approver", select: "_id name email avatar" },
            { path: "task", select: "_id name" }
        ])
        .sort({ 'createdAt': 'desc' })
        .skip(page ? parseInt(page) : 0)
        .limit(limit ? parseInt(limit) : 0);

    if (managedBy) {
        recommendDistributes = await RecommendDistribute(connect(DB_CONNECTION, portal)).find(keySearch)
            .populate([
                { path: "asset" },
                { path: "proponent approver", select: "_id name email avatar" },
                { path: "task", select: "_id name" }
            ])
            .sort({ 'createdAt': 'desc' });

        let tempListRecommendDistributes = recommendDistributes.filter(item =>
            item.asset && item.asset.managedBy && item.asset.managedBy.toString() === managedBy);
        listRecommendDistributes = tempListRecommendDistributes.length && tempListRecommendDistributes.slice(parseInt(page), parseInt(page) + parseInt(limit));
        totalList = tempListRecommendDistributes.length;
    }

    return { totalList, listRecommendDistributes };
}


/**
 * Lay thông tin phiếu đề nghị cap phat thiết bị theo tai san
 * @data: du lieu tai san
 */
exports.getUseRequestByAsset = async (portal, data) => {
    var listRecommendDistributes = await RecommendDistribute(connect(DB_CONNECTION, portal)).find({ asset: data.assetId })
        .populate([
            { path: "asset" },
            { path: "proponent approver", select: "_id name email avatar" },
            { path: "task", select: "_id name" }
        ]).sort({ 'createdAt': 'desc' });
    return listRecommendDistributes;
}

/**
 * Thêm mới thông tin phiếu đề nghị cap phat thiết bị
 * @data: dữ liệu phiếu đề nghị cap phat thiết bị
 */
exports.createUseRequest = async (portal, company, data) => {
    // check trùng mã dki sử dụng
    // const getUseRequest = await RecommendDistribute(connect(DB_CONNECTION, portal)).findOne({ recommendNumber: data.recommendNumber });
    // if (getUseRequest) throw ['recommendNumber_exists'];

    const dateStartUse = new Date(data.dateStartUse);
    var dateEndUse = undefined;

    if (data.dateEndUse) {
        dateEndUse = new Date(data.dateEndUse)
    }
    // check trùng thời gian đăng kí sử dụng cho từng tài sản
    // const checkDayUse = await RecommendDistribute(connect(DB_CONNECTION, portal)).find({asset:mongoose.Types.ObjectId(data.asset) , dateEndUse: { $gt: dateStartUse } })

    // if (checkDayUse && checkDayUse.length > 0) throw ['dayUse_exists'];

    const createRecommendDistribute = await RecommendDistribute(connect(DB_CONNECTION, portal)).create({
        company: company,
        recommendNumber: data.recommendNumber,
        dateCreate: data.dateCreate,
        proponent: data.proponent, // Người đề nghị
        reqContent: data.reqContent,
        asset: data.asset,
        dateStartUse: dateStartUse,
        dateEndUse: dateEndUse,
        approver: data.approver, // Người phê duyệt
        note: data.note,
        status: data.status,
        task: data.task && data.task !== '' ? data.task : null, //công việc thực hiện
    });

    const findRecommend = await RecommendDistribute(connect(DB_CONNECTION, portal)).findOne({ _id: mongoose.Types.ObjectId(createRecommendDistribute._id) })
        .populate([
            { path: "asset" },
            { path: "proponent approver", select: "_id name email avatar" },
            { path: "task", select: "_id name" }
        ])
    let asset = await Asset(connect(DB_CONNECTION, portal)).findById({
        _id: data.asset,
    }).populate({ path: 'assetType' });

    if (createRecommendDistribute) {
        let type = "đăng ký sử dụng";

        var mail = await this.sendEmailToManager(
            portal,
            asset,
            data.proponent,
            type
        );
        return {
            createRecommendDistribute: findRecommend,
            manager: mail.manager,
            user: mail.user,
            email: mail.email,
            html: mail.html,
            assetName: asset.assetName
        };
    }
}

/**
 * Xoá thông tin phiếu đề nghị cap phat thiết bị
 * @id: id phiếu đề nghị cap phat thiết bị muốn xoá
 */
exports.deleteUseRequest = async (portal, id) => {
    return await RecommendDistribute(connect(DB_CONNECTION, portal)).findOneAndDelete({
        _id: id
    });
}

/**
 * Update thông tin phiếu đề nghị cap phat thiết bị
 * @id: id phiếu đề nghị cap phat thiết bị muốn update
 */
exports.updateUseRequest = async (portal, id, data) => {
    let dateCreate, dateStartUse, dateEndUse, date, partCreate, partStart, partEnd;

    if (data.dateCreate) {
        partCreate = data.dateCreate.split('-');
        if (data.dateCreate.length > 12) {
            date = data.dateCreate;
        } else {
            date = [partCreate[2], partCreate[1], partCreate[0]].join('-');
        }
        dateCreate = new Date(date);
    }
    if (data.dateStartUse) {
        partStart = data.dateStartUse.split('-');
        if (data.dateStartUse.length > 12) {
            date = data.dateStartUse;
        } else {
            date = [partStart[2], partStart[1], partStart[0]].join('-');
        }
        dateStartUse = new Date(date);
    }
    if (data.dateEndUse) {
        partEnd = data.dateEndUse.split('-');
        if (data.dateEndUse.length > 12) {
            date = data.dateEndUse;
        } else {
            date = [partEnd[2], partEnd[1], partEnd[0]].join('-');
        }
        dateEndUse = new Date(date);
    }
    if (data.startTime && data.dateStartUse) {
        date = [partStart[2], partStart[1], partStart[0]].join('-') + ' ' + data.startTime;
        dateStartUse = new Date(date);
    }
    if (data.stopTime && data.dateEndUse) {
        date = [partEnd[2], partEnd[1], partEnd[0]].join('-') + ' ' + data.stopTime;
        dateEndUse = new Date(date);
    }
    const oldRecommendDistribute = await RecommendDistribute(
        connect(DB_CONNECTION, portal)
    ).findById(id);
    console.log(oldRecommendDistribute);
    oldRecommendDistribute.recommendNumber = data.recommendNumber;
    oldRecommendDistribute.dateCreate = data.dateCreate;
    oldRecommendDistribute.proponent = data.proponent;
    oldRecommendDistribute.reqContent = data.reqContent;
    oldRecommendDistribute.asset = data.asset;
    oldRecommendDistribute.dateStartUse = data.dateStartUse;
    oldRecommendDistribute.approver = data.approver ? data.approver : null;
    oldRecommendDistribute.note = data.note;
    oldRecommendDistribute.status = data.status;
    oldRecommendDistribute.task = data.task && data.task !== '' ? data.task : null;

    await oldRecommendDistribute.save();
    // var recommendDistributeChange = {
    //     recommendNumber: data.recommendNumber,
    //     dateCreate: data.dateCreate,
    //     proponent: data.proponent, // Người đề nghị
    //     reqContent: data.reqContent, // Người đề nghị
    //     asset: data.asset,
    //     dateStartUse: data.dateStartUse,
    //     dateEndUse: data.dateEndUse,
    //     approver: data.approver, // Người phê duyệt
    //     note: data.note,
    //     status: data.status,
    //     task: data.task && data.task !== '' ? data.task : null,
    // };

    // Cập nhật thông tin phiếu đề nghị cap phat thiết bị vào database
    // const a = await RecommendDistribute(connect(DB_CONNECTION, portal)).findOneAndUpdate({
    //     _id: id
    // }, {
    //     $set: recommendDistributeChange
    // });

    return await RecommendDistribute(connect(DB_CONNECTION, portal)).findOne({
        _id: id
    }).populate([
        { path: "asset" },
        { path: "proponent approver", select: "_id name email avatar" },
        { path: "task", select: "_id name" }
    ])
}