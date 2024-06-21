import React, { useCallback, useMemo, useState } from 'react'
import { useTranslate } from 'react-redux-multilingual'
import { useSelector } from 'react-redux'
import { DatePicker, ErrorLabel, QuillEditor, SelectBox } from '../../../../common-components'

const initialTaskData = {
  taskName: '',
  taskDescription: '',
  startDate: '',
  endDate: '',
  duration: 0,
  taskValue: 0,
  taskValueUnit: '',
  goalCompanyId: []
}

function MappingTaskTemplateIntoListTasks({ isProcess, onChangeListMappingTask }) {
  const [taskData, setTaskData] = useState(initialTaskData)
  const translate = useTranslate()
  const [errors, setErrors] = useState({})
  const [listTaskData, setListTaskData] = useState([])
  const createKpiUnit = useSelector((state) => state.createKpiUnit)

  const inputFields = useMemo(
    () => [
      { label: 'task_name', value: taskData.taskName, name: 'taskName' },
      { label: 'target', value: taskData.taskValue, name: 'taskValue', type: 'number' },
      { label: 'unit', value: taskData.taskValueUnit, name: 'taskValueUnit' },
      { label: 'duration', value: taskData.duration, name: 'duration', type: 'number' }
    ],
    [taskData]
  )

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }, [])

  const handleChangeDate = useCallback((name, value) => {
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }, [])

  const handleChangeDescription = (value) => {
    setTaskData((prevData) => ({
      ...prevData,
      taskDescription: value
    }))
  }

  const handleAddAction = () => {
    const assignValue = [...listTaskData, taskData]
    setListTaskData(assignValue)
    setTaskData(initialTaskData)
    onChangeListMappingTask(assignValue)
  }

  const handleClearAction = () => {
    setListTaskData([])
  }

  const handleAddGoalCompanyId = useCallback((value) => {
    setTaskData((prevData) => ({
      ...prevData,
      goalCompanyId: value
    }))
  }, [])

  return (
    <div className={`${isProcess ? 'col-lg-12' : 'col-sm-12'}`}>
      <fieldset className='scheduler-border'>
        <legend className='scheduler-border'>Ánh xạ mẫu công việc sang tập nhiệm vụ</legend>
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
        {createKpiUnit?.parent?.kpis?.length !== 0 && (
          <div className='form-group'>
            <label>
              Ánh xạ đến KPI nào?
              <span className='text-red'>*</span>
            </label>
            <SelectBox
              id='select-parent-kpis'
              className='form-control select2'
              style={{ width: '100%' }}
              items={createKpiUnit?.parent?.kpis?.map((x) => ({ value: x._id, text: x.name }))}
              value={taskData.goalCompanyId}
              onChange={handleAddGoalCompanyId}
            />
          </div>
        )}

        <div className={`form-group ${errors.taskDescription ? 'has-error' : ''}`}>
          <label className='control-label'>{translate('kpi.kpi_allocation.task_package_management.add_model.task_description')}</label>
          <QuillEditor
            id='task-add-task-description'
            table={false}
            embeds={false}
            getTextData={(value) => handleChangeDescription(value)}
            maxHeight={180}
            quillValueDefault=''
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

        <div className='pull-right' style={{ marginBottom: '10px' }}>
          <button className='btn btn-success' type='button' style={{ marginLeft: '10px' }} onClick={() => handleAddAction()}>
            {translate('task_template.add')}
          </button>
          <button className='btn btn-primary' type='button' style={{ marginLeft: '10px' }} onClick={() => handleClearAction()}>
            {translate('task_template.delete')}
          </button>
        </div>

        <table className='table table-hover table-striped table-bordered'>
          <thead>
            <tr>
              <th className='col-fixed'>STT</th>
              <th title='Tên nhiệm vụ'>Tên nhiệm vụ</th>
              <th title='Mô tả'>Mô tả nhiệm vụ</th>
              <th title='Khối lượng nhiệm vụ'>Khối lượng nhiệm vụ</th>
              <th title='Đơn vị nhiệm vụ'>Đơn vị nhiệm vụ</th>
              <th title='Ngày bắt đầ'>Ngày bắt đầu</th>
              <th title='Ngày kết thúc'>Ngày kết thúc</th>
              <th title='Thời gian tối đa hoàn thành'>Thời gian tối đa hoàn thành</th>
              <th title='Hành động'>{translate('task_template.action')}</th>
            </tr>
          </thead>

          {typeof listTaskData === 'undefined' || listTaskData.length === 0 ? (
            <tr>
              <td colSpan={9}>
                <center>{translate('task_template.no_data')}</center>
              </td>
            </tr>
          ) : (
            <>
              {listTaskData.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.taskName}</td>
                    <td>{item.taskDescription}</td>
                    <td>{item.taskValue}</td>
                    <td>{item.taskValueUnit}</td>
                    <td>{item.startDate}</td>
                    <td>{item.endDate}</td>
                    <td>{item.duration}</td>
                    <td>
                      <a
                        href='#abc'
                        className='edit'
                        title='Edit'
                        data-toggle='tooltip'
                        // onClick={() => handleEditAction(item, index)}
                      >
                        <i className='material-icons'></i>
                      </a>
                      <a
                        href='#abc'
                        className='delete'
                        title='Delete'
                        data-toggle='tooltip'
                        // onClick={() => handleDeleteAction(index)}
                      >
                        <i className='material-icons'></i>
                      </a>
                    </td>
                  </tr>
                )
              })}
            </>
            // <ReactSortable
            //   animation={500}
            //   tag='tbody'
            //   id='actions'
            //   list={listTaskData}
            //   setList={(newState) => {
            //     props.onDataChange(newState)
            //     setState({ ...state, listTaskData: newState })
            //   }}
            //               />

            //           {listTaskData.map((item, index) => (
            //                               <tr className='' key={`${state.keyPrefix}_${index}`}>
            //   <td>{index + 1}</td>
            //   <td>{parse(item.name)}</td>
            //   <td>{parse(item.description)}</td>
            //   <td>{item.mandatory ? 'Có' : 'Không'}</td>
            //   <td>
            //     <a href='#abc' className='edit' title='Edit' data-toggle='tooltip' onClick={() => handleEditAction(item, index)}>
            //       <i className='material-icons'></i>
            //     </a>
            //     <a href='#abc' className='delete' title='Delete' data-toggle='tooltip' onClick={() => handleDeleteAction(index)}>
            //       <i className='material-icons'></i>
            //     </a>
            //   </td>
            // </tr>
            //           ))}
          )}
        </table>
      </fieldset>
    </div>
  )
}

export default MappingTaskTemplateIntoListTasks
