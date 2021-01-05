import React, { Component } from 'react';
import { connect } from 'react-redux';

import { taskManagementActions } from '../../task-management/redux/actions';

import { DatePicker } from '../../../../common-components';
import { SelectMulti } from '../../../../common-components/index';

import { withTranslate } from 'react-redux-multilingual';

import c3 from 'c3';
import 'c3/c3.css';


class WeightTaskChart extends Component {
    constructor(props) {
        super(props);

        let { translate } = this.props;

        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
        this.ROLE = { RESPONSIBLE: 1, ACCOUNTABLE: 2, CONSULTED: 3, INFORMED: 4, CREATOR: 5 };
        this.state = {
            aPeriodOfTime: true,
            userId: localStorage.getItem("userId"),

            dataStatus: this.DATA_STATUS.QUERYING,

            role: this.DATA_SEARCH,

            willUpdate: false,       // Khi true sẽ cập nhật dữ liệu vào props từ redux
            callAction: false
        };
    }

    componentDidMount() {

        this.props.getAllTask(['responsible', 'accountable', 'consulted'], [], 1, 1000, [], [], [], null, this.state.startMonth, this.state.endMonth,
            null, null, this.state.aPeriodOfTime);
    }
    handleSelectMonthStart = (value) => {
        let month, monthtitle;

        if (value.slice(0, 2) < 10) {
            month = value.slice(3, 7) + '-0' + (new Number(value.slice(0, 2)));
        } else {
            month = value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)));
        }

        monthtitle = value.slice(0, 2) + '-' + value.slice(3, 7)

        this.INFO_SEARCH.startMonth = month;
        this.INFO_SEARCH.endMonth = monthtitle;
    }


    handleSelectMonthEnd = (value) => {
        let month, monthtitle;

        if (value.slice(0, 2) < 12) {
            if (value.slice(0, 2) < 9) {
                month = value.slice(3, 7) + '-0' + (new Number(value.slice(0, 2)) + 1);
            } else {
                month = value.slice(3, 7) + '-' + (new Number(value.slice(0, 2)) + 1);
            }

            monthtitle = value.slice(0, 2) + '-' + value.slice(3, 7);
        } else {
            month = (new Number(value.slice(3, 7)) + 1) + '-' + '01';
            monthtitle = '12' + '-' + (new Number(value.slice(3, 7)));
        }

        this.INFO_SEARCH.endMonth = month;
        this.INFO_SEARCH.endMonth = monthtitle;
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {

        if (nextProps.callAction !== prevState.callAction || nextProps.startMonth !== prevState.startMonth || nextProps.endMonth !== prevState.endMonth || nextProps.TaskOrganizationUnitDashboard !== prevState.TaskOrganizationUnitDashboard) {
            return {
                ...prevState,
                callAction: nextProps.callAction,
                startMonth: nextProps.startMonth,
                endMonth: nextProps.endMonth,
                //  TaskOrganizationUnitDashboard: nextProps.TaskOrganizationUnitDashboard
            }
        } else {
            return null
        }
    }

    shouldComponentUpdate = async (nextProps, nextState) => {
        if (nextState.dataStatus === this.DATA_STATUS.QUERYING) {
            if (nextProps.tasks && nextProps.tasks.length) {
                this.setState(state => {
                    return {
                        ...state,
                        dataStatus: this.DATA_STATUS.AVAILABLE
                    }
                })
            }
            return false;
        }
        else if (nextState.dataStatus === this.DATA_STATUS.AVAILABLE) {

            window.$(`#list-document`).slideDown();

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.FINISHED
                }
            })

        }
        return false;

    }


    render() {

        let { translate } = this.props;
        let { startMonth, endMonth } = this.state;

        return (
            <div>
                <div class="row">
                    <div class="col-xs-12">
                        <div className="form-inline">
                            <div className="col-sm-6 col-xs-12 form-group" >
                                <label>{translate('kpi.evaluation.employee_evaluation.from')}</label>
                                <DatePicker
                                    id="month-start-amount-of-task"
                                    dateFormat="month-year"
                                    value={startMonth}
                                    onChange={this.handleSelectMonthTaskStart}
                                    disabled={false}
                                />
                            </div>
                            <div className="col-sm-6 col-xs-12 form-group" >
                                <label>{translate('kpi.evaluation.employee_evaluation.to')}</label>
                                <DatePicker
                                    id="month-end-amount-of-task"
                                    dateFormat="month-year"
                                    value={endMonth}
                                    onChange={this.handleSelectMonthTaskEnd}
                                    disabled={false}
                                />
                            </div>
                        </div>
                        <div className="col-sm-6 col-xs-12 form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" onClick={this.handleSearchData}>{translate('kpi.evaluation.employee_evaluation.search')}</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


}


function mapState(state) {
    const { tasks } = state;
    return { tasks }
}
const actions = {
    getAllTask: taskManagementActions.getPaginateTasks,

}

const connectedWeightTaskChart = connect(mapState, actions)(withTranslate(WeightTaskChart));
export { connectedWeightTaskChart as WeightTaskChart };