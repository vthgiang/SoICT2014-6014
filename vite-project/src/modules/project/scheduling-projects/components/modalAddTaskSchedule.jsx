import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DialogModal, SelectBox } from '../../../../common-components/index'
import { ProjectActions } from '../../projects/redux/actions'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { taskManagementActions } from '../../../task/task-management/redux/actions'
import {
  convertUserIdToUserName,
  getCurrentProjectDetails,
  getDurationWithoutSatSun,
  getEstimateHumanCostFromParams,
  getNearestIntegerNumber
} from '../../projects/components/functionHelper'
import ModalCalculateCPM from './modalCalculateCPM'
import ModalExcelImport from './modalExcelImport'
import ModalEditRowCPMExcel from './modalEditRowCPMExcel'
import ModalEditRowPhase from './modalEditRowPhase'
import { checkIsNullUndefined, numberWithCommas } from '../../../task/task-management/component/functionHelpers'
import moment from 'moment'
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper'
import './schedulingProject.css'

const ModalAddTaskSchedule = (props) => {
  const { translate, project, projectDetail, user } = props
  const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []
  const [stepObject, setStepObject] = useState({
    currentStep: 0,
    steps: [
      {
        label: 'Import excel',
        active: true
      },
      {
        label: 'Tối ưu danh sách',
        active: false
      }
    ]
  })
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
      endDate: ''
    },
    listTasks: [],
    listPhases: []
  })
  const [currentEditRowIndex, setCurrentEditRowIndex] = useState(undefined)
  const [currentRow, setCurrentRow] = useState(undefined)
  const [currentEditPhaseIndex, setCurrentEditPhaseIndex] = useState(undefined)
  const [currentPhase, setCurrentPhase] = useState(undefined)

  const [currentModeImport, setCurrentModeImport] = useState('EXCEL')
  const [estDurationEndProject, setEstDurationEndProject] = useState(
    numberWithCommas(getDurationWithoutSatSun(projectDetail?.startDate, projectDetail?.endDate, projectDetail?.unitTime))
  )
  if (
    numberWithCommas(getDurationWithoutSatSun(projectDetail?.startDate, projectDetail?.endDate, projectDetail?.unitTime)) !==
    estDurationEndProject
  ) {
    setEstDurationEndProject(
      numberWithCommas(getDurationWithoutSatSun(projectDetail?.startDate, projectDetail?.endDate, projectDetail?.unitTime))
    )
  }
  const { listTasks } = state

  const handleDeleteTask = (index) => {
    if (listTasks && listTasks.length > 0) {
      // listTasks.splice(index, 1);
      listTasks.splice(listTasks.length - 1, 1)
      const newListTasks = listTasks.map((item, id) => ({
        ...item,
        code: `${state.taskInit.code.split('-')[0]}-${id}`
      }))
      setState({
        ...state,
        listTasks: newListTasks,
        taskInit: {
          ...state.taskInit,
          code: `${state.taskInit.code.split('-')[0]}-${Number(state.taskInit.code.split('-')[1]) - 1}`
        }
      })
    }
  }

  const handleDeletePhase = (index) => {}

  // chỉnh sửa dòng công việc
  const handleEditTask = async (index) => {
    await setCurrentRow(state.listTasks[index])
    await setCurrentEditRowIndex(index)
    await window.$(`#modal-edit-row-cpm-excel-${state.listTasks[index].code}`).modal('show')
  }

  // chỉnh sửa thông tin giai đoạn
  const handleEditPhase = async (index) => {
    await setCurrentPhase(state.listPhases[index])
    await setCurrentEditPhaseIndex(index)
    await window.$(`#modal-edit-row-phase-${state.listPhases[index].code}`).modal('show')
  }

  const handleOpenExcelImport = () => {
    setTimeout(() => {
      window.$(`#modal-import-cpm-data`).modal('show')
    }, 10)
  }

  // xử lý dữ liệu file import
  const handleImportCPM = (taskData, phaseData = []) => {
    const formattedData = taskData.map((dataItem) => {
      let currentResMemberIdArr = [],
        currentAccMemberIdArr = []
      for (let empItem of projectDetail?.responsibleEmployees) {
        for (let resEmailItem of dataItem.emailResponsibleEmployees) {
          if (String(empItem.email) === String(resEmailItem)) {
            // console.log('dataItem', dataItem.code, '(String(empItem.email)', (String(empItem.email)), 'String(resEmailItem)', String(resEmailItem))
            currentResMemberIdArr.push(empItem._id)
          }
        }
        for (let accEmailItem of dataItem.emailAccountableEmployees) {
          if (String(empItem.email) === String(accEmailItem)) {
            // console.log('dataItem', dataItem.code, '(String(empItem.email)', (String(empItem.email)), 'String(accEmailItem)', String(accEmailItem))
            currentAccMemberIdArr.push(empItem._id)
          }
        }
      }
      // Nếu email không được điền đầy đủ thì thôi ko cần tính toán chi phí
      if (currentResMemberIdArr.length === 0 || currentAccMemberIdArr.length === 0) {
        return dataItem
      }
      // Nếu email đầy đủ thì tính tiếp
      const currentResWeightArr = currentResMemberIdArr.map((resItem, resIndex) => {
        return {
          userId: resItem,
          weight: Number(dataItem.totalResWeight) / currentResMemberIdArr.length
        }
      })
      const currentAccWeightArr = currentAccMemberIdArr.map((accItem, accIndex) => {
        return {
          userId: accItem,
          weight: (100 - Number(dataItem.totalResWeight)) / currentAccMemberIdArr.length
        }
      })
      const estHumanCost = getEstimateHumanCostFromParams(
        projectDetail,
        dataItem.estimateNormalTime,
        currentResMemberIdArr,
        currentAccMemberIdArr,
        projectDetail?.unitTime,
        currentResWeightArr,
        currentAccWeightArr
      )
      const estAssetCode = 1000000
      const estNormalCost = estHumanCost + estAssetCode
      const estMaxCost = getNearestIntegerNumber(estNormalCost)
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
        totalResWeight: Number(dataItem.totalResWeight)
      }
    })

    let formattedPhaseData = phaseData?.map((dataItem) => {
      let currentResMemberIdArr = [],
        currentAccMemberIdArr = []
      for (let empItem of projectDetail?.responsibleEmployees) {
        for (let resEmailItem of dataItem.emailResponsibleEmployees) {
          if (String(empItem.email) === String(resEmailItem)) {
            // console.log('dataItem', dataItem.code, '(String(empItem.email)', (String(empItem.email)), 'String(resEmailItem)', String(resEmailItem))
            currentResMemberIdArr.push(empItem._id)
          }
        }
        for (let accEmailItem of dataItem.emailAccountableEmployees) {
          if (String(empItem.email) === String(accEmailItem)) {
            // console.log('dataItem', dataItem.code, '(String(empItem.email)', (String(empItem.email)), 'String(accEmailItem)', String(accEmailItem))
            currentAccMemberIdArr.push(empItem._id)
          }
        }
      }

      return {
        ...dataItem,
        currentResponsibleEmployees: currentResMemberIdArr,
        currentAccountableEmployees: currentAccMemberIdArr
      }
    })

    setTimeout(() => {
      setState({
        ...state,
        listTasks: formattedData,
        listPhases: formattedPhaseData
      })
    }, 100)
  }

  const resetForm = () => {
    setState({
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
        endDate: ''
      },
      listTasks: [],
      listPhases: []
    })
  }

  // Lưu dữ liệu công việc
  const handleSaveEditInfoRow = (newRowData, currentEditRowIndex) => {
    const newListTasks = state.listTasks.map((taskItem, taskIndex) => {
      if (currentEditRowIndex === taskIndex) {
        return {
          ...newRowData,
          startDate: '',
          endDate: ''
        }
      }
      return {
        ...taskItem,
        startDate: '',
        endDate: ''
      }
    })

    setState({
      ...state,
      listTasks: newListTasks
    })
  }

  // Lưu dữ liệu giai đoạn
  const handleSaveEditInfoPhase = (newPhaseData, currentEditPhaseIndex) => {
    const newListPhases = state.listPhases.map((phaseItem, phaseIndex) => {
      if (currentEditPhaseIndex === phaseIndex) {
        return {
          ...newPhaseData,
          startDate: '',
          endDate: ''
        }
      }
      return {
        ...phaseItem,
        startDate: '',
        endDate: ''
      }
    })

    setState({
      ...state,
      listPhases: newListPhases
    })
  }

  const checkIfCanCalculateCPM = () => {
    if (!state.listTasks || state.listTasks.length === 0) return false
    for (let taskItem of state.listTasks) {
      if (
        checkIsNullUndefined(taskItem?.estimateNormalCost) ||
        checkIsNullUndefined(taskItem?.estimateMaxCost) ||
        isDurationNotSuitable(taskItem?.estimateNormalTime)
      ) {
        return false
      }
      // if (isDurationNotSuitable(taskItem?.estimateNormalTime)) return false
    }
    return true
  }

  const isDurationNotSuitable = (estimateNormalTime) => {
    if (projectDetail?.unitTime === 'days') return estimateNormalTime > 7 || estimateNormalTime < 1 / 6
    return estimateNormalTime < 4 || estimateNormalTime > 56
  }

  const handleHideModal = () => {
    setTimeout(() => {
      window.$(`#modal-show-info-calculate-cpm`).modal('hide')
      props.onHandleReRender()
    }, 10)
  }

  const handleGoToStep = (index, e = undefined) => {
    if (e) e.preventDefault()
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
      })
    }
  }

  const { currentStep, steps } = stepObject

  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-add-task-schedule`}
        isLoading={false}
        formID={`form-add-task-schedule`}
        title={`Lập lịch kế hoạch dự án`}
        size={100}
        hasSaveButton={false}
      >
        <div className='col-md-12'>
          <div className='timeline'>
            <div className='timeline-progress' style={{ width: `${(currentStep * 100) / (steps.length - 1)}%` }}></div>
            <div className='timeline-items'>
              {steps.map((item, index) => (
                <div className={`timeline-item ${item.active ? 'active' : ''}`} key={index} onClick={(e) => handleGoToStep(index, e)}>
                  <div className='timeline-contain'>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
          {currentStep === 0 && (
            <>
              <div className='description-box without-border'>
                <h4>
                  <strong>Thông số dự án</strong>
                </h4>
                <div>
                  <strong>{translate('project.unitTime')}: </strong> {translate(`project.unit.${projectDetail?.unitTime}`)}
                </div>
                <div>
                  <strong>{translate('project.unitCost')}: </strong> {projectDetail?.unitCost}
                </div>
                <div>
                  <strong>{`Thời gian bắt đầu dự án`}: </strong> {moment(projectDetail?.startDate).format('HH:mm DD/MM/YYYY')}
                </div>
                <div>
                  <strong>{`Thời gian dự kiến kết thúc dự án`}: </strong> {moment(projectDetail?.endDate).format('HH:mm DD/MM/YYYY')}
                </div>
                <div>
                  <strong>{`Khoảng thời gian dự kiến hoàn thành dự án (không tính T7 CN)`}: </strong>
                  {estDurationEndProject} {translate(`project.unit.${projectDetail?.unitTime}`).toLowerCase()}
                </div>
              </div>

              {/* Phần import excel */}
              <ModalExcelImport importCPM={handleImportCPM} />

              {/* Phần edit row tu file excel */}
              {currentRow && currentRow.code && (
                <ModalEditRowCPMExcel
                  importCPM={handleImportCPM}
                  currentRow={currentRow}
                  currentEditRowIndex={currentEditRowIndex}
                  handleSave={handleSaveEditInfoRow}
                />
              )}

              {/* Phần edit row tu file excel */}
              {currentPhase && currentPhase.code && (
                <ModalEditRowPhase
                  importCPM={handleImportCPM}
                  currentPhase={currentPhase}
                  currentEditPhaseIndex={currentEditPhaseIndex}
                  handleSave={handleSaveEditInfoPhase}
                />
              )}

              {/* Button refresh form dữ liệu */}
              <button className='form-group pull-right' title='Làm mới form' style={{ marginTop: 20, marginRight: 10 }} onClick={resetForm}>
                <span className='material-icons'>refresh</span>
              </button>

              {/* Button open modal import excel */}
              {currentModeImport === 'EXCEL' ? (
                <div className='dropdown pull-right' style={{ marginTop: 20, marginRight: 10 }}>
                  <button
                    onClick={handleOpenExcelImport}
                    type='button'
                    className='btn btn-success dropdown-toggle pull-right'
                    data-toggle='dropdown'
                    aria-expanded='true'
                    title={translate('project.add_btn_from_excel')}
                  >
                    {translate('project.add_btn_from_excel')}
                  </button>
                </div>
              ) : null}

              {/* Button đi đến bước tiếp theo */}
              {state.listTasks && state.listTasks.length > 0 && (
                <div className='dropdown pull-right' style={{ marginTop: 20, marginRight: 10 }}>
                  <button
                    disabled={!checkIfCanCalculateCPM()}
                    onClick={() => handleGoToStep(1)}
                    type='button'
                    className='btn btn-warning dropdown-toggle pull-right'
                    data-toggle='dropdown'
                    aria-expanded='true'
                    title={`Đến bước tiếp theo`}
                  >
                    Đến bước tiếp theo
                  </button>
                </div>
              )}

              {/* Hiển thị data import */}
              <div className='nav-tabs-custom row'>
                <ul className='nav nav-tabs'>
                  <li className='active'>
                    <a data-toggle='tab' href='#import_task_project'>
                      Danh sách công việc
                    </a>
                  </li>
                  <li>
                    <a data-toggle='tab' href='#import_phase_project'>
                      {' '}
                      Các giai đoạn trong dự án
                    </a>
                  </li>
                </ul>
                <div className='tab-content'>
                  {/* Bảng các công việc trong dự án */}
                  <div id='import_task_project' className='tab-pane active'>
                    <table id='project-table' className='table table-striped table-bordered table-hover'>
                      <thead>
                        <tr>
                          <th>{translate('project.schedule.taskCode')}</th>
                          <th>{translate('project.schedule.taskName')}</th>
                          <th>{translate('project.schedule.preceedingTasks')}</th>
                          <th>Giai đoạn</th>
                          <th>
                            {translate('project.schedule.estimatedTime')} ({translate(`project.unit.${projectDetail?.unitTime}`)})
                          </th>
                          <th>
                            {translate('project.schedule.estimatedTimeOptimistic')} ({translate(`project.unit.${projectDetail?.unitTime}`)})
                          </th>
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
                        {state.listTasks &&
                          state.listTasks.length !== 0 &&
                          state.listTasks.map((taskItem, index) => (
                            <tr style={{ cursor: 'pointer' }} onClick={() => handleEditTask(index)} key={`task-${index}`}>
                              <td>{taskItem?.code}</td>
                              <td>{taskItem?.name}</td>
                              <td>{taskItem?.preceedingTasks?.join(', ')}</td>
                              <td>{taskItem?.projectPhase}</td>
                              <td>
                                {taskItem?.estimateNormalTime}
                                <strong style={{ color: 'red' }}>
                                  {isDurationNotSuitable(taskItem?.estimateNormalTime)
                                    ? ' - Thời gian không được lớn hơn 7 Ngày và nhỏ hơn 4 Giờ'
                                    : null}
                                </strong>
                              </td>
                              <td>
                                {taskItem?.estimateOptimisticTime}
                                <strong style={{ color: 'red' }}>
                                  {isDurationNotSuitable(taskItem?.estimateOptimisticTime)
                                    ? ' - Thời gian không được lớn hơn 7 Ngày và nhỏ hơn 4 Giờ'
                                    : null}
                                </strong>
                              </td>
                              <td>
                                {taskItem?.currentResponsibleEmployees
                                  ?.map((resItem) => convertUserIdToUserName(listUsers, resItem))
                                  .join(', ')}
                              </td>
                              <td>
                                {taskItem?.currentAccountableEmployees
                                  ?.map((accItem) => convertUserIdToUserName(listUsers, accItem))
                                  .join(', ')}
                              </td>
                              <td>{taskItem?.totalResWeight}</td>
                              <td>{taskItem?.totalResWeight ? 100 - Number(taskItem?.totalResWeight) : ''}</td>
                              <td>
                                {checkIsNullUndefined(taskItem?.estimateNormalCost) ? 'Chưa tính được' : taskItem?.estimateNormalCost}
                              </td>
                              <td>{checkIsNullUndefined(taskItem?.estimateMaxCost) ? 'Chưa tính được' : taskItem?.estimateMaxCost}</td>
                              {currentModeImport === 'HAND' && (
                                <td>
                                  <a className='delete' title={translate('general.delete')} onClick={() => handleDeleteTask(index)}>
                                    <i className='material-icons'>delete</i>
                                  </a>
                                </td>
                              )}
                              {currentModeImport === 'EXCEL' && (
                                <td>
                                  <a className='edit' title={translate('general.edit')}>
                                    <i className='material-icons'>edit</i>
                                  </a>
                                </td>
                              )}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  <div id='import_phase_project' className='tab-pane'>
                    {/* Bảng các giai đoạn trong dự án*/}
                    <table id='phase-project-table' className='table table-striped table-bordered table-hover'>
                      <thead>
                        <tr>
                          <th>Mã giai đoạn</th>
                          <th>Tên giai đoạn</th>
                          <th>Người thực hiện</th>
                          <th>Người phê duyệt</th>
                          <th>{translate('task_template.action')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {state.listPhases &&
                          state.listPhases.length !== 0 &&
                          state.listPhases.map((phaseItem, index) => (
                            <tr style={{ cursor: 'pointer' }} onClick={() => handleEditPhase(index)} key={`phase-${index}`}>
                              <td>{phaseItem?.code}</td>
                              <td>{phaseItem?.name}</td>
                              <td>
                                {phaseItem?.currentResponsibleEmployees
                                  ?.map((resItem) => convertUserIdToUserName(listUsers, resItem))
                                  .join(', ')}
                              </td>
                              <td>
                                {phaseItem?.currentAccountableEmployees
                                  ?.map((accItem) => convertUserIdToUserName(listUsers, accItem))
                                  .join(', ')}
                              </td>
                              {currentModeImport === 'HAND' && (
                                <td>
                                  <a className='delete' title={translate('general.delete')} onClick={() => handleDeletePhase(index)}>
                                    <i className='material-icons'>delete</i>
                                  </a>
                                </td>
                              )}
                              {currentModeImport === 'EXCEL' && (
                                <td>
                                  <a className='edit' title={translate('general.edit')}>
                                    <i className='material-icons'>edit</i>
                                  </a>
                                </td>
                              )}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
          {currentStep === 1 && (
            <ModalCalculateCPM
              estDurationEndProject={Number(estDurationEndProject)}
              tasksData={state.listTasks}
              phasesData={state.listPhases}
              handleHideModal={handleHideModal}
            />
          )}
        </div>
      </DialogModal>
    </React.Fragment>
  )
}
function mapState(state) {
  const { project, user } = state
  return { project, user }
}

const mapDispatchToProps = {
  getProjectsDispatch: ProjectActions.getProjectsDispatch,
  deleteProjectDispatch: ProjectActions.deleteProjectDispatch,
  getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany
}

export default connect(mapState, mapDispatchToProps)(withTranslate(ModalAddTaskSchedule))
