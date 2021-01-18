import React, { Component } from 'react';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { connect } from 'react-redux';
import { DatePicker, ErrorLabel, SelectMulti } from '../../../../../common-components';
import { worksActions } from '../../manufacturing-works/redux/actions';
// import moment from 'moment';
import { compareLtDate, compareLteDate, formatDate } from '../../../../../helpers/formatDate';
import { manufacturingPlanActions } from '../../manufacturing-plan/redux/actions';
import { commandActions } from '../../manufacturing-command/redux/actions';
import { LotActions } from '../../../warehouse/inventory-management/redux/actions';
import { SalesOrderActions } from '../../../order/sales-order/redux/actions';

class ManufacturingDashboardHeader extends Component {
    constructor(props) {
        super(props);
        // let currentDate = Date.now();
        this.state = {
            currentRole: localStorage.getItem('currentRole'),
            // fromDate: formatDate(moment(currentDate).startOf('month')),
            // toDate: formatDate(moment(currentDate).endOf('month')),
            manufacturingWorks: [],
            fromDate: '',
            toDate: ''
        }
    }

    // getStartMonthEndMonthFromString = (nowDate) => {
    //     const moment = require('moment');
    //     // start day of createdAt
    //     var startMonth = moment(nowDate).startOf('month');
    //     var endMonth = moment(endDate).endOf('month');

    //     return [formatDate(startMonth), formatDate(endMonth)];
    // }


    componentDidMount = () => {
        const data = {
            currentRole: this.state.currentRole
        }
        this.props.getAllManufacturingWorks(data)
        this.props.getNumberPlans(data)
        this.props.getNumberCommands(data)
        this.props.getNumberWorksSalesOrder(data)
    }

    getListManufacturingWorksArr = () => {
        const { manufacturingWorks } = this.props;
        const { listWorks } = manufacturingWorks;
        let listManufacturingWorksArr = [];
        if (listWorks) {
            listWorks.map((works) => {
                listManufacturingWorksArr.push({
                    value: works._id,
                    text: works.name
                });
            });
        }
        return listManufacturingWorksArr;
    }

    handleFromDateChange = (value) => {
        this.validateFromDateChange(value, true);
    };

    validateFromDateChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (value && this.state.toDate) {
            let obj = compareLteDate(value, this.state.toDate);
            console.log(obj.status);
            if (!obj.status) {
                msg = translate("manufacturing.plan.choose_date_error");
            }
        }
        if (willUpdateState) {
            this.setState((state) => ({
                ...state,
                fromDate: value,
                errorTime: msg
            }));
        }
        return msg;
    }


    handleToDateChange = (value) => {
        this.validateToDateChange(value, true);
    };

    validateToDateChange = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = this.props;
        if (value && this.state.fromDate) {
            console.log("to Date")
            let obj = compareLteDate(this.state.fromDate, value);
            if (!obj.status) {
                msg = translate("manufacturing.plan.choose_date_error");
            }
        }
        if (willUpdateState) {
            this.setState((state) => ({
                ...state,
                toDate: value,
                errorTime: msg
            }));
        }
        return msg;
    }

    handleManufacturingWorksChange = (value) => {
        this.setState((state) => ({
            ...state,
            manufacturingWorks: value
        }))
    }

    handleSubmitSearch = () => {
        const data = {
            currentRole: this.state.currentRole,
            manufacturingWorks: this.state.manufacturingWorks,
            fromDate: this.state.fromDate,
            toDate: this.state.toDate
        }
        this.props.getNumberPlans(data);
        this.props.getNumberPlansByStatus(data);
        this.props.getNumberCommands(data);
        this.props.getNumberCommandsStatus(data);
        this.props.getNumberLotsStatus(data);
        this.props.getNumberWorksSalesOrder(data);
    }



    render() {
        const { translate, manufacturingPlan, manufacturingCommand, salesOrders } = this.props;
        const { fromDate, toDate, errorTime } = this.state;
        let planNumber = {};
        if (manufacturingPlan.planNumber && manufacturingPlan.isLoading === false) {
            planNumber = manufacturingPlan.planNumber
        }
        let commandNumber = {};
        if (manufacturingCommand.commandNumber && manufacturingCommand.isLoading === false) {
            commandNumber = manufacturingCommand.commandNumber
        }

        let numberSalesOrdersWorks = {}

        if (salesOrders.numberSalesOrdersWorks && salesOrders.isLoading === false) {
            numberSalesOrdersWorks = salesOrders.numberSalesOrdersWorks
        }

        return (
            <React.Fragment>
                <div className="form-inline">
                    <div className="form-group">
                        <label style={{ width: "auto" }}>{translate('manufacturing.dashboard.choose_works')}</label>
                        <SelectMulti
                            id={`select-multi-works`}
                            multiple="multiple"
                            options={{ nonSelectedText: translate('manufacturing.plan.choose_works'), allSelectedText: translate('manufacturing.plan.choose_all') }}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={this.getListManufacturingWorksArr()}
                            onChange={this.handleManufacturingWorksChange}
                        />
                    </div>
                    {/**Chọn ngày bắt đầu */}
                    <div className={`form-group`}>
                        <label style={{ width: "auto" }}>{translate('manufacturing.dashboard.from')}</label>
                        <DatePicker
                            id="from-date-manufacturing-dashboard-header"
                            value={fromDate}
                            onChange={this.handleFromDateChange}
                            disabled={false}
                        />
                    </div>
                    {/**Chọn ngày kết thúc */}
                    <div className={`form-group`}>
                        <label style={{ width: "auto" }}>{translate('manufacturing.dashboard.to')}</label>
                        <DatePicker
                            id="end-day-manufacturing-dashboard-header"
                            value={toDate}
                            onChange={this.handleToDateChange}
                            disabled={false}
                        />
                    </div>

                    <div className="form-group">
                        <button type="button" disabled={errorTime} className="btn btn-success" title={translate('general.search')} onClick={() => this.handleSubmitSearch()} >{translate('general.search')}</button>
                    </div>
                </div>
                <div className="row" style={{ marginTop: 10 }}>
                    <div className="col-md-3 col-sm-3 col-xs-3">
                        <div className="info-box">
                            <span className="info-box-icon bg-aqua"><i className="fa fa-file"></i></span>
                            <div className="info-box-content" title={translate('manufacturing.dashboard.plan_total')} >
                                <span className="info-box-text">{translate('manufacturing.dashboard.plan_number')}</span>
                                <span className="info-box-number">{planNumber.totalPlans}</span>
                                <a href={`/manage-manufacturing-plan`} target="_blank" >{translate('manufacturing.dashboard.see_more')} <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-3 col-xs-3">
                        <div className="info-box">
                            <span className="info-box-icon bg-green"><i className="fa fa-file"></i></span>
                            <div className="info-box-content" title={translate('manufacturing.dashboard.progress_1')} >
                                <span className="info-box-text">{translate('manufacturing.dashboard.plan_number_1')}</span>
                                <span className="info-box-number">{planNumber.truePlans}/{planNumber.totalPlans}</span>
                                <a href={`/manage-manufacturing-plan`} target="_blank" >{translate('manufacturing.dashboard.see_more')} <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-3 col-xs-3">
                        <div className="info-box">
                            <span className="info-box-icon bg-yellow"><i className="fa fa-file"></i></span>
                            <div className="info-box-content" title={translate('manufacturing.dashboard.progress_2')} >
                                <span className="info-box-text">{translate('manufacturing.dashboard.plan_number_2')}</span>
                                <span className="info-box-number">{planNumber.slowPlans}/{planNumber.totalPlans}</span>
                                <a href={`/manage-manufacturing-plan`} target="_blank" >{translate('manufacturing.dashboard.see_more')} <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-3 col-xs-3">
                        <div className="info-box">
                            <span className="info-box-icon bg-red"><i className="fa fa-file"></i></span>
                            <div className="info-box-content" title={translate('manufacturing.dashboard.progress_3')} >
                                <span className="info-box-text">{translate('manufacturing.dashboard.plan_number_3')}</span>
                                <span className="info-box-number">{planNumber.expiredPlans}/{planNumber.totalPlans}</span>
                                <a href={`/manage-manufacturing-plan`} target="_blank" >{translate('manufacturing.dashboard.see_more')} <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row" style={{ marginTop: 10 }}>
                    <div className="col-md-4 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-blue"><i className="fa  fa-gavel"></i></span>
                            <div className="info-box-content" title={translate('manufacturing.dashboard.command_total')}>
                                <span className="info-box-text">{translate('manufacturing.dashboard.command_number')}</span>
                                <span className="info-box-number">{commandNumber.totalCommands}</span>
                                <a href={`/manage-manufacturing-command`} target="_blank" >{translate('manufacturing.dashboard.see_more')} <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-green"><i className="fa  fa-hourglass-half"></i></span>
                            <div className="info-box-content" title={translate('manufacturing.dashboard.command_number_1')}>
                                <span className="info-box-text">{translate('manufacturing.dashboard.command_progress_1')}</span>
                                <span className="info-box-number">{commandNumber.trueCommands}/{commandNumber.totalCommands}</span>
                                <a href={`/manage-manufacturing-command`} target="_blank" >{translate('manufacturing.dashboard.see_more')} <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-red"><i className="fa fa-exclamation"></i></span>
                            <div className="info-box-content" title={translate('manufacturing.dashboard.command_number_2')}>
                                <span className="info-box-text">{translate('manufacturing.dashboard.command_progress_2')}</span>
                                <span className="info-box-number">{commandNumber.slowCommands}/{commandNumber.totalCommands}</span>
                                <a href={`/manage-manufacturing-command`} target="_blank" >{translate('manufacturing.dashboard.see_more')} <i className="fa  fa-arrow-circle-o-right"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row" style={{ marginTop: "10px" }}>
                    <div className="col-md-4 col-sm-4 col-xs-4">
                        <div className="info-box with-border">
                            <span className="info-box-icon bg-green"><i className="fa fa-file-text"></i></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Số đơn sản xuất cần lên kế hoạch</span>
                                <span className="info-box-number">
                                    {numberSalesOrdersWorks.salesOrder1}
                                </span>
                                <a href={`/manage-manufacturing-plan`} target="_blank" >{translate('manufacturing.dashboard.see_more')} <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-4 col-xs-4">
                        <div className="info-box with-border">
                            <span className="info-box-icon bg-green"><i className="fa fa-file-text"></i></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Số đơn sản xuất đã xong lên kế hoạch</span>
                                <span className="info-box-number">
                                    {numberSalesOrdersWorks.salesOrder2}/{numberSalesOrdersWorks.salesOrder1}
                                </span>
                                <a href={`/manage-manufacturing-plan`} target="_blank" >{translate('manufacturing.dashboard.see_more')} <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-4 col-xs-4">
                        <div className="info-box with-border">
                            <span className="info-box-icon bg-red"><i className="fa fa-file-text"></i></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Số đơn sản xuất chưa lên xong kế hoạch</span>
                                <span className="info-box-number">
                                    {numberSalesOrdersWorks.salesOrder3}/{numberSalesOrdersWorks.salesOrder1}
                                </span>
                                <a href={`/manage-manufacturing-plan`} target="_blank" >{translate('manufacturing.dashboard.see_more')} <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

function mapStateToProps(state) {
    const { manufacturingWorks, manufacturingPlan, manufacturingCommand, salesOrders } = state;
    return { manufacturingWorks, manufacturingPlan, manufacturingCommand, salesOrders }
}

const mapDispatchToProps = {
    getAllManufacturingWorks: worksActions.getAllManufacturingWorks,
    getNumberPlans: manufacturingPlanActions.getNumberPlans,
    getNumberCommands: commandActions.getNumberCommands,
    getNumberPlansByStatus: manufacturingPlanActions.getNumberPlansByStatus,
    getNumberCommandsStatus: commandActions.getNumberCommandsStatus,
    getNumberLotsStatus: LotActions.getNumberLotsStatus,
    getNumberWorksSalesOrder: SalesOrderActions.getNumberWorksSalesOrder,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingDashboardHeader));