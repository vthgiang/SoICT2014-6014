const mongoose = require("mongoose");
const { Care, User, Status } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const { getAllEmployeeOfUnitByRole } = require("../../super-admin/user/user.service");
const { getCares } = require("../care/care.service");
const { getCustomers } = require("../customer/customer.service");
const { getAllSalesOrders } = require("../../production/order/sales-order/salesOrder.service");
const { getGroups } = require("../group/group.service");
const { getStatus } = require("../status/status.service");


const STATUS_VALUE = {
    unfulfilled: 1,
    processing: 2,
    accomplished: 3,
    expired: 4,
    completedOverdue: 5
};
/**
 * ham loc thong tin theo thang
 */

/**
 * 
 * @param {*} portal 
 * @param {*} companyId 
 * @param {*} query 
 * @param {*} currentRole 
 * @returns 
 */
exports.getEvaluations = async (portal, companyId, query, currentRole) => {
    let { month, year } = query;

    // neu ko co querry thi lay theo thang hien tai
    if (!month || !year) {
        const date = new Date();
        month = date.getMonth() + 1;
        year = date.getFullYear();
    }
    //lấy danh sách nhân viên
    const listEmployee = await getAllEmployeeOfUnitByRole(portal, currentRole);
    let evaluations = [];
    for (const employee of listEmployee) {
        // tính tỉ lệ giải quyết vấn đề
        const { numberOfCompletionActions, solutionRate } = await this.getSolutionRate(portal, companyId, { month, year }, employee.userId._id);
        // tính tỉ lệ hoàn thành hoạt động
        const { totalCareActions, completionRate, numberOfOverdueCareAction } = await this.getCompletionRate(portal, companyId, { month, year }, employee.userId._id);
        // tính tỉ lệ khách hàng mua hàng
        const { numberOfOldCustomers, customerRetentionRate } = await this.getCustomerRetentionRate(portal, companyId, { month, year }, employee.userId._id);
        // tính tir lệ khách hàng mới mua hàng
        const { numberOfNewCustomers, newCustomerBuyingRate } = await this.getNewCustomerBuyingRate(portal, companyId, { month, year }, employee.userId._id);


        evaluations = [...evaluations, {
            employeeId: employee._id,
            employeeName: employee.userId.name,
            totalCareActions, numberOfOverdueCareAction, completionRate, solutionRate,
            customerRetentionRate, newCustomerBuyingRate, numberOfNewCustomers, totalCustomer: (numberOfOldCustomers + numberOfNewCustomers)
        }]

    }
    return evaluations
}
exports.getCustomerCareInfoByEmployee = async (portal, companyId, query, userId) => {
    let { month, year } = query;

    // neu ko co querry thi lay theo thang hien tai
    if (!month || !year) {
        const date = new Date();
        month = date.getMonth() + 1;
        year = date.getFullYear();
    }
    // tính tỉ lệ hoàn thành hoạt động
    const { totalCareActions, numberOfCompletionCareAction, numberOfOverdueCareAction } = await this.getCompletionRate(portal, companyId, { month, year }, userId);
    // lấy danh sách khách hàng quản lý
    const getAllCustomers = await getCustomers(portal, companyId, { customerOwner: [userId] });
    const listManagedCustomer = getAllCustomers.customers;

    //lấy danh sách nhóm khách hàng - tạo dữ liệu khách hàng theo nhóm
    const getCustomnerGroups = await getGroups(portal, companyId, {})
    const listGroup = getCustomnerGroups.groups;
    let customerDataByGroup = [];
    listGroup.forEach(group => {
        let numberOfCustomer = 0;
        listManagedCustomer.forEach(customer => {
            if (customer.group._id.toString() == group._id.toString()) numberOfCustomer++;
        });
        customerDataByGroup = [...customerDataByGroup, [group.name, numberOfCustomer]];
    });
    //lấy danh sách trạng thái khách hàng - tạo dữ liệu khách hàng theo trạng thái
    const getCustomnerStatus = await getStatus(portal, companyId, {})
    const listStatus = getCustomnerStatus.listStatus;
    let customerDataByStatus = [];
    listStatus.forEach(status => {
        let numberOfCustomer = 0;
        listManagedCustomer.forEach(customer => {
            if (customer.status[0]._id.toString() == status._id.toString()) numberOfCustomer++;
        });
        customerDataByStatus = [...customerDataByStatus, [status.name, numberOfCustomer]];
    });
    // tính tỉ lệ hoàn thành hoạt động và tỉ lệ giải quyết vấn đề ở 12 tháng gần nhất
    let x = [];
    let completionRateData = [];
    let solutionRateData = [];
    for (let i = 0; i < 12; i++) {
        x = [...x, `${month}/${year}`];
        let { completionRate } = await this.getCompletionRate(portal, companyId, { month, year }, userId);
        completionRateData = [...completionRateData, completionRate*100];
        let {solutionRate} = await this.getSolutionRate(portal, companyId, { month, year }, userId);
        solutionRateData = [...solutionRateData, solutionRate*100];
        if (month <=1) { month = month + 12 - 1; year--; }
        else month--;
    }


    const customerCareInfoByEmployee = {
        totalCareActions, numberOfOverdueCareAction, numberOfCompletionCareAction, listManagedCustomer,
         customerDataByGroup, customerDataByStatus, x, solutionRateData, completionRateData
    }
    return customerCareInfoByEmployee
}


