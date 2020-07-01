import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../common-components';
import { RecommendDistributeFromValidator } from './RecommendDistributeFromValidator';
import { RecommendDistributeActions } from '../redux/actions';
import { AssetManagerActions } from '../../asset-management/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
class RecommendDistributeEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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

    /**
     * Bắt sự kiện thay đổi người đề nghị
     */
    handleProponentChange = (value) => {
        this.setState({
            ...this.state,
            proponent: value[0]
        });
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

    /**
     * Bắt sự kiện thay đổi tài sản
     */
    handleAssetChange = (value) => {
        this.setState({
            asset: value[0]
        });
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
                reqContent: nextProps.reqContent,
                asset: nextProps.asset,
                dateStartUse: nextProps.dateStartUse,
                dateEndUse: nextProps.dateEndUse,
                approver: nextProps.approver,
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
        const { _id, translate, recommendDistribute, user, assetsManager, auth } = this.props;
        var assetlist = assetsManager.listAssets;
        var userlist = user.list;
        const {
            recommendNumber, dateCreate, proponent, asset, reqContent, dateStartUse, dateEndUse,
            errorOnRecommendNumber, errorOnDateCreate, errorOnReqContent, errorOnDateStartUse, errorOnDateEndUse
        } = this.state;
        console.log(this.state, 'this.state')
        return (
            <React.Fragment>
                <DialogModal
                    size='75' modalID="modal-edit-recommenddistribute" isLoading={recommendDistribute.isLoading}
                    formID="form-edit-recommenddistribute"
                    title="Chỉnh sửa thông tin phiếu đăng ký sử dụng thiết bị"
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-edit-recommenddistribute">
                        <div className="col-md-12">
                            <div className="col-sm-6">
                                <div className={`form-group ${errorOnRecommendNumber === undefined ? "" : "has-error"}`}>
                                    <label>Mã phiếu<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="recommendNumber" value={recommendNumber} onChange={this.handleRecommendNumberChange} autoComplete="off" placeholder="Mã phiếu" />
                                    <ErrorLabel content={errorOnRecommendNumber} />
                                </div>
                                <div className={`form-group ${errorOnDateCreate === undefined ? "" : "has-error"}`}>
                                    <label>Ngày lập<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`edit_start_date${_id}`}
                                        value={dateCreate}
                                        onChange={this.handleDateCreateChange}
                                    />
                                    <ErrorLabel content={errorOnDateCreate} />
                                </div>
                                <div className={`form-group`}>
                                    <label>Người đề nghị</label>
                                    <div>
                                        <div id="proponentBox">
                                            <SelectBox
                                                id={`proponent${_id}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={userlist.map(x => {
                                                    return { value: x._id, text: x.name + " - " + x.email }
                                                })}
                                                onChange={this.handleProponentChange}
                                                // value={auth.user._id}
                                                value={proponent._id}
                                                multiple={false}
                                            // disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={`form-group ${errorOnReqContent === undefined ? "" : "has-error"}`}>
                                    <label>Nội dung đề nghị<span className="text-red">*</span></label>
                                    <textarea className="form-control" rows="3" style={{ height: 34 }} name="reqContent" value={reqContent} onChange={this.handleReqContentChange} autoComplete="off" placeholder="Nội dung đề nghị"></textarea>
                                    <ErrorLabel content={errorOnReqContent} />
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className={`form-group`}>
                                    <label>Tài sản</label>
                                    <div>
                                        <div id="assetUBox">
                                            <SelectBox
                                                id={`asset${_id}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={assetlist.map(x => {
                                                    return { value: x._id, text: x.code + " - " + x.assetName }
                                                })}
                                                onChange={this.handleAssetChange}
                                                value={asset._id}
                                                multiple={false}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={`form-group ${errorOnDateStartUse === undefined ? "" : "has-error"}`}>
                                    <label>Thời gian đăng ký sử dụng từ ngày<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`edit_start_use${_id}`}
                                        value={dateStartUse}
                                        onChange={this.handleDateStartUseChange}
                                    />
                                    <ErrorLabel content={errorOnDateStartUse} />
                                </div>
                                <div className={`form-group ${errorOnDateEndUse === undefined ? "" : "has-error"}`}>
                                    <label>thời gian đăng ký sử dụng đến ngày<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`edit_end_use${_id}`}
                                        value={dateEndUse}
                                        onChange={this.handleDateEndUseChange}
                                    />
                                    <ErrorLabel content={errorOnDateEndUse} />
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
    const { recommendDistribute, auth, user, assetsManager } = state;
    return { recommendDistribute, auth, user, assetsManager };
};

const actionCreators = {
    getUser: UserActions.get,
    getAllAsset: AssetManagerActions.getAllAsset,
    updateRecommendDistribute: RecommendDistributeActions.updateRecommendDistribute,
};

const editRecommendDistribute = connect(mapState, actionCreators)(withTranslate(RecommendDistributeEditForm));
export { editRecommendDistribute as RecommendDistributeEditForm };
