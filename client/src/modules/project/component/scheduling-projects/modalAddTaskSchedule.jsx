import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, SelectBox } from '../../../../common-components/index';
import { ProjectActions } from '../../redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { taskManagementActions } from '../../../task/task-management/redux/actions';
import { getCurrentProjectDetails, getDurationWithoutSatSun, getEstimateHumanCostFromParams, getNearestIntegerNumber } from '../projects/functionHelper';
import ModalCalculateCPM from './modalCalculateCPM';
import ModalExcelImport from './modalExcelImport';
import ModalEditRowCPMExcel from './modalEditRowCPMExcel';
import { checkIsNullUndefined, numberWithCommas } from '../../../task/task-management/component/functionHelpers';
import moment from 'moment';

const ModalAddTaskSchedule = (props) => {
    const { translate, project, projectDetail } = props;
    // console.log('projectDetail', projectDetail)
    // const projectDetail = getCurrentProjectDetails(project);
    const [state, setState] = useState({
        taskInit: {
            taskProject: projectDetail?._id,
            code: `DXT${projectDetail?._id.substring(0, 6)}-0`,
            name: '',
            preceedingTasks: [],
            estimateNormalTime: '',
            estimateOptimisticTime: '',
            estimateNormalCost: '',
            estimateMaxCost: '',
            startDate: '',
            endDate: '',
        },
        listTasks: [],
    })
    const [currentEditRowIndex, setCurrentEditRowIndex] = useState(undefined);
    const [currentRow, setCurrentRow] = useState(undefined);
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
    const [currentModeImport, setCurrentModeImport] = useState('EXCEL');
    const [estDurationEndProject, setEstDurationEndProject] = useState(
        numberWithCommas(
            getDurationWithoutSatSun(projectDetail?.startDate, projectDetail?.endDate, projectDetail?.unitTime)
        )
    )
    if (
        numberWithCommas(getDurationWithoutSatSun(projectDetail?.startDate, projectDetail?.endDate, projectDetail?.unitTime)) !== estDurationEndProject
    ) {
        setEstDurationEndProject(
            numberWithCommas(
                getDurationWithoutSatSun(projectDetail?.startDate, projectDetail?.endDate, projectDetail?.unitTime)
            )
        )
    }
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

    const handleEditRow = async (index) => {
        await setCurrentRow(state.listTasks[index]);
        await setCurrentEditRowIndex(index);
        await window.$(`#modal-edit-row-cpm-excel-${state.listTasks[index].code}`).modal('show');
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
        const formattedData = data.map((dataItem) => {
            let currentResMemberIdArr = [], currentAccMemberIdArr = [];
            for (let empItem of projectDetail?.responsibleEmployees) {
                for (let resEmailItem of dataItem.emailResponsibleEmployees) {
                    if (String(empItem.email) === String(resEmailItem)) {
                        currentResMemberIdArr.push(empItem._id);
                    }
                }
                for (let accEmailItem of dataItem.emailAccountableEmployees) {
                    if (String(empItem.email) === String(accEmailItem)) {
                        currentAccMemberIdArr.push(empItem._id);
                    }
                }
            }
            const estHumanCost = getEstimateHumanCostFromParams(
                projectDetail,
                dataItem.estimateNormalTime,
                currentResMemberIdArr,
                currentAccMemberIdArr,
                `${projectDetail?.unitTime}s`
            )
            const estAssetCode = 1000000;
            const estNormalCost = estHumanCost + estAssetCode;
            const estMaxCost = getNearestIntegerNumber(estNormalCost);
            return {
                ...dataItem,
                currentResponsibleEmployees: currentResMemberIdArr,
                currentAccountableEmployees: currentAccMemberIdArr,
                currentAssetCost: numberWithCommas(estAssetCode),
                currentHumanCost: numberWithCommas(estHumanCost),
                estimateNormalCost: numberWithCommas(estNormalCost),
                estimateMaxCost: numberWithCommas(estMaxCost),
            }
        })
        console.log('formattedData', formattedData)
        setState({
            ...state,
            listTasks: formattedData
        });
        // console.log('data', data)
        // setState({
        //     ...state,
        //     listTasks: data
        // });
        // setState({
        //     ...state,
        //     listTasks: data.map(item => {
        //         return {
        //             ...item,
        //             estimateNormalCost: numberWithCommas(10000000),
        //             estimateMaxCost: numberWithCommas(15000000),
        //         }
        //     })
        // });
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
                estimateNormalCost: '',
                estimateMaxCost: '',
                startDate: '',
                endDate: '',
            },
            listTasks: [],
        })
    }

    const handleSaveEditInfoRow = (newData, currentEditRowIndex) => {
        state.listTasks = state.listTasks.map((taskItem) => {
            return {
                ...taskItem,
                startDate: '',
                endDate: '',
            }
        })
        state.listTasks[currentEditRowIndex] = newData;
        setState({
            ...state,
            listTasks: state.listTasks,
        })
    }

    const checkIfCanCalculateCPM = () => {
        for (let taskItem of state.listTasks) {
            if (checkIsNullUndefined(taskItem?.estimateNormalCost) || checkIsNullUndefined(taskItem?.estimateMaxCost)
                || isDurationNotSuitable(taskItem?.estimateNormalTime)) {
                return false;
            }
            // if (isDurationNotSuitable(taskItem?.estimateNormalTime)) return false
        }
        return true;
    }

    const isDurationNotSuitable = (estimateNormalTime) => {
        if (projectDetail?.unitTime === 'days') return estimateNormalTime > 7 || estimateNormalTime < 1 / 6
        return estimateNormalTime < 4 || estimateNormalTime > 56
    }

    const handleHideModal = () => {
        setTimeout(() => {
            window.$(`#modal-show-info-calculate-cpm`).modal('hide');
            props.onHandleReRender();
        }, 10);
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
                        <div className={`form-group col-md-2`}>
                            <label>{translate('project.code')}</label>
                            <div>{projectDetail?.code}</div>
                        </div>
                        <div className={`form-group col-md-2`}>
                            <label>{translate('project.unitTime')}</label>
                            <div>{translate(`project.unit.${projectDetail?.unitTime}`)}</div>
                        </div>
                        <div className={`form-group col-md-2`}>
                            <label>{translate('project.unitCost')}</label>
                            <div>{projectDetail?.unitCost}</div>
                        </div>
                        <div className={`form-group col-md-2`}>
                            <label>Thời gian bắt đầu dự án</label>
                            <div>{moment(projectDetail?.startDate).format('HH:mm DD/MM/YYYY')}</div>
                        </div>
                        <div className={`form-group col-md-2`}>
                            <label>Thời gian dự kiến kết thúc dự án</label>
                            <div>{moment(projectDetail?.endDate).format('HH:mm DD/MM/YYYY')}</div>
                        </div>
                        <div className={`form-group col-md-2`}>
                            <label>Khoảng thời gian dự kiến hoàn thành dự án (không tính T7 CN)</label>
                            <div>{estDurationEndProject} ({translate(`project.unit.${projectDetail?.unitTime}`)})</div>
                        </div>
                    </div>
                </fieldset>

                {/* Phần import excel */}
                <ModalExcelImport importCPM={handleImportCPM} />

                {/* Phần edit row tu file excel */}
                {currentRow && currentRow.code &&
                    <ModalEditRowCPMExcel importCPM={handleImportCPM} currentRow={currentRow}
                        currentEditRowIndex={currentEditRowIndex}
                        handleSave={handleSaveEditInfoRow} />
                }

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

                {/* Button tính toán CPM */}
                {state.listTasks && state.listTasks.length > 0 &&
                    <div className="dropdown pull-right" style={{ marginTop: 20, marginRight: 10 }}>
                        <button
                            disabled={!checkIfCanCalculateCPM()}
                            onClick={handleOpenCalculateCPM}
                            type="button" className="btn btn-warning dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true"
                            title={translate('project.schedule.calculateCPM')}>
                            {translate('project.schedule.calculateCPM')}
                        </button>
                    </div>
                }

                <table id="project-table" className="table table-striped table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>{translate('project.schedule.taskCode')}</th>
                            <th>{translate('project.schedule.taskName')}</th>
                            <th>{translate('project.schedule.preceedingTasks')}</th>
                            <th>{translate('project.schedule.estimatedTime')} ({translate(`project.unit.${projectDetail?.unitTime}`)})</th>
                            {currentModeImport === 'HAND' && <th>{translate('project.schedule.estimatedTimeOptimistic')}</th>}
                            <th>{translate('project.schedule.estimatedCostNormal')} (VND)</th>
                            <th>{translate('project.schedule.estimatedCostMaximum')} (VND)</th>
                            <th>{translate('task_template.action')}</th>
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
                                    <td>
                                        {taskItem?.estimateNormalTime}
                                        <strong style={{ color: 'red' }}>
                                            {isDurationNotSuitable(taskItem?.estimateNormalTime)
                                                ? ' - Thời gian không được lớn hơn 7 Ngày và nhỏ hơn 4 Giờ'
                                                : null}
                                        </strong></td>
                                    {currentModeImport === 'HAND' && <td>{taskItem?.estimateOptimisticTime}</td>}
                                    <td>{checkIsNullUndefined(taskItem?.estimateNormalCost) ? 'Chưa tính được' : taskItem?.estimateNormalCost}</td>
                                    <td>{checkIsNullUndefined(taskItem?.estimateMaxCost) ? 'Chưa tính được' : taskItem?.estimateMaxCost}</td>
                                    {currentModeImport === 'HAND' &&
                                        <td>
                                            <a className="delete" title={translate('general.delete')} onClick={() => handleDelete(index)}><i className="material-icons">delete</i></a>
                                        </td>
                                    }
                                    {currentModeImport === 'EXCEL' &&
                                        <td>
                                            <a className="edit" title={translate('general.edit')} onClick={() => handleEditRow(index)}><i className="material-icons">edit</i></a>
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
                                {/* <td>
                                    <div className={`form-group`}>
                                        <input className="form-control" value={state.taskInit.estimateOptimisticTime}
                                            type="number" placeholder="Enter best time" onChange={(event) => handleChangeForm(event.target.value, 'estimateOptimisticTime')} />
                                    </div>
                                </td> */}
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
                    <ModalCalculateCPM estDurationEndProject={Number(estDurationEndProject)} tasksData={state.listTasks} handleHideModal={handleHideModal} />
                }

                {/* {renderModalCalculateCPM()} */}
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