const mongoose = require("mongoose");
const { Care, User, Status } = require('../../../models');
const { connect } = require(`../../../helpers/dbHelper`);
const { getAllEmployeeOfUnitByRole } = require("../../super-admin/user/user.service");
const { getCares } = require("../care/care.service");
const { getCustomers } = require("../customer/customer.service");


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
function  filterData (care, month, year){
    let beginOfMonth = new Date(`${year}-${month}`); // cần chỉnh lại 
    let endOfMonth = new Date(year, month); // cần chỉnh lại
    if (care.endDate<beginOfMonth) return false;
    else if( care.startDate> endOfMonth) return false;
    else return true;
}
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
        month = date.getMonth();
        year = date.getFullYear();
    }
    //---------------------------------
    const listEmployee = await getAllEmployeeOfUnitByRole(portal, currentRole);
    let evaluations = [];
    for (const employee of listEmployee) {
        let listCustomer = await getCustomers(portal, companyId, { customerOwner: [employee.userId._id] });

        let cares = await getCares(portal, companyId, { customerCareStaffs: [employee.userId._id] });
        listCustomerCare = cares.cares.filter((care)=>filterData(care,month,year));
      
        // tính số hoạt động hoàn thành và số điểm trung bình

        let numberOfCompletedCares = 0;
        let numberOfProcessingCares = 0;
        let numberOfExpiredCares = 0;
        let totalPoint = 0;
        let successTime = 0;
        listCustomerCare.forEach(care => {
            if (care.status == STATUS_VALUE.accomplished || care.status == STATUS_VALUE.completedOverdue) {
                numberOfCompletedCares++;

                if (care.evaluation.point) totalPoint += parseFloat(care.evaluation.point);
                if (care.evaluation.result == 1) successTime++;
            }
            else if (care.status == STATUS_VALUE.expired) numberOfExpiredCares++;
            else if (care.status == STATUS_VALUE.processing) numberOfProcessingCares++;
        });
        let totalCare = listCustomerCare.length;
        let numberOfCustomers = listCustomer.listDocsTotal;
        let successRate = 0;
        if (successTime) successRate = successTime / numberOfCompletedCares;
        let averagePoint = 0;
        if (totalPoint) averagePoint = totalPoint / numberOfCompletedCares;
        evaluations = [...evaluations, { staffCode: `NV${employee.userId._id}`, staffName: employee.userId.name, numberOfCustomers, numberOfCompletedCares, numberOfExpiredCares, numberOfProcessingCares, successRate, averagePoint, totalCare }]
       
    }
    return evaluations
}

