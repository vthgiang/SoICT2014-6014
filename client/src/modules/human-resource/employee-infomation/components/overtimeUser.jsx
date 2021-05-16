import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { TimesheetsActions } from "../../timesheets/redux/actions";
import { AnnualLeaveActions } from "../../annual-leave/redux/actions";

function TakeLeaveUser(props) {
    const [showOverTimeAndHourTime, setShowOverTimeAndHourTime] = useState({ isLoading: true ,show:false})
    const [showAnnualLeave, setShowAnnualLeave] = useState({ isLoading: true , show:true})
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
            setShowOverTimeAndHourTime({...showOverTimeAndHourTime,isLoading:false})
        }
    }, [props.email, props.startDate, props.endDate])
    const { timesheets, translate, annualLeave } = props
    const { listTimesheetsByEmployeeIdAndTime } = timesheets
    let overTime = 0, hoursOff = 0, totalHours = 0;
    const { listAnnualLeaveOfNumberMonth } = annualLeave
    if (listTimesheetsByEmployeeIdAndTime.length > 0) {
        for (let i = 0; i < listTimesheetsByEmployeeIdAndTime.length; i++) {
            overTime = overTime + listTimesheetsByEmployeeIdAndTime[i].totalOvertime
            hoursOff = hoursOff + listTimesheetsByEmployeeIdAndTime[i].totalHoursOff
            totalHours = totalHours + listTimesheetsByEmployeeIdAndTime[i].totalHours
        }
    }
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
    const showTimeSheetsUser = (listTimesheetsByEmployeeIdAndTime,showOverTimeAndHourTime) => {
        return (
            <React.Fragment>
                <table className="table table-striped table-bordered table-hover" style={{ marginBottom: 0 }}>
                    <thead>
                        <tr>
                            <th>Tháng</th>
                            <th>thời gian làm</th>
                            <th>thời gian tăng ca</th>
                            <th>thời gian nghỉ</th>
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
    const handChangeShowOverTimeAndHourTime = () =>{
        setShowOverTimeAndHourTime({...showOverTimeAndHourTime,show:true})
        setShowAnnualLeave({...showAnnualLeave,show:false})
    }
    const handChangeShowAnnualLeave = () =>{
        setShowOverTimeAndHourTime({...showOverTimeAndHourTime,show:false})
        setShowAnnualLeave({...showAnnualLeave,show:true})
    }
    return (
        <div className="box-header with-border">
            <div className="col-md-2 col-sm-4 col-xs-4 statistical-item" onClick={()=>{handChangeShowAnnualLeave()}} >
                <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: "#fff", padding: '10px', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '10px', color: "#00c0ef" }} className="material-icons">
                            person
                </span>
                        <span style={{ fontWeight: 'bold' }}>Số buổi nghỉ phép</span>
                    </div>
                    <span style={{ fontSize: '21px' }} className="info-box-number"> {listAnnualLeaveOfNumberMonth ? listAnnualLeaveOfNumberMonth.length : 0} </span>
                </div>
            </div>
            <div className="col-md-2 col-sm-4 col-xs-4 statistical-item" onClick={()=>{handChangeShowAnnualLeave()}} >
                <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: "#fff", padding: '10px', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '10px', color: "#00c0ef" }} className="material-icons">
                            person
                </span>
                        <span style={{ fontWeight: 'bold' }}>Số buổi nghỉ phép còn lại</span>
                    </div>
                    <span style={{ fontSize: '21px' }} className="info-box-number">{listAnnualLeaveOfNumberMonth ? 11 - listAnnualLeaveOfNumberMonth.length : 11}</span>
                </div>
            </div>
            <div className="col-md-2 col-sm-4 col-xs-4 statistical-item" onClick={()=>{handChangeShowOverTimeAndHourTime()}} >
                <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: "#fff", padding: '10px', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '10px', color: "#00c0ef" }} className="material-icons">
                            person
                </span>
                        <span style={{ fontWeight: 'bold' }}>thời gian làm</span>
                    </div>
                    <span style={{ fontSize: '21px' }} className="info-box-number"> {totalHours}</span>
                </div>
            </div>
            <div className="col-md-2 col-sm-4 col-xs-4 statistical-item" onClick={()=>{handChangeShowOverTimeAndHourTime()}} >
                <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: "#fff", padding: '10px', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '10px', color: "#00c0ef" }} className="material-icons">
                            person
                </span>
                        <span style={{ fontWeight: 'bold' }}>thời gian tăng ca</span>
                    </div>
                    <span style={{ fontSize: '21px' }} className="info-box-number">{overTime}</span>
                </div>
            </div>
            <div className="col-md-2 col-sm-4 col-xs-4 statistical-item" onClick={()=>{handChangeShowOverTimeAndHourTime()}} >
                <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: "#fff", padding: '10px', borderRadius: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '10px', color: "#00c0ef" }} className="material-icons">
                            person
                </span>
                        <span style={{ fontWeight: 'bold' }}>thời gian nghỉ</span>
                    </div>
                    <span style={{ fontSize: '21px' }} className="info-box-number">{hoursOff}</span>
                </div>
            </div>
            { showAnnualLeave.show && showAnnualLeaveUser(listAnnualLeaveOfNumberMonth, showAnnualLeave)}
            { showOverTimeAndHourTime.show && showTimeSheetsUser(listTimesheetsByEmployeeIdAndTime,showOverTimeAndHourTime)}

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



export default connect(mapState, mapDispatchToProps)(withTranslate(TakeLeaveUser));