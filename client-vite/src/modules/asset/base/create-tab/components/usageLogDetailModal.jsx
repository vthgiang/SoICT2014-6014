import React, { useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DatePicker, DialogModal, ErrorLabel, SelectBox, TimePicker } from '../../../../../common-components'

function UsageLogDetailModal(props) {
  const [state, setState] = useState({})
  const [prevProps, setPrevProps] = useState({
    id: null
  })

  // Function format dữ liệu Date thành string
  const formatDate = (date, monthYear = false) => {
    const d = new Date(date)
    let month = `${d.getMonth() + 1}`
    let day = `${d.getDate()}`
    const year = d.getFullYear()

    if (month.length < 2) {
      month = `0${month}`
    }

    if (day.length < 2) {
      day = `0${day}`
    }

    if (monthYear === true) {
      return [month, year].join('-')
    }
    return [day, month, year].join('-')
  }

  if (prevProps.id !== props.id) {
    setState((state) => {
      return {
        ...state,
        id: props.id,
        _id: props._id,
        index: props.index,
        usedByUser: props.usedByUser,
        usedByOrganizationalUnit: props.usedByOrganizationalUnit,
        startDate: props.startDate,
        startTime: props.startTime,
        stopTime: props.stopTime,
        endDate: props.endDate,
        description: props.description,
        errorOnDescription: undefined
      }
    })
    setPrevProps(props)
  }

  const { id } = props
  const { translate, user, department } = props
  const { usedByUser, usedByOrganizationalUnit, startDate, endDate, description, startTime, stopTime, errorOnDescription } = state
  const userlist = user.list
  const departmentlist = department.list
  return (
    <DialogModal
      size='50'
      modalID={`modal-display-usage-detail-infor-${id}`}
      isLoading={false}
      formID={`display-usage-detail-infor-${id}`}
      title='Thông tin chi tiết sử dụng'
      hasSaveButton={false}
    >
      {/* Form chỉnh sửa thông tin sử dụng */}
      <form className='form-group' id={`form-edit-usage-${id}`}>
        <div className='col-md-12'>
          {/* Người sử dụng */}
          <div className='form-group'>
            <label>{translate('asset.general_information.user')}</label>
            <div>
              <div id='usedByUserBox'>
                <SelectBox
                  id={`usedByUser${id}`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  items={[
                    { value: 'null', text: 'Chọn người sử dụng' },
                    ...userlist.map((x) => {
                      return { value: x._id, text: `${x.name} - ${x.email}` }
                    })
                  ]}
                  value={usedByUser}
                  multiple={false}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Đơn vị sử dụng */}
          <div className='form-group'>
            <label>{translate('asset.general_information.user')}</label>
            <div>
              <div id='usedByUserBox'>
                <SelectBox
                  id={`usedByOrganizationalUnit${id}`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  items={[
                    { value: 'null', text: 'Chọn đơn vị sử dụng' },
                    ...departmentlist.map((x) => {
                      return { value: x._id, text: x.name }
                    })
                  ]}
                  value={usedByOrganizationalUnit}
                  multiple={false}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Thời gian bắt đầu sử dụng */}
          <div className='form-group'>
            <label>{translate('asset.general_information.handover_from_date')}</label>
            <DatePicker id={`edit-start-date-${id}`} value={formatDate(startDate)} disabled />
            <TimePicker id='time-picker-start' value={startTime} disabled />
          </div>

          {/* Thời gian kết thúc sử dụng */}
          <div className='form-group'>
            <label>{translate('asset.general_information.handover_to_date')}</label>
            <DatePicker id={`edit-end-date-${id}`} value={formatDate(endDate)} disabled />
            <TimePicker id='time-picker-end' value={stopTime} disabled />
          </div>

          {/* Nội dung */}
          <div className={`form-group ${!errorOnDescription ? '' : 'has-error'}`}>
            <label>{translate('asset.general_information.content')}</label>
            <textarea className='form-control' rows='3' name='description' value={description} autoComplete='off' placeholder='Nội dung' />
            <ErrorLabel content={errorOnDescription} />
          </div>
        </div>
      </form>
    </DialogModal>
  )
}

function mapState(state) {
  const { user, department } = state
  return { user, department }
}

const usageLogDetailModal = connect(mapState, null)(withTranslate(UsageLogDetailModal))

export { usageLogDetailModal as UsageLogDetailModal }
