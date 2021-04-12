import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, SelectBox } from '../../../../common-components/index';
import { ProjectActions } from '../../redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { taskManagementActions } from '../../../task/task-management/redux/actions';
import { getCurrentProjectDetails } from '../projects/functionHelper';
import ModalCalculateCPM from './modalCalculateCPM';
import ModalExcelImport from './modalExcelImport';

const ModalAddTaskSchedule = (props) => {
    const { translate, project } = props;
    const projectDetail = getCurrentProjectDetails(project);
    const [state, setState] = useState({
        taskInit: {
            taskProject: projectDetail?._id,
            code: `DXT${projectDetail?._id.substring(0, 6)}-0`,
            name: '',
            preceedingTasks: [],
            estimateNormalTime: '',
            estimateOptimisticTime: '',
            estimatePessimisticTime: '',
            estimateNormalCost: '',
            estimateMaxCost: '',
            startDate: '',
            endDate: '',
        },
        listTasks: [],
    })
    const modeImportCPM = [
        {
            text: 'Thêm bằng tay',
            value: 'HAND',
        },
        {
            text: 'Thêm từ file excel',
            value: 'EXCEL',
        },
    ]
    const [currentModeImport, setCurrentModeImport] = useState('HAND');
    const [estDurationEndProject, setEstDurationEndProject] = useState(0)
    const { listTasks } = state;

    const handleAddRow = () => {
        const oldListTasks = state.listTasks;
        const newListTasks = [...oldListTasks, state.taskInit];
        setState({
            ...state,
            listTasks: newListTasks,
            taskInit: {
                taskProject: projectDetail?._id,
                code: `${state.taskInit.code.split('-')[0]}-${Number(state.taskInit.code.split('-')[1]) + 1}`,
                name: '',
                preceedingTasks: [],
                estimateNormalTime: '',
                estimateOptimisticTime: '',
                estimatePessimisticTime: '',
                estimateNormalCost: '',
                estimateMaxCost: '',
                startDate: '',
                endDate: '',
            },
        })
    }

    const handleChangeForm = (value, type) => {
        if (type === 'preceedingTasks') {
            setState({
                ...state,
                taskInit: {
                    ...state.taskInit,
                    [type]: value,
                }
            })
            return;
        }
        if (type === 'estimateNormalTime') {
            setState({
                ...state,
                taskInit: {
                    ...state.taskInit,
                    estimateNormalTime: value,
                    estimateOptimisticTime: (Number(value) - 2).toString(),
                    estimatePessimisticTime: (Number(value) + 2).toString(),
                }
            })
            return;
        }
        if (type === 'estimateNormalCost') {
            setState({
                ...state,
                taskInit: {
                    ...state.taskInit,
                    estimateNormalCost: value,
                    estimateMaxCost: (Number(value) + Math.floor(Number(value) / 100)).toString(),
                }
            })
            return;
        }
        setState({
            ...state,
            taskInit: {
                ...state.taskInit,
                [type]: value
            }
        })
    }

    const handleDelete = (index) => {
        if (listTasks && listTasks.length > 0) {
            // listTasks.splice(index, 1);
            listTasks.splice(listTasks.length - 1, 1);
            const newListTasks = listTasks.map((item, id) => ({
                ...item,
                code: `${state.taskInit.code.split('-')[0]}-${id}`
            }))
            setState({
                ...state,
                listTasks: newListTasks,
                taskInit: {
                    ...state.taskInit,
                    code: `${state.taskInit.code.split('-')[0]}-${Number(state.taskInit.code.split('-')[1]) - 1}`,
                }
            })
        }
    }

    const handleOpenCalculateCPM = () => {
        setTimeout(() => {
            window.$(`#modal-show-info-calculate-cpm`).modal('show');
        }, 10);
    }

    const handleOpenExcelImport = () => {
        setTimeout(() => {
            window.$(`#modal-import-cpm-data`).modal('show');
        }, 10);
    }

    const handleImportCPM = (data) => {
        setState({
            ...state,
            listTasks: data
        });
    }

    const handleSetModeCPM = async (event) => {
        await setCurrentModeImport(event[0]);
        await setState({
            taskInit: {
                taskProject: projectDetail?._id,
                code: `DXT${projectDetail?._id.substring(0, 6)}-0`,
                name: '',
                preceedingTasks: [],
                estimateNormalTime: '',
                estimateOptimisticTime: '',
                estimatePessimisticTime: '',
                estimateNormalCost: '',
                estimateMaxCost: '',
                startDate: '',
                endDate: '',
            },
            listTasks: [],
        })
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-add-task-schedule`} isLoading={false}
                formID={`form-add-task-schedule`}
                title={translate('project.add_btn_scheduling')}
                size={100}
                hasSaveButton={false}
            >
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">Thông số dự án</legend>
                    <div className="row md-12">
                        <div className={`form-group col-md-3`}>
                            <label>{translate('project.code')}</label>
                            <div>{projectDetail?.code}</div>
                        </div>
                        <div className={`form-group col-md-3`}>
                            <label>{translate('project.unitTime')}</label>
                            <div>{translate(`project.unit.${projectDetail?.unitTime}`)}</div>
                        </div>
                        <div className={`form-group col-md-3`}>
                            <label>{translate('project.unitCost')}</label>
                            <div>{projectDetail?.unitCost}</div>
                        </div>
                        <div className={`form-group col-md-3`}>
                            <label>Khoảng thời gian dự kiến hoàn thành dự án</label>
                            <input
                                type="number"
                                value={estDurationEndProject}
                                onChange={(event) => setEstDurationEndProject(event?.target?.value)}
                                className="form-control" />
                        </div>
                    </div>
                </fieldset>

                {/* Phần import excel */}
                <ModalExcelImport importCPM={handleImportCPM} />

                {/* Chọn chế độ import task cpm */}
                <div className="form-group pull-right">
                    <label>Chọn chế độ thêm công việc</label>
                    <SelectBox
                        id={`select-mode-import-cpm`}
                        className="form-control select2"
                        style={{ width: "100%" }}
                        items={modeImportCPM}
                        onChange={handleSetModeCPM}
                        value={currentModeImport}
                        multiple={false}
                    />
                </div>

                {/* Button open modal import excel */}
                {currentModeImport === 'EXCEL' ? <div className="dropdown pull-right" style={{ marginTop: 20, marginRight: 10 }}>
                    <button
                        onClick={handleOpenExcelImport}
                        type="button" className="btn btn-success dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true"
                        title={translate('project.add_btn_from_excel')}>
                        {translate('project.add_btn_from_excel')}
                    </button>
                </div> : null}

                <table id="project-table" className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>{translate('project.schedule.taskCode')}</th>
                            <th>{translate('project.schedule.taskName')}</th>
                            <th>{translate('project.schedule.preceedingTasks')}</th>
                            <th>{translate('project.schedule.estimatedTime')}</th>
                            <th>{translate('project.schedule.estimatedTimeOptimistic')}</th>
                            <th>{translate('project.schedule.estimatedTimePessimistic')}</th>
                            <th>{translate('project.schedule.estimatedCostNormal')}</th>
                            <th>{translate('project.schedule.estimatedCostMaximum')}</th>
                            {currentModeImport === 'EXCEL' ? null : <th>{translate('task_template.action')}</th>}

                        </tr>
                    </thead>
                    <tbody>
                        {
                            (state.listTasks && state.listTasks !== 0) &&
                            state.listTasks.map((taskItem, index) => (
                                <tr key={index}>
                                    <td>{taskItem?.code}</td>
                                    <td>{taskItem?.name}</td>
                                    <td>{taskItem?.preceedingTasks?.join(', ')}</td>
                                    <td>{taskItem?.estimateNormalTime}</td>
                                    <td>{taskItem?.estimateOptimisticTime}</td>
                                    <td>{taskItem?.estimatePessimisticTime}</td>
                                    <td>{taskItem?.estimateNormalCost}</td>
                                    <td>{taskItem?.estimateMaxCost}</td>
                                    {currentModeImport === 'HAND' &&
                                        <td>
                                            <a className="delete" title={translate('general.delete')} onClick={() => handleDelete(index)}><i className="material-icons">delete</i></a>
                                        </td>
                                    }
                                </tr>
                            ))
                        }
                        {currentModeImport === 'EXCEL' ? null :
                            <tr key={`add-task-input-${state.listTasks.length}`}>
                                <td>
                                    <div className={`form-group`}>
                                        <div className="form-control">{state.taskInit.code}</div>
                                    </div>
                                </td>
                                <td>
                                    <div className={`form-group`}>
                                        <input className="form-control" value={state.taskInit.name}
                                            type="text" placeholder="Enter name" onChange={(event) => handleChangeForm(event.target.value, 'name')} />
                                    </div>
                                </td>
                                <td>
                                    <div className={`form-group`}>
                                        <SelectBox
                                            id={`select-schedule-preceeding-tasks`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={state.listTasks.map(item => ({ text: item.code, value: item.code }))}
                                            onChange={(event) => handleChangeForm(event, 'preceedingTasks')}
                                            value={state.taskInit.preceedingTasks}
                                            multiple={true}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div className={`form-group`}>
                                        <input className="form-control" value={state.taskInit.estimateNormalTime}
                                            type="number" placeholder="Enter time" onChange={(event) => handleChangeForm(event.target.value, 'estimateNormalTime')} />
                                    </div>
                                </td>
                                <td>
                                    <div className={`form-group`}>
                                        <input className="form-control" value={state.taskInit.estimateOptimisticTime}
                                            type="number" placeholder="Enter best time" onChange={(event) => handleChangeForm(event.target.value, 'estimateOptimisticTime')} />
                                    </div>
                                </td>
                                <td>
                                    <div className={`form-group`}>
                                        <input className="form-control" value={state.taskInit.estimatePessimisticTime}
                                            type="number" placeholder="Enter worst time" onChange={(event) => handleChangeForm(event.target.value, 'estimatePessimisticTime')} />
                                    </div>
                                </td>
                                <td>
                                    <div className={`form-group`}>
                                        <input className="form-control" value={state.taskInit.estimateNormalCost}
                                            type="number" placeholder="Enter cost" onChange={(event) => handleChangeForm(event.target.value, 'estimateNormalCost')} />
                                    </div>
                                </td>
                                <td>
                                    <div className={`form-group`}>
                                        <input className="form-control" value={state.taskInit.estimateMaxCost}
                                            type="number" placeholder="Enter max cost" onChange={(event) => handleChangeForm(event.target.value, 'estimateMaxCost')} />
                                    </div>
                                </td>

                                <td>
                                    <a className="save text-green" title={translate('general.save')} onClick={handleAddRow}><i className="material-icons">add_circle</i></a>
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>

                {/* Phần tính toán CPM từ danh sách tasks */}
                {state.listTasks && state.listTasks.length > 0 &&
                    <ModalCalculateCPM estDurationEndProject={Number(estDurationEndProject)} tasksData={state.listTasks} />
                }

                {/* Button tính toán CPM */}
                {state.listTasks && state.listTasks.length > 0 &&
                    <div className="dropdown pull-right" style={{ marginTop: 15, marginRight: 10 }}>
                        <button
                            onClick={handleOpenCalculateCPM}
                            type="button" className="btn btn-success dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true"
                            title={translate('project.schedule.calculateCPM')}>
                            {translate('project.schedule.calculateCPM')}
                        </button>
                    </div>
                }
            </DialogModal>
        </React.Fragment>
    )
}
function mapState(state) {
    const { project, user } = state;
    return { project, user }
}

const mapDispatchToProps = {
    getProjectsDispatch: ProjectActions.getProjectsDispatch,
    deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getTasksByProject: taskManagementActions.getTasksByProject,
}

export default connect(mapState, mapDispatchToProps)(withTranslate(ModalAddTaskSchedule));