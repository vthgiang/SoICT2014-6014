import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ButtonModal, DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../common-components';
import { RecommendDistributeFromValidator } from './RecommendDistributeFromValidator';
import { RecommendDistributeActions } from '../redux/actions';
import { AssetManagerActions } from '../../asset-management/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
class RecommendDistributeCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recommendNumber: "",
            dateCreate: this.formatDate(Date.now()),
            proponent: "",
            reqContent: "",
            dateStartUse: this.formatDate(Date.now()),
            dateEndUse: this.formatDate(Date.now()),
            status: "Chờ phê duyệt",
            asset: "",
        };
    }

    // Function format ngày hiện tại thành dạnh dd-mm-yyyy
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
    validateExitsRecommendNumber = (value) => {
        return this.props.recommendDistribute.listRecommendDistributes.some(item => item.recommendNumber === value);
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
     * Bắt sự kiện thay đổi người sử dụng
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
     * Bắt sự kiện thay đổi Mã tài sản
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

    // Bắt sự kiện submit form
    save = () => {
        let dataToSubmit = { ...this.state, proponent: this.props.auth.user._id }
        if (this.isFormValidated() && this.validateExitsRecommendNumber(this.state.recommendNumber) === false) {
            return this.props.createRecommendDistribute(dataToSubmit);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                asset: nextProps.asset,
            }
        } else {
            return null;
        }
    }

    render() {
        const { _id, translate, recommendDistribute, assetsManager, user, auth } = this.props;
        var assetlist = assetsManager.listAssets;
        var userlist = user.list;
        const {
            recommendNumber, dateCreate, proponent, asset, reqContent, dateStartUse, dateEndUse, approver, positionApprover, status, note,
            errorOnRecommendNumber, errorOnDateCreate, errorOnReqContent, errorOnDateStartUse, errorOnDateEndUse
        } = this.state;
        console.log(this.state, 'this.state')
        return (
            <React.Fragment>
                {/* <ButtonModal modalID="modal-create-recommenddistribute" button_name="Thêm mới phiếu" title="Thêm mới phiếu đề nghị"/> */}
                <DialogModal
                    size='50' modalID="modal-create-recommenddistribute" isLoading={recommendDistribute.isLoading}
                    formID="form-create-recommenddistribute"
                    title="Thêm mới phiếu đăng ký sử dụng thiết bị"
                    func={this.save}
                    disableSubmit={!this.isFormValidated() || this.validateExitsRecommendNumber(recommendNumber)}
                >
                    <form className="form-group" id="form-create-recommenddistribute">
                        <div className="col-md-12">
                            <div className="col-sm-6">
                                <div className={`form-group ${errorOnRecommendNumber === undefined ? "" : "has-error"}`}>
                                    <label>Mã phiếu<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="recommendNumber" value={recommendNumber} onChange={this.handleRecommendNumberChange} autoComplete="off" placeholder="Mã phiếu" />
                                    <ErrorLabel content={errorOnRecommendNumber} />
                                    <ErrorLabel content={this.validateExitsRecommendNumber(recommendNumber) ? <span className="text-red">Mã phiếu đã tồn tại</span> : ''} />
                                </div>
                                <div className={`form-group ${errorOnDateCreate === undefined ? "" : "has-error"}`}>
                                    <label>Ngày lập<span className="text-red">*</span></label>
                                    <DatePicker
                                        id="create_start_date"
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
                                                value={asset}
                                                multiple={false}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={`form-group ${errorOnDateStartUse === undefined ? "" : "has-error"}`}>
                                    <label>Thời gian đăng ký sử dụng từ ngày<span className="text-red">*</span></label>
                                    <DatePicker
                                        id="create_start_use"
                                        value={dateStartUse}
                                        onChange={this.handleDateStartUseChange}
                                    />
                                    <ErrorLabel content={errorOnDateStartUse} />
                                </div>
                                <div className={`form-group ${errorOnDateEndUse === undefined ? "" : "has-error"}`}>
                                    <label>Thời gian đăng ký sử dụng đến ngày<span className="text-red">*</span></label>
                                    <DatePicker
                                        id="create_end_use"
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
    createRecommendDistribute: RecommendDistributeActions.createRecommendDistribute,
};

const createForm = connect(mapState, actionCreators)(withTranslate(RecommendDistributeCreateForm));
export { createForm as RecommendDistributeCreateForm };
