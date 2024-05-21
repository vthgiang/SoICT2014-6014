import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { orderActions } from '../redux/actions'
import {Button} from 'react-bootstrap';
import {DataTableSetting, DeleteNotification, PaginateBar} from '../../../../common-components/index.js';

function Journeys(props) {

  const { journey, translate } = props;
  const [state, setState] = useState({
  })

  const { getAllOrder } = props;
  return (
    <div>
      <div className="box-body qlcv">
        <div className="form-inline">
          <div className="form-group">
            <label className="form-control-static">{"translate('manage_transportation.vehicle_management.name')"}</label>
            <input type="text" className="form-control" name="vehicleName"
                   placeholder={translate('manage_transportation.vehicle_management.name')} autoComplete="off"/>
          </div>
          <div className="form-group">
            {/* Button thêm mới */}
            <button type="button" className="btn btn-success">
                    // title={"translate('manage_transportation.vehicle_management.search')"}
                    // onClick={}>{"translate('manage_transportation.vehicle_management.search')"}
            </button>
            {/* Button cập nhật chi phí vận hành đội xe */}
            <button type="button" className="btn btn-info">
                    // title={"translate('manage_transportation.vehicle_management.search')"}
                    // onClick={}>{"translate('manage_transportation.vehicle_management.update_operation_cost_button')"}
            </button>
          </div>
        </div>
        <table id={} className="table table-striped table-bordered table-hover" style={{marginTop: "20px"}}>
          <thead>
          <tr>
            <th className="col-fixed"
                style={{width: 60}}>{"translate('manage_transportation.vehicle_management.index')"}</th>
            <th>{"translate('manage_transportation.vehicle_management.name')"}</th>
            <th>{"translate('manage_transportation.vehicle_management.operation_cost')"}</th>
            <th>{"translate('manage_transportation.vehicle_management.require_license')"}</th>
            <th style={{width: "120px", textAlign: "center"}}>{"translate('table.action')"}
              <DataTableSetting
                tableId={}
                columnArr={[
                  // translate('manage_transportation.vehicle_management.index'),
                  // translate('manage_transportation.vehicle_management.name'),
                  // translate('manage_transportation.vehicle_management.operation_cost'),
                  // translate('manage_transportation.vehicle_management.require_license'),
                ]}
                setLimit={}
              />
            </th>
          </tr>
          </thead>
          <tbody>
          {(lists && lists.length !== 0) &&
            lists.map((vehicle, index) => (
              <tr key={index}>
                <td>{index + 1 + (page - 1) * state.perPage}</td>
                <td>{vehicle.name}</td>
                <td>{vehicle.vehicleCost}</td>
                <td>
                  {
                    listLicenseTexts && listLicenseTexts.filter((license) => license.vehicle == vehicle._id)[0] ?
                      listLicenseTexts.filter((license) => license.vehicle == vehicle._id)[0].text : ""
                  }
                </td>
                <td style={{textAlign: "center"}}>
                  <a className="edit text-green" style={{width: '5px'}}
                     // title={translate('manage_transportation.vehicle_management.detail_info_vehicle')}
                     onClick={() => handleShowDetailInfo(vehicle._id)}><i className="material-icons">visibility</i></a>
                  <a className="edit text-yellow" style={{width: '5px'}}
                     // title={translate('manage_transportation.vehicle_management.edit')}
                     onClick={() => handleEdit(vehicle)}><i className="material-icons">edit</i></a>
                  <DeleteNotification
                    // content={translate('manage_transportation.vehicle_management.delete')}
                    data={{
                      id: vehicle._id,
                      info: vehicle.name
                    }}
                    func={handleDelete}
                  />
                </td>
              </tr>
            ))
          }
          </tbody>
        </table>
        {vehicle.isLoading ?
          <div className="table-info-panel">{translate('confirm.loading')}</div> :
          (typeof lists === 'undefined' || lists.length === 0) &&
          <div className="table-info-panel">{translate('confirm.no_data')}</div>
        }
        <PaginateBar
          pageTotal={totalPage ? totalPage : 0}
          currentPage={page}
          func={setPage}
        />
      </div>
      <Button onClick={getAllOrder}>Get all order</Button>
    </div>
  );
}

function mapState(state) {
  const {order} = state;
  console.log(order)
  return {order};
}

const actions = {
  getAllOrder: orderActions.getAllOrder
}

export default connect(mapState, actions)(Journeys);
