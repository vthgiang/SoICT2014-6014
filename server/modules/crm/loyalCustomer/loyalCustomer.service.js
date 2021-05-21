const mongoose = require("mongoose");
const { Care, User, Status } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const { getAllEmployeeOfUnitByRole } = require("../../super-admin/user/user.service");
const { getCares } = require("../care/care.service");
const { getCustomers } = require("../customer/customer.service");
const { getAllSalesOrders } = require("../../production/order/sales-order/salesOrder.service");
const { forEach } = require("lodash");



/**
 * 
 * @param {*} portal 
 * @param {*} companyId 
 * @param {*} query 
 * @param {*} currentRole 
 * @returns 
 */
exports.getLoyalCustomers = async (userId, portal, companyId, query, currentRole) => {

    const { customerCode } = query;
    // lay danh sach khach hang
    const listAllCustomer = await getCustomers(portal, companyId, {customerCode });
    let customers;
    if (listAllCustomer) customers = listAllCustomer.customers;
    let loyalCustomers = [];
    for (const customer of customers) {
        let listSaleOrder = await getAllSalesOrders(userId, { page: 1, limit: 100, currentRole, customer: customer._id }, portal,true);
        let saleOrders;
        if (listSaleOrder) saleOrders = listSaleOrder.allSalesOrders.docs;
        let totalOrderValue = 0;
        saleOrders.forEach(saleOrder => {
            totalOrderValue += saleOrder.paymentAmount;
        });
        //tinh diem khach hang
        const now = new Date();
        let rankPoint = 0;
        let totalPromotion = customer.promotions ? customer.promotions.length : 0;
        const listRankPoint = customer.rankPoints;
        if (listRankPoint) {
            listRankPoint.forEach(x => {
                if (x.expirationDate.getTime() > now.getTime()) rankPoint += x.point;
            });
        }
        loyalCustomers = [...loyalCustomers, { customer, totalOrder: saleOrders.length, totalOrderValue, rankPoint,totalPromotion }];
    }
     loyalCustomers =  loyalCustomers.sort((a, b) => (a.rankPoint < b.rankPoint) ? 1 : -1).filter((x)=>x.rankPoint>0);
    return {listDocsTotal: loyalCustomers.length, loyalCustomers}
}

