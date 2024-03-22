import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { createUnitKpiActions } from '../redux/actions.js'

import { DialogModal, ErrorLabel } from '../../../../../common-components'
import ValidationHelper from '../../../../../helpers/validationHelper'

function OrganizationalUnitImportancesModal(props) {
  const { translate, createKpiUnit, dashboardEvaluationEmployeeKpiSet } = props
  const { organizationalUnit, organizationalUnitId, month } = props

  const [organizationalUnitImportancesState, setOrganizationalUnitImportancesState] = useState(null)
  const [state, setState] = useState({
    updateOrganizationalUnit: false
  })
  const { updateOrganizationalUnit } = state

  useEffect(() => {
    setOrganizationalUnitImportancesState(null)
  }, [props.organizationalUnitId, props.createKpiUnit?.currentKPI])

  useEffect(() => {
    // Khởi tạo dữ liệu table độ quan trọng nhân viên
    if (!organizationalUnitImportancesState && createKpiUnit?.currentKPI) {
      let currentKpiUnit,
        organizationalUnits = []

      currentKpiUnit = createKpiUnit.currentKPI
      if (currentKpiUnit) {
        organizationalUnits = currentKpiUnit?.organizationalUnitImportances?.map((item) => {
          return {
            value: item?.organizationalUnit?._id,
            text: item?.organizationalUnit?.name,
            importance: item?.importance,
            status: true
          }
        })
      }
      setOrganizationalUnitImportancesState(organizationalUnits)
    }

    // Cập nhât dữ liệu table khi thêm đơn vị con mới
    if (organizationalUnitImportancesState && organizationalUnit && updateOrganizationalUnit) {
      let organizationalUnitChildren, currentKPI, listOrganizationalUnitImportances, organizationalUnitImportancesStateTemp, unit
      organizationalUnitImportancesStateTemp = organizationalUnitImportancesState
      unit = organizationalUnitImportancesState.map((item) => item?.value)

      // Lấy các đơn vị con trực tiếp của phòng ban hiện tại
      organizationalUnitChildren = organizationalUnit?.children

      // Lấy danh sách đơn vị có độ quan trọng lưu trong DB
      if (createKpiUnit) {
        currentKPI = createKpiUnit.currentKPI
        if (currentKPI) {
          listOrganizationalUnitImportances = currentKPI?.organizationalUnitImportances?.map((item) => item?.organizationalUnit?._id)
        }
      }

      // Thêm những đơn vị chưa có độ quan trọng trong DB
      if (organizationalUnitChildren?.length > 0) {
        organizationalUnitChildren.map((item) => {
          if (
            !listOrganizationalUnitImportances ||
            (listOrganizationalUnitImportances.indexOf(item?.id) === -1 && unit.indexOf(item?.id) === -1)
          ) {
            organizationalUnitImportancesStateTemp.push({
              value: item?.id,
              text: item?.name,
              importance: 100,
              status: true
            })
          }
        })

        // Reset state trước khi lưu state mới
        setOrganizationalUnitImportancesState(organizationalUnitImportancesStateTemp)
        setState({
          ...state,
          updateOrganizationalUnit: false
        })
      }
    }
  })

  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) {
      month = '0' + month
    }

    if (day.length < 2) {
      day = '0' + day
    }

    return [month, year].join('-')
  }

  const handleChangeImportance = (e, organizationalUnit) => {
    let value = e.target.value
    let validation = ValidationHelper.validateNumberInput(translate, value, 0, 100)

    let organizationalUnitImportancesStateTemp = organizationalUnitImportancesState
    organizationalUnitImportancesStateTemp = organizationalUnitImportancesStateTemp.map((item) => {
      if (item.value === organizationalUnit) {
        return {
          ...item,
          importance: validation?.status ? Number(value) : item.importance,
          errorOnImportance: validation.message,
          status: validation.status
        }
      } else {
        return item
      }
    })
    setOrganizationalUnitImportancesState(organizationalUnitImportancesStateTemp)
  }

  const handleUpdateEmployee = (e) => {
    e.preventDefault()
    setState({
      ...state,
      updateOrganizationalUnit: true
    })
  }

  const handleSubmit = () => {
    const { createKpiUnit } = props
    let data, currentKPI

    if (createKpiUnit) {
      currentKPI = createKpiUnit.currentKPI
    }
    if (organizationalUnitImportancesState && organizationalUnitImportancesState.length !== 0) {
      data = organizationalUnitImportancesState.map((item) => {
        return {
          organizationalUnit: item.value,
          importance: item.importance
        }
      })

      props.editKPIUnit(currentKPI._id, data, 'edit-organizational-unit-importance')
    }
  }

  const isFormValidated = () => {
    let error
    if (organizationalUnitImportancesState && organizationalUnitImportancesState.length !== 0) {
      error = organizationalUnitImportancesState.filter((item) => !item?.status)
    }

    return error?.length !== 0
  }

  return (
    <React.Fragment>
      <DialogModal
        modalID='organizational-unit-importances'
        isLoading={false}
        formID='form-organizational-unit-importances'
        title={`Độ quan trọng đơn vị con của ${organizationalUnit && organizationalUnit.name} tháng ${formatDate(month)}`}
        msg_success={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success')}
        msg_failure={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.failure')}
        func={handleSubmit}
        hasNote={false}
        disableSubmit={isFormValidated()}
      >
        {/* Form khởi tạo KPI đơn vị */}
        <form
          id='form-organizational-unit-importances'
          onSubmit={() => handleSubmit(translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success'))}
        >
          <button className='btn btn-primary pull-right' style={{ marginBottom: '15px' }} onClick={(e) => handleUpdateEmployee(e)}>
            Cập nhật đơn vị con mới
          </button>

          <table className='table table-hover table-bordered'>
            <thead>
              <tr>
                <th title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set.no_')}>
                  {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.no_')}
                </th>
                <th title={translate('kpi.evaluation.employee_evaluation.name')}>{translate('kpi.evaluation.employee_evaluation.name')}</th>
                <th title={translate('kpi.organizational_unit.create_organizational_unit_kpi_set.employee_importance')}>
                  {translate('kpi.organizational_unit.create_organizational_unit_kpi_set.employee_importance')}
                </th>
              </tr>
            </thead>
            <tbody>
              {organizationalUnitImportancesState &&
                organizationalUnitImportancesState.length !== 0 &&
                organizationalUnitImportancesState.map((item, index) => (
                  <tr key={item.value + organizationalUnitId + index}>
                    <td style={{ width: '40px' }}>{index + 1}</td>
                    <td>{item.text}</td>
                    <td className={`form-group ${!item?.errorOnImportance ? '' : 'has-error'}`}>
                      <input
                        type='number'
                        min='0'
                        max='100'
                        onChange={(e) => handleChangeImportance(e, item?.value)}
                        defaultValue={item.importance}
                        style={{ width: '60px', textAlign: 'center' }}
                      />
                      <ErrorLabel content={item?.errorOnImportance} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { user, createKpiUnit, dashboardEvaluationEmployeeKpiSet } = state
  return { user, createKpiUnit, dashboardEvaluationEmployeeKpiSet }
}
const actions = {
  editKPIUnit: createUnitKpiActions.editKPIUnit
}

const connectedOrganizationalUnitImportancesModal = connect(mapState, actions)(withTranslate(OrganizationalUnitImportancesModal))
export { connectedOrganizationalUnitImportancesModal as OrganizationalUnitImportancesModal }
