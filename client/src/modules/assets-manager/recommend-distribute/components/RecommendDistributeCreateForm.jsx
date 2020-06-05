import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withTranslate} from 'react-redux-multilingual';
import {ButtonModal, DatePicker, DialogModal, ErrorLabel} from '../../../../common-components';
import {RecommendDistributeFromValidator} from './RecommendDistributeFromValidator';
import {RecommendDistributeActions} from '../redux/actions';

class RecommendDistributeCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recommendNumber: "",
            dateCreate: this.formatDate(Date.now()),
            proponent: "",
            positionProponent: "",
            reqContent: "",
            dateStartUse: this.formatDate(Date.now()),
            dateEndUse: this.formatDate(Date.now()),
            status: "Chờ phê duyệt",
            userProponentIndex: "",
            assetIndex: "",
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

    // Bắt sự kiện thay đổi "Mã tài sản"
    handleCodeChange = (e) => {
        const selectedIndex = e.target.options.selectedIndex;
        this.setState({ assetIndex: e.target.options[selectedIndex].getAttribute('data-key') });
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
                    asset: value,
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


    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result =
            this.validateRecommendNumber(this.state.recommendNumber, false) &&
            this.validateDateCreate(this.state.dateCreate, false) &&
            this.validateReqContent(this.state.reqContent, false) &&
            this.validateCode(this.state.reqContent, false) &&
            this.validateDateStartUse(this.state.dateCreate, false) &&
            this.validateDateEndUse(this.state.dateCreate, false)
        return result;
    }

    // Bắt sự kiện submit form
    save = () => {

        let dataToSubmit = {...this.state, proponent: this.props.auth.user._id, asset: this.props.asset._id}
        if (this.isFormValidated() && this.validateExitsRecommendNumber(this.state.recommendNumber) === false) {
            return this.props.createRecommendDistribute(dataToSubmit);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                code: nextProps.code,
                assetName: nextProps.assetName,
            }
        } else {
            return null;
        }
    }

    render() {
        const {translate, recommendDistribute, assetsManager, user, auth, asset} = this.props;
        const {
            recommendNumber, dateCreate, proponent, positionProponent, code, assetName, reqContent, dateStartUse, dateEndUse, approver, positionApprover, status, note,
            errorOnRecommendNumber,errorOnDateCreate, errorOnReqContent, errorOnCode, errorOnDateStartUse, errorOnDateEndUse
        } = this.state;
        return (
            <React.Fragment>
                {/* <ButtonModal modalID="modal-create-recommenddistribute" button_name="Thêm mới phiếu" title="Thêm mới phiếu đề nghị"/> */}
                <DialogModal
                    size='75' modalID="modal-create-recommenddistribute" isLoading={recommendDistribute.isLoading}
                    formID="form-create-recommenddistribute"
                    title="Thêm mới phiếu đề nghị cấp phát thiết bị"
                    func={this.save}
                    disableSubmit={!this.isFormValidated() || this.validateExitsRecommendNumber(recommendNumber)}
                >
                    <form className="form-group" id="form-create-recommenddistribute">
                        <div className="col-md-12">
                            <div className="col-sm-6">
                                <div className={`form-group ${errorOnRecommendNumber === undefined ? "" : "has-error"}`}>
                                    <label>Mã phiếu<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" name="recommendNumber" value={recommendNumber} onChange={this.handleRecommendNumberChange} autoComplete="off" placeholder="Mã phiếu"/>
                                    <ErrorLabel content={errorOnRecommendNumber}/>
                                    <ErrorLabel content={this.validateExitsRecommendNumber(recommendNumber) ? <span className="text-red">Mã phiếu đã tồn tại</span>  : ''}/>
                                </div>
                                <div className={`form-group ${errorOnDateCreate === undefined ? "" : "has-error"}`}>
                                    <label>Ngày lập<span className="text-red">*</span></label>
                                    <DatePicker
                                        id="create_start_date"
                                        value={dateCreate}
                                        onChange={this.handleDateCreateChange}
                                    />
                                    <ErrorLabel content={errorOnDateCreate}/>
                                </div>
                                <div className="form-group">
                                    <label>Người đề nghị<span className="text-red">*</span></label>
                                    <select id="drops1" className="form-control" name="proponent"
                                        defaultValue={auth.user._id}
                                        placeholder="Please Select"
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
                                        value={auth.user.roles[0].roleId.name} />
                                </div>
                                <div className={`form-group ${errorOnReqContent === undefined ? "" : "has-error"}`}>
                                    <label>Nội dung đề nghị<span className="text-red">*</span></label>
                                    <textarea className="form-control" rows="3" style={{height: 34}} name="reqContent" value={reqContent} onChange={this.handleReqContentChange} autoComplete="off" placeholder="Nội dung đề nghị"></textarea>
                                    <ErrorLabel content={errorOnReqContent}/>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                {/* <div className={`form-group `}>
                                    <label>Mã tài sản<span className="text-red">*</span></label>
                                    <select
                                        id="drops1"
                                        className="form-control"
                                        name="asset"
                                        defaultValue={asset.code}
                                        placeholder="Please Select"
                                        disabled>
                                        <option value="" disabled>Please Select</option>
                                        {assetsManager.allAsset ? assetsManager.allAsset.map((item, index) => {
                                            return (
                                                <option data-key={index} key={index} value={item.asset._id}>{item.asset.code}</option>
                                            )
                                        }) : null}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Tên tài sản</label>
                                    <input disabled type="text" className="form-control" name="assetName"
                                        value={asset.assetName} />
                                </div> */}
                                <div className="form-group">
                                    <label>Mã tài sản</label>
                                    <input disabled type="text" className="form-control" name="code"
                                           value={asset.code}/>
                                </div>

                                <div className="form-group">
                                    <label>Tên tài sản</label>
                                    <input disabled type="text" className="form-control" name="assetName"
                                           value={asset.assetName}/>
                                </div>
                                <div className={`form-group ${errorOnDateStartUse === undefined ? "" : "has-error"}`}>
                                    <label>Thời gian đăng ký sử dụng từ ngày<span className="text-red">*</span></label>
                                    <DatePicker
                                        id="create_start_use"
                                        value={dateStartUse}
                                        onChange={this.handleDateStartUseChange}
                                    />
                                    <ErrorLabel content={errorOnDateStartUse}/>
                                </div>
                                <div className={`form-group ${errorOnDateEndUse === undefined ? "" : "has-error"}`}>
                                    <label>Thời gian đăng ký sử dụng đến ngày<span className="text-red">*</span></label>
                                    <DatePicker
                                        id="create_end_use"
                                        value={dateEndUse}
                                        onChange={this.handleDateEndUseChange}
                                    />
                                    <ErrorLabel content={errorOnDateEndUse}/>
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
    const {recommendDistribute, auth, user, assetsManager} = state;
    return {recommendDistribute , auth, user, assetsManager};
};

const actionCreators = {
    createRecommendDistribute: RecommendDistributeActions.createRecommendDistribute,
};

const createForm = connect(mapState, actionCreators)(withTranslate(RecommendDistributeCreateForm));
export {createForm as RecommendDistributeCreateForm};
