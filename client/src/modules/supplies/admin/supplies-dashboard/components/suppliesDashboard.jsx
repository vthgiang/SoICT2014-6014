import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import isEqual from 'lodash/isEqual';
import {SuppliesActions} from '../../supplies/redux/actions';
import {SuppliesDashboardActions} from '../redux/actions';
import Swal from 'sweetalert2';
import {DatePicker} from '../../../../../common-components';
import {getTableConfiguration} from '../../../../../helpers/tableConfiguration';

function SuppliesDashboard(props) {

    let d = new Date(),
        month = d.getMonth() + 1,
        year = d.getFullYear();
    let startMonth, endMonth, startYear;

    if (month > 3) {
        startMonth = month - 3;
        startYear = year;
    } else {
        startMonth = month - 3 + 12;
        startYear = year - 1;
    }
    if (startMonth < 10)
        startMonth = '0' + startMonth;
    if (month < 10) {
        endMonth = '0' + month;
    } else {
        endMonth = month;
    }

    let INFO_SEARCH = {
        typeOfChart: ["Bar"],
        purchaseDateAfter: [startYear, startMonth].join('-'),
        purchaseDateBefore: [year, endMonth].join('-'),
    }

    const defaultConfig = {limit: 10}
    const dashboardSuppliesId = "dashboard_supplies_by_type";
    const dashboardSupplies = getTableConfiguration(dashboardSuppliesId, defaultConfig).limit;

    const [state, setState] = useState({
        suppliesData: [],
        countInvoice: [],
        countAllocation: [],
        valueInvoice: [],

        purchaseDateAfter: INFO_SEARCH.purchaseDateAfter,
        purchaseDateBefore: INFO_SEARCH.purchaseDateBefore,
        defaultStartMonth: [startMonth, startYear].join('-'),
        defaultEndMonth: [endMonth, year].join('-'),

        page: 1,
        limit: dashboardSupplies,
        listSupplies: [],
    })

    useEffect(() => {
        props.getSuppliesDashboard({endTime: state.defaultStartMonth, startTime: state.defaultEndMonth});
    }, []);

    const handleChangeSupplies = (value) => {
        setState({
            ...state,
            listSupplies: value,
        })
        console.log("type", JSON.stringify(value));
    }

    const handleSelectSuppliesOfDisplay = async (value) => {
        INFO_SEARCH.displayBy = value
    }

    const handlePaginationSupplies = (page) => {
        const {limit} = state;
        let pageConvert = (page - 1) * (limit);

        setState({
            ...state,
            page: parseInt(pageConvert),
        })
    }

    const handleChangeDateAfter = async (value) => {
        let month = value.length == 4 ? value : value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)));
        INFO_SEARCH.purchaseDateAfter = month;
    }

    const handleChangeDateBefore = async (value) => {
        let month = value.length == 4 ? value : value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)));
        INFO_SEARCH.purchaseDateBefore = month;
    }

    const handleSearchData = async () => {
        let purchaseDateAfter = new Date(INFO_SEARCH.purchaseDateAfter);
        let purchaseDateBefore = new Date(INFO_SEARCH.purchaseDateBefore);

        if (purchaseDateAfter.getTime() > purchaseDateBefore.getTime()) {
            const {translate} = props;
            await Swal.fire({
                title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm'),
            })
        } else {
            props.getSuppliesDashboard({endTime: purchaseDateBefore, startTime: purchaseDateAfter})
        }
    }

    const setCountInvoice = (value) => {
        let {countInvoice} = state;

        if (!isEqual(countInvoice, value)) {
            setState(state => {
                return {
                    ...state,
                    countInvoice: value,
                }
            })
        }
    }

    const setCountAllocation = (value) => {
        let {countAllocation} = state;

        if (!isEqual(countAllocation, value)) {
            setState(state => {
                return {
                    ...state,
                    countAllocation: value,
                }
            })
        }
    }

    const setValueInvoice = (value) => {
        let {valueInvoice} = state;

        if (!isEqual(valueInvoice, value)) {
            setState(state => {
                return {
                    ...state,
                    valueInvoice: value,
                }
            })
        }
    }

    const {translate} = props;
    let {purchaseDateAfter, purchaseDateBefore} = INFO_SEARCH;
    let {pieChart, barChart, numberData} = props.suppliesDashboardReducer;

    console.log('DEBUG: pieChart: ', pieChart);
    console.log('DEBUG: barChart: ', barChart);
    console.log('DEBUG: numberData: ', numberData);

    let format = year == "true" ? "year" : "month-year";
    let startValue = year == "true" ? purchaseDateAfter.slice(0, 4) : purchaseDateAfter.slice(5, 7) + ' - ' + purchaseDateAfter.slice(0, 4);
    let endValue = year == "true" ? purchaseDateBefore.slice(0, 4) : purchaseDateBefore.slice(5, 7) + ' - ' + purchaseDateBefore.slice(0, 4);


    return (
        <React.Fragment>
            <div className='qlcv'>
                <div className="form-inline">
                    <div className="row">
                        <div className="form-group">
                            <label style={{width: 'auto', marginLeft: 12, marginRight: 10}}>{translate('task.task_management.from')}</label>
                            <DatePicker
                                id={`purchase_after${year}`}
                                dateFormat={format}
                                value={startValue}
                                onChange={handleChangeDateAfter}
                                disabled={false}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{width: 'auto', marginLeft: 12, marginRight: 10}}>{translate('task.task_management.to')}</label>
                            <DatePicker
                                id={`purchase_before${year}`}
                                dateFormat={format}
                                value={endValue}
                                onChange={handleChangeDateBefore}
                                disabled={false}
                            />
                        </div>
                        <button className="btn btn-success"
                                onClick={handleSearchData}>{translate('task.task_management.search')}</button>
                    </div>
                </div>
                <div className="row" style={{marginTop: 10}}>
                    <div className="col-md-6 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-green"><i className="fa fa-check"></i></span>
                            <div className="info-box-content">
                                <span className="info-box-text">{`Tổng số vật tư: ${numberData.supplies.totalSupplies}`}</span>
                                <span className="info-box-text">{`Tổng giá trị: ${numberData.supplies.suppliesPrice}`}</span>
                                <a href="/manage-info-asset?status=ready_to_use">{translate('asset.general_information.view_more')}
                                    <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-aqua"><i className="fa fa-play"></i></span>
                            <div className="info-box-content" style={{paddingBottom: 0}}>
                                <span className="info-box-text">{`Tổng số hóa đơn: ${numberData.purchaseInvoice.totalPurchaseInvoice}`}</span>
                                <span className="info-box-text">{`Tổng giá trị: ${numberData.purchaseInvoice.purchaseInvoicesPrice}`}</span>
                                <a href="/manage-info-asset?status=in_use">{translate('asset.general_information.view_more')}
                                    <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-yellow"><i className="fa fa-warning"></i></span>
                            <div className="info-box-content" style={{paddingBottom: 0}}>
                                <span className="info-box-text">{`Tổng số cấp phát: ${numberData.allocationHistory.allocationHistoryTotal}`}</span>
                                <span className="info-box-text">{`Tổng giá trị: ${numberData.allocationHistory.allocationHistoryPrice}`}</span>
                                <a href="/manage-info-asset?status=broken">{translate('asset.general_information.view_more')}
                                    <i className="fa  fa-arrow-circle-o-right"></i></a>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-red"><i className="fa fa-calendar-times-o"></i></span>
                            <div className="info-box-content" style={{paddingBottom: 0}}>
                                <span className="info-box-text">{`Tổng số yêu cầu chưa xử lý: ${numberData.purchaseRequest.waitingForApprovalTotal}`}</span>
                                <span className="info-box-text">{`Tổng số yêu cầu đã chấp nhận: ${numberData.purchaseRequest.approvedTotal}`}</span>
                                <span className="info-box-text">{`Tổng số yêu cầu đã từ chối: ${numberData.purchaseRequest.disapprovedTotal}`}</span>
                                <a href="/manage-info-asset?status=disposed">{translate('asset.general_information.view_more')}
                                    <i className="fa  fa-arrow-circle-o-right"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

function mapState(state) {
    const {suppliesReducer, suppliesDashboardReducer} = state;
    return {suppliesReducer, suppliesDashboardReducer};
}

const mapDispatchToProps = {
    searchSupplies: SuppliesActions.searchSupplies,
    getSuppliesDashboard: SuppliesDashboardActions.getSuppliesDashboard,
}

const dashboardSuppliesConnect = connect(mapState, mapDispatchToProps)(withTranslate(SuppliesDashboard));
export {dashboardSuppliesConnect as SuppliesDashboard};