import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../common-components';

import { UsageFormValidator } from '../../usage/components/usageFormValidator';

import { UsageActions } from '../../usage/redux/actions';
import { AssetManagerActions } from '../../asset-management/redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';

class UsageCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            asset: "",
            usedBy: "",
            startDate: this.formatDate(Date.now()),
            endDate: this.formatDate(Date.now()),
            description: "",
        };
    }

    // Function format dữ liệu Date thành string
    formatDate(date, monthYear = false) {
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

        if (monthYear === true) {
            return [month, year].join('-');
        } else {
            return [day, month, year].join('-');
        }
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

    // Bắt sự kiện thay đổi "Nội dung"
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
            this.validateStartDate(this.state.startDate, false)
        // &&
        // this.validateDescription(this.state.description, false)
        return result;
    }

    // Bắt sự kiện submit form
    save = () => {
        var partStart = this.state.startDate.split('-');
        var startDate = [partStart[2], partStart[1], partStart[0]].join('-');
        var partEnd = this.state.endDate.split('-');
        var endDate = [partEnd[2], partEnd[1], partEnd[0]].join('-');

        if (this.isFormValidated()) {
            let dataToSubit = {
                usedBy: !this.state.usedBy ? this.props.user.list[0].id : this.state.usedBy,
                startDate: startDate,
                endDate: endDate,
                description: this.state.description,
                assignedTo: !this.state.usedBy ? this.props.user.list[0].id : this.state.usedBy,
                handoverFromDate: startDate,
                handoverToDate: endDate,
                status: "Đang sử dụng",

            }

            let assetId = this.state.asset._id;
            
            return this.props.createUsage(assetId, dataToSubit);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps._id !== prevState._id) {
            return {
                ...prevState,
                _id: nextProps._id,
                asset: nextProps.asset,
                startDate: nextProps.startDate,
                endDate: nextProps.endDate,
                usedBy: nextProps.usedBy
            }
        } else {
            return null;
        }

    }

    render() {
        const { _id } = this.props;
        const { translate, user, assetsManager } = this.props;
        const {
            asset, usedBy, startDate, endDate, description, errorOnStartDate, errorOnDescription
        } = this.state;

        var userlist = user.list;
        var assetlist = assetsManager.listAssets;

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={`modal-create-usage`} isLoading={false}
                    formID={`form-create-usage`}
                    title={translate('asset.asset_info.add_usage_info')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form thêm mới thông tin sử dụng tài sản */}
                    <form className="form-group" id={`form-create-usage`}>
                        <div className="col-md-12">
                            {/* Tài sản */}
                            <div className={`form-group`}>
                                <label>{translate('asset.general_information.asset')}</label>
                                <div>
                                    <div id="assetUBox">
                                        <SelectBox
                                            id={`add-usage-asset${_id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={assetlist.map(x => {
                                                return { value: x._id, text: x.code + " - " + x.assetName }
                                            })}
                                            onChange={this.handleAssetChange}
                                            value={asset ? asset._id : null}
                                            multiple={false}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Người sử dụng */}
                            <div className={`form-group`}>
                                <label>{translate('asset.general_information.user')}</label>
                                <div>
                                    <div id="usedByUBox">
                                        <SelectBox
                                            id={`add-usedBy${_id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={userlist.map(x => {
                                                return { value: x._id, text: x.name + " - " + x.email }
                                            })}
                                            onChange={this.handleUsedByChange}
                                            value={usedBy ? usedBy._id : null}
                                            multiple={false}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Thời gian bắt đầu sử dụng */}
                            <div className={`form-group ${!errorOnStartDate ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.handover_from_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`add-start-date${_id}`}
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                                <ErrorLabel content={errorOnStartDate} />
                            </div>

                            {/* Thời gian kết thúc sử dụng */}
                            <div className="form-group">
                                <label>T{translate('asset.general_information.handover_to_date')}</label>
                                <DatePicker
                                    id={`add-end-date${_id}`}
                                    value={endDate}
                                    onChange={this.handleEndDateChange}
                                />
                            </div>

                            {/* Nội dung */}
                            <div className={`form-group ${!errorOnDescription ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.content')}<span className="text-red">*</span></label>
                                <textarea className="form-control" rows="3" style={{ height: 34 }} name="description" value={description} onChange={this.handleDescriptionChange} autoComplete="off"
                                    placeholder={translate('asset.general_information.content')}></textarea>
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
    createUsage: UsageActions.createUsage,
};

const addModal = connect(mapState, actionCreators)(withTranslate(UsageCreateForm));
export { addModal as UsageCreateForm };
