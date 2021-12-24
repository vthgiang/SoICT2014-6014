const mongoose = require("mongoose");
const Models = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const { freshObject } = require(`../../../helpers/functionHelper`);

const { Supplies, PurchaseInvoice, AllocationHistory } = Models;
const PurchaseInvoiceService = require('../purchase-invoice-management/purchase-invoice.service');
const AllocationService = require('../allocation-management/allocation-history.service');


/**
 * Lấy danh sách vật tư tiêu hao
 * @param {*} portal 
 * @param {*} params : dữ liệu tìm kiếm
 */
exports.searchSupplies = async (portal, params) => {
    let { getAll } = params;
    if (getAll) {
        let totalList = 0, listSupplies = [];
        listSupplies = await Supplies(connect(DB_CONNECTION, portal)).find();
        totalList = listSupplies.length;
        return { data: listSupplies, totalList };
    } else {
        let keySearch = {};
        //tìm kiếm theo mã vật tư
        if (params.code) {
            keySearch = { ...keySearch, code: { $regex: params.code, $options: "i" }, };
        }
        //tìm kiếm theo tên vật tư
        if (params.suppliesName) {
            keySearch = { ...keySearch, suppliesName: { $regex: params.suppliesName, $options: "i" }, };
        }
        let totalList = 0, listSupplies = [];
        //lấy danh sách vật tư
        totalList = await Supplies(connect(DB_CONNECTION, portal)).countDocuments(
            keySearch
        );

        listSupplies = await Supplies(connect(DB_CONNECTION, portal))
            .find(keySearch)
            .sort({ createdAt: "desc" })
            .skip(params.page)
            .limit(params.limit);
        return { data: listSupplies, totalList };
    }
};

/**
 * Thêm 1 vật tư tiêu hao
 * @param {*} portal 
 * @param {*} company 
 * @param {*} data : thông tin vật tư tiêu hao (có thêm hóa đơn mua, thông tin cấp phát)
 */
exports.createSupplies = async (portal, company, data) => {

    let {
        supplies,
        purchaseInvoice,
        allocationHistory,
    } = data;

    //check code supplies tồn tại
    let checkSuppliesCode = [];
    let checkSupplies = await Supplies(
        connect(DB_CONNECTION, portal)
    ).findOne({
        code: supplies.code
    });
    if (checkSupplies) {
        checkSuppliesCode.push(supplies.code);
    }
    //check mã code invoice
    let checkInvoice = [];
    //kiểm tra trùng mã hóa đơn
    for (let i = 0; i < purchaseInvoice.length; i++) {
        let checkInvoiceCode = await PurchaseInvoice(
            connect(DB_CONNECTION, portal)
        ).findOne({
            codeInvoice: purchaseInvoice[i].codeInvoice
        });
        if (checkInvoiceCode) {
            checkInvoice.push(purchaseInvoice[i].codeInvoice);
        }
    }


    if (checkSuppliesCode.length === 0 && checkInvoice.length === 0) {//thỏa mã code ko bị trùng
        var createSupplies = await Supplies(
            connect(DB_CONNECTION, portal)
        ).create({
            company: company,
            code: supplies.code,
            suppliesName: supplies.suppliesName,
            totalPurchase: supplies.totalPurchase,
            totalAllocation: supplies.totalAllocation,
            price: supplies.price
        });
        // thêm các hóa đơn mua
        purchaseInvoice = purchaseInvoice.map((item) => {
            return {
                ...item,
                supplies: createSupplies._id
            }
        });
        await PurchaseInvoiceService.createPurchaseInvoices(portal, purchaseInvoice);
        //thêm thông tin cấp phát
        allocationHistory = allocationHistory.map((item) => {
            return {
                ...item,
                supplies: createSupplies._id
            }
        });
        await AllocationService.createAllocations(portal, allocationHistory);

        let suppliesCreate = await Supplies(
            connect(DB_CONNECTION, portal)
        ).findById({ _id: createSupplies._id });
        return { suppliesCreate };
    } else {
        throw {
            message: "supplies_code_exist",
            suppliesCodeError: checkSuppliesCode && checkInvoice
        }
    }
};

