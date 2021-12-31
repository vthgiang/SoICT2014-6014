const mongoose = require("mongoose");
const Models = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const { freshObject } = require(`../../../helpers/functionHelper`);

const { Supplies, PurchaseInvoice } = Models;

/**
 * Lấy danh sách hóa đơn
 * @param {*} portal 
 * @param {*} params 
 */
exports.searchPurchaseInvoice = async (portal, params) => {
    let keySearch = {};
    //tìm kiếm theo mã hóa đơn
    if (params.codeInvoice) {
        keySearch = { ...keySearch, codeInvoice: { $regex: params.codeInvoice, $options: "i" } };
    }
    //tìm kiếm theo vật tư
    if (params.supplies) {
        keySearch = {
            ...keySearch,
            supplies: { $in: params.supplies },
        };
    }
    //tìm kiếm theo ngày nhập hóa đơn
    if (params.date) {
        let date = params.date.split("-");
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
    //tìm kiếm theo nhà cung cấp
    if (params.supplier) {
        keySearch = { ...keySearch, supplier: { $regex: params.supplier, $options: "i" } };
    }

    let totalList = 0, listPurchaseInvoice = [];
    totalList = await PurchaseInvoice(connect(DB_CONNECTION, portal)).countDocuments(
        keySearch
    );
    listPurchaseInvoice = await PurchaseInvoice(
        connect(DB_CONNECTION, portal)
    )
        .find(keySearch)
        .populate({ path: 'supplies'})
        .sort({ createdAt: "desc" })
        .skip(params.page ? parseInt(params.page) : 0)
        .limit(params.limit ? parseInt(params.limit) : 5);
    return { data: listPurchaseInvoice, totalList };
};

/**
 * Thêm danh sách hóa đơn 
 * @param {*} portal 
 * @param {*} data []
 */
exports.createPurchaseInvoices = async (portal, data) => {
    let checkInvoice = [];
    if (!Array.isArray(data)) {
        data = [data];
    }

    //kiểm tra trùng mã hóa đơn
    for (let i = 0; i < data.length; i++) {
        let checkInvoiceCode = await PurchaseInvoice(
            connect(DB_CONNECTION, portal)
        ).findOne({
            codeInvoice: data[i].codeInvoice
        });
        if (checkInvoiceCode) {
            checkInvoice.push(data[i].codeInvoice);
        }
    }
    if (checkInvoice.length === 0) {
        for (let i = 0; i < data.length; i++) {
            data[i].date = data[i].date && new Date(data[i].date);
            var createInvoice = await PurchaseInvoice(
                connect(DB_CONNECTION, portal)
            ).create({
                codeInvoice: data[i].codeInvoice,
                supplies: data[i].supplies,
                date: data[i].date ? data[i].date : undefined,
                quantity: data[i].quantity,
                price: data[i].price,
                supplier: data[i].supplier,
            });

        }
        let purchaseInvoices;
        if (createInvoice) {
            purchaseInvoices = await PurchaseInvoice(connect(DB_CONNECTION, portal)).find({
                _id: createInvoice._id,
            }).populate({ path: 'supplies' });
        }
        return { purchaseInvoices };
    } else {
        throw {
            messages: "purchase_invoice_code_exist",
            purchaseInvoiceCodeError: checkInvoice,
        }
    }
};

/**
 * Cập nhật thông tin hóa đơn
 * @param {*} portal 
 * @param {*} id 
 * @param {*} data 
 */
exports.updatePurchaseInvoice = async (portal, id, data) => {
    console.log("data",data);
    data = freshObject(data);
    let oldInvoice = await PurchaseInvoice(connect(DB_CONNECTION, portal)).findById(id);

    if (oldInvoice.codeInvoice !== data.codeInvoice) {
        let checkCode = await Asset(
            connect(DB_CONNECTION, portal)
        ).findOne({
            codeInvoice: data.codeInvoice,
        });

        if (checkCode) {
            throw ["purchase_invoice_code_exist"];
        }
    }
    oldInvoice.codeInvoice = data.codeInvoice;
    oldInvoice.supplies = data.supplies;
    oldInvoice.date = data.date;
    oldInvoice.supplier = data.supplier;
    oldInvoice.price = data.price;
    oldInvoice.quantity = data.quantity;
    console.log("oldInvoice",oldInvoice);

    await oldInvoice.save();

    let purchaseInvoice = await PurchaseInvoice(connect(DB_CONNECTION, portal))
        .findById({ _id: oldInvoice._id })
        .populate({ path: 'supplies' });
    return purchaseInvoice;
};

/**
 * Xóa danh sách hóa đơn
 * @param {*} portal 
 * @param {*} ids 
 */
exports.deletePurchaseInvoices = async (portal, ids) => {
    let invoices = await PurchaseInvoice(connect(DB_CONNECTION, portal))
        .deleteMany({ _id: { $in: ids.map(item => mongoose.Types.ObjectId(item)) } });

    return invoices;
};

/**
 * Lấy thông tin hóa đơn theo id
 * @param {*} portal 
 * @param {*} id 
 */
exports.getPurchaseInvoiceById = async (portal, id) => {
    let purchaseInvoice = await PurchaseInvoice(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate({ path: 'supplies'});
    return { purchaseInvoice }
};

/** Function tạo mô tả lịch sử thay đổi hóa đơn khi chỉnh sửa hóa đơn */
exports.createDescriptionEditInvoiceLogs = async (portal, userId, updateInvoice, oldInvoice) => {
    const { codeInvoice, date, quantity, price, supplier} = updateInvoice;
    let descriptionLog = '';

    if (codeInvoice && codeInvoice !== oldInvoice?.codeInvoice) {
        descriptionLog = descriptionLog + '<span>Mã hóa đơn mới: ' + codeInvoice + '.</span></br>';
    }
    if (date && (new Date(date)).getTime() !== oldInvoice?.date.getTime()) {
        descriptionLog = descriptionLog + '<span>Ngày mua mới: ' + formatTime(date) + '</span>';
    }
    if (quantity && quantity !== oldInvoice?.quantity) {
        descriptionLog = descriptionLog + '<span>Số lượng vật tư mới: ' + quantity + ".</span></br>";
    }

    if(supplier && supplier !== oldInvoice?.supplier){
        descriptionLog = descriptionLog + '<span>Nhà cung cấp mới: ' + supplier + ".</span></br>";
    }

    if(price && price !== oldInvoice?.price){
        descriptionLog = descriptionLog + '<span>Giá mua mới: ' + supplier + '(VND)'+".</span></br>";
    }

    return descriptionLog;
}

/**
 * Thêm Log cho một hóa đơn
 */
 exports.addInvoiceLog = async (portal, id, body) => {
    let { creator, title, description, createdAt } = body;

    let log = {
        createdAt: createdAt,
        creator: creator,
        title: title,
        description: description,
    };

    await PurchaseInvoice(connect(DB_CONNECTION, portal))
        .updateOne(
            { '_id': id },
            { $push: { logs: log } },
            { new: true }
        )
        .populate({ path: "logs.creator", select: "_id name email avatar" });

    let invoiceLog = await this.getInvoiceLog(portal, id);

    return invoiceLog;
};

/**
 * Lấy tất cả lịch sử chỉnh sửa của một hóa đơn
 */
 exports.getInvoiceLog = async (portal, id) => {
    let invoice = await PurchaseInvoice(connect(DB_CONNECTION, portal))
        .findById(id)
        .populate({ path: "logs.creator", select: "_id name email avatar" });

    return invoice.logs.reverse();
};