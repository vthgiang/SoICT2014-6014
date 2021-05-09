import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual';
import { UserActions } from '../../../super-admin/user/redux/actions'
import { taskManagementActions } from '../../../task/task-management/redux/actions'
import { ProjectActions } from '../../redux/actions'
import jsPERT, { pertProbability, START, END, Pert } from 'js-pert';
import { fakeObj, fakeArr } from './staticData';
import { Collapse } from 'react-bootstrap';
import { DialogModal } from '../../../../common-components';
import { convertToMilliseconds, convertUserIdToUserName, getCurrentProjectDetails } from '../projects/functionHelper';
import { Canvas, Node } from 'reaflow';
import { getNumsOfDaysWithoutGivenDay, getSalaryFromUserId, numberWithCommas } from '../../../task/task-management/component/functionHelpers';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import moment from 'moment';
import Swal from 'sweetalert2';
import { getStorage } from '../../../../config';
import ModalCalculateRecommend from './modalCalculateRecommend';

const ModalCalculateCPM = (props) => {
    const { tasksData, translate, project, user } = props;
    const [currentTasksData, setCurrentTasksData] = useState(tasksData);
    const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []
    const projectDetail = getCurrentProjectDetails(project);
    const [isTableShown, setIsTableShown] = useState(true);
    let formattedTasksData = {}

    useEffect(() => {
        console.log('tasksData co thay doi');
        setCurrentTasksData(tasksData);
    }, [tasksData]);

    for (let item of currentTasksData) {
        formattedTasksData = {
            ...formattedTasksData,
            [item.code]: {
                id: item.code,
                optimisticTime: Number(item.estimateOptimisticTime),
                mostLikelyTime: Number(item.estimateNormalTime),
                pessimisticTime: Number(item.estimateNormalTime) + 2,
                predecessors: item.preceedingTasks,
            }
        }
    }
    const pert = jsPERT(formattedTasksData || {});
    // const pert = jsPERT(fakeObj);

    useEffect(() => {
        const currentRole = getStorage("currentRole");
        props.getRoleSameDepartment(currentRole);
    }, [])

    const handleWeekendAndWorkTime = (taskItem) => {
        // Nếu unitTime = 'days'
        if (projectDetail?.unitTime === 'days') {
            // Check xem startDate có phải thứ 7 hoặc chủ nhật không thì cộng thêm ngày để startDate vào ngày thứ 2 tuần sau
            let dayOfStartDate = (new Date(taskItem.startDate)).getDay();
            if (dayOfStartDate === 6) taskItem.startDate = moment(taskItem.startDate).add(2, 'days').format();
            if (dayOfStartDate === 0) taskItem.startDate = moment(taskItem.startDate).add(1, 'days').format();
            // Tách phần integer và phần decimal của estimateNormalTime
            const estimateNormalTimeArr = taskItem.estimateNormalTime.toString().split('.');
            const integerPart = Number(estimateNormalTimeArr[0]);
            const decimalPart = estimateNormalTimeArr.length === 2 ? Number(`.${estimateNormalTimeArr[1]}`) : undefined;
            let tempEndDate = '';
            // Cộng phần nguyên
            for (let i = 0; i < integerPart; i++) {
                // Tính tempEndDate = + 1 ngày trước để kiểm tra
                if (i === 0) {
                    tempEndDate = moment(taskItem.startDate).add(1, 'days').format();
                } else {
                    tempEndDate = moment(taskItem.endDate).add(1, 'days').format();
                }
                // Nếu tempEndDate đang là thứ 7 thì công thêm 2 ngày
                if ((new Date(tempEndDate)).getDay() === 6) {
                    taskItem.endDate = moment(tempEndDate).add(2, 'days').format();
                }
                // Nếu tempEndDate đang là chủ nhật thì công thêm 1 ngày
                else if ((new Date(tempEndDate)).getDay() === 0) {
                    taskItem.endDate = moment(tempEndDate).add(1, 'days').format();
                }
                // Còn không thì không cộng gì
                else {
                    taskItem.endDate = tempEndDate;
                }
            }
            // Cộng phần thập phân (nếu có)
            if (decimalPart) {
                if (!taskItem.endDate) {
                    taskItem.endDate = moment(taskItem.startDate).add(decimalPart, 'days').format();
                } else {
                    taskItem.endDate = moment(taskItem.endDate).add(decimalPart, 'days').format();
                }
                // Check xem endDate hiện tại là thứ mấy => Cộng tiếp để bỏ qua thứ 7 và chủ nhật (nếu có)
                dayOfStartDate = (new Date(taskItem.endDate)).getDay();
                if (dayOfStartDate === 6) taskItem.endDate = moment(taskItem.endDate).add(2, 'days').format();
                if (dayOfStartDate === 0) taskItem.endDate = moment(taskItem.endDate).add(1, 'days').format();
            }
            return taskItem;
        }

        // Nếu unitTime = 'hours'
        const dailyMorningStartTime = moment('08:00', 'HH:mm');
        const dailyMorningEndTime = moment('12:00', 'HH:mm');
        const dailyAfternoonStartTime = moment('13:30', 'HH:mm');
        const dailyAfternoonEndTime = moment('17:30', 'HH:mm');
        // Check xem startDate có phải thứ 7 hoặc chủ nhật không thì cộng thêm ngày để startDate vào ngày thứ 2 tuần sau
        let dayOfStartDate = (new Date(taskItem.startDate)).getDay();
        if (dayOfStartDate === 6) taskItem.startDate = moment(taskItem.startDate).add(2, 'days').format();
        if (dayOfStartDate === 0) taskItem.startDate = moment(taskItem.startDate).add(1, 'days').format();
        // Tách phần integer và phần decimal của estimateNormalTime
        const estimateNormalTimeArr = taskItem.estimateNormalTime.toString().split('.');
        const integerPart = Number(estimateNormalTimeArr[0]);
        const decimalPart = estimateNormalTimeArr.length === 2 ? Number(`.${estimateNormalTimeArr[1]}`) : undefined;
        let tempEndDate = '';
        // Cộng phần nguyên
        for (let i = 0; i < integerPart; i++) {
            // Tính tempEndDate = + 1 tiêng trước để kiểm tra
            if (i === 0) {
                tempEndDate = moment(taskItem.startDate).add(1, 'hours').format();
            } else {
                tempEndDate = moment(taskItem.endDate).add(1, 'hours').format();
            }
            const currentEndDateInMomentHourMinutes = moment(moment(tempEndDate).format('HH:mm'), 'HH:mm');
            // Nếu đang ở giờ nghỉ trưa
            if (currentEndDateInMomentHourMinutes.isAfter(dailyMorningEndTime) && currentEndDateInMomentHourMinutes.isBefore(dailyAfternoonStartTime)) {
                tempEndDate = moment(tempEndDate).set({
                    hour: 13,
                    minute: 30,
                });
                tempEndDate = moment(tempEndDate).add(1, 'hours').format();
            }
            // Nếu quá 17:30
            else if (currentEndDateInMomentHourMinutes.isAfter(dailyAfternoonEndTime)) {
                tempEndDate = moment(tempEndDate).set({
                    hour: 8,
                    minute: 0,
                });
                tempEndDate = moment(tempEndDate).add(1, 'hours').format();
                tempEndDate = moment(tempEndDate).add(1, 'days').format();
            }
            // Nếu tempEndDate đang là thứ 7 thì công thêm 2 ngày
            if ((new Date(tempEndDate)).getDay() === 6) {
                taskItem.endDate = moment(tempEndDate).add(2, 'days').format();
            }
            // Nếu tempEndDate đang là chủ nhật thì công thêm 1 ngày
            else if ((new Date(tempEndDate)).getDay() === 0) {
                taskItem.endDate = moment(tempEndDate).add(1, 'days').format();
            }
            // Còn không thì không cộng gì
            else {
                taskItem.endDate = tempEndDate;
            }
        }
        // Cộng phần thập phân (nếu có)
        if (decimalPart) {
            if (!taskItem.endDate) {
                taskItem.endDate = moment(taskItem.startDate).add(decimalPart, 'hours').format();
            } else {
                taskItem.endDate = moment(taskItem.endDate).add(decimalPart, 'hours').format();
            }
            // Check xem endDate hiện tại là thứ mấy => Cộng tiếp để bỏ qua thứ 7 và chủ nhật (nếu có)
            dayOfStartDate = (new Date(taskItem.endDate)).getDay();
            if (dayOfStartDate === 6) taskItem.endDate = moment(taskItem.endDate).add(2, 'days').format();
            if (dayOfStartDate === 0) taskItem.endDate = moment(taskItem.endDate).add(1, 'days').format();
        }
        return taskItem;
    }

    const processDataBeforeInserted = () => {
        if (!currentTasksData || currentTasksData.length === 0) return [];
        const tempTasksData = [...currentTasksData];
        // Lặp mảng tasks
        for (let taskItem of tempTasksData) {
            if ((!taskItem.startDate || !taskItem.endDate) && taskItem.preceedingTasks.length === 0) {
                taskItem.startDate = projectDetail?.startDate;
                taskItem = handleWeekendAndWorkTime(taskItem);
            } else {
                // Lặp mảng preceedingTasks của taskItem hiện tại
                for (let preceedingItem of taskItem.preceedingTasks) {
                    const currentPreceedingTaskItem = tempTasksData.find(item => {
                        return String(item.code) === String(preceedingItem.trim());
                    });
                    if (!taskItem.startDate ||
                        moment(taskItem.startDate)
                            .isBefore(moment(currentPreceedingTaskItem.endDate))) {
                        taskItem.startDate = currentPreceedingTaskItem.endDate;
                    }
                    taskItem = handleWeekendAndWorkTime(taskItem);
                }
            }
        }
        // console.log('tempTasksData', tempTasksData);
        return tempTasksData;
    }

    const handleCalculateRecommend = () => {
        setTimeout(() => {
            window.$(`#modal-calculate-recommend`).modal('show');
        }, 10);
    }

    const processNodes = () => {
        const resultNodes = currentTasksData.map((taskItem, taskIndex) => {
            // const resultNodes = fakeArr.map((taskItem, taskIndex) => {
            return ({
                id: taskItem.code,
                height: 80,
                width: 250,
                data: {
                    code: taskItem.code,
                    es: pert.earliestStartTimes[taskItem.code],
                    ls: pert.latestFinishTimes[taskItem.code],
                    ef: pert.earliestFinishTimes[taskItem.code],
                    lf: pert.latestFinishTimes[taskItem.code],
                    slack: pert.slack[taskItem.code],
                }
            })
        })
        return resultNodes;
    }

    const processEdges = () => {
        let resultEdges = [];
        for (let taskItem of currentTasksData) {
            // for (let taskItem of fakeArr) {
            for (let preceedingItem of taskItem.preceedingTasks) {
                // console.log('taskItem.preceedingTasks', taskItem.preceedingTasks)
                resultEdges.push({
                    id: preceedingItem.trim() ? `${preceedingItem.trim()}-${taskItem.code}` : `${taskItem.code}`,
                    from: preceedingItem.trim(),
                    to: taskItem.code,
                })
            }
        }
        // console.log('resultEdges', resultEdges)
        return resultEdges;
    }

    const processedData = processDataBeforeInserted();

    // Tìm kiếm endDate muộn nhất trong list tasks
    const findLatestDate = (data) => {
        if (data.length === 0) return null;
        let currentMax = data[0].endDate;
        for (let dataItem of data) {
            if (moment(dataItem.endDate).isAfter(moment(currentMax))) {
                currentMax = dataItem.endDate;
            }
        }
        return currentMax;
    }

    const handleInsertListToDB = () => {
        const message = moment(findLatestDate(processedData)).isAfter(moment(projectDetail?.endDate))
            ? "Thời gian tính toán nhiều hơn thời gian dự kiến. Bạn có chắc chắn tiếp tục thêm vào cơ sở dữ liệu?"
            : "Bạn có muốn thêm vào cơ sở dữ liệu?"
        Swal.fire({
            html: `<h4 style="color: red"><div>${message}</div></h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: translate('general.no'),
            confirmButtonText: translate('general.yes'),
        }).then(async (result) => {
            if (result.value) {
                const newTasksList = processedData.map((processDataItem, processDataIndex) => {
                    const responsiblesWithSalaryArr = processDataItem.currentResponsibleEmployees?.map(resItem => {
                        return ({
                            userId: resItem,
                            salary: getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, resItem),
                            weight: processDataItem.currentResWeightArr[processDataIndex].weight,
                        })
                    })
                    const accountablesWithSalaryArr = processDataItem.currentAccountableEmployees?.map(accItem => {
                        return ({
                            userId: accItem,
                            salary: getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, accItem),
                            weight: processDataItem.currentAccWeightArr[processDataIndex].weight,
                        })
                    })
                    const newActorsWithSalary = [...responsiblesWithSalaryArr, ...accountablesWithSalaryArr];
                    const preceedingTasks = processDataItem.preceedingTasks?.map(item => ({
                        task: item.trim(),
                        link: ''
                    }))
                    return {
                        creator: getStorage('userId'),
                        code: processDataItem.code,
                        name: processDataItem.name,
                        taskProject: projectDetail?._id,
                        organizationalUnit: user?.roledepartments?._id,
                        estimateNormalTime: convertToMilliseconds(processDataItem.estimateNormalTime, projectDetail?.unitTime),
                        estimateOptimisticTime: convertToMilliseconds(processDataItem.estimateOptimisticTime, projectDetail?.unitTime),
                        estimateNormalCost: Number(processDataItem.estimateNormalCost.replace(/,/g, '')),
                        estimateMaxCost: Number(processDataItem.estimateMaxCost.replace(/,/g, '')),
                        estimateAssetCost: Number(processDataItem.currentAssetCost.replace(/,/g, '')),
                        startDate: processDataItem.startDate,
                        endDate: processDataItem.endDate,
                        actorsWithSalary: newActorsWithSalary,
                        preceedingTasks,
                        responsibleEmployees: processDataItem.currentResponsibleEmployees,
                        accountableEmployees: processDataItem.currentAccountableEmployees,
                    }
                });

                console.log('newTasksList', newTasksList);
                await props.createProjectTasksFromCPMDispatch(newTasksList);
                props.handleHideModal();
            }
        })
    }

    const renderRowTableStyle = (condition) => {
        if (condition) {
            return {
                color: 'white',
                backgroundColor: '#28A745',
            }
        }
        return {
            color: 'black',
            backgroundColor: 'white',
        }
    }

    const handleApplyChange = (newData) => {
        setCurrentTasksData(newData);
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-show-info-calculate-cpm`} isLoading={false}
                formID={`form-show-info-calculate-cpm`}
                title={translate('project.schedule.calculateCPM')}
                hasSaveButton={false}
                size={100}
            >
                <div>
                    <div className="row">
                        {/* Button Thêm dữ liệu vào database */}
                        <div className="dropdown pull-right" style={{ marginTop: 15, marginRight: 10 }}>
                            <button
                                onClick={handleInsertListToDB}
                                type="button" className="btn btn-success dropdown-toggle" data-toggle="dropdown">
                                {translate('project.schedule.insertListTasksToDB')}
                            </button>
                        </div>
                        {/* Button Tính toán mức thoả hiệp dự án */}
                        {moment(findLatestDate(processedData)).isAfter(moment(projectDetail?.endDate))
                            &&
                            <div className="dropdown pull-right" style={{ marginTop: 15, marginRight: 10 }}>
                                <ModalCalculateRecommend handleApplyChange={handleApplyChange} processedData={processedData} currentTasksData={currentTasksData} oldCPMEndDate={findLatestDate(processedData)} />
                                <button
                                    onClick={handleCalculateRecommend}
                                    type="button" className="btn btn-warning dropdown-toggle" data-toggle="dropdown">
                                    {translate('project.schedule.calculateRecommend')}
                                </button>
                            </div>}
                    </div>

                    {/* Bảng dữ liệu CPM */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">Bảng dữ liệu CPM</legend>

                        <div style={{ marginLeft: 10 }}>
                            <h5>Ngày bắt đầu dự án: <strong>{moment(projectDetail?.startDate).format('HH:mm DD/MM/YYYY')}</strong></h5>
                            <h5>Ngày kết thúc dự án dự kiến: <strong>{moment(projectDetail?.endDate).format('HH:mm DD/MM/YYYY')}</strong></h5>
                            <h5>Ngày kết thúc dự án tính theo CPM:
                                <strong style={{ color: moment(findLatestDate(processedData)).isAfter(moment(projectDetail?.endDate)) ? 'red' : 'green' }}>
                                    {' '}
                                    {moment(findLatestDate(processedData)).format('HH:mm DD/MM/YYYY')}
                                </strong>
                            </h5>
                        </div>

                        {/* Button toggle bảng dữ liệu */}
                        <div className="dropdown" style={{ marginTop: 15, marginRight: 10 }}>
                            <button
                                onClick={() => setIsTableShown(!isTableShown)}
                                type="button" className="btn btn-link dropdown-toggle" data-toggle="dropdown"
                                aria-controls="cpm-task-table"
                                aria-expanded={isTableShown}>
                                {translate(isTableShown ? 'project.schedule.hideTableCPM' : 'project.schedule.showTableCPM')}
                            </button>
                            <Collapse in={isTableShown}>
                                <table id="cpm-task-table" className="table table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>{translate('project.schedule.taskCode')}</th>
                                            <th>Công việc tiền nhiệm</th>
                                            <th>Người thực hiện</th>
                                            <th>Người phê duyệt</th>
                                            <th>Thời gian bắt đầu</th>
                                            <th>Thời gian dự kiến kết thúc (không tính T7, CN)</th>
                                            <th>{translate('project.schedule.estimatedTime')} ({translate(`project.unit.${projectDetail?.unitTime}`)})</th>
                                            <th>Thời gian thoả hiệp ({translate(`project.unit.${projectDetail?.unitTime}`)})</th>
                                            <th>{translate('project.schedule.estimatedCostNormal')} (VND)</th>
                                            <th>{translate('project.schedule.estimatedCostMaximum')} (VND)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(currentTasksData && currentTasksData.length > 0) &&
                                            processedData.map((taskItem, index) => (
                                                <tr key={index}>
                                                    <td style={renderRowTableStyle(pert.slack[taskItem?.code] === 0)}>{taskItem?.code}</td>
                                                    <td style={renderRowTableStyle(pert.slack[taskItem?.code] === 0)}>{taskItem?.preceedingTasks.join(', ')}</td>
                                                    <td style={renderRowTableStyle(pert.slack[taskItem?.code] === 0)}>{taskItem?.currentResponsibleEmployees ?
                                                        taskItem?.currentResponsibleEmployees
                                                            .map(userId => convertUserIdToUserName(listUsers, userId)).join(', ') : null}
                                                    </td>
                                                    <td style={renderRowTableStyle(pert.slack[taskItem?.code] === 0)}>{taskItem?.currentAccountableEmployees ?
                                                        taskItem?.currentAccountableEmployees
                                                            .map(userId => convertUserIdToUserName(listUsers, userId)).join(', ') : null}
                                                    </td>
                                                    <td style={renderRowTableStyle(pert.slack[taskItem?.code] === 0)}>{moment(taskItem?.startDate).format('HH:mm DD/MM/YYYY')}</td>
                                                    <td style={renderRowTableStyle(pert.slack[taskItem?.code] === 0)}>{moment(taskItem?.endDate).format('HH:mm DD/MM/YYYY')}</td>
                                                    <td style={renderRowTableStyle(pert.slack[taskItem?.code] === 0)}>{taskItem?.estimateNormalTime}</td>
                                                    <td style={renderRowTableStyle(pert.slack[taskItem?.code] === 0)}>{taskItem?.estimateOptimisticTime}</td>
                                                    <td style={renderRowTableStyle(pert.slack[taskItem?.code] === 0)}>{taskItem?.estimateNormalCost}</td>
                                                    <td style={renderRowTableStyle(pert.slack[taskItem?.code] === 0)}>{taskItem?.estimateMaxCost}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </Collapse>
                        </div>
                    </fieldset>

                    {/* Đồ thị CPM */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">Đồ thị CPM</legend>
                        <Canvas
                            nodes={processNodes()}
                            edges={processEdges()}
                            width={'100%'}
                            height={500}
                            direction="RIGHT"
                            center={true}
                            fit={true}
                            node={
                                <Node>
                                    {event => (
                                        <foreignObject
                                            style={{ backgroundColor: event.node.data.slack === 0 ? 'green' : 'white' }}
                                            height={event.height} width={event.width}
                                            x={0}
                                            y={0}
                                        >
                                            <table className="table table-bordered" style={{ height: '100%' }}>
                                                <tbody>
                                                    <tr>
                                                        <td><strong style={{ color: event.node.data.slack === 0 ? 'white' : 'black' }}>{event.node.data.code}</strong></td>
                                                        <td style={{ color: event.node.data.slack === 0 ? 'white' : 'black' }}>ES: {numberWithCommas(event.node.data.es)}</td>
                                                        <td style={{ color: event.node.data.slack === 0 ? 'white' : 'black' }}>LS: {numberWithCommas(event.node.data.ls)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{ color: event.node.data.slack === 0 ? 'white' : 'black' }}>Slack: {numberWithCommas(event.node.data.slack)}</td>
                                                        <td style={{ color: event.node.data.slack === 0 ? 'white' : 'black' }}>EF: {numberWithCommas(event.node.data.ef)}</td>
                                                        <td style={{ color: event.node.data.slack === 0 ? 'white' : 'black' }}>LF: {numberWithCommas(event.node.data.lf)}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </foreignObject>
                                    )}
                                </Node>
                            }
                            onLayoutChange={layout => null}
                        />
                    </fieldset>
                </div>
            </DialogModal>
        </React.Fragment>
    )
}

const mapStateToProps = (state) => {
    const { project, user } = state;
    return { project, user }
}

const mapDispatchToProps = {
    getProjectsDispatch: ProjectActions.getProjectsDispatch,
    deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getTasksByProject: taskManagementActions.getTasksByProject,
    getRoleSameDepartment: UserActions.getRoleSameDepartment,
    createProjectTasksFromCPMDispatch: ProjectActions.createProjectTasksFromCPMDispatch,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalCalculateCPM))
