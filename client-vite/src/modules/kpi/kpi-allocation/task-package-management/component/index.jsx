import React, { useEffect, useState } from 'react'
import { useTranslate } from 'react-redux-multilingual/lib/context'
import { useDispatch } from 'react-redux'
import { ExportExcel, PaginateBar, TreeTable } from '../../../../../common-components'
import { getStorage } from '../../../../../config'
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'
import { TaskPackageManagementService } from '../redux/services'

const initState = () => {
  const userId = getStorage('userId')
  const tableId = 'tree-table-task-package-management'
  const defaultConfig = { limit: 20, hidenColumns: ['3', '4', '5', '8', '9'] }

  const { limit } = getTableConfiguration(tableId, defaultConfig)

  return {
    perPage: limit,
    currentPage: 1,
    tableId
  }
}

function TaskPackageManagement() {
  const translate = useTranslate()
  const [state, setState] = useState(initState())
  const { tableId, perPage, currentPage } = state
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(TaskPackageManagementService.getTaskPackagesData())
  }, [dispatch])

  const column = [
    { name: translate('kpi.kpi_allocation.task_package_management.table.task_type'), key: 'task_type' },
    { name: translate('kpi.kpi_allocation.task_package_management.table.description'), key: 'description' },
    { name: translate('kpi.kpi_allocation.task_package_management.table.target'), key: 'target' },
    { name: translate('kpi.kpi_allocation.task_package_management.table.unit'), key: 'unit' },
    { name: translate('kpi.kpi_allocation.task_package_management.table.kpi_metric'), key: 'kpi_metric' },
    { name: translate('kpi.kpi_allocation.task_package_management.table.weight'), key: 'weight' }
  ]

  return (
    <div className='box'>
      <div className='box-body qlcv'>
        <div style={{ height: '40px', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <button
              className='btn btn-primary'
              type='button'
              style={{ marginLeft: 10, backgroundColor: 'transparent', borderRadius: '4px', color: '#367fa9' }}
              onClick={() => {
                window.$('#tasks-filter').slideToggle()
              }}
            >
              <i className='fa fa-filter' /> Lọc
            </button>
          </div>

          <div style={{ display: 'flex', marginBottom: 6 }}>
            <div className='dropdown'>
              <button type='button' className='btn btn-success dropdown-toggler' data-toggle='dropdown' aria-expanded='true' title='Thêm'>
                {translate('task_template.add')}
              </button>
            </div>

            <ExportExcel
              id='list-task-employee'
              buttonName='Xuất thông tin excel'
              // exportData={exportData}
              style={{ marginLeft: '10px' }}
            />
          </div>

          {/* <TaskManagementImportForm /> */}
          {/* <TaskAddModal currentTasks={currentTasks && currentTasks.length !== 0 && list_to_tree(currentTasks)} parentTask={parentTask} /> */}
        </div>

        {/* <div className='form-inline' style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            // disabled={!validateAction('delete')}
            style={{ margin: '5px' }}
            type='button'
            className='btn btn-danger pull-right'
            title={translate('general.delete_option')}
            // onClick={() => handleDelete(selectedData)}
          >
            {translate('general.delete_option')}
          </button>
          <button
            // disabled={!(validateAction('store') || validateAction('restore'))}
            style={{ margin: '5px' }}
            type='button'
            className='btn btn-info pull-right'
            title={translate('task.task_management.edit_status_archived_of_task')}
            // onClick={() => handleStore(selectedData)}
          >
            {translate('task.task_management.edit_status_archived_of_task')}
          </button>
        </div> */}

        {/* <div id='tasks-filter' className='form-inline' style={{ display: 'none' }}>
          <div className='form-group'>
            <label>{translate('task.task_management.department')}</label>
            {units && (
              <SelectMulti
                id='multiSelectUnit1'
                defaultValue={units.map((item) => item._id)}
                items={units.map((item) => {
                  return { value: item._id, text: item.name }
                })}
                onChange={handleSelectOrganizationalUnit}
                options={{
                  nonSelectedText: translate('task.task_management.select_department'),
                  allSelectedText: translate(`task.task_management.select_all_department`)
                }}
              />
            )}
          </div>
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

          <div className='form-group'>
            <label>{translate('task.task_management.name')}</label>
            <input
              className='form-control'
              type='text'
              placeholder={translate('task.task_management.search_by_name')}
              name='name'
              onChange={(e) => handleChangeName(e)}
            />
          </div>

          <div className='form-group'>
            <label>{translate('task.task_management.special')}</label>
            <SelectMulti
              id='multiSelectCharacteristic'
              defaultValue={[translate('task.task_management.store'), translate('task.task_management.current_month')]}
              items={[
                { value: 'stored', text: translate('task.task_management.stored') },
                { value: 'currentMonth', text: translate('task.task_management.current_month') },
                { value: 'request_to_close', text: 'Chưa phê duyệt kết thúc' }
              ]}
              onChange={handleSelectSpecial}
              options={{
                nonSelectedText: translate('task.task_management.select_special'),
                allSelectedText: translate('task.task_management.select_all_special')
              }}
            />
          </div>

          <div className='form-group'>
            <label>{translate('task.task_management.role')}</label>
            <SelectMulti
              id='select-task-role'
              items={[
                { value: 'responsible', text: translate('task.task_management.responsible') },
                { value: 'accountable', text: translate('task.task_management.accountable') },
                { value: 'consulted', text: translate('task.task_management.consulted') },
                { value: 'creator', text: translate('task.task_management.creator') },
                { value: 'informed', text: translate('task.task_management.informed') }
              ]}
              value={currentTab}
              onChange={handleRoleChange}
              options={{
                nonSelectedText: translate('task.task_management.select_role'),
                allSelectedText: translate('task.task_management.select_all_role')
              }}
            />
          </div>

          <div className='form-group'>
            <label>{translate('task.task_management.col_project')}</label>
            {listProject && (
              <SelectBox
                id='select-project-search'
                className='form-control select2'
                style={{ width: '100%' }}
                items={listProject}
                value={projectSearch}
                onChange={handleSelectTaskProject}
                multiple
                options={{ placeholder: 'Chọn dự án' }}
              />
            )}
          </div>

          <div className='form-group'>
            <label>{translate('task.task_management.responsible')}</label>
            <input
              className='form-control'
              type='text'
              placeholder={translate('task.task_management.search_by_employees')}
              name='name'
              onChange={(e) => handleChangeResponsibleEmployees(e)}
            />
          </div>

          <div className='form-group'>
            <label>{translate('task.task_management.accountable')}</label>
            <input
              className='form-control'
              type='text'
              placeholder={translate('task.task_management.search_by_employees')}
              name='name'
              onChange={(e) => handleChangeAccountableEmployees(e)}
            />
          </div>

          <div className='form-group'>
            <label>{translate('task.task_management.creator')}</label>
            <input
              className='form-control'
              type='text'
              placeholder={translate('task.task_management.search_by_employees')}
              name='name'
              onChange={(e) => handleChangeCreatorEmployees(e)}
            />
          </div>

          <div className='form-group'>
            <label>{translate('task.task_management.start_date')}</label>
            <DatePicker id='start-date' dateFormat='month-year' value='' onChange={handleChangeStartDate} disabled={false} />
          </div>

          <div className='form-group'>
            <label>{translate('task.task_management.end_date')}</label>
            <DatePicker id='end-date' dateFormat='month-year' value='' onChange={handleChangeEndDate} disabled={false} />
          </div>

          <div className='form-group'>
            <label>{translate('task.task_management.creator_time')}</label>
            <SelectBox
              id='multiSelectCreatorTime'
              className='form-control select2'
              style={{ width: '100%' }}
              items={[
                { value: '', text: '--- Chọn ---' },
                { value: 'currentMonth', text: translate('task.task_management.current_month') },
                { value: 'currentWeek', text: translate('task.task_management.current_week') }
              ]}
              value={creatorTime}
              onChange={handleSelectCreatorTime}
              options={{ minimumResultsForSearch: 100 }}
            />
          </div>

          <div className='form-group'>
            <label>Tags</label>
            <InputTags id='task-personal' onChange={handleTaskTags} value={tags} />
          </div>

          <div className='form-group'>
            <label />
            <button type='button' className='btn btn-success' onClick={() => handleUpdateData()}>
              {translate('task.task_management.search')}
            </button>
          </div>
        </div> */}

        {/* {currentTaskId && <ModalPerform units={units} id={currentTaskId} taskName={state?.taskName ? state?.taskName : ''} />}

        {currentTaskIdAttribute && state.attributes && (
          <AddAttributeForm
            handleChangeAddRowAttribute={handleChangeAddRowAttribute}
            i={state.i}
            id={state.currentTaskIdAttribute}
            attributeOwner='taskAttributes'
            translation='manage_policy.task'
            taskID={state.currentTaskIdAttribute}
            taskAttributes={state.attributes}
          />
        )} */}

        {/* {user && user.organizationalUnitsOfUser && currentTaskIdDelegation && (
          <TaskDelegation id={currentTaskIdDelegation} taskId={currentTaskIdDelegation} taskName={state.taskNameDelegation} />
        )} */}
        {/* Dạng bảng */}
        <div id='tree-table-container' style={{ marginTop: '20px' }}>
          <TreeTable
            tableId={tableId}
            tableSetting
            allowSelectAll
            behaviour='show-children'
            column={column}
            data={[]}
            // onSetNumberOfRowsPerPage={setLimit}
            // onSelectedRowsChange={onSelectedRowsChange}
            viewWhenClickName
            titleAction={{
              view: '',
              edit: '',
              delete: ''
            }}
            // funcEdit={handleShowModal}
            // funcAdd={handleAddTask}
            // funcStartTimer={startTimer}
            // funcStore={handleStore}
            // funcDelete={handleDelete}
            // funcAddAttribute={handleAddAttribute}
            // funcDelegate={handleDelegate}
          />
          {/* {tasks?.loadingPaginateTasks ? (
            <div className='table-info-panel'>{translate('general.loading')}</div>
          ) : (
            <TreeTable
              tableId={tableId}
              tableSetting
              allowSelectAll
              behaviour='show-children'
              column={column}
              data={data || []}
              onSetNumberOfRowsPerPage={setLimit}
              onSelectedRowsChange={onSelectedRowsChange}
              viewWhenClickName
              titleAction={{
                edit: translate('task.task_management.action_edit'),
                delete: translate('task.task_management.action_delete'),
                store: translate('task.task_management.action_store'),
                restore: translate('task.task_management.action_restore'),
                add: translate('task.task_management.action_add'),
                startTimer: translate('task.task_management.action_start_timer'),
                addAttribute: translate('task.task_management.action_add_attribute'),
                delegate: translate('task.task_management.action_delegate')
              }}
              funcEdit={handleShowModal}
              funcAdd={handleAddTask}
              funcStartTimer={startTimer}
              funcStore={handleStore}
              funcDelete={handleDelete}
              funcAddAttribute={handleAddAttribute}
              funcDelegate={handleDelegate}
            />
          )} */}
        </div>

        {/* <div id='tasks-list' style={{ display: 'none', marginTop: '30px' }}>
          {tasks?.loadingPaginateTasks ? (
            <span>{translate('general.loading')}</span>
          ) : currentTasks?.length ? (
            <TaskListView
              data={state.currentTasks}
              project={project}
              funcEdit={handleShowModal}
              funcAdd={handleAddTask}
              funcStartTimer={startTimer}
              funcStore={handleStore}
              funcDelete={handleDelete}
            />
          ) : (
            <span>{translate('confirm.no_data')}</span>
          )}
        </div> */}

        <PaginateBar
        // display={tasks.tasks?.length}
        // total={tasks.totalCount}
        // pageTotal={tasks.pages}
        // currentPage={currentPage}
        // func={handleGetDataPagination}
        />
      </div>
    </div>
  )
}

export default TaskPackageManagement
