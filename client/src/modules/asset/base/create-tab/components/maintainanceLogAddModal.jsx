import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, ErrorLabel, DatePicker } from '../../../../../common-components';

import { generateCode } from "../../../../../helpers/generateCode";
import ValidationHelper from '../../../../../helpers/validationHelper';

class MaintainanceLogAddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maintainanceCode: "",
            createDate: this.formatDate(Date.now()),
            type: "1",
            description: "",
            startDate: this.formatDate(Date.now()),
            endDate: this.formatDate(Date.now()),
            expense: "",
            status: "2",
        };
    }

    regenerateCode = () => {
        let code = generateCode("MT");
        this.setState((state) => ({
            ...state,
            maintainanceCode: code,
        }));
        this.validateMaintainanceCode(code);
    }

    componentDidMount = () => {
        // Mỗi khi modal mở, cần sinh lại code
        let { id } = this.props;
        id && window.$(`#modal-create-maintainance-${id}`).on('shown.bs.modal', this.regenerateCode);
    }

    componentWillUnmount = () => {
        // Unsuscribe event
        let { id } = this.props;
        id && window.$(`#modal-create-incident-${id}`).unbind('shown.bs.modal', this.regenerateCode)
    }

    // Function format ngày hiện tại thành dạnh mm-yyyy
    formatDate = (date) => {
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

        return [day, month, year].join('-');
    }

    // Bắt sự kiện thay đổi mã phiếu
    handleMaintainanceCodeChange = (e) => {
        let { value } = e.target;
        this.validateMaintainanceCode(value, true);
    }
    validateMaintainanceCode = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateCode(this.props.translate, value);

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnMaintainanceCode: message,
                    maintainanceCode: value,
                }
            });
        }
        return message === undefined;
    }

    // Bắt sự kiện thay đổi "Ngày lập"
    handleCreateDateChange = (value) => {
        this.validateCreateDate(value, true);
    }
    validateCreateDate = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(this.props.translate, value);

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnCreateDate: message,
                    createDate: value,
                }
            });
        }
        return message === undefined;
    }

    // Bắt sự kiện thay đổi loại phiếu
    handleTypeChange = (e) => {
        let { value } = e.target;
        this.setState({
            ...this.state,
            type: value
        })
    }

    // Bắt sự kiện thay đổi "Nội dung"
    handleDescriptionChange = (e) => {
        let { value } = e.target;
        this.validateDescription(value, true);
    }
    validateDescription = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(this.props.translate, value);

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnDescription: message,
                    description: value,
                }
            });
        }
        return message === undefined;
    }

    // Bắt sự kiện thay đổi "Ngày thực hiện"
    handleStartDateChange = (value) => {
        this.validateStartDate(value, true);
    }
    validateStartDate = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(this.props.translate, value);

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnStartDate: message,
                    startDate: value,
                }
            });
        }
        return message === undefined;
    }

    // Bắt sự kiện thay đổi "Ngày hoàn thành"
    handleEndDateChange = (value) => {
        this.setState({
            ...this.state,
            endDate: value
        })
    }

    // Bắt sự kiện thay đổi "Chi phí"
    handleExpenseChange = (e) => {
        let { value } = e.target;
        this.validateExpense(value, true);
    }
    validateExpense = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(this.props.translate, value);

        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnExpense: message,
                    expense: value,
                }
            });
        }
        return message === undefined;
    }

    // Bắt sự kiện thay đổi "Trạng thái phiếu"
    handleStatusChange = (e) => {
        let { value } = e.target;
        this.setState({
            ...this.state,
            status: value
        })
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result = this.validateCreateDate(this.state.createDate, false)

        return result;
    }

    // Bắt sự kiện submit form
    save = () => {
        var partCreate = this.state.createDate.split('-');
        var createDate = [partCreate[2], partCreate[1], partCreate[0]].join('-');
        var partStart = this.state.startDate.split('-');
        var startDate = [partStart[2], partStart[1], partStart[0]].join('-');
        var partEnd = this.state.endDate.split('-');
        var endDate = [partEnd[2], partEnd[1], partEnd[0]].join('-');
        if (this.isFormValidated()) {
            return this.props.handleChange({ ...this.state, createDate: createDate, startDate: startDate, endDate: endDate });
        }
    }

    render() {
        const { id } = this.props;
        const { translate } = this.props;
        const { maintainanceCode, createDate, type, description, startDate, endDate, expense, status,
            errorOnMaintainanceCode, errorOnCreateDate, errorOnDescription, errorOnStartDate, errorOnExpense } = this.state;

        return (
            <React.Fragment>
                {/* Button thêm mới phiếu bảo trì */}
                <ButtonModal modalID={`modal-create-maintainance-${id}`} button_name={translate('asset.general_information.add')} title={translate('asset.asset_info.add_maintenance_card')} />

                <DialogModal
                    size='50' modalID={`modal-create-maintainance-${id}`} isLoading={false}
                    formID={`form-create-maintainance-${id}`}
                    title={translate('asset.asset_info.add_maintenance_card')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    {/* Form thêm mới phiếu bỏ trì */}
                    <form className="form-group" id={`form-create-maintainance-${id}`}>
                        <div className="col-md-12">
                            <div className="col-sm-6">

                                {/* Mã phiếu */}
                                <div className={`form-group ${!errorOnMaintainanceCode ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.form_code')}</label>
                                    <input type="text" className="form-control" name="maintainanceCode" value={maintainanceCode} onChange={this.handleMaintainanceCodeChange} autoComplete="off" placeholder="Mã phiếu" />
                                    <ErrorLabel content={errorOnMaintainanceCode} />
                                </div>

                                {/* Ngày lập */}
                                <div className={`form-group ${!errorOnCreateDate ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.create_date')}<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`add-create-date-${id}`}
                                        value={createDate}
                                        onChange={this.handleCreateDateChange}
                                    />
                                    <ErrorLabel content={errorOnCreateDate} />
                                </div>

                                {/* Phân loại */}
                                <div className="form-group">
                                    <label>{translate('asset.general_information.type')}</label>
                                    <select className="form-control" value={type} name="type" onChange={this.handleTypeChange}>
                                        <option value="1">{translate('asset.asset_info.repair')}</option>
                                        <option value="2">{translate('asset.asset_info.replace')}</option>
                                        <option value="3">{translate('asset.asset_info.upgrade')}</option>
                                    </select>
                                </div>

                                {/* Nội dung */}
                                <div className={`form-group ${!errorOnDescription ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.content')}</label>
                                    <textarea className="form-control" rows="3" name="description" value={description} onChange={this.handleDescriptionChange} autoComplete="off" placeholder={translate('asset.general_information.content')}></textarea>
                                    <ErrorLabel content={errorOnDescription} />
                                </div>
                            </div>

                            <div className="col-sm-6">
                                {/* Ngày thực hiện */}
                                <div className={`form-group ${!errorOnStartDate ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.start_date')}</label>
                                    <DatePicker
                                        id={`add-start-date-${id}`}
                                        value={startDate}
                                        onChange={this.handleStartDateChange}
                                    />
                                    <ErrorLabel content={errorOnStartDate} />
                                </div>

                                {/* Ngày hoàn thành */}
                                <div className="form-group">
                                    <label>{translate('asset.general_information.end_date')}</label>
                                    <DatePicker
                                        id={`add-end-date-${id}`}
                                        value={endDate}
                                        onChange={this.handleEndDateChange}
                                    />
                                </div>

                                {/* Chi phí */}
                                <div className={`form-group ${!errorOnExpense ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.expense')} (VNĐ)</label>
                                    <input type="number" className="form-control" name="expense" value={expense} onChange={this.handleExpenseChange} autoComplete="off" placeholder={translate('asset.general_information.expense')} />
                                    <ErrorLabel content={errorOnExpense} />
                                </div>

                                {/* Trạng thái */}
                                <div className="form-group">
                                    <label>{translate('asset.general_information.status')}</label>
                                    <select className="form-control" value={status} name="status" onChange={this.handleStatusChange}>
                                        <option value="1">{translate('asset.asset_info.unfulfilled')}</option>
                                        <option value="2">{translate('asset.asset_info.processing')}</option>
                                        <option value="3">{translate('asset.asset_info.made')}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
};


const addModal = connect(null, null)(withTranslate(MaintainanceLogAddModal));

export { addModal as MaintainanceLogAddModal };
