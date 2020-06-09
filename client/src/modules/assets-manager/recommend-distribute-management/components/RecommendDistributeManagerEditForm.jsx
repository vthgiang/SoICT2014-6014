import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ErrorLabel, DatePicker } from '../../../../common-components';
import { RecommendDistributeFromValidator } from '../../recommend-distribute/components/RecommendDistributeFromValidator';
import { RecommendDistributeActions } from '../../recommend-distribute/redux/actions';
import { UserActions } from "../../../super-admin/user/redux/actions";

class RecommendDistributeManagerEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userProponentIndex: "",
            userApproverIndex: "",
        };

    }

    // Bắt sự kiện thay đổi mã phiếu
    handleRecommendNumberChange = (e) => {
        let value = e.target.value;
        this.validateRecommendNumber(value, true);
    }
    validateRecommendNumber = (value, willUpdateState = true) => {
        let msg = RecommendDistributeFromValidator.validateRecommendNumber(value, this.props.translate)
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
        this.validateDateCreate(value, true);
    }
    validateDateCreate = (value, willUpdateState = true) => {
        let msg = RecommendDistributeFromValidator.validateDateCreate(value, this.props.translate)
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

    //Bắt sự kiện thay đổi "Người đề nghị"
    handleProponentChange = (e) => {
        const selectedIndex = e.target.options.selectedIndex;
        this.setState({ userProponentIndex: e.target.options[selectedIndex].getAttribute('data-key1') });
        let value = e.target.value;
        this.validateProponent(value, true);
    }
    validateProponent = (value, willUpdateState = true) => {
        let msg = RecommendDistributeFromValidator.validateProponent(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnProponent: msg,
                    proponent: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Nội dung đề nghị"
    handleReqContentChange = (e) => {
        let value = e.target.value;
        this.validateReqContent(value, true);
    }
    validateReqContent = (value, willUpdateState = true) => {
        let msg = RecommendDistributeFromValidator.validateReqContent(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnReqContent: msg,
                    reqContent: value,
                }
            });
        }
        return msg === undefined;
    }

    //bắt sự kiện thay đổi mã tài sản
    handleCodeChange = (e) => {
        let value = e.target.value;
        this.validateCode(value, true);
    }
    validateCode = (value, willUpdateState = true) => {
        let msg = RecommendDistributeFromValidator.validateCode(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnCode: msg,
                    code: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Thời gian đăng ký sử dụng từ ngày"
    handleDateStartUseChange = (value) => {
        this.validateDateStartUse(value, true);
    }
    validateDateStartUse = (value, willUpdateState = true) => {
        let msg = RecommendDistributeFromValidator.validateDateStartUse(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDateStartUse: msg,
                    dateStartUse: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Thời gian đăng ký sử dụng đến ngày"
    handleDateEndUseChange = (value) => {
        this.validateDateEndUse(value, true);
    }
    validateDateEndUse = (value, willUpdateState = true) => {
        let msg = RecommendDistributeFromValidator.validateDateEndUse(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDateEndUse: msg,
                    dateEndUse: value,
                }
            });
        }
        return msg === undefined;
    }

    //Bắt sự kiện thay đổi "Người phê duyệt"
    handleApproverChange = (e) => {
        const selectedIndex = e.target.options.selectedIndex;
        this.setState({ userApproverIndex: e.target.options[selectedIndex].getAttribute('data-key1') });
        let value = e.target.value;
        this.validateApprover(value, true);
    }
    validateApprover = (value, willUpdateState = true) => {
        let msg = RecommendDistributeFromValidator.validateApprover(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnApprover: msg,
                    approver: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Trạng thái phiếu"
    handleStatusChange = (e) => {
        let value = e.target.value;
        this.setState({
            ...this.state,
            status: value
        })
    }

    // Bắt sự kiện thay đổi "Ghi chú"
    handleNoteChange = (e) => {
        let value = e.target.value;
        this.validateNote(value, true);
    }
    validateNote = (value, willUpdateState = true) => {
        let msg = RecommendDistributeFromValidator.validateNote(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnReason: msg,
                    note: value,
                }
            });
        }
        return msg === undefined;
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result =
            this.validateRecommendNumber(this.state.recommendNumber, false) &&
            this.validateDateCreate(this.state.dateCreate, false) &&
            this.validateReqContent(this.state.reqContent, false) &&
            this.validateDateStartUse(this.state.dateCreate, false) &&
            this.validateDateEndUse(this.state.dateCreate, false)
        return result;
    }

    save = () => {
        if (this.isFormValidated()) {
            console.log(this.state);
            return this.props.updateRecommendDistribute(this.state._id, this.state);
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                recommendNumber: nextProps.recommendNumber,
                dateCreate: nextProps.dateCreate,
                proponent: nextProps.proponent,
                positionProponent: nextProps.positionProponent,
                reqContent: nextProps.reqContent,
                code: nextProps.code,
                assetName: nextProps.assetName,
                asset: nextProps.asset,
                dateStartUse: nextProps.dateStartUse,
                dateEndUse: nextProps.dateEndUse,
                approver: nextProps.approver,
                positionApprover: nextProps.positionApprover,
                status: nextProps.status,
                note: nextProps.note,
                errorOnRecommendNumber: undefined,
                errorOnDateCreate: undefined,
                errorOnReqContent: undefined,
                errorOnDateStartUse: undefined,
                errorOnDateEndUse: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { translate, recommendDistribute, user } = this.props;
        const {
            recommendNumber, dateCreate, proponent, positionProponent, reqContent, code, assetName, dateStartUse, dateEndUse, approver, positionApprover, status, note,
            errorOnRecommendNumber, errorOnDateCreate, errorOnReqContent, errorOnDateStartUse, errorOnDateEndUse
        } = this.state;
        return (

            <React.Fragment>
                <DialogModal
                    size='75' modalID="modal-edit-recommenddistributemanage" isLoading={recommendDistribute.isLoading}
                    formID="form-edit-recommenddistributemanage"
                    title="Cập nhật thông tin phiếu đề nghị cấp phát thiết bị"
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-edit-recommenddistribute">
                        <div className="col-md-12">
                            <div className="col-sm-6">
                                <div className={`form-group ${errorOnRecommendNumber === undefined ? "" : "has-error"}`}>
                                    <label>Mã phiếu<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="recommendNumber" value={recommendNumber} onChange={this.handleRecommendNumberChange} autoComplete="off" placeholder="Mã phiếu" disabled />
                                    <ErrorLabel content={errorOnRecommendNumber} />
                                </div>
                                <div className={`form-group ${errorOnDateCreate === undefined ? "" : "has-error"}`}>
                                    <label>Ngày lập<span className="text-red">*</span></label>
                                    <DatePicker
                                        id="edit_start_date"
                                        value={dateCreate}
                                        onChange={this.handleDateCreateChange}
                                        disabled
                                    />
                                    <ErrorLabel content={errorOnDateCreate} />
                                </div>
                                <div className="form-group">
                                    <label>Người đề nghị<span className="text-red">*</span></label>
                                    <select id="drops1" className="form-control" name="proponent"
                                        value={proponent._id}
                                        placeholder="Please Select"
                                        onChange={this.handleProponentChange}
                                        disabled>
                                        <option value="" disabled>Please Select</option>
                                        {user.list.length ? user.list.map((item, index) => {
                                            return (
                                                <option data-key1={index} key={index} value={item._id}>{item.name} - {item.email}</option>
                                            )
                                        }) : null}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Chức vụ người đề nghị</label>
                                    <input disabled type="text" className="form-control" name="positionProponent"
                                        value={this.state.userProponentIndex !== '' && user.list[this.state.userProponentIndex].roles.length ? user.list[this.state.userProponentIndex].roles[0].roleId.name : (proponent !== null && this.state.userProponentIndex === '' && user.list.find(user => user._id === proponent._id).roles.length) ? user.list.find(user => user._id === proponent._id).roles[0].roleId.name : ''} />
                                </div>
                                <div className={`form-group ${errorOnReqContent === undefined ? "" : "has-error"}`}>
                                    <label>Nội dung đề nghị<span className="text-red">*</span></label>
                                    <textarea className="form-control" rows="3" style={{ height: 34 }} name="reqContent" value={reqContent} onChange={this.handleReqContentChange} autoComplete="off" placeholder="Nội dung đề nghị" disabled></textarea>
                                    <ErrorLabel content={errorOnReqContent} />
                                </div>
                                <div className={`form-group`}>
                                    <label>Mã tài sản<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="code" value={code} onChange={this.handleCodeChange} autoComplete="off" placeholder="Mã tài sản" disabled />
                                </div>
                                <div className={`form-group`}>
                                    <label>Tên tài sản</label>
                                    <input type="text" className="form-control" name="assetName" value={assetName} autoComplete="off" placeholder="Tên tài sản" disabled />
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className={`form-group ${errorOnDateStartUse === undefined ? "" : "has-error"}`}>
                                    <label>Thời gian đăng ký sử dụng từ ngày<span className="text-red">*</span></label>
                                    <DatePicker
                                        id="edit_start_use"
                                        value={dateStartUse}
                                        onChange={this.handleDateStartUseChange}
                                        disabled
                                    />
                                    <ErrorLabel content={errorOnDateStartUse} />
                                </div>
                                <div className={`form-group ${errorOnDateEndUse === undefined ? "" : "has-error"}`}>
                                    <label>thời gian đăng ký sử dụng đến ngày<span className="text-red">*</span></label>
                                    <DatePicker
                                        id="edit_end_use"
                                        value={dateEndUse}
                                        onChange={this.handleDateEndUseChange}
                                        disabled
                                    />
                                    <ErrorLabel content={errorOnDateEndUse} />
                                </div>
                                <div className="form-group">
                                    <label>Người phê duyệt<span className="text-red">*</span></label>
                                    <select id="drops2" className="form-control" name="approver"
                                        value={approver}
                                        placeholder="Please Select"
                                        onChange={this.handleApproverChange}>
                                        <option value="" disabled>Please Select</option>
                                        {user.list.length ? user.list.map((item, index) => {
                                            return (
                                                <option data-key1={index} key={index} value={item._id}>{item.name} - {item.email}</option>
                                            )
                                        }) : null}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Chức vụ người phê duyệt</label>
                                    <input disabled type="text" className="form-control" name="positionApprover"
                                    //    value={this.state.userApproverIndex !== '' && user.list[this.state.userApproverIndex].roles.length ? user.list[this.state.userApproverIndex].roles[0].roleId.name : (approver !== '' && this.state.userApproverIndex === '' && user.list.filter(user => user._id === approver).pop().roles.length) ? user.list.filter(user => user._id === approver).pop().roles[0].roleId.name : ''}
                                    //
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Trạng thái</label>
                                    <select className="form-control" value={status} name="status" onChange={this.handleStatusChange}>
                                        <option value="Đã chấp nhận">Đã chấp nhận</option>
                                        <option value="Chờ phê duyệt">Chờ phê duyệt</option>
                                        <option value="Không chấp nhận">Không chấp nhận</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Ghi chú</label>
                                    <textarea className="form-control" rows="3" style={{ height: 34 }} name="note" value={note} onChange={this.handleNoteChange}></textarea>
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
    const { recommendDistribute, user } = state;
    return { recommendDistribute, user };
};

const actionCreators = {
    updateRecommendDistribute: RecommendDistributeActions.updateRecommendDistribute,

};

const editRecommendDistributeManager = connect(mapState, actionCreators)(withTranslate(RecommendDistributeManagerEditForm));
export { editRecommendDistributeManager as RecommendDistributeManagerEditForm };
