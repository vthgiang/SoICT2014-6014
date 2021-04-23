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
import { convertUserIdToUserName, getCurrentProjectDetails } from '../projects/functionHelper';
import { Canvas, Node } from 'reaflow';
import { getSalaryFromUserId, numberWithCommas } from '../../../task/task-management/component/functionHelpers';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import moment from 'moment';
import Swal from 'sweetalert2';
import { getStorage } from '../../../../config';

const ModalCalculateCPM = (props) => {
    const { tasksData, translate, project, estDurationEndProject, user } = props;
    const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []
    // console.log('tasksData', tasksData)
    const projectDetail = getCurrentProjectDetails(project);
    const [isTableShown, setIsTableShown] = useState(true);
    let formattedTasksData = {}
    for (let item of tasksData) {
        formattedTasksData = {
            ...formattedTasksData,
            [item.code]: {
                id: item.code,
                optimisticTime: Number(item.estimateOptimisticTime),
                mostLikelyTime: Number(item.estimateNormalTime),
                pessimisticTime: Number(item.estimatePessimisticTime),
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

    const processDataBeforeInserted = () => {
        if (!tasksData || tasksData.length === 0) return [];
        const tempTasksData = [...tasksData];
        // Lặp mảng tasks
        for (let taskItem of tempTasksData) {
            if ((!taskItem.startDate || !taskItem.endDate) && taskItem.preceedingTasks.length === 0) {
                taskItem.startDate = projectDetail?.startDate;
                taskItem.endDate = moment(taskItem.startDate).add(taskItem.estimateNormalTime, 'days').format();
            } else {
                // Lặp mảng preceedingTasks của taskItem hiện tại
                for (let preceedingItem of taskItem.preceedingTasks) {
                    const currentPreceedingTaskItem = tempTasksData.find(item => {
                        return String(item.code) === String(preceedingItem.trim());
                    });
                    if (!taskItem.startDate ||
                        moment(taskItem.startDate)
                            .isBefore(moment(currentPreceedingTaskItem.endDate)))
                        taskItem.startDate = currentPreceedingTaskItem.endDate;
                    taskItem.endDate = moment(taskItem.startDate).add(taskItem.estimateNormalTime, 'days').format();
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
        const resultNodes = tasksData.map((taskItem, taskIndex) => {
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
        for (let taskItem of tasksData) {
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
        Swal.fire({
            html: `<h4 style="color: red"><div>Bạn có muốn thêm vào cơ sở dữ liệu?</div></h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: translate('general.no'),
            confirmButtonText: translate('general.yes'),
        }).then(async (result) => {
            if (result.value) {
                const newTasksList = processedData.map(processDataItem => {
                    const responsiblesWithSalaryArr = processDataItem.currentResponsibleEmployees?.map(resItem => {
                        return ({
                            userId: resItem,
                            salary: getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, resItem)
                        })
                    })
                    const accountablesWithSalaryArr = processDataItem.currentAccountableEmployees?.map(accItem => {
                        return ({
                            userId: accItem,
                            salary: getSalaryFromUserId(projectDetail?.responsibleEmployeesWithUnit, accItem)
                        })
                    })
                    const newActorsWithSalary= [...responsiblesWithSalaryArr, ...accountablesWithSalaryArr];
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
                        estimateNormalTime: processDataItem.estimateNormalTime,
                        estimateOptimisticTime: processDataItem.estimateOptimisticTime,
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
                props.handleResetData();
            }
        })
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
                                <table id="cpm-task-table" className="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>{translate('project.schedule.taskCode')}</th>
                                            <th>Công việc tiền nhiệm</th>
                                            <th>Người thực hiện</th>
                                            <th>Người phê duyệt</th>
                                            <th>Thời gian bắt đầu</th>
                                            <th>Thời gian dự kiến kết thúc</th>
                                            <th>{translate('project.schedule.estimatedTime')} (ngày)</th>
                                            <th>{translate('project.schedule.estimatedTimeOptimistic')} (ngày)</th>
                                            <th>{translate('project.schedule.estimatedCostNormal')} (VND)</th>
                                            <th>{translate('project.schedule.estimatedCostMaximum')} (VND)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(tasksData && tasksData.length > 0) &&
                                            processedData.map((taskItem, index) => (
                                                <tr key={index}>
                                                    <td style={{ color: pert.slack[taskItem?.code] === 0 ? 'green' : 'black' }}>{taskItem?.code}</td>
                                                    <td style={{ color: pert.slack[taskItem?.code] === 0 ? 'green' : 'black' }}>{taskItem?.preceedingTasks.join(', ')}</td>
                                                    <td style={{ color: pert.slack[taskItem?.code] === 0 ? 'green' : 'black' }}>{taskItem?.currentResponsibleEmployees ?
                                                        taskItem?.currentResponsibleEmployees
                                                            .map(userId => convertUserIdToUserName(listUsers, userId)).join(', ') : null}
                                                    </td>
                                                    <td style={{ color: pert.slack[taskItem?.code] === 0 ? 'green' : 'black' }}>{taskItem?.currentAccountableEmployees ?
                                                        taskItem?.currentAccountableEmployees
                                                            .map(userId => convertUserIdToUserName(listUsers, userId)).join(', ') : null}
                                                    </td>
                                                    <td style={{ color: pert.slack[taskItem?.code] === 0 ? 'green' : 'black' }}>{moment(taskItem?.startDate).format('HH:mm DD/MM/YYYY')}</td>
                                                    <td style={{ color: pert.slack[taskItem?.code] === 0 ? 'green' : 'black' }}>{moment(taskItem?.endDate).format('HH:mm DD/MM/YYYY')}</td>
                                                    <td style={{ color: pert.slack[taskItem?.code] === 0 ? 'green' : 'black' }}>{taskItem?.estimateNormalTime}</td>
                                                    <td style={{ color: pert.slack[taskItem?.code] === 0 ? 'green' : 'black' }}>{taskItem?.estimateOptimisticTime}</td>
                                                    <td style={{ color: pert.slack[taskItem?.code] === 0 ? 'green' : 'black' }}>{taskItem?.estimateNormalCost}</td>
                                                    <td style={{ color: pert.slack[taskItem?.code] === 0 ? 'green' : 'black' }}>{taskItem?.estimateMaxCost}</td>
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
                                            style={{ backgroundColor: event.node.data.slack === 0 ? 'red' : 'white' }}
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
