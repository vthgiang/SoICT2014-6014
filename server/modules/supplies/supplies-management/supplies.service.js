const mongoose = require("mongoose");
const Models = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const { freshObject } = require(`../../../helpers/functionHelper`);

const { Supplies, PurchaseInvoice, AllocationHistory } = Models;
const PurchaseInvoiceService = require('../purchase-invoice-management/purchase-invoice.service');
const AllocationService = require('../allocation-management/allocation-history.service');
const { result } = require("lodash");
const {SuppliesPurchaseRequest, OrganizationalUnit} = require("../../../models");


/**
 * Lấy danh sách vật tư tiêu hao
 * @param {*} portal 
 * @param {*} params : dữ liệu tìm kiếm
 */
exports.searchSupplies = async (portal, params) => {
    let { getAll } = params;
    if (getAll === 'true') {
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


    if (checkSuppliesCode.length === 0 && checkInvoice.length === 0) {//thỏa mãn code ko bị trùng
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
 * @param {*} id
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
    let oldSupplies = await Supplies(connect(DB_CONNECTION, portal))
        .findById(id);
    if (oldSupplies.code !== suppliesUpdate.code) {
        let checkSuppliesCode = await Supplies(connect(DB_CONNECTION, portal), portal).findOne({
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
        .populate([
            { path: "supplies" },
            { path: "allocationToUser", select: "_id name email" },
            { path: "allocationToOrganizationalUnit", select: "_id name" },
        ]);
    return { supplies, listPurchaseInvoice, listAllocation }
};

exports.getDashboardSupplies = async (portal, query) => {
    // new query
    let { time } = query;
    time = JSON.parse(time);
    let startTime = new Date(time.startTime);
    let endTime = new Date(time.endTime);
    startTime = new Date(startTime.getFullYear(), startTime.getMonth());
    endTime = new Date(endTime.getFullYear(), endTime.getMonth());

    let supplies = await Supplies(connect(DB_CONNECTION, portal))
        .find({})
        .populate('allocationHistories')
        .populate('purchaseInvoices')
        .exec();
    console.log("supplies: ", supplies);
    let suppliesPurchaseRequest = await SuppliesPurchaseRequest(connect(DB_CONNECTION, portal))
        .find({})
        .populate('company')
        .populate('proponent')
        .populate('recommendUnits')
        .populate('approver')
        .exec();
    // filter data by query time
    suppliesPurchaseRequest = suppliesPurchaseRequest.filter((item) => {
        let suppliesPurchaseRequestDate = item.dateCreate;
        suppliesPurchaseRequestDate = new Date(suppliesPurchaseRequestDate.getFullYear(), suppliesPurchaseRequestDate.getMonth());
        return (Date.parse(suppliesPurchaseRequestDate) >= Date.parse(startTime) && Date.parse(suppliesPurchaseRequestDate) <= Date.parse(endTime))
    })

    let organizationUnits = await OrganizationalUnit(connect(DB_CONNECTION, portal))
        .find({})
        .exec();

    let data = {}, suppliesPrice = 0, purchaseInvoicesPrice = 0, totalPurchaseInvoice = 0;
    let allocationHistoryTotal = 0, allocationHistoryPrice = 0;
    let purchaseRequest = {
        approvedTotal: 0,
        disapprovedTotal: 0,
        waitingForApprovalTotal: 0
    };

    let boughtSupplies = [], existSupplies = [], organizationUnitsPriceSupply = [];

    // handle supplies
    for(let i = 0; i < supplies.length; i++) {
        let supply = supplies[i];
        suppliesPrice += supply.price;

        // filter data by query
        supply.allocationHistories = supply.allocationHistories.filter((item) => {
            let allocationDate = item.date;
            allocationDate = new Date(allocationDate.getFullYear(), allocationDate.getMonth());
            return (Date.parse(allocationDate) >= Date.parse(startTime) && Date.parse(allocationDate) <= Date.parse(endTime))
        });

        supply.purchaseInvoices = supply.purchaseInvoices.filter((item) => {
            let purchaseDate = item.date;
            purchaseDate = new Date(purchaseDate.getFullYear(), purchaseDate.getMonth());
            return (Date.parse(purchaseDate) >= Date.parse(startTime) && Date.parse(purchaseDate) <= Date.parse(endTime))
        });

        //handle purchaseInvoice
        for(let j = 0; j < supply.purchaseInvoices.length; j++) {
            totalPurchaseInvoice++;
            purchaseInvoicesPrice += Number(supply.purchaseInvoices[j].price) * Number(supply.purchaseInvoices[j].quantity);
        }

        //handle allocationHistory
        for(let j = 0; j < supply.allocationHistories.length; j++) {
            allocationHistoryTotal++;
            allocationHistoryPrice +=  Number(supply.price) * Number(supply.allocationHistories[j].quantity);
        }

        /** Handle pie chart */
        //handle boughtSupplies
        let totalBoughtSupplyPrice = 0;
        for(let j = 0; j < supply.purchaseInvoices.length; j++) {
            totalBoughtSupplyPrice += supply.purchaseInvoices[j].price;
        }
        boughtSupplies.push({
            supplyName: supply.suppliesName,
            price: totalBoughtSupplyPrice
        });

        //handle existSupplies
        let totalExistSupplyPrice = 0;
        if (supply.totalPurchase - supply.totalAllocation >= 0) {
            if (supply.totalPurchase !== 0)
                totalExistSupplyPrice = (totalBoughtSupplyPrice / supply.totalPurchase) * (supply.totalPurchase - supply.totalAllocation);
        }
        existSupplies.push({
            supplyName: supply.suppliesName,
            price: totalExistSupplyPrice
        });
    }

    // handle supplies purchase request
    for(let i = 0; i < suppliesPurchaseRequest.length; i++) {

        switch (suppliesPurchaseRequest[i].status) {
            case "approved":
                purchaseRequest.approvedTotal++;
                break;
            case "disapproved":
                purchaseRequest.disapprovedTotal++;
                break;
            case "waiting_for_approval":
                purchaseRequest.waitingForApprovalTotal++;
                break;
            default:
                throw new Error("INVALID_PURCHASE_REQUEST_STATUS");
        }
    }

    /** Handle bar chart */
    // handle organization price supplies
    for(let i = 0; i < organizationUnits.length; i++) {
        let organizationUnit = organizationUnits[i];
        organizationUnit.quantity = 0;
        organizationUnit.price = 0;
        for(let j = 0; j < supplies.length; j++) {
            let supply = supplies[j], totalPricePerSupply = 0, totalQuantityPerSupply = 0, tempQuantity = 0;
            // filter data by query
            supply.allocationHistories = supply.allocationHistories.filter((item) => {
                let allocationDate = item.date;
                allocationDate = new Date(allocationDate.getFullYear(), allocationDate.getMonth());
                return (Date.parse(allocationDate) >= Date.parse(startTime) && Date.parse(allocationDate) <= Date.parse(endTime))
            });

            supply.purchaseInvoices = supply.purchaseInvoices.filter((item) => {
                let purchaseDate = item.date;
                purchaseDate = new Date(purchaseDate.getFullYear(), purchaseDate.getMonth());
                return (Date.parse(purchaseDate) >= Date.parse(startTime) && Date.parse(purchaseDate) <= Date.parse(endTime))
            });

            for(let k = 0; k < supply.allocationHistories.length; k++) {
                let allocationHistory = supply.allocationHistories[k];
                if (organizationUnit._id.toString() === allocationHistory.allocationToOrganizationalUnit.toString()) {
                   tempQuantity += allocationHistory.quantity;
                }
            }
            for(let k = 0; k < supply.purchaseInvoices.length; k++) {
                totalPricePerSupply += supply.purchaseInvoices[k].price;
                totalQuantityPerSupply += supply.purchaseInvoices[k].quantity;
            }
            if (tempQuantity !== 0) {
                console.log(`totalPricePerSupply: ${totalPricePerSupply}`);
                console.log(`totalQuantityPerSupply: ${totalQuantityPerSupply}`);
                console.log(`tempQuantity: ${tempQuantity}`);
                if (totalQuantityPerSupply !== 0)
                    organizationUnit.price += (totalPricePerSupply / totalQuantityPerSupply) * tempQuantity;
            }
            organizationUnit.quantity +=  tempQuantity;
        }
        organizationUnitsPriceSupply.push({
            name: organizationUnit.name,
            quantity: organizationUnit.quantity,
            price: organizationUnit.price
        });
    }

    data.numberData = {
        supplies: {
            totalSupplies: supplies.length,
            suppliesPrice: suppliesPrice,
        },
        purchaseInvoice: {
            totalPurchaseInvoice,
            purchaseInvoicesPrice,
        },
        purchaseRequest,
        allocationHistory: {
            allocationHistoryTotal,
            allocationHistoryPrice
        }
    }

    data.pieChart = {
        boughtSupplies: boughtSupplies,
        existSupplies: existSupplies
    }

    data.barChart = {
        organizationUnitsPriceSupply
    }

    console.log('data number data: ', data.numberData);
    console.log('data pie chart - bought: ', data.pieChart.boughtSupplies);
    console.log('data pie chart - exist: ', data.pieChart.existSupplies);
    console.log('data bar chart - organization: ', data.barChart.organizationUnitsPriceSupply);
    return data;
}

exports.getDashboardSuppliesForOrganization = async (portal, query) => {
    let {supplyIds, organizationId, time} = query;
    supplyIds = supplyIds.split(",");
    time = JSON.parse(time);
    let startTime = new Date(time.startTime);
    let endTime = new Date(time.endTime);
    startTime = new Date(startTime.getFullYear(), startTime.getMonth());
    endTime = new Date(endTime.getFullYear(), endTime.getMonth());

    let supplies = await Supplies(connect(DB_CONNECTION, portal))
        .find({_id: {$in: supplyIds.map(item => mongoose.Types.ObjectId(item))}})
        .populate('allocationHistories')
        .populate('purchaseInvoices')
        .exec();

    console.log(supplyIds.map(item => mongoose.Types.ObjectId(item)));
    let suppliesPriceForOrganization = [];
    for (let i = 0; i < supplies.length; i++) {
        let supply = supplies[i];

        // filter data by query
        supply.allocationHistories = supply.allocationHistories.filter((item) => {
            let allocationDate = item.date;
            allocationDate = new Date(allocationDate.getFullYear(), allocationDate.getMonth());
            return (Date.parse(allocationDate) >= Date.parse(startTime) && Date.parse(allocationDate) <= Date.parse(endTime))
        });

        let totalPrice = 0, totalQuantity = 0;
        for(let j = 0; j < supply.purchaseInvoices.length; j++) {
            totalPrice += supply.purchaseInvoices[j].price;
            totalQuantity += supply.purchaseInvoices[j].quantity;
        }

        let pricePerUnit = totalPrice / totalQuantity, price = 0, quantity = 0;
        for(let j = 0; j < supply.allocationHistories.length; j++) {
            if (supply.allocationHistories[j].allocationToOrganizationalUnit.toString() === organizationId) {
                price += pricePerUnit * supply.allocationHistories[j].quantity;
                quantity += supply.allocationHistories[j].quantity;
            }
        }
        suppliesPriceForOrganization.push({
            name: supply.suppliesName,
            price: price,
            quantity: quantity
        });
    }

    return suppliesPriceForOrganization;
}