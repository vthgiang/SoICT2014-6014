import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel, SelectBox, TreeSelect } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../helpers/validationHelper';
import { vehicleActions } from '../../vehicle/redux/actions';
import { TransportationCostManagementActions } from '../redux/actions';

const UpdateDependentVehiclesForm = (props) => {
    const { vehicleCostUpdate, translate, vehicle } = props;

    const [state, setState] = useState({
        vehicleCostName: "",
        vehicleCostNameError: undefined,
        vehicleCostType: "",
        dependentVehicleList: [],
        vehicleCostCode: "",
        allVehicleWithCost: [],
    })
    const { allVehicleWithCost, vehicleCostName, vehicleCostNameError, vehicleCostType, dependentVehicleList, vehicleCostCode, vehicleCost} = state;

    const isFormValidated = () => {
        const { vehicleCostName } = state;
        let { translate } = props;
        if (!ValidationHelper.validateName(translate, vehicleCostName, 6, 255).status) {
            return false;
        }
        return true;
    }
    useEffect(() => {
        props.getAllVehicle({page: 1, perPage: 100});
    }, [])
    useEffect(() => {
        setState({
            vehicleCostName: vehicleCostUpdate ? vehicleCostUpdate.name : "",
            vehicleCostCode: vehicleCostUpdate ? vehicleCostUpdate.code : "",
            dependentVehicleList: vehicleCostUpdate ? vehicleCostUpdate.dependentVehicleList : [],
            vehicleCostType: vehicleCostUpdate ? vehicleCostUpdate.type : ""
        })
    }, [vehicleCostUpdate]);

    useEffect(() => {
        let vehicles = vehicle && vehicle.listVehicle;
        let vehicleCostsValue = [];
        if (vehicles) {
            vehicleCostsValue = vehicles.map((item) => {
                let existCost = dependentVehicleList.find((e) => e._id == item._id);
                return {
                    _id: item._id,
                    name: item.name,
                    cost: existCost ? existCost.cost : ""
                }
            });
        }
        setState({
            ...state,
            allVehicleWithCost: vehicleCostsValue
        })
    }, [dependentVehicleList, vehicle])

    // Xử lý thay đổi giá trị trong form tạo mới
    const handleVehicleCostName = (e) => {
        const { value } = e.target;

        let { translate } = props;
        let { message } = ValidationHelper.validateName(translate, value, 6, 255);

        setState({
            ...state,
            vehicleCostName: value,
            vehicleCostNameError: message
        })
    }

    const handleVehicleCostCode = (e) => {
        const { value } = e.target;

        setState({
            ...state,
            vehicleCostCode: value,
        })
    }

    const handleChangeInputCostValue = (event, currentRowVehicle) => {
        let newDependentVehicles = allVehicleWithCost;
        newDependentVehicles.forEach((dependentVehicle, index, originArray) => {
            if (dependentVehicle._id == currentRowVehicle._id) {
                originArray[index].cost = event.target.value;
            }
        });
        setState({
            ...state,
            allVehicleWithCost: newDependentVehicles
        })
    }

    const handleVehicleCostTypeChange = (value) => {
        setState({
            ...state,
            vehicleCostType: value[0]?value[0]:1
        })
    }

    // Kết thúc xử lý thay đổi dữ liệu trong form tạo mới

    const save = () => {
        if (isFormValidated()) {
            let dependentVehicles = [];
            vehicle.listVehicle.forEach((element, index) => {
                let cost = document.getElementById(`vehicle-cost-value-${index}`);
                dependentVehicles.push({
                    vehicle: element._id,
                    cost: cost ? cost.value : 0
                })
            })
            let dataUpdate = {
                vehicleCostName: vehicleCostName,
                vehicleCostType: vehicleCostType,
                vehicleCostCode: vehicleCostCode,
                vehicles: dependentVehicles
            }
            props.updateVehicleCost(vehicleCostUpdate._id, dataUpdate);
        }
    }




    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-update-dependent-vehicles" isLoading={vehicle.isLoading}
                formID="form-update-dependent-vehicles"
                title={translate('manage_transportation.vehicle_management.add_title')}
                msg_success={translate('manage_transportation.vehicle_management.add_success')}
                msg_failure={translate('manage_transportation.vehicle_management.add_fail')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={65}
                maxWidth={700}
            >
                <form id="form-update-dependent-vehicles" onSubmit={() => save(translate('manage_transportation.cost_management.vehicle_cost_add_success'))}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className={`form-group ${!vehicleCostNameError ? "" : "has-error"}`}>
                                <label>{translate('manage_transportation.cost_management.name_vehicle_cost')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" value={vehicleCostName} onChange={handleVehicleCostName}></input>
                                <ErrorLabel content={vehicleCostNameError} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('manage_transportation.cost_management.vehicle_cost_code')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" value={vehicleCostCode} onChange={handleVehicleCostCode}></input>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('manage_transportation.cost_management.type_vehicle_cost')}<span className="text-red">*</span></label>
                                <SelectBox
                                    id={`update-form-vehicle-cost-type`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={vehicleCostType}
                                    items={[
                                        { value: '', text: `---${translate('manage_transportation.cost_management.vehicle_cost_type_select')}---` },
                                        { value: 1, text: translate('manage_transportation.cost_management.vehicle_fixed_cost') },
                                        { value: 2, text: translate('manage_transportation.cost_management.vehicle_operation_cost') },
                                    ]}
                                    onChange={handleVehicleCostTypeChange}
                                />
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="form-group">
                                <label>{translate('manage_transportation.cost_management.vehicle_constraint')}</label>
                                <table id="update-dependent-vehicle-cost" className="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>{translate('manage_transportation.vehicle_management.name')}</th>
                                            <th>{translate('manage_transportation.cost_management.vehicle_cost')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(allVehicleWithCost && allVehicleWithCost.length !== 0) &&
                                            allVehicleWithCost.map((vehicleCost, index) => (
                                                <tr key={index}>
                                                    <td>{vehicleCost.name}</td>
                                                    <td>
                                                        <input id={`vehicle-cost-value-${index}`} type="number" value={vehicleCost.cost ? vehicleCost.cost : ""} className="form-control" onChange={(event) => handleChangeInputCostValue(event, vehicleCost)}/>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const vehicle = state.vehicle;
    return { vehicle }
}

const mapDispatchToProps = {
    getAllVehicle: vehicleActions.getAllVehicle,
    getAllVehicleWithCondition: vehicleActions.getAllVehicleWithCondition,
    createVehicleCost: TransportationCostManagementActions.createVehicleCost,
    updateVehicleCost: TransportationCostManagementActions.updateVehicleCost
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(UpdateDependentVehiclesForm));