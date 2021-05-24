import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import AssetsManagedByUser from "./assetsManagedByUser";
import KpiUser from "./kpiUser";
import TaskUser from "./taskUser";
import TakeLeaveUser from "./overtimeUser"
import { UserServices } from "../../../super-admin/user/redux/services";
import { SelectMulti, DatePicker } from '../../../../common-components';
import CommendationUser from "./commendationUser";
import DisciplineUser from "./disciplineUser";

function DetailUser(props) {
    const [ nameTask, setNameTask ] = useState(" thực hiện ")
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
            } else return [day, month, year].join('-');
        }
        return date;
    };
    let date = new Date()
    let _startDate = formatDate(date.setMonth(new Date().getMonth() - 6), true);
    const [state, setState] = useState({
        startDate: _startDate,
        endDate: formatDate(Date.now(), true)
    })
    const [email, setEmail] = useState()
    useEffect(() => {
        if (props.user._id) {
            UserServices.getUserById(props.user._id)
                .then(res => {
                    setEmail(res.data.content.email)
                })
        }
    }, [props.user._id])
    const handleStartMonthChange = (value) => {
        setState({
            ...state,
            startDate: value
        })
    }

    const handleEndMonthChange = (value) => {
        setState({
            ...state,
            endDate: value,
        })
    }
    const handleNameTask = (taskName) =>{
        setNameTask(taskName)
    }
    let partMonth1 = state.startDate.split('-');
    let startDate = [partMonth1[1], partMonth1[0]].join('-');
    let partMonth2 = state.endDate.split('-');
    let endDate = [partMonth2[1], partMonth2[0]].join('-');
    return (
        <div>
            <div className="form-inline" >
                <div className="form-group">
                    <label className="form-control-static" >Từ tháng</label>
                    <DatePicker
                        id="form-month-annual-leave"
                        dateFormat="month-year"
                        deleteValue={false}
                        value={state.startDate}
                        onChange={handleStartMonthChange}
                    />
                </div>
                <div className='form-group'>
                    <label className="form-control-static" >Đến tháng</label>
                    <DatePicker
                        id="to-month-annual-leave"
                        dateFormat="month-year"
                        deleteValue={false}
                        value={state.endDate}
                        onChange={handleEndMonthChange}
                    />
                </div>
            </div>
            <label>Công việc {nameTask}</label>
            <TaskUser user={props.user} unitId={props.id} startDate={startDate} endDate={endDate} changeTask={handleNameTask}></TaskUser>
            <label>Tài sản quản lý</label>
            <AssetsManagedByUser user={props.user} unitId={props.id} type="quản lý" ></AssetsManagedByUser>
            <label>Tài sản sử dụng</label>
            <AssetsManagedByUser user={props.user} unitId={props.id} type="sử dụng" ></AssetsManagedByUser>
            <label>Thông tin khen thưởng</label>
            <CommendationUser user={props.user} unitId={props.id} email={email} startDate={startDate} endDate={endDate}></CommendationUser>
            <label>Thông tin kỷ luật</label>
            <DisciplineUser user={props.user} unitId={props.id} email={email} startDate={startDate} endDate={endDate}></DisciplineUser>
            <KpiUser user={props.user} unitId={props.id} startDate={startDate} endDate={endDate} ></KpiUser>
            <TakeLeaveUser user={props.user} unitId={props.id} email={email} startDate={startDate} endDate={endDate} ></TakeLeaveUser>
        </div>
    )
}
function mapState(state) {
    const { } = state;

    return {}
}

const mapDispatchToProps = {
}
export default connect(mapState, mapDispatchToProps)(withTranslate(DetailUser));