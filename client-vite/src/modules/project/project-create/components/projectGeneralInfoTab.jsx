import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { withTranslate } from "react-redux-multilingual"
import { DatePicker, ErrorLabel, SelectBox } from "../../../../common-components"
import { fakeProjectTypeList, fakeUnitCostList, fakeUnitTimeList } from "./consts"
import ValidationHelper from "../../../../helpers/validationHelper"
import { TaskFormValidator } from "../../../task/task-management/component/taskFormValidator"
import dayjs from 'dayjs'
import { convertToDate, getListDepartments } from "../../projects/components/functionHelper"
import { UserActions } from "../../../super-admin/user/redux/actions"
import getEmployeeSelectBoxItems from "../../../task/organizationalUnitHelper"
import { createUnitKpiActions } from "../../../kpi/organizational-unit/creation/redux/actions"


const ProjectGeneralInfoTab = (props) => {
  const {
    translate,
    projectId,
    actionType,
    user,
    organizationalUnitKpiSets,
    generalProjectInfo, setGeneralProjectInfo, projectKPITarget, setProjectKPITarget, 
  } = props
  const {
    projectName,
    projectNameError,
    description,
    projectType,
    willStartTime,
    errorOnWillStartTime,
    willEndTime,
    errorOnWillEndTime,
    unitOfCost,
    unitOfTime,
  } = generalProjectInfo

  const {
    kpiSet,
    kpiSetError,
    kpisTarget,
    kpisTargetErrors,
  } = projectKPITarget

  

  const handleChangeGeneralForm = (event, currentKey) => {
    if (currentKey === 'projectName') {
      let { translate } = props
      let { message } = ValidationHelper.validateName(translate, event.target.value, 6, 255)
      setGeneralProjectInfo({
        ...generalProjectInfo,
        [currentKey]: event.target.value,
        projectNameError: message
      })
      return
    }
    const justRenderEventArr = ['projectManager', 'responsibleEmployees', 'willStartTime', 'willEndTime']
    if (justRenderEventArr.includes(currentKey)) {
      setGeneralProjectInfo({
        ...generalProjectInfo,
        [currentKey]: event
      })
      return
    }
    const renderFirstItemArr = ['unitOfCost', 'unitOfTime', 'projectType']
    if (renderFirstItemArr.includes(currentKey)) {
      setGeneralProjectInfo({
        ...generalProjectInfo,
        [currentKey]: event[0]
      })
      return
    }
    setGeneralProjectInfo({
      ...generalProjectInfo,
      [currentKey]: event?.target?.value
    })
  }

  const handleChangeProjectStartTime = (value) => {
    validateProjectStartDate(value, true)
  }

  const validateProjectStartDate = (value, willUpdateState = true) => {
    let msg = TaskFormValidator.validateTaskStartDate(value, willEndTime, translate)
    let _startDate = convertToDate(value)
    let _endDate = convertToDate(willEndTime)

    if (_startDate > _endDate) {
      msg = translate('project.add_err_end_date')
    }


    if (willUpdateState) {
      setGeneralProjectInfo({
        ...generalProjectInfo,
        willStartTime: value,
        errorOnWillStartTime: msg,
        errorOnWillEndTime: !msg && willEndTime ? msg : errorOnWillEndTime
      })
    }
    return msg === undefined
  }

  const handleChangeProjectEndTime = (value) => {
    validateProjectEndTime(value, true)
  }

  const validateProjectEndTime = (value, willUpdateState = true) => {
    let msg = TaskFormValidator.validateTaskEndDate(willStartTime, value, translate)
    if (willUpdateState) {
      setGeneralProjectInfo({
        ...generalProjectInfo,
        willEndTime: value,
        errorOnWillEndTime: msg,
        errorOnWillStartTime: !msg && willStartTime ? msg : errorOnWillStartTime
      })
    }
    return msg === undefined
  }

  const handleChangeKPIUnit = (value, organizationalUnitKpiSets) => {
    const kpiSetId = value[0]
    const organizationalUnitKpiSetForValue = organizationalUnitKpiSets.find((item) => item._id === kpiSetId)
    let kpisTarget = [], kpisTargetErrors = []
    if (organizationalUnitKpiSetForValue && organizationalUnitKpiSetForValue?.kpis) {
      kpisTarget = organizationalUnitKpiSetForValue.kpis.map((item, index) => {
        kpisTargetErrors.push('')
        return {
          ...item,
          assignValueInProject: 0,
          targetValueInProject: 0,
          kpiTargetValue: 0,
          typeIndex: index + 1,
        }
      })
      
    }
    
    setProjectKPITarget({
      ...projectKPITarget,
      kpiSet: kpiSetId,
      kpisTarget,
      kpisTargetErrors
    })
  }

  const handleChangeKPITargetForm = (e, keyChange, indexChange) => {
    const value = e.target.value === '' ? undefined : Number(e.target.value)
    let msg = '', kpiTargetValue = 0

    if (keyChange === 'assignValueInProject') {
      msg = TaskFormValidator.validateTargetKPI(translate, value, kpisTarget[indexChange].targetValueInProject)
      if (!msg && value) {
        kpiTargetValue = kpisTarget[indexChange].targetValueInProject / value
      }
    } else if (keyChange === 'targetValueInProject') {
      msg = TaskFormValidator.validateTargetKPI(translate, kpisTarget[indexChange].assignValueInProject, value)
      if (!msg && kpisTarget[indexChange].assignValueInProject) {
        kpiTargetValue = value / kpisTarget[indexChange].assignValueInProject
      }
    }
    
    
      
    let newKPITargetErrors = kpisTargetErrors
    newKPITargetErrors[indexChange] = msg

    const newUpdateKPITargets = kpisTarget.map((item, index) => {

      if (index === indexChange) {
        return {
          ...item,
          [keyChange]: value,
          kpiTargetValue
        }
      } else {
        return item
      }
    })

    setProjectKPITarget({
      ...projectKPITarget,
      kpisTarget: newUpdateKPITargets,
      kpisTargetErrors: newKPITargetErrors
    })
  }



  return (
    <React.Fragment>
      <div className="py-12">
        <div className="col-lg-6 col-md-12">
          <fieldset className="scheduler-border">
            <legend>Thông số dự án</legend>
            <div className="row">
              {/* Tên */}
              <div className={`form-group col-md-12 col-xs-12`}>
                <label>
                  {translate('project.name')}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='text'
                  className='form-control'
                  value={projectName}
                  onChange={(e) => handleChangeGeneralForm(e, 'projectName')}
                ></input>
                <div className="has-error">
                  <ErrorLabel content={projectNameError} />
                </div>
              </div>

              {/* Hình thức */}
              {/* <div className={`form-group col-md-6 col-xs-6`}>
                <label>
                  Hình thức quản lý dự án<span className='text-red'>*</span>
                </label>
                <SelectBox
                  id={`${props.type}-select-project-manager-${id}`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  items={fakeProjectTypeList}
                  onChange={(e) => handleChangeGeneralForm(e, 'projectType')}
                  value={projectType}
                  multiple={false}
                />
              </div> */}
            </div>

            {/* Thời gian dự kiến bắt đầu, kết thúc */}
            <div className="row">
              {/* Thời gian bắt đầu */}
              <div className={`form-group col-md-6 col-xs-6 `}>
                <label>
                  {'Thời điểm bắt đầu (dự kiến)'}
                  <span className='text-red'>*</span>
                </label>
                <DatePicker
                  id={`${actionType}-create-project-start-date-${projectId}`}
                  value={willStartTime}
                  onChange={(e) => handleChangeProjectStartTime(e)}
                  dateFormat='day-month-year'
                  disabled={false}
                />
                <div className="has-error">
                  <ErrorLabel content={errorOnWillStartTime} />
                </div>
              </div>

              {/* Thời gian kết thúc  */}
              <div className={`form-group col-md-6 col-xs-6 `}>
                <label>
                  {'Thời điểm kết thúc (dự kiến)'}
                  <span className='text-red'>*</span>
                </label>
                <DatePicker
                  id={`${actionType}-create-project-end-date-${projectId}`}
                  value={willEndTime}
                  onChange={(e) => handleChangeProjectEndTime(e)}
                  dateFormat='day-month-year'
                  disabled={false}
                />
                <div className="has-error">
                  <ErrorLabel content={errorOnWillEndTime} />
                </div>
              </div>
            </div>

            {/* Đơn vị thời gian và tiền tệ */}
            <div className="row">
              {/* Đơn vị thời gian */}
              <div className="form-group col-md-6 col-xs-6">
                <label>{translate('project.unitTime')}</label>
                <SelectBox
                  id={`${actionType}-select-project-unitTime-${projectId}`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  items={fakeUnitTimeList}
                  onChange={(e) => handleChangeGeneralForm(e, 'unitOfTime')}
                  value={unitOfTime}
                  multiple={false}
                />
              </div>

              {/* Đơn vị tiền tệ */}
              <div className="form-group col-md-6 col-xs-6">
                <label>{translate('project.unitTime')}</label>
                <SelectBox
                  id={`${actionType}-select-project-unitCost-${projectId}`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  items={fakeUnitCostList}
                  onChange={(e) => handleChangeGeneralForm(e, 'unitOfCost')}
                  value={unitOfCost}
                  multiple={false}
                />
              </div>
            </div>

            {/* Mô tả dự án */}
            <div className={`form-group`}>
              <label>{translate('project.description')}</label>
              <textarea
                type='text'
                className='form-control'
                value={description}
                onChange={(e) => handleChangeGeneralForm(e, 'description')}
              />
            </div>
          </fieldset>

        </div>
        <div className="col-lg-6 col-md-12">
          <fieldset className="scheduler-border">
            <legend>KPI mục tiêu</legend>
            {/* Đơn vị KPI mục tiêu */}
            <div className="row">

              {/* Mẫu KPI */}
              <div className={`form-group col-md-12 col-xs-12`}>
                <label>
                  {'KPI đơn vị'}
                  <span className='text-red'>*</span>
                </label>
                {organizationalUnitKpiSets && organizationalUnitKpiSets?.length > 0 && (
                  <SelectBox
                    id={`${actionType}-select-kpi-unit-${projectId}`}
                    className="form-control select2"
                    style={{ width: '100%' }}
                    items={organizationalUnitKpiSets}
                    onChange={(e) => handleChangeKPIUnit(e, organizationalUnitKpiSets)}
                    multiple={false}
                    value={kpiSet}
                    options={{
                      placeholder: '--- Chọn KPI đơn vị ---'
                    }}
                  />
                )}
                <div className="has-error">
                  <ErrorLabel content={kpiSetError} />
                </div>
              </div>
            </div>

            {/* KPI Mục tiêu */}
            <div className="row">
              <div className={`form-group col-md-12`}>
                <label>
                  {'Giá trị KPI Mục tiêu'}
                  <span className='text-red'>*</span>
                </label>
                {/* <ErrorLabel content={'TODO'} /> */}
                <table id='project-table-kpi-target' className='table table-striped table-bordered table-hover'>
                  <thead>
                    <tr>
                      <th>KPI Mục tiêu</th>
                      <th>Tổng số giao</th>
                      <th>Chỉ tiêu cần đạt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kpisTarget && kpisTarget?.length > 0 && kpisTarget.map((item, index) => (
                      <React.Fragment key={item._id}>
                        <tr className={kpisTargetErrors[index] && "has-error"}>
                          <td>
                            <span className="form-control truncate">
                              {`${item.name} ${item?.unit ? "( " + item.unit + " )" : ''}`}
                            </span>
                          </td>
                          <td >
                            <input
                              type="number"
                              className='form-control'
                              min={"0"}
                              value={item.assignValueInProject}
                              onChange={(e) => handleChangeKPITargetForm(e, 'assignValueInProject', index)}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className='form-control'
                              min={"0"}
                              max={item.assignValueInProject + ''}
                              value={item.targetValueInProject}
                              onChange={(e) => handleChangeKPITargetForm(e, 'targetValueInProject', index)}
                            />
                          </td>
                        </tr>
                        <tr className='has-error'>
                          <ErrorLabel content={kpisTargetErrors[index]} />
                        </tr>
                      </React.Fragment>

                    ))}
                  </tbody>
                </table>                

              </div>
            </div>

          </fieldset>
        </div>
      
      </div>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { project, user, createKpiUnit } = state
  return { project, user, createKpiUnit }
}

const mapDispatchToProps = {
  // getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ProjectGeneralInfoTab))