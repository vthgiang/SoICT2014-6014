import React, {useState, useEffect, useLayoutEffect, useRef} from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { convertTime } from '../../../../helpers/stringMethod';
import { InforTimeSheetLog } from './inforTimeSheetLog'

import { UserActions } from '../../../super-admin/user/redux/actions';

import { PaginateBar, DataTableSetting } from '../../../../common-components/index';
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import _cloneDeep from "lodash/cloneDeep";
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

function AllTimeSheetLogsByUnit(props) {
    const { translate, tasks } = props;
    const { taskDashboardCharts } = tasks
    const [state, setState] = useState(() => initState())
    const checkExport = useRef(false);

    function initState() {
        const defaultConfig = { limit: 10 }
        const allTimeSheetLogsByUnitId = "all-time-sheet-logs"
        const allTimeSheetLogsByUnitIdPerPage = getTableConfiguration(allTimeSheetLogsByUnitId, defaultConfig).limit;
        return {
            currentRowTimeSheetLog: undefined,
            dataChart: {},
            perPage: allTimeSheetLogsByUnitIdPerPage
        }
    }
    const { perPage, allTimeSheet, filterTimeSheetLogs, page, pageTotal, total, display, currentRowTimeSheetLog } = state;

    useLayoutEffect(() => {
        if (checkExport) {
            allTimeSheet && allTimeSheet.length > 0 && convertDataExport(allTimeSheet);
        }
    }, [JSON.stringify(allTimeSheet)])

    useEffect(() => {
        let data = getData("all-time-sheet-log-by-unit")
        let dataTable = data
        if (dataTable) {
            checkExport.current = true;
            let dataAllTimeSheet = dataTable.allTimeSheet.slice(0, perPage)
            let dataFilterTimeSheetLogs = dataTable.filterTimeSheetLogs.slice(0, perPage)
            setState({
                ...state,
                allTimeSheet: dataAllTimeSheet,
                filterTimeSheetLogs: dataFilterTimeSheetLogs,
                total: dataTable?.employeeLength,
                pageTotal: Math.ceil(dataTable?.employeeLength / perPage),
                page: 1,
                display: dataAllTimeSheet.length
            })
        }

    }, [JSON.stringify(taskDashboardCharts?.["all-time-sheet-log-by-unit"])])

    function getData(chartName) {
        let dataChart;
        let data = taskDashboardCharts?.[chartName]
        if (data) {
            dataChart = data.dataChart
        }
        return dataChart;
    }

    const convertDataExport = (data) => {
        let newData = _cloneDeep(data);
        newData = newData.map((o, index) => ({
            STT: index + 1,
            name: o.name ? o.name: "",
            totalhours: o.totalhours ? convertTime(o.totalhours) : 0,
            autotimer: o.autotimer ?convertTime(o.autotimer) : 0,
            logtimer: o.logtimer ? convertTime(o.logtimer) : 0,
            manualtimer: o.manualtimer ? convertTime(o.manualtimer) : 0,
        }))

        let exportData = {
            fileName: `${translate('task.task_dashboard.statistical_timesheet_logs_unit')} ${props.unitsSelected}`,
            dataSheets: [
                {
                    sheetTitle: `${translate('task.task_dashboard.statistical_timesheet_logs')} ${props.unitsSelected} ${translate('task.task_dashboard.from')} ${props.startMonthTitle} ${translate('task.task_dashboard.to')} ${props.endMonthTitle}`,
                    sheetName: `${translate('task.task_dashboard.statistical_timesheet_logs')}`,
                    tables: [
                        {
                            columns: [
                                {key: 'STT', value: `${translate('task.task_dashboard.statistical_timesheet_logs')}`, width: 7},
                                {key: 'name', value: `${translate('task.task_dashboard.name')}`, width: 20},
                                {key: 'totalhours', value: `${translate('task.task_dashboard.totalhours')}`, width: 10},
                                {key: 'autotimer', value: `${translate('task.task_dashboard.autotimer')}`, width: 10},
                                {key: 'logtimer', value: `${translate('task.task_dashboard.logtimer')}`, width: 10},
                                {key: 'manualtimer', value: `${translate('task.task_dashboard.manualtimer')}`, width: 10},
                            ],
                            data: newData
                        }
                    ]
                },
            ]
        }
        if (exportData)
            props.handleDataTimeSheetsExport(exportData);
    }
    const handleInforTimeSheet = (value, filterTimeSheetLogs) => {
        filterTimeSheetLogs = filterTimeSheetLogs.filter(o => o.creator === value?.userId)
        setState({
            ...state,
            currentRowTimeSheetLog: {
                timesheetlogs: value,
                filterTimeSheetLogs
            }
        });
        window.$('#modal-infor-time-sheet-log').modal('show');

    }

    const handlePaginationAllTimeSheetLogs = (page) => {
        let data = getData("all-time-sheet-log-by-unit")
        let dataTable = data
        if (dataTable) {
            let begin = (Number(page) - 1) * perPage
            let end = (Number(page) - 1) * perPage + perPage
            let allTimeSheet = dataTable?.allTimeSheet.slice(begin, end)
            let filterTimeSheetLogs = dataTable?.filterTimeSheetLogs.slice(begin, end)
            setState({
                ...state,
                allTimeSheet: allTimeSheet,
                filterTimeSheetLogs: filterTimeSheetLogs,
                page: page,
                display: allTimeSheet.length
            })
        }
    }

    const setLimitAllTimeSheetLogs = (limit) => {
        let data = getData("all-time-sheet-log-by-unit")
        let dataTable = data
        if (dataTable) {
            let allTimeSheet = dataTable?.allTimeSheet.slice(0, limit)
            let filterTimeSheetLogs = dataTable?.filterTimeSheetLogs.slice(0, limit)
            setState({
                ...state,
                allTimeSheet: allTimeSheet,
                filterTimeSheetLogs: filterTimeSheetLogs,
                page: 1,
                perPage: Number(limit),
                display: allTimeSheet.length,
                pageTotal: Math.ceil(dataTable?.employeeLength / limit)
            })
        }

    }
    return (
        <React.Fragment>
            <DataTableSetting
                tableId={"all-time-sheet-logs"}
                setLimit={setLimitAllTimeSheetLogs}
            />

            <React.Fragment>
                <table className="table table-hover table-striped table-bordered" id="table-user-timesheetlogs">
                    <thead>
                        <tr>
                            <th style={{ width: '60px' }}>{translate('general.index')}</th>
                            <th>{translate('human_resource.profile.full_name')}</th>
                            <th>{translate('task.task_perform.total_time')}</th>
                            <th>{translate('task.task_management.timer')}</th>
                            <th>{translate('task.task_management.interval_timer')}</th>
                            <th>{translate('task.task_management.additional_timer')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            allTimeSheet?.length > 0 && allTimeSheet.map((tsl, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td><a onClick={() => handleInforTimeSheet(tsl, filterTimeSheetLogs)}>{tsl.name}</a></td>
                                        <td>{convertTime(tsl.totalhours)}</td>
                                        <td>{convertTime(tsl.manualtimer)}</td>
                                        <td>{convertTime(tsl.autotimer)}</td>
                                        <td>{convertTime(tsl.logtimer)}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </React.Fragment>

            {currentRowTimeSheetLog &&
                <InforTimeSheetLog
                    timesheetlogs={currentRowTimeSheetLog.timesheetlogs}
                    filterTimeSheetLogs={currentRowTimeSheetLog.filterTimeSheetLogs}
                />
            }
            <PaginateBar
                display={display}
                total={total}
                pageTotal={pageTotal}
                currentPage={page}
                func={handlePaginationAllTimeSheetLogs}
            />
        </React.Fragment>
    )
}


const mapState = (state) => {
    const { tasks } = state;
    return { tasks };
}
const actionCreators = {
    getAllEmployeeOfUnitByIds: UserActions.getAllEmployeeOfUnitByIds
};

export default connect(mapState, actionCreators)(withTranslate(AllTimeSheetLogsByUnit));

const connectedAllTimeSheetLogs = connect(mapState, actionCreators)(withTranslate(AllTimeSheetLogsByUnit))
export { connectedAllTimeSheetLogs as AllTimeSheetLogsByUnit }