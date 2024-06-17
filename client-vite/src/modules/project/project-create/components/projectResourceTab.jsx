import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { withTranslate } from "react-redux-multilingual"
import getEmployeeSelectBoxItems, { getEmployeeSelectBoxItemsWithEmployeeData } from "../../../task/organizationalUnitHelper"
import { convertDepartmentIdToDepartmentName, convertUserIdToUserName, getListDepartments } from "../../projects/components/functionHelper"
import { DialogModal, ErrorLabel, SelectBox } from "../../../../common-components"
import ValidationHelper from "../../../../helpers/validationHelper"
import ModalSalaryMembers from "../../projects/components/modalSalaryMembers"
import { convertAssetIdToAssetName, convertGroupAsset, getAssetSelectBoxItems, getListAssetGroups, getListAssetTypes } from "../../../../helpers/assetHelper"


const ProjectResourcesTab = (props) => {
  const {
    translate,
    user, assetsManager,
    projectMembers, setProjectMembers, projectAssets, setProjectAssets, 
    actionType, projectId
  } = props
  const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItemsWithEmployeeData(user.usersInUnitsOfCompany) : []
  const listDepartments = user && user.usersInUnitsOfCompany ? getListDepartments(user.usersInUnitsOfCompany) : []
  const [currentSalaryMembers, setCurrentSalaryMembers] = useState([])
  const listAssets = assetsManager && assetsManager?.listAssets?.length > 0 ? getAssetSelectBoxItems(assetsManager?.listAssets, translate) : []
  const listAssetGroups = assetsManager && assetsManager?.listAssets?.length > 0 ? getListAssetGroups(assetsManager?.listAssets, translate) : []

  // console.log("listUsers: ", listUsers)

  const {
    managers,
    employees,
    errorManagers,
    errorEmployees,
    employeesWithUnit,
  } = projectMembers

  const {
    assets,
    errorAssets,
    assetsWithGroup,
  } = projectAssets


   // Thay đổi người quản lý dự án
  const handleChangeProjectManager = (value) => {
    validateProjectManager(value, true)
  }
  const validateProjectManager = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateArrayLength(translate, value)

    if (willUpdateState) {
      setProjectMembers({
        ...projectMembers,
        managers: value,
        errorManagers: message
      })
    }
    return message === undefined
  }

  // Xoá thành viên tham gia
  const handleDeleteRow = (index) => {
    if (employeesWithUnit.list && employeesWithUnit.list.length > 0) {
      const cloneArr = [...employeesWithUnit.list]
      cloneArr.splice(index, 1)
      let { message } = ValidationHelper.validateArrayLength(props.translate, cloneArr)
      employeesWithUnit.list.splice(employeesWithUnit.list.length - 1, 1);

      setProjectMembers({
        ...projectMembers,
        employeesWithUnit: {
          ...employeesWithUnit,
          list: cloneArr,
          currentUnitRow: '',
          currentEmployeeRow: []
        },
        errorEmployees: message
      })
    }
  }

  // Thêm thành viên tham gia
  const handleAddRow = () => {
    if (employeesWithUnit.currentEmployeeRow.length > 0) {
      // Đề phòng user không chọn gì thì lấy default là Ban giám đốc
      const currentChosenUnitRow = employeesWithUnit.currentUnitRow || listDepartments[0]?.value
      const isUnitAlreadyExistedInArr = employeesWithUnit.list.find((item) => {
        return currentChosenUnitRow === item.unitId
      })
      const oldListRow = employeesWithUnit.list
      // Nếu unit đã có trong array rồi
      if (isUnitAlreadyExistedInArr) {
        let newListRow = oldListRow.map((oldListRowItem) => {
          if (String(oldListRowItem.unitId) === String(isUnitAlreadyExistedInArr.unitId)) {
            let currentListUsers = oldListRowItem.listUsers
            for (let currentEmployeeRowItem of employeesWithUnit.currentEmployeeRow) {
              if (!currentListUsers.includes(currentEmployeeRowItem)) {
                currentListUsers.push(currentEmployeeRowItem)
              }
            }
            return {
              unitId: oldListRowItem.unitId,
              listUsers: currentListUsers
            }
          }
          return oldListRowItem
        })
        setProjectMembers({
          ...projectMembers,
          employeesWithUnit: {
            ...employeesWithUnit,
            list: [...newListRow],
            currentUnitRow: '',
            currentEmployeeRow: []
          },
          errorEmployees: undefined
        })
      } else {
        const newListRow = [
          ...oldListRow,
          {
            unitId: currentChosenUnitRow,
            listUsers: employeesWithUnit.currentEmployeeRow
          }
        ]
        setProjectMembers({
          ...projectMembers,
          employeesWithUnit: {
            ...employeesWithUnit,
            list: [...newListRow],
            currentUnitRow: '',
            currentEmployeeRow: []
          },
          errorEmployees: undefined
        })
      }
    }
  }


  useEffect(() => {
    let newEmployeesWithUnit = []
    for (let i = 0; i < employeesWithUnit.list.length; i++) {
      newEmployeesWithUnit.push({
        unitId: employeesWithUnit.list[i].unitId,
        listUsers: employeesWithUnit.list[i].listUsers.map((item, index) => ({
          userId: item,
          salary: currentSalaryMembers?.[i]?.listUsers?.[index]?.salary
        }))
      })
    }
    setCurrentSalaryMembers(newEmployeesWithUnit)
    // setProjectAssets({
    //   ...projectAssets,
    //   assetsWithGroup: {
    //     ...assetsWithGroup,
    //     currentGroupRow: listAssetGroups[0]
    //   }
    // })
  }, [employeesWithUnit.list])

  const handleOpenModalSalaryMembers = (e) => {
    e.preventDefault()
    setTimeout(() => {
      window.$('#test-modal').modal('show')
    }, 10)
  }

  const handleSaveCurrentSalaryMember = (data) => {
    setCurrentSalaryMembers(data)
  }

  const handleDeleteAssetRow = (index) => {
    if (assetsWithGroup.list && assetsWithGroup.list?.length > 0) {
      const cloneArr = [...assetsWithGroup.list]
      cloneArr.splice(index, 1)
      let { message } = ValidationHelper.validateArrayLength(props.translate, cloneArr)
      // assetsWithGroup.list.splice(assetsWithGroup.list.length - 1, 1)
      setProjectAssets({
        ...projectAssets,
        assetsWithGroup: {
          ...assetsWithGroup,
          list: cloneArr,
          currentGroupRow: '',
          currentAssetRow: []
        },
        errorAssets: message
      })
    }
  }

  const handleAddAssetRow = () => {
    if (assetsWithGroup?.currentAssetRow?.length > 0) {
      //
      const currentChosenGroupRow = assetsWithGroup.currentGroupRow || listAssetGroups[0]?.value
      const isGroupAlreadyExistedInArr = assetsWithGroup.list.find((item) => currentChosenGroupRow === item.group)
      const oldListRow = assetsWithGroup.list

      if (isGroupAlreadyExistedInArr) {
        let newListRow = oldListRow.map((oldListRowItem) => {
          if (oldListRowItem.group === isGroupAlreadyExistedInArr.group) {
            let currentListAssets = oldListRowItem.listAssets
            for (let currentAssetRowItem of assetsWithGroup.currentAssetRow) {
              if (!currentListAssets.includes(currentAssetRowItem)) {
                currentListAssets.push(currentAssetRowItem)
              }
            }
            return {
              group: oldListRowItem.group,
              listAssets: currentListAssets
            }
          }
          return oldListRowItem
        })
        setProjectAssets({
          ...projectAssets,
          assetsWithGroup: {
            ...assetsWithGroup,
            list: newListRow,
            currentGroupRow: '',
            currentAssetRow: []
          },
          errorAssets: undefined
        })
      } else {
        const newListRow = [
          ...oldListRow,
          {
            group: currentChosenGroupRow,
            listAssets: assetsWithGroup.currentAssetRow
          }
        ]
        setProjectAssets({
          ...projectAssets,
          assetsWithGroup: {
            ...assetsWithGroup,
            list: newListRow,
            currentGroupRow: '',
            currentAssetRow: []
          },
          errorAssets: undefined
        })
      }
    }

  }

  return (
    <React.Fragment>
      <div className="py-12">
        <ModalSalaryMembers
          modalID={'test-modal'}
          createProjectCurrentSalaryMember={currentSalaryMembers}
          responsibleEmployeesWithUnit={employeesWithUnit}
          handleSaveCurrentSalaryMember={handleSaveCurrentSalaryMember}
        />
        <div className="col-lg-6 col-md-12">
          <fieldset className="scheduler-border">
            <legend>Nhân lực</legend>
            {/* Người quản trị dự án */}
            <div className={`form-group ${!errorManagers ? '' : 'has-error'}`}>
              <label>
                {translate('project.manager')}
                <span className='text-red'>*</span>
              </label>
              {listUsers && (
                <SelectBox
                  id={`${actionType}-select-project-manager-${projectId}`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  items={listUsers}
                  onChange={handleChangeProjectManager}
                  value={managers}
                  multiple={true}
                />
              )}
              <ErrorLabel content={errorManagers} />
            </div>
            
            {/* Thành viên tham gia dự án */}
            <div className={`form-group ${!errorEmployees ? '' : 'has-error'}`}>
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <label>
                  {translate('project.member')}
                  <span className='text-red'>*</span>
                </label>
                {/* <button className='btn-link' onClick={handleOpenModalSalaryMembers}>
                  Xem chi tiết lương nhân viên
                </button> */}
              </div>
              <ErrorLabel content={errorEmployees} />
              <table id='project-table' className='table table-striped table-bordered table-hover'>
                <thead>
                  <tr>
                    <th className="w-[45%]">Thuộc đơn vị</th>
                    <th className="w-2/5">Thành viên tham gia</th>
                    <th className="w-[15%]">{translate('task_template.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {employeesWithUnit.list &&
                    employeesWithUnit.list.length > 0 &&
                    employeesWithUnit.list.map((item, index) => (
                      <tr key={index}>
                        <td>{convertDepartmentIdToDepartmentName(user.usersInUnitsOfCompany, item?.unitId)}</td>
                        <td>{item?.listUsers.map((userItem) => convertUserIdToUserName(listUsers, userItem)).join(', ')}</td>
                        <td>
                          <a className='delete' title={translate('general.delete')} onClick={() => handleDeleteRow(index)}>
                            <i className='material-icons'>delete</i>
                          </a>
                        </td>
                      </tr>
                    ))}
                  <tr key={`add-task-input-${employeesWithUnit.list.length}`}>
                    <td>
                      <div className={`form-group`}>
                        {listDepartments && listDepartments.length > 0 && (
                          <SelectBox
                            id={`${actionType}-create-project-${projectId}-${employeesWithUnit.list.length}-${employeesWithUnit?.currentUnitRow}`}
                            className='form-control select2'
                            style={{ width: '100%' }}
                            items={listDepartments}
                            onChange={(e) => {
                              setProjectMembers({
                                ...projectMembers,
                                employeesWithUnit: {
                                  ...employeesWithUnit,
                                  currentUnitRow: e[0]
                                }
                              })
                            }}
                            value={employeesWithUnit.currentUnitRow}
                            multiple={false}
                          />
                        )}
                      </div>
                    </td>
                    <td style={{ maxWidth: 250 }}>
                      <div className={`form-group`}>
                        {listDepartments && listDepartments.length > 0 && (
                          <SelectBox
                            id={`${actionType}-select-project-members-${projectId}`}
                            className='form-control select2'
                            style={{ width: '100%' }}
                            items={listUsers.filter(
                              (item) =>
                                item.text ===
                                convertDepartmentIdToDepartmentName(
                                  user.usersInUnitsOfCompany,
                                  employeesWithUnit.currentUnitRow || listDepartments[0]?.value
                                )
                            )}
                            onChange={(e) => {
                              setProjectMembers({
                                ...projectMembers,
                                employeesWithUnit: {
                                  ...employeesWithUnit,
                                  currentEmployeeRow: e
                                }
                              })
                            }}
                            value={employeesWithUnit.currentEmployeeRow}
                            multiple={true}
                            options={{
                              placeholder: "--- Chọn thành viên ---"
                            }}
                          />
                        )}
                      </div>
                    </td>
                    <td>
                      <a className='save text-green' title={translate('general.save')} onClick={handleAddRow}>
                        <i className='material-icons'>add_circle</i>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </fieldset>
        </div>

        {/* Thiết bị */}
        <div className="col-lg-6 col-md-12">
          <fieldset className="scheduler-border">
            <legend>Thiết bị, tài sản</legend>
            <div className="form-group">
              <label>
                {'Lựa chọn tài sản'}
                <span className='text-red'>*</span>
              </label>
              <table id="project-table-asset" className="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th className="w-1/4">Nhóm tài sản</th>
                    <th className="w-3/5">Tài sản cho dự án</th>
                    <th className="w-[15%]">{translate('task_template.action')}</th>
                  </tr>
                </thead>

                <tbody>
                  {/* List tài sản đã thêm */}
                  {assetsWithGroup.list &&
                    assetsWithGroup.list?.length > 0 &&
                    assetsWithGroup.list.map((item, index) => (
                      <tr key={item.group}>
                        <td>{convertGroupAsset(item.group, translate)}</td>
                        <td>{item.listAssets.map((assetId) => convertAssetIdToAssetName(listAssets, assetId)).join(", ")}</td>
                        <td>
                          <a className='delete' title={translate('general.delete')} onClick={() => handleDeleteAssetRow(index)}>
                            <i className='material-icons'>delete</i>
                          </a>
                        </td>
                      </tr>
                    ))
                  }

                  {/* List để chọn */}
                  <tr key={`add-asset-input`}>
                    <td>
                      <div className="form-group">
                        {listAssetGroups && listAssetGroups?.length > 0 && (
                          <SelectBox
                            id={`${actionType}-create-project-add-asset-${assetsWithGroup?.currentAssetRow}-${projectId}`}
                            className="form-control select2 w-full"
                            style={{ width: '100%' }}
                            items={listAssetGroups}
                            multiple={false}
                            value={assetsWithGroup.currentGroupRow || listAssetGroups[0]}
                            onChange={(e) => {
                              setProjectAssets({
                                ...projectAssets,
                                assetsWithGroup: {
                                  ...assetsWithGroup,
                                  currentGroupRow: e[0]
                                }
                              })
                            }}
                          />
                        )}
                      </div>
                    </td>
                    <td style={{ maxWidth: 250 }}>
                      <div className="form-group">
                        {listAssetGroups && listAssetGroups?.length > 0 && (
                          <SelectBox
                            id={`${actionType}-select-project-assets-${projectId}`}
                            className="form-control select2"
                            style={{ width: '100%' }}
                            items={listAssets.filter((item) => assetsWithGroup?.currentGroupRow ? item.groupValue === assetsWithGroup?.currentGroupRow : item.groupValue === listAssetGroups[0]?.value)}
                            multiple={true}
                            onChange={(e) => {
                              setProjectAssets({
                                ...projectAssets,
                                assetsWithGroup: {
                                  ...assetsWithGroup,
                                  currentAssetRow: e
                                }
                              })
                            }}
                            options={{
                              placeholder: "--- Chọn tài sản ---"
                            }}
                            value={assetsWithGroup.currentAssetRow}
                          />
                        )}
                      </div>
                    </td>
                    <td>
                      <a className='save text-green' title={translate('general.save')} onClick={handleAddAssetRow}>
                        <i className='material-icons'>add_circle</i>
                      </a>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </fieldset>
        </div>
      </div>
    </React.Fragment>
  )
}

const mapDispatchToProps = {
  
}

function mapStateToProps(state) {
  const { user, createKpiUnit, assetsManager } = state
  return { user, createKpiUnit, assetsManager }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ProjectResourcesTab))

