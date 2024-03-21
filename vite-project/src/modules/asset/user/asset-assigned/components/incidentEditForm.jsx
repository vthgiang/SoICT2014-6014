import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components'
import { ManageIncidentActions } from '../../../admin/incident/redux/actions'
import ValidationHelper from '../../../../../helpers/validationHelper'
function IncidentEditForm(props) {
  const [state, setState] = useState({
    managedBy: props.managedBy ? props.managedBy : ''
  })
  const [prevProps, setPrevProps] = useState({
    _id: null
  })

  // Bắt sự kiện thay đổi mã sự cố
  const handleIncidentCodeChange = (e) => {
    let { value } = e.target
    const { translate } = state

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
  const handleTypeChange = (value) => {
    const { translate } = props
    let { assetStatus } = state
    value = value[0]

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

  // Bắt sự kiện thay đổi "Thời gian phát hiện"
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

  // Bắt sự kiện thay đổi "Nội dung sự cố"
  const handleDescriptionChange = (e) => {
    const { translate } = props
    let { value } = e.target
    let { message } = ValidationHelper.validateEmpty(translate, value)
    console.log(value)
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
    const { incidentCode, type, dateOfIncident, description } = state
    const { translate } = props

    if (
      !ValidationHelper.validateEmpty(translate, type).status ||
      !ValidationHelper.validateEmpty(translate, dateOfIncident).status ||
      !ValidationHelper.validateEmpty(translate, description).status
    )
      return false
    return true
  }

  const handleStatusIncidentChange = (e) => {
    let { value } = e.target
    setState((state) => {
      return {
        ...state,
        statusIncident: value
      }
    })
  }

  const save = () => {
    let { managedBy, assetStatus } = state
    var partIncident = state.dateOfIncident.split('-')
    var dateOfIncident = [partIncident[2], partIncident[1], partIncident[0]].join('-')
    let assetId = !state.asset ? props.assetsManager.listAssets[0]._id : state.asset._id

    if (isFormValidated()) {
      let dataToSubmit = {
        incidentCode: state.incidentCode,
        type: state.type,
        reportedBy: !state.reportedBy ? props.user.list[0].id : state.reportedBy,
        dateOfIncident: dateOfIncident,
        description: state.description,
        statusIncident: state.statusIncident,
        assetStatus,
        assetId
      }
      return props.updateIncident(props._id, dataToSubmit, managedBy)
    }
  }

  if (prevProps._id !== props._id) {
    setState({
      ...state,
      _id: props._id,
      asset: props.asset,
      assetStatus: props.asset.status,
      incidentCode: props.incidentCode,
      type: props.type,
      reportedBy: props.reportedBy,
      dateOfIncident: props.dateOfIncident,
      description: props.description,
      statusIncident: props.statusIncident,
      errorOnIncidentCode: undefined,
      errorOnDateOfIncident: undefined,
      errorOnDescription: undefined
    })
    setPrevProps(props)
  }

  const handleStatusAsset = (value) => {
    setState((state) => {
      return {
        ...state,
        assetStatus: value[0]
      }
    })
  }

  const { _id } = props
  const { translate, assetsManager, user } = props
  const {
    incidentCode,
    type,
    asset,
    assetStatus,
    reportedBy,
    dateOfIncident,
    description,
    errorOnIncidentCode,
    errorOnIncidentType,
    errorOnDateOfIncident,
    errorOnDescription,
    statusIncident
  } = state

  const userlist = user.list
  let assetlist = assetsManager.listAssets
  console.log(assetlist)
  console.log(asset)

  if (assetlist && asset) {
    const checkExist = assetlist.some((obj) => obj._id === asset._id)
    if (!checkExist) {
      assetlist = [...assetlist, asset]
    }
  }
  return (
    <React.Fragment>
      <DialogModal
        size='50'
        modalID='modal-edit-incident'
        formID='form-edit-incident'
        title={translate('asset.asset_info.edit_incident_info')}
        func={save}
        disableSubmit={!isFormValidated()}
      >
        {/* Form chỉnh sửa thông tin sự cố */}
        <form className='form-group' id='form-edit-incident'>
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
            <div className={`form-group ${!errorOnIncidentType ? '' : 'has-error'}`}>
              <label>
                {translate('asset.general_information.incident_type')}
                <span className='text-red'>*</span>
              </label>
              <SelectBox
                id={`edit-type-incident-asset${_id}`}
                className='form-control select2'
                style={{ width: '100%' }}
                value={type}
                items={[
                  { value: '', text: `---${translate('asset.general_information.select_incident_type')}---` },
                  { value: '1', text: translate('asset.general_information.damaged') },
                  { value: '2', text: translate('asset.general_information.lost') }
                ]}
                onChange={handleTypeChange}
                multiple={false}
              />
              <ErrorLabel content={errorOnIncidentType} />
            </div>

            {/* Trạng thái tài sản */}
            <div className='form-group'>
              <label>{translate('asset.general_information.asset_status')}</label>
              <SelectBox
                id={`status-asset-${_id}`}
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
              <SelectBox
                id={`edit-incident-asset${_id}`}
                className='form-control select2'
                style={{ width: '100%' }}
                items={assetlist.map((x) => ({ value: x._id, text: x.code + ' - ' + x.assetName }))}
                onChange={handleAssetChange}
                value={asset ? asset._id : null}
                multiple={false}
                disabled
              />
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
                    value={reportedBy}
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
  const { assetsManager, auth, user } = state
  return { assetsManager, auth, user }
}

const actionCreators = {
  updateIncident: ManageIncidentActions.updateIncident
}

const editForm = connect(mapState, actionCreators)(withTranslate(IncidentEditForm))
export { editForm as IncidentEditForm }
