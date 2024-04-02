import React, { useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { vehicleActions } from "../redux/actions";
import { DataTableSetting, DeleteNotification, PaginateBar } from "../../../../common-components";
import VehicleCreateForm from "./vehicleCreateForm";
import VehicleEditForm from "./vehicleEditForm";
import VehicleDetailInfo from "./vehicleDetailInfo";
import { useEffect } from "react";
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
import { CategoryActions } from '../../../production/common-production/category-management/redux/actions';
import { CalculateVehicleCost } from "./calculateCost";
import { TransportationCostManagementActions } from "../../cost/redux/actions";

const VehicleManagementTable = (props) => {
    const getTableId = "table-manage-vehicle";
    const defaultConfig = { limit: 5 }
    const getLimit = getTableConfiguration(getTableId, defaultConfig).limit;

    const { vehicle, translate, categories, transportationCostManagement } = props;

    const [state, setState] = useState({
        vehicleName: "",
        description: "",
        page: 1,
        perPage: getLimit,
        vehicleEdit: null,
        vehicleId: null,
        tableId: getTableId,
        vehiclesWithCosts: [],
        costFormula: "",
    })
    const { vehicleName, page, perPage, vehicleEdit, vehicleId, vehiclesWithCosts, costFormula } = state;

    useEffect(() => {
        let { vehicleName, perPage } = state;
        props.getAllVehicle({ page, perPage });
        props.getCategories();
        props.getAllVehicleWithCostList();
        props.getFormula();
    }, [])
    useEffect(() => {
        setState({
            ...state,
            vehiclesWithCosts: vehicle.vehicleWithCosts ? vehicle.vehicleWithCosts : [],
            costFormula: transportationCostManagement?.formula ? transportationCostManagement.formula.vehicle : "",
        })
    }, [vehicle, transportationCostManagement])

    const handleChangeVehicleName = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            vehicleName: value
        });
    }

    const handleSubmitSearch = () => {
        setState({
            ...state,
            page: 1
        });
        props.getAllVehicle(state);
    }

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
        props.getAllVehicle({page: page, perPage:  parseInt(number)});
    }

    const handleDelete = (id) => {
        props.deleteVehicles({
            vehicleIds: [id]
        });
        props.getAllVehicle({
            vehicleName,
            perPage,
            page: vehicle?.lists?.length === 1 ? page - 1 : page
        });
    }

    const handleEdit = (vehicle) => {
        setState({
            ...state,
            vehicleEdit: vehicle
        });
        window.$('#modal-edit-vehicle').modal('show');
    }

    const handleShowDetailInfo = (id) => {

        setState({
            ...state,
            vehicleId: id
        });

        window.$(`#modal-detail-info-vehicle`).modal('show');
    }

    const updateOperationCost = () => {
        let vehiclesOperationCost = [];
        if (costFormula == "" || vehiclesWithCosts.length == 0) {
            return;
        }
        let formula = costFormula;
        vehiclesWithCosts.forEach((vehicleWithCost) => {
            let calculatedCost = CalculateVehicleCost.result(formula, vehicleWithCost);
            vehiclesOperationCost.push({
                _id: vehicleWithCost._id,
                vehicleCost: calculatedCost.fixedCost,
                averageFeeTransport: calculatedCost.operationCost
            })
        });
        props.calculateVehiclesCost(vehiclesOperationCost);
    }


    let lists = [];
    if (vehicle.isLoading === false) {
        lists = vehicle.listVehicle;
    }
    let listLicenseTexts = [];
    if (lists) {
        lists.forEach((vehicle) => {
            let listLicenseText = "";
            if (vehicle.requireLicense) {
                vehicle.requireLicense.forEach((license) => listLicenseText+= `Hạng ${license}, `);
                listLicenseText = listLicenseText.slice(0, -2);
            }
            if (listLicenseText) {
                listLicenseTexts.push({vehicle: vehicle._id, text: listLicenseText});
            }
        })
    }

    const totalPage = Math.ceil(vehicle.totalList / perPage);
    const { tableId } = state;
    return (
        <React.Fragment>
            {
                <VehicleEditForm
                    vehicleEdit={vehicleEdit}
                    categories={categories}
                />
            }
            {
                <VehicleDetailInfo
                    vehicleId={state.vehicleId}
                    categories={categories}
                />
            }
            <div className="box-body qlcv">
                <VehicleCreateForm
                    page={page}
                    perPage={perPage}
                    categories={categories}
                />
                <div className="form-inline">
                    <div className="form-group">
                        <label className="form-control-static">{translate('manage_transportation.vehicle_management.name')}</label>
                        <input type="text" className="form-control" name="vehicleName" onChange={handleChangeVehicleName} placeholder={translate('manage_transportation.vehicle_management.name')} autoComplete="off" />
                    </div>
                    <div className="form-group">
                        {/* Button thêm mới */}
                        <button type="button" className="btn btn-success" title={translate('manage_transportation.vehicle_management.search')} onClick={handleSubmitSearch}>{translate('manage_transportation.vehicle_management.search')}</button>
                        {/* Button cập nhật chi phí vận hành đội xe */}
                        <button type="button" className="btn btn-info" title={translate('manage_transportation.vehicle_management.search')} onClick={updateOperationCost}>{translate('manage_transportation.vehicle_management.update_operation_cost_button')}</button>
                    </div>
                </div>
                <table id={tableId} className="table table-striped table-bordered table-hover" style={{marginTop: "20px"}}>
                    <thead>
                        <tr>
                            <th className="col-fixed" style={{ width: 60 }}>{translate('manage_transportation.vehicle_management.index')}</th>
                            <th>{translate('manage_transportation.vehicle_management.name')}</th>
                            <th>{translate('manage_transportation.vehicle_management.operation_cost')}</th>
                            <th>{translate('manage_transportation.vehicle_management.require_license')}</th>
                            <th style={{ width: "120px", textAlign: "center" }}>{translate('table.action')}
                                <DataTableSetting
                                    tableId={tableId}
                                    columnArr={[
                                        translate('manage_transportation.vehicle_management.index'),
                                        translate('manage_transportation.vehicle_management.name'),
                                        translate('manage_transportation.vehicle_management.operation_cost'),
                                        translate('manage_transportation.vehicle_management.require_license'),
                                    ]}
                                    setLimit={setLimit}
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
                                    <td style={{ textAlign: "center" }}>
                                        <a className="edit text-green" style={{ width: '5px' }} title={translate('manage_transportation.vehicle_management.detail_info_vehicle')} onClick={() => handleShowDetailInfo(vehicle._id)}><i className="material-icons">visibility</i></a>
                                        <a className="edit text-yellow" style={{ width: '5px' }} title={translate('manage_transportation.vehicle_management.edit')} onClick={() => handleEdit(vehicle)}><i className="material-icons">edit</i></a>
                                        <DeleteNotification
                                            content={translate('manage_transportation.vehicle_management.delete')}
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
                    (typeof lists === 'undefined' || lists.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                <PaginateBar
                    pageTotal={totalPage ? totalPage : 0}
                    currentPage={page}
                    func={setPage}
                />
            </div>
        </React.Fragment>
    )

}


function mapStateToProps(state) {
    const vehicle = state.vehicle;
    const categories = state.categories;
    const transportationCostManagement = state.transportationCostManagement;
    return { vehicle, categories, transportationCostManagement }
}

const mapDispatchToProps = {
    getAllVehicle: vehicleActions.getAllVehicle,
    deleteVehicles: vehicleActions.deleteVehicles,
    getCategories: CategoryActions.getCategories,
    getAllFreeVehicleSchedule: vehicleActions.getAllFreeVehicleSchedule,
    getAllVehicleWithCostList: vehicleActions.getAllVehicleWithCostList,
    getFormula: TransportationCostManagementActions.getFormula,
    calculateVehiclesCost: vehicleActions.calculateVehiclesCost,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(VehicleManagementTable));