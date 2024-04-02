import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ButtonModal, DialogModal, ErrorLabel, SelectBox, TreeSelect } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../helpers/validationHelper';
import { TransportationCostManagementActions } from '../redux/actions';

const ShipperCostUpdateForm = (props) => {
    const { translate, shipper, shipperCostEdit } = props;

    const [state, setState] = useState({
        id: "",
        shipperCostName: "",
        shipperCostNameError: undefined,
        shipperCostCode: "",
        shipperCostQuota: '',
        cost: "",
    })
    const { shipperCostName, shipperCostNameError, shipperCostCode, shipperCostQuota, cost} = state;

    const isFormValidated = () => {
        const { shipperCostName } = state;
        let { translate } = props;
        if (!ValidationHelper.validateName(translate, shipperCostName, 6, 255).status) {
            return false;
        }
        return true;
    }
    useEffect(() => {
        if (shipperCostEdit) {
            setState({
                shipperCostName: shipperCostEdit.name,
                shipperCostCode: shipperCostEdit.code,
                shipperCostQuota: shipperCostEdit.quota,
                cost: shipperCostEdit.cost,
            })
        }
    }, [shipperCostEdit])

    // Xử lý thay đổi giá trị trong form tạo mới
    const handleShipperCostName = (e) => {
        const { value } = e.target;

        let { translate } = props;
        let { message } = ValidationHelper.validateName(translate, value, 6, 255);

        setState({
            ...state,
            shipperCostName: value,
            shipperCostNameError: message
        })
    }

    const handleShipperCostCode = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            shipperCostCode: value
        })
    }

    const handleShipperCostQuota = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            shipperCostQuota: value
        })
    }

    const handleChangeCost = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            cost: value
        })
    }


    // Kết thúc xử lý thay đổi dữ liệu trong form tạo mới

    const save = () => {
        if (isFormValidated()) {
            var data = {
                ...state,
                id: shipperCostEdit.id
            }
            props.createOrUpdateShipperCost(data);
        }
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-edit-shipper-cost" isLoading={shipper.isLoading}
                formID="form-edit-shipper-cost"
                title={translate('manage_transportation.shipper_management.edit_title')}
                msg_success={translate('manage_transportation.shipper_management.edit_success')}
                msg_failure={translate('manage_transportation.shipper_management.edit_fail')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={65}
                maxWidth={700}
            >
                <form id="form-edit-shipper-cost" onSubmit={() => save(translate('manage_transportation.cost_management.shipper_cost_add_success'))}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className={`form-group ${!shipperCostNameError ? "" : "has-error"}`}>
                                <label>Tên chỉ số<span className="text-red">*</span></label>
                                <input type="text" className="form-control" value={shipperCostName} onChange={handleShipperCostName}></input>
                                <ErrorLabel content={shipperCostNameError} />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className={`form-group ${!shipperCostNameError ? "" : "has-error"}`}>
                                <label>Mã chỉ số<span className="text-red">*</span></label>
                                <input type="text" className="form-control" value={shipperCostCode} onChange={handleShipperCostCode}></input>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className={`form-group ${!shipperCostNameError ? "" : "has-error"}`}>
                                <label>Định mức<span className="text-red">*</span></label>
                                <input type="number" className="form-control" value={shipperCostQuota} onChange={handleShipperCostQuota}></input>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className={`form-group ${!shipperCostNameError ? "" : "has-error"}`}>
                                <label>Số tiền<span className="text-red">*</span></label>
                                <input type="number" className="form-control" value={cost} onChange={handleChangeCost}></input>
                            </div>
                        </div>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const shipper = state.shipper;
    return { shipper }
}

const mapDispatchToProps = {
    createOrUpdateShipperCost: TransportationCostManagementActions.createOrUpdateShipperCost,
    getAllShipperCosts: TransportationCostManagementActions.getAllShipperCosts
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ShipperCostUpdateForm));