import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual';
import { UserActions } from '../../../super-admin/user/redux/actions'
import { taskManagementActions } from '../../../task/task-management/redux/actions'
import { ProjectActions } from "../../projects/redux/actions";
import jsPERT, { pertProbability, START, END, Pert } from 'js-pert';
import { fakeObj, fakeArr } from './staticData';
import { Collapse } from 'react-bootstrap';
import { DialogModal, forceCheckOrVisible, LazyLoadComponent } from '../../../../common-components';
import { convertToMilliseconds, convertUserIdToUserName, getCurrentProjectDetails, handleWeekendAndWorkTime, processDataTasksStartEnd } from '../../projects/components/functionHelper';
import { Canvas, Node } from 'reaflow';
import { getNumsOfDaysWithoutGivenDay, getSalaryFromUserId, numberWithCommas } from '../../../task/task-management/component/functionHelpers';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import moment from 'moment';
import Swal from 'sweetalert2';
import { getStorage } from '../../../../config';
import ModalCalculateRecommend from './modalCalculateRecommend';
import { SchedulingProjectsActions } from '../redux/actions';

const ModalCalculateCPM = (props) => {
    const { tasksData, translate, project, user } = props;
    const [projectData, setProjectData] = useState(props.projectData);
    const [currentTasksData, setCurrentTasksData] = useState(tasksData);
    const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []
    // const projectDetail = getCurrentProjectDetails(project);
    const projectDetail = projectData ?? getCurrentProjectDetails(project);
    const [isTableShown, setIsTableShown] = useState(true);
    let formattedTasksData = {}

    useEffect(() => {
        setProjectData(props.projectData)
    }, [JSON.stringify(props.projectData)])

    useEffect(() => {
        console.log('tasksData co thay doi');
        setCurrentTasksData(tasksData);
        console.log('tasksData', tasksData)
    }, [tasksData]);

    for (let item of currentTasksData) {
        formattedTasksData = {
            ...formattedTasksData,
            [item.code]: {
                id: item.code,
                optimisticTime: Number(item.estimateOptimisticTime),
                mostLikelyTime: Number(item.estimateNormalTime),
                pessimisticTime:2 * Number(item.estimateNormalTime) - Number(item.estimateOptimisticTime),
                predecessors: item.preceedingTasks,
            }
        }
    }
    const pert = jsPERT(formattedTasksData || {});
    console.log(pert);

    useEffect(() => {
        const currentRole = getStorage("currentRole");
        props.getRoleSameDepartment(currentRole);
    }, [])

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

    const processedData = processDataTasksStartEnd(projectDetail, currentTasksData);

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
        let currentProcessData = [...processedData];
        console.log('currentProcessData ----------', currentProcessData)
        if (!findLatestDate(currentProcessData)) {
            currentProcessData = processDataTasksStartEnd(projectDetail, currentTasksData);
        }
        console.log('currentProcessData afterrrrrrr ----------', currentProcessData)
        console.log('findLatestDate(currentProcessData)', findLatestDate(currentProcessData))
        const message = moment(findLatestDate(currentProcessData)).isAfter(moment(projectDetail?.endDate))
            // ? "Thời gian tính toán nhiều hơn thời gian dự kiến. Bạn có chắc chắn tiếp tục thêm danh sách công việc dự án vào cơ sở dữ liệu?"
            ? "Thời gian tính toán nhiều hơn thời gian dự kiến. Bạn có chắc chắn tiếp tục thêm danh sách công việc vào dự án?"
            : "Bạn có muốn thêm danh sách công việc vào dự án?"
        // : "Bạn có muốn thêm danh sách công việc dự án vào cơ sở dữ liệu?"
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
                const newTasksList = currentProcessData.map((processDataItem, processDataIndex) => {
                    const responsiblesWithSalaryArr = processDataItem.currentResponsibleEmployees?.map((resItem, resIndex) => {
                        return ({
                            userId: resItem,
                            salary: getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, resItem),
                            weight: processDataItem.currentResWeightArr[resIndex].weight,
                        })
                    })
                    const accountablesWithSalaryArr = processDataItem.currentAccountableEmployees?.map((accItem, accIndex) => {
                        return ({
                            userId: accItem,
                            salary: getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, accItem),
                            weight: processDataItem.currentAccWeightArr[accIndex].weight,
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
                        totalResWeight: processDataItem.totalResWeight,
                        description: processDataItem.description
                    }
                });

                console.log('newTasksList', newTasksList);
                if (props.handleTaskProjectList) {
                    console.log("handleTaskProjectList");
                    props.handleTaskProjectList(newTasksList);
                } else {
                    // console.log("props.createProjectTasksFromCPMDispatch");
                    await props.createProjectTasksFromCPMDispatch(newTasksList);
                }
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
    useEffect(() => {
        console.log('processedData', processedData)
    }, [processedData])

    return (
        <React.Fragment>
            <div style={{ lineHeight: 1.5 }}>
                <div className="row">
                    {/* Button Thêm dữ liệu vào database */}
                    <div className="dropdown pull-right" style={{ marginTop: 15, marginRight: 10 }}>
                        <button
                            onClick={handleInsertListToDB}
                            type="button" className="btn btn-success dropdown-toggle" data-toggle="dropdown">
                            {`Lưu danh sách công việc dự án`}
                        </button>
                    </div>
                        <div className="dropdown pull-right" style={{ marginTop: 15, marginRight: 10 }}>
                            <ModalCalculateRecommend
                                handleApplyChange={handleApplyChange}
                                processedData={processedData}
                                projectData={projectDetail}
                                currentTasksData={currentTasksData}
                                oldCPMEndDate={findLatestDate(processedData)}
                            />
                            <button
                                onClick={handleCalculateRecommend}
                                type="button" className="btn btn-warning dropdown-toggle" data-toggle="dropdown">
                                {`Đề xuất tối ưu dự án`}
                            </button>
                        </div>
                </div>

                <ul className="nav nav-tabs">
                    <li className="active"><a href="#calc-cpm-table" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Bảng dữ liệu CPM</a></li>
                    <li><a href="#calc-cpm-graph" data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Đồ thị CPM</a></li>
                </ul>
                <div className="tab-content">
                    {/** Thông tin dự án */}
                    <div className="tab-pane active" id="calc-cpm-table">
                        <LazyLoadComponent
                            key="CalcCPMTable"
                        >
                            <div className="description-box without-border">
                                <h5>Ngày bắt đầu dự án: <strong>{moment(projectDetail?.startDate).format('HH:mm DD/MM/YYYY')}</strong></h5>
                                <h5>Ngày kết thúc dự án dự kiến: <strong>{moment(projectDetail?.endDate).format('HH:mm DD/MM/YYYY')}</strong></h5>
                                <h5>Ngày kết thúc dự án tính theo CPM:
                                    <strong style={{ color: moment(findLatestDate(processedData)).isAfter(moment(projectDetail?.endDate)) ? 'red' : 'green' }}>
                                        {' '}
                                        {moment(findLatestDate(processedData)).format('HH:mm DD/MM/YYYY')}
                                    </strong>
                                    {moment(findLatestDate(processedData)).isAfter(moment(projectDetail?.endDate)) &&
                                        <span style={{ color: 'red' }}> - Hãy sử dụng tính năng "Đề xuất tối ưu dự án" ở góc bên phải màn hình!</span>}
                                </h5>
                            </div>

                            <span style={{ color: 'green', marginLeft: 10 }}><strong>*Chú ý:</strong> Dòng màu xanh thể hiện công việc thuộc đường găng</span>
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
                                            {(currentTasksData && currentTasksData.length > 0) && processedData && processedData.length > 0 &&
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
                        </LazyLoadComponent>
                    </div>
                    {/** Danh sách công việc dự án */}
                    <div className="tab-pane" id="calc-cpm-graph">
                        <LazyLoadComponent
                            key="CalcCPMGraph"
                        >
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
                        </LazyLoadComponent>
                    </div>

                </div>
            </div>
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
    getRoleSameDepartment: UserActions.getRoleSameDepartment,
    createProjectTasksFromCPMDispatch: SchedulingProjectsActions.createProjectTasksFromCPMDispatch,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalCalculateCPM))
