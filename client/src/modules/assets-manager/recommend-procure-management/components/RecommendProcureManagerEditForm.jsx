import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withTranslate} from 'react-redux-multilingual';
import {DatePicker, DialogModal, ErrorLabel, SelectBox} from '../../../../common-components';
import {RecommendProcureFromValidator} from '../../recommend-procure/components/RecommendProcureFromValidator';
import {RecommendProcureActions} from '../../recommend-procure/redux/actions';
import {UserActions} from '../../../super-admin/user/redux/actions';

class RecommendProcureManagerEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "Chờ phê duyệt"
        };

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

    // Bắt sự kiện thay đổi "Ngày lập"
    handleDateCreateChange = (value) => {
        this.setState({
            ...this.state,
            dateCreate: value
        })
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

    //Bắt sự kiện thay đổi "Người phê duyệt"
    handleApproverChange = (value) => {
        this.setState({
            ...this.state,
            approver: value[0]
        });
    };

    // Bắt sự kiện thay đổi "Trạng thái"
    handleStatusChange = (value) => {
        this.setState({
            ...this.state,
            status: value[0]
        })
    }

    // Bắt sự kiện thay đổi "Ghi chú"
    handleNoteChange = (e) => {
        let value = e.target.value;
        this.setState({
            ...this.state,
            note: value
        })
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result =
            this.validateEquipment(this.state.equipment, false) &&
            this.validateTotal(this.state.total, false) &&
            this.validateUnit(this.state.unit, false);
        return result;
    };

    save = () => {
        let dataToSubmit = {...this.state, approver: this.props.auth.user._id};
        if (this.isFormValidated()) {
            return this.props.updateRecommendProcure(this.state._id, dataToSubmit);
        }
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                recommendNumber: nextProps.recommendNumber,
                dateCreate: nextProps.dateCreate,
                proponent: nextProps.proponent,
                equipment: nextProps.equipment,
                supplier: nextProps.supplier,
                total: nextProps.total,
                unit: nextProps.unit,
                estimatePrice: nextProps.estimatePrice,
                approver: nextProps.approver,
                status: nextProps.status,
                note: nextProps.note,
                errorOnEquipment: undefined,
                errorOnTotal: undefined,
                errorOnUnit: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const {_id, translate, recommendProcure, user, auth} = this.props;
        var userlist = user.list;
        const {
            recommendNumber, dateCreate, proponent, equipment, supplier, total, unit, estimatePrice, approver, status, note,
            errorOnEquipment, errorOnTotal, errorOnUnit
        } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    size='75' modalID="modal-edit-recommendprocuremanage" isLoading={recommendProcure.isLoading}
                    formID="form-edit-recommendprocuremanage"
                    title="Cập nhật phiếu đăng ký mua sắm tài sản"
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-edit-recommendprocure">
                        <div className="col-md-12">
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <label>Mã phiếu<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="recommendNumber" value={recommendNumber} onChange={this.handleRecommendNumberChange}/>
                                </div>
                                <div className="form-group">
                                    <label>Ngày lập<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`edit_start_date${_id}`}
                                        value={dateCreate}
                                        onChange={this.handleDateCreateChange}
                                        // disabled
                                    />
                                </div>
                                <div className={`form-group`}>
                                    <label>Người đề nghị</label>
                                    <div>
                                        <div id="proponentBox">
                                            <SelectBox
                                                id={`proponent${_id}`}
                                                className="form-control select2"
                                                style={{width: "100%"}}
                                                items={userlist.map(x => {
                                                    return {value: x._id, text: x.name + " - " + x.email}
                                                })}
                                                onChange={this.handleProponentChange}
                                                value={proponent._id}
                                                multiple={false}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className={`form-group ${errorOnEquipment === undefined ? "" : "has-error"}`}>
                                    <label>Thiết bị đề nghị mua<span className="text-red">*</span></label>
                                    <textarea className="form-control" rows="3" style={{height: 34}} name="equipment" value={equipment} onChange={this.handleEquipmentChange}></textarea>
                                    <ErrorLabel content={errorOnEquipment}/>
                                </div>
                                <div className="form-group">
                                    <label>Nhà cung cấp</label>
                                    <input type="text" className="form-control" name="supplier" value={supplier} onChange={this.handleSupplierChange}/>
                                </div>
                                <div className={`form-group ${errorOnTotal === undefined ? "" : "has-error"}`}>
                                    <label>Số lượng<span className="text-red">*</span></label>
                                    <input type="number" className="form-control" name="total" value={total} onChange={this.handleTotalChange}/>
                                    <ErrorLabel content={errorOnTotal}/>
                                </div>
                            </div>
                            <div className="col-sm-6">

                                <div className={`form-group ${errorOnUnit === undefined ? "" : "has-error"}`}>
                                    <label>Đơn vị tính<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="unit" value={unit} onChange={this.handleUnitChange} autoComplete="off" placeholder="Đơn vị tính"/>
                                    <ErrorLabel content={errorOnUnit}/>
                                </div>
                                <div className="form-group">
                                    <label>Giá trị dự tính:</label>
                                    <input type="number" className="form-control" name="estimatePrice" value={estimatePrice} onChange={this.handleEstimatePriceChange}/>
                                </div>
                                <div className={`form-group`}>
                                    <label>Người phê duyệt</label>
                                    <div>
                                        <div id="approver">
                                            <SelectBox
                                                id={`approver${_id}`}
                                                className="form-control select2"
                                                style={{width: "100%"}}
                                                items={userlist.map(x => {
                                                    return {value: x._id, text: x.name + " - " + x.email}
                                                })}
                                                onChange={this.handleApproverChange}
                                                value={auth.user._id}
                                                multiple={false}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Trạng thái</label>
                                    <SelectBox
                                        id={`status${_id}`}
                                        className="form-control select2"
                                        style={{width: "100%"}}
                                        value={status}
                                        items={[
                                            {value: 'Đã phê duyệt', text: 'Đã phê duyệt'},
                                            {value: 'Chờ phê duyệt', text: 'Chờ phê duyệt'},
                                            {value: 'Không phê duyệt', text: 'Không phê duyệt'},
                                        ]}
                                        onChange={this.handleStatusChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Ghi chú</label>
                                    <textarea className="form-control" rows="3" style={{height: 34}} name="note" value={note} onChange={this.handleNoteChange}></textarea>
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
    const {recommendProcure, user, auth} = state;
    return {recommendProcure, user, auth};
};

const actionCreators = {
    getUser: UserActions.get,
    updateRecommendProcure: RecommendProcureActions.updateRecommendProcure,
};

const editRecommendProcureManager = connect(mapState, actionCreators)(withTranslate(RecommendProcureManagerEditForm));
export {editRecommendProcureManager as RecommendProcureManagerEditForm};
