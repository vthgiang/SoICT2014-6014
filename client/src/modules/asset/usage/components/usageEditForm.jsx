import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withTranslate} from 'react-redux-multilingual';
import {DatePicker, DialogModal, ErrorLabel, SelectBox} from '../../../../common-components';
import {UsageFormValidator} from './usageFormValidator';
import {UsageActions} from '../redux/actions';
import {AssetManagerActions} from '../../asset-management/redux/actions';
import {UserActions} from '../../../super-admin/user/redux/actions';

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
        var startDate = [partStart[0], partStart[1], partStart[2]].join('-');
        var partEnd = this.state.endDate.split('-');
        var endDate = [partEnd[0], partEnd[1], partEnd[2]].join('-');
        let assetId = !this.state.asset ? this.props.assetsManager.listAssets[0]._id : this.state.asset._id;
        if (this.isFormValidated()) {
            let dataToSubit = {
                usedBy: !this.state.usedBy ? this.props.user.list[0].id : this.state.usedBy,
                startDate: startDate,
                endDate: endDate,
                description: this.state.description,
                assetId
            }

            return this.props.updateUsage(this.props._id, dataToSubit);
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
        const {id, translate, user, assetsManager} = this.props;
        var userlist = user.list;
        var assetlist = assetsManager.listAssets;
        const {
            asset, usedBy, startDate, endDate, description, errorOnStartDate, errorOnDescription
        } = this.state;
        console.log(this.props._id, 'id')
        console.log('asset', asset._id);
        return (
            <React.Fragment>
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
                                    <div id="assetBox">
                                        <SelectBox
                                            id={`edit-usage-asset${id}`}
                                            className="form-control select2"
                                            style={{width: "100%"}}
                                            items={assetlist.map(x => ({value: x._id, text: x.code + " - " + x.assetName}))}
                                            onChange={this.handleAssetChange}
                                            value={asset._id}
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
                                            style={{width: "100%"}}
                                            items={userlist.map(x => {
                                                return {value: x._id, text: x.name + " - " + x.email}
                                            })}
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
                                    value={this.formatDate(startDate)}
                                    onChange={this.handleStartDateChange}
                                />
                                <ErrorLabel content={errorOnStartDate}/>
                            </div>

                            <div className="form-group">
                                <label>Thời gian kết thúc sử dụng</label>
                                <DatePicker
                                    id={`edit-end-date${id}`}
                                    value={this.formatDate(endDate)}
                                    onChange={this.handleEndDateChange}
                                />
                            </div>
                            <div className={`form-group ${errorOnDescription === undefined ? "" : "has-error"}`}>
                                <label>Nội dung<span className="text-red">*</span></label>
                                <textarea className="form-control" rows="3" style={{height: 34}} name="description" value={description} onChange={this.handleDescriptionChange} autoComplete="off"
                                          placeholder="Nội dung"></textarea>
                                <ErrorLabel content={errorOnDescription}/>
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};

function mapState(state) {
    var {usage, assetsManager, user} = state;
    return {usage, assetsManager, user};
};

const actionCreators = {
    getUser: UserActions.get,
    getAllAsset: AssetManagerActions.getAllAsset,
    updateUsage: UsageActions.updateUsage,
};

const editModal = connect(mapState, actionCreators)(withTranslate(UsageEditForm));
export {editModal as UsageEditForm};