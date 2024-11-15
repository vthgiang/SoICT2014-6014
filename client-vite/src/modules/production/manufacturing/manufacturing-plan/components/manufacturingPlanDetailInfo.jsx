import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { DataTableSetting, DialogModal, PaginateBar } from '../../../../../common-components'
import { formatDate, formatFullDate } from '../../../../../helpers/formatDate'
import { PaymentActions } from '../../../order/payment/redux/actions'
import SalesOrderDetailForm from '../../../order/sales-order/components/salesOrderDetailForm'
import { SalesOrderActions } from '../../../order/sales-order/redux/actions'
import ManufacturingCommandDetailInfo from '../../manufacturing-command/components/manufacturingCommandDetailInfo'
import { commandActions } from '../../manufacturing-command/redux/actions'
import { manufacturingPlanActions } from '../redux/actions'
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'

function ManufacturingPlanDetailInfo(props) {
  const tableIdDefault = 'manufacturing-plan-detailinfo-table'
  const defaultConfig = { limit: 5 }
  const limitDefault = getTableConfiguration(tableIdDefault, defaultConfig).limit

  const [state, setState] = useState({
    page: 1,
    limit: limitDefault,
    currentRole: localStorage.getItem('currentRole'),
    tableId: tableIdDefault
  })
  const [prevProps, setPrevProps] = useState(props)

  useEffect(() => {
    if (prevProps.planDetail !== props.planDetail) {
      prevProps.getDetailManufacturingPlan(props.planDetail._id)
      const data = {
        page: state.page,
        limit: state.limit,
        currentRole: state.currentRole,
        planCode: props.planDetail.code
      }
      prevProps.getAllManufacturingCommands(data)
      setPrevProps(props)
    }
  }, [props])

  const showDetailSalesOrder = async (data) => {
    await props.getPaymentForOrder({ orderId: data._id, orderType: 1 })
    await props.getSalesOrderDetail(data._id)
    await window.$('#modal-detail-sales-order-1').modal('show')
  }

  const setPage = async (page) => {
    await setState({
      ...state,
      page: page,
      planCode: props.planDetail.code
    })
    props.getAllManufacturingCommands({ ...state, page: page, planCode: props.planDetail.code })
  }

  const setLimit = async (limit) => {
    await setState({
      ...state,
      limit: limit,
      planCode: props.planDetail.code
    })
    props.getAllManufacturingCommands({ ...state, page: page, planCode: props.planDetail.code })
  }

  const handleShowDetailManufacturingCommand = async (command) => {
    await setState((state) => ({
      ...state,
      commandDetail: command
    }))
    window.$('#modal-detail-info-manufacturing-command-3').modal('show')
  }

  const { translate, manufacturingPlan, manufacturingCommand } = props
  const { tableId } = state
  let currentPlan = {}
  if (manufacturingPlan.currentPlan && manufacturingPlan.isLoading === false) {
    currentPlan = manufacturingPlan.currentPlan
  }
  let listCommands = []
  if (manufacturingCommand.listCommands && manufacturingCommand.isLoading === false) {
    listCommands = manufacturingCommand.listCommands
  }
  const { totalPages, page } = manufacturingCommand
  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-detail-info-manufacturing-plan`}
        isLoading={manufacturingPlan.isLoading}
        title={translate('manufacturing.plan.plan_detail')}
        formID={`form-detail-manufacturing-plan`}
        size={75}
        maxWidth={600}
        hasSaveButton={false}
        hasNote={false}
      >
        <SalesOrderDetailForm modalID={1} />
        {<ManufacturingCommandDetailInfo idModal={3} commandDetail={state.commandDetail} />}
        <form id={`form-detail-manufacturing-plan`}>
          <div className='row'>
            <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
              <div className='form-group'>
                <strong>{translate('manufacturing.plan.code')}:&emsp;</strong>
                {currentPlan.code}
              </div>
              <div className='form-group'>
                <strong>{translate('manufacturing.plan.sales_order_code')}:&emsp;</strong>
                {currentPlan && currentPlan.salesOrders && currentPlan.salesOrders.length
                  ? currentPlan.salesOrders.map((x, index) => {
                      if (index === currentPlan.salesOrders.length - 1)
                        return (
                          <a key={index} href='#' onClick={() => showDetailSalesOrder(x)}>
                            {x.code}
                          </a>
                        )
                      return (
                        <a key={index} href='#' onClick={() => showDetailSalesOrder(x)}>
                          {x.code},{' '}
                        </a>
                      )
                    })
                  : ''}
              </div>
              <div className='form-group'>
                <strong>{translate('manufacturing.plan.works')}:&emsp;</strong>
                {currentPlan.manufacturingWorks &&
                  currentPlan.manufacturingWorks.map((x, index) => {
                    if (index === currentPlan.manufacturingWorks.length - 1) return x.name
                    return x.name + ', '
                  })}
              </div>
              <div className='form-group'>
                <strong>{translate('manufacturing.command.creator')}:&emsp;</strong>
                {currentPlan.creator && currentPlan.creator.name + ' - ' + currentPlan.creator.email}
              </div>
            </div>
            <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
              <div className='form-group'>
                <strong>{translate('manufacturing.plan.created_at')}:&emsp;</strong>
                {formatDate(currentPlan.createdAt)}
              </div>
              <div className='form-group'>
                <strong>{translate('manufacturing.plan.start_date')}:&emsp;</strong>
                {formatDate(currentPlan.startDate)}
              </div>
              <div className='form-group'>
                <strong>{translate('manufacturing.plan.end_date')}:&emsp;</strong>
                {formatDate(currentPlan.endDate)}
              </div>
              <div className='form-group'>
                <strong>{translate('manufacturing.plan.status')}:&emsp;</strong>
                {currentPlan.status && (
                  <span style={{ color: translate(`manufacturing.plan.${currentPlan.status}.color`) }}>
                    {translate(`manufacturing.plan.${currentPlan.status}.content`)}
                  </span>
                )}
              </div>
            </div>
            <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
              <div className='form-group'>
                <strong>{translate('manufacturing.plan.description')}:&emsp;</strong>
                {currentPlan.description}
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
              <fieldset className='scheduler-border'>
                <legend className='scheduler-border'>{translate('manufacturing.command.good_info')}</legend>
                <div className={`form-group`}>
                  <table className='table'>
                    <thead>
                      <tr>
                        <th>{translate('manufacturing.command.index')}</th>
                        <th>{translate('manufacturing.command.good_code')}</th>
                        <th>{translate('manufacturing.command.good_name')}</th>
                        <th>{translate('manufacturing.command.good_base_unit')}</th>
                        <th>{translate('manufacturing.command.quantity')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentPlan.goods &&
                        currentPlan.goods.length &&
                        currentPlan.goods.map((x, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{x.good.code}</td>
                            <td>{x.good.name}</td>
                            <td>{x.good.baseUnit}</td>
                            <td>{x.quantity}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </fieldset>
            </div>
          </div>
          <div className='row'>
            <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
              <fieldset className='scheduler-border'>
                <legend className='scheduler-border'>{translate('manufacturing.command.approvers')}</legend>
                {currentPlan.approvers &&
                  currentPlan.approvers.length &&
                  currentPlan.approvers.map((x, index) => {
                    return (
                      <div className='form-group' key={index}>
                        <p>
                          {x.approver.name}
                          {' - '}
                          {x.approver.email}
                          {x.approvedTime && (
                            <React.Fragment>
                              &emsp; &emsp; &emsp;
                              {translate('manufacturing.command.approvedTime')}: &emsp;
                              {formatFullDate(x.approvedTime)}
                            </React.Fragment>
                          )}
                        </p>
                      </div>
                    )
                  })}
              </fieldset>
            </div>
          </div>
          <div className='row'>
            <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
              <fieldset className='scheduler-border'>
                <legend className='scheduler-border'>{translate('manufacturing.plan.list_commands')}</legend>
                <table id={tableId} className='table table-striped table-bordered table-hover'>
                  <thead>
                    <tr>
                      <th>{translate('manufacturing.command.index')}</th>
                      <th>{translate('manufacturing.command.code')}</th>
                      <th>{translate('manufacturing.command.plan_code')}</th>
                      <th>{translate('manufacturing.command.created_at')}</th>
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
              </fieldset>
            </div>
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { manufacturingPlan, manufacturingCommand } = state
  return { manufacturingPlan, manufacturingCommand }
}

const mapDispatchToProps = {
  getDetailManufacturingPlan: manufacturingPlanActions.getDetailManufacturingPlan,
  getPaymentForOrder: PaymentActions.getPaymentForOrder,
  getAllManufacturingCommands: commandActions.getAllManufacturingCommands,
  getSalesOrderDetail: SalesOrderActions.getSalesOrderDetail
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingPlanDetailInfo))
