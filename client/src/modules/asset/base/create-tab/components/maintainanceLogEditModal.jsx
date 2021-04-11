import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, DialogModal, ErrorLabel } from '../../../../../common-components';

import ValidationHelper from '../../../../../helpers/validationHelper';

function MaintainanceLogEditModal (props) {
    const [state, setState] =useState({})
    const [prevProps, setPrevProps] = useState({
        id:null,
    })

    // Function format dữ liệu Date thành string
    const formatDate = (date, monthYear = false) => {
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

    // Bắt sự kiện thay đổi mã phiếu
    const handleMaintainanceCodeChange = (e) => {
        let { value } = e.target;
        validateMaintainanceCode(value, true);
    }
    const validateMaintainanceCode = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateCode(props.translate, value);

        if (willUpdateState) {
            setState(state => {
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
    const handleCreateDateChange = (value) => {
        validateCreateDate(value, true);
    }
    const validateCreateDate = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState(state => {
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
    const handleTypeChange = (e) => {
        let { value } = e.target;
        setState({
            ...state,
            type: value
        })
    }

    // Bắt sự kiện thay đổi "Nội dung"
    const handleDescriptionChange = (e) => {
        let { value } = e.target;
        validateDescription(value, true);
    }
    const validateDescription = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState(state => {
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
    const handleStartDateChange = (value) => {
        validateStartDate(value, true);
    }
    const validateStartDate = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState(state => {
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
    const handleEndDateChange = (value) => {
        setState({
            ...state,
            endDate: value
        })
    }

    // Bắt sự kiện thay đổi "Chi phí"
    const handleExpenseChange = (e) => {
        let { value } = e.target;
        validateExpense(value, true);
    }
    const validateExpense = (value, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            setState(state => {
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
    const handleStatusChange = (e) => {
        let { value } = e.target;
        setState({
            ...state,
            status: value
        })
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    const isFormValidated = () => {
        let result = validateCreateDate(state.createDate, false)

        return result;
    }

    // Bắt sự kiện submit form
    const save = async () => {
        // var partCreate = state.createDate.split('-');
        // var createDate = [partCreate[2], partCreate[1], partCreate[0]].join('-');
        // var partStart = state.startDate.split('-');
        // var startDate = [partStart[2], partStart[1], partStart[0]].join('-');
        // var partEnd = state.endDate.split('-');
        // var endDate = [partEnd[2], partEnd[1], partEnd[0]].join('-');
        const { createDate, startDate, endDate } = state;
        if (isFormValidated()) {
            return props.handleChange({ ...state, createDate: createDate, startDate: startDate, endDate: endDate });
        }
    }

    if(prevProps.id !== props.id){
        setState(state =>{
            return{
                ...state,
                _id: props._id,
                id: props.id,
                index: props.index,
                maintainanceCode: props.maintainanceCode,
                createDate: props.createDate,
                type: props.type,
                description: props.description,
                startDate: props.startDate,
                endDate: props.endDate,
                expense: props.expense,
                status: props.status,
                errorOnMaintainanceCode: undefined,
                errorOnCreateDate: undefined,
                errorOnDescription: undefined,
                errorOnStartDate: undefined,
                errorOnExpense: undefined,
            }
        })
        setPrevProps(props)
    }
    
  
        const { id } = props;
        const { translate } = props;
        const { maintainanceCode, createDate, type, description, startDate, endDate, expense, status,
            errorOnMaintainanceCode, errorOnCreateDate, errorOnDescription, errorOnStartDate, errorOnExpense
        } = state;

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={`modal-edit-maintainance-${id}`} isLoading={false}
                    formID={`form-edit-maintainance-${id}`}
                    title={translate('asset.asset_info.edit_maintenance_card')}
                    func={save}
                    disableSubmit={!isFormValidated()}
                >
                    {/* Form chỉnh sửa phiếu bảo trì */}
                    <form className="form-group" id={`form-edit-maintainance-${id}`}>
                        <div className="col-md-12">

                            <div className="col-sm-6">
                                {/* Mã phiếu */}
                                <div className={`form-group ${!errorOnMaintainanceCode ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.form_code')}</label>
                                    <input type="text" className="form-control" name="maintainanceCode" value={maintainanceCode} onChange={handleMaintainanceCodeChange} autoComplete="off"
                                        placeholder="Mã phiếu" />
                                    <ErrorLabel content={errorOnMaintainanceCode} />
                                </div>

                                {/* Ngày lập */}
                                <div className={`form-group ${!errorOnCreateDate ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.create_date')}<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`edit-create-date-${id}`}
                                        value={formatDate(createDate)}
                                        onChange={handleCreateDateChange}
                                    />
                                    <ErrorLabel content={errorOnCreateDate} />
                                </div>

                                {/* Phân loại */}
                                <div className="form-group">
                                    <label>{translate('asset.general_information.type')}</label>
                                    <select className="form-control" value={type} name="type" onChange={handleTypeChange}>
                                        <option value="1">{translate('asset.asset_info.repair')}</option>
                                        <option value="2">{translate('asset.asset_info.replace')}</option>
                                        <option value="3">{translate('asset.asset_info.upgrade')}</option>
                                    </select>
                                </div>

                                {/* Nội dung */}
                                <div className={`form-group ${!errorOnDescription ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.content')}</label>
                                    <textarea className="form-control" rows="3" name="description" value={description} onChange={handleDescriptionChange} autoComplete="off"
                                        placeholder="Nội dung"></textarea>
                                    <ErrorLabel content={errorOnDescription} />
                                </div>
                            </div>

                            <div className="col-sm-6">
                                {/* Ngày thực hiện */}
                                <div className={`form-group ${!errorOnStartDate ? "" : "has-error"}`}>
                                    <label>{translate('asset.general_information.start_date')}</label>
                                    <DatePicker
                                        id={`edit-start-date-${id}`}
                                        value={formatDate(startDate)}
                                        onChange={handleStartDateChange}
                                    />
                                    <ErrorLabel content={errorOnStartDate} />
                                </div>

                                {/* Ngày hoàn thành */}
                                <div className="form-group">
                                    <label>{translate('asset.general_information.end_date')}</label>
                                    <DatePicker
                                        id={`edit-end-date-${id}`}
                                        value={formatDate(endDate)}
                                        onChange={handleEndDateChange}
                                    />
                                </div>

                                {/* Chi phí */}
                                <div className={`form-group`}>
                                    <label>{translate('asset.general_information.expense')} (VNĐ)</label>
                                    <input type="text" className="form-control" name="expense" value={expense} onChange={handleExpenseChange} autoComplete="off" placeholder="Chi phí" />
                                </div>

                                {/* Trạng thái */}
                                <div className="form-group">
                                    <label>{translate('asset.general_information.status')}</label>
                                    <select className="form-control" value={status} name="status" onChange={handleStatusChange}>
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
};


const editModal = connect(null, null)(withTranslate(MaintainanceLogEditModal));

export { editModal as MaintainanceLogEditModal };
