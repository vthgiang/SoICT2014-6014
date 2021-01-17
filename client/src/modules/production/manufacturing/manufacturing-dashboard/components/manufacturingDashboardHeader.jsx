import React, { Component } from 'react';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { connect } from 'react-redux';
import { DatePicker, SelectMulti } from '../../../../../common-components';
import { worksActions } from '../../manufacturing-works/redux/actions';
import moment from 'moment';
import { formatDate } from '../../../../../helpers/formatDate';

class ManufacturingDashboardHeader extends Component {
    constructor(props) {
        super(props);
        let currentDate = Date.now();
        this.state = {
            currentRole: localStorage.getItem('currentRole'),
            fromDate: formatDate(moment(currentDate).startOf('month')),
            toDate: formatDate(moment(currentDate).endOf('month'))
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




    render() {
        const { translate } = this.props;
        const { fromDate, toDate } = this.state;
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
                    <div className="form-group">
                        <label style={{ width: "auto" }}>{translate('manufacturing.dashboard.from')}</label>
                        <DatePicker
                            id="start-day-manufacturing-dashboard-header"
                            value={fromDate}
                            onChange={this.handleSelectMonthStart}
                            disabled={false}
                        />
                    </div>

                    {/**Chọn ngày kết thúc */}
                    <div className="form-group">
                        <label style={{ width: "auto" }}>{translate('manufacturing.dashboard.to')}</label>
                        <DatePicker
                            id="end-day-manufacturing-dashboard-header"
                            value={toDate}
                            onChange={this.handleSelectMonthEnd}
                            disabled={false}
                        />
                    </div>

                    <div className="form-group">
                        <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => this.handleSunmitSearch()} >{translate('general.search')}</button>
                    </div>
                </div>
                <div className="row" style={{ marginTop: 10 }}>
                    <div className="col-md-3 col-sm-3 col-xs-3">
                        <div className="info-box">
                            <span className="info-box-icon bg-aqua"><i className="fa fa-file"></i></span>
                            <div className="info-box-content" title={translate('manufacturing.dashboard.plan_total')} >
                                <span className="info-box-text">{translate('manufacturing.dashboard.plan_number')}</span>
                                <span className="info-box-number">100</span>
                                <a href={`/manage-manufacturing-plan`} target="_blank" >{translate('manufacturing.dashboard.see_more')} <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-3 col-xs-3">
                        <div className="info-box">
                            <span className="info-box-icon bg-green"><i className="fa fa-file"></i></span>
                            <div className="info-box-content" title={translate('manufacturing.dashboard.progress_1')} >
                                <span className="info-box-text">{translate('manufacturing.dashboard.plan_number_1')}</span>
                                <span className="info-box-number">100</span>
                                <a href={`/manage-manufacturing-plan`} target="_blank" >{translate('manufacturing.dashboard.see_more')} <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-3 col-xs-3">
                        <div className="info-box">
                            <span className="info-box-icon bg-yellow"><i className="fa fa-file"></i></span>
                            <div className="info-box-content" title={translate('manufacturing.dashboard.progress_2')} >
                                <span className="info-box-text">{translate('manufacturing.dashboard.plan_number_2')}</span>
                                <span className="info-box-number">100</span>
                                <a href={`/manage-manufacturing-plan`} target="_blank" >{translate('manufacturing.dashboard.see_more')} <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-3 col-xs-3">
                        <div className="info-box">
                            <span className="info-box-icon bg-red"><i className="fa fa-file"></i></span>
                            <div className="info-box-content" title={translate('manufacturing.dashboard.progress_3')} >
                                <span className="info-box-text">{translate('manufacturing.dashboard.plan_number_3')}</span>
                                <span className="info-box-number">100</span>
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
                                <span className="info-box-number">200</span>
                                <a href={`/manage-manufacturing-command`} target="_blank" >{translate('manufacturing.dashboard.see_more')} <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-green"><i className="fa  fa-hourglass-half"></i></span>
                            <div className="info-box-content" title={translate('manufacturing.dashboard.command_number_1')}>
                                <span className="info-box-text">{translate('manufacturing.dashboard.command_progress_1')}</span>
                                <span className="info-box-number">200</span>
                                <a href={`/manage-manufacturing-command`} target="_blank" >{translate('manufacturing.dashboard.see_more')} <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6 col-xs-6">
                        <div className="info-box">
                            <span className="info-box-icon bg-red"><i className="fa fa-exclamation"></i></span>
                            <div className="info-box-content" title={translate('manufacturing.dashboard.command_number_2')}>
                                <span className="info-box-text">{translate('manufacturing.dashboard.command_progress_2')}</span>
                                <span className="info-box-number">6</span>
                                <a href={`/manage-manufacturing-command`} target="_blank" >{translate('manufacturing.dashboard.see_more')} <i className="fa  fa-arrow-circle-o-right"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row" style={{ marginTop: "10px" }}>
                    <div className="col-md-4 col-sm-6 col-xs-6">
                        <div className="info-box with-border">
                            <span className="info-box-icon bg-aqua"><i className="fa fa-file-text"></i></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Số đơn sản xuất</span>
                                <span className="info-box-number">
                                    300
                                </span>
                                <a href={`/manage-manufacturing-plan`} target="_blank" >{translate('manufacturing.dashboard.see_more')} <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6 col-xs-6">
                        <div className="info-box with-border">
                            <span className="info-box-icon bg-green"><i className="fa fa-file-text"></i></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Số đơn sản xuất đã lên kế hoạch</span>
                                <span className="info-box-number">
                                    300
                                </span>
                                <a href={`/manage-manufacturing-plan`} target="_blank" >{translate('manufacturing.dashboard.see_more')} <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 col-sm-6 col-xs-6">
                        <div className="info-box with-border">
                            <span className="info-box-icon bg-red"><i className="fa fa-file-text"></i></span>
                            <div className="info-box-content">
                                <span className="info-box-text">Số đơn sản xuất chưa lên kế hoạch</span>
                                <span className="info-box-number">
                                    300
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
    const { manufacturingWorks } = state;
    return { manufacturingWorks }
}

const mapDispatchToProps = {
    getAllManufacturingWorks: worksActions.getAllManufacturingWorks
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingDashboardHeader));