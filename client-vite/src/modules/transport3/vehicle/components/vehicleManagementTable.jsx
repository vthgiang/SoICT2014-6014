import React, {useState} from 'react';
import {connect} from 'react-redux';
import {withTranslate} from 'react-redux-multilingual';
import {vehicleActions} from '../redux/actions';
import {DataTableSetting, DeleteNotification, PaginateBar} from '@common-components';
import VehicleDetailInfo from './vehicleDetailInfo';
import {useEffect} from 'react';
import {getTableConfiguration} from '@helpers/tableConfiguration';
import {CategoryActions} from '@modules/production/common-production/category-management/redux/actions';
import {formatDate} from '@helpers/formatDate.js';

const VehicleManagementTable = (props) => {
  const getTableId = 'table-manage-vehicle';
  const defaultConfig = {limit: 5}
  const getLimit = getTableConfiguration(getTableId, defaultConfig).limit;

  const {vehicle, translate, categories, transportationCostManagement} = props;

  const [state, setState] = useState({
    vehicleName: '',
    description: '',
    page: 1,
    perPage: getLimit,
    vehicleId: null,
    tableId: getTableId,
  })
  const {vehicleName, page, perPage, vehicleEdit, vehicleId, vehicleWithCosts, costFormula} = state;

  useEffect(() => {
    let {perPage} = state;
    props.getAllVehicle({page, perPage});
  }, [])

  console.log(props.vehicle, 'vehicle')

  const setPage = (pageNumber) => {
    setState({
      ...state,
      page: parseInt(pageNumber)
    });
    props.getAllVehicle({page: parseInt(pageNumber), perPage: perPage});
  }

  const setLimit = (number) => {
    setState({
      ...state,
      perPage: parseInt(number)
    });
    props.getAllVehicle({page: page, perPage: parseInt(number)});
  }

  const handleShowDetailInfo = (id) => {

    setState({
      ...state,
      vehicleId: id
    });

    window.$(`#modal-detail-info-vehicle`).modal('show');
  }

  const columns = [
    'STT',
    'Mã phương tiện',
    'Tên phương tiện',
    'Trọng tải',
    'Thể tích thùng',
    'Mức tiêu thụ nhiên liệu',
    'Chi phí vận chuyển',
    'Hạn bảo hành',
    'Tốc độ',
    'Trạng thái',
  ]

  return (
    <>
      <VehicleDetailInfo
        vehicleId={state.vehicleId}
        categories={categories}
      />
      <div className="box-body qlcv">
        <div className="form-inline">
          <div className="form-group">
            {/* Button thêm mới */}
            <button type="button" className="btn btn-success"
                    title={translate('manage_transportation.vehicle_management.add')}
                    onClick={() => window.$('#modal-add-vehicle').modal('show')}>
              {translate('manage_transportation.vehicle_management.add')}
            </button>
          </div>
        </div>
        <table id={state.tableId} className="table table-striped table-bordered table-hover"
               style={{marginTop: '20px'}}>
          <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
            <th style={{width: '120px', textAlign: 'center'}}>{translate('table.action')}
              <DataTableSetting
                tableId={state.tableId}
                columnArr={columns}
                setLimit={setLimit}
              />
            </th>
          </tr>
          </thead>
          <tbody>
          {props.listVehicle && props.listVehicle.length !== 0 &&
            props.listVehicle.map((vehicle, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{vehicle.code}</td>
                <td>{vehicle.asset.assetName}</td>
                <td>{vehicle.tonnage}</td>
                <td>{vehicle.volume}</td>
                <td>{vehicle.averageGasConsume}</td>
                <td>{vehicle.averageFeeTransport}</td>
                <td>{formatDate(vehicle.asset.warrantyExpirationDate)}</td>
                <td>{vehicle.minVelocity} - {vehicle.maxVelocity}</td>
                <td>{vehicle.asset.status === 'ready_to_use' ? 'Sẵn sàng sử dụng' : 'Không sẵn sàng sử dụng'}</td>
                <td style={{textAlign: 'center'}}>
                  <a onClick={() => handleShowDetailInfo(vehicle._id)}><i className="material-icons">visibility</i></a>
                  <a><i className="material-icons">edit</i></a>
                  <DeleteNotification
                    content={translate('manage_transportation.vehicle_management.delete')}
                    data={{id: vehicle._id}}
                    // func={handleDeleteVehicle}
                  />
                </td>
              </tr>
            ))
          }
          </tbody>
        </table>
        {!props.listVehicle || props.listVehicle.length === 0 &&
          <div className="table-info-panel">{translate('confirm.no_data')}</div>
        }
        <PaginateBar
          pageTotal={vehicle.totalPage ? vehicle.totalPage : 0}
          currentPage={state.page}
          func={setPage}
        />
      </div>
    </>
  )

}


function mapStateToProps(state) {
  const {listVehicle} = state.T3vehicle;
  return {listVehicle, vehicle: state.T3vehicle};
}

const mapDispatchToProps = {
  getAllVehicle: vehicleActions.getAllVehicle
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(VehicleManagementTable));
