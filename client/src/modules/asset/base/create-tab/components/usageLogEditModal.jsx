import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';
import { AssetCreateValidator } from './combinedContent';
import ValidationHelper from '../../../../../helpers/validationHelper';
function UsageLogEditModal(props) {
    const [state, setState] =useState({})
    const [prevProps, setPrevProps] = useState({
        id: null,
    })

    // Function format dữ liệu Date thành string
    const formatDate = (date, monthYear = false) => {
        if (!date) return null;
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
     * Bắt sự kiện thay đổi người sử dụng
     */
    const handleUsedByUserChange = (value) => {
        const { translate } = props;
        let usedByUser = value[0] !== 'null' ? value[0] : null;
        let { message } = ValidationHelper.validateEmpty(translate, usedByUser);

        setState(state =>{
            return {
                ...state,
                usedByUser: usedByUser,
                errorOnUser: message,
            }
        });
    }

    /**
     * Bắt sự kiện thay đổi đơn vị sử dụng
     */
    const handleUsedByOrganizationalUnitChange = (value) => {
        let usedByOrganizationalUnit = value[0] !== 'null' ? value[0] : null;
        setState({
            ...state,
            usedByOrganizationalUnit: usedByOrganizationalUnit
        });
    }

    // Bắt sự kiện thay đổi "Thời gian bắt đầu sử dụng"
    const handleStartDateChange = (value) => {
        const { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value);

        let partStart = value.split("-");
        let startDate = new Date(partStart[2], partStart[1] - 1, partStart[0]);

        setState(state =>{
            return {
                ...state,
                startDate: startDate,
                errorOnStartDate: message,
            }
        })
    }

    // Bắt sự kiện thay đổi "Thời gian kết thúc sử dụng"
    const handleEndDateChange = (value) => {
        const { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value);

        let partEnd = value.split("-");
        let endDate = new Date(partEnd[2], partEnd[1] - 1, partEnd[0]);

        setState(state =>{
            return {
                ...state,
                endDate: endDate,
                errorOnEndDate: message,
            }
        })
    }

    // Bắt sự kiện thay đổi "Nội dung"
    const handleDescriptionChange = (e) => {
        const { value } = e.target;
        setState(state =>{
            return{
                ...state,
                description: value,
            }
        })
    }

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    const isFormValidated = () => {
        const { usedByUser, startDate, endDate } = state;
        const { translate } = props;

        if (!ValidationHelper.validateName(translate, usedByUser).status
            || !ValidationHelper.validateName(translate, startDate).status
            || !ValidationHelper.validateName(translate, endDate).status)
            return false;
        return true;
    }

    // Bắt sự kiện submit form
    const save = async () => {
        var partStart = formatDate(state.startDate).split('-');
        var startDate = [partStart[2], partStart[1], partStart[0]].join('-');
        var partEnd = formatDate(state.endDate).split('-');
        var endDate = [partEnd[2], partEnd[1], partEnd[0]].join('-');
        let usedByUser = state.usedByUser;
        let usedByOrganizationalUnit = state.usedByOrganizationalUnit;

        if (isFormValidated()) {
            return props.handleChange({
                ...state,
                assignedToUser: usedByUser,
                assignedToOrganizationalUnit: usedByOrganizationalUnit,
                startDate: startDate,
                endDate: endDate
            });
        }
    }

    if(prevProps.id !== props.id){
        setState(state => {
            return {
                ...state,
                id: props.id,
                _id: props._id,
                index: props.index,
                usedByUser: props.usedByUser,
                usedByOrganizationalUnit: props.usedByOrganizationalUnit,
                startDate: props.startDate,
                endDate: props.endDate,
                description: props.description,
                errorOnDescription: undefined,
            }
        })
        setPrevProps(props)
    }
    

        const { id } = props;
        const { translate, user, department } = props;
        const { usedByUser, usedByOrganizationalUnit, startDate, endDate, description, errorOnUser, errorOnStartDate, errorOnEndDate } = state;

        var userlist = user.list, departmentlist = department.list;
        console.log('ashdsdkjasjdh', state)

        return (
            <React.Fragment>
                <DialogModal
                    size='50' modalID={`modal-edit-usage-${id}`} isLoading={false}
                    formID={`form-edit-usage-${id}`}
                    title={translate('asset.asset_info.edit_usage_info')}
                    func={save}
                    disableSubmit={!isFormValidated()}
                >
                    {/* Form chỉnh sửa thông tin sử dụng */}
                    <form className="form-group" id={`form-edit-usage-${id}`}>
                        <div className="col-md-12">

                            {/* Người sử dụng */}
                            <div className={`form-group ${!errorOnUser ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.user')}<span className="text-red">*</span></label>
                                <div>
                                    <div id="usedByUserBox">
                                        <SelectBox
                                            id={`usedByUser${id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={[{ value: 'null', text: 'Chọn người sử dụng' }, ...userlist.map(x => { return { value: x._id, text: x.name + " - " + x.email } })]}
                                            onChange={handleUsedByUserChange}
                                            value={usedByUser}
                                            multiple={false}
                                        />
                                        <ErrorLabel content={errorOnUser} />
                                    </div>
                                </div>
                            </div>

                            {/* Đơn vị sử dụng */}
                            <div className={`form-group`}>
                                <label>{translate('asset.general_information.user')}</label>
                                <div>
                                    <div id="usedByUserBox">
                                        <SelectBox
                                            id={`usedByOrganizationalUnit${id}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={[{ value: 'null', text: 'Chọn đơn vị sử dụng' }, ...departmentlist.map(x => { return { value: x._id, text: x.name } })]}
                                            onChange={handleUsedByOrganizationalUnitChange}
                                            value={usedByOrganizationalUnit}
                                            multiple={false}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Thời gian bắt đầu sử dụng */}
                            <div className={`form-group ${!errorOnStartDate ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.handover_from_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`edit-start-date-${id}`}
                                    value={formatDate(startDate)}
                                    onChange={handleStartDateChange}
                                />
                                <ErrorLabel content={errorOnStartDate} />
                            </div>

                            {/* Thời gian kết thúc sử dụng */}
                            <div className={`form-group ${!errorOnEndDate ? "" : "has-error"}`}>
                                <label>{translate('asset.general_information.handover_to_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`edit-end-date-${id}`}
                                    value={formatDate(endDate)}
                                    onChange={handleEndDateChange}
                                />
                                <ErrorLabel content={errorOnEndDate} />
                            </div>

                            {/* Nội dung */}
                            <div className={`form-group `}>
                                <label>{translate('asset.general_information.content')}</label>
                                <textarea className="form-control" rows="3" name="description" value={description ? description : ''} onChange={handleDescriptionChange} autoComplete="off"
                                    placeholder="Nội dung"></textarea>
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
};

function mapState(state) {
    var { user, department } = state;
    return { user, department };
};

const editModal = connect(mapState, null)(withTranslate(UsageLogEditModal));

export { editModal as UsageLogEditModal };

