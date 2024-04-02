import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel, SelectBox, TreeSelect } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../helpers/validationHelper';
import { vehicleActions } from '../../vehicle/redux/actions';
import { TransportationCostManagementActions } from '../redux/actions';

const VehicleCostCreateForm = (props) => {
    const { vehicle, translate } = props;

    const [state, setState] = useState({
        vehicleCostName: "",
        vehicleCostNameError: undefined,
        vehicleCostType: "",
        vehicleCostCode: "",
    })
    const { vehicleCostName, vehicleCostNameError, vehicleCostType, vehicleCostCode} = state;

    const isFormValidated = () => {
        const { vehicleCostName } = state;
        let { translate } = props;
        if (!ValidationHelper.validateName(translate, vehicleCostName, 6, 255).status) {
            return false;
        }
        return true;
    }

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
            vehicleCostCode: value
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
            var data = {
                ...state
            }
            props.createVehicleCost(data);
            // props.getAllVehicleCosts();
        }
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-create-vehicle-cost" isLoading={vehicle.isLoading}
                formID="form-create-vehicle-cost"
                title={translate('manage_transportation.vehicle_management.add_title')}
                msg_success={translate('manage_transportation.vehicle_management.add_success')}
                msg_failure={translate('manage_transportation.vehicle_management.add_fail')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={65}
                maxWidth={700}
            >
                <form id="form-create-vehicle-cost" onSubmit={() => save(translate('manage_transportation.cost_management.vehicle_cost_add_success'))}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className={`form-group ${!vehicleCostNameError ? "" : "has-error"}`}>
                                <label>{translate('manage_transportation.cost_management.name_vehicle_cost')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" value={vehicleCostName} onChange={handleVehicleCostName}></input>
                                <ErrorLabel content={vehicleCostNameError} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className={`form-group ${!vehicleCostNameError ? "" : "has-error"}`}>
                                <label>{translate('manage_transportation.cost_management.vehicle_cost_code')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" value={vehicleCostCode} onChange={handleVehicleCostCode}></input>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('manage_transportation.cost_management.type_vehicle_cost')}<span className="text-red">*</span></label>
                                <SelectBox
                                    id={`create-form-vehicle-cost-type`}
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
    createVehicleCost: TransportationCostManagementActions.createVehicleCost,
    getAllVehicleCosts: TransportationCostManagementActions.getAllVehicleCosts
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(VehicleCostCreateForm));