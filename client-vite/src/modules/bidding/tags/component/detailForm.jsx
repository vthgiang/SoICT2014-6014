import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DatePicker, DialogModal, ErrorLabel, SelectBox, UploadFile } from '../../../../common-components'
import { EmployeeManagerActions } from '../../../human-resource/profile/employee-management/redux/actions'
import { convertEmpIdToName } from '../../bidding-package/biddingPackageManagement/components/employeeHelper'
import { TagActions } from '../redux/actions'

const DetailTag = (props) => {
  const { translate, tag, employeesManager } = props

  const initState = {
    name: '',
    description: '',
    employees: [],
    employeeWithSuitability: []
  }
  const [state, setState] = useState(initState)
  const [id, setId] = useState(props.id)

  useEffect(() => {
    props.getAllEmployee()
  }, [])

  useEffect(() => {
    if (props.id) {
      const { tagItem } = props
      setState({
        ...state,
        id: props.id,
        name: tagItem?.name,
        description: tagItem?.description,
        employees: tagItem?.employees ?? [],
        employeeWithSuitability: tagItem?.employeeWithSuitability ?? []
      })
      setId(props.id)
    }
  }, [props.id, JSON.stringify(props.tagItem)])

  const { name, description, employeeWithSuitability, employees } = state
  let allEmployee
  if (employeesManager && employeesManager.listAllEmployees) {
    allEmployee = employeesManager.listAllEmployees
  }

  return (
    <React.Fragment>
      <DialogModal modalID={`modal-detail-tag-${id}`} formID='form-detail-tag' title='Chi tiết tag' hasSaveButton={false} size={50}>
        <form id='form-detail-tag'>
          <div style={{ lineHeight: 2 }}>
            <div>
              <strong>Tên tag: </strong>
              {name}
            </div>
            <div>
              <strong>Mô tả tag: </strong>
              {description}
            </div>
            <div>
              <strong>Danh sách nhân viên và độ phù hợp tương ứng: </strong>
              <ul>
                {employeeWithSuitability
                  .sort((a, b) => b.suitability - a.suitability)
                  ?.map((x, idx) => {
                    return (
                      <li key={idx}>
                        {convertEmpIdToName(allEmployee, x.employee)} ( Độ phù hợp: {x.suitability})
                      </li>
                    )
                  })}
              </ul>
            </div>
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => state

const mapDispatchToProps = {
  getAllEmployee: EmployeeManagerActions.getAllEmployee,
  editTag: TagActions.editTag
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(DetailTag))
