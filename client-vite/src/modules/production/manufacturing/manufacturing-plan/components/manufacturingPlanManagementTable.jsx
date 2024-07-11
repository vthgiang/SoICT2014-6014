import React, { Component, useState, useEffect } from 'react'
import { formatDate } from '../../../../../helpers/formatDate'
import { ConfirmNotification, DataTableSetting, DatePicker, PaginateBar, SelectMulti } from '../../../../../common-components'
import NewPlanCreateForm from './create-new-plan/newPlanCreateForm'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { manufacturingPlanActions } from '../redux/actions'
import { worksActions } from '../../manufacturing-works/redux/actions'
import { millActions } from '../../manufacturing-mill/redux/actions'
import ManufacturingPlanDetailInfo from './manufacturingPlanDetailInfo'

import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'

function ManufacturingPlanManagementTable(props) {
  const tableIdDefault = 'manufacturing-plan-manager-table'
  const defaultConfig = { limit: 5 }
  const limitDefault = getTableConfiguration(tableIdDefault, defaultConfig).limit

  const [state, setState] = useState({
    currentRole: localStorage.getItem('currentRole'),
    page: 1,
    limit: limitDefault,
    code: '',
    startDate: '',
    endDate: '',
    createdAt: '',
    status: [],
    manufacturingWorks: [],
    commandCode: '',
    manufacturingOrderCode: '',
    salesOrderCode: '',
    progress: [],
    tableId: tableIdDefault
  })

  useEffect(() => {
    const currentRole = localStorage.getItem('currentRole')
    const data = {
      page: state.page,
      limit: state.limit,
      currentRole: currentRole
    }
    props.getAllManufacturingPlans(data)
    props.getAllManufacturingWorks({ currentRole: currentRole })
    props.getAllManufacturingMills({ status: 1, currentRole: currentRole })
  }, [])

  const handleCodeChange = (e) => {
    const { value } = e.target
    setState((state) => ({
      ...state,
      code: value
    }))
  }

  const handleStartDateChange = (value) => {
    setState((state) => ({
      ...state,
      startDate: value
    }))
  }

  const handleEndDateChange = (value) => {
    setState((state) => ({
      ...state,
      endDate: value
    }))
  }

  const handleCreatedAtChange = (value) => {
    setState((state) => ({
      ...state,
      createdAt: value
    }))
  }

  const handleStatusChange = (value) => {
    setState((state) => ({
      ...state,
      status: value
    }))
  }

  const handleSubmitSearch = () => {
    const {
      code,
      startDate,
      endDate,
      createdAt,
      status,
      page,
      limit,
      manufacturingWorks,
      currentRole,
      commandCode,
      manufacturingOrderCode,
      salesOrderCode,
      progress
    } = state
    const data = {
      currentRole: currentRole,
      page: page,
      limit: limit,
      code: code,
      startDate: startDate,
      endDate: endDate,
      createdAt: createdAt,
      status: status,
      manufacturingWorks: manufacturingWorks,
      commandCode: commandCode,
      manufacturingOrderCode: manufacturingOrderCode,
      salesOrderCode: salesOrderCode,
      progress: progress
    }
    props.getAllManufacturingPlans(data)
  }

  const getListManufacturingWorksArr = () => {
    const { manufacturingWorks } = props
    const { listWorks } = manufacturingWorks
    let listManufacturingWorksArr = []
    if (listWorks) {
      listWorks.map((works) => {
        listManufacturingWorksArr.push({
          value: works._id,
          text: works.code + ' - ' + works.name
        })
      })
    }
    return listManufacturingWorksArr
  }

  const handleManufacturingWorksChange = (value) => {
    setState((state) => ({
      ...state,
      manufacturingWorks: value
    }))
  }

  const setLimit = async (limit) => {
    await setState({
      ...state,
      limit: limit,
      page: state.page
    })
    props.getAllManufacturingPlans({ ...state, limit: limit, page: state.page })
  }

  const setPage = async (page) => {
    await setState({
      ...state,
      page: page,
      limit: state.limit
    })
    props.getAllManufacturingPlans({ ...state, page: page, limit: state.limit })
  }

  const handleCommandCodeChange = (e) => {
    const { value } = e.target
    setState((state) => ({
      ...state,
      commandCode: value
    }))
  }

  const handleSalesOrderCodeChange = (e) => {
    const { value } = e.target
    setState((state) => ({
      ...state,
      salesOrderCode: value
    }))
  }

  const handleProgressChange = (value) => {
    setState((state) => ({
      ...state,
      progress: value
    }))
  }

  const handleShowDetailManufacturingPlan = async (plan) => {
    await setState((state) => ({
      ...state,
      planDetail: plan
    }))
    window.$('#modal-detail-info-manufacturing-plan').modal('show')
  }

  const checkRoleApprovers = (plan) => {
    const userId = localStorage.getItem('userId')
    const { approvers } = plan
    for (let i = 0; i < approvers.length; i++) {
      if (userId === approvers[i].approver._id && !approvers[i].approvedTime) {
        return true
      }
    }
    return false
  }

  const isApproverPlan = (plan) => {
    const userId = localStorage.getItem('userId')
    const { approvers } = plan
    let approverIds = approvers.map((x) => x.approver._id)
    if (approverIds.includes(userId)) {
      return true
    }
    return false
  }

  const handleApprovePlan = (plan) => {
    const data = {
      approvers: {
        approver: localStorage.getItem('userId')
      }
    }
    props.handleEditManufacturingPlan(data, plan._id)
  }

  const checkRoleCreator = (plan) => {
    const userId = localStorage.getItem('userId')
    if (plan.creator._id === userId) {
      return true
    }
    return false
  }

  const handleCancelPlan = (plan) => {
    const data = {
      status: 5
    }
    props.handleEditManufacturingPlan(data, plan._id)
  }

  const { translate, manufacturingPlan } = props
  let listPlans = []
  if (manufacturingPlan.listPlans && manufacturingPlan.isLoading === false) {
    listPlans = manufacturingPlan.listPlans
  }
  const { code, startDate, endDate, createdAt, commandCode, salesOrderCode, tableId } = state
  const { totalPages, page } = manufacturingPlan
  return (
    <React.Fragment>
      <ManufacturingPlanDetailInfo planDetail={state.planDetail} />
      <div className='box-body qlcv'>
        <NewPlanCreateForm />
        <div className='form-inline'>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manufacturing.plan.code')}</label>
            <input
              type='text'
              className='form-control'
              value={code}
              onChange={handleCodeChange}
              placeholder='KH202012212'
              autoComplete='off'
            />
          </div>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manufacturing.plan.start_date')}</label>
            <DatePicker id={`start-date-manufacturing-plan`} value={startDate} onChange={handleStartDateChange} disabled={false} />
          </div>
        </div>
        <div className='form-inline'>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manufacturing.plan.sales_order_code')}</label>
            <input
              type='text'
              className='form-control'
              value={salesOrderCode}
              onChange={handleSalesOrderCodeChange}
              placeholder='DKD202012223'
              autoComplete='off'
            />
          </div>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manufacturing.plan.end_date')}</label>
            <DatePicker id={`end-date-manufacturing-plan`} value={endDate} onChange={handleEndDateChange} disabled={false} />
          </div>
        </div>
        <div className='form-inline'>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manufacturing.plan.command_code')}</label>
            <input
              type='text'
              className='form-control'
              value={commandCode}
              onChange={handleCommandCodeChange}
              placeholder='LSX202012224'
              autoComplete='off'
            />
          </div>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manufacturing.plan.created_at')}</label>
            <DatePicker id={`createdAt-manufacturing-plan`} value={createdAt} onChange={handleCreatedAtChange} disabled={false} />
          </div>
        </div>
        <div className='form-inline'>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manufacturing.plan.works')}</label>
            <SelectMulti
              id={`select-multi-works`}
              multiple='multiple'
              options={{
                nonSelectedText: translate('manufacturing.plan.choose_works'),
                allSelectedText: translate('manufacturing.plan.choose_all')
              }}
              className='form-control select2'
              style={{ width: '100%' }}
              items={getListManufacturingWorksArr()}
              onChange={handleManufacturingWorksChange}
            />
          </div>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manufacturing.plan.status')}</label>
            <SelectMulti
              id={`select-multi-status-plan`}
              multiple='multiple'
              options={{
                nonSelectedText: translate('manufacturing.plan.choose_status'),
                allSelectedText: translate('manufacturing.plan.choose_all')
              }}
              className='form-control select2'
              style={{ width: '100%' }}
              items={[
                { value: '1', text: translate('manufacturing.plan.1.content') },
                { value: '2', text: translate('manufacturing.plan.2.content') },
                { value: '3', text: translate('manufacturing.plan.3.content') },
                { value: '4', text: translate('manufacturing.plan.4.content') },
                { value: '5', text: translate('manufacturing.plan.5.content') }
              ]}
              onChange={handleStatusChange}
            />
          </div>
        </div>

        <div className='form-inline'>
          <div className='form-group'>
            <label className='form-control-static'>{translate('manufacturing.plan.progess')}</label>
            <SelectMulti
              id={`select-multi-progress-plan`}
              multiple='multiple'
              options={{
                nonSelectedText: translate('manufacturing.plan.choose_progess'),
                allSelectedText: translate('manufacturing.plan.choose_all')
              }}
              className='form-control select2'
              style={{ width: '100%' }}
              items={[
                { value: '1', text: translate('manufacturing.plan.progress_1') },
                { value: '2', text: translate('manufacturing.plan.progress_2') },
                { value: '3', text: translate('manufacturing.plan.progress_3') }
              ]}
              onChange={handleProgressChange}
            />
          </div>
          <div className='form-group'>
            <label className='form-control-static'></label>
            <button type='button' className='btn btn-success' title={translate('manufacturing.plan.search')} onClick={handleSubmitSearch}>
              {translate('manufacturing.plan.search')}
            </button>
          </div>
        </div>

        <table id={tableId} className='table table-striped table-bordered table-hover'>
          <thead>
            <tr>
              <th>{translate('manufacturing.plan.index')}</th>
              <th>{translate('manufacturing.plan.code')}</th>
              <th>{translate('manufacturing.plan.creator')}</th>
              <th>{translate('manufacturing.plan.approvers')}</th>
              <th>{translate('manufacturing.plan.created_at')}</th>
              <th>{translate('manufacturing.plan.start_date')}</th>
              <th>{translate('manufacturing.plan.end_date')}</th>
              <th>{translate('manufacturing.plan.status')}</th>
              <th>
                {translate('general.action')}
                <DataTableSetting
                  tableId={tableId}
                  columnArr={[
                    translate('manufacturing.plan.index'),
                    translate('manufacturing.plan.code'),
                    translate('manufacturing.plan.creator'),
                    translate('manufacturing.plan.approvers'),
                    translate('manufacturing.plan.created_at'),
                    translate('manufacturing.plan.start_date'),
                    translate('manufacturing.plan.end_date'),
                    translate('manufacturing.plan.status')
                  ]}
                  setLimit={setLimit}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {listPlans &&
              listPlans.length !== 0 &&
              listPlans.map((plan, index) => (
                <tr key={index}>
                  <td >{index + 1}</td>
                  <td>{plan.code}</td>
                  <td>{plan.creator && plan.creator.name}</td>
                  <td>
                    {plan.approvers &&
                      plan.approvers.length &&
                      plan.approvers.map((x, index) => {
                        if (plan.approvers.length === index + 1) {
                          return x.approver.name
                        }
                        return x.approver.name + ', '
                      })}
                  </td>
                  <td>{formatDate(plan.createdAt)}</td>
                  <td>{formatDate(plan.startDate)}</td>
                  <td>{formatDate(plan.endDate)}</td>
                  <td style={{ color: translate(`manufacturing.plan.${plan.status}.color`) }}>
                    {translate(`manufacturing.plan.${plan.status}.content`)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <a
                      style={{ width: '5px' }}
                      title={translate('manufacturing.plan.plan_detail')}
                      onClick={() => {
                        handleShowDetailManufacturingPlan(plan)
                      }}
                    >
                      <i className='material-icons'>view_list</i>
                    </a>
                    {checkRoleApprovers(plan) && plan.status === 1 && (
                      <ConfirmNotification
                        icon='question'
                        title={translate('manufacturing.plan.approve_plan')}
                        content={translate('manufacturing.plan.approve_plan') + ' ' + plan.code}
                        name='done'
                        className='text-green'
                        func={() => handleApprovePlan(plan)}
                      />
                    )}
                    {((checkRoleCreator(plan) && plan.status === 1) ||
                      (isApproverPlan(plan) && (plan.status === 1 || plan.status === 2))) && (
                      <ConfirmNotification
                        icon='question'
                        title={translate('manufacturing.plan.cancel_plan')}
                        content={translate('manufacturing.plan.cancel_plan') + ' ' + plan.code}
                        name='cancel'
                        className='text-red'
                        func={() => handleCancelPlan(plan)}
                      />
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {manufacturingPlan.isLoading ? (
          <div className='table-info-panel'>{translate('confirm.loading')}</div>
        ) : (
          (typeof listPlans === 'undefined' || listPlans.length === 0) && (
            <div className='table-info-panel'>{translate('confirm.no_data')}</div>
          )
        )}
        <PaginateBar pageTotal={totalPages ? totalPages : 0} currentPage={page} func={setPage} />
      </div>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { manufacturingPlan, auth, manufacturingWorks } = state
  return { manufacturingPlan, auth, manufacturingWorks }
}

const mapDispatchToProps = {
  getAllManufacturingPlans: manufacturingPlanActions.getAllManufacturingPlans,
  getAllManufacturingWorks: worksActions.getAllManufacturingWorks,
  getAllManufacturingMills: millActions.getAllManufacturingMills,
  handleEditManufacturingPlan: manufacturingPlanActions.handleEditManufacturingPlan
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ManufacturingPlanManagementTable))
