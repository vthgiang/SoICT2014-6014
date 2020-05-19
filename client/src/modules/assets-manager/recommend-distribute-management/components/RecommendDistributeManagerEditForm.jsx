import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ErrorLabel, DatePicker } from '../../../../common-components';
import {RecommendDistributeFromValidator} from '../../recommend-distribute/components/RecommendDistributeFromValidator';
// import {RecommendDistributeActions} from '../../recommend-distribute/redux/actions';

class RecommendDistributeManagerEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.save = this.save.bind(this);
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
    handleAssetNumberChange = (e) => {
        let value = e.target.value;
        this.validateAssetNumber(value, true);
    }
    validateAssetNumber = (value, willUpdateState = true) => {
        let msg = RecommendDistributeFromValidator.validateAssetNumber(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnAssetNumber: msg,
                    assetNumber: value,
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

    //Bắt sự kiện thay đổi Người phê duyệt
    handleApproverChange = (e) => {
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
            // return this.props.updateRecommendDistribute(this.state._id, this.state);
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
                assetNumber: nextProps.assetNumber,
                assetName: nextProps.assetName,
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
        const { translate, recommendDistribute } = this.props;
        const { 
            recommendNumber, dateCreate, proponent, positionProponent, reqContent, assetNumber, assetName, dateStartUse, dateEndUse, approver, positionApprover, status, note,
            errorOnRecommendNumber, errorOnDateCreate, errorOnReqContent, errorOnDateStartUse, errorOnDateEndUse 
        } = this.state;
        return (
            <React.Fragment>
                <DialogModal
                    size='75' modalID="modal-edit-recommenddistributemanage" isLoading={recommendDistribute.isLoading}
                    formID="form-edit-recommenddistributemanage"
                    title="Cập nhật thông tin phiếu đề nghị mua sắm thiết bị"
                    msg_success={translate('manage_user.edit_success')}
                    msg_faile={translate('sabbatical.edit_faile')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-edit-recommenddistribute">
                        <div className="col-md-12">
                        <div className="col-sm-6">
                                <div className={`form-group ${errorOnRecommendNumber === undefined ? "" : "has-error"}`}>
                                    <label>Mã phiếu<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="recommendNumber" value={recommendNumber} onChange={this.handleRecommendNumberChange} autoComplete="off" placeholder="Mã phiếu"/>
                                    <ErrorLabel content={errorOnRecommendNumber}/>
                                </div>
                                <div className={`form-group ${errorOnDateCreate === undefined ? "" : "has-error"}`}>
                                    <label>Ngày lập<span className="text-red">*</span></label>
                                    <DatePicker
                                        id="edit_start_date"
                                        value={dateCreate}
                                        onChange={this.handleDateCreateChange}
                                    />
                                    <ErrorLabel content={errorOnDateCreate}/>
                                </div>
                                <div className="form-group">
                                    <label>Người đề nghị<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="proponent" value={proponent} onChange={this.handleProponentChange} placeholder="Người đề nghị" autoComplete="off" />
                                </div>
                                <div className="form-group">
                                    <label>Chức vụ người đề nghị</label>
                                    <input type="text" className="form-control" name="positionProponent" value={positionProponent} placeholder="Chức vụ người đề nghị" autoComplete="off" disabled />
                                </div>
                                <div className={`form-group ${errorOnReqContent === undefined ? "" : "has-error"}`}>
                                    <label>Nội dung đề nghị<span className="text-red">*</span></label>
                                    <textarea className="form-control" rows="3" style={{height: 34}} name="reqContent" value={reqContent} onChange={this.handleReqContentChange} autoComplete="off" placeholder="Nội dung đề nghị"></textarea>
                                    <ErrorLabel content={errorOnReqContent}/>
                                </div>
                                <div className={`form-group`}>
                                    <label>Mã tài sản<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="assetNumber" value={assetNumber} onChange={this.handleAssetNumberChange} autoComplete="off" placeholder="Mã tài sản"/>
                                </div>
                                <div className={`form-group`}>
                                    <label>Tên tài sản</label>
                                    <input type="text" className="form-control" name="assetName" value={assetName} autoComplete="off" placeholder="Tên tài sản" disabled/>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                
                                {/* <div className="form-group">
                                    <label>Loại tài sản</label>
                                    <input type="text" className="form-control" name="assetType" value={assetType} autoComplete="off" placeholder="Loại tài sản" disabled/>
                                </div> */}
                                <div className={`form-group ${errorOnDateStartUse === undefined ? "" : "has-error"}`}>
                                    <label>Thời gian đăng ký sử dụng từ ngày<span className="text-red">*</span></label>
                                    <DatePicker
                                        id="edit_start_use"
                                        value={dateStartUse}
                                        onChange={this.handleDateStartUseChange}
                                    />
                                    <ErrorLabel content={errorOnDateStartUse}/>
                                </div>
                                <div className={`form-group ${errorOnDateEndUse === undefined ? "" : "has-error"}`}>
                                    <label>thời gian đăng ký sử dụng đến ngày<span className="text-red">*</span></label>
                                    <DatePicker
                                        id="edit_end_use"
                                        value={dateEndUse}
                                        onChange={this.handleDateEndUseChange}
                                    />
                                    <ErrorLabel content={errorOnDateEndUse}/>
                                </div>
                                <div className="form-group">
                                    <label>Người phê duyệt</label>
                                    <input type="text" className="form-control" name="approver" value={approver} onChange={this.handleApproverChange}  autoComplete="off" placeholder="Người phê duyệt" disabled/>
                                </div>
                                <div className="form-group">
                                    <label>Chức vụ nguời phê duyệt</label>
                                    <input type="text" className="form-control" name="positionApprover" value={positionApprover} autoComplete="off" placeholder="Chức vụ người phê duyệt" disabled/>
                                </div>
                                <div className="form-group">
                                    <label>Ghi chú</label>
                                    <input type="text" className="form-control" name="note" value={note} onChange={this.handleNoteChange} autoComplete="off" placeholder="Ghi chú" disabled/>
                                </div>
                                <div className="form-group">
                                    <label>Trạng thái</label>
                                    <input type="text" className="form-control" name="status" value={status} disabled/>
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
    const { recommendDistribute } = state;
    return { recommendDistribute };
};

const actionCreators = {
    // updateRecommendDistribute: RecommendDistributeActions.updateRecommendDistribute,
};

const editRecommendDistributeManager = connect(mapState, actionCreators)(withTranslate(RecommendDistributeManagerEditForm));
export { editRecommendDistributeManager as RecommendDistributeManagerEditForm };