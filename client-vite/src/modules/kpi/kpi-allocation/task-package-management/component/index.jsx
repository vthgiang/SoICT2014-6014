import React, { useEffect, useState } from 'react'
import { useTranslate } from 'react-redux-multilingual/lib/context'
import { useDispatch, useSelector } from 'react-redux'
import { ExportExcel, PaginateBar, TreeTable } from '../../../../../common-components'
import { getStorage } from '../../../../../config'
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'
import AddTaskComponent from './addTaskComponent'
import { TaskPackageManagementAction } from '../redux/actions'

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
  // const [state, setState] = useState(initState())
  // const { tableId, perPage, currentPage } = state
  const dispatch = useDispatch()
  const listTaskPackages = useSelector((state) => state.kpiAllocation.taskPackageManagementReducer.listTaskPackages)
  const [data, setData] = useState([])

  useEffect(() => {
    dispatch(TaskPackageManagementAction.getTaskPackagesData())
  }, [dispatch])

  useEffect(() => {
    const convertData = listTaskPackages.map((item) => {
      return {
        task_type: item.taskTypeId.name,
        name: item?.name,
        description: item?.description,
        target: item?.target,
        unit: item?.unit,
        kpi_metric: item?.organizationalUnitKpi?.name,
        weight: item?.weight,
        start_date: item?.startDate,
        end_date: item?.endDate,
        duration: `${item?.durations} Giờ`
      }
    })
    setData(convertData)
  }, [listTaskPackages])

  const column = [
    { name: translate('kpi.kpi_allocation.task_package_management.table.task_type'), key: 'task_type' },
    { name: translate('kpi.kpi_allocation.task_package_management.table.name'), key: 'name' },
    { name: translate('kpi.kpi_allocation.task_package_management.table.description'), key: 'description' },
    { name: translate('kpi.kpi_allocation.task_package_management.table.target'), key: 'target' },
    { name: translate('kpi.kpi_allocation.task_package_management.table.unit'), key: 'unit' },
    { name: translate('kpi.kpi_allocation.task_package_management.table.kpi_metric'), key: 'kpi_metric' },
    { name: translate('kpi.kpi_allocation.task_package_management.table.weight'), key: 'weight' },
    { name: translate('kpi.kpi_allocation.task_package_management.table.start_date'), key: 'start_date' },
    { name: translate('kpi.kpi_allocation.task_package_management.table.end_date'), key: 'end_date' },
    { name: translate('kpi.kpi_allocation.task_package_management.table.duration'), key: 'duration' }
    // { name: translate('kpi.kpi_allocation.task_package_management.table.pre_tasks'), key: 'pre_tasks' },
    // { name: translate('kpi.kpi_allocation.task_package_management.table.sub_tasks'), key: 'sub_tasks' },
    // { name: translate('kpi.kpi_allocation.task_package_management.table.requirements'), key: 'requirements' },
    // { name: translate('kpi.kpi_allocation.task_package_management.table.affected_factors'), key: 'affected_factors' }
  ]

  return (
    <>
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
                <button
                  type='button'
                  onClick={() => {
                    window.$('#addNewTaskPackage').modal('show')
                  }}
                  className='btn btn-success dropdown-toggler'
                  data-toggle='dropdown'
                  aria-expanded='true'
                  title='Thêm'
                >
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
          </div>

          {/* Dạng bảng */}
          <div id='tree-table-container' style={{ marginTop: '20px' }}>
            <TreeTable
              tableId='tree-table-task-package-management'
              tableSetting
              allowSelectAll
              // behaviour='show-children'
              column={column}
              data={data}
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
          </div>

          <PaginateBar
          // display={tasks.tasks?.length}
          // total={tasks.totalCount}
          // pageTotal={tasks.pages}
          // currentPage={currentPage}
          // func={handleGetDataPagination}
          />
        </div>
      </div>
      <AddTaskComponent />
    </>
  )
}

export default TaskPackageManagement
