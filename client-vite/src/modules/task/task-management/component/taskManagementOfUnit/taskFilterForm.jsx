import React from 'react'
import { DatePicker, InputTags, SelectMulti } from '../../../../../common-components'

function TaskFilterForm({
  translate,
  selectBoxUnit,
  organizationalUnit,
  handleSelectOrganizationalUnit,
  organizationalUnitRole,
  handleSelectOrganizationalUnitRole,
  status,
  handleSelectStatus,
  handleSelectPriority,
  handleSelectSpecial,
  handleChangeName,
  handleChangeResponsibleEmployees,
  handleChangeAccountableEmployees,
  handleChangeCreatorEmployees,
  handleChangeStartDate,
  handleChangeEndDate,
  handleTaskTags,
  tags,
  handleUpdateData
}) {
  return (
    <div id='tasks-filter' className='form-inline' style={{ display: 'none' }}>
      {/* Đơn vị tham gia công việc */}
      <div className='form-group'>
        <label>{translate('task.task_management.department')}</label>
        {selectBoxUnit && selectBoxUnit.length !== 0 && (
          <SelectMulti
            key='multiSelectUnit1'
            id='multiSelectUnit1'
            items={selectBoxUnit.map((item) => ({ value: item.id, text: item.name }))}
            onChange={handleSelectOrganizationalUnit}
            options={{
              nonSelectedText: translate('task.task_management.select_department'),
              allSelectedText: translate('task.task_management.select_all_department')
            }}
            value={organizationalUnit}
          />
        )}
      </div>

      {/* Vai trò đơn vị */}
      <div className='form-group'>
        <label>{translate('task.task_management.role_unit')}</label>
        <SelectMulti
          key='roleUnit'
          id='roleUnit'
          value={organizationalUnitRole}
          items={[
            { value: 'management', text: translate('task.task_management.organizational_unit_management') },
            { value: 'collaboration', text: translate('task.task_management.organizational_unit_collaborate') }
          ]}
          onChange={handleSelectOrganizationalUnitRole}
          options={{
            nonSelectedText: translate('task.task_management.select_role_organizational'),
            allSelectedText: translate('task.task_management.select_all_role')
          }}
        />
      </div>

      {/* Trạng thái công việc */}
      <div className='form-group'>
        <label>{translate('task.task_management.status')}</label>
        <SelectMulti
          id='multiSelectStatus'
          value={status}
          items={[
            { value: 'inprocess', text: translate('task.task_management.inprocess') },
            { value: 'wait_for_approval', text: translate('task.task_management.wait_for_approval') },
            { value: 'finished', text: translate('task.task_management.finished') },
            { value: 'delayed', text: translate('task.task_management.delayed') },
            { value: 'canceled', text: translate('task.task_management.canceled') }
          ]}
          onChange={handleSelectStatus}
          options={{
            nonSelectedText: translate('task.task_management.select_status'),
            allSelectedText: translate('task.task_management.select_all_status')
          }}
        />
      </div>

      {/* Độ ưu tiên công việc */}
      <div className='form-group'>
        <label>{translate('task.task_management.priority')}</label>
        <SelectMulti
          id='multiSelectPriority'
          defaultValue={[
            translate('task.task_management.urgent'),
            translate('task.task_management.high'),
            translate('task.task_management.standard'),
            translate('task.task_management.average'),
            translate('task.task_management.low')
          ]}
          items={[
            { value: '5', text: translate('task.task_management.urgent') },
            { value: '4', text: translate('task.task_management.high') },
            { value: '3', text: translate('task.task_management.standard') },
            { value: '2', text: translate('task.task_management.average') },
            { value: '1', text: translate('task.task_management.low') }
          ]}
          onChange={handleSelectPriority}
          options={{
            nonSelectedText: translate('task.task_management.select_priority'),
            allSelectedText: translate('task.task_management.select_all_priority')
          }}
        />
      </div>

      {/* Đặc tính công việc */}
      <div className='form-group'>
        <label>{translate('task.task_management.special')}</label>
        <SelectMulti
          id='multiSelectCharacteristic'
          defaultValue={[translate('task.task_management.stored'), translate('task.task_management.current_month')]}
          items={[
            { value: 'stored', text: translate('task.task_management.stored') },
            { value: 'currentMonth', text: translate('task.task_management.current_month') },
            { value: 'assigned', text: translate('task.task_management.assigned') },
            { value: 'not_assigned', text: translate('task.task_management.not_assigned') }
          ]}
          onChange={handleSelectSpecial}
          options={{
            nonSelectedText: translate('task.task_management.select_special'),
            allSelectedText: translate('task.task_management.select_all_special')
          }}
        />
      </div>

      {/* Tên công việc */}
      <div className='form-group'>
        <label>{translate('task.task_management.name')}</label>
        <input
          autoComplete='off'
          className='form-control'
          type='text'
          placeholder={translate('task.task_management.search_by_name')}
          name='name'
          onChange={handleChangeName}
        />
      </div>

      {/* Người thực hiện */}
      <div className='form-group'>
        <label>{translate('task.task_management.responsible')}</label>
        <input
          autoComplete='off'
          className='form-control'
          type='text'
          placeholder={translate('task.task_management.search_by_employees')}
          name='name'
          onChange={handleChangeResponsibleEmployees}
        />
      </div>

      {/* Người phê duyệt */}
      <div className='form-group'>
        <label>{translate('task.task_management.accountable')}</label>
        <input
          autoComplete='off'
          className='form-control'
          type='text'
          placeholder={translate('task.task_management.search_by_employees')}
          name='name'
          onChange={handleChangeAccountableEmployees}
        />
      </div>

      {/* Người thiết lập */}
      <div className='form-group'>
        <label>{translate('task.task_management.creator')}</label>
        <input
          autoComplete='off'
          className='form-control'
          type='text'
          placeholder={translate('task.task_management.search_by_employees')}
          name='name'
          onChange={handleChangeCreatorEmployees}
        />
      </div>

      {/* Ngày bắt đầu */}
      <div className='form-group'>
        <label>{translate('task.task_management.start_date')}</label>
        <DatePicker
          id='start-date'
          dateFormat='month-year' // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm
          value='' // giá trị mặc định cho datePicker
          onChange={handleChangeStartDate}
          disabled={false} // sử dụng khi muốn disabled, mặc định là false
        />
      </div>

      {/* Ngày kết thúc */}
      <div className='form-group'>
        <label>{translate('task.task_management.end_date')}</label>
        <DatePicker
          id='end-date'
          dateFormat='month-year' // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm
          value='' // giá trị mặc định cho datePicker
          onChange={handleChangeEndDate}
          disabled={false} // sử dụng khi muốn disabled, mặc định là false
        />
      </div>

      <div className='form-group'>
        <label>Tags</label>
        <InputTags id='task-unit' onChange={handleTaskTags} value={tags} />
      </div>

      <div className='form-group'>
        <label />
        <button type='button' className='btn btn-success' onClick={handleUpdateData}>
          {translate('task.task_management.search')}
        </button>
      </div>
    </div>
  )
}

export default TaskFilterForm
