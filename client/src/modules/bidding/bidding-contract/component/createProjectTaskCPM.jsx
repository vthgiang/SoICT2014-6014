import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, SelectBox } from '../../../../common-components/index';
import { ProjectActions } from "../../../project/projects/redux/actions";
import { UserActions } from '../../../super-admin/user/redux/actions';
import { convertUserIdToUserName, getCurrentProjectDetails, getDurationWithoutSatSun, getEstimateHumanCostFromParams, getNearestIntegerNumber } from '../../../project/projects/components/functionHelper';
import ModalCalculateCPM from '../../../project/scheduling-projects/components/modalCalculateCPM.jsx';
import ModalEditRowCPMExcel from '../../../project/scheduling-projects/components/modalEditRowCPMExcel';
import { checkIsNullUndefined, numberWithCommas } from '../../../task/task-management/component/functionHelpers';
import moment from 'moment';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import '../../../project/scheduling-projects/components/schedulingProject.css';

const AddTaskSchedule = (props) => {
    const TYPE = {
        DEFAULT: "DEFAULT", // tạo mới project thông thường
        CREATE_BY_CONTRACT: "CREATE_BY_CONTRACT", // tạo mới project theo hợp đồng
        CREATE_BY_TEMPLATE: "CREATE_BY_TEMPLATE", // tạo mới project theo mẫu
    }
    const { translate, project, projectData, user } = props;
    const [projectDetail, setProjectDetail] = useState(projectData)
    const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []
    const [stepObject, setStepObject] = useState({
        currentStep: 0,
        steps: [
            {
                label: "Danh sách công việc",
                active: true,
            },
            {
                label: "Tối ưu danh sách",
                active: false,
            },
        ]
    })

    useEffect(() => {
        setProjectDetail(projectData)
    }, [JSON.stringify(projectData)])

    const [state, setState] = useState({
        taskInit: {
            taskProject: projectDetail?._id,
            code: `DXT${projectDetail?.code?.substring(0, 6)}-0`,
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

    const handleOpenExcelImport = () => {
        setTimeout(() => {
            window.$(`#modal-import-cpm-data`).modal('show');
        }, 10);
    }

    useEffect(() => {
        if (props.projectTask && projectDetail) {
            handleTaskCPM(props.projectTask)
        }
    }, [JSON.stringify(props.projectTask), JSON.stringify(projectDetail)])

    console.log(108, projectDetail);
    const handleTaskCPM = (data) => {
        const formattedData = data.map((dataItem) => {
            let currentResMemberIdArr = [], currentAccMemberIdArr = [];
            for (let resItem of dataItem.responsibleEmployees) {
                currentResMemberIdArr.push(resItem);
            }
            for (let accItem of dataItem.accountableEmployees) {
                currentAccMemberIdArr.push(accItem);
            }

            const currentResWeightArr = currentResMemberIdArr.map((resItem, resIndex) => {
                return {
                    userId: resItem,
                    weight: Number(dataItem.totalResWeight) / currentResMemberIdArr.length,
                }
            });
            const currentAccWeightArr = currentAccMemberIdArr.map((accItem, accIndex) => {
                return {
                    userId: accItem,
                    weight: (100 - Number(dataItem.totalResWeight)) / currentAccMemberIdArr.length,
                }
            });
            const estHumanCost = getEstimateHumanCostFromParams(
                projectDetail,
                dataItem.estimateNormalTime,
                currentResMemberIdArr,
                currentAccMemberIdArr,
                projectDetail?.unitTime,
                currentResWeightArr,
                currentAccWeightArr,
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
                currentResWeightArr,
                currentAccWeightArr,
                totalResWeight: Number(dataItem.totalResWeight),
            }
        })
        console.log('formattedData', formattedData)
        setTimeout(() => {
            setState({
                ...state,
                listTasks: formattedData
            });
        }, 100);
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

    const resetForm = () => {
        setState({
            taskInit: {
                taskProject: projectDetail?._id,
                code: `DXT${projectDetail?.code.substring(0, 6)}-0`,
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

    const handleSaveEditInfoRow = (newRowData, currentEditRowIndex) => {
        console.log('newRowData', newRowData)
        const newListTasks = state.listTasks.map((taskItem, taskIndex) => {
            if (currentEditRowIndex === taskIndex) {
                return {
                    ...newRowData,
                    startDate: '',
                    endDate: '',
                }
            }
            return {
                ...taskItem,
                startDate: '',
                endDate: '',
            }
        })
        console.log('newListTasks', newListTasks)
        setState({
            ...state,
            listTasks: newListTasks,
        })
    }

    const checkIfCanCalculateCPM = () => {
        if (!state.listTasks || state.listTasks.length === 0) return false;
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
            // props.onHandleReRender();
        }, 10);
    }

    const handleGoToStep = (index, e = undefined) => {
        if (e) e.preventDefault();
        if (index === 0 || (index === 1 && checkIfCanCalculateCPM())) {
            setStepObject({
                ...stepObject,
                currentStep: index,
                steps: steps.map((oldStepItem, oldStepIndex) => {
                    return {
                        ...oldStepItem,
                        active: oldStepIndex === index ? true : oldStepItem.active
                    }
                })
            });
        }
    }

    const { currentStep, steps } = stepObject;

    return (
        <React.Fragment>
            <div className="col-md-12">
                <div className="timeline">
                    <div className="timeline-progress" style={{ width: `${(currentStep * 100) / (steps.length - 1)}%` }}></div>
                    <div className="timeline-items">
                        {steps.map((item, index) => (
                            <div
                                className={`timeline-item ${item.active ? "active" : ""}`}
                                key={index}
                                onClick={(e) => handleGoToStep(index, e)}
                            >
                                <div className="timeline-contain">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
                {
                    currentStep === 0 &&
                    <>
                        <div className="description-box without-border">
                            <h4><strong>Thông số dự án</strong></h4>
                            <div><strong>{translate('project.unitTime')}: </strong> {translate(`project.unit.${projectDetail?.unitTime}`)}</div>
                            <div><strong>{translate('project.unitCost')}: </strong> {projectDetail?.unitCost}</div>
                            <div><strong>{`Thời gian bắt đầu dự án`}: </strong> {moment(projectDetail?.startDate).format('HH:mm DD/MM/YYYY')}</div>
                            <div><strong>{`Thời gian dự kiến kết thúc dự án`}: </strong> {moment(projectDetail?.endDate).format('HH:mm DD/MM/YYYY')}</div>
                            <div>
                                <strong>{`Khoảng thời gian dự kiến hoàn thành dự án (không tính T7 CN)`}: </strong>
                                {estDurationEndProject} {translate(`project.unit.${projectDetail?.unitTime}`)?.toLowerCase()}
                            </div>
                        </div>

                        {/* Phần edit row tu file excel */}
                        {currentRow && currentRow.code &&
                            <ModalEditRowCPMExcel importCPM={handleTaskCPM} currentRow={currentRow}
                                currentEditRowIndex={currentEditRowIndex}
                                handleSave={handleSaveEditInfoRow}
                                projectData={projectDetail}
                            />
                        }

                        {/* Button refresh form dữ liệu */}
                        {/* <button className="form-group pull-right" title="Làm mới form"
                            style={{ marginTop: 20, marginRight: 10 }}
                            onClick={resetForm}
                        >
                            <span className="material-icons">refresh</span>
                        </button> */}

                        {/* Button open modal import excel */}
                        {/* {currentModeImport === 'EXCEL' ? <div className="dropdown pull-right" style={{ marginTop: 20, marginRight: 10 }}>
                            <button
                                onClick={handleOpenExcelImport}
                                type="button" className="btn btn-success dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true"
                                title={translate('project.add_btn_from_excel')}>
                                {translate('project.add_btn_from_excel')}
                            </button>
                        </div> : null} */}

                        {/* Button đi đến bước tiếp theo */}
                        {state.listTasks && state.listTasks.length > 0 &&
                            <div className="dropdown pull-right" style={{ marginTop: 20, marginRight: 10 }}>
                                <button
                                    disabled={!checkIfCanCalculateCPM()}
                                    onClick={() => handleGoToStep(1)}
                                    type="button" className="btn btn-warning dropdown-toggle pull-right" data-toggle="dropdown" aria-expanded="true"
                                    title={`Đến bước tiếp theo`}>
                                    Đến bước tiếp theo
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
                                    <th>{translate('project.schedule.estimatedTimeOptimistic')} ({translate(`project.unit.${projectDetail?.unitTime}`)})</th>
                                    <th>Người thực hiện</th>
                                    <th>Người phê duyệt</th>
                                    <th>Trọng số tổng thực hiện (%)</th>
                                    <th>Trọng số tổng phê duyệt (%)</th>
                                    <th>{translate('project.schedule.estimatedCostNormal')} (VND)</th>
                                    <th>{translate('project.schedule.estimatedCostMaximum')} (VND)</th>
                                    <th>{translate('task_template.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (state.listTasks && state.listTasks !== 0) &&
                                    state.listTasks.map((taskItem, index) => (
                                        <tr style={{ cursor: 'pointer' }} onClick={() => handleEditRow(index)} key={index}>
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
                                            <td>
                                                {taskItem?.estimateOptimisticTime}
                                                <strong style={{ color: 'red' }}>
                                                    {isDurationNotSuitable(taskItem?.estimateOptimisticTime)
                                                        ? ' - Thời gian không được lớn hơn 7 Ngày và nhỏ hơn 4 Giờ'
                                                        : null}
                                                </strong></td>
                                            <td>{taskItem?.currentResponsibleEmployees?.map(resItem => convertUserIdToUserName(listUsers, resItem)).join(', ')}</td>
                                            <td>{taskItem?.currentAccountableEmployees?.map(accItem => convertUserIdToUserName(listUsers, accItem)).join(', ')}</td>
                                            <td>{taskItem?.totalResWeight}</td>
                                            <td>{taskItem?.totalResWeight ? 100 - Number(taskItem?.totalResWeight) : ''}</td>
                                            <td>{checkIsNullUndefined(taskItem?.estimateNormalCost) ? 'Chưa tính được' : taskItem?.estimateNormalCost}</td>
                                            <td>{checkIsNullUndefined(taskItem?.estimateMaxCost) ? 'Chưa tính được' : taskItem?.estimateMaxCost}</td>
                                            {currentModeImport === 'HAND' &&
                                                <td>
                                                    <a className="delete" title={translate('general.delete')} onClick={() => handleDelete(index)}><i className="material-icons">delete</i></a>
                                                </td>
                                            }
                                            {currentModeImport === 'EXCEL' &&
                                                <td>
                                                    <a className="edit" title={translate('general.edit')}><i className="material-icons">edit</i></a>
                                                </td>
                                            }
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </>
                }
                {
                    currentStep === 1 &&
                    <ModalCalculateCPM
                        estDurationEndProject={Number(estDurationEndProject)}
                        tasksData={state.listTasks}
                        projectData={projectDetail}
                        handleTaskProjectList={props.handleTaskProjectList}
                        handleHideModal={handleHideModal}
                        type={TYPE.CREATE_BY_CONTRACT}
                    />
                }
            </div>
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
}

export default connect(mapState, mapDispatchToProps)(withTranslate(AddTaskSchedule));