exports.getSolutionRate = async (portal, companyId, query, userId) => {
    const { month, year } = query;
    // neu ko co querry thi lay theo thang hien tai
    if (!month || !year) {
        const date = new Date();
        month = date.getMonth() + 1;
        year = date.getFullYear();
    }
    //-----------------------------
    const getAllActions = await getCares(portal, companyId, { customerCareStaffs: [userId], month, year });
    const listCare = getAllActions.cares.filter((care) => { return (care.status == 3 || care.status == 5) });
    // lấy ra danh sách hoạt động thành công
    const listSolutionCare = listCare.filter((care) => { return (care.evaluation && care.evaluation.result && care.evaluation.result == 1) });
    if ((listCare.length) == 0) return { numberOfCompletionActions: listCare.length, solutionRate: 0 };

    return { numberOfCompletionActions: listCare.length, solutionRate: (listSolutionCare.length) / (listCare.length) };
}

exports.getCompletionRate = async (portal, companyId, query, userId) => {

    const { month, year } = query;
    // neu ko co querry thi lay theo thang hien tai
    if (!month || !year) {
        const date = new Date();
        month = date.getMonth() + 1;
        year = date.getFullYear();
    }
    //-----------------------------
    const getAllActions = await getCares(portal, companyId, { customerCareStaffs: [userId], month, year });
    //lấy ra danh sách hoạt động đã hoàn thành
    const listCareAction = getAllActions.cares;
    const listCompletionCare = listCareAction.filter((care) => { return (care.status == 3 || care.status == 5) });
    //lấy danh sách hoạt động quá hạn
    const listOverdueCareAction = listCareAction.filter((care) => { return (care.status == STATUS_VALUE.expired || care.status == STATUS_VALUE.completedOverdue) });
    if (listCareAction.length == 0) return { totalCareActions: listCareAction.length, completionRate: 0 };
    return { totalCareActions: listCareAction.length, numberOfCompletionCareAction: listCompletionCare.length, completionRate: (listCompletionCare.length) / (listCareAction.length), numberOfOverdueCareAction: listOverdueCareAction.length };
}
exports.getCustomerRetentionRate = async (portal, companyId, query, userId) => {
    const { month, year } = query;
    // neu ko co querry thi lay theo thang hien tai
    if (!month || !year) {
        const date = new Date();
        month = date.getMonth() + 1;
        year = date.getFullYear();
    }
    //-----------------------------
    //lấy danh sách khách hàng cũ
    const getAllCustomers = await getCustomers(portal, companyId, { month, year, customerOwner: [userId], isNewCustomer: false });
    const listCustomer = getAllCustomers.customers;
    //lấy ra danh sách đơn hàng trong tháng
    const getSalesOrders = await getAllSalesOrders(userId, { month, year }, portal);
    const listSalesOrders = getSalesOrders.allSalesOrders;
    let numberOfCustomerBuying = 0;
    listCustomer.forEach(customer => {
        for (let i = 0; i < listSalesOrders.length; i++) {
            if (listSalesOrders[i].customer == customer._id) {
                numberOfCustomerBuying++;
                break;
            }
        };
    });
    if (listCustomer.length == 0) return { numberOfOldCustomers: listCustomer.length, customerRetentionRate: 0 };
    return { numberOfOldCustomers: listCustomer.length, customerRetentionRate: (numberOfCustomerBuying) / (listCustomer.length) };
}
exports.getNewCustomerBuyingRate = async (portal, companyId, query, userId) => {
    const { month, year } = query;
    // neu ko co querry thi lay theo thang hien tai
    if (!month || !year) {
        const date = new Date();
        month = date.getMonth() + 1;
        year = date.getFullYear();
    }
    //-----------------------------
    //lấy danh sách khách hàng mới
    const getAllCustomers = await getCustomers(portal, companyId, { month, year, customerOwner: [userId], isNewCustomer: true });
    const listCustomer = getAllCustomers.customers;
    //lấy ra danh sách đơn hàng trong tháng
    const getSalesOrders = await getAllSalesOrders(userId, { month, year }, portal);
    const listSalesOrders = getSalesOrders.allSalesOrders;
    let numberOfCustomerBuying = 0;
    listCustomer.forEach(customer => {
        for (let i = 0; i < listSalesOrders.length; i++) {
            if (listSalesOrders[i].customer == customer._id) {
                numberOfCustomerBuying++;
                break;
            }
        };
    });
    if (listCustomer.length == 0) return { numberOfNewCustomers: 0, newCustomerBuyingRate: 0 };
    return { numberOfNewCustomers: listCustomer.length, newCustomerBuyingRate: (numberOfCustomerBuying) / (listCustomer.length) };
}