import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

function MaintainanceLogTab(props) {
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

  if (prevProps.id !== props.id) {
    setState({
      ...state,
      id: props.id,
      maintainanceLogs: props.maintainanceLogs
    })
    setPrevProps(props)
  }

  const formatType = (type) => {
    const { translate } = props

    switch (type) {
      case '1':
        return translate('asset.asset_info.repair')
      case '2':
        return translate('asset.asset_info.replace')
      case '3':
        return translate('asset.asset_info.upgrade')
      case 'Sửa chữa':
        return translate('asset.asset_info.repair')
      case 'Thay thế':
        return translate('asset.asset_info.replace')
      case 'Nâng cấp':
        return translate('asset.asset_info.upgrade')
      default:
        return ''
    }
  }

  const formatStatus = (status) => {
    const { translate } = props

    switch (status) {
      case '1':
        return translate('asset.asset_info.unfulfilled')
      case '2':
        return translate('asset.asset_info.processing')
      case '3':
        return translate('asset.asset_info.made')
      default:
        return ''
    }
  }

  const { id } = props
  const { translate } = props
  const { maintainanceLogs } = state

  var formater = new Intl.NumberFormat()

  return (
    <div id={id} className='tab-pane'>
      <div className='box-body qlcv'>
        {/* Lịch sử sửa chữa - thay thế - nâng cấp */}
        {/* <fieldset className="scheduler-border"> */}
        {/* <legend className="scheduler-border"><h4 className="box-title">{translate('asset.asset_info.maintainance_logs')}</h4></legend> */}

        {/* Bảng thông tin bảo trì */}
        <table className='table table-striped table-bordered table-hover'>
          <thead>
            <tr>
              <th>{translate('asset.general_information.form_code')}</th>
              <th>{translate('asset.general_information.create_date')}</th>
              <th>{translate('asset.general_information.type')}</th>
              <th>{translate('asset.general_information.start_date')}</th>
              <th>{translate('asset.general_information.end_date')}</th>
              <th>{translate('asset.general_information.content')}</th>
              <th>{translate('asset.general_information.expense')}</th>
              <th>{translate('asset.general_information.status')}</th>
            </tr>
          </thead>
          <tbody>
            {maintainanceLogs &&
              maintainanceLogs.length !== 0 &&
              maintainanceLogs.map((x, index) => (
                <tr key={index}>
                  <td>{x.maintainanceCode}</td>
                  <td>{x.createDate ? formatDate(x.createDate) : ''}</td>
                  <td>{formatType(x.type)}</td>
                  <td>{x.startDate ? formatDate(x.startDate) : ''}</td>
                  <td>{x.endDate ? formatDate(x.endDate) : ''}</td>
                  <td>{x.description}</td>
                  <td>{x.expense ? formater.format(parseInt(x.expense)) : ''} VNĐ</td>
                  <td>{formatStatus(x.status)}</td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className='form-group'>
          <strong>{translate('asset.maintainance.total_cost')}:&emsp; </strong>
          {maintainanceLogs &&
            maintainanceLogs.length !== 0 &&
            maintainanceLogs
              .map((item) => parseInt(typeof item.expense === 'number' ? item.expense : 0))
              .reduce((sum, number) => sum + number, 0)}{' '}
          VNĐ
        </div>

        {(!maintainanceLogs || maintainanceLogs.length === 0) && <div className='table-info-panel'>{translate('confirm.no_data')}</div>}
        {/* </fieldset> */}
      </div>
    </div>
  )
}

const maintainanceLogTab = connect(null, null)(withTranslate(MaintainanceLogTab))
export { maintainanceLogTab as MaintainanceLogTab }
