import React, { Component, useState, useEffect } from 'react'
import { ConfirmNotification, DataTableSetting, DatePicker, PaginateBar, SelectBox, SelectMulti } from '../../../../../common-components'
import ManufacturingCommandDetailInfo from './manufacturingCommandDetailInfo'
import { connect } from 'react-redux'
import { commandActions } from '../redux/actions'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { formatDate } from '../../../../../helpers/formatDate'
import { UserActions } from '../../../../super-admin/user/redux/actions'
import ManufacturingLotCreateForm from '../../manufacturing-lot/components/manufacturingLotCreateForm'
import QualityControlForm from './qualityControlForm'
import { generateCode } from '../../../../../helpers/generateCode'
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'
function ManufacturingCommandManagementTable(props) {
  const tableIdDefault = 'manufacturing-command-table'
  const defaultConfig = { limit: 5 }
  const limitDefault = getTableConfiguration(tableIdDefault, defaultConfig).limit

  const [state, setState] = useState({
    currentRole: localStorage.getItem('currentRole'),
    page: 1,
    limit: limitDefault,
    code: '',
    planCode: '',
    manufacturingOrderCode: '',
    salesOrderCode: '',
    lotCode: '',
    accountables: [],
    createdAt: '',
    fromDate: '',
    toDate: '',
    status: [],
    tableId: tableIdDefault
  })

  useEffect(() => {
    const data = {
      page: state.page,
      limit: state.limit,
      currentRole: state.currentRole
    }
    props.getAllManufacturingCommands(data)
    props.getAllUserOfCompany()
  }, [])

  const setPage = async (page) => {
    await setState({
      ...state,
      page: page
    })
    props.getAllManufacturingCommands({ ...state, page: page })
  }

  const setLimit = async (limit) => {
    await setState({
      ...state,
      limit: limit
    })
    props.getAllManufacturingCommands({ ...state, limit: limit })
  }

  const getUserArray = () => {
    const { user } = props
    const { usercompanys } = user
    let userArray = []
    if (usercompanys) {
      usercompanys.map((user) => {
        userArray.push({
          value: user._id,
          text: user.name + ' - ' + user.email
        })
      })
    }
    return userArray
  }

  const handleCodeChange = (e) => {
    const { value } = e.target
    setState({
      ...state,
      code: value
    })
  }

  const handleAccountablesChange = (value) => {
    setState({
      ...state,
      accountables: value
    })
  }

  const handlePlanCodeChange = (e) => {
    const { value } = e.target
    setState({
      ...state,
      planCode: value
    })
  }

  const handleCreatedAtChange = (value) => {
    setState({
      ...state,
      createdAt: value
    })
  }

  const handleManufacturingOrderCodeChange = (e) => {
    const { value } = e.target
    setState({
      ...state,
      manufacturingOrderCode: value
    })
  }

  const handleStartDateChange = (value) => {
    setState({
      ...state,
      fromDate: value
    })
  }

  const handleSalesOrderCodeChange = (e) => {
    const { value } = e.target
    setState({
      ...state,
      salesOrderCode: value
    })
  }

  const handleEndDateChange = (value) => {
    setState({
      ...state,
      toDate: value
    })
  }

  const handleLotCodeChange = (e) => {
    const { value } = e.target
    setState({
      ...state,
      lotCode: value
    })
  }

  const handleStatusChange = (value) => {
    setState({
      ...state,
      status: value
    })
  }

  const handleSubmitSearch = () => {
    const {
      currentRole,
      page,
      limit,
      code,
      accountables,
      planCode,
      createdAt,
      manufacturingOrderCode,
      fromDate,
      salesOrderCode,
      toDate,
      lotCode,
      status
    } = state
    const data = {
      currentRole: currentRole,
      page: page,
      limit: limit,
      code: code,
      accountables: accountables,
      planCode: planCode,
      createdAt: createdAt,
      manufacturingOrderCode: manufacturingOrderCode,
      fromDate: fromDate,
      salesOrderCode: salesOrderCode,
      toDate: toDate,
      lotCode: lotCode,
      status: status
    }
    props.getAllManufacturingCommands(data)
  }

  const handleShowDetailManufacturingCommand = async (command) => {
    await setState((state) => ({
      ...state,
      commandDetail: command
    }))
    window.$('#modal-detail-info-manufacturing-command-1').modal('show')
  }

  const checkRoleAccountables = (commands) => {
    const { accountables } = commands
    const userId = localStorage.getItem('userId')
    let accoutableIds = accountables.map((x) => x._id)
    if (accoutableIds.includes(userId)) {
      return true
    }
    return false
  }

  const handleStartCommand = (command) => {
    const data = {
      status: 3
    }
    props.handleEditCommand(command._id, data)
  }

  const handleEndCommand = async (command) => {
    // const data = {
    //     status: 4
    // }
    // props.handleEditCommand(command._id, data);
    await setState({
      ...state,
      command: command,
      code1: generateCode('LTP'),
      code2: generateCode('LPP')
    })

    window.$('#modal-create-manufacturing-lot').modal('show')
  }

  const checkRoleQualityControl = (command) => {
    const { qualityControlStaffs } = command
    const userId = localStorage.getItem('userId')
    let qcIds = qualityControlStaffs.map((x) => x.staff._id)

    if (qcIds.includes(userId)) {
      return true
    }
    return false
  }

  const findIndexOfStaff = (array, id) => {
    let result = -1
    array.forEach((element, index) => {
      if (element.staff._id === id) {
        result = index
      }
    })
    return result
  }

  const handleQualityControlCommand = async (command) => {
    const userId = localStorage.getItem('userId')
    let index = findIndexOfStaff(command.qualityControlStaffs, userId)
    let qcStatus = command.qualityControlStaffs[index].status
    let qcContent = command.qualityControlStaffs[index].content ? command.qualityControlStaffs[index].content : ''
    console.log(qcContent)
    await setState({
      ...state,
      currentQCCommand: command,
      qcStatus: qcStatus,
      qcContent: qcContent
    })
    window.$('#modal-quality-control').modal('show')
  }

  const reloadCommandTable = () => {
    const data = {
      page: 1,
      limit: 5,
      currentRole: state.currentRole
    }
    props.getAllManufacturingCommands(data)
    window.$('#modal-detail-info-manufacturing-command-1').modal('hide')
  }

  const checkRoleCreator = (command) => {
    const userId = localStorage.getItem('userId')
    if (userId === command.creator._id) {
      return true
    }
    return false
  }

  const cancelManufacturingCommand = (command) => {
    const data = {
      status: 5
    }
    props.handleEditCommand(command._id, data)
  }

  const checkRoleApprovers = (command) => {
    const userId = localStorage.getItem('userId')
    const { approvers } = command
    let approverIds = approvers.map((x) => x.approver._id)
    if (approverIds.includes(userId)) {
      return true
    }
    return false
  }

  const { translate, manufacturingCommand } = props
  let listCommands = []
  if (manufacturingCommand.listCommands && manufacturingCommand.isLoading === false) {
    listCommands = manufacturingCommand.listCommands
  }
  const { totalPages, page } = manufacturingCommand
  const { code, accountables, planCode, createdAt, manufacturingOrderCode, fromDate, salesOrderCode, toDate, lotCode, status, tableId } =
    state
  getUserArray()
  return (
    <React.Fragment>
      {<ManufacturingCommandDetailInfo idModal={1} commandDetail={state.commandDetail} onReloadCommandTable={reloadCommandTable} />}
      {state.command && <ManufacturingLotCreateForm command={state.command} code1={state.code1} code2={state.code2} />}
      {state.currentQCCommand && (
        <QualityControlForm
          commandId={state.currentQCCommand._id}
          code={state.currentQCCommand.code}
          status={state.qcStatus}
          content={state.qcContent}
        />
      )}
      <div className='box-body qlcv'>
        <div className='form-inline'>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manufacturing.command.code')}</label>
            <input
              type='text'
              className='form-control'
              value={code}
              onChange={handleCodeChange}
              placeholder='LSX202012245'
              autoComplete='off'
            />
          </div>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manufacturing.command.accountables')}</label>
            <SelectBox
              id={`select-accoutables`}
              className='form-control select2'
              style={{ width: '100%' }}
              items={getUserArray()}
              value={accountables}
              onChange={handleAccountablesChange}
              multiple={true}
            />
          </div>
        </div>
        <div className='form-inline'>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manufacturing.command.plan_code')}</label>
            <input
              type='text'
              className='form-control'
              value={planCode}
              onChange={handlePlanCodeChange}
              placeholder='KH202011122'
              autoComplete='off'
            />
          </div>

          <div className='form-group'>
            <label className='form-control-static'>{translate('manufacturing.command.created_at')}</label>
            <DatePicker id={`created-at-command-managemet-table`} value={createdAt} onChange={handleCreatedAtChange} disabled={false} />
          </div>
        </div>
        <div className='form-inline'>
          {/* <div className="form-group">
                        <label className="form-control-static">{translate('manufacturing.command.manufacturing_order_code')}</label>
                        <input type="text" className="form-control" value={manufacturingOrderCode} onChange={handleManufacturingOrderCodeChange} placeholder="DSX202012221" autoComplete="off" />
                    </div> */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('manufacturing.command.sales_order_code')}</label>
            <input
              type='text'
              className='form-control'
              value={salesOrderCode}
              onChange={handleSalesOrderCodeChange}
              placeholder='DKD202032210'
              autoComplete='off'
            />
          </div>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manufacturing.command.from_date')}</label>
            <DatePicker id={`start-date-command-management-table`} value={fromDate} onChange={handleStartDateChange} disabled={false} />
          </div>
        </div>
        <div className='form-inline'>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manufacturing.command.lot_code')}</label>
            <input
              type='text'
              className='form-control'
              value={lotCode}
              onChange={handleLotCodeChange}
              placeholder='LOSX202031233'
              autoComplete='off'
            />
          </div>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manufacturing.command.to_date')}</label>
            <DatePicker id={`end-date-command-management-table`} value={toDate} onChange={handleEndDateChange} disabled={false} />
          </div>
        </div>
        <div className='form-inline'>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manufacturing.command.status')}</label>
            <SelectMulti
              id={`select-multi-process-command`}
              multiple='multiple'
              options={{
                nonSelectedText: translate('manufacturing.command.choose_status'),
                allSelectedText: translate('manufacturing.command.choose_all')
              }}
              className='form-control select2'
              style={{ width: '100%' }}
              items={[
                { value: '6', text: translate('manufacturing.command.6.content') },
                { value: '1', text: translate('manufacturing.command.1.content') },
                { value: '2', text: translate('manufacturing.command.2.content') },
                { value: '3', text: translate('manufacturing.command.3.content') },
                { value: '4', text: translate('manufacturing.command.4.content') },
                { value: '5', text: translate('manufacturing.command.5.content') }
              ]}
              onChange={handleStatusChange}
            />
          </div>
          <div className='form-group'>
            <label className='form-control-static'></label>
            <button
              type='button'
              className='btn btn-success'
              title={translate('manufacturing.command.search')}
              onClick={handleSubmitSearch}
            >
              {translate('manufacturing.command.search')}
            </button>
          </div>
        </div>
        <table id={tableId} className='table table-striped table-bordered table-hover'>
          <thead>
            <tr>
              <th>{translate('manufacturing.command.index')}</th>
              <th>{translate('manufacturing.command.code')}</th>
              <th>{translate('manufacturing.command.plan_code')}</th>
              <th>{translate('manufacturing.command.created_at')}</th>
              <th>{translate('manufacturing.command.approvers')}</th>
              <th>{translate('manufacturing.command.qualityControlStaffs')}</th>
              <th>{translate('manufacturing.command.accountables')}</th>
              <th>{translate('manufacturing.command.mill')}</th>
              <th>{translate('manufacturing.command.start_date')}</th>
              <th>{translate('manufacturing.command.end_date')}</th>
              <th>{translate('manufacturing.command.status')}</th>
              <th style={{ width: '120px', textAlign: 'center' }}>
                {translate('general.action')}
                <DataTableSetting
                  tableId={tableId}
                  columnArr={[
                    translate('manufacturing.command.index'),
                    translate('manufacturing.command.code'),
                    translate('manufacturing.command.plan_code'),
                    translate('manufacturing.command.created_at'),
                    translate('manufacturing.command.approvers'),
                    translate('manufacturing.command.qualityControlStaffs'),
                    translate('manufacturing.command.accountables'),
                    translate('manufacturing.command.mill'),
                    translate('manufacturing.command.start_date'),
                    translate('manufacturing.command.end_date'),
                    translate('manufacturing.command.status')
                  ]}
                  setLimit={setLimit}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {listCommands &&
              listCommands.length !== 0 &&
              listCommands.map((command, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{command.code}</td>
                  <td>{command.manufacturingPlan !== undefined && command.manufacturingPlan.code}</td>
                  <td>{formatDate(command.createdAt)}</td>
                  <td>
                    {command.approvers &&
                      command.approvers.map((x, index) => {
                        if (command.approvers.length === index + 1) {
                          return x.approver.name
                        }
                        return x.approver.name + ', '
                      })}
                  </td>
                  <td>
                    {command.qualityControlStaffs &&
                      command.qualityControlStaffs.map((staff, index) => {
                        if (command.qualityControlStaffs.length === index + 1) return staff.staff.name
                        return staff.staff.name + ', '
                      })}
                  </td>
                  <td>
                    {command.accountables &&
                      command.accountables.map((acc, index) => {
                        if (command.accountables.length === index + 1) return acc.name
                        return acc.name + ', '
                      })}
                  </td>
                  <td>{command.manufacturingMill && command.manufacturingMill.name}</td>
                  <td>
                    {translate('manufacturing.command.turn') +
                      ' ' +
                      command.startTurn +
                      ' ' +
                      translate('manufacturing.command.day') +
                      ' ' +
                      formatDate(command.startDate)}
                  </td>
                  <td>
                    {' '}
                    {translate('manufacturing.command.turn') +
                      ' ' +
                      command.endTurn +
                      ' ' +
                      translate('manufacturing.command.day') +
                      ' ' +
                      formatDate(command.endDate)}
                  </td>
                  <td style={{ color: translate(`manufacturing.command.${command.status}.color`) }}>
                    {translate(`manufacturing.command.${command.status}.content`)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <a
                      style={{ width: '5px' }}
                      title={translate('manufacturing.command.command_detail')}
                      onClick={() => {
                        handleShowDetailManufacturingCommand(command)
                      }}
                    >
                      <i className='material-icons'>view_list</i>
                    </a>
                    {checkRoleAccountables(command) && command.status === 2 && (
                      <ConfirmNotification
                        icon='question'
                        title={translate('manufacturing.command.start_command')}
                        content={translate('manufacturing.command.start_command') + ' ' + command.code}
                        name='play_circle_filled'
                        className='text-yellow'
                        func={() => handleStartCommand(command)}
                      />
                    )}
                    {checkRoleQualityControl(command) && (command.status === 3 || command.status === 4) && (
                      <a
                        style={{ width: '5px', color: 'green' }}
                        title={translate('manufacturing.command.quality_control_command')}
                        onClick={() => {
                          handleQualityControlCommand(command)
                        }}
                      >
                        <i className='material-icons'>thumb_up</i>
                      </a>
                    )}
                    {checkRoleAccountables(command) && command.status === 3 && (
                      <ConfirmNotification
                        icon='question'
                        title={translate('manufacturing.command.end_command')}
                        content={translate('manufacturing.command.end_command') + ' ' + command.code}
                        name='check_circle'
                        className='text-green'
                        func={() => handleEndCommand(command)}
                      />
                    )}
                    {((checkRoleCreator(command) && (command.status === 6 || command.status === 1)) ||
                      (checkRoleApprovers(command) && (command.status === 6 || command.status === 1 || command.status === 2))) && (
                      <ConfirmNotification
                        icon='question'
                        title={translate('manufacturing.command.cancel_command')}
                        content={translate('manufacturing.command.cancel_command') + ' ' + command.code}
                        name='cancel'
                        className='text-red'
                        func={() => cancelManufacturingCommand(command)}
                      />
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {manufacturingCommand.isLoading ? (
          <div className='table-info-panel'>{translate('confirm.loading')}</div>
        ) : (
          (typeof listCommands === 'undefined' || listCommands.length === 0) && (
            <div className='table-info-panel'>{translate('confirm.no_data')}</div>
          )
        )}
        <PaginateBar pageTotal={totalPages ? totalPages : 0} currentPage={page} func={setPage} />
      </div>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { manufacturingCommand, user } = state
  return { manufacturingCommand, user }
}

const mapDispatchToProps = {
  getAllManufacturingCommands: commandActions.getAllManufacturingCommands,
  getAllUserOfCompany: UserActions.getAllUserOfCompany,
  handleEditCommand: commandActions.handleEditCommand
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingCommandManagementTable))
