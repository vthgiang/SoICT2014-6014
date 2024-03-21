import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { SlaActions } from '../redux/actions'
import { GoodActions } from '../../../common-production/good-management/redux/actions'
import { PaginateBar, DataTableSetting, SelectBox, DeleteNotification, ConfirmNotification } from '../../../../../common-components'
import SlaCreateForm from './slaCreateForm'
import SlaEditForm from './slaEditForm'
import SlaDetailForm from './slaDetailForm'

function SLAMangementTable(props) {
  const [state, setState] = useState({
    page: 1,
    limit: 5,
    code: '',
    title: '',
    status: true,
    slaDetail: {}
  })

  useEffect(() => {
    const { page, limit, status } = state
    props.getAllSLAs({ page, limit, status })
    props.getAllGoodsByType({ type: 'product' })
  }, [])

  const setPage = async (page) => {
    await setState({
      ...state,
      page: page
    })
    const data = {
      limit: state.limit,
      page: page,
      status: state.status
    }
    props.getAllSLAs(data)
  }

  const setLimit = async (limit) => {
    await setState({
      ...state,
      limit: limit
    })
    const data = {
      limit: limit,
      page: state.page,
      status: state.status
    }
    props.getAllSLAs(data)
  }

  const handleCodeChange = (e) => {
    setState({
      ...state,
      code: e.target.value
    })
  }

  const handleTitleChange = (e) => {
    setState({
      ...state,
      title: e.target.value
    })
  }

  const handleStatusChange = (value) => {
    if (value[0] === 'all') {
      setState({
        ...state,
        status: undefined
      })
    } else {
      setState({
        ...state,
        status: value[0]
      })
    }
  }

  const handleSubmitSearch = () => {
    const { page, limit, code, title, status } = state
    const data = {
      limit: limit,
      page: page,
      code: code,
      title: title,
      status: status
    }
    props.getAllSLAs(data)
  }

  const handleEditSla = async (item) => {
    await setState((state) => {
      return {
        ...state,
        currentRow: item
      }
    })
    window.$('#modal-edit-sla').modal('show')
  }

  const handleShowDetailSLA = async (slaDetail) => {
    setState((state) => {
      return {
        ...state,
        slaDetail: slaDetail
      }
    })
    window.$('#modal-detail-sla').modal('show')
  }

  const deleteSLA = (code) => {
    props.deleteSLA({ code })
  }

  const disableSLA = (id) => {
    props.disableSLA(id)
  }

  const { translate } = props
  const { serviceLevelAgreements } = props
  const { totalPages, page, listSLAs } = serviceLevelAgreements
  const { code, title, currentRow, slaDetail } = state
  return (
    <React.Fragment>
      <div className='box-body qlcv'>
        {slaDetail ? <SlaDetailForm slaDetail={slaDetail} /> : ''}
        <SlaCreateForm />
        {currentRow ? <SlaEditForm slaEdit={currentRow} /> : ''}
        <div className='form-inline'>
          <div className='form-group'>
            <label className='form-control-static'>{'Mã'} </label>
            <input type='text' className='form-control' value={code} onChange={handleCodeChange} />
          </div>
          <div className='form-group'>
            <label className='form-control-static'>{'Tiêu đề'} </label>
            <input type='text' className='form-control' value={title} onChange={handleTitleChange} />
          </div>
          <div className='form-group'>
            <label className='form-control-static'>Trạng thái đơn</label>
            <SelectBox
              id={`select-filter-status-slas`}
              className='form-control select2'
              style={{ width: '100%' }}
              items={[
                { value: true, text: 'Đang hiệu lực' },
                { value: false, text: 'Hết hiệu lực' },
                { value: 'all', text: 'Tất cả' }
              ]}
              onChange={handleStatusChange}
            />
          </div>
          <div className='form-group'>
            <button type='button' className='btn btn-success' title={translate('manage_order.tax.search')} onClick={handleSubmitSearch}>
              {translate('manage_order.tax.search')}
            </button>
          </div>
        </div>
        <table id='tax-table' className='table table-striped table-bordered table-hover'>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã cam kết</th>
              <th>Tiêu đề</th>
              <th>Trạng thái</th>
              <th
                style={{
                  width: '120px',
                  textAlign: 'center'
                }}
              >
                Hành động
                <DataTableSetting
                  tableId='tax-table'
                  columnArr={['STT', 'Mã cam kết', 'Tiêu đề', 'Trạng thái']}
                  limit={state.limit}
                  hideColumnOption={true}
                  setLimit={setLimit}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {listSLAs &&
              listSLAs.length !== 0 &&
              listSLAs.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.code}</td>
                  <td>{item.title}</td>
                  <td>
                    <center>
                      {item.status ? (
                        <ConfirmNotification
                          icon='domain_verification'
                          name='domain_verification'
                          className='text-success'
                          title={'Click để thay đổi trạng thái'}
                          content={`<h4>Bỏ kích hoạt cam kết này</h4>
                                                        <br/> <h5>Điều đó đồng ghĩa với việc cam kết này sẽ không còn được áp dụng vào các đơn hàng</h5>
                                                        <h5>Tuy nhiên các dữ liệu đơn hàng liên quan đến cam kết này trước đó không bị ảnh hưởng và bạn có thể kích hoạt lại nó</h5?`}
                          func={() => disableSLA(item._id)}
                        />
                      ) : (
                        <ConfirmNotification
                          icon='disabled_by_default'
                          name='disabled_by_default'
                          className='text-red'
                          title={'Click để thay đổi trạng thái'}
                          content={`<h4>Kích hoạt cam kết này</h4>
                                                    <br/> <h5>Cam kết này có thể áp dụng vào các đơn hàng nếu được kích hoạt trở lại</h5>`}
                          func={() => disableSLA(item._id)}
                        />
                      )}
                    </center>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <a
                      style={{ width: '5px' }}
                      title={'Xem chi tiết'}
                      onClick={() => {
                        handleShowDetailSLA(item)
                      }}
                    >
                      <i className='material-icons'>view_list</i>
                    </a>
                    {item.status ? (
                      <a
                        className='edit text-yellow'
                        style={{ width: '5px' }}
                        title={'Sửa thông tin'}
                        onClick={() => {
                          handleEditSla(item)
                        }}
                      >
                        <i className='material-icons'>edit</i>
                      </a>
                    ) : (
                      ''
                    )}
                    <DeleteNotification
                      content={'Bạn có chắc chắn muốn xóa cam kết này'}
                      data={{
                        id: item._id,
                        info: item.title
                      }}
                      func={() => deleteSLA(item.code)}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {serviceLevelAgreements.isLoading ? (
          <div className='table-info-panel'>{translate('confirm.loading')}</div>
        ) : (
          (typeof listSLAs === 'undefined' || listSLAs.length === 0) && (
            <div className='table-info-panel'>{translate('confirm.no_data')}</div>
          )
        )}
        <PaginateBar pageTotal={totalPages ? totalPages : 0} currentPage={page} func={setPage} />
      </div>
    </React.Fragment>
  )
}

function mapStateToProps(state) {
  const { serviceLevelAgreements } = state
  return { serviceLevelAgreements }
}

const mapDispatchToProps = {
  getAllSLAs: SlaActions.getAllSLAs,
  disableSLA: SlaActions.disableSLA,
  deleteSLA: SlaActions.deleteSLA,
  getAllGoodsByType: GoodActions.getAllGoodsByType
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(SLAMangementTable))
