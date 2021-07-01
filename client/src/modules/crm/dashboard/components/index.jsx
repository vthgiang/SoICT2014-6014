import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import c3 from "c3";
import "c3/c3.css";
import C3Chart from 'react-c3js';
import 'c3/c3.css';
import { CrmEvaluationActions } from '../../evaluation/redux/action';
import { useEffect } from 'react';
import { CrmStatusActions } from '../../status/redux/actions';
import { CrmGroupActions } from '../../group/redux/actions';
import { CrmUnitActions } from '../../crmUnitConfiguration/redux/actions';


function CrmDashBoard(props) {
    const { user, crm, auth } = props;
    const { evaluations, status, groups } = crm;
    let customerCareInfoByEmployee;
    if (evaluations && evaluations.customerCareInfoByEmployee) customerCareInfoByEmployee = evaluations.customerCareInfoByEmployee;
    useEffect(() => {
        props.getCustomerCareInfoByEmployee(auth.user._id);
        props.getCrmUnits();
    }, [])


    // tạo dữ liệu cho các biểu đồ
    let listManagedCustomer = [];
    let customerDataByGroup = [];
    let customerDataByStatus = [];
    let x = ['x'];
    let solutionRateData = ['Tỉ lệ thành công %']
    let completionRateData = ['Tỉ lệ hoàn thành hoạt động %']

    if (customerCareInfoByEmployee) {
        customerDataByGroup = customerCareInfoByEmployee.customerDataByGroup;
        customerDataByStatus = customerCareInfoByEmployee.customerDataByStatus;
        listManagedCustomer = customerCareInfoByEmployee.listManagedCustomer;
        x=x.concat(customerCareInfoByEmployee.x.reverse());
        solutionRateData=solutionRateData.concat(customerCareInfoByEmployee.solutionRateData.reverse());
        completionRateData=completionRateData.concat(customerCareInfoByEmployee.completionRateData.reverse());
    }
    console.log('solutionRateData',x);
    const customerByStatusGraph = {
        columns: customerDataByStatus, type: 'pie'
    };
    const customerByGroupGraph = {
        columns: customerDataByGroup, type: 'pie'
    };
    const data = {
        x: 'x',
        xFormat: '%m/%Y',
        columns: [
            x, completionRateData, solutionRateData
        ]
    };
    const axis = {
        x: {
            type: 'timeseries',
            tick: {
                format: '%m/%Y'
            }
        }
    }

    return (
        <div className="container-fluid">
            <div className="row" >
                <div className="col-md-3 col-sm-6 col-xs-12">
                    <div className="info-box">
                        <span className="info-box-icon bg-aqua"><i class="fa fa-users" /></span>
                        <div className="info-box-content">
                            <span className="info-box-text">{"Số khách hàng quản lý"}</span>
                            <span className="info-box-number">{customerCareInfoByEmployee ? customerCareInfoByEmployee.listManagedCustomer.length : 0}</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-sm-6 col-xs-12">
                    <div className="info-box">
                        <span className="info-box-icon bg-yellow"><i className="fa fa-handshake-o" /></span>
                        <div className="info-box-content">
                            <span className="info-box-text">{"Tổng sô hoạt động tháng 3"}</span>
                            <span className="info-box-number">{customerCareInfoByEmployee ? customerCareInfoByEmployee.totalCareActions : 0}</span>
                        </div>
                    </div>
                </div>

                <div className="clearfix visible-sm-block" />
                <div className="col-md-3 col-sm-6 col-xs-12">
                    <div className="info-box">
                        <span className="info-box-icon bg-green"><i className="fa fa-check-circle-o" /></span>
                        <div className="info-box-content">
                            <span className="info-box-text">{'Số hoạt động đã hoàn thành'}</span>
                            <span className="info-box-number">{customerCareInfoByEmployee ? customerCareInfoByEmployee.numberOfCompletionCareAction : 0}</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-sm-6 col-xs-12">
                    <div className="info-box">
                        <span className="info-box-icon bg-red"><i className="fa fa-exclamation" /></span>
                        <div className="info-box-content">
                            <span className="info-box-text">{'Số hoạt động quá hạn'}</span>
                            <span className="info-box-number">{customerCareInfoByEmployee ? customerCareInfoByEmployee.numberOfOverdueCareAction : 0}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row" style={{ marginTop: '60px', textAlign: 'center' }}>
                <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                    <C3Chart data={customerByGroupGraph} />
                    <label > <span>Biểu đồ khách hàng theo nhóm </span></label>
                </div>
                <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                    <C3Chart data={customerByStatusGraph} />
                    <label > <span>Biểu đồ khách hàng theo trạng thái</span></label>
                </div>

            </div>
            <div className="row" style={{ marginTop: '10px', textAlign: 'center' }}>

                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <C3Chart data={data} axis={axis} />
                    <label > <span>Biểu đồ đánh giá hoạt động CSKH</span></label>
                </div>
            </div>
        </div>
    );
}



function mapStateToProps(state) {
    const { crm, user, auth } = state;
    return { crm, user, auth };
}

const mapDispatchToProps = {
    getCustomerCareInfoByEmployee: CrmEvaluationActions.getCustomerCareInfoByEmployee,
    getStatus: CrmStatusActions.getStatus,
    getGroups: CrmGroupActions.getGroups,
    getCrmUnits:CrmUnitActions.getCrmUnits,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmDashBoard));