/**
 * Cập nhật thông tin 1 vật tư
 * @param {*} portal 
 * @param {*} company 
 * @param {*} data 
 */
exports.updateSupplies = async (portal, company, id, data) => {
    let {
        suppliesUpdate,
        deleteInvoices,
        updateInvoices,
        createInvoices,
        deleteAllocations,
        updateAllocations,
        createAllocations,
    } = data;

    let oldSupplies = await Supplies(connect(DB_CONNECTION), portal).findById(id);
    if (oldSupplies.code !== suppliesUpdate.code) {
        let checkSuppliesCode = await Supplies(connect(DB_CONNECTION), portal).findOne({
            code: suppliesUpdate.code
        });
        if (checkSuppliesCode) {
            throw ["supplies_code_exist"];
        }
    }
    oldSupplies.code = suppliesUpdate.code;
    oldSupplies.suppliesName = suppliesUpdate.suppliesName;
    oldSupplies.totalPurchase = suppliesUpdate.totalPurchase;
    oldSupplies.totalAllocation = suppliesUpdate.totalAllocation;
    oldSupplies.price = suppliesUpdate.price;
    await oldSupplies.save();

    createInvoices = createInvoices.map((item) => {
        return {
            ...item,
            supplies: id
        }
    });
    updateInvoices = updateInvoices.map((item) => {
        return {
            ...item,
            supplies: id
        }
    });
    createAllocations = createAllocations.map((item) => {
        return {
            ...item,
            supplies: id
        }
    });
    updateAllocations = updateAllocations.map((item) => {
        return {
            ...item,
            supplies: id
        }
    });

    //thêm, sửa, xóa hóa đơn
    await PurchaseInvoiceService.createPurchaseInvoices(portal, createInvoices);
    await PurchaseInvoiceService.deletePurchaseInvoices(portal, deleteInvoices);
    for (let i = 0; i < updateInvoices.length; i++) {
        await PurchaseInvoiceService.updatePurchaseInvoice(portal, updateInvoices[i]._id, updateInvoices[i]);
    }
    //thêm, sửa, xóa thông tin cấp phát
    await AllocationService.createAllocations(portal, createAllocations);
    await AllocationService.deleteAllocations(portal, deleteAllocations);
    for (let i = 0; i < updateAllocations.length; i++) {
        await AllocationService.updateAllocation(portal, updateAllocations[i]._id, updateAllocations[i]);
    }

    let supplies = await Supplies(connect(DB_CONNECTION, portal)).findById(id);
    return supplies;

};

/**
 * Xóa danh sách vật tư
 * @param {*} portal 
 * @param {*} ids danh sách id vật tư tiêu
 */
exports.deleteSupplies = async (portal, ids) => {
    let supplies = await Supplies(connect(DB_CONNECTION, portal))
        .deleteMany({ _id: { $in: ids.map(item => mongoose.Types.ObjectId(item)) } });
    return supplies;
};

/**
 * Lấy vật tư tiêu hao theo id (lấy thêm hóa đơn mua và lịch sử cấp phát)
 * @param {*} portal 
 * @param {*} id 
 */
exports.getSuppliesById = async (portal, id) => {
    let supplies = await Supplies(connect(DB_CONNECTION, portal))
        .findById(id);
    let listPurchaseInvoice = await PurchaseInvoice(connect(DB_CONNECTION, portal))
        .find({ supplies: mongoose.Types.ObjectId(id) })
        .populate({ path: 'supplies' });
    let listAllocation = await AllocationHistory(connect(DB_CONNECTION, portal))
        .find({ supplies: mongoose.Types.ObjectId(id) })
        .populate({ path: 'supplies' });
    return { supplies, listPurchaseInvoice, listAllocation }
};
