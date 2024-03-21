import React, { Component } from 'react'
import { connect } from 'react-redux'
import { formatDate } from '../../../../../helpers/formatDate'
import { ConfirmNotification, DataTableSetting, DatePicker, PaginateBar, SelectMulti } from '../../../../../common-components'
import PurchasingRequestDetailForm from './purchasingRequestDetailForm'
import PurchasingRequestEditForm from './purchasingRequestEditForm'
import PurchasingRequestCreateForm from './purchasingRequestCreateForm'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { purchasingRequestActions } from '../redux/actions'
import { GoodActions } from '../../../common-production/good-management/redux/actions'
import { LotActions } from '../../../warehouse/inventory-management/redux/actions'
import { purchasingRequest } from '../redux/reducers'
class PurchasingRequestManagementTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 1,
      limit: 5,
      createdAt: '',
      receiveTime: '',
      code: '',
      status: null,
      planCode: ''
    }
  }

  componentDidMount() {
    const { limit, page } = this.state
    this.props.getAllPurchasingRequests({ limit, page })
    this.props.getAllGoodsByType({ type: 'material' })
  }

  setLimit = async (limit) => {
    await this.setState({
      limit: limit,
      page: this.state.page
    })

    let page = this.state.page
    this.props.getAllPurchasingRequests({ page, limit })
  }

  setPage = async (page) => {
    await this.setState({
      limit: this.state.limit,
      page: page
    })
    let limit = this.state.limit
    this.props.getAllPurchasingRequests({ page, limit })
  }

  handleCodeChange = (e) => {
    const { value } = e.target
    this.setState({
      code: value
    })
  }

  handleCreatedAtChange = (value) => {
    this.setState({
      createdAt: value
    })
  }

  handlePlanCodeChange = (e) => {
    const { value } = e.target
    this.setState({
      planCode: value
    })
  }

  handleReceiveTimeChange = (value) => {
    this.setState({
      receiveTime: value
    })
  }

  handleStatusChange = (value) => {
    if (value.length === 0) {
      value = null
    }
    this.setState({
      status: value
    })
  }

  handleSubmitSearch = async () => {
    await this.setState({
      page: 1
    })

    const data = {
      limit: this.state.limit,
      page: this.state.page,
      createdAt: this.state.createdAt,
      intendReceiveTime: this.state.receiveTime,
      planCode: this.state.planCode,
      code: this.state.code,
      status: this.state.status
    }

    this.props.getAllPurchasingRequests(data)
  }

  handleShowDetailPurchasingRequest = async (purchasingRequest) => {
    await this.setState((state) => ({
      ...state,
      purchasingRequestDetail: purchasingRequest
    }))

    window.$('#modal-detail-info-purchasing-request').modal('show')
  }

  handleEditPurchasingRequest = async (purchasingRequest) => {
    let listGoods = []
    listGoods = purchasingRequest.materials.map((material) => {
      return {
        goodId: material.good._id,
        goodObject: material.good,
        quantity: material.quantity
      }
    })

    if (purchasingRequest.manufacturingCommand) {
      const materials = purchasingRequest.manufacturingCommand.good.materials
      let materialIds = []
      materials.map((x) => {
        materialIds.push(x.good._id)
      })
      await this.props.getInventoryByGoodIds({
        array: materialIds
      })
    }

    await this.setState((state) => ({
      ...state,
      currentRow: purchasingRequest,
      listGoods: listGoods
    }))
    console.log(this.state.listGoods)
    window.$('#modal-edit-purchasing-request').modal('show')
  }

  cancelPurchasingRequest = (purchasingRequest) => {
    const data = {
      status: 3
    }
    this.props.editPurchasingRequest(purchasingRequest._id, data)
  }

  render() {
    const { translate, purchasingRequest } = this.props
    let listPurchasingRequests = []
    if (purchasingRequest.listPurchasingRequests) {
      listPurchasingRequests = purchasingRequest.listPurchasingRequests
    }
    const { totalPages, page } = purchasingRequest
    const { code, createdAt, planCode, receiveTime } = this.state
    return (
      <React.Fragment>
        {<PurchasingRequestDetailForm purchasingRequestDetail={this.state.purchasingRequestDetail} />}
        {this.state.currentRow && this.state.listGoods && (
          <PurchasingRequestEditForm
            purchasingRequestId={this.state.currentRow._id}
            code={this.state.currentRow.code}
            intendReceiveTime={this.state.currentRow.intendReceiveTime}
            description={this.state.currentRow.description}
            listGoods={this.state.listGoods}
            currentCommand={this.state.currentRow.manufacturingCommand}
          />
        )}
        <div className='box-body qlcv'>
          <PurchasingRequestCreateForm />
          <div className='form-inline'>
            <div className='form-group'>
              <label className='form-control-static'>{translate('manufacturing.purchasing_request.code')}</label>
              <input
                type='text'
                className='form-control'
                value={code}
                onChange={this.handleCodeChange}
                placeholder='PDN202013021223'
                autoComplete='off'
              />
            </div>
            <div className='form-group'>
              <label>{translate('manufacturing.purchasing_request.createdAt')}</label>
              <DatePicker id={`createdAt-purchasing-request`} value={createdAt} onChange={this.handleCreatedAtChange} disabled={false} />
            </div>
          </div>
          <div className='form-inline'>
            <div className='form-group'>
              <label className='form-control-static'>{translate('manufacturing.purchasing_request.planCode')}</label>
              <input
                type='text'
                className='form-control'
                value={planCode}
                onChange={this.handlePlanCodeChange}
                placeholder='KH2020120023333'
                autoComplete='off'
              />
            </div>
            <div className='form-group'>
              <label>{translate('manufacturing.purchasing_request.receiveTime')}</label>
              <DatePicker
                id={`receiveTime-purchasing-request`}
                // dateFormat={dateFormat}
                value={receiveTime}
                onChange={this.handleReceiveTimeChange}
                disabled={false}
              />
            </div>
          </div>
          <div className='form-inline'>
            <div className='form-group'>
              <label>{translate('manufacturing.purchasing_request.status')}</label>
              <SelectMulti
                id={`select-status-purchasing-request`}
                className='form-control select2'
                multiple='multiple'
                options={{
                  nonSelectedText: translate('manufacturing.purchasing_request.select_status'),
                  allSelectedText: translate('manufacturing.purchasing_request.select_all')
                }}
                style={{ width: '100%' }}
                items={[
                  { value: 1, text: translate('manufacturing.purchasing_request.1.content') },
                  { value: 2, text: translate('manufacturing.purchasing_request.2.content') },
                  { value: 3, text: translate('manufacturing.purchasing_request.3.content') }
                ]}
                onChange={this.handleStatusChange}
              />
            </div>
            <div className='form-group'>
              <label className='form-control-static'></label>
              <button
                type='button'
                className='btn btn-success'
                title={translate('manufacturing.purchasing_request.search')}
                onClick={this.handleSubmitSearch}
              >
                {translate('manufacturing.purchasing_request.search')}
              </button>
            </div>
          </div>
          <table id='purchasing-request-table' className='table table-striped table-bordered table-hover'>
            <thead>
              <tr>
                <th>{translate('manufacturing.purchasing_request.index')}</th>
                <th>{translate('manufacturing.purchasing_request.code')}</th>
                <th>{translate('manufacturing.purchasing_request.command_code')}</th>
                <th>{translate('manufacturing.purchasing_request.creator')}</th>
                <th>{translate('manufacturing.purchasing_request.createdAt')}</th>
                <th>{translate('manufacturing.purchasing_request.receiveTime')}</th>
                <th>{translate('manufacturing.purchasing_request.status')}</th>
                <th style={{ width: '120px', textAlign: 'center' }}>
                  {translate('table.action')}
                  <DataTableSetting
                    tableId='purchasing-request-table'
                    columnArr={[
                      translate('manufacturing.purchasing_request.index'),
                      translate('manufacturing.purchasing_request.code'),
                      translate('manufacturing.purchasing_request.command_code'),
                      translate('manufacturing.purchasing_request.creator'),
                      translate('manufacturing.purchasing_request.createdAt'),
                      translate('manufacturing.purchasing_request.receiveTime'),
                      translate('manufacturing.purchasing_request.status')
                    ]}
                    limit={this.state.limit}
                    hideColumnOption={true}
                    setLimit={this.setLimit}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {listPurchasingRequests &&
                listPurchasingRequests.length !== 0 &&
                listPurchasingRequests.map((purchasingRequest, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{purchasingRequest.code}</td>
                    <td>{purchasingRequest.manufacturingCommand ? purchasingRequest.manufacturingCommand.code : ''}</td>
                    <td>{purchasingRequest.creator && purchasingRequest.creator.name}</td>
                    <td>{formatDate(purchasingRequest.createdAt)}</td>
                    <td>{formatDate(purchasingRequest.intendReceiveTime)}</td>
                    <td style={{ color: translate(`manufacturing.purchasing_request.${purchasingRequest.status}.color`) }}>
                      {translate(`manufacturing.purchasing_request.${purchasingRequest.status}.content`)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <a
                        style={{ width: '5px' }}
                        title={translate('manufacturing.purchasing_request.purchasing_request_detail')}
                        onClick={() => {
                          this.handleShowDetailPurchasingRequest(purchasingRequest)
                        }}
                      >
                        <i className='material-icons'>view_list</i>
                      </a>
                      {purchasingRequest.status !== 3 && (
                        <a
                          className='edit text-yellow'
                          style={{ width: '5px' }}
                          title={translate('manufacturing.purchasing_request.purchasing_request_edit')}
                          onClick={() => this.handleEditPurchasingRequest(purchasingRequest)}
                        >
                          <i className='material-icons'>edit</i>
                        </a>
                      )}
                      <ConfirmNotification
                        icon='question'
                        title={translate('manufacturing.purchasing_request.cancel_purchasing_request')}
                        content={translate('manufacturing.purchasing_request.cancel_purchasing_request') + ' ' + purchasingRequest.code}
                        name='cancel'
                        className='text-red'
                        func={() => this.cancelPurchasingRequest(purchasingRequest)}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {purchasingRequest.isLoading ? (
            <div className='table-info-panel'>{translate('confirm.loading')}</div>
          ) : (
            (typeof listPurchasingRequests === 'undefined' || listPurchasingRequests.length === 0) && (
              <div className='table-info-panel'>{translate('confirm.no_data')}</div>
            )
          )}
          <PaginateBar pageTotal={totalPages ? totalPages : 0} currentPage={page} func={this.setPage} />
        </div>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  const { purchasingRequest } = state
  return { purchasingRequest }
}

const mapDispatchToProps = {
  getAllPurchasingRequests: purchasingRequestActions.getAllPurchasingRequests,
  getAllGoodsByType: GoodActions.getAllGoodsByType,
  getInventoryByGoodIds: LotActions.getInventoryByGoodIds,
  editPurchasingRequest: purchasingRequestActions.editPurchasingRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(PurchasingRequestManagementTable))
