import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { LazyLoadComponent, forceCheckOrVisible, DialogModal } from '../../../../common-components'
import { withTranslate } from 'react-redux-multilingual'
import { ProjectTemplateActions } from '../redux/actions'
import { convertDepartmentIdToDepartmentName, convertUserIdToUserName } from './functionHelper'
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper'

const ModalSalaryMembers = (props) => {
  const { translate, responsibleEmployeesWithUnit, projectTemplate, user, createProjectCurrentSalaryMember } = props
  const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []
  const [currentSalaryMembers, setCurrentSalaryMembers] = useState(projectTemplate.salaries || [])

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
    props.getSalaryMembersOfProjectTemplateDispatch({
      data: {
        responsibleEmployeesWithUnit: createProjectCurrentSalaryMember || newResponsibleEmployeesWithUnit
      }
    })
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
        modalID={`modal-salary-members-template--prj-template`}
        isLoading={false}
        formID={`form-salary-members-template-prj-template`}
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
  const { projectTemplate, user } = state
  return { projectTemplate, user }
}

const mapDispatchToProps = {
  editProjectTemplateDispatch: ProjectTemplateActions.editProjectTemplateDispatch,
  getSalaryMembersOfProjectTemplateDispatch: ProjectTemplateActions.getSalaryMembersOfProjectTemplateDispatch
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ModalSalaryMembers))
