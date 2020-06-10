import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ButtonModal, DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../common-components';
import { UsageFormValidator } from './usageFormValidator';
import { UsageActions } from '../redux/actions';
import { AssetManagerActions } from '../../asset-management/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';

class UsageEditForm extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // Function format dữ liệu Date thành string
    formatDate(date, monthYear = false) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        if (monthYear === true) {
            return [month, year].join('-');
        } else return [day, month, year].join('-');
    }

    /**
     * Bắt sự kiện thay đổi Mã tài sản
     */
    handleAssetChange = (value) => {
        this.setState({
            asset: value[0]
        });
    }

    /**
     * Bắt sự kiện thay đổi người sử dụng
     */
    handleUsedByChange = (value) => {
        this.setState({
            ...this.state,
            usedBy: value[0]
        });
    }

    //Bắt sự kiện thay đổi "Thời gian bắt đầu sử dụng"
    handleStartDateChange = (value) => {
        this.validateStartDate(value, true);
    }
    validateStartDate = (value, willUpdateState = true) => {
        let msg = UsageFormValidator.validateStartDate(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnStartDate: msg,
                    startDate: value,
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện thay đổi "Thời gian kết thúc sử dụng"
    handleEndDateChange = (value) => {
        this.validateEndDate(value, true);
    }
    validateEndDate = (value, willUpdateState = true) => {
        let msg = UsageFormValidator.validateEndDate(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnEndDate: msg,
                    endDate: value,
                }
            });
        }
        return msg === undefined;
    }

    //8. Bắt sự kiện thay đổi "Nội dung"
    handleDescriptionChange = (e) => {
        let value = e.target.value;
        this.validateDescription(value, true);
    }
    validateDescription = (value, willUpdateState = true) => {
        let msg = UsageFormValidator.validateDescription(value, this.props.translate)
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDescription: msg,
                    description: value,
                }
            });
        }
        return msg === undefined;
    }


    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result =
            this.validateStartDate(this.state.startDate, false) &&
            this.validateDescription(this.state.description, false)
        return result;
    }

    // Bắt sự kiện submit form
    save = () => {
        var partStart = this.state.startDate.split('-');
        var startDate = [partStart[2], partStart[1], partStart[0]].join('-');
        var partEnd = this.state.endDate.split('-');
        var endDate = [partEnd[2], partEnd[1], partEnd[0]].join('-');
        if (this.isFormValidated()) {
            return this.props.updateUsage({ ...this.state, startDate: startDate, endDate: endDate });
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                asset: nextProps.asset,
                usedBy: nextProps.usedBy,
                startDate: nextProps.startDate,
                endDate: nextProps.endDate,
                description: nextProps.description,
                errorOnMaintainanceCode: undefined,
                errorOnCreateDate: undefined,
                errorOnStartDate: undefined,
                errorOnDescription: undefined
            }
        } else {
            return null;
        }
    }
    
    render() {
        const {id, translate, user, assetsManager } = this.props;
        var userlist = user.list;
        console.log(userlist, 'userlist');
        var assetlist = assetsManager.listAssets;
        console.log(assetlist, 'assetlist');
        const {
            asset, usedBy, startDate, endDate, description, errorOnStartDate, errorOnDescription } = this.state;
            console.log(this.state, 'tungstate')
        return (
            <React.Fragment>
                <ButtonModal modalID={`modal-edit-usage`} button_name="Chỉnh sửa" title="Chỉnh sửa thông tin sử dụng tài sản" />
                <DialogModal
                    size='50' modalID={`modal-edit-usage`} isLoading={false}
                    formID={`form-edit-usage`}
                    title="Chỉnh sửa thông tin sử dụng tài sản"
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-create-usage`}>
                        <div className="col-md-12">
                            <div className={`form-group`}>
                                <label>Tài sản</label>
                                <div>
                                    <div id="assetUBox">
                                        <SelectBox
                                            id={`edit-usage-asset${id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={assetlist.map(x => { return { value: x.assets[0]._id, text: x.assets[0].code + " - " + x.assets[0].assetName } })}
                                            onChange={this.handleAssetChange}
                                            value={asset}
                                            multiple={false}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={`form-group`}>
                                <label>Người sử dụng</label>
                                <div>
                                    <div id="usedByUBox">
                                        <SelectBox
                                            id={`edit-usedBy${id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={userlist.map(x => { return { value: x._id, text: x.name + " - " + x.email } })}
                                            onChange={this.handleUsedByChange}
                                            value={usedBy}
                                            multiple={false}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={`form-group ${errorOnStartDate === undefined ? "" : "has-error"}`}>
                                <label>Thời gian bắt đầu sử dụng<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`edit-start-date${id}`}
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                                <ErrorLabel content={errorOnStartDate} />
                            </div>

                            <div className="form-group">
                                <label>Thời gian kết thúc sử dụng</label>
                                <DatePicker
                                    id={`edit-end-date${id}`}
                                    value={endDate}
                                    onChange={this.handleEndDateChange}
                                />
                            </div>
                            <div className={`form-group ${errorOnDescription === undefined ? "" : "has-error"}`}>
                                <label>Nội dung<span className="text-red">*</span></label>
                                <textarea className="form-control" rows="3" style={{ height: 34 }} name="description" value={description} onChange={this.handleDescriptionChange} autoComplete="off"
                                    placeholder="Nội dung"></textarea>
                                <ErrorLabel content={errorOnDescription} />
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

function mapState(state) {
    var { usage, assetsManager, user } = state;
    return { usage, assetsManager, user };
};

const actionCreators = {
    getUser: UserActions.get,
    getAllAsset: AssetManagerActions.getAllAsset,
    // updateUsage: UsageActions.updateUsage,
};

const editModal = connect(mapState, actionCreators)(withTranslate(UsageEditForm));
export { editModal as UsageEditForm };
