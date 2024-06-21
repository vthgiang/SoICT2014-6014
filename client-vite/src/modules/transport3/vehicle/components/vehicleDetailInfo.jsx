import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { vehicleActions } from '../redux/actions';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { DialogModal, SelectBox, TreeSelect } from '../../../../common-components';
import { CategoryActions } from '../../../production/common-production/category-management/redux/actions';

const VehicleDetailInfo = (props) => {

    const [state, setState] = useState({
        textCannotTransportGoodGroup: ""
    })
    const { translate, vehicle, categories } = props;
    let currentDetailVehicle = {};

    if (vehicle.currentDetailVehicle) {
        currentDetailVehicle = vehicle.currentDetailVehicle;
    }
    const getNameCannotTransportCategories = () => {
        var text = "";
        if (currentDetailVehicle.goodGroupsCannotTransport && currentDetailVehicle.goodGroupsCannotTransport.length > 0) {
            var filteredCategories = categories.listPaginate.filter((item) => { return currentDetailVehicle.goodGroupsCannotTransport.includes(item._id) });
            filteredCategories.forEach(element => {
                text += element.name + "  ";
            });
        }
        return text;
    }
    useEffect(() => {
        props.vehicleId && props.getVehicleDetail(props.vehicleId);
    }, [props.vehicleId]);

    let textCannotTransportGoodGroup = getNameCannotTransportCategories();
    let listLicenseText = "";
    if (currentDetailVehicle.requireLicense) {
        currentDetailVehicle.requireLicense.forEach((license) => listLicenseText+= `Hạng ${license}, `);
        listLicenseText = listLicenseText.slice(0, -2);
    }
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-detail-info-vehicle`} isLoading={vehicle.isLoading}
                title={translate('manage_transportation.vehicle_management.detail_info_vehicle')}
                formID={`form-detail-vehicle`}
                size={50}
                maxWidth={500}
                hasSaveButton={false}
                hasNote={false}
            >
                <form id={`form-detail-vehicle`}>
                <div className="row">
                        <div className="col-md-6">
                            <div className={`form-group`}>
                                <label>{translate('manage_transportation.vehicle_management.name')}</label>
                                <input type="text" className="form-control" value={currentDetailVehicle.name?currentDetailVehicle.name:""} disabled></input>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('asset.asset_info.vehicle_kind')}</label>
                                <input type="text" className="form-control" value={currentDetailVehicle.vehicleType?currentDetailVehicle.vehicleType:""} disabled></input>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('manage_transportation.vehicle_management.height')}</label>
                                <input type="number" className="form-control" value={currentDetailVehicle.height?currentDetailVehicle.height:""} disabled={true}></input>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('manage_transportation.vehicle_management.width')}</label>
                                <input type="number" className="form-control" value={currentDetailVehicle.width?currentDetailVehicle.width:""} disabled={true}></input>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('manage_transportation.vehicle_management.depth')}</label>
                                <input type="number" className="form-control" value={currentDetailVehicle.depth?currentDetailVehicle.depth:""} disabled={true}></input>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('manage_transportation.vehicle_management.tonnage')}</label>
                                <input type="number" className="form-control" value={currentDetailVehicle.tonnage?currentDetailVehicle.tonnage:""} disabled={true}></input>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('manage_transportation.vehicle_management.average_gas_consume')}</label>
                                <input type="number" className="form-control" value={currentDetailVehicle.averageGasConsume?currentDetailVehicle.averageGasConsume:""} disabled={true}></input>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('manage_transportation.vehicle_management.min_velocity')}</label>
                                <input type="number" className="form-control" value={currentDetailVehicle.minVelocity?currentDetailVehicle.minVelocity:""} disabled={true}></input>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('manage_transportation.vehicle_management.max_velocity')}</label>
                                <input type="number" className="form-control" value={currentDetailVehicle.maxVelocity?currentDetailVehicle.maxVelocity:""} disabled={true}></input>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('manage_transportation.vehicle_management.operation_cost')}</label>
                                <input type="number" className="form-control" value={currentDetailVehicle.vehicleCost?currentDetailVehicle.vehicleCost:""} disabled={true}></input>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('manage_transportation.vehicle_management.require_license')}</label>
                                <p>{listLicenseText ? listLicenseText : ""}</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>{translate('manage_transportation.vehicle_management.cannot_carry_good_group')}</label>
                                <p>{textCannotTransportGoodGroup}</p>
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
    const categories =  state.categories;
    return { vehicle, categories };
}

const mapDispatchToProps = {
    getVehicleDetail: vehicleActions.getVehicleDetail,
    getCategories: CategoryActions.getCategories,
}

export default React.memo(connect(mapStateToProps, mapDispatchToProps)(withTranslate(VehicleDetailInfo)));