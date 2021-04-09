import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual';
import { UserActions } from '../../../super-admin/user/redux/actions'
import { taskManagementActions } from '../../../task/task-management/redux/actions'
import { ProjectActions } from '../../redux/actions'
import jsPERT, { pertProbability, START, END, Pert } from 'js-pert';
import { fakeObj, fakeArr } from './staticData';
import { Collapse } from 'react-bootstrap';
import { DialogModal } from '../../../../common-components';
import { getCurrentProjectDetails } from '../projects/functionHelper';
import { Canvas, Node } from 'reaflow';

const ModalCalculateCPM = (props) => {
    const { tasksData, translate, project, estDurationEndProject } = props;
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
    const estProjectDone = (pertProbability(pert, estDurationEndProject) * 100);

    const handleInsertListToDB = () => {

    }

    // const handleCalculateRecommend = () => {
    //     setTimeout(() => {
    //         window.$(`#modal-calculate-recommend`).modal('show');
    //     }, 10);
    // }

    const processNodes = () => {
        const resultNodes = tasksData.map((taskItem, taskIndex) => {
            // const resultNodes = fakeArr.map((taskItem, taskIndex) => {
            return ({
                id: taskItem.code,
                height: 80,
                width: 200,
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
                console.log('taskItem.preceedingTasks', taskItem.preceedingTasks)
                resultEdges.push({
                    id: preceedingItem.trim() ? `${preceedingItem.trim()}-${taskItem.code}` : `${taskItem.code}`,
                    from: preceedingItem.trim(),
                    to: taskItem.code,
                })
            }
        }
        console.log('resultEdges', resultEdges)
        return resultEdges;
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
                        {/* <div className="dropdown pull-right" style={{ marginTop: 15, marginRight: 10 }}>
                            <button
                                onClick={handleCalculateRecommend}
                                type="button" className="btn btn-success dropdown-toggle" data-toggle="dropdown">
                                {translate('project.schedule.calculateRecommend')}
                            </button>
                        </div> */}
                    </div>

                    {/* Bảng dữ liệu CPM */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">Bảng dữ liệu CPM</legend>

                        <div style={{ flexDirection: 'row', display: 'flex', marginLeft: 10 }}>
                            <h4><strong>{translate('project.schedule.percentFinishTask')} {estDurationEndProject} {translate(`project.unit.${projectDetail?.unitTime}`)}:</strong></h4>
                            <h4 style={{ marginLeft: 5 }}>{estProjectDone.toFixed(2)}%</h4>
                        </div>

                        {/* Button toggle bảng dữ liệu */}
                        <div className="dropdown" style={{ marginTop: 15, marginRight: 10 }}>
                            <button
                                onClick={() => setIsTableShown(!isTableShown)}
                                type="button" className="btn btn-success dropdown-toggle" data-toggle="dropdown"
                                aria-controls="cpm-task-table"
                                aria-expanded={isTableShown}>
                                {translate(isTableShown ? 'project.schedule.hideTableCPM' : 'project.schedule.showTableCPM')}
                            </button>
                            <Collapse in={isTableShown}>
                                <table id="cpm-task-table" className="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>{translate('project.schedule.taskCode')}</th>
                                            <th>ES</th>
                                            <th>LS</th>
                                            <th>EF</th>
                                            <th>LF</th>
                                            <th>{translate('project.schedule.slack')}</th>
                                            <th>{translate('project.schedule.criticalPath')}</th>
                                            <th>{translate('project.schedule.estimatedTime')}</th>
                                            <th>{translate('project.schedule.estimatedTimeOptimistic')}</th>
                                            <th>{translate('project.schedule.estimatedTimePessimistic')}</th>
                                            <th>{translate('project.schedule.estimatedCostNormal')}</th>
                                            <th>{translate('project.schedule.estimatedCostMaximum')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(tasksData && tasksData.length > 0) &&
                                            tasksData.map((taskItem, index) => (
                                                <tr key={index}>
                                                    <td>{taskItem?.code}</td>
                                                    <td>{pert.earliestStartTimes[taskItem?.code]}</td>
                                                    <td>{pert.latestStartTimes[taskItem?.code]}</td>
                                                    <td>{pert.earliestFinishTimes[taskItem?.code]}</td>
                                                    <td>{pert.latestFinishTimes[taskItem?.code]}</td>
                                                    <td>{pert.slack[taskItem?.code]}</td>
                                                    <td>{pert.slack[taskItem?.code] === 0 ? 'Đúng' : ''}</td>
                                                    <td>{taskItem?.estimateNormalTime}</td>
                                                    <td>{taskItem?.estimateOptimisticTime}</td>
                                                    <td>{taskItem?.estimatePessimisticTime}</td>
                                                    <td>{taskItem?.estimateNormalCost}</td>
                                                    <td>{taskItem?.estimateMaxCost}</td>
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
                                        <foreignObject style={{ backgroundColor: 'white' }} height={event.height} width={event.width} x={0} y={0}>
                                            <table className="table table-bordered" style={{ height: '100%' }}>
                                                <tbody>
                                                    <tr>
                                                        <td><strong>{event.node.data.code}</strong></td>
                                                        <td>ES: {event.node.data.es}</td>
                                                        <td>LS: {event.node.data.ls}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Slack: {event.node.data.slack}</td>
                                                        <td>EF: {event.node.data.ef}</td>
                                                        <td>LF: {event.node.data.lf}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </foreignObject>
                                    )}
                                </Node>
                            }
                            onLayoutChange={layout => console.log('Layout', layout)}
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
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalCalculateCPM))
