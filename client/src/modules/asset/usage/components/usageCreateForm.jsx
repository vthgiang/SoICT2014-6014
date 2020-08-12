import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ButtonModal, DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../common-components';

import { UsageFormValidator } from './usageFormValidator';

import { UsageActions } from '../redux/actions';
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
        let result = this.validateStartDate(this.state.startDate, false) &&
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
            let assetId = !this.state.asset ? this.props.assetsManager.listAssets[0]._id : this.state.asset;
            return this.props.createUsage(assetId, dataToSubit).then(({ response }) => {
                if (response.data.success) {
                    this.props.getAllAsset({
                        code: "",
                        assetName: "",
                        month: null,
                        status: "",
                        page: "",
                        limit: "",
                    });
                }
            });
        }
    }

    render() {
        const { id } = this.props;
        const { translate, user, assetsManager } = this.props;
        const {
            asset, usedBy, startDate, endDate, description, errorOnStartDate, errorOnDescription
        } = this.state;

        var userlist = user.list;
        var assetlist = assetsManager.listAssets;

        return (
            <React.Fragment>
                <ButtonModal modalID={`modal-create-usage`} button_name="Thêm mới" title="Thêm mới thông tin sử dụng tài sản" />
                <DialogModal
                    size='50' modalID={`modal-create-usage`} isLoading={false}
                    formID={`form-create-usage`}
                    title="Thêm mới thông tin sử dụng tài sản"
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form thêm phiếu đắng kí sử dụng tài sản */}
                    <form className="form-group" id={`form-create-usage`}>
                        <div className="col-md-12">
                            {/* Tài sản */}
                            <div className={`form-group`}>
                                <label>Tài sản</label>
                                <div>
                                    <div id="assetUBox">
                                        <SelectBox
                                            id={`add-usage-asset${id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={assetlist.map(x => {
                                                return { value: x._id, text: x.code + " - " + x.assetName }
                                            })}
                                            onChange={this.handleAssetChange}
                                            value={asset}
                                            multiple={false}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Người sử dụng */}
                            <div className={`form-group`}>
                                <label>Người sử dụng</label>
                                <div>
                                    <div id="usedByUBox">
                                        <SelectBox
                                            id={`add-usedBy${id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={userlist.map(x => {
                                                return { value: x._id, text: x.name + " - " + x.email }
                                            })}
                                            onChange={this.handleUsedByChange}
                                            value={usedBy}
                                            multiple={false}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Thời gian bắt đầu sử dụng */}
                            <div className={`form-group ${!errorOnStartDate ? "" : "has-error"}`}>
                                <label>Thời gian bắt đầu sử dụng<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`add-start-date${id}`}
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                                <ErrorLabel content={errorOnStartDate} />
                            </div>

                            {/* Thời gian kết thúc sử dụng */}
                            <div className="form-group">
                                <label>Thời gian kết thúc sử dụng</label>
                                <DatePicker
                                    id={`add-end-date${id}`}
                                    value={endDate}
                                    onChange={this.handleEndDateChange}
                                />
                            </div>

                            {/* Nội dung */}
                            <div className={`form-group ${!errorOnDescription ? "" : "has-error"}`}>
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
    createUsage: UsageActions.createUsage,
};

const addModal = connect(mapState, actionCreators)(withTranslate(UsageCreateForm));
export { addModal as UsageCreateForm };
