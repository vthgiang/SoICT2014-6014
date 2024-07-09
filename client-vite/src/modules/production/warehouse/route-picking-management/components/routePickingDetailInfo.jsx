import React, { Component } from 'react'
import { connect } from 'react-redux'
import withTranslate from 'react-redux-multilingual/lib/withTranslate'
import { RoutePickingActions } from '../redux/actions'

import { DialogModal } from '../../../../../common-components'

class RoutePickingDefaultInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  // static getDerivedStateFromProps(props, state) {
  //   if (props.exampleID !== state.exampleID) {
  //     return {
  //       exampleID: props.exampleID,
  //       exampleName: props.exampleName,
  //       description: props.description
  //     }
  //   } else {
  //     return null
  //   }
  // }

  render() {
    const { translate, routeDetail } = this.props
    console.log("routeDetail:", routeDetail)
    return (
      <React.Fragment>
        <DialogModal
          modalID={`modal-detail-info-route-picking`}
          isLoading={false}
          title={translate('manage_warehouse.storage_management.detail_info_route_picking')}
          formID={`modal-detail-info-route-picking`}
          size={80}
          // maxWidth={{100%}}
          hasSaveButton={false}
          hasNote={false}
          // style={{ width: '1000px' }} // Corrected style prop

        >
          <form id={`modal-detail-info-route-picking`}>
            <div className='row'>
              <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
                <div className='form-group'>
                  <strong>{translate('manage_warehouse.storage_management.wave_id')}:&emsp;</strong>
                  {routeDetail.waveId}
                </div>
                <div className='form-group'>
                  <strong>{translate('manage_warehouse.stock_management.address')}:&emsp;</strong>
                  Hà Nội
                </div>
                <div className='form-group'>
                  <strong>{translate('manage_warehouse.stock_management.description')}:&emsp;</strong>
                  Kho quần áo
                </div>
              </div>
              <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
                <div className='form-group'>
                  <strong>{translate('manage_warehouse.stock_management.name')}:&emsp;</strong>
                  Trần Đại Nghĩa
                </div>
                <div className='form-group'>
                  <strong>{translate('manage_warehouse.stock_management.status')}:&emsp;</strong>
                  Đã lấy hàng
                </div>
                <div className='form-group'>
                  <strong>{'Thời gian mở cửa'}:&emsp;</strong>
                  7 giờ 30 phút&emsp;
                  <strong>{'Thời gian đóng cửa'}:&emsp;</strong>
                  21 giờ 30 phút
                </div>
              </div>
              <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
                <fieldset className='scheduler-border'>
                  <legend className='scheduler-border'>{translate('manage_warehouse.storage_management.order_route_picking')}</legend>
                  <table className='table table-bordered' style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th title={translate('manage_warehouse.stock_management.index')}>
                          {translate('manage_warehouse.stock_management.index')}
                        </th>
                        <th title={translate('manage_warehouse.storage_management.location')}>
                          {translate('manage_warehouse.storage_management.location')}
                        </th>
                        <th title={translate('manage_warehouse.storage_management.good_name')}>
                          {translate('manage_warehouse.storage_management.good_name')}
                        </th>
                        <th title={translate('manage_warehouse.storage_management.quantity_taken')}>
                          {translate('manage_warehouse.storage_management.quantity_taken')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {routeDetail.listInfoOrders === 'undefined' || routeDetail.listInfoOrders.length === 0 ? (
                        <tr>
                          <td colSpan={4}>
                            <center>{translate('task_template.no_data')}</center>
                          </td>
                        </tr>
                      ) : (
                        routeDetail.listInfoOrders.map((x, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{typeof x.location === 'object' ? x.location.name : x.location}</td>
                            <td>{typeof x.good === 'object' ? x.good.name : x.good}</td>
                            <td>{x.quantity_taken}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </fieldset>
                {/* <fieldset className='scheduler-border'>
                  <legend className='scheduler-border'>{translate('manage_warehouse.stock_management.management_location')}</legend>

                  <table className='table table-bordered'>
                    <thead>
                      <tr>
                        <th title={translate('manage_warehouse.stock_management.index')}>
                          {translate('manage_warehouse.stock_management.index')}
                        </th>
                        <th title={translate('manage_warehouse.stock_management.role')}>
                          {translate('manage_warehouse.stock_management.role')}
                        </th>
                        <th title={translate('manage_warehouse.stock_management.management_good')}>
                          {translate('manage_warehouse.stock_management.management_good')}
                        </th>
                      </tr>
                    </thead>
                    <tbody id={`good-edit-manage-by-stock`}>
                      {typeof managementLocation === 'undefined' || managementLocation.length === 0 ? (
                        <tr>
                          <td colSpan={3}>
                            <center>{translate('task_template.no_data')}</center>
                          </td>
                        </tr>
                      ) : (
                        managementLocation.map((x, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{x.role.name}</td>
                            <td>
                              {x.managementGood
                                ? x.managementGood.map((item, key) => {
                                  return <p key={key}>{translate(`manage_warehouse.stock_management.${item}`)}</p>
                                })
                                : ''}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </fieldset>
                <fieldset className='scheduler-border'>
                  <legend className='scheduler-border'>{translate('manage_warehouse.stock_management.goods')}</legend>

                  <table className='table table-bordered'>
                    <thead>
                      <tr>
                        <th title={translate('manage_warehouse.stock_management.good')}>
                          {translate('manage_warehouse.stock_management.good')}
                        </th>
                        <th title={translate('manage_warehouse.stock_management.min_quantity')}>
                          {translate('manage_warehouse.stock_management.min_quantity')}
                        </th>
                        <th title={translate('manage_warehouse.stock_management.max_quantity')}>
                          {translate('manage_warehouse.stock_management.max_quantity')}
                        </th>
                      </tr>
                    </thead>
                    <tbody id={`good-edit-manage-by-stock`}>
                      {typeof goods === 'undefined' || goods.length === 0 ? (
                        <tr>
                          <td colSpan={3}>
                            <center>{translate('task_template.no_data')}</center>
                          </td>
                        </tr>
                      ) : (
                        goods.map((x, index) => (
                          <tr key={index}>
                            <td>{x.good.name}</td>
                            <td>{x.minQuantity}</td>
                            <td>{x.maxQuantity}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </fieldset> */}
              </div>
            </div>
          </form>
        </DialogModal>
      </React.Fragment>

    )
  }
}


export default connect(null, null)(withTranslate(RoutePickingDefaultInfo))
