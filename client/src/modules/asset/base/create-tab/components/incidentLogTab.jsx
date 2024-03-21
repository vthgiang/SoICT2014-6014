import React, { Component, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { IncidentLogAddModal, IncidentLogEditModal } from './combinedContent'

function IncidentLogTab(props) {
  const [state, setState] = useState({
    incidentLogs: []
  })
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

  // Bắt sự kiện click edit phiếu
  const handleEdit = async (value, index) => {
    await setState((state) => {
      return {
        ...state,
        currentRow: { ...value, index: index }
      }
    })
    window.$(`#modal-edit-incident-editIncident${index}`).modal('show')
  }

  // Function thêm thông tin phiếu
  const handleAddIncident = (data) => {
    let { incidentLogs } = state
    if (incidentLogs === undefined) {
      incidentLogs = []
    }
    const values = [...incidentLogs, data]

    setState((state) => {
      return {
        ...state,
        incidentLogs: values
      }
    })
    props.handleAddIncident(values, data)
  }

  // Function chỉnh sửa thông tin phiếu
  const handleEditIncident = (data) => {
    let { incidentLogs } = state
    if (incidentLogs === undefined) {
      incidentLogs = []
    }
    incidentLogs[data.index] = data
    data.reportedBy = data.reportedBy ? data.reportedBy : localStorage.getItem('userId')

    setState((state) => {
      return {
        ...state,
        incidentLogs: incidentLogs
      }
    })
    props.handleEditIncident(incidentLogs, data)
  }

  // Function bắt sự kiện xoá thông tin phiếu
  const handleDeleteIncident = (index) => {
    let { incidentLogs } = state
    if (incidentLogs === undefined) {
      incidentLogs = []
    }
    var data = incidentLogs[index]
    incidentLogs.splice(index, 1)
    setState({
      ...state,
      incidentLogs: [...incidentLogs]
    })
    props.handleDeleteIncident([...incidentLogs], data)
  }

  if (prevProps.id !== props.id) {
    setState((state) => {
      return {
        ...state,
        id: props.id,
        incidentLogs: props.incidentLogs
      }
    })
    setPrevProps(props)
  }

  const formatType = (type) => {
    const { translate } = props

    if (type === '1') {
      return translate('asset.general_information.damaged')
    } else if (type === '2') {
      return translate('asset.general_information.lost')
    } else if (type === 'Hỏng hóc') {
      return translate('asset.general_information.damaged')
    } else if (type === 'Mất') {
      return translate('asset.general_information.lost')
    } else return ''
  }

  const formatStatus = (status) => {
    const { translate } = props

    if (status === '1') {
      return translate('asset.general_information.waiting')
    } else if (status === '2') {
      return translate('asset.general_information.processed')
    } else return ''
  }

  const { id } = props
  const { translate, user } = props
  const { incidentLogs, currentRow } = state

  var userlist = user.list

  return (
    <div id={id} className='tab-pane'>
      <div className='box-body qlcv'>
        {/* Lịch sử sự cố */}
        {/* <fieldset className="scheduler-border">
                    <legend className="scheduler-border"><h4 className="box-title">{translate('asset.asset_info.incident_list')}</h4></legend> */}

        {/* Form thêm thông tin sự cố */}
        <IncidentLogAddModal handleChange={handleAddIncident} id={`addIncident${id}`} />

        {/* Bảng thông tin sự cố */}
        <table className='table table-striped table-bordered table-hover'>
          <thead>
            <tr>
              <th style={{ width: '10%' }}>{translate('asset.general_information.incident_code')}</th>
              <th style={{ width: '10%' }}>{translate('asset.general_information.incident_type')}</th>
              <th style={{ width: '10%' }}>{translate('asset.general_information.reported_by')}</th>
              <th style={{ width: '10%' }}>{translate('asset.general_information.date_incident')}</th>
              <th style={{ width: '10%' }}>{translate('asset.general_information.content')}</th>
              <th style={{ width: '10%' }}>{translate('asset.general_information.status')}</th>
              <th style={{ width: '100px', textAlign: 'center' }}>{translate('table.action')}</th>
            </tr>
          </thead>
          <tbody>
            {incidentLogs &&
              incidentLogs.length !== 0 &&
              incidentLogs.map((x, index) => (
                <tr key={index}>
                  <td>{x.incidentCode}</td>
                  <td>{formatType(x.type)}</td>
                  <td>
                    {x.reportedBy
                      ? userlist.length && userlist.filter((item) => item._id === x.reportedBy).pop()
                        ? userlist.filter((item) => item._id === x.reportedBy).pop().name
                        : ''
                      : ''}
                  </td>
                  <td>{x.dateOfIncident ? formatDate(x.dateOfIncident) : ''}</td>
                  <td>{x.description}</td>
                  <td>{formatStatus(x.statusIncident)}</td>
                  <td>
                    <a
                      onClick={() => handleEdit(x, index)}
                      className='edit text-yellow'
                      style={{ width: '5px' }}
                      title={translate('asset.asset_info.edit_incident_info')}
                    >
                      <i className='material-icons'>edit</i>
                    </a>
                    <a className='delete' title='Delete' data-toggle='tooltip' onClick={() => handleDeleteIncident(index)}>
                      <i className='material-icons'></i>
                    </a>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {(!incidentLogs || incidentLogs.length === 0) && <div className='table-info-panel'>{translate('confirm.no_data')}</div>}
        {/* </fieldset> */}
      </div>

      {/* Form chỉnh sửa thông tin sự cố */}
      {currentRow && (
        <IncidentLogEditModal
          id={`editIncident${currentRow.index}`}
          _id={currentRow._id}
          index={currentRow.index}
          incidentCode={currentRow.incidentCode}
          type={currentRow.type}
          reportedBy={currentRow.reportedBy}
          dateOfIncident={formatDate(currentRow.dateOfIncident)}
          description={currentRow.description}
          statusIncident={currentRow.statusIncident}
          handleChange={handleEditIncident}
        />
      )}
    </div>
  )
}

function mapState(state) {
  const { user } = state
  return { user }
}

const incidentLogTab = connect(mapState, null)(withTranslate(IncidentLogTab))

export { incidentLogTab as IncidentLogTab }
