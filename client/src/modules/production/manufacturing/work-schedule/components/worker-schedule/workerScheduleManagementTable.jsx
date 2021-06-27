import React, { Component, useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DataTableSetting, DatePicker, PaginateBar, SelectMulti, SlimScroll } from '../../../../../../common-components';
import { formatToTimeZoneDate, formatYearMonth } from '../../../../../../helpers/formatDate';
import ManufacturingCommandDetailInfo from '../../../manufacturing-command/components/manufacturingCommandDetailInfo';
import { worksActions } from '../../../manufacturing-works/redux/actions';
import { workScheduleActions } from '../../redux/actions';
import WorkerScheduleCreateForm from './workerScheduleCreateForm';
import './workerScheduleManagementTable.css'
import { getTableConfiguration } from '../../../../../../helpers/tableConfiguration';

function WorkerScheduleManagementTable(props) {
    const getAllDaysOfMonth = (month) => {
        let arrayMonthYear = month.split("-");
        let lastDaysOfMonth = new Date(arrayMonthYear[1], arrayMonthYear[0], 0);
        let days = lastDaysOfMonth.getDate();

        let arrayDayOfMonth = [];
        for (let i = 1; i <= days; i++) {
            arrayDayOfMonth.push(i);
        }
        return arrayDayOfMonth;
    }
    
    let currentDateDefault = Date.now();
    let currentMonthYearDefault = formatYearMonth(currentDateDefault);
    let allDaysOfMonthDefault = getAllDaysOfMonth(currentMonthYearDefault);

    const tableIdDefault = "info-mill-table-worker";
    const defaultConfig = { limit: 5 }
    const limitDefault = getTableConfiguration(tableIdDefault, defaultConfig).limit;
    const [state, setState] = useState({
        limit: limitDefault,
        page: 1,
        month: currentMonthYearDefault,
        allDaysOfMonth: allDaysOfMonthDefault,
        name: '',
        works: [],
        currentRole: localStorage.getItem('currentRole'),
        tableId: tableIdDefault
    })
    
    useEffect(() => {
        let { limit, page, month } = state;
        let data = {
        limit: limit,
        page: page,
        object: "user",
        month: formatToTimeZoneDate(month),
        currentRole: state.currentRole
    }
        props.getAllWorkSchedulesWorker(data);
        props.getAllManufacturingWorks({ status: 1 });
        props.setCurrentMonth(month);
    }, [])

    const getListWorksArray = () => {
        const { manufacturingWorks } = props;
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

    const handleWorksChange = (value) => {
        setState((state) => ({
            ...state,
            works: value
        }));
        console.log(state);
    }

    const handleChangeMonth = (value) => {
        setState((state) => ({
            ...state,
            month: value
        }))
    }

    const setLimit = async (limit) => {
        await setState((state) => ({
            ...state,
            limit: limit
        }));
        let { page, month } = state;
        let data = {
            limit: limit,
            page: page,
            object: "user",
            month: formatToTimeZoneDate(month),
            currentRole: state.currentRole
        }
        props.getAllWorkSchedulesWorker(data)
    }

    const setPage = async (page) => {
        await setState((state) => ({
            ...state,
            page: page
        }));
        let { limit, month } = state;
        let data = {
            limit: limit,
            page: page,
            object: "user",
            month: formatToTimeZoneDate(month),
            currentRole: state.currentRole
        }
        props.getAllWorkSchedulesWorker(data);
    }

    const handleEmployeeNameChange = (e) => {
        const { value } = e.target;
        setState((state) => ({
            ...state,
            name: value
        }));
    }

    const handleSubmitSearch = () => {
        let { month } = state;
        let allDaysOfMonth = getAllDaysOfMonth(month);
        setState((state) => ({
            ...state,
            allDaysOfMonth: allDaysOfMonth
        }));
        let { limit, page, name, works } = state;
        let data = {
            name: name,
            works: works,
            limit: limit,
            page: page,
            object: "user",
            month: formatToTimeZoneDate(month),
            currentRole: state.currentRole
        }
        props.getAllWorkSchedulesWorker(data)
        props.setCurrentMonth(month);
    }

    const handleShowDetailManufacturingCommand = async (command) => {
        await setState((state) => ({
            ...state,
            commandDetail: command
        }));
        window.$('#modal-detail-info-manufacturing-command-2').modal('show');
    }

    const checkHasComponent = (name) => {
        let { auth } = props;
        let result = false;
        auth.components.forEach(component => {
            if (component.name === name) result = true;
        });

        return result;
    }

    const { translate, workSchedule } = props;
    let listWorkSchedulesWorker = [];
    if (workSchedule.listWorkSchedulesWorker && workSchedule.isLoading === false) {
        listWorkSchedulesWorker = workSchedule.listWorkSchedulesWorker;
    }
    const { totalPages, page } = workSchedule;

    const { month, allDaysOfMonth, name, tableId } = state;

    const arrayStatus = [0, 6, 1, 2, 3, 4];
    return (
        <React.Fragment>
            {
                <WorkerScheduleCreateForm />
            }
            <div className="box-body qlcv">
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manufacturing.work_schedule.employee_name')}</label>
                        <input type="text" className="form-control" value={name} onChange={handleEmployeeNameChange} placeholder="Nguyễn Anh Phương" autoComplete="off" />
                    </div>
                    {
                        checkHasComponent('select-manufacturing-works') &&
                        <div className="form-group">
                            <label className="form-control-static">{translate('manufacturing.work_schedule.works')}</label>
                            <SelectMulti
                                id={`multi-select-works`}
                                multiple="multiple"
                                options={{ nonSelectedText: translate("manufacturing.work_schedule.all_works"), allSelectedText: translate("manufacturing.work_schedule.all_works") }}
                                onChange={handleWorksChange}
                                items={getListWorksArray()}
                            >
                            </SelectMulti>
                        </div>
                    }
                </div>
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manufacturing.work_schedule.time')}</label>
                        <DatePicker
                            id={`month-worker`}
                            dateFormat={"month-year"}
                            value={month}
                            onChange={handleChangeMonth}
                            disabled={false}
                        />
                    </div>
                    <div className="form-group">
                        {checkHasComponent('select-manufacturing-works') && <label className="form-control-static"></label>}
                        <button type="button" className="btn btn-success" title={translate('manufacturing.work_schedule.search')} onClick={handleSubmitSearch}>{translate('manufacturing.work_schedule.search')}</button>
                    </div>
                </div>
            </div>
            <div className="form-inline">
                {
                    arrayStatus.map((status, index) => (
                        <span key={index}>
                            <span className="icon" title={translate(`manufacturing.work_schedule.${status}.content`)} style={{ backgroundColor: translate(`manufacturing.work_schedule.${status}.color`), verticalAlign: "middle" }}>
                            </span>
                            <span style={{ verticalAlign: "middle" }}>
                                &emsp;
                                {
                                    translate(`manufacturing.work_schedule.${status}.content`)
                                }
                                &emsp;&emsp;
                            </span>
                        </span>
                    ))
                }
            </div>
            <DataTableSetting
                tableId={tableId}
                setLimit={setLimit}
            />
            <div id="croll-table-worker" className="form-inline">
                <div className="col-lg-6 col-md-6 col-sm-7 col-xs-8" style={{ padding: 0 }}>
                    <table id={tableId} className="table table-bordered not-sort">
                        <thead>
                            <tr>
                                <th>{translate('manufacturing.work_schedule.employee_name')}</th>
                                <th>{translate('manufacturing.work_schedule.employee_email')}</th>
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
                                                <td rowSpan={numberOfTurns}>{schedule.user && schedule.user.name}</td>
                                                <td rowSpan={numberOfTurns}>{schedule.user && schedule.user.email}</td>
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
                    <table id="work-schedule-table-worker" className="table table-striped table-bordered table-hover not-sort">
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
                                                turn.map((command, index3) => {
                                                    if (command !== null)
                                                        return (
                                                            <td key={index3} className="tooltip-checkbox">
                                                                {/* <input type="checkbox" disabled={true} style={{ backgroundColor: translate(`manufacturing.work_schedule.${command.status}.color`) }}>
                                                                    </input> */}
                                                                <span className="icon" title={translate(`manufacturing.work_schedule.${command.status}.content`)} style={{ backgroundColor: translate(`manufacturing.work_schedule.${command.status}.color`) }}></span>
                                                                <span className="tooltiptext">
                                                                    <a style={{ color: "white" }} onClick={() => handleShowDetailManufacturingCommand(command)}>{command.code}</a>
                                                                </span>
                                                            </td>
                                                        )

                                                    return (
                                                        <td key={index3}>
                                                            {/* <input type="checkbox" disabled={true} /> */}
                                                            <span className="icon" style={{ backgroundColor: "white" }}></span>
                                                        </td>
                                                    );
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
            <PaginateBar pageTotal={totalPages ? totalPages : 0} currentPage={page} func={setPage} />
            {
                <ManufacturingCommandDetailInfo idModal={2} commandDetail={state.commandDetail} />
            }
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { workSchedule, manufacturingWorks, auth } = state;
    return { workSchedule, manufacturingWorks, auth }
}

const mapDispatchToProps = {
    getAllWorkSchedulesWorker: workScheduleActions.getAllWorkSchedulesWorker,
    getAllManufacturingWorks: worksActions.getAllManufacturingWorks,
    setCurrentMonth: workScheduleActions.setCurrentMonth
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(WorkerScheduleManagementTable));