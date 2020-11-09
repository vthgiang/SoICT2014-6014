import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DataTableSetting, DatePicker, PaginateBar, SelectMulti, SlimScroll } from '../../../../../../common-components';
import { formatToTimeZoneDate, formatYearMonth } from '../../../../../../helpers/formatDate';
import { millActions } from '../../../manufacturing-mill/redux/actions';
import { worksActions } from '../../../manufacturing-works/redux/actions';
import { workScheduleActions } from '../../redux/actions';
import WorkerScheduleCreateForm from './workerScheduleCreateForm';
import './workerScheduleManagementTable.css'

class WorkerScheduleManagementTable extends Component {
    constructor(props) {
        super(props);
        let currentDate = Date.now();
        let currentMonthYear = formatYearMonth(currentDate);
        let allDaysOfMonth = this.getAllDaysOfMonth(currentMonthYear);
        this.state = {
            limit: 5,
            page: 1,
            month: currentMonthYear,
            allDaysOfMonth: allDaysOfMonth,
            employeeNumber: '',
            works: []
        }
    }

    componentDidMount = () => {
        let { limit, page, month } = this.state;
        let data = {
            limit: limit,
            page: page,
            object: "employee",
            month: formatToTimeZoneDate(month)
        }
        this.props.getAllWorkSchedulesWorker(data);
        this.props.getAllManufacturingWorks({ status: 1 });
        this.props.setCurrentMonth(month);
    }

    getAllDaysOfMonth = (month) => {
        let arrayMonthYear = month.split("-");
        let lastDaysOfMonth = new Date(arrayMonthYear[1], arrayMonthYear[0], 0);
        let days = lastDaysOfMonth.getDate();

        let arrayDayOfMonth = [];
        for (let i = 1; i <= days; i++) {
            arrayDayOfMonth.push(i);
        }
        return arrayDayOfMonth;
    }


    getListWorksArray = () => {
        const { manufacturingWorks } = this.props;
        let listWorksArray = [];
        const { listWorks } = manufacturingWorks;
        if (listWorks) {
            listWorks.map((works, index) => {
                listWorksArray.push({
                    value: works._id,
                    text: works.code + " - " + works.name
                })
            })
        }

        return listWorksArray;
    }

    handleWorksChange = (value) => {
        this.setState((state) => ({
            ...state,
            works: value
        }));
        console.log(this.state);
    }

    handleChangeMonth = (value) => {
        this.setState((state) => ({
            ...state,
            month: value
        }))
    }

    setLimit = async (limit) => {
        await this.setState((state) => ({
            ...state,
            limit: limit
        }));
        let { page, month } = this.state;
        let data = {
            limit: limit,
            page: page,
            object: "employee",
            month: formatToTimeZoneDate(month)
        }
        this.props.getAllWorkSchedulesWorker(data)
    }

    setPage = async (page) => {
        await this.setState((state) => ({
            ...state,
            page: page
        }));
        let { limit, month } = this.state;
        let data = {
            limit: limit,
            page: page,
            object: "employee",
            month: formatToTimeZoneDate(month)
        }
        this.props.getAllWorkSchedulesWorker(data);
    }

    handleEmployeeNumberChange = (e) => {
        const { value } = e.target;
        this.setState((state) => ({
            ...state,
            employeeNumber: value
        }));
    }

    handleSubmitSearch = () => {
        let { month } = this.state;
        let allDaysOfMonth = this.getAllDaysOfMonth(month);
        this.setState((state) => ({
            ...state,
            allDaysOfMonth: allDaysOfMonth
        }));
        let { limit, page, employeeNumber, works } = this.state;
        let data = {
            employeeNumber: employeeNumber,
            works: works,
            limit: limit,
            page: page,
            object: "employee",
            month: formatToTimeZoneDate(month)
        }
        this.props.getAllWorkSchedulesWorker(data)
        this.props.setCurrentMonth(month);
    }

