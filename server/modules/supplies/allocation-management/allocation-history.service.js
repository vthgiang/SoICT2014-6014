const mongoose = require("mongoose");
const Models = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const { freshObject } = require(`../../../helpers/functionHelper`);
const { isArray } = require("lodash");

const { Supplies, AllocationHistory , User, } = Models;

/**
 * Lấy danh sách lịch sử cấp phát
 * @param {*} portal 
 * @param {*} params 
 */
exports.searchAllocation = async (portal, params) => {
    let keySearch = {};
    //tìm kiếm theo vật tư
    if (params.supplies) {
        keySearch = { ...keySearch, supplies: { $regex: params.supplies, $options: "i" } };
    }
    //tìm kiếm theo ngày nhập lịch sử cấp phát
    if (params.date) {
        let date = params.startDepreciation.split("-");
        let start = new Date(date[1], date[0] - 1, 1);
        let end = new Date(date[1], date[0], 1);

        keySearch = {
            ...keySearch,
            date: {
                $gt: start,
                $lte: end,
            },
        };
    }
    //tìm kiếm theo đơn vị đc cấp
    if (params.allocationToOrganizationalUnit && params.allocationToOrganizationalUnit !== "") {
        keySearch = {
            ...keySearch,
            allocationToOrganizationalUnit: { $in: params.allocationToOrganizationalUnit },
        };
    }
    //tìm kiếm theo người dùng đc cấp
    if (params.allocationToUser && params.allocationToUser !== "") {
        let user = await User(connect(DB_CONNECTION, portal))
            .find({
                $or: [
                    { email: { $regex: params.allocationToUser, $options: "i" } },
                    { name: { $regex: params.allocationToUser, $options: "i" } }
                ]
            })
            .select("_id");
        let userIds = [];
        user.map((x) => {
            userIds.push(x._id);
        });
        keySearch = { ...keySearch, allocationToUser: { $in: userIds } };
    }

    let totalList = 0, listAllocation = [];
    totalList = await AllocationHistory(connect(DB_CONNECTION, portal)).countDocuments(
        keySearch
    );
    listAllocation = await AllocationHistory(
        connect(DB_CONNECTION, portal)
    )
        .find(keySearch)
        .populate([
            { path: "supplies", select: "_id suppliesName"},
            { path: "allocationToUser", select: "_id name email" },
            { path: "allocationToOrganizationalUnit", select: "_id name" },
        ])
        .sort({ createdAt: "desc" })
        .skip(params.page ? parseInt(params.page) : 0)
        .limit(params.limit ? parseInt(params.limit) : 5);
    return { data: listAllocation, totalList };

};

/**
 * Thêm danh sách lịch sử cấp phát 
 * @param {*} portal 
 * @param {*} data []
 */
exports.createAllocations = async (portal, data) => {
    if(!isArray(data)){
        data=[data];
    }
    for (let i = 0; i < data.length; i++) {
        data[i].date = data[i].date && new Date(data[i].date);
        var createAllocation = await AllocationHistory(
            connect(DB_CONNECTION, portal)
        ).create({
            supplies: data[i].supplies,
            date: data[i].date ? data[i].date : undefined,
            quantity: data[i].quantity,
            allocationToOrganizationalUnit: data[i].allocationToOrganizationalUnit
                ? data[i].allocationToOrganizationalUnit
                : null,
            allocationToUser: data[i].allocationToUser
                ? data[i].allocationToUser
                : null
        });
    }
    let allocations;
    if(createAllocation){
        allocations = await AllocationHistory(connect(DB_CONNECTION, portal)).find({
            _id: createAllocation._id,
        }).populate([
            { path: "supplies", select: "_id suppliesName"},
            { path: "allocationToUser", select: "_id name email" },
            { path: "allocationToOrganizationalUnit", select: "_id name" },
        ]);
    }
    return { allocations };
};

/**
 * Cập nhật thông tin lịch sử cấp phát
 * @param {*} portal 
 * @param {*} id 
 * @param {*} data 
 */
exports.updateAllocation = async (portal, id, data) => {
    data = freshObject(data);
    let oldAllocation = await AllocationHistory(connect(DB_CONNECTION, portal)).findById(id);

    oldAllocation.supplies = data.supplies;
    oldAllocation.date = data.date;
    oldAllocation.quantity = data.quantity;
    oldAllocation.allocationToOrganizationalUnit = data.allocationToOrganizationalUnit;
    oldAllocation.allocationToUser = data.allocationToUser;
    await oldAllocation.save();

    let allocation = await AllocationHistory(connect(DB_CONNECTION, portal))
        .findById({ _id: oldAllocation._id })
        .populate([
            { path: "supplies", select: "_id suppliesName"},
            { path: "allocationToUser", select: "_id name email" },
            { path: "allocationToOrganizationalUnit", select: "_id name" },
        ]);
    return allocation;
};

/**
 * Xóa danh sách lịch sử cấp phát
 * @param {*} portal 
 * @param {*} ids 
 */
exports.deleteAllocations = async (portal, ids) => {
    let allocations = await AllocationHistory(connect(DB_CONNECTION, portal))
        .deleteMany({ _id: { $in: ids.map(item => mongoose.Types.ObjectId(item)) } });

    return allocations;
};

/**
 * Lấy thông tin lịch sử cấp phát theo id
 * @param {*} portal 
 * @param {*} id 
 */
exports.getAllocationById = async (portal, id) => {
    let allocation = await AllocationHistory(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate({ path: 'supplies' });
    return { allocation }
};