import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ModalDialog, ModalButton, ErrorLabel, DatePicker } from '../../../../common-components';
import { AssetTypeFromValidator } from './AssetTypeFromValidator';

// import { AssetTypeActions } from '../redux/actions';
class AssetTypeCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employeeNumber: "",
            number: "",
            unit: "",
            startDate: this.formatDate(Date.now()),
            type: "",
            reason: "",
        };
    }
    /**
     * Function format ngày hiện tại thành dạnh dd-mm-yyyy
     */
    formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }
    /**
     * Bắt sự kiện thay đổi mã nhân viên
     */
    handleMSNVChange = (e) => {
        let value = e.target.value;
        this.validateEmployeeNumber(value, true);
    }
    validateEmployeeNumber = (value, willUpdateState = true) => {
        let msg = AssetTypeFromValidator.validateEmployeeNumber(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnEmployeeNumber: msg,
                    employeeNumber: value,
                }
            });
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi số quyết định
     */
    handleNumberChange = (e) => {
        let value = e.target.value;
        this.validateNumber(value, true);
    }
    validateNumber = (value, willUpdateState = true) => {
        let msg = AssetTypeFromValidator.validateNumber(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnNumber: msg,
                    number: value,
                }
            });
        }
        return msg === undefined;
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
        let result =
            this.validateEmployeeNumber(this.state.employeeNumber, false) &&
            this.validateNumber(this.state.number, false) && this.validateUnit(this.state.unit, false) &&
            this.validateType(this.state.reason, false) && this.validateReason(this.state.reason, false);
        return result;
    }
    /**
     * Bắt sự kiện submit form
     */
    save = () => {
        if (this.isFormValidated()) {
            return this.props.createNewAssetType(this.state);
        }
    }
    render() {
        const { translate, assetType } = this.props;
        const { employeeNumber, startDate, reason, number, unit, type,
            errorOnEmployeeNumber, errorOnNumber, errorOnUnit, errorOnType, errorOnReason } = this.state;
        return (
            <React.Fragment>
                <ModalButton modalID="modal-create-assettype" button_name="Thêm mới " title="Thêm mới loại tài sản" />
                <ModalDialog
                    size='50' modalID="modal-create-assettype" isLoading={assetType.isLoading}
                    formID="form-create-assettype"
                    title="Thêm mới loại tài sản"
                    msg_success={translate('error.create_praise_success')}
                    msg_faile={translate('error.create_praise_faile')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-create-assettype">
                        <div className={`form-group ${errorOnEmployeeNumber === undefined ? "" : "has-error"}`}>
                            <label>Mã loại tài sản<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="employeeNumber" defaultValue="" onChange={this.handleMSNVChange} autoComplete="off" placeholder="Mã loại tài sản" />
                            <ErrorLabel content={errorOnEmployeeNumber} />
                        </div>
                        <div className={`form-group ${errorOnEmployeeNumber === undefined ? "" : "has-error"}`}>
                            <label>Tên loại tài sản<span className="text-red">*</span></label>
                            <input type="text" className="form-control" name="employeeNumber" defaultValue="" onChange={this.handleMSNVChange} autoComplete="off" placeholder="Tên loại tài sản" />
                            <ErrorLabel content={errorOnEmployeeNumber} />
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
    // createNewAssetType: AssetTypeActions.createNewAssetType,
};

const createForm = connect(mapState, actionCreators)(withTranslate(AssetTypeCreateForm));
export { createForm as AssetTypeCreateForm };