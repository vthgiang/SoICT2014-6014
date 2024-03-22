import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { DatePicker, ErrorLabel, ExportExcel, UploadFile } from '../../../../../common-components'

import { toast } from 'react-toastify'
import ServerResponseAlert from '../../../../alert/components/serverResponseAlert'

import { SocialInsuranceAddModal, SocialInsuranceEditModal } from './combinedContent'

function InsurranceTab(props) {
  const [state, setState] = useState({})

  const { translate } = props

  const { id, pageCreate } = props

  const {
    healthInsuranceNumber,
    healthInsuranceStartDate,
    healthInsuranceEndDate,
    errorOnHealthInsuranceStartDate,
    socialInsuranceNumber,
    socialInsuranceDetails,
    errorOnHealthInsuranceEndDate,
    currentRow
  } = state

  /**
   * Function format dữ liệu Date thành string
   * @param {*} date : Ngày muốn format
   * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
   */

  useEffect(() => {
    setState((state) => {
      return {
        ...state,
        id: props.id,
        socialInsuranceDetails: props.socialInsuranceDetails,
        healthInsuranceNumber: props.employee ? props.employee.healthInsuranceNumber : '',
        healthInsuranceStartDate: props.employee ? props.employee.healthInsuranceStartDate : '',
        healthInsuranceEndDate: props.employee ? props.employee.healthInsuranceEndDate : '',
        socialInsuranceNumber: props.employee ? props.employee.socialInsuranceNumber : ''
      }
    })
  }, [props.id, props.employee?.socialInsuranceDetails])

  const formatDate = (date, monthYear = false) => {
    if (date) {
      let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day

      if (monthYear === true) {
        return [month, year].join('-')
      } else return [day, month, year].join('-')
    }
    return date
  }

  /**
   * Bắt sự kiện click edit BHXH
   * @param {*} value : BHXH cần chỉnh sửa
   * @param {*} index : Số thứ tự BHXH cần chỉnh sửa
   */
  const handleEdit = async (value, index) => {
    await setState((state) => {
      return {
        ...state,
        currentRow: { ...value, index: index }
      }
    })
    window.$(`#modal-edit-BHXH-editBHXH${index}`).modal('show')
  }

  /** Function bắt sự kiện thay đổi mã số BHYT, BHXH*/
  const handleChange = (e) => {
    const { name, value } = e.target
    setState({
      ...state,
      [name]: value
    })
    props.handleChange(name, value)
  }

  /**
   * Bắt sự kiện thay đổi ngày có hiệu lực
   * @param {*} value : Ngày có hiệu lực
   */
  const handleStartDateBHYTChange = (value) => {
    const { translate } = props
    let { errorOnHealthInsuranceEndDate, healthInsuranceEndDate } = state

    let errorOnHealthInsuranceStartDate = undefined
    let startDate
    if (value) {
      let partValue = value.split('-')
      startDate = [partValue[2], partValue[1], partValue[0]].join('-')
      let date = new Date(startDate)
      if (healthInsuranceEndDate) {
        let endDate = healthInsuranceEndDate.split('-')
        endDate = [endDate[2], endDate[1], endDate[0]].join('-')
        let d = new Date(endDate)
        if (date.getTime() >= d.getTime()) {
          errorOnHealthInsuranceStartDate = translate('human_resource.commendation_discipline.discipline.start_date_before_end_date')
        } else {
          errorOnHealthInsuranceEndDate = translate('human_resource.commendation_discipline.discipline.end_date_after_start_date')
            ? undefined
            : errorOnHealthInsuranceEndDate
        }
      }
    }
    setState({
      ...state,
      healthInsuranceStartDate: startDate,
      errorOnHealthInsuranceStartDate: errorOnHealthInsuranceStartDate,
      errorOnHealthInsuranceEndDate:
        errorOnHealthInsuranceEndDate === translate('human_resource.profile.start_date_insurance_required')
          ? undefined
          : errorOnHealthInsuranceEndDate
    })
    props.handleChange('healthInsuranceStartDate', value)
  }

  /**
   * Bắt sự kiện thay dổi ngày hêt hiệu lực
   * @param {*} value : Ngày hết hiệu lực
   */
  const handleEndDateBHYTChange = (value) => {
    const { translate } = props
    let { healthInsuranceStartDate } = state

    if (value) {
      let partValue = value.split('-')
      let endDate = [partValue[2], partValue[1], partValue[0]].join('-')
      let date = new Date(endDate)
      if (healthInsuranceStartDate) {
        let startDate = healthInsuranceStartDate.split('-')
        startDate = [startDate[2], startDate[1], startDate[0]].join('-')
        let d = new Date(startDate)
        if (d.getTime() >= date.getTime()) {
          setState({
            ...state,
            healthInsuranceEndDate: endDate,
            errorOnHealthInsuranceEndDate: translate('human_resource.commendation_discipline.discipline.end_date_after_start_date')
          })
        } else {
          setState({
            ...state,
            healthInsuranceEndDate: endDate,
            errorOnHealthInsuranceStartDate: undefined,
            errorOnHealthInsuranceEndDate: undefined
          })
        }
      } else {
        setState({
          ...state,
          healthInsuranceEndDate: endDate,
          errorOnHealthInsuranceEndDate: translate('human_resource.profile.start_date_insurance_required')
        })
      }
    } else {
      setState({
        ...state,
        healthInsuranceEndDate: value,
        errorOnHealthInsuranceEndDate: undefined
      })
    }

    props.handleChange('healthInsuranceEndDate', value)
  }

  /**
   * Function kiểm tra trùng lặp thời gian đóng bảo hiểm
   * @param {*} data : Dữ liệu quá trình đóng bảo hiểm muốn thêm, chỉnh sửa
   * @param {*} array : Danh sách quá trình đóng baoe hiểm
   */
  const checkForDuplicate = (data, array) => {
    let startDate = new Date(data.startDate)
    let endDate = new Date(data.endDate)
    let checkData = true
    for (let n in array) {
      let date1 = new Date(array[n].startDate)
      let date2 = new Date(array[n].endDate)
      if (
        date1.getTime() === startDate.getTime() ||
        (startDate.getTime() < date1.getTime() && endDate.getTime() > date1.getTime()) ||
        (startDate.getTime() < date2.getTime() && endDate.getTime() > date1.getTime())
      ) {
        checkData = false
        break
      }
    }
    return checkData
  }

  /**
   * Function thêm thông tin quá trình đóng BHXH
   * @param {*} data : Dữ liệu quá trình đóng BHXH muốn thêm
   */
  const handleAddBHXH = async (data) => {
    const { translate } = props
    let { socialInsuranceDetails } = state

    let checkData = checkForDuplicate(data, socialInsuranceDetails)
    if (checkData) {
      await setState({
        ...state,
        socialInsuranceDetails: [
          ...socialInsuranceDetails,
          {
            ...data
          }
        ]
      })
      props.handleAddBHXH(
        [
          ...socialInsuranceDetails,
          {
            ...data
          }
        ],
        data
      )
    } else {
      toast.error(
        <ServerResponseAlert type='error' title={'general.error'} content={[translate('human_resource.profile.time_BHXH_duplicate')]} />,
        { containerId: 'toast-notification' }
      )
    }
  }

  /**
   * Function chỉnh sửa thông tin quá trình đóng BHXH
   * @param {*} data : Dữ liệu quá trình đóng BHXH muốn chỉnh sửa
   */
  const handleEditBHXH = async (data) => {
    const { translate } = props
    let { socialInsuranceDetails } = state
    socialInsuranceDetails[data.index] = data
    let checkData = checkForDuplicate(
      data,
      socialInsuranceDetails.filter((x, index) => index !== data.index)
    )

    if (checkData) {
      await setState({
        ...state,
        socialInsuranceDetails: socialInsuranceDetails
      })
      props.handleEditBHXH(socialInsuranceDetails, data)
    } else {
      toast.error(
        <ServerResponseAlert type='error' title={'general.error'} content={[translate('human_resource.profile.time_BHXH_duplicate')]} />,
        { containerId: 'toast-notification' }
      )
    }
  }

  const handleChangeFile = (file) => {
    const healthInsuranceAttachment = file.map((x) => ({
      url: x.urlFile,
      fileUpload: x.fileUpload
    }))

    setState({
      ...state,
      healthInsuranceAttachment
    })
    props.handleChange('healthInsuranceAttachment', healthInsuranceAttachment)
  }

  /**
   * Function bắt sự kiện xoá quá trình đóng BHXH
   * @param {*} index : Số thứ tự quá trình đóng BHXH cần xoá
   */
  const _delete = async (index) => {
    let { socialInsuranceDetails } = state

    let data = socialInsuranceDetails[index]
    socialInsuranceDetails.splice(index, 1)
    // console.log(socialInsuranceDetails);
    await setState({
      ...state,
      socialInsuranceDetails: [...socialInsuranceDetails]
    })
    props.handleDeleteBHXH([...socialInsuranceDetails], data)
  }

  /**
   * Function chyển đổi quá trình đóng bảo hiểm thành dạng dữ liệu dùng export
   * @param {*} data : quá trình đóng bảo hiểm
   */
  const convertDataToExportData = (data) => {
    const { translate, employee } = props

    data = data?.map((x, index) => {
      return {
        STT: index + 1,
        startDate: formatDate(x.startDate, true),
        endDate: formatDate(x.endDate, true),
        company: x.company,
        position: x.position
      }
    })

    let exportData = {
      fileName: translate('human_resource.profile.employee_info.export_bhxh'),
      dataSheets: [
        {
          sheetName: 'Sheet1',
          sheetTitle: `${translate('human_resource.profile.employee_info.export_bhxh')}: ${employee.fullName} - ${employee.employeeNumber}`,
          tables: [
            {
              columns: [
                { key: 'STT', value: translate('human_resource.stt') },
                { key: 'startDate', value: translate('human_resource.profile.from_month_year') },
                { key: 'endDate', value: translate('human_resource.profile.to_month_year') },
                { key: 'company', value: translate('human_resource.profile.unit') },
                { key: 'position', value: translate('table.position') }
              ],
              data: data
            }
          ]
        }
      ]
    }
    return exportData
  }

  let exportData = convertDataToExportData(socialInsuranceDetails)

  return (
    <div id={id} className='tab-pane'>
      <div className='box-body'>
        {/* Thông tin bảo hiểm xã hội */}
        <fieldset className='scheduler-border'>
          <legend className='scheduler-border'>
            <h4 className='box-title'>{translate('human_resource.profile.bhxh')}</h4>
          </legend>
          <div className='row'>
            {/* Mã số bảo hiểm xã hội */}
            <div className='form-group col-md-4'>
              <label>{translate('human_resource.profile.number_BHXH')}</label>
              <input
                type='text'
                className='form-control'
                name='socialInsuranceNumber'
                value={socialInsuranceNumber ? socialInsuranceNumber : ''}
                onChange={handleChange}
                placeholder={translate('human_resource.profile.number_BHXH')}
                autoComplete='off'
              />
            </div>
            {/* Quá trình đóng bảo hiểm xã hội */}
            <div className='col-md-12'>
              <h4 className='row col-md-6'>{translate('human_resource.profile.bhxh_process')}:</h4>
              <SocialInsuranceAddModal handleChange={handleAddBHXH} id={`addBHXH${id}`} />
              {!pageCreate && (
                <ExportExcel
                  id={`edit-create-export-bhxh${id}`}
                  buttonName={translate('human_resource.name_button_export')}
                  exportData={exportData}
                  style={{ marginTop: 2, marginRight: 15 }}
                />
              )}
              <table className='table table-striped table-bordered table-hover ' style={{ marginBottom: 0 }}>
                <thead>
                  <tr>
                    <th>{translate('human_resource.profile.from_month_year')}</th>
                    <th>{translate('human_resource.profile.to_month_year')}</th>
                    <th>{translate('human_resource.profile.unit')}</th>
                    <th>{translate('table.position')}</th>
                    <th>{translate('human_resource.profile.money')}</th>
                    <th style={{ width: '120px' }}>{translate('table.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {socialInsuranceDetails &&
                    socialInsuranceDetails.length !== 0 &&
                    socialInsuranceDetails.map((x, index) => (
                      <tr key={index}>
                        <td>{formatDate(x.startDate, true)}</td>
                        <td>{formatDate(x.endDate, true)}</td>
                        <td>{x.company}</td>
                        <td>{x.position}</td>
                        <td>{x.money}</td>
                        <td>
                          <a
                            onClick={() => handleEdit(x, index)}
                            className='edit text-yellow'
                            style={{ width: '5px' }}
                            title={translate('human_resource.profile.edit_bhxh')}
                          >
                            <i className='material-icons'>edit</i>
                          </a>
                          <a className='delete' title='Delete' data-toggle='tooltip' onClick={() => _delete(index)}>
                            <i className='material-icons'></i>
                          </a>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {(!socialInsuranceDetails || socialInsuranceDetails.length === 0) && (
                <div className='table-info-panel'>{translate('confirm.no_data')}</div>
              )}
            </div>
          </div>
        </fieldset>

        {/* Thông tin bảo hiểm y tế */}
        <fieldset className='scheduler-border'>
          <legend className='scheduler-border'>
            <h4 className='box-title'>{translate('human_resource.profile.bhyt')}</h4>
          </legend>
          <div className='row'>
            {/* Mã số bảo hiểm y tế */}
            <div className='form-group col-md-4'>
              <label>{translate('human_resource.profile.number_BHYT')}</label>
              <input
                type='text'
                className='form-control'
                name='healthInsuranceNumber'
                value={healthInsuranceNumber ? healthInsuranceNumber : ''}
                onChange={handleChange}
                placeholder={translate('human_resource.profile.number_BHYT')}
                autoComplete='off'
              />
            </div>
            {/* Ngày có hiệu lực */}
            <div className={`form-group col-md-4 ${errorOnHealthInsuranceStartDate && 'has-error'}`}>
              <label>{translate('human_resource.profile.start_date')}</label>
              <DatePicker
                id={`startDateBHYT${id}`}
                value={healthInsuranceStartDate !== undefined ? formatDate(healthInsuranceStartDate) : undefined}
                onChange={handleStartDateBHYTChange}
              />
              <ErrorLabel content={errorOnHealthInsuranceStartDate} />
            </div>
            {/* Ngày hết hiệu lực */}
            <div className={`form-group col-md-4 ${errorOnHealthInsuranceEndDate && 'has-error'}`}>
              <label>{translate('human_resource.commendation_discipline.discipline.table.end_date')}</label>
              <DatePicker
                id={`endDateBHYT${id}`}
                value={healthInsuranceEndDate !== undefined ? formatDate(healthInsuranceEndDate) : undefined}
                onChange={handleEndDateBHYTChange}
              />
              <ErrorLabel content={errorOnHealthInsuranceEndDate} />
            </div>
            {/* Tập tin đính kèm */}
            <div className='form-group col-md-4'>
              <label>{translate('human_resource.profile.attached_files')}</label>
              <UploadFile multiple={true} onChange={handleChangeFile} />
            </div>
          </div>
        </fieldset>
      </div>
      {
        /** Form chỉnh sửa quá trình đóng bảo hiểm xã hội */
        currentRow !== undefined && (
          <SocialInsuranceEditModal
            id={`editBHXH${currentRow.index}`}
            _id={currentRow._id}
            index={currentRow.index}
            company={currentRow.company}
            startDate={formatDate(currentRow.startDate, true)}
            endDate={formatDate(currentRow.endDate, true)}
            position={currentRow.position}
            money={currentRow.money}
            handleChange={handleEditBHXH}
          />
        )
      }
    </div>
  )
}

const insurranceTab = connect(null, null)(withTranslate(InsurranceTab))
export { insurranceTab as InsurranceTab }
