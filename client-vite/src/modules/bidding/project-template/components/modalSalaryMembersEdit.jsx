import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { LazyLoadComponent, forceCheckOrVisible, DialogModal } from '../../../../common-components'
import { withTranslate } from 'react-redux-multilingual'
import { convertDepartmentIdToDepartmentName, convertUserIdToUserName, getListDepartments } from './functionHelper'
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper'
import { ProjectTemplateActions } from '../redux/actions'

const ModalSalaryMembersEdit = (props) => {
  const {
    translate,
    responsibleEmployeesWithUnit,
    projectTemplate,
    user,
    createProjectCurrentSalaryMember,
    showInput,
    projectDetail,
    projectDetailId,
    isTasksListEmpty,
    type
  } = props
  const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []
  const [currentSalaryMembers, setCurrentSalaryMembers] = useState(projectTemplate.salaries || [])

  useEffect(() => {
    let newResponsibleEmployeesWithUnit = []
    if (responsibleEmployeesWithUnit.list) {
      for (let employeeItem of responsibleEmployeesWithUnit.list) {
        newResponsibleEmployeesWithUnit.push({
          unitId: employeeItem.unitId,
          listUsers: employeeItem.listUsers.map((item) => ({
            userId: item,
            salary: undefined
          }))
        })
      }
      props.getSalaryMembersOfProjectTemplateDispatch({
        data: {
          responsibleEmployeesWithUnit: createProjectCurrentSalaryMember || newResponsibleEmployeesWithUnit
        }
      })
    }
  }, [createProjectCurrentSalaryMember])

  useEffect(() => {
    setCurrentSalaryMembers(projectTemplate.salaries)
  }, [projectTemplate.salaries])

  const save = () => {
    props.handleSaveCurrentSalaryMember(currentSalaryMembers)
  }

  const isAbleToSave = () => {
    return currentSalaryMembers.length > 0
  }
  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-salary-members-template-${projectDetailId}`}
        isLoading={false}
        formID={`form-salary-members-template-${projectDetailId}`}
        title={`Bảng lương thành viên trong dự án`}
        size={75}
        func={save}
        disableSubmit={!isAbleToSave}
      >
        <div>
          {/* {!type && <p style={{ color: 'red' }}>*Nếu dự án đã có công việc thì không được sửa lương</p>} */}
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
                              {showInput ? (
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
                              ) : (
                                currentSalaryMembers[unitIndex].listUsers[userIndex].salary
                              )}
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
  const { projectTemplate, user, tasks } = state
  return { projectTemplate, user, tasks }
}

const mapDispatchToProps = {
  getSalaryMembersOfProjectTemplateDispatch: ProjectTemplateActions.getSalaryMembersOfProjectTemplateDispatch
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalSalaryMembersEdit))
