import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { RoutePickingActions } from '../redux/actions';

import { DataTableSetting, DatePicker, DeleteNotification, PaginateBar } from '../../../../../common-components';

import RoutePickingDefaultInfo from './routePickingDetailInfo';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
import { formatToTimeZoneDate } from '../../../../../helpers/formatDate';

class RoutePickingManagementTable extends Component {
  constructor(props) {
    super(props);
    const tableId = 'table-manage-route-class';
    const defaultConfig = { limit: 5 };
    const limit = getTableConfiguration(tableId, defaultConfig).limit;

    this.state = {
      routeName: '',
      page: 1,
      perPage: limit,
      tableId,
      detailModalId: 1,
      ordersNumber: '',
      startDate: '',
      endDate: ''
    };
  }

  componentDidMount() {
    let { routeName, page, perPage } = this.state;
    this.props.getAllRoutes({ routeName, perPage, page });
  }

  componentDidUpdate(prevProps) {
    if (this.props.routes !== prevProps.routes) {
      // Cập nhật lại state khi props thay đổi để re-render
      this.setState({
        listChemins: this.props.routes.listChemins
      });
    }
  }

  handleChangeOrderNumber = (e) => {
    const { value } = e.target;
    this.setState({
      ordersNumber: value
    });
  };

  handleSubmitSearch = () => {
    const { ordersNumber, perPage, startDate, endDate } = this.state;

    this.setState({
      page: 1
    }, () => {
      this.props.getAllRoutes({ ordersNumber, perPage, page: 1, startDate, endDate });
    });
  };

  handleStartDateChange = (value) => {
    this.setState({
      startDate: value
    });
  };

  handleEndDateChange = (value) => {
    this.setState({
      endDate: value
    });
  };

  handleSubmitGenerateWave = () => {
    let { startDate, endDate, ordersNumber } = this.state;
    let data = {
      ordersNumber,
      startDate: startDate ? formatToTimeZoneDate(startDate) : '',
      endDate: endDate ? formatToTimeZoneDate(endDate) : ''
    };
    this.props.createRoutePicking(data);
  };

  setPage = (pageNumber) => {
    const { ordersNumber, perPage, startDate, endDate } = this.state;

    this.setState({
      page: parseInt(pageNumber)
    }, () => {
      this.props.getAllRoutes({ ordersNumber, perPage, page: parseInt(pageNumber), startDate, endDate });
    });
  };

  setLimit = (number) => {
    const { ordersNumber, page, startDate, endDate } = this.state;

    this.setState({
      perPage: parseInt(number)
    }, () => {
      this.props.getAllRoutes({ ordersNumber, perPage: parseInt(number), page, startDate, endDate });
    });
  };

  handleDelete = (id) => {
    // Hàm xóa logic ở đây
  };

  handleEdit = (example) => {
    this.setState(
      {
        currentRow: example
      },
      () => window.$('#modal-edit-example').modal('show')
    );
  };

  handleShowDetailInfo = async (chemin) => {
    await this.setState(
      {
        routeDetail: chemin
      },
      () => window.$(`#modal-detail-info-route-picking`).modal('show')
    );
  };

  render() {
    const { translate, routes } = this.props;
    const { page, perPage, tableId, routeDetail } = this.state;

    return (
      <React.Fragment>
        {routeDetail && (
          <RoutePickingDefaultInfo
            routeDetail={routeDetail}
          />
        )}
        <div className='box-body qlcv'>
          <div className='form-inline'>
            <div className='dropdown pull-right' style={{ marginBottom: 15 }}>
              <ul className='dropdown-menu pull-right' style={{ marginTop: 0 }}>
                <li>
                  <a
                    style={{ cursor: 'pointer' }}
                    onClick={() => window.$('#modal-import-file-example').modal('show')}
                    title={translate('human_resource.salary.add_multi_example')}
                  >
                    {translate('human_resource.salary.add_import')}
                  </a>
                </li>
                <li>
                  <a
                    style={{ cursor: 'pointer' }}
                    onClick={() => window.$('#modal-create-example').modal('show')}
                    title={translate('manage_example.add_one_example')}
                  >
                    {translate('manage_example.add_example')}
                  </a>
                </li>
              </ul>
            </div>

            <div className='form-group'>
              <label className='form-control-static'>{translate('manage_warehouse.storage_management.number_orders')}</label>
              <input
                type='text'
                className='form-control'
                name='ordersNumber'
                onChange={this.handleChangeOrderNumber}
                placeholder={translate('manage_warehouse.storage_management.number_orders')}
                autoComplete='off'
              />
            </div>
            <div className='form-group'>
              <label style={{ width: 'auto' }}>Từ</label>
              <DatePicker id='date_picker_dashboard_start_index' value={this.state.startDate} onChange={this.handleStartDateChange} disabled={false} />
            </div>

            <div className='form-group'>
              <label style={{ width: 'auto' }}>Đến</label>
              <DatePicker id='date_picker_dashboard_end_index' value={this.state.endDate} onChange={this.handleEndDateChange} disabled={false} />
            </div>

            <div className='form-group'>
              <button
                type='button'
                className='btn btn-success'
                title={translate('manage_warehouse.storage_management.generate')}
                onClick={this.handleSubmitGenerateWave}
              >
                {translate('manage_warehouse.storage_management.generate')}
              </button>
            </div>
          </div>

          <table id={tableId} className='table table-striped table-bordered table-hover'>
            <thead>
              <tr>
                <th className='col-fixed' style={{ width: 60 }}>
                  STT
                </th>
                <th>Wave ID</th>
                <th>Các đơn hàng trong wave</th>
                <th>Sản phẩm</th>
                <th>Tổng quãng đường</th>
                <th style={{ width: '120px', textAlign: 'center' }}>
                  {translate('table.action')}
                  <DataTableSetting
                    tableId={tableId}
                    columnArr={[
                      'STT',
                      'Các đơn hàng trong wave',
                      'Tổng quãng đường'
                    ]}
                    setLimit={this.setLimit}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {routes.listChemins && routes.listChemins.length > 0 ? (
                routes.listChemins.map((chemin, index) => (
                  chemin ? (
                    <tr key={index}>
                      <td>{index + 1 + (page - 1) * perPage}</td>
                      <td>{chemin.waveId}</td>
                      <td>{chemin.orderId.map(order => order.code).join(', ')}</td>
                      <td>{chemin.listInfoOrders.map(order => (
                        <div style={{ maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {order.good.name}
                        </div>
                      ))}</td>
                      <td>{chemin.distanceRoute}</td>
                      <td style={{ textAlign: 'center' }}>
                        <a
                          className='edit text-green'
                          style={{ width: '5px' }}
                          title={translate('manage_example.detail_info_example')}
                          onClick={() => this.handleShowDetailInfo(chemin)}
                        >
                          <i className='material-icons'>visibility</i>
                        </a>
                      </td>
                    </tr>
                  ) : null
                ))
              ) : (
                <tr>
                  <td colSpan="6">{translate('confirm.no_data')}</td>
                </tr>
              )}
            </tbody>
          </table>
          {routes.isLoading ? (
            <div className='table-info-panel'>{translate('confirm.loading')}</div>
          ) : null}
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  const { routes } = state;

  return { routes };
}

const mapDispatchToProps = {
  getAllRoutes: RoutePickingActions.getAllChemins,
  createRoutePicking: RoutePickingActions.createRoutePicking
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(RoutePickingManagementTable));
