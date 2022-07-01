import React, { Component, useEffect, useState } from "react";
import { connect } from 'react-redux';
import { withTranslate } from "react-redux-multilingual";
import { DatePicker } from "../../../../../../common-components";
import { TaskProcessActions } from "../../../redux/actions";
import { TaskProcessService } from "../../../redux/services";
import c3 from 'c3';
import 'c3/c3.css';
import { useRef } from "react";
import moment from 'moment';

function TableReportTask(props) {

    let arrayTaskInprocess = []
    const showData = (lists = [], nameTask) => {
        let result = null
        if (lists && lists.length !== 0) {
            result = lists.map((taskItem, index) => {
                return (
                    <tr key={index}>
                        <td>{taskItem.name}</td>
                        <td>{taskItem.trehan}</td>
                        <td>{taskItem.dunghan}</td>
                        <td>{taskItem.minTime}</td>
                        <td>{taskItem.maxTime}</td>
                        <td>{taskItem.avgTime}</td>
                        <td>{taskItem.maxPoint}</td>
                        <td>{taskItem.minPoint}</td>
                        <td>{taskItem.avgPoint}</td>
                    </tr>)
            })
        }
        return result
    }
    const maxMinAvg = (arr) => {
        let max = arr[0];
        let min = arr[0];
        let sum = 0;
        arr.forEach(function (value) {
            if (value > max)
                max = value;
            if (value < min)
                min = value;
            sum += value;
        })
        let avg = Math.round(sum / arr.length * 100) / 100;
        return [min ? min : 0, max ? max : 0, avg ? avg : 0];
    }

    console.log(props);
    const dataShow = []
    if (props.info && props.info.length !== 0) {
        for (let i in props.info) {
            let dataX = []
            let dataX2 = []
            let dungHan = 0, treHan = 0
            let listPoint = []
            if (props.dataTaskProcess && props.dataTaskProcess.length !== 0) {
                for (let j in props.dataTaskProcess) {
                    if (props.dataTaskProcess[j].tasks.find(value => value.codeInProcess === props.info[i].code)) {
                        let value1 = props.dataTaskProcess[j].tasks.find(value => value.codeInProcess === props.info[i].code);
                        let currentMemberCurrentTaskPoint = 0;
                        value1.evaluations.forEach(value=>{
                            let point1 =0;
                            value.results.forEach(point=>{
                                point1= point1+(point.approvedPoint+point.automaticPoint+point.employeePoint)/3;
                            })
                            if(point1!==0 && value.results.length!==0) currentMemberCurrentTaskPoint = currentMemberCurrentTaskPoint + point1/value.results.length
                        })
                        if(currentMemberCurrentTaskPoint!==0 &&  value1.evaluations.length!==0) currentMemberCurrentTaskPoint  = currentMemberCurrentTaskPoint/ value1.evaluations.length
                        currentMemberCurrentTaskPoint = Math.floor(currentMemberCurrentTaskPoint * 100 / 100);
                        listPoint.push(currentMemberCurrentTaskPoint)
                    }
                }
            }
            
            let dataY = ["nhanh nhất", 'chậm nhất', 'trung bình']
            if (props.dataTaskProcess && props.dataTaskProcess.length !== 0) {
                for (let j in props.dataTaskProcess) {
                    if (props.dataTaskProcess[j].tasks.find(value => value.codeInProcess === props.info[i].code)) {
                        let value = props.dataTaskProcess[j].tasks.find(value => value.codeInProcess === props.info[i].code)
                        let days = 0;
                        let end = moment(value.endDate);
                        let endT = moment(value.actualEndDate);
                        let now = moment(new Date());
                        if (value.status == "finished") {
                            let uptonow1 = now.diff(end, 'hour');
                            let uptonow2 = now.diff(endT, 'hour');
                            if (uptonow1 < uptonow2) {
                                dungHan++
                            } else {
                                treHan++;
                            }
                        } else treHan++;
                        dataY.push(value.name)
                        if (value.actualEndDate && value.actualStartDate) {
                            let day1 = new Date(value.actualEndDate);
                            let day2 = new Date(value.actualStartDate);
                            let totalTime1 = 0;
                            let totalTime2 = 0;
                            if (props.dataTaskProcess[j].officeHours.length !== 0) {
                                //totalTime2 = props.dataTaskProcess[j].convertDayToHour;
                                props.dataTaskProcess[j].officeHours.forEach(value => {
                                    let arrayAdministrativeStartTime = value.startTime.split(" ");
                                    arrayAdministrativeStartTime = arrayAdministrativeStartTime[0].split(":").concat(arrayAdministrativeStartTime[1]);
                                    if (arrayAdministrativeStartTime[2] === "PM") {
                                        arrayAdministrativeStartTime[0] = parseInt(arrayAdministrativeStartTime[0]) + 12
                                    }
                                    let arrayAdministrativeEndTime = value.endTime.split(" ");
                                    arrayAdministrativeEndTime = arrayAdministrativeEndTime[0].split(":").concat(arrayAdministrativeEndTime[1]);
                                    if (arrayAdministrativeEndTime[2] === "PM") {
                                        arrayAdministrativeEndTime[0] = parseInt(arrayAdministrativeEndTime[0]) + 12
                                    }
                                    if (day2.getHours() * 60 + day2.getMinutes() < arrayAdministrativeStartTime[0] * 60 + parseInt(arrayAdministrativeStartTime[1])) {
                                        totalTime1 = totalTime1 + (arrayAdministrativeEndTime[0] * 60 + parseInt(arrayAdministrativeEndTime[1]) - arrayAdministrativeStartTime[0] * 60 - parseInt(arrayAdministrativeStartTime[1])) / 60;
                                    } else if (day2.getHours() * 60 + day2.getMinutes() < arrayAdministrativeEndTime[0] * 60 + parseInt(arrayAdministrativeEndTime[1])) {
                                        totalTime1 = totalTime1 + (arrayAdministrativeEndTime[0] * 60 + parseInt(arrayAdministrativeEndTime[1]) - day2.getHours() * 60 - day2.getMinutes()) / 60;
                                    }
                                    if (day1.getHours() * 60 + day1.getMinutes() < arrayAdministrativeStartTime[0] * 60 + parseInt(arrayAdministrativeStartTime[1])) {
                                        totalTime2 = totalTime2 + 0;
                                    } else if (day1.getHours() * 60 + day1.getMinutes() < arrayAdministrativeEndTime[0] * 60 + parseInt(arrayAdministrativeEndTime[1])) {
                                        totalTime2 = totalTime2 + (day1.getHours() * 60 + day1.getMinutes() - arrayAdministrativeStartTime[0] * 60 - parseInt(arrayAdministrativeStartTime[1])) / 60;
                                    } else {
                                        totalTime2 = totalTime2 + (arrayAdministrativeEndTime[0] * 60 + parseInt(arrayAdministrativeEndTime[1]) - arrayAdministrativeStartTime[0] * 60 - parseInt(arrayAdministrativeStartTime[1])) / 60;
                                    }
                                })
                                day1.setHours(0);
                                day1.setMinutes(0);
                                day2.setDate(day2.getDate() + 1)
                                day2.setHours(0);
                                day2.setMinutes(0)
                            }

                            // if (props.dataTaskProcess[j].administrativeStartTime && props.dataTaskProcess[j].administrativeEndTime){
                            //     let arrayAdministrativeStartTimeHour = parseInt(props.dataTaskProcess[j].administrativeStartTime.split(":")[0])
                            //     let arrayAdministrativeStartTimeMinute = parseInt(props.dataTaskProcess[j].administrativeStartTime.split(":")[1])
                            //     let arrayAdministrativeEndTimeHour = parseInt(props.dataTaskProcess[j].administrativeEndTime.split(":")[0])
                            //     let arrayAdministrativeEndTimeMinute = parseInt(props.dataTaskProcess[j].administrativeEndTime.split(":")[1])
                            //     if (day2.getHours() < arrayAdministrativeStartTimeHour){
                            //         day2.setHours(arrayAdministrativeStartTimeHour);
                            //         day2.setMinutes(arrayAdministrativeStartTimeMinute)
                            //     }
                            //     if (day2.getHours() > arrayAdministrativeEndTimeHour){
                            //         day2.setDate(day2.getDate()+1)
                            //         day2.setHours(arrayAdministrativeStartTimeHour);
                            //         day2.setMinutes(arrayAdministrativeStartTimeMinute)
                            //     }
                            //     if (day1.getHours() > arrayAdministrativeEndTimeHour){
                            //         day1.setHours(arrayAdministrativeEndTimeHour);
                            //         day1.setMinutes(arrayAdministrativeEndTimeMinute)
                            //     }
                            //     if (day1.getHours() < arrayAdministrativeStartTimeHour){
                            //         day1.setDate(day1.getDate()-1)
                            //         day1.setHours(arrayAdministrativeEndTimeHour);
                            //         day1.setMinutes(arrayAdministrativeEndTimeMinute)
                            //     }
                            // }
                            var difference = Math.abs(day1 - day2);
                            days = difference / (1000 * 3600)
                            console.log(totalTime1, totalTime2);
                            days = parseInt(days / 24) * props.dataTaskProcess[j].convertDayToHour + totalTime1 + totalTime2;
                            // if ((days - d1 *24) >10){
                            //     days = d1 * props.dataTaskProcess[j].convertDayToHour +(days - d1 *24) + props.dataTaskProcess[j].convertDayToHour -24
                            // } else {
                            //     days = d1 * props.dataTaskProcess[j].convertDayToHour + (days - d1 *24)
                            // }

                            days = Math.round(days * 100) / 100
                        }
                        dataX2.push(Math.round(value.hoursSpentOnTask.totalHoursSpent / (3600 * 1000) * 100) / 100)
                        if (days) dataX.push(days)
                        // }
                        // data.push(props.dataTaskProcess[j].tasks.find(value=>value.codeInProcess === props.info[i].code))
                    }

                }
            }
            let maxMin = maxMinAvg(dataX);
            let minMaxPoint = maxMinAvg(listPoint)
            dataShow[i] = { ...dataShow[i], name: props.info[i].name, minTime: maxMin[0], maxTime: maxMin[1], avgTime: maxMin[2],dunghan:dungHan,trehan:treHan,maxPoint:minMaxPoint[1],minPoint:minMaxPoint[0],avgPoint:minMaxPoint[2] }
            arrayTaskInprocess.push({ name: props.info[i].name, code: props.info[i].code, dataX: ["Số giờ"].concat(maxMinAvg(dataX)).concat(dataX), dataY: dataY, dataX2: ["Số giờ"].concat(maxMinAvg(dataX2)).concat(dataX2) });
        }
    }

    const { translate } = props
    let nameTask = ""
    return (
        <React.Fragment>
            <p>Biểu Đồ thời gian công việc : </p>
            <table id="listTaskProcess1" className="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th>{translate('task.task_management.col_name')}</th>
                        <th>Số lần trễ hạn</th>
                        <th>Số lần đúng hạn</th>
                        <th>Thời gian nhanh nhất</th>
                        <th>Thời gian chậm nhất</th>
                        <th>Thời gian trung bình</th>
                        <th>Điểm số cao nhất</th>
                        <th>Điểm số thấp nhất</th>
                        <th>Điểm số trung bình</th>
                        {/*<th>Tổng thời gian bấm giờ</th>
                        <th>{translate('task.task_management.col_progress')}</th>
                         <th style={{ width: "120px", textAlign: "center" }}>
                            {translate('table.action')}
                            <DataTableSetting
                                tableId={"listTaskProcess2"}
                                columnArr={[
                                    translate('task.task_management.col_name'),
                                    translate('project.task_management.preceedingTask'),
                                    translate('task.task_management.responsible'),
                                    translate('task.task_management.accountable'),
                                    translate('task.task_management.col_status'),
                                    'Thời điểm bắt đầu',
                                    'Thời điểm kết thúc dự kiến',
                                    'Thời điểm kết thúc thực tế',
                                    'Thời điểm bấm giờ',
                                    translate('task.task_management.col_progress'),
                                ]}
                                //setLimit={setLimit}
                            />
                        </th>*/}
                    </tr>
                </thead>
                <tbody>
                    {showData(dataShow)}
                </tbody>
            </table>
        </React.Fragment>
    );
}

function mapState(state) {
    //const { user, auth, role, taskProcess } = state;
    return {};
}

const actionCreators = {
    //getAllTaskProcess: TaskProcessActions.getAllTaskProcess,
    //getXmlDiagramById: TaskProcessActions.getXmlDiagramById,
};
const connectedTableReportTask = connect(mapState, actionCreators)(withTranslate(TableReportTask));
export { connectedTableReportTask as TableReportTask };
