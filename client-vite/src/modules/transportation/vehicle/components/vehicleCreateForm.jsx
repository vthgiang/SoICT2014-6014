import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel, SelectBox, SelectMulti, TreeSelect } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../helpers/validationHelper';
import { vehicleActions } from '../redux/actions';
import { CategoryActions } from '../../../production/common-production/category-management/redux/actions';

const VehicleCreateForm = (props) => {
    const { vehicle, translate, page, perPage, categories } = props;

    const [state, setState] = useState({
        vehicleName: "",
        vehicleNameError: undefined,
        tonnage: "",
        volume: "",
        width: "",
        height: "",
        depth: "",
        averageGasConsume: "",
        fixedCost: "",
        unloadingCost: "",
        averageFeeTransport: "",
        minVelocity: "",
        maxVelocity: "",
        vehicleType: "",
        goodGroupsCannotTransport: [],
        requireLicense: [],
    })
    const { vehicleName, vehicleNameError, vehicleType, goodGroupsCannotTransport, tonnage, volume, width, height, depth, averageFeeTransport, averageGasConsume,
            fixedCost, minVelocity, maxVelocity, unloadingCost, requireLicense} = state;

    const isFormValidated = () => {
        const { vehicleName } = state;
        let { translate } = props;
        if (!ValidationHelper.validateName(translate, vehicleName, 6, 255).status) {
            return false;
        }
        return true;
    }

    // Xử lý thay đổi giá trị trong form tạo mới
    const handleVehicleName = (e) => {
        const { value } = e.target;

        let { translate } = props;
        let { message } = ValidationHelper.validateName(translate, value, 6, 255);

        setState({
            ...state,
            vehicleName: value,
            vehicleNameError: message
        })
    }

    const handleVehicleTypeChange = (value) => {
        setState({
            ...state,
            vehicleType: value[0]?value[0]:"TRUCK"
        })
    }

    const handleVehicleHeightChange = (e) => {
        const value = e.target.value;

        setState({
            ...state,
            height: value
        })
    }

    const handleVehicleWidthChange = (e) => {
        const value = e.target.value;

        setState({
            ...state,
            width: value
        })
    }

    const handleVehicleDepthChange = (e) => {
        const value = e.target.value;

        setState({
            ...state,
            depth: value
        })
    }

    const handleVehicleTonnageChange = (e) => {
        const value = e.target.value;

        setState({
            ...state,
            tonnage: value
        })
    }

    const handleVehicleGasConsumeChange = (e) => {
        const value = e.target.value;

        setState({
            ...state,
            averageGasConsume: value
        })
    }

    const handleVehicleMinVelocityChange = (e) => {
        const value = e.target.value;

        setState({
            ...state,
            minVelocity: value
        })
    }

    const handleVehicleMaxVelocityChange = (e) => {
        const value = e.target.value;

        setState({
            ...state,
            maxVelocity: value
        })
    }

    const handleVehicleFixedCostChange = (e) => {
        const value = e.target.value;

        setState({
            ...state,
            fixedCost: value
        })
    }

    const handleCannotTransportChange = (value) => {
        setState({
            ...state,
            goodGroupsCannotTransport: value
        })
    }

    const handleVehicleUnloadingCostChange = (e) => {
        setState({
            ...state,
            unloadingCost: e.target.value
        })
    }

    const handleChangeRequireLicense = (value) => {
        if (value.length === 0) {
            value = null
        }
        setState({
            ...state,
            requireLicense: value
        })
    }

    // Kết thúc xử lý thay đổi dữ liệu trong form tạo mới

    const save = () => {
        if (isFormValidated()) {
            var data = {
                ...state
            }
            props.createVehicle([data]);
            props.getAllVehicle({
                page: page,
                perPage: perPage
            })
        }
    }


    let listCategory = categories && categories.listPaginate;
    let categoryArr = listCategory && listCategory.map(item => {
        return {
            _id: item._id,
            name: item.name,
        };
    })

    const itemSelectRequireLicense = [
        {value: 'A2', text: "Bằng xe máy A2"},
        {value: 'B1', text: "Bằng ô tô hạng B1"},
        {value: 'B2', text: "Bằng ô tô hạng B2"},
        {value: 'C', text: "Bằng ô tô hạng C"},
        {value: 'FB1', text: "Bằng ô tô hạng FB1"},
        {value: 'FB2', text: "Bằng ô tô hạng FB2"},
        {value: 'FC', text: "Bằng ô tô hạng FC"},
    ];

    return (
        <React.Fragment>
            <ButtonModal modalID="modal-create-vehicle" button_name={translate('manage_transportation.vehicle_management.add')} title={translate('manage_transportation.vehicle_management.add_title')} />
            <DialogModal
                modalID="modal-create-vehicle" isLoading={vehicle.isLoading}
                formID="form-create-vehicle"
                title={translate('manage_transportation.vehicle_management.add_title')}
                msg_success={translate('manage_transportation.vehicle_management.add_success')}
                msg_failure={translate('manage_transportation.vehicle_management.add_fail')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={65}
                maxWidth={700}
            >
                <form id="form-create-vehicle" onSubmit={() => save(translate('manage_transportation.vehicle_management.add_success'))}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className={`form-group ${!vehicleNameError ? "" : "has-error"}`}>
                                <label>{translate('manage_transportation.vehicle_management.name')}<span className="text-red">*</span></label>
                                <input type="text" className="form-control" value={vehicleName} onChange={handleVehicleName}></input>
                                <ErrorLabel content={vehicleNameError} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('asset.asset_info.vehicle_kind')}<span className="text-red">*</span></label>
                                <SelectBox
                                    id={`create-form-vehicle-type`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    value={vehicleType}
                                    items={[
                                        { value: '', text: `---${translate('asset.asset_info.select_vehicle_kind')}---` },
                                        { value: "BIKE", text: translate('asset.asset_info.bike') },
                                        { value: "TRUCK", text: translate('asset.asset_info.truck') },
                                    ]}
                                    onChange={handleVehicleTypeChange}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('manage_transportation.vehicle_management.height')}<span className="text-red">*</span></label>
                                <input type="number" className="form-control" value={height} onChange={handleVehicleHeightChange}></input>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('manage_transportation.vehicle_management.width')}<span className="text-red">*</span></label>
                                <input type="number" className="form-control" value={width} onChange={handleVehicleWidthChange}></input>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('manage_transportation.vehicle_management.depth')}<span className="text-red">*</span></label>
                                <input type="number" className="form-control" value={depth} onChange={handleVehicleDepthChange}></input>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('manage_transportation.vehicle_management.tonnage')}<span className="text-red">*</span></label>
                                <input type="number" className="form-control" value={tonnage} onChange={handleVehicleTonnageChange}></input>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('manage_transportation.vehicle_management.average_gas_consume')}<span className="text-red">*</span></label>
                                <input type="number" className="form-control" value={averageGasConsume} onChange={handleVehicleGasConsumeChange}></input>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('manage_transportation.vehicle_management.min_velocity')}<span className="text-red">*</span></label>
                                <input type="number" className="form-control" value={minVelocity} onChange={handleVehicleMinVelocityChange}></input>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label style={{marginBottom: "11px"}}>{translate('manage_transportation.vehicle_management.max_velocity')}<span className="text-red">*</span></label>
                                <input type="number" className="form-control" value={maxVelocity} onChange={handleVehicleMaxVelocityChange}></input>
                            </div>
                        </div>
                        <div className="col-md-6">

                            <div className="form-group">
                                <label  style={{marginTop: "-10px"}} className="form-control-static">{translate('manage_transportation.vehicle_management.require_license')}<span className="text-red">*</span></label>
                                <SelectMulti
                                    id={`select-license-require-of-vehicle-create-form`}
                                    className="form-control select2"
                                    multiple="multiple"
                                    options={{ nonSelectedText: translate('manage_transportation.vehicle_management.select_require_license'), allSelectedText: translate('production.request_management.select_all') }}
                                    style={{ width: "100%" }}
                                    items={itemSelectRequireLicense}
                                    onChange={handleChangeRequireLicense}
                                />
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="form-group">
                                <label>{translate('manage_transportation.vehicle_management.cannot_carry_good_group')}</label>
                                <TreeSelect
                                    data={categoryArr}
                                    value={goodGroupsCannotTransport}
                                    handleChange={handleCannotTransportChange}
                                    mode="hierarchical"
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
    createVehicle: vehicleActions.createVehicle,
    getAllVehicle: vehicleActions.getAllVehicle,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(VehicleCreateForm));