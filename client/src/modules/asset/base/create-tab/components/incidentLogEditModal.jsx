import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components'

import { UserActions } from '../../../../super-admin/user/redux/actions'

import ValidationHelper from '../../../../../helpers/validationHelper'

function IncidentLogEditModal(props) {
  const [state, setState] = useState({})
  const [prevProps, setPrevProps] = useState({
    id: null
  })

  // Function format dữ liệu Date thành string
  const formatDate = (date, monthYear = false) => {
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

    if (monthYear === true) {
      return [month, year].join('-')
    } else {
      return [day, month, year].join('-')
    }
  }

  // Bắt sự kiện thay đổi mã sự cố
  const handleIncidentCodeChange = (e) => {
    let { value } = e.target
    validateIncidentCode(value, true)
  }
  const validateIncidentCode = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnIncidentCode: message,
          incidentCode: value
        }
      })
    }
    return message === undefined
  }

  // Bắt sự kiện thay đổi loại sự cố
  const handleTypeChange = (e) => {
    let { value } = e.target
    setState({
      ...state,
      type: value
    })
  }

  /**
   * Bắt sự kiện thay đổi người báo cáo
   */
  const handleReportedByChange = (value) => {
    setState({
      ...state,
      reportedBy: value[0]
    })
  }

  //Bắt sự kiện thay đổi "Thời gian phát hiện"
  const handleDateOfIncidentChange = (value) => {
    validateDateOfIncident(value, true)
  }
  const validateDateOfIncident = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnDateOfIncident: message,
          dateOfIncident: value
        }
      })
    }
    return message === undefined
  }

  //8. Bắt sự kiện thay đổi "Nội dung sự cố"
  const handleDescriptionChange = (e) => {
    let value = e.target.value
    validateIncidentDescription(value, true)
  }
  const validateIncidentDescription = (value, willUpdateState = true) => {
    let { message } = ValidationHelper.validateEmpty(props.translate, value)

    if (willUpdateState) {
      setState((state) => {
        return {
          ...state,
          errorOnDescription: message,
          description: value
        }
      })
    }
    return message === undefined
  }

  // Bắt sự kiện thay đổi loại sự cố
  const handleStatusIncidentChange = (e) => {
    let { value } = e.target
    setState({
      ...state,
      statusIncident: value
    })
  }

  // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
  const isFormValidated = () => {
    let result =
      validateDateOfIncident(state.dateOfIncident, false) &&
      validateIncidentDescription(state.description, false) &&
      validateDateOfIncident(state.dateOfIncident, false)

    return result
  }

  // Bắt sự kiện submit form
  const save = async () => {
    var partDateOfIncident = state.dateOfIncident.split('-')
    var dateOfIncident = [partDateOfIncident[2], partDateOfIncident[1], partDateOfIncident[0]].join('-')

    if (isFormValidated()) {
      return props.handleChange({ ...state, dateOfIncident: dateOfIncident })
    }
  }

  if (prevProps.id !== props.id) {
    setState({
      ...state,
      _id: props._id,
      id: props.id,
      index: props.index,
      incidentCode: props.incidentCode,
      type: props.type,
      reportedBy: props.reportedBy,
      dateOfIncident: props.dateOfIncident,
      description: props.description,
      statusIncident: props.statusIncident,
      errorOnIncidentCode: undefined,
      errorOnDescription: undefined
    })
    setPrevProps(props)
  }

  const { id } = props
  const { translate, user } = props
  const { incidentCode, type, reportedBy, dateOfIncident, description, statusIncident, errorOnIncidentCode, errorOnDescription } = state

  var userlist = user.list

  return (
    <React.Fragment>
      <DialogModal
        size='50'
        modalID={`modal-edit-incident-${id}`}
        isLoading={false}
        formID={`form-edit-incident-${id}`}
        title={translate('asset.asset_info.edit_incident_info')}
        func={save}
        disableSubmit={!isFormValidated()}
      >
        {/* Form chỉnh sửa thông tin sự cố */}
        <form className='form-group' id={`form-edit-incident-${id}`}>
          <div className='col-md-12'>
            {/* Mã sự cố */}
            <div className={`form-group ${!errorOnIncidentCode ? '' : 'has-error'}`}>
              <label>{translate('asset.general_information.incident_code')}</label>
              <input
                type='text'
                className='form-control'
                name='incidentCode'
                value={incidentCode}
                onChange={handleIncidentCodeChange}
                autoComplete='off'
                placeholder={translate('asset.general_information.incident_code')}
              />
              <ErrorLabel content={errorOnIncidentCode} />
            </div>

            {/* Phân loại */}
            <div className='form-group'>
              <label>{translate('asset.general_information.incident_type')}</label>
              <select className='form-control' value={type} name='type' onChange={handleTypeChange}>
                <option value='1'>{translate('asset.general_information.damaged')}</option>
                <option value='2'>{translate('asset.general_information.lost')}</option>
              </select>
            </div>

            {/* Người báo cáo */}
            <div className={`form-group`}>
              <label>{translate('asset.general_information.reported_by')}</label>
              <div>
                <div id='reportedByBox'>
                  <SelectBox
                    id={`reportedBy${id}`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    items={userlist.map((x) => {
                      return { value: x._id, text: x.name + ' - ' + x.email }
                    })}
                    onChange={handleReportedByChange}
                    value={reportedBy}
                    multiple={false}
                  />
                </div>
              </div>
            </div>

            {/* Thời gian phát hiện sự cố */}
            <div className='form-group'>
              <label>
                {translate('asset.general_information.date_incident')}
                <span className='text-red'>*</span>
              </label>
              <DatePicker id={`edit-dateOfIncident-${id}`} value={dateOfIncident} onChange={handleDateOfIncidentChange} />
            </div>

            {/* Nội dung */}
            <div className={`form-group ${!errorOnDescription ? '' : 'has-error'}`}>
              <label>
                {translate('asset.general_information.content')}
                <span className='text-red'>*</span>
              </label>
              <textarea
                className='form-control'
                rows='3'
                name='description'
                value={description}
                onChange={handleDescriptionChange}
                autoComplete='off'
                placeholder={translate('asset.general_information.content')}
              ></textarea>
              <ErrorLabel content={errorOnDescription} />
            </div>

            {/* Trạng thái */}
            <div className='form-group'>
              <label>{translate('asset.general_information.status')}</label>
              <select className='form-control' value={statusIncident} name='type' onChange={handleStatusIncidentChange}>
                <option value='1'>{translate('asset.general_information.waiting')}</option>
                <option value='2'>{translate('asset.general_information.processed')}</option>
              </select>
            </div>
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  var { user } = state
  return { user }
}

const actionCreators = {
  getUser: UserActions.get
}

const editModal = connect(mapState, actionCreators)(withTranslate(IncidentLogEditModal))
export { editModal as IncidentLogEditModal }
