import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../common-components';

import { AssetCreateValidator } from './combinedContent';

import { UserActions } from '../../../super-admin/user/redux/actions';

class UsageLogEditModal extends Component {
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

    // /**
    //  * Bắt sự kiện thay đổi người sử dụng
    //  */
    handleUsedByChange = (value) => {
        this.setState({
            ...this.state,
            usedBy: value[0]
        });
    }

    // Bắt sự kiện thay đổi "Thời gian bắt đầu sử dụng"
    handleStartDateChange = (value) => {
        this.validateStartDate(value, true);
    }
    validateStartDate = (value, willUpdateState = true) => {
        let msg = AssetCreateValidator.validateStartDate(value, this.props.translate)
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
        let msg = AssetCreateValidator.validateEndDate(value, this.props.translate)
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
        let msg = AssetCreateValidator.validateDescription(value, this.props.translate)
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
        let result = this.validateDescription(this.state.description, false)

        return result;
    }

    // Bắt sự kiện submit form
    save = async () => {
        var partStart = this.formatDate(this.state.startDate).split('-');
        var startDate = [partStart[2], partStart[1], partStart[0]].join('-');
        var partEnd = this.formatDate(this.state.endDate).split('-');
        var endDate = [partEnd[2], partEnd[1], partEnd[0]].join('-');

        if (this.isFormValidated()) {
            return this.props.handleChange({ ...this.state, startDate: startDate, endDate: endDate });
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                _id: nextProps._id,
                index: nextProps.index,
                usedBy: nextProps.usedBy,
                startDate: nextProps.startDate,
                endDate: nextProps.endDate,
                description: nextProps.description,
                errorOnDescription: undefined,
            }
        } else {
            return null;
        }
    }

    render() {
        const { id } = this.props;
        const { translate, user } = this.props;
        const { usedBy, startDate, endDate, description, errorOnDescription } = this.state;

        var userlist = user.list;
        console.log(this.state, 'this.state')

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={`modal-edit-usage-${id}`} isLoading={false}
                    formID={`form-edit-usage-${id}`}
                    title={translate('asset.asset_info.edit_usage_info')} 
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form chỉnh sửa thông tin sử dụng */}
                    <form className="form-group" id={`form-edit-usage-${id}`}>
                        <div className="col-md-12">

                            {/* Người sử dụng */}
                            <div className={`form-group`}>
                                <label>{translate('asset.general_information.user')}</label>
                                <div>
                                    <div id="usedByBox">
                                        <SelectBox
                                            id={`usedBy${id}`}
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

                            {/* Thời gian bắt đầu sử dụng */}
                            <div className="form-group">
                                <label>{translate('asset.general_information.handover_from_date')}</label>
                                <DatePicker
                                    id={`edit-start-date-${id}`}
                                    value={this.formatDate(startDate)}
                                    onChange={this.handleStartDateChange}
                                />
                            </div>

                            {/* Thời gian kết thúc sử dụng */}
                            <div className="form-group">
                                <label>{translate('asset.general_information.handover_to_date')}</label>
                                <DatePicker
                                    id={`edit-end-date-${id}`}
                                    value={this.formatDate(endDate)}
                                    onChange={this.handleEndDateChange}
                                />
                            </div>

                            {/* Nội dung */}
                            <div className={`form-group ${!errorOnDescription ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.content')}<span className="text-red">*</span></label>
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
    var { user } = state;
    return { user };
};

const editModal = connect(mapState, null)(withTranslate(UsageLogEditModal));

export { editModal as UsageLogEditModal };
