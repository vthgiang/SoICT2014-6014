import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ButtonModal, DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../common-components';

import { RecommendProcureFromValidator } from './RecommendProcureFromValidator';

import { RecommendProcureActions } from '../redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';

class RecommendProcureCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recommendNumber: "",
            dateCreate: this.formatDate(Date.now()),
            equipment: "",
            supplier: "",
            total: "",
            unit: "",
            estimatePrice: "",
            status: "Chờ phê duyệt",
            approver: null,
            note: "",
        };
    }

    // Function format ngày hiện tại thành dạnh dd-mm-yyyy
    formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }
            
        if (day.length < 2) {
            day = '0' + day;
        }

        return [day, month, year].join('-');
    }

    // Bắt sự kiện thay đổi mã phiếu
    handleRecommendNumberChange = (e) => {
        let value = e.target.value;
        this.validateRecommendNumber(value, true);
    }
    validateRecommendNumber = (value, willUpdateState = true) => {
        let msg = RecommendProcureFromValidator.validateRecommendNumber(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnRecommendNumber: msg,
                    recommendNumber: value,
                }
            });
        }
        return msg === undefined;
    }
    validateExitsRecommendNumber = (value) => {
        return this.props.recommendProcure.listRecommendProcures.some(item => item.recommendNumber === value);
    }

    // Bắt sự kiện thay đổi "Ngày lập"
    handleDateCreateChange = (value) => {
        this.validateDateCreate(value, true);
    }
    validateDateCreate = (value, willUpdateState = true) => {
        let msg = RecommendProcureFromValidator.validateDateCreate(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDateCreate: msg,
                    dateCreate: value,
                }
            });
        }
        return msg === undefined;
    }

    /**
     * Bắt sự kiện thay đổi người đề nghị
     */
    handleProponentChange = (value) => {
        this.setState({
            ...this.state,
            proponent: value[0]
        });
    }

    // Bắt sự kiện thay đổi "Thiết bị đề nghị mua"
    handleEquipmentChange = (e) => {
        let value = e.target.value;
        this.validateEquipment(value, true);
    }
    validateEquipment = (value, willUpdateState = true) => {
        let msg = RecommendProcureFromValidator.validateEquipment(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnEquipment: msg,
                    equipment: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Nhà cung cấp"
    handleSupplierChange = (e) => {
        let value = e.target.value;
        this.setState({
            ...this.state,
            supplier: value
        })
    }

    // Bắt sự kiện thay đổi "Số lượng"
    handleTotalChange = (e) => {
        let value = e.target.value;
        this.validateTotal(value, true);
    }
    validateTotal = (value, willUpdateState = true) => {
        let msg = RecommendProcureFromValidator.validateTotal(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnTotal: msg,
                    total: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Đơn vị tính"
    handleUnitChange = (e) => {
        let value = e.target.value;
        this.validateUnit(value, true);
    }
    validateUnit = (value, willUpdateState = true) => {
        let msg = RecommendProcureFromValidator.validateUnit(value, this.props.translate)
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

    // Bắt sự kiện thay đổi "Giá trị dự tính"
    handleEstimatePriceChange = (e) => {
        let value = e.target.value;
        this.setState({
            ...this.state,
            estimatePrice: value
        })
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result =
            this.validateRecommendNumber(this.state.recommendNumber, false) &&
            this.validateEquipment(this.state.equipment, false) &&
            this.validateTotal(this.state.total, false) &&
            this.validateUnit(this.state.unit, false);
        return result;
    }

    // Bắt sự kiện submit form
    save = () => {
        let dataToSubmit = { ...this.state, proponent: this.props.auth.user._id }

        if (this.isFormValidated() && this.validateExitsRecommendNumber(this.state.recommendNumber) === false) {
            return this.props.createRecommendProcure(dataToSubmit);
        }
    }

    render() {
        const { _id, translate, recommendProcure, user, auth } = this.props;
        const {
            recommendNumber, dateCreate, equipment, supplier, total, unit, estimatePrice,
            errorOnRecommendNumber, errorOnEquipment, errorOnTotal, errorOnUnit
        } = this.state;

        var userlist = user.list;

        return (
            <React.Fragment>
                <ButtonModal modalID="modal-create-recommendprocure" button_name={translate('asset.general_information.add')} title={translate('asset.manage_recommend_procure.add_recommend_card')} />
                <DialogModal
                    size='50' modalID="modal-create-recommendprocure" isLoading={recommendProcure.isLoading}
                    formID="form-create-recommendprocure"
                    title={translate('asset.manage_recommend_procure.add_recommend_card')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated() || this.validateExitsRecommendNumber(recommendNumber)}
                >
                    {/* Form thêm mới phiếu đề nghị mua sắm thiết bị */}
                    <form className="form-group" id="form-create-recommendprocure">
                        <div className="col-md-12">

                            <div className="col-sm-6">
                                {/* Mã phiếu */}
                                <div className={`form-group ${!errorOnRecommendNumber ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.form_code')}<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="recommendNumber" value={recommendNumber} onChange={this.handleRecommendNumberChange} autoComplete="off"
                                        placeholder="Mã phiếu" />
                                    <ErrorLabel content={errorOnRecommendNumber} />
                                    <ErrorLabel content={this.validateExitsRecommendNumber(recommendNumber) ? <span className="text-red">Mã phiếu đã tồn tại</span> : ''} />
                                </div>

                                {/* Ngày lập */}
                                <div className="form-group">
                                    <label>{translate('asset.general_information.create_date')}<span className="text-red">*</span></label>
                                    <DatePicker
                                        id="create_start_date"
                                        value={dateCreate}
                                        onChange={this.handleDateCreateChange}
                                    />
                                </div>

                                {/* Người đề nghị */}
                                <div className={`form-group`}>
                                    <label>{translate('asset.usage.proponent')}</label>
                                    <div>
                                        <div id="proponentBox">
                                            <SelectBox
                                                id={`add-proponent${_id}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={userlist.map(x => {
                                                    return { value: x._id, text: x.name + " - " + x.email }
                                                })}
                                                onChange={this.handleProponentChange}
                                                value={auth.user._id}
                                                multiple={false}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Thiết bị đề nghị mua */}
                                <div className={`form-group ${errorOnEquipment === undefined ? "" : "has-error"}`}>
                                    <label>{translate('asset.manage_recommend_procure.asset_recommend')}<span className="text-red">*</span></label>
                                    <textarea className="form-control" rows="3" style={{ height: 34 }} name="equipment" value={equipment} onChange={this.handleEquipmentChange} autoComplete="off"
                                        placeholder="Thiết bị đề nghị mua"></textarea>
                                    <ErrorLabel content={errorOnEquipment} />
                                </div>
                            </div>

                            <div className="col-sm-6">
                                {/* Nhà cung cấp */}
                                <div className="form-group">
                                    <label>{translate('asset.manage_recommend_procure.supplier')}</label>
                                    <input type="text" className="form-control" name="supplier" value={supplier} onChange={this.handleSupplierChange} autoComplete="off" placeholder="Nhà cung cấp" />
                                </div>

                                {/* Số lượng */}
                                <div className={`form-group ${errorOnTotal === undefined ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.number')}<span className="text-red">*</span></label>
                                    <input type="number" className="form-control" name="total" value={total} onChange={this.handleTotalChange} autoComplete="off" placeholder="Số lượng" />
                                    <ErrorLabel content={errorOnTotal} />
                                </div>

                                {/* Đơn vị tính */}
                                <div className={`form-group ${errorOnUnit === undefined ? "" : "has-error"}`}>
                                    <label>{translate('asset.manage_recommend_procure.unit')}<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="unit" value={unit} onChange={this.handleUnitChange} autoComplete="off" placeholder="Đơn vị tính" />
                                    <ErrorLabel content={errorOnUnit} />
                                </div>

                                {/* Giá trị dự tính */}
                                <div className="form-group">
                                    <label>{translate('asset.manage_recommend_procure.expected_value')} (VNĐ)</label>
                                    <input type="number" className="form-control" name="estimatePrice" value={estimatePrice}
                                        onChange={this.handleEstimatePriceChange} autoComplete="off" placeholder="Giá trị dự tính" />
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

function mapState(state) {
    const { recommendProcure, auth, user } = state;
    return { recommendProcure, auth, user };
};

const actionCreators = {
    getUser: UserActions.get,
    createRecommendProcure: RecommendProcureActions.createRecommendProcure,
};

const createForm = connect(mapState, actionCreators)(withTranslate(RecommendProcureCreateForm));
export { createForm as RecommendProcureCreateForm };
