import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { TreeTable } from '../../../../common-components'

import { EmployeeInOrganizationalUnitEditForm } from './employeeInOrganizationalUnitEditForm'

import { RoleActions } from '../../../super-admin/role/redux/actions'
import { DepartmentActions } from '../../../super-admin/organizational-unit/redux/actions'
import _cloneDeep from 'lodash/cloneDeep'
const DepartmentManage = (props) => {
  const [state, setState] = useState({})

  useEffect(() => {
    props.getDepartment()
    props.getRole()
  }, [])

  /**
   * Function bắt sự kiện chỉnh sửa nhân sự các đơn vị
   * @param {*} id : Id đơn vị cần sửa
   */
  const handleShowEdit = async (id) => {
    await setState({
      ...state,
      currentRow: id
    })
    window.$(`#modal-edit-unit${id}`).modal('show')
  }

  useEffect(() => {
    window.$('#employee-tree-table').css({ border: '1px solid #9E9E9E', backgroundColor: 'whitesmoke' })
    window
      .$('#employee-tree-table th')
      .css({ border: '1px solid #9E9E9E', position: 'sticky', top: '-0.1em', background: '#fff', 'z-index': '1' })
    window.$('#employee-tree-table td').css({ border: '1px solid #9E9E9E' })
  })

  const getRoleNameOfDepartment = (data) => {
    if (data && data.length > 0) {
      let result = []
      data.forEach((obj) => {
        result = [...result, obj.name]
      })
      return result.join(', ')
    } else {
      return data
    }
  }

  const getTotalEmployeeInUnit = (data) => {
    if (data) {
      let result = []
      if (data.managers && data.managers.length > 0) {
        data.managers.forEach((mng) => {
          if (mng.users && mng.users.length > 0) {
            mng.users.forEach((mngUser) => {
              result = [...result, mngUser.userId]
            })
          }
        })
      }

      if (data.deputyManagers && data.deputyManagers.length > 0) {
        data.deputyManagers.forEach((dmg) => {
          if (dmg.users && dmg.users.length > 0) {
            dmg.users.forEach((dmgUser) => {
              result = [...result, dmgUser.userId]
            })
          }
        })
      }

      if (data.employees && data.employees.length > 0) {
        data.employees.forEach((emy) => {
          if (emy.users && emy.users.length > 0) {
            emy.users.forEach((emyUser) => {
              result = [...result, emyUser.userId]
            })
          }
        })
      }

      const seen = new Set()
      const filteredArr = result.filter((el) => {
        const duplicate = seen.has(el?._id)
        seen.add(el?._id)
        return !duplicate
      })
      return filteredArr.length
    } else {
      return 0
    }
  }

  const { translate, department } = props

  let data = []
  if (department.list.length !== 0) {
    data = _cloneDeep(department.list) // Sao chép ra mảng mới để không làm ảnh hưởng tới state department.list trong redux
    for (let n in data) {
      data[n] = {
        ...data[n],
        rawData: data[n],
        name: data[n].name,
        manager: getRoleNameOfDepartment(data[n].managers),
        deputyManager: getRoleNameOfDepartment(data[n].deputyManagers),
        employees: getRoleNameOfDepartment(data[n].employees),
        totalEmployee: getTotalEmployeeInUnit(data[n]),
        action: ['edit']
      }
    }
  }
  let column = [
    { name: translate('manage_department.name'), key: 'name' },
    { name: translate('manage_department.manager_name'), key: 'manager' },
    { name: translate('manage_department.deputy_manager_name'), key: 'deputyManager' },
    { name: translate('manage_department.employee_name'), key: 'employees' },
    { name: translate('manage_department.total_employee'), key: 'totalEmployee' }
  ]

  return (
    <div>
      <div className='qlcv StyleScrollDiv StyleScrollDiv-y' style={{ maxHeight: '600px' }}>
        <TreeTable
          behaviour='show-children'
          tableId='employee-tree-table'
          column={column}
          data={data}
          titleAction={{
            edit: translate('human_resource.manage_department.edit_unit')
          }}
          funcEdit={handleShowEdit}
        />
      </div>

      {
        /** Form chỉnh sửa nhân sự các đơn vị */
        state.currentRow !== undefined && (
          <EmployeeInOrganizationalUnitEditForm
            _id={state.currentRow}
            department={department.list.filter((x) => x._id === state.currentRow)}
            role={props.role.list}
          />
        )
      }
    </div>
  )
}

function mapState(state) {
  const { role, department } = state
  return { role, department }
}

const actionCreators = {
  getDepartment: DepartmentActions.get,
  getRole: RoleActions.get
}

export default connect(mapState, actionCreators)(withTranslate(DepartmentManage))
