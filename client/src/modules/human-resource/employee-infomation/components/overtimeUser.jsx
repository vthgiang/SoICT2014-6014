import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { TimesheetsActions } from "../../timesheets/redux/actions";
import { AnnualLeaveActions } from "../../annual-leave/redux/actions";
import c3 from 'c3';
import 'c3/c3.css';
function areEqual(prevProps, nextProps) {
    if (prevProps.user._id === nextProps.user._id && prevProps.email === nextProps.email && prevProps.search === nextProps.search && JSON.stringify(prevProps.timesheets.listTimesheetsByEmployeeIdAndTime) === JSON.stringify(nextProps.timesheets.listTimesheetsByEmployeeIdAndTime) && JSON.stringify(prevProps.annualLeave.listAnnualLeaveOfNumberMonth) === JSON.stringify(nextProps.annualLeave.listAnnualLeaveOfNumberMonth)) {
        return true
    } else {
        return false
    }
}
function TakeLeaveUser(props) {
    const [showOverTimeAndHourTime, setShowOverTimeAndHourTime] = useState({ isLoading: true, show: false })
    const [showAnnualLeave, setShowAnnualLeave] = useState({ isLoading: true, show: true })
    const [lineChart, setLineChart] = useState(true)
    const formatDate2 = (date, monthYear = false) => {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        }

        return date;
    }
    const formatDate = (date, monthYear = false) => {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [month, year].join('-');
        }
        return date;
    };
    useEffect(() => {
        if (props.email) {
            props.getTimesheets({ employeeId: props.email, startDate: props.startDate, endDate: props.endDate, callApiByEmployeeId: true });
            props.getNumberAnnaulLeave({ email: props.email, organizationalUnits: props.unitId, startDate: props.startDate, endDate: props.endDate });
            setShowAnnualLeave({ ...showAnnualLeave, isLoading: false })
            setShowOverTimeAndHourTime({ ...showOverTimeAndHourTime, isLoading: false })
        }
    }, [props.email, props.startDate, props.endDate])
    const showAnnualLeaveUser = (listAnnualLeaveOfNumberMonth, showAnnualLeave) => {
        return (
            <React.Fragment>
                <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                    <thead>
                        <tr>
                            <th>{translate('human_resource.annual_leave.table.start_date')}</th>
                            <th>{translate('human_resource.annual_leave.table.end_date')}</th>
                            <th>{translate('human_resource.annual_leave.totalHours')}</th>
                            <th>{translate('human_resource.annual_leave.table.reason')}</th>
                            <th>{translate('human_resource.status')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            listAnnualLeaveOfNumberMonth && listAnnualLeaveOfNumberMonth.length !== 0 &&
                            listAnnualLeaveOfNumberMonth.map((x, index) => {
                                let totalHours = x.totalHours ? x.totalHours : (Math.round((new Date(x.endDate).getTime() - new Date(x.startDate).getTime()) / (24 * 60 * 60 * 1000)) + 1) * 8
                                return (
                                    <tr key={index}>
                                        <td><p>{formatDate2(x.startDate)}</p>{x.startTime ? x.startTime : null}</td>
                                        <td><p>{formatDate2(x.endDate)}</p>{x.endTime ? x.endTime : null}</td>
                                        <td>{totalHours}</td>
                                        <td>{x.reason}</td>
                                        <td>{translate(`human_resource.annual_leave.status.${x.status}`)}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>

                </table>
                {
                    showAnnualLeave.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (!listAnnualLeaveOfNumberMonth || listAnnualLeaveOfNumberMonth.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
            </React.Fragment>
        )
    }
    const showTimeSheetsUser = (listTimesheetsByEmployeeIdAndTime, showOverTimeAndHourTime) => {
        return (
            <React.Fragment>
                <div className="box-header with-border">
                    <div className="title">Thời gian tăng ca</div>
                </div>

                <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                    <thead>
                        <tr>
                            <th>{translate('human_resource.month')}</th>
                            <th>{translate('human_resource.timesheets.total_timesheets')}</th>
                            <th>{translate('human_resource.timesheets.total_over_time')}</th>
                            <th>{translate('human_resource.timesheets.total_hours_off')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            listTimesheetsByEmployeeIdAndTime && listTimesheetsByEmployeeIdAndTime.length !== 0 &&
                            listTimesheetsByEmployeeIdAndTime.map((x, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{formatDate(x.month)}</td>
                                        <td>{x.totalHours}</td>
                                        <td>{x.totalHoursOff}</td>
                                        <td>{x.totalOvertime}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                {
                    showOverTimeAndHourTime.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        (!listTimesheetsByEmployeeIdAndTime || listTimesheetsByEmployeeIdAndTime.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
            </React.Fragment>
        )
    }
    const handChangeShowOverTimeAndHourTime = () => {
        setShowOverTimeAndHourTime({ ...showOverTimeAndHourTime, show: true })
        setShowAnnualLeave({ ...showAnnualLeave, show: false })
    }
    const handChangeShowAnnualLeave = () => {
        setShowOverTimeAndHourTime({ ...showOverTimeAndHourTime, show: false })
        setShowAnnualLeave({ ...showAnnualLeave, show: true })
    }

    const renderChart = (data) => {
        data.data1.shift();
        data.data2.shift();
        let fakeData1 = data.data1.map(x => 2 * x);
        let fakeData2 = data.data2.map(x => x / 2);
        let chart = c3.generate({
            bindto: "#trendWork",
            data: {
                x: 'x',
                columns: [],
                hide: true,
                type: data.lineChart === true ? '' : 'bar',
                names: {
                    data1: data.nameData1,
                    data2: data.nameData2,
                },
            },
            bar: {
                width: {
                    ratio: 0.8
                }
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%m - %Y',
                        outer: false,
                        rotate: -45,
                        multiline: false
                    },
                },
                y: {
                    tick: {
                        outer: false
                    },
                }
            },
        });

        setTimeout(function () {
            chart.load({
                columns: [data.ratioX, ['data1', ...fakeData1],
                ['data2', ...fakeData2]
                ],
            });
        }, 100);
        setTimeout(function () {
            chart.load({
                columns: [data.ratioX, ['data1', ...data.data1],
                ['data2', ...data.data2]
                ],
            });
        }, 300);
    };
    const handleChangeViewChart = (data) => {
        setLineChart(data)
    }
    const { timesheets, translate, annualLeave } = props
    const { listTimesheetsByEmployeeIdAndTime } = timesheets
    let overTime = 0, hoursOff = 0, totalHours = 0;
    const { listAnnualLeaveOfNumberMonth } = annualLeave
    // if (timesheets.){}
    if (listTimesheetsByEmployeeIdAndTime.length > 0) {
        for (let i = 0; i < listTimesheetsByEmployeeIdAndTime.length; i++) {
            overTime = overTime + listTimesheetsByEmployeeIdAndTime[i].totalOvertime
            hoursOff = hoursOff + listTimesheetsByEmployeeIdAndTime[i].totalHoursOff
            totalHours = totalHours + listTimesheetsByEmployeeIdAndTime[i].totalHours
        }
    }
    if (listTimesheetsByEmployeeIdAndTime) {
        let ratioX = ['x', ...timesheets.arrMonthById];
        let data1 = ['data1'], data2 = ['data2'];
        if (listTimesheetsByEmployeeIdAndTime.length !== 0) {
            timesheets.arrMonthById.forEach(x => {
                let month = `${new Date(x).getFullYear()}-${new Date(x).getMonth()}`;
                let data = listTimesheetsByEmployeeIdAndTime.find(x => `${new Date(x.month).getFullYear()}-${new Date(x.month).getMonth()}` === month);
                if (data) {
                    data1 = [...data1, data.totalHours];
                    data2 = [...data2, data.totalOvertime ? data.totalOvertime : 0];
                } else {
                    data1 = [...data1, 0];
                    data2 = [...data2, 0];
                }
            })
        }
        let nameData1 = `${translate('human_resource.dashboard_personal.total_hours_works')}`
        let nameData2 = `${translate('human_resource.dashboard_personal.overtime_total')}`
        renderChart({ nameData1, nameData2, ratioX, data1, data2, lineChart });
    }
    let nameChart = `${translate('human_resource.dashboard_personal.trend_of_work')}`
    return (
        <div className="row">
            <div className="nav-tabs-custom">
                <div className="col-xs-12">

                    <h3 class="title">Nghỉ phép và tăng ca</h3>

                    <div className="box box-primary">

                        <ul className="nav nav-tabs">
                            <li><a>{translate('human_resource.annual_leave.approved_letter')} : {listAnnualLeaveOfNumberMonth ? listAnnualLeaveOfNumberMonth.length : 0} </a></li>
                            <li><a>Số buổi nghỉ phép còn lại : {listAnnualLeaveOfNumberMonth ? 11 - listAnnualLeaveOfNumberMonth.length : 11}</a></li>
                            <li><a>{translate('human_resource.timesheets.total_timesheets')} : {totalHours}</a></li>
                            <li><a>{translate('human_resource.timesheets.total_over_time')} : {overTime}</a></li>
                            <li><a>{translate('human_resource.timesheets.total_hours_off')} : {hoursOff}</a></li>
                        </ul>
                        <div className="box-header with-border">
                            <div className="title">Thời gian nghỉ phép</div>
                        </div>

                        {showAnnualLeaveUser(listAnnualLeaveOfNumberMonth, showAnnualLeave)}
                        {showTimeSheetsUser(listTimesheetsByEmployeeIdAndTime, showOverTimeAndHourTime)}

                        <h3 className="box-title">{`${nameChart} ${props.startDate}`}<i className="fa fa-fw fa-caret-right"></i>{props.endDate}</h3>
                        <div className="dashboard_box_body">
                            <p className="pull-left" style={{ marginBottom: 0 }}><b>ĐV tính: Số giờ</b></p>
                            <div className="box-tools pull-right">
                                <div className="btn-group pull-rigth">
                                    <button type="button" className={`btn btn-xs ${lineChart ? "active" : "btn-danger"}`} onClick={() => handleChangeViewChart(false)}>Bar chart</button>
                                    <button type="button" className={`btn btn-xs ${lineChart ? 'btn-danger' : "active"}`} onClick={() => handleChangeViewChart(true)}>Line chart</button>
                                </div>
                            </div>
                            <div id="trendWork"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
function mapState(state) {
    const { timesheets, annualLeave } = state;

    return { timesheets, annualLeave }
}

const mapDispatchToProps = {
    getTimesheets: TimesheetsActions.searchTimesheets,
    getNumberAnnaulLeave: AnnualLeaveActions.searchAnnualLeaves,
}



export default connect(mapState, mapDispatchToProps)(withTranslate(React.memo(TakeLeaveUser, areEqual)));