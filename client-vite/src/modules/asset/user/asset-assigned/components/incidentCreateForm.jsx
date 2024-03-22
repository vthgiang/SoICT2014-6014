import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components'
import ValidationHelper from '../../../../../helpers/validationHelper'

import { UserActions } from '../../../../super-admin/user/redux/actions'
import { AssetManagerActions } from '../../../admin/asset-information/redux/actions'
import { IncidentActions } from '../redux/actions'
import { generateCode } from '../../../../../helpers/generateCode'

function IncidentCreateForm(props) {
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

  const [state, setState] = useState({
    ateOfIncident: formatDate(Date.now())
  })
  const [prevProps, setPrevProps] = useState({
    _id: null
  })

  // Bắt sự kiện thay đổi mã sự cố
  const handleIncidentCodeChange = (e) => {
    const { translate } = props
    const { value } = e.target

    let { message } = ValidationHelper.validateName(translate, value, 4, 255)
    setState((state) => {
      return {
        ...state,
        incidentCode: value,
        errorOnIncidentCode: message
      }
    })
  }

  // Bắt sự kiện thay đổi loại sự cố
  const handleTypeChange = (e) => {
    const { translate } = props
    const { value } = e.target
    let { assetStatus } = state

    let { message } = ValidationHelper.validateEmpty(translate, value)
    switch (value) {
      case '1':
        assetStatus = 'broken'
        setState((state) => {
          return {
            ...state,
            type: value,
            assetStatus,
            errorOnIncidentType: message
          }
        })
        break

      case '2':
        assetStatus = 'lost'
        setState((state) => {
          return {
            ...state,
            type: value,
            assetStatus,
            errorOnIncidentType: message
          }
        })
        break
      default:
        setState((state) => {
          return {
            ...state,
            type: value,
            assetStatus,
            errorOnIncidentType: message
          }
        })
    }
  }

  const handleStatusAsset = (value) => {
    setState((state) => {
      return {
        ...state,
        assetStatus: value[0]
      }
    })
  }

  /**
   * Bắt sự kiện thay đổi Mã tài sản
   */
  const handleAssetChange = (value) => {
    setState((state) => {
      return {
        ...state,
        asset: value[0]
      }
    })
  }

  /**
   * Bắt sự kiện thay đổi người báo cáo
   */
  const handleReportedByChange = (value) => {
    setState((state) => {
      return {
        ...state,
        reportedBy: value[0]
      }
    })
  }

  //Bắt sự kiện thay đổi "Thời gian phát hiện"
  const handleDateOfIncidentChange = (value) => {
    const { translate } = props
    let { message } = ValidationHelper.validateEmpty(translate, value)

    setState((state) => {
      return {
        ...state,
        dateOfIncident: value,
        errorOnDateOfIncident: message
      }
    })
  }

  //8. Bắt sự kiện thay đổi "Nội dung sự cố"
  const handleDescriptionChange = (e) => {
    const { translate } = props
    const { value } = e.target

    let { message } = ValidationHelper.validateEmpty(translate, value)
    setState((state) => {
      return {
        ...state,
        description: value,
        errorOnDescription: message
      }
    })
  }

  // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
  const isFormValidated = () => {
    const { type, dateOfIncident, description } = state
    const { translate } = props

    if (
      !ValidationHelper.validateEmpty(translate, type).status ||
      !ValidationHelper.validateEmpty(translate, dateOfIncident).status ||
      !ValidationHelper.validateEmpty(translate, description).status
    )
      return false
    return true
  }

  // Bắt sự kiện submit form
  const save = () => {
    const { incidentCode, type, description, assetStatus } = state
    let { dateOfIncident } = state

    const partIncident = dateOfIncident.split('-')
    dateOfIncident = [partIncident[2], partIncident[1], partIncident[0]].join('-')
    const assetId = !state.asset ? props.assetsManager.listAssets[0]._id : state.asset._id

    if (isFormValidated()) {
      let dataToSubmit = {
        incidentCode: incidentCode,
        type: type,
        reportedBy: props.auth.user._id,
        dateOfIncident: dateOfIncident,
        description: description,
        statusIncident: 1,
        assetStatus: assetStatus,
        assetId
      }

      return props.createIncident(assetId, dataToSubmit).then(({ response }) => {
        if (response.data.success) {
          props.getAllAsset({
            code: '',
            assetName: '',
            month: null,
            status: '',
            page: 0
            // limit: 5,
          })
        }
      })
    }
  }

  if (prevProps._id !== props._id) {
    const { status } = props.asset
    setState((state) => {
      return {
        ...state,
        _id: props._id,
        asset: props.asset,
        assetStatus: status,
        type: ''
      }
    })
    setPrevProps(props)
  }

  const regenerateCode = () => {
    let code = generateCode('IC')
    setState((state) => ({
      ...state,
      incidentCode: code
    }))
  }

  useEffect(() => {
    window.$(`#modal-create-assetcrash`).on('shown.bs.modal', regenerateCode)
    return () => {
      window.$(`#modal-create-assetcrash`).unbind('shown.bs.modal', regenerateCode)
    }
  }, [])

  const { _id } = props
  const { translate, assetsManager, user, auth } = props
  const {
    incidentCode,
    type,
    assetStatus,
    asset,
    reportedBy,
    dateOfIncident,
    description,
    errorOnIncidentCode,
    errorOnIncidentType,
    errorOnDateOfIncident,
    errorOnDescription
  } = state

  var userlist = user.list
  var assetlist = assetsManager.listAssets

  return (
    <React.Fragment>
      <DialogModal
        size='50'
        modalID='modal-create-assetcrash'
        formID='form-create-assetcrash'
        title={translate('asset.incident.report_incident')}
        func={save}
        disableSubmit={!isFormValidated()}
      >
        {/* Form thêm thông tin sự cố */}
        <form className='form-group' id='form-create-assetcrash'>
          <div className='col-md-12'>
            {/* Mã sự cố */}
            <div className={`form-group`}>
              <label>{translate('asset.general_information.incident_code')}</label>
              <input
                type='text'
                className='form-control'
                name='incidentCode'
                value={incidentCode ? incidentCode : ''}
                onChange={handleIncidentCodeChange}
                autoComplete='off'
                placeholder={translate('asset.general_information.incident_code')}
              />
            </div>

            {/* Phân loại */}
            <div className={`form-group ${!errorOnIncidentType ? '' : 'has-error'}`}>
              <label>
                {translate('asset.general_information.type')}
                <span className='text-red'>*</span>
              </label>
              <select className='form-control' value={type ? type : ''} name='type' onChange={handleTypeChange}>
                <option value=''>{`---${translate('asset.general_information.select_incident_type')}---`} </option>
                <option value='1'>{translate('asset.general_information.damaged')}</option>
                <option value='2'>{translate('asset.general_information.lost')}</option>
              </select>
              <ErrorLabel content={errorOnIncidentType} />
            </div>

            {/* Trạng thái tài sản */}
            <div className='form-group'>
              <label>{translate('asset.general_information.asset_status')}</label>
              <SelectBox
                id={`status-asset-${type}`}
                className='form-control select2'
                style={{ width: '100%' }}
                items={[
                  { value: '', text: `---${translate('asset.general_information.select_asset_status')}---` },
                  { value: 'ready_to_use', text: translate('asset.general_information.ready_use') },
                  { value: 'in_use', text: translate('asset.general_information.using') },
                  { value: 'broken', text: translate('asset.general_information.damaged') },
                  { value: 'lost', text: translate('asset.general_information.lost') },
                  { value: 'disposed', text: translate('asset.general_information.disposal') }
                ]}
                onChange={handleStatusAsset}
                value={assetStatus}
                multiple={false}
              />
            </div>

            {/* Tài sản */}
            <div className={`form-group`}>
              <label>{translate('asset.general_information.asset')}</label>
              <div>
                <div id='assetUBox'>
                  <SelectBox
                    id={`add-incident-asset${_id}`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    items={assetlist.map((x) => ({ value: x._id, text: x.code + ' - ' + x.assetName }))}
                    onChange={handleAssetChange}
                    value={asset ? asset._id : null}
                    multiple={false}
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Người báo cáo */}
            <div className={`form-group`}>
              <label>{translate('asset.general_information.reported_by')}</label>
              <div>
                <div id='reportedByBox'>
                  <SelectBox
                    id={`reportedBy${_id}`}
                    className='form-control select2'
                    style={{ width: '100%' }}
                    items={userlist.map((x) => {
                      return { value: x._id, text: x.name + ' - ' + x.email }
                    })}
                    onChange={handleReportedByChange}
                    value={auth.user._id}
                    multiple={false}
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Thời gian phát hiện sự cố */}
            <div className={`form-group ${!errorOnDateOfIncident ? '' : 'has-error'}`}>
              <label>
                {translate('asset.general_information.date_incident')}
                <span className='text-red'>*</span>
              </label>
              <DatePicker id={`add-dateOfIncident-${_id}`} value={dateOfIncident} onChange={handleDateOfIncidentChange} />
              <ErrorLabel content={errorOnDateOfIncident} />
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
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapState(state) {
  const { assetsManager, user, auth } = state
  return { assetsManager, user, auth }
}

const actionCreators = {
  getUser: UserActions.get,
  getAllAsset: AssetManagerActions.getAllAsset,
  createIncident: IncidentActions.createIncident
}

const createForm = connect(mapState, actionCreators)(withTranslate(IncidentCreateForm))
export { createForm as IncidentCreateForm }
