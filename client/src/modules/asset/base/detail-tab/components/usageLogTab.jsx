import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { CalendarUsage } from '../../create-tab/components/calendarUsage'
function UsageLogTab(props) {
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
      usageLogs: props.usageLogs,
      typeRegisterForUse: props.typeRegisterForUse,
      managedBy: props.managedBy
    })
    setPrevProps(props)
  }

  const { id, assetId } = props
  const { translate, user, department } = props
  const { usageLogs, typeRegisterForUse, managedBy } = state
  var userlist = user.list,
    departmentlist = department.list

  return (
    <div id={id} className='tab-pane'>
      <div className='box-body qlcv'>
        {/* Lịch sử cấp phát - điều chuyển - thu hồi */}
        {/* <fieldset className="scheduler-border"> */}
        {/* <legend className="scheduler-border"><h4 className="box-title">{translate('asset.asset_info.usage_logs')}</h4></legend> */}

        {/* Bảng thông tin sử dụng */}
        {typeRegisterForUse != 2 && (
          <table className='table table-striped table-bordered table-hover'>
            <thead>
              <tr>
                <th>{translate('asset.general_information.user')}</th>
                <th>{translate('asset.general_information.organization_unit')}</th>
                <th>{translate('asset.general_information.handover_from_date')}</th>
                <th>{translate('asset.general_information.handover_to_date')}</th>
                <th>{translate('asset.general_information.content')}</th>
              </tr>
            </thead>
            <tbody>
              {usageLogs &&
                usageLogs.length !== 0 &&
                usageLogs.map((x, index) => (
                  <tr key={index}>
                    <td>
                      {x.usedByUser && userlist.length && userlist.filter((item) => item._id === x.usedByUser).pop()
                        ? userlist.filter((item) => item._id === x.usedByUser).pop().name
                        : ''}
                    </td>
                    <td>
                      {x.usedByOrganizationalUnit &&
                      departmentlist.length &&
                      departmentlist.filter((item) => item._id === x.usedByOrganizationalUnit).pop()
                        ? departmentlist.filter((item) => item._id === x.usedByOrganizationalUnit).pop().name
                        : ''}
                    </td>
                    <td>{x.startDate ? formatDate(x.startDate) : ''}</td>
                    <td>{x.endDate ? formatDate(x.endDate) : ''}</td>
                    <td>{x.description}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
        {typeRegisterForUse == 2 && (
          <CalendarUsage
            id={`edit-calendar-detail-tab-${assetId}`}
            assetId={assetId}
            usageLogs={usageLogs}
            managedBy={managedBy}
            typeRegisterForUse={typeRegisterForUse}
            linkPage={props.linkPage}
          />
        )}
        {typeRegisterForUse !== 2 && (!usageLogs || usageLogs.length === 0) && (
          <div className='table-info-panel'>{translate('confirm.no_data')}</div>
        )}
        {/* </fieldset> */}
      </div>
    </div>
  )
}
function mapState(state) {
  const { user, department } = state
  return { user, department }
}
const usageLogTab = connect(mapState, null)(withTranslate(UsageLogTab))
export { usageLogTab as UsageLogTab }
