import React, { useState, useEffect, memo } from 'react'
import { connect } from 'react-redux'
import { DataTableSetting } from '../../../../common-components'
import { withTranslate } from 'react-redux-multilingual'
import { UserActions } from '../../../super-admin/user/redux/actions'
import { getStorage } from '../../../../config'
import { performTaskAction } from '../../../task/task-perform/redux/actions'
import Swal from 'sweetalert2'
import { convertUserIdToUserName, getListDepartments } from './functionHelper'

const TableTasksProjectTemplate = (props) => {
  const tableId = 'tasks-project-table'
  // const currentProjectId = window.location.href.split('?id=')[1].split('#')?.[0];
  const userId = getStorage('userId')
  const { translate, user, tasks, currentProjectTasks, listUsers } = props
  let units = []
  if (user) units = user.organizationalUnitsOfUser

  useEffect(() => {
    props.getAllUserInAllUnitsOfCompany()
  }, [])

  // const handleShowDetailInfo = (id) => {
  //     setState(state => {
  //         return {
  //             ...state,
  //             currentTaskId: id
  //         }
  //     })
  // }

  // const processPreceedingTasks = (preceedingTasks) => {
  //     if (!currentProjectTasks || preceedingTasks.length === 0) return '';
  //     const resultArr = preceedingTasks.map(preceedingTaskItem => {
  //         return currentProjectTasks.find(item => item._id === preceedingTaskItem.task)?.name;
  //     })
  //     return resultArr.join(", ");
  // }

  return (
    <React.Fragment>
      {/* {
                currentTaskId ? <ModalPerform
                    units={units}
                    id={currentTaskId}
                /> : null
            } */}

      <table id={tableId} className='table table-striped table-bordered table-hover'>
        <thead>
          <tr>
            <th>{translate('task.task_management.col_name')}</th>
            <th>{translate('project.task_management.preceedingTask')}</th>
            <th>{translate('task.task_management.responsible')}</th>
            <th>{translate('task.task_management.accountable')}</th>
            <th>Thời gian ước lượng</th>
            <th>Thời lượng thỏa hiệp</th>
            <th>Số ngày thực hiện dự kiến</th>
            <th>Trọng số người thực hiện</th>
            <th style={{ width: '120px', textAlign: 'center' }}>
              {translate('table.action')}
              <DataTableSetting
                tableId={tableId}
                columnArr={[
                  translate('task.task_management.col_name'),
                  translate('project.task_management.preceedingTask'),
                  translate('task.task_management.responsible'),
                  translate('task.task_management.accountable'),
                  'Thời gian ước lượng',
                  'Thời lượng thỏa hiệp',
                  'Số ngày thực hiện dự kiến',
                  'Trọng số người thực hiện'
                ]}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {currentProjectTasks &&
            currentProjectTasks.length !== 0 &&
            currentProjectTasks.map((taskItem, index) => (
              <tr key={index}>
                <td style={{ color: '#385898' }}>{taskItem?.name}</td>
                <td style={{ maxWidth: 350 }}>{taskItem?.preceedingTasks}</td>
                {/* <td style={{ maxWidth: 350 }}>{processPreceedingTasks(taskItem?.preceedingTasks)}</td> */}
                <td>{taskItem?.responsibleEmployees.map((o) => convertUserIdToUserName(listUsers, o)).join(', ')}</td>
                <td>{taskItem?.accountableEmployees?.map((o) => convertUserIdToUserName(listUsers, o)).join(', ')}</td>
                <td style={{ textAlign: 'center' }}>
                  <a className='edit text-yellow' style={{ width: '5px' }}>
                    <i className='material-icons'>edit</i>
                  </a>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* PaginateBar */}
      {currentProjectTasks && currentProjectTasks.length === 0 && <div className='table-info-panel'>{translate('confirm.no_data')}</div>}
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { user, tasks, performtasks } = state
  return { user, tasks, performtasks }
}

const mapDispatchToProps = {
  getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
  startTimer: performTaskAction.startTimerTask
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(TableTasksProjectTemplate))
