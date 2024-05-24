import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { useTranslate } from 'react-redux-multilingual/lib/context'
import { useDispatch, useSelector } from 'react-redux'
import { QuillEditor, DatePicker, ErrorLabel, SelectBox } from '../../../../../common-components'
import TaskTypeFilterComponent from './taskTypeFilterComponent'
import { UserActions } from '../../../../super-admin/user/redux/actions'
import { createUnitKpiActions } from '../../../organizational-unit/creation/redux/actions'
import { CertificateActions } from '../../../../human-resource/certificate/redux/actions'
import { MajorActions } from '../../../../human-resource/major/redux/actions'

function AddTaskPackageModelContent({ handleDataFromChild }) {
  const translate = useTranslate()
  const [taskData, setTaskData] = useState({
    taskName: '',
    taskDescription: '',
    startDate: '',
    endDate: '',
    duration: 0,
    taskValue: 0,
    taskValueUnit: '',
    kpiId: '',
    kpiWeight: 0,
    requireCertificates: [],
    requireMajors: [],
    taskType: ''
  })
  const [errors, setErrors] = useState({})
  const dispatch = useDispatch()
  const organizationalUnitsOfUser = useSelector((state) => state.user.organizationalUnitsOfUser)
  const createKpiUnit = useSelector((state) => state.createKpiUnit)
  const certificates = useSelector((state) => state.certificate)
  const majors = useSelector((state) => state.major)
  const [listUnitGoal, setListUnitGoal] = useState([])
  const [listCertificate, setListCertificate] = useState([])
  const [listMajor, setListMajor] = useState([])

  useEffect(() => {
    dispatch(UserActions.getDepartmentOfUser())
    dispatch(CertificateActions.getListCertificate())
    dispatch(MajorActions.getListMajor())
  }, [dispatch])

  useEffect(() => {
    if (organizationalUnitsOfUser) {
      const currentRole = localStorage.getItem('currentRole')
      const currentUnit = organizationalUnitsOfUser.filter(
        (item) => item.managers.includes(currentRole) || item.employees.includes(currentRole) || item.deputyManagers.includes(currentRole)
      )
      const today = new Date()
      const month = `${today.getFullYear()}-${today.getMonth() + 1}`
      dispatch(createUnitKpiActions.getCurrentKPIUnit(currentRole, currentUnit?.[0]?._id, month))
    }
  }, [organizationalUnitsOfUser])

  useEffect(() => {
    const formattedData = createKpiUnit?.currentKPI?.kpis.map((item) => ({
      value: item._id,
      text: item.name,
      criteria: item.criteria
    }))
    setListUnitGoal(formattedData)
    setTaskData((prevData) => ({
      ...prevData,
      kpiId: formattedData?.[0].value
    }))
  }, [createKpiUnit])

  useEffect(() => {
    const formattedData = certificates?.listCertificate.map((item) => ({
      value: item._id,
      text: item.name
    }))
    setListCertificate(formattedData)
  }, [certificates])

  useEffect(() => {
    const formattedData = majors?.listMajor.map((item) => ({
      value: item._id,
      text: item.name
    }))
    setListMajor(formattedData)
  }, [majors])

  const validateData = useCallback(() => {
    const newErrors = {}
    if (!taskData.taskName) newErrors.taskName = 'Task name is required'
    if (!taskData.taskValue) newErrors.taskValue = 'Task value is required'
    if (!taskData.taskValueUnit) newErrors.taskValueUnit = 'Task value unit is required'
    if (!taskData.startDate) newErrors.startDate = 'Start date is required'
    if (!taskData.endDate) newErrors.endDate = 'End date is required'
    if (!taskData.duration) newErrors.duration = 'Duration is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [taskData])

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }, [])

  const handleChangeDescription = useCallback((value) => {
    setTaskData((prevData) => ({
      ...prevData,
      taskDescription: value
    }))
  }, [])

  const handleChangeDate = useCallback((name, value) => {
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }, [])

  const handleChangeTaskWeight = useCallback((e) => {
    const { value } = e.target
    setTaskData((prevData) => ({
      ...prevData,
      kpiWeight: value
    }))
  }, [])

  const handleChangeRequireCertificates = useCallback((value) => {
    setTaskData((prevData) => ({
      ...prevData,
      requireCertificates: value
    }))
  }, [])

  const handleChangeRequireMajors = useCallback((value) => {
    setTaskData((prevData) => ({
      ...prevData,
      requireMajors: value
    }))
  }, [])

  const handleChangeTaskType = useCallback((value) => {
    setTaskData((prevData) => ({
      ...prevData,
      taskType: value
    }))
  })

  const inputFields = useMemo(
    () => [
      { label: 'task_name', value: taskData.taskName, name: 'taskName' },
      { label: 'target', value: taskData.taskValue, name: 'taskValue', type: 'number' },
      { label: 'unit', value: taskData.taskValueUnit, name: 'taskValueUnit' },
      { label: 'duration', value: taskData.duration, name: 'duration', type: 'number' }
    ],
    [taskData]
  )

  useEffect(() => {
    handleDataFromChild(taskData)
  }, [taskData])

  return (
    <div className='row'>
      <div className='col-lg-6'>
        <fieldset className='scheduler-border'>
          <legend className='scheduler-border'>{translate('kpi.kpi_allocation.task_package_management.add_model.model_name')}</legend>

          <div className='flex'>
            <div className={`form-group w-full ${errors.taskType ? 'has-error' : ''}`}>
              <label className='control-label'>
                {translate('kpi.kpi_allocation.task_package_management.add_model.task_type_label')}
                <span className='text-red'>*</span>
              </label>
              <TaskTypeFilterComponent onData={handleChangeTaskType} />
              {errors.taskType && <ErrorLabel content={errors.taskType} />}
            </div>
          </div>

          {inputFields.map(({ label, value, name, type = 'text' }) => (
            <div className={`form-group ${errors[name] ? 'has-error' : ''}`} key={name}>
              <label>
                {translate(`kpi.kpi_allocation.task_package_management.add_model.${label}`)}
                <span className='text-red'>*</span>
              </label>
              <input
                type={type}
                className='form-control'
                placeholder={translate(`kpi.kpi_allocation.task_package_management.add_model.${label}`)}
                value={value}
                name={name}
                onChange={handleChange}
              />
              {errors[name] && <ErrorLabel content={errors[name]} />}
            </div>
          ))}

          <div className={`form-group ${errors.taskDescription ? 'has-error' : ''}`}>
            <label className='control-label'>{translate('kpi.kpi_allocation.task_package_management.add_model.task_description')}</label>
            <QuillEditor
              id='task-add-task-description'
              table={false}
              embeds={false}
              getTextData={handleChangeDescription}
              maxHeight={180}
              quillValueDefault={taskData.taskDescription}
              placeholder={translate('kpi.kpi_allocation.task_package_management.add_model.task_description')}
            />
            {errors.taskDescription && <ErrorLabel content={errors.taskDescription} />}
          </div>

          <div className='row form-group'>
            <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${errors.startDate ? 'has-error' : ''}`}>
              <label className='control-label'>
                {translate('kpi.kpi_allocation.task_package_management.add_model.start_date')}
                <span className='text-red'>*</span>
              </label>
              <DatePicker
                id='datepicker1'
                dateFormat='day-month-year'
                value={taskData.startDate}
                onChange={(value) => handleChangeDate('startDate', value)}
              />
              {errors.startDate && <ErrorLabel content={errors.startDate} />}
            </div>
            <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${errors.endDate ? 'has-error' : ''}`}>
              <label className='control-label'>
                {translate('kpi.kpi_allocation.task_package_management.add_model.end_date')}
                <span className='text-red'>*</span>
              </label>
              <DatePicker id='datepicker2' value={taskData.endDate} onChange={(value) => handleChangeDate('endDate', value)} />
              {errors.endDate && <ErrorLabel content={errors.endDate} />}
            </div>
          </div>
        </fieldset>
      </div>

      <div>
        <div className='col-lg-6'>
          <fieldset className='scheduler-border'>
            <legend className='scheduler-border'>
              {translate('kpi.kpi_allocation.task_package_management.add_model.task_kpi_detail')}
            </legend>

            <div className='flex'>
              <div className={`form-group w-full ${errors.taskType ? 'has-error' : ''}`}>
                <label className='control-label'>
                  {translate('kpi.kpi_allocation.task_package_management.add_model.goal')}
                  <span className='text-red'>*</span>
                </label>
                <SelectBox
                  id='selectTypeOfStatistic2'
                  className='form-control select2'
                  style={{ width: '100%' }}
                  items={listUnitGoal}
                  onChange={(value) => {
                    setTaskData((prevData) => ({
                      ...prevData,
                      kpiId: value
                    }))
                  }}
                  value={taskData.kpiId}
                  multiple={false}
                  options={{ minimumResultsForSearch: 3 }}
                />
              </div>
            </div>

            <div className='flex'>
              <div className='form-group w-full'>
                <label>
                  {translate(`kpi.kpi_allocation.task_package_management.add_model.weight`)}
                  <span className='text-red'>*</span>
                </label>
                <input
                  type='number'
                  className='form-control'
                  placeholder={translate(`kpi.kpi_allocation.task_package_management.add_model.weight`)}
                  value={taskData.kpiWeight}
                  name='taskWeight'
                  onChange={handleChangeTaskWeight}
                />
              </div>
            </div>
          </fieldset>
        </div>

        <div className='col-lg-6'>
          <fieldset className='scheduler-border'>
            <legend className='scheduler-border'>
              {translate('kpi.kpi_allocation.task_package_management.add_model.resource_requirement')}
            </legend>

            <div className='flex'>
              <div className={`form-group w-full ${errors.taskType ? 'has-error' : ''}`}>
                <label className='control-label'>
                  {translate('kpi.kpi_allocation.task_package_management.add_model.require_certificate')}
                  <span className='text-red'>*</span>
                </label>
                <SelectBox
                  id='user-role-form'
                  className='form-control select2'
                  style={{ width: '100%' }}
                  items={listCertificate}
                  onChange={handleChangeRequireCertificates}
                  value={taskData.requireCertificates}
                  multiple
                />
              </div>
            </div>

            <div className='flex'>
              <div className={`form-group w-full ${errors.taskType ? 'has-error' : ''}`}>
                <label className='control-label'>
                  {translate('kpi.kpi_allocation.task_package_management.add_model.require_major')}
                  <span className='text-red'>*</span>
                </label>
                <SelectBox
                  id='user-role-form1'
                  className='form-control select3'
                  style={{ width: '100%' }}
                  items={listMajor}
                  onChange={handleChangeRequireMajors}
                  value={taskData.requireMajors}
                  multiple
                />
              </div>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  )
}

export default AddTaskPackageModelContent
