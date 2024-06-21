import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { LazyLoadComponent, forceCheckOrVisible, DialogModal } from '../../../../common-components'
import { withTranslate } from 'react-redux-multilingual'
import { ProjectActions } from '../redux/actions'
import { formatDate, formatFullDate } from '../../../../helpers/formatDate'
import TableTasksProject from './tableTasksProject'
import GanttTasksProject from './ganttTasksProject'
import KanbanTasksProject from './kanbanTasksProject'
import CpmTasksProject from './cpmTasksProject'
import moment from 'moment'
import { convertDepartmentIdToDepartmentName, convertUserIdToUserName, getListDepartments } from './functionHelper'
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper'
import { numberWithCommas } from '../../../task/task-management/component/functionHelpers'

const ModalSalaryMembers = (props) => {
  const { translate, responsibleEmployeesWithUnit, project, user, createProjectCurrentSalaryMember, modalID } = props
  const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []
  const [currentSalaryMembers, setCurrentSalaryMembers] = useState(project.salaries || [])

  useEffect(() => {
    let newResponsibleEmployeesWithUnit = []
    for (let employeeItem of responsibleEmployeesWithUnit.list) {
      newResponsibleEmployeesWithUnit.push({
        unitId: employeeItem.unitId,
        listUsers: employeeItem.listUsers.map((item) => ({
          userId: item,
          salary: undefined
        }))
      })
    }
    responsibleEmployeesWithUnit.list.length > 0 &&
      props.getSalaryMembersDispatch({
        data: {
          responsibleEmployeesWithUnit: createProjectCurrentSalaryMember || newResponsibleEmployeesWithUnit
        }
      })
  }, [createProjectCurrentSalaryMember])

  useEffect(() => {
    setCurrentSalaryMembers(project.salaries)
  }, [project.salaries])

  const save = () => {
    props.handleSaveCurrentSalaryMember(currentSalaryMembers)
  }

  const isAbleToSave = () => {
    return currentSalaryMembers.length > 0
  }

  return (
    <React.Fragment>
      <DialogModal
        modalID={modalID ? modalID : `modal-salary-members`}
        isLoading={false}
        formID={`form-salary-members`}
        title={`Bảng lương thành viên trong dự án`}
        size={75}
        func={save}
        disableSubmit={!isAbleToSave}
      >
        <div>
          <div className='box'>
            <div className='box-body qlcv'>
              <h3>
                <strong>Bảng lương các thành viên trong dự án</strong>
              </h3>
              <table id='salary-members-table' className='table table-bordered table-hover'>
                <thead>
                  <tr>
                    <th>Thuộc đơn vị</th>
                    <th>Họ và tên</th>
                    <th>Lương tháng</th>
                  </tr>
                </thead>
                {currentSalaryMembers.length > 0 && (
                  <tbody>
                    {currentSalaryMembers.map((unitItem, unitIndex) => {
                      return unitItem?.listUsers?.map((userItem, userIndex) => {
                        return (
                          <tr key={`${unitItem.id}-${userItem.userId}`}>
                            <td>
                              {userIndex === 0 ? convertDepartmentIdToDepartmentName(user.usersInUnitsOfCompany, unitItem.unitId) : ''}
                            </td>
                            <td>{convertUserIdToUserName(listUsers, userItem.userId)}</td>
                            <td>
                              <input
                                type='number'
                                value={currentSalaryMembers[unitIndex].listUsers[userIndex].salary}
                                onChange={(e) => {
                                  const newCurrentSalaryMembers = currentSalaryMembers.map((unItem, unIndex) => {
                                    return {
                                      unitId: unItem.unitId,
                                      listUsers: unItem?.listUsers?.map((usItem, usIndex) => {
                                        if (unitIndex === unIndex && userIndex === usIndex) {
                                          return {
                                            ...usItem,
                                            salary: Number(e.target.value)
                                          }
                                        }
                                        return usItem
                                      })
                                    }
                                  })
                                  setCurrentSalaryMembers(newCurrentSalaryMembers)
                                }}
                              />
                            </td>
                            {/* <td>{numberWithCommas(userItem.salary)}</td> */}
                          </tr>
                        )
                      })
                    })}
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
      </DialogModal>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { project, user } = state
  return { project, user }
}

const mapDispatchToProps = {
  editProjectDispatch: ProjectActions.editProjectDispatch,
  getSalaryMembersDispatch: ProjectActions.getSalaryMembersDispatch
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalSalaryMembers))
