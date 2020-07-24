import React, { Component } from 'react';
import { connect } from 'react-redux';

import { createKpiSetActions } from '../../../employee/creation/redux/actions';

import { DatePicker } from '../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual'
import Swal from 'sweetalert2';

import 'c3/c3.css';

class ResultsOfAllEmployeeKpiSetChart extends Component {

    constructor(props) {
        super(props);

        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth();

        this.INFO_SEARCH = {
            startDate: currentYear + '-' + 1,
            endDate: currentYear + '-' + (currentMonth + 2)
        }

        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
        this.KIND_OF_POINT = { AUTOMATIC: 1, EMPLOYEE: 2, APPROVED: 3 };

        this.state = {
            userRoleId: localStorage.getItem("currentRole"),
            startDate: this.INFO_SEARCH.startDate,
            endDate: this.INFO_SEARCH.endDate,
            dataStatus: this.DATA_STATUS.QUERYING,
            kindOfPoint: this.KIND_OF_POINT.AUTOMATIC
        }
    }

    /** Select kind of point */
    handleSelectKindOfPoint = (value) => {
        if (Number(value) !== this.state.kindOfPoint) {
            this.setState(state => {
                return {
                    ...state,
                    kindOfPoint: Number(value)
                }
            })
        }
    }

    /** Select month start in box */
    handleSelectMonthStart = (value) => {
        var month = value.slice(3, 7) + '-' + value.slice(0, 2);

        this.INFO_SEARCH.startDate = month;
    }

    /** Select month end in box */
    handleSelectMonthEnd = async (value) => {
        if (value.slice(0, 2) < 12) {
            var month = value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)) + 1);
        } else {
            month = (new Number(value.slice(3, 7)) + 1) + '-' + '1';
        }

        this.INFO_SEARCH.endDate = month;
    }

    /** Search data */
    handleSearchData = async () => {
        var startDate = new Date(this.INFO_SEARCH.startDate);
        var endDate = new Date(this.INFO_SEARCH.endDate);

        if (startDate.getTime() >= endDate.getTime()) {
            const { translate } = this.props;
            Swal.fire({
                title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
            })
        } else {
            await this.setState(state => {
                return {
                    ...state,
                    startDate: this.INFO_SEARCH.startDate,
                    endDate: this.INFO_SEARCH.endDate
                }
            })
        }
    }

    removePreviosChart = () => {
        const chart = this.refs.chart;
        while (chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild);
        }
    }

    multiLineChart = () => {

    }

    render() {
        const { translate } = this.props;
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        var defaultEndDate = [month, year].join('-');
        var defaultStartDate = ['01', year].join('-');

        return (
            <React.Fragment>
                <section className="form-inline">
                    <div className="form-group">
                        <label>{translate('kpi.evaluation.employee_evaluation.from')}</label>
                        <DatePicker
                            id="monthStartInResultsOfAllEmployeeKpiSetChart"
                            dateFormat="month-year"          
                            value={defaultStartDate}  
                            onChange={this.handleSelectMonthStart}
                            disabled={false}            
                        />
                    </div>
                </section>
                <section className="form-inline">
                    <div className="form-group">
                        <label>{translate('kpi.evaluation.employee_evaluation.to')}</label>
                        <DatePicker
                            id="monthEndInResultsOfAllEmployeeKpiSetChart"
                            dateFormat="month-year"      
                            value={defaultEndDate}     
                            onChange={this.handleSelectMonthEnd}
                            disabled={false}            
                        />
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-success" onClick={this.handleSearchData}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
                    </div>
                </section>

                <section className="box-body" style={{ textAlign: "right" }}>
                    <div className="btn-group">
                        <button type="button" className={`btn btn-xs ${this.state.kindOfPoint === this.KIND_OF_POINT.AUTOMATIC ? 'btn-danger' : null}`} onClick={() => this.handleSelectKindOfPoint(this.KIND_OF_POINT.AUTOMATIC)}>{translate('kpi.evaluation.dashboard.auto_point')}</button>
                        <button type="button" className={`btn btn-xs ${this.state.kindOfPoint === this.KIND_OF_POINT.EMPLOYEE ? 'btn-danger' : null}`} onClick={() => this.handleSelectKindOfPoint(this.KIND_OF_POINT.EMPLOYEE)}>{translate('kpi.evaluation.dashboard.employee_point')}</button>
                        <button type="button" className={`btn btn-xs ${this.state.kindOfPoint === this.KIND_OF_POINT.APPROVED ? 'btn-danger' : null}`} onClick={() => this.handleSelectKindOfPoint(this.KIND_OF_POINT.APPROVED)}>{translate('kpi.evaluation.dashboard.approve_point')}</button>
                    </div>

                    <div ref="chart"></div>
                </section>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { createEmployeeKpiSet } = state;
    return { createEmployeeKpiSet };
}
const actions = {
    getAllEmployeeKpiSetByMonth: createKpiSetActions.getAllEmployeeKpiSetByMonth
}

const connectedResultsOfAllEmployeeKpiSetChart = connect(mapState, actions)(withTranslate(ResultsOfAllEmployeeKpiSetChart));
export { connectedResultsOfAllEmployeeKpiSetChart as ResultsOfAllEmployeeKpiSetChart };