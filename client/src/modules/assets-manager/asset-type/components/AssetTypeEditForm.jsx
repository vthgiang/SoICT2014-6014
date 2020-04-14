import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ModalDialog, ModalButton, ErrorLabel, DatePicker } from '../../../../common-components';
import { AssetTypeFromValidator } from './AssetTypeFromValidator';
// import { AssetTypeActions } from '../redux/actions';
class AssetTypeEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
     * Bắt sự kiện thay đổi cấp ra quyết định
     */
    handleUnitChange = (e) => {
        let value = e.target.value;
        this.validateUnit(value, true);
    }
    validateUnit = (value, willUpdateState = true) => {
        let msg = AssetTypeFromValidator.validateUnit(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnUnit: msg,
                    unit: value,
                }
            });
        }
        return msg === undefined;
    }
    /**
     * Bắt sự kiện thay đổi ngày ra quyết định
     */
    handleStartDateChange = (value) => {
        this.setState({
            ...this.state,
            startDate: value
        })
    }

    /**
     * Bắt sự kiện thay đổi hình thức khen thưởng
     */
    handleTypeChange = (e) => {
        let value = e.target.value;
        this.validateType(value, true);
    }
    validateType = (value, willUpdateState = true) => {
        let msg = AssetTypeFromValidator.validateType(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnType: msg,
                    type: value,
                }
            });
        }
        return msg === undefined;
    }

    /**
     *  Bắt sự kiện thay đổi thành tich(lý do) khen thưởng
     */
    handleReasonChange = (e) => {
        let value = e.target.value;
        this.validateReason(value, true);
    }
    validateReason = (value, willUpdateState = true) => {
        let msg = AssetTypeFromValidator.validateReason(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnReason: msg,
                    reason: value,
                }
            });
        }
        return msg === undefined;
    }

    /**
     * Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
     */
    isFormValidated = () => {
        let result = this.validateUnit(this.state.unit, false) && this.validateType(this.state.reason, false) &&
            this.validateReason(this.state.reason, false);
        return result;
    }
    /**
     * Bắt sự kiện submit form
     */
    save = () => {
        if (this.isFormValidated()) {
            return this.props.updateAssetType(this.state._id, this.state);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                employeeNumber: nextProps.employeeNumber,
                number: nextProps.number,
                unit: nextProps.unit,
                startDate: nextProps.startDate,
                type: nextProps.type,
                reason: nextProps.reason,
                errorOnUnit: undefined,
                errorOnType: undefined,
                errorOnReason: undefined
            }
        } else {
            return null;
        }
    }
    render() {
        const { translate, assetType } = this.props;
        const { employeeNumber, startDate, reason, number, unit, type,
            errorOnUnit, errorOnType, errorOnReason } = this.state;
        return (
            <React.Fragment>
                <ModalDialog
                    size='50' modalID="modal-edit-assettype" isLoading={assetType.isLoading}
                    formID="form-edit-assettype"
                    title="Chỉnh sửa thông tin loại tài sản"
                    msg_success={translate('error.edit_praise_success')}
                    msg_faile={translate('error.edit_praise_faile')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-edit-assettype">
                        <div className="form-group">
                            <label>Mã loại tài sản<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="employeeNumber" value={employeeNumber} disabled autoComplete="off" />
                        </div>
                        <div className={`col-sm-6 col-xs-12 form-group ${errorOnUnit === undefined ? "" : "has-error"}`}>
                            <label>{translate('discipline.decision_unit')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="unit" value={unit} onChange={this.handleUnitChange} autoComplete="off" placeholder={translate('discipline.decision_unit')} />
                            <ErrorLabel content={errorOnUnit} />
                        </div>
                        <div className="form-group">
                            <label>Thời gian khấu hao</label>
                            <input type="number" className="form-control" name="employeeNumber" defaultValue="" onChange={this.handleMSNVChange} autoComplete="off" placeholder="Thời gian khấu hao" />
                        </div>
                        <div className="form-group">
                            <label>Loại tài sản cha</label>
                            <input type="text" className="form-control" name="employeeNumber" defaultValue="" onChange={this.handleMSNVChange} autoComplete="off" placeholder="Loại tài sản cha" />
                        </div>
                        <div className="form-group">
                            <label>Mô tả</label>
                            <input type="text" className="form-control" name="employeeNumber" defaultValue="" onChange={this.handleMSNVChange} autoComplete="off" placeholder="Mô tả" />
                        </div>
                    </form>
                </ModalDialog>
            </React.Fragment>
        );
    }
};
function mapState(state) {
    const { assetType } = state;
    return { assetType };
};

const actionCreators = {
    // updateAssetType: AssetTypeActions.updateAssetType,
};

const editForm = connect(mapState, actionCreators)(withTranslate(AssetTypeEditForm));
export { editForm as AssetTypeEditForm };