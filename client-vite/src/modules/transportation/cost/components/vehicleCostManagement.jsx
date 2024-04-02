import React, { useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../common-components";
import { useEffect } from "react";
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
import VehicleCostCreateForm from "./vehicleCostCreateForm";
import UpdateDependentVehiclesForm from "./updateDependentVehiclesForm";
import { vehicleActions } from '../../vehicle/redux/actions'
import { CalculateVehicleCost } from "../../vehicle/components/calculateCost";
import { TransportationCostManagementActions } from '../redux/actions'

const VehicleCostManagement = (props) => {
    const getTableId = "table-vehicle-cost-management";

    const { transportationCostManagement, translate, vehicle } = props;

    const [state, setState] = useState({
        page: 1,
        limit: 10,
        vehicleCostUpdate: null,
        vehicleCostId: null,
        tableId: getTableId,
        vehicleCostName: "",
        vehicleCost: "",
        vehicleCostFormula: "",

    })
    const { page, perPage, costEdit, costId, vehicleCostName, vehicleCost, vehicleCostFormula, limit, vehicleCostUpdate } = state;

    useEffect(() => {
        props.getAllVehicleCosts();
        props.getFormula();
    }, [])

    useEffect(() => {
        setState({
            ...state,
            vehicleCostFormula: transportationCostManagement?.formula?.vehicle
        })
    }, [transportationCostManagement.formula])

    const handleChangeVehicleCostName = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            vehicleCostName: value
        });
    }

    const handleSubmitSearch = () => {
        setState({
            ...state,
            page: 1
        });
        props.getAllVehicleCost(state);
    }

    const setPage = (pageNumber) => {
        setState({
            ...state,
            page: parseInt(pageNumber)
        });

        props.getAllVehicleCost(state);
    }

    const setLimit = (number) => {
        setState({
            ...state,
            perPage: parseInt(number)
        });
        props.getAllVehicleCost(state);
    }

    const handleDeleteVehicleCost = (id) => {
        props.deleteVehicleCost(id);
    }

    const handleUpdateVehicleCost = (vehicleCost) => {
        setState({
            ...state,
            vehicleCostUpdate: vehicleCost
        });
        window.$('#modal-update-dependent-vehicles').modal('show');
    }

    const handleChangeVehicleCostFormula = (event) => {
        setState({
            ...state,
            vehicleCostFormula: event.target.value
        })
    }

    const handleUpdateVehicleCostFormula = () => {
        props.createOrUpdateVehicleCostFormula({vehicle: vehicleCostFormula})
    }

    const handleShowCreateForm = () => {
        
        window.$(`#modal-create-vehicle-cost`).modal('show');
    }

    const handleShowUpdateDependentVehiclesForm = () => {
        window.$(`#modal-update-dependent-vehicles`).modal('show');
    }

    let vehicleCostList = [];
    if (transportationCostManagement?.vehicleCostList.length > 0) {
        vehicleCostList = transportationCostManagement.vehicleCostList.map((vehicleCost) => {
            let dependentVehicleList = vehicleCost?.vehicles.map((dependentVehicle) => {
                return {
                    _id: dependentVehicle.vehicle._id,
                    name: dependentVehicle.vehicle.name,
                    cost: dependentVehicle.cost
                }
            })
            return {
                _id: vehicleCost._id,
                name: vehicleCost.name,
                type: vehicleCost.type,
                code: vehicleCost.code,
                dependentVehicleList: dependentVehicleList
            }
        })
    }

     const totalPage = Math.floor(vehicleCostList?.length/limit) + 1;
    const { tableId } = state;
    return (
        <React.Fragment>
            <div className="box-body qlcv">
                <VehicleCostCreateForm/>
                <UpdateDependentVehiclesForm
                    vehicleCostUpdate={vehicleCostUpdate}
                />
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_transportation.cost_management.vehicle_cost_search_title')}</label>
                        <input type="text" className="form-control" name={vehicleCostName} onChange={handleChangeVehicleCostName} placeholder={translate('manage_transportation.cost_management.vehicle_cost_search_title')} autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <button type="button" className="btn btn-success" title={translate('manage_example.search')} onClick={handleSubmitSearch}>{translate('manage_example.search')}</button>
                    </div>
                    <div className="form-group" style={{float: "right"}}>
                        <button type="button" className="btn btn-success" title={translate('manage_transportation.cost_management.button_create_title')} onClick={handleShowCreateForm}>{translate('manage_transportation.cost_management.button_create_title')}</button>
                    </div>
                </div>
                <table id={tableId} className="table table-striped table-bordered table-hover" style={{marginTop: "20px"}}>
                    <thead>
                        <tr>
                            {/* <th className="col-fixed" style={{ width: 60 }}>{translate('manage_example.index')}</th> */}
                            <th>{translate('manage_transportation.cost_management.vehicle_cost_code')}</th>
                            <th>{translate('manage_transportation.cost_management.name_vehicle_cost')}</th>
                            <th>{translate('manage_transportation.cost_management.type_vehicle_cost')}</th>
                            <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                                <DataTableSetting
                                    tableId={tableId}
                                    columnArr={[
                                        translate('manage_example.index'),
                                        translate('manage_example.exampleName'),

                                    ]}
                                    setLimit={setLimit}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(vehicleCostList && vehicleCostList.length !== 0) &&
                            vehicleCostList.map((vehicleCost, index) => (
                                <tr key={index}>
                                    {/* <td>{index + 1 + (page - 1) * state.perPage}</td> */}
                                    <td>{vehicleCost.code}</td>
                                    <td>{vehicleCost.name}</td>
                                    <td>{vehicleCost.type == 1 ? "Cố định" : "Không cố định"}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_transportation.cost_management.vehicle_cost_update_button')} onClick={() => handleUpdateVehicleCost(vehicleCost)}><i className="material-icons">edit</i></a>
                                        <DeleteNotification
                                            content={translate('manage_transportation.cost_management.vehicle_cost_delete')}
                                            data={{
                                                id: vehicleCost._id,
                                                info: vehicleCost.name
                                            }}
                                            func={handleDeleteVehicleCost}
                                        />
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {transportationCostManagement.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (typeof vehicleCostList === 'undefined' || vehicleCostList.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                <PaginateBar pageTotal={totalPage ? totalPage : 0} currentPage={page} func={setPage} />
                <hr />
                <div className="row" style={{marginTop: "20px"}}>
                    <div className="col-md-8">
                        <label htmlFor="vehicle-cost-formula">Công thức tính</label>
                        <textarea className="form-control" value={vehicleCostFormula} onChange={(event) => handleChangeVehicleCostFormula(event)}/>
                    </div>
                </div>
                <div className="row" style={{marginTop: "20px"}}>
                    <div className="col-md-4">
                        <button type="button" className="btn btn-warning" onClick={() => handleUpdateVehicleCostFormula()}>Cập nhật</button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )

}


function mapStateToProps(state) {
    const vehicle = state.vehicle;
    const transportationCostManagement = state.transportationCostManagement;
    return { vehicle, transportationCostManagement }
}

const mapDispatchToProps = {
    getAllVehicle: vehicleActions.getAllVehicle,
    getAllVehicleCosts: TransportationCostManagementActions.getAllVehicleCosts,
    getFormula: TransportationCostManagementActions.getFormula,
    createOrUpdateVehicleCostFormula: TransportationCostManagementActions.createOrUpdateVehicleCostFormula,
    deleteVehicleCost: TransportationCostManagementActions.deleteVehicleCost,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(VehicleCostManagement));