    render() {
        console.log(this.state);
        const { translate, workSchedule } = this.props;
        let listWorkSchedulesWorker = [];
        if (workSchedule.listWorkSchedulesWorker && workSchedule.isLoading === false) {
            listWorkSchedulesWorker = workSchedule.listWorkSchedulesWorker;
        }
        const { totalPages, page } = workSchedule;
        const { month, allDaysOfMonth, employeeNumber } = this.state;
        return (
            <React.Fragment>
                {
                    <WorkerScheduleCreateForm />
                }
                <div className="box-body qlcv">
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.work_schedule.employee_number')}</label>
                            <input type="text" className="form-control" value={employeeNumber} onChange={this.handleEmployeeNumberChange} placeholder="MS2015122" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.work_schedule.works')}</label>
                            <SelectMulti
                                id={`multi-select-works`}
                                multiple="multiple"
                                options={{ nonSelectedText: translate("manufacturing.work_schedule.all_works"), allSelectedText: translate("manufacturing.work_schedule.all_works") }}
                                onChange={this.handleWorksChange}
                                items={this.getListWorksArray()}
                            >
                            </SelectMulti>
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.work_schedule.time')}</label>
                            <DatePicker
                                id={`month-worker`}
                                dateFormat={"month-year"}
                                value={month}
                                onChange={this.handleChangeMonth}
                                disabled={false}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static"></label>
                            <button type="button" className="btn btn-success" title={translate('manufacturing.work_schedule.search')} onClick={this.handleSubmitSearch}>{translate('manufacturing.work_schedule.search')}</button>
                        </div>
                    </div>
                </div>
                <DataTableSetting
                    tableId="info-mill-table-worker"
                    limit={this.state.limit}
                    setLimit={this.setLimit}
                    hideColumnOption={false}
                />
                <div id="croll-table-worker" className="form-inline">
                    <div className="col-lg-6 col-md-6 col-sm-7 col-xs-8" style={{ padding: 0 }}>
                        <table id="info-mill-table-worker" className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>{translate('manufacturing.work_schedule.employee_number')}</th>
                                    <th>{translate('manufacturing.work_schedule.employee_name')}</th>
                                    <th>{translate('manufacturing.work_schedule.work_turns')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    listWorkSchedulesWorker.length !== 0 && listWorkSchedulesWorker.map((schedule, index) => {
                                        let numberOfTurns = schedule.turns.length ? schedule.turns.length : 1;
                                        let arrayTurnsWithoutOne = [];
                                        if (numberOfTurns > 1) {
                                            for (let i = 2; i <= numberOfTurns; i++) {
                                                arrayTurnsWithoutOne.push(i);
                                            }
                                        }
                                        return (
                                            <React.Fragment key={index}>
                                                <tr key={index}>
                                                    <td rowSpan={numberOfTurns}>{schedule.employee && schedule.employee.employeeNumber}</td>
                                                    <td rowSpan={numberOfTurns}>{schedule.employee && schedule.employee.fullName}</td>
                                                    <td>
                                                        {translate('manufacturing.work_schedule.turn_1')}
                                                    </td>
                                                </tr>
                                                {
                                                    arrayTurnsWithoutOne.map((x, index) => (
                                                        <tr key={index}>
                                                            <td>{translate(`manufacturing.work_schedule.turn_${x}`)}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </React.Fragment>

                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-5 col-xs-4" style={{ padding: 0 }}>
                        <table id="work-schedule-table-worker" className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    {
                                        allDaysOfMonth.map((day, index) => (
                                            <th key={index}>{day}</th>
                                        ))

                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    listWorkSchedulesWorker.length !== 0 && listWorkSchedulesWorker.map((schedule, index1) =>
                                        (
                                            schedule.turns.map((turn, index2) => (
                                                <tr key={index2}>
                                                    {
                                                        turn.map((mill, index3) => {
                                                            if (mill === null)
                                                                return (
                                                                    <td key={index3}>
                                                                        <input type="checkbox" disabled={true} />
                                                                    </td>
                                                                )

                                                            return null;
                                                        })
                                                    }
                                                </tr>

                                            ))
                                        )
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                <SlimScroll outerComponentId='croll-table-worker' innerComponentId='work-schedule-table-worker' innerComponentWidth={1000} activate={true} />
                <PaginateBar pageTotal={totalPages ? totalPages : 0} currentPage={page} func={this.setPage} />

            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    const { workSchedule, manufacturingWorks } = state;
    return { workSchedule, manufacturingWorks }
}

const mapDispatchToProps = {
    getAllWorkSchedulesWorker: workScheduleActions.getAllWorkSchedulesWorker,
    getAllManufacturingWorks: worksActions.getAllManufacturingWorks,
    setCurrentMonth: workScheduleActions.setCurrentMonth
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(WorkerScheduleManagementTable));