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

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        if (monthYear === true) {
            return [month, year].join('-');
        } else return [day, month, year].join('-');
    }

    // //6. Bắt sự kiện thay đổi "Người sử dụng"
    // handleUsedByChange = (e) => {
    //     const selectedIndex = e.target.options.selectedIndex;
    //     this.setState({ userReceiveIndex: e.target.options[selectedIndex].getAttribute('data-key1') });
    //     let value = e.target.value;
    //     this.validateUsedBy(value, true);
    // }
    // validateUsedBy = (value, willUpdateState = true) => {
    //     let msg = AssetCreateValidator.validateUsedBy(value, this.props.translate)
    //     if (willUpdateState) {
    //         this.setState(state => {
    //             return {
    //                 ...state,
    //                 errorOnUsedBy: msg,
    //                 usedBy: value,
    //             }
    //         });
    //     }
    //     return msg === undefined;
    // }
    // /**
    //  * Bắt sự kiện thay đổi người sử dụng
    //  */
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

    //8. Bắt sự kiện thay đổi "Nội dung"
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
        let result =
            // this.validateUsedBy(this.state.usedBy, false) &&
            this.validateDescription(this.state.description, false)
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
        const { translate, id, user } = this.props;
        var userlist = user.list;
        const { usedBy, startDate, endDate, description, errorOnDescription } = this.state;

        console.log(this.state, 'this.state')
        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={`modal-edit-usage-${id}`} isLoading={false}
                    formID={`form-edit-usage-${id}`}
                    title="Chỉnh sửa thông tin cấp phát sử dụng"
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-edit-usage-${id}`}>
                        <div className="col-md-12">
                            {/* <div className="form-group">
                                <label>Người sử dụng<span className="text-red">*</span></label>
                                <select id="drops1" className="form-control" name="usedBy"
                                    value={this.state.usedBy ? this.state.usedBy : ''}
                                    placeholder="Please Select"
                                    onChange={this.handleUsedByChange}>
                                    <option value="" disabled>Please Select</option>
                                    {user.list.length ? user.list.map((item, index) => {
                                        return (
                                            <option data-key1={index} key={index} value={item._id}>{item.name} - {item.email}</option>
                                        )
                                    }) : null}
                                </select>

                            </div> */}
                            <div className={`form-group`}>
                                <label>Người sử dụng</label>
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
                            <div className="form-group">
                                <label>Thời gian bắt đầu sử dụng</label>
                                <DatePicker
                                    id={`edit-start-date-${id}`}
                                    value={this.formatDate(startDate)}
                                    onChange={this.handleStartDateChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Thời gian kết thúc sử dụng</label>
                                <DatePicker
                                    id={`edit-end-date-${id}`}
                                    value={this.formatDate(endDate)}
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
    var { user } = state;
    return { user };
};

const actionCreators = {
    getUser: UserActions.get,
};


const editModal = connect((state) => ({ assetsManager: state.assetsManager, user: state.user }), null)(withTranslate(UsageLogEditModal));
export { editModal as UsageLogEditModal };
