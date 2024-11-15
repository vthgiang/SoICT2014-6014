import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { ButtonModal, DialogModal, ErrorLabel, TreeSelect, DatePicker, SelectBox, TimePicker } from '../../../../common-components'
import { withTranslate } from 'react-redux-multilingual'
import ValidationHelper from '../../../../helpers/validationHelper'
import { ProjectActions } from '../redux/actions'
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper'
import { getStorage } from '../../../../config'
import {
  convertDateTime,
  convertDepartmentIdToDepartmentName,
  convertUserIdToUserName,
  formatTime,
  getListDepartments
} from './functionHelper'
import ModalSalaryMembers from './modalSalaryMembers'
import { formatDate } from '../../../../helpers/formatDate'

const ProjectCreateFormData = (props) => {
  const TYPE = {
    DEFAULT: 'DEFAULT', // tạo mới project thông thường
    CREATE_BY_CONTRACT: 'CREATE_BY_CONTRACT', // tạo mới project theo hợp đồng
    CREATE_BY_TEMPLATE: 'CREATE_BY_TEMPLATE' // tạo mới project theo mẫu
  }
  const { translate, project, user } = props
  const userId = getStorage('userId')
  const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []
  const listDepartments = user && user.usersInUnitsOfCompany ? getListDepartments(user.usersInUnitsOfCompany) : []
  const [currentSalaryMembers, setCurrentSalaryMembers] = useState(undefined)
  // console.log('listUsers', listUsers)
  const fakeUnitCostList = [
    { text: 'VND', value: 'VND' },
    { text: 'USD', value: 'USD' }
  ]
  const fakeUnitTimeList = [
    { text: 'Ngày', value: 'days' },
    { text: 'Giờ', value: 'hours' }
  ]
  const fakeProjectTypeList = [
    { text: 'QLDA dạng đơn giản', value: 1 },
    { text: 'QLDA phương pháp CPM', value: 2 }
  ]
  const [form, setForm] = useState({
    projectNameError: undefined,
    projectName: '',
    projectType: 2,
    description: '',
    startDate: '',
    endDate: '',
    projectManager: [],
    responsibleEmployees: [],
    unitCost: fakeUnitCostList[0].value,
    unitTime: fakeUnitTimeList[0].value,
    estimatedCost: ''
  })

  const [startTime, setStartTime] = useState('08:00 AM')
  const [endTime, setEndTime] = useState('05:30 PM')
  const [id, setId] = useState(props.id)
  useEffect(() => {
    setId(props.id)
  }, [props.id])

  const [responsibleEmployeesWithUnit, setResponsibleEmployeesWithUnit] = useState({
    list: [],
    currentUnitRow: '',
    currentEmployeeRow: []
  })

  const {
    projectName,
    projectNameError,
    description,
    projectType,
    startDate,
    endDate,
    projectManager,
    responsibleEmployees,
    unitCost,
    unitTime,
    estimatedCost
  } = form

  const handleChangeForm = (event, currentKey) => {
    if (currentKey === 'projectName') {
      let { translate } = props
      let { message } = ValidationHelper.validateName(translate, event.target.value, 6, 255)
      setForm({
        ...form,
        [currentKey]: event.target.value,
        projectNameError: message
      })
      return
    }
    const justRenderEventArr = ['projectManager', 'responsibleEmployees', 'startDate', 'endDate']
    if (justRenderEventArr.includes(currentKey)) {
      setForm({
        ...form,
        [currentKey]: event
      })
      return
    }
    const renderFirstItemArr = ['unitCost', 'unitTime', 'projectType']
    if (renderFirstItemArr.includes(currentKey)) {
      setForm({
        ...form,
        [currentKey]: event[0]
      })
      return
    }
    if (currentKey === 'estimatedCost') {
      setForm({
        ...form,
        [currentKey]: event.target.value
      })
      return
    }
    setForm({
      ...form,
      [currentKey]: event?.target?.value
    })
  }

  const isFormValidated = () => {
    let { translate } = props
    // console.log('\n----------------')
    // console.log(!ValidationHelper.validateName(translate, projectName, 6, 255).status)
    // console.log(!ValidationHelper.validateName(translate, code, 6, 6).status)
    // console.log(projectManager.length === 0)
    // console.log(responsibleEmployeesWithUnit.list.length === 0)
    // console.log(startDate.length === 0)
    // console.log(endDate.length === 0)
    if (!ValidationHelper.validateName(translate, projectName, 6, 255).status) return false
    if (projectManager.length === 0) return false
    if (responsibleEmployeesWithUnit.list.length === 0) return false
    if (startDate.length === 0) return false
    if (endDate.length === 0) return false
    if (startDate > endDate) return false
    return true
  }

  const save = () => {
    if (isFormValidated()) {
      let partStartDate = convertDateTime(startDate, startTime).split('-')
      let start = new Date([partStartDate[2], partStartDate[1], partStartDate[0]].join('-'))

      let partEndDate = convertDateTime(endDate, endTime).split('-')
      let end = new Date([partEndDate[2], partEndDate[1], partEndDate[0]].join('-'))

      // Cái này để hiển thị danh sách ra - không quan tâm user nào thuộc unit nào
      let newEmployeesArr = []
      for (let unitItem of responsibleEmployeesWithUnit.list) {
        for (let userItem of unitItem.listUsers) {
          newEmployeesArr.push(userItem)
        }
      }

      // props.createProjectDispatch({
      //     name: projectName,
      //     projectType,
      //     startDate: start,
      //     endDate: end,
      //     projectManager,
      //     responsibleEmployees: newEmployeesArr,
      //     description,
      //     unitCost,
      //     unitTime,
      //     estimatedCost,
      //     creator: userId,
      //     responsibleEmployeesWithUnit: currentSalaryMembers,
      // });

      // setTimeout(() => {
      //     props.handleAfterCreateProject()
      // }, 30 * newEmployeesArr.length);
    }
  }

  useEffect(() => {
    props.handleForm(form)
  }, [JSON.stringify(form)])

  useEffect(() => {
    props.handleCurrentSalaryMembers(currentSalaryMembers)
  }, [JSON.stringify(currentSalaryMembers)])

  useEffect(() => {
    props.handleEndTime(endTime)
  }, [JSON.stringify(endTime)])

  useEffect(() => {
    props.handleStartTime(startTime)
  }, [JSON.stringify(startTime)])

  useEffect(() => {
    let prjData = props.projectData
    if ((props.type === TYPE.CREATE_BY_CONTRACT || props.type === TYPE.CREATE_BY_TEMPLATE) && prjData) {
      setForm({
        id: props.id,
        // projectId: prjDataId,
        projectNameError: undefined,
        projectName: prjData?.name || '',
        description: prjData?.description || '',
        projectType: prjData?.projectType || 2,
        startDate: prjData?.startDate ? formatDate(prjData?.startDate) : '',
        endDate: prjData?.endDate ? formatDate(prjData?.endDate) : '',
        projectManager: preprocessUsersList(prjData?.projectManager),
        responsibleEmployees: preprocessUsersList(prjData?.responsibleEmployees),
        unitCost: prjData?.unitCost || fakeUnitCostList[0].text,
        unitTime: prjData?.unitTime || fakeUnitTimeList[0].text,
        estimatedCost: prjData?.estimatedCost || ''
      })
      setStartTime(formatTime(prjData?.startDate) || '08:00 AM')
      setEndTime(formatTime(prjData?.endDate) || '05:30 PM')
      let newResponsibleEmployeesWithUnit = []
      for (let i = 0; i < prjData?.responsibleEmployeesWithUnit.length; i++) {
        newResponsibleEmployeesWithUnit.push({
          unitId: prjData?.responsibleEmployeesWithUnit[i].unitId,
          listUsers: prjData?.responsibleEmployeesWithUnit[i].listUsers.map((item, index) => ({
            userId: item.userId,
            salary: item.salary
          }))
        })
      }
      setCurrentSalaryMembers(newResponsibleEmployeesWithUnit)
      setTimeout(() => {
        setResponsibleEmployeesWithUnit({
          ...responsibleEmployeesWithUnit,
          list: prjData?.responsibleEmployeesWithUnit?.map((unitItem) => {
            return {
              unitId: unitItem.unitId,
              listUsers: unitItem?.listUsers?.map((userItem) => {
                return userItem.userId
              })
            }
          })
        })
      }, 10)
    }
  }, [JSON.stringify(props.projectData), props.id])

  const preprocessUsersList = useCallback((currentObject) => {
    if (typeof currentObject?.[0] === 'string') {
      return currentObject
    }
    return currentObject?.map((item) => item._id)
  }, [])

  const handleDelete = (index) => {
    if (responsibleEmployeesWithUnit.list && responsibleEmployeesWithUnit.list.length > 0) {
      const cloneArr = [...responsibleEmployeesWithUnit.list]
      cloneArr.splice(index, 1)
      // responsibleEmployeesWithUnit.list.splice(responsibleEmployeesWithUnit.list.length - 1, 1);
      setResponsibleEmployeesWithUnit({
        ...responsibleEmployeesWithUnit,
        list: cloneArr,
        currentUnitRow: '',
        currentEmployeeRow: []
      })
    }
  }

  const handleAddRow = () => {
    if (responsibleEmployeesWithUnit.currentEmployeeRow.length > 0) {
      // Đề phòng user không chọn gì thì lấy default là Ban giám đốc
      const currentChoosenUnitRow = responsibleEmployeesWithUnit.currentUnitRow || listDepartments[0]?.value
      const isUnitAlreadyExistedInArr = responsibleEmployeesWithUnit.list.find((item) => {
        return currentChoosenUnitRow === item.unitId
      })
      const oldListRow = responsibleEmployeesWithUnit.list
      // Nếu unit đã có trong array rồi
      if (isUnitAlreadyExistedInArr) {
        let newListRow = oldListRow.map((oldListRowItem) => {
          if (String(oldListRowItem.unitId) === String(isUnitAlreadyExistedInArr.unitId)) {
            let currentListUsers = oldListRowItem.listUsers
            for (let currentEmployeeRowItem of responsibleEmployeesWithUnit.currentEmployeeRow) {
              if (!currentListUsers.includes(currentEmployeeRowItem)) {
                currentListUsers.push(currentEmployeeRowItem)
              }
            }
            return {
              unitId: oldListRowItem.unitId,
              listUsers: currentListUsers
            }
          }
          return oldListRowItem
        })
        setResponsibleEmployeesWithUnit({
          ...responsibleEmployeesWithUnit,
          list: newListRow,
          currentUnitRow: '',
          currentEmployeeRow: []
        })
      } else {
        const newListRow = [
          ...oldListRow,
          {
            unitId: currentChoosenUnitRow,
            listUsers: responsibleEmployeesWithUnit.currentEmployeeRow
          }
        ]
        setResponsibleEmployeesWithUnit({
          ...responsibleEmployeesWithUnit,
          list: newListRow,
          currentUnitRow: '',
          currentEmployeeRow: []
        })
      }
    }
  }

  useEffect(() => {
    let newResponsibleEmployeesWithUnit = []
    // console.log('currentSalaryMembers create project', currentSalaryMembers)
    for (let i = 0; i < responsibleEmployeesWithUnit.list.length; i++) {
      newResponsibleEmployeesWithUnit.push({
        unitId: responsibleEmployeesWithUnit.list[i].unitId,
        listUsers: responsibleEmployeesWithUnit.list[i].listUsers.map((item, index) => ({
          userId: item,
          salary: currentSalaryMembers?.[i]?.listUsers?.[index]?.salary
        }))
      })
    }
    setCurrentSalaryMembers(newResponsibleEmployeesWithUnit)
    props.handleResponsibleEmployeesWithUnit(responsibleEmployeesWithUnit)
  }, [responsibleEmployeesWithUnit.list])

  const handleOpenModalSalaryMembers = () => {
    setTimeout(() => {
      window.$('#modal-salary-members').modal('show')
    }, 10)
  }

  const handleSaveCurrentSalaryMember = (data) => {
    setCurrentSalaryMembers(data)
  }

  return (
    <div>
      <ModalSalaryMembers
        createProjectCurrentSalaryMember={currentSalaryMembers}
        responsibleEmployeesWithUnit={responsibleEmployeesWithUnit}
        handleSaveCurrentSalaryMember={handleSaveCurrentSalaryMember}
      />
      <div className='row'>
        <div className={'col-sm-6'}>
          <fieldset className='scheduler-border'>
            <legend className='scheduler-border'>Thông số dự án</legend>

            <div className='row'>
              <div className={`form-group col-md-6 col-xs-6 ${!projectNameError ? '' : 'has-error'}`}>
                <label>
                  {translate('project.name')}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='text'
                  className='form-control'
                  value={projectName}
                  onChange={(e) => handleChangeForm(e, 'projectName')}
                ></input>
                <ErrorLabel content={projectNameError} />
              </div>

              <div className={`form-group col-md-6 col-xs-6`}>
                <label>
                  Hình thức quản lý dự án<span className='text-red'>*</span>
                </label>
                <SelectBox
                  id={`select-project-type-${id}`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  items={fakeProjectTypeList}
                  onChange={(e) => handleChangeForm(e, 'projectType')}
                  value={projectType}
                  multiple={false}
                />
              </div>
            </div>

            <div className='row'>
              <div className='form-group col-md-6'>
                <label>
                  {translate('project.startDate')}
                  <span className='text-red'>*</span>
                </label>
                <DatePicker
                  id={`create-project-start-date-${id}`}
                  value={startDate}
                  onChange={(e) => handleChangeForm(e, 'startDate')}
                  dateFormat='day-month-year'
                  disabled={false}
                />
              </div>
              <div className='form-group col-md-6'>
                <label>
                  Thời gian bắt đầu dự án<span className='text-red'>*</span>
                </label>
                <TimePicker id={`create-project-start-time--${id}`} value={startTime} onChange={(e) => setStartTime(e)} disabled={false} />
              </div>
            </div>

            <div className='row'>
              <div className='form-group col-md-6'>
                <label>
                  {translate('project.endDate')}
                  <span className='text-red'>*</span>
                </label>
                <DatePicker
                  id={`create-project-end-date-${id}`}
                  value={endDate}
                  onChange={(e) => handleChangeForm(e, 'endDate')}
                  dateFormat='day-month-year'
                  disabled={false}
                />
              </div>
              <div className='form-group col-md-6'>
                <label>
                  Thời gian dự kiến kết thúc dự án<span className='text-red'>*</span>
                </label>
                <TimePicker id={`create-project-end-time`} value={endTime} onChange={(e) => setEndTime(e)} disabled={false} />
              </div>
            </div>

            <div className='form-group'>
              <label>{translate('project.unitTime')}</label>
              <SelectBox
                id={`select-project-unitTime-${id}`}
                className='form-control select2'
                style={{ width: '100%' }}
                items={fakeUnitTimeList}
                onChange={(e) => handleChangeForm(e, 'unitTime')}
                value={unitTime}
                multiple={false}
              />
            </div>
            <div className='form-group'>
              <label>{translate('project.unitCost')}</label>
              <div className='form-control'>VND</div>
            </div>

            <div className={`form-group`}>
              <label>{translate('project.description')}</label>
              <textarea type='text' className='form-control' value={description} onChange={(e) => handleChangeForm(e, 'description')} />
            </div>
          </fieldset>
        </div>
        <div className={'col-sm-6'}>
          <fieldset className='scheduler-border'>
            <legend className='scheduler-border'>Nhân lực</legend>
            <div className='form-group'>
              <label>
                {translate('project.manager')}
                <span className='text-red'>*</span>
              </label>
              {listUsers && (
                <SelectBox
                  id={`select-project-manager-${id}`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  items={listUsers}
                  onChange={(e) => handleChangeForm(e, 'projectManager')}
                  value={projectManager}
                  multiple={true}
                />
              )}
            </div>
            <div className='form-group'>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <label>
                  {translate('project.member')}
                  <span className='text-red'>*</span>
                </label>
                <button type='button' className='btn-link' onClick={handleOpenModalSalaryMembers}>
                  Xem chi tiết lương nhân viên
                </button>
              </div>
              <table id='project-table' className='table table-striped table-bordered table-hover'>
                <thead>
                  <tr>
                    <th>Thuộc đơn vị</th>
                    <th>Thành viên tham gia</th>
                    <th>{translate('task_template.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {responsibleEmployeesWithUnit.list &&
                    responsibleEmployeesWithUnit.list.length > 0 &&
                    responsibleEmployeesWithUnit.list.map((item, index) => (
                      <tr key={index}>
                        <td>{convertDepartmentIdToDepartmentName(user.usersInUnitsOfCompany, item?.unitId)}</td>
                        <td>{item?.listUsers.map((userItem) => convertUserIdToUserName(listUsers, userItem)).join(', ')}</td>
                        <td>
                          <a className='delete' title={translate('general.delete')} onClick={() => handleDelete(index)}>
                            <i className='material-icons'>delete</i>
                          </a>
                        </td>
                      </tr>
                    ))}
                  <tr key={`add-task-input-${responsibleEmployeesWithUnit.list.length}`}>
                    <td>
                      <div className={`form-group`}>
                        {listDepartments && listDepartments.length > 0 && (
                          <SelectBox
                            id={`create-project-${responsibleEmployeesWithUnit.list.length}-${id}`}
                            className='form-control select2'
                            style={{ width: '100%' }}
                            items={listDepartments}
                            onChange={(e) => {
                              setTimeout(() => {
                                setResponsibleEmployeesWithUnit({
                                  ...responsibleEmployeesWithUnit,
                                  currentUnitRow: e[0]
                                })
                              }, 10)
                            }}
                            value={responsibleEmployeesWithUnit.currentUnitRow}
                            multiple={false}
                          />
                        )}
                      </div>
                    </td>
                    <td style={{ maxWidth: 250 }}>
                      <div className={`form-group`}>
                        {listDepartments && listDepartments.length > 0 && (
                          <SelectBox
                            id={`select-project-members-${id}`}
                            className='form-control select2'
                            style={{ width: '100%' }}
                            items={listUsers.filter(
                              (item) =>
                                item.text ===
                                convertDepartmentIdToDepartmentName(
                                  user.usersInUnitsOfCompany,
                                  responsibleEmployeesWithUnit.currentUnitRow || listDepartments[0]?.value
                                )
                            )}
                            onChange={(e) => {
                              setTimeout(() => {
                                setResponsibleEmployeesWithUnit({
                                  ...responsibleEmployeesWithUnit,
                                  currentEmployeeRow: e
                                })
                              }, 10)
                            }}
                            value={responsibleEmployeesWithUnit.currentEmployeeRow}
                            multiple={true}
                          />
                        )}
                      </div>
                    </td>
                    <td>
                      <a className='save text-green' title={translate('general.save')} onClick={handleAddRow}>
                        <i className='material-icons'>add_circle</i>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </fieldset>
        </div>
      </div>
      {/* <div className="form-group">
                <label>{translate('project.parent')}</label>
                <TreeSelect data={list} value={projectParent} handleChange={handleParent} mode="radioSelect" />
            </div> */}
      {/* <div className={`form-group`}>
                <label>{translate('project.estimatedCost')}</label>
                <input
                    type="number"
                    className="form-control"
                    value={estimatedCost}
                    onChange={(e) => handleChangeForm(e, 'estimatedCost')}
                />
            </div> */}
    </div>
  )
}

function mapStateToProps(state) {
  const { project, user } = state
  return { project, user }
}

const mapDispatchToProps = {
  createProjectDispatch: ProjectActions.createProjectDispatch
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ProjectCreateFormData))
