import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ButtonModal, DialogModal, ErrorLabel, SelectBox, DatePicker, TimePicker, SelectMulti } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../helpers/validationHelper';
import { DelegationActions } from '../redux/actions';
import { DelegationFormValidator } from './delegationFormValidator';
import './selectLink.css'
import dayjs from "dayjs";
import { generateCode } from "../../../../helpers/generateCode";
import { getStorage } from '../../../../config';


function DelegationCreateForm(props) {

    // Khởi tạo state
    const [state, setState] = useState({
        delegationName: "",
        description: "",
        delegationNameError: {
            message: undefined,
            status: true
        },
        delegateRole: "",
        delegatee: "",
        delegateDuration: {
            startDate: "",
            endDate: "",
            startTime: "",
            endTime: "11:59 PM",
        },
        showChooseLinks: false,
        delegationStart: "",
        delegationEnd: "",
        delegateLinks: [],
        allPrivileges: true,
        validLinks: []
    })

    console.log(state)


    const { translate, delegation, auth, user, role, link, page, perPage } = props;
    const { delegationName, description, delegationNameError, delegateRole, delegatee, delegateDuration, showChooseLinks, errorDelegateRole, errorDelegatee, delegateLinks, allPrivileges, delegationEnd, validLinks } = state;

    /**
     * Hàm dùng để kiểm tra xem form đã được validate hay chưa
     */
    const isFormValidated = () => {
        if (!delegationNameError.status || !validateDelegateRole(state.delegateRole, false) || !validateDelegatee(state.delegatee, false)
            || !ValidationHelper.validateEmpty(translate, delegateDuration.startDate).status) {
            return false;
        }
        return true;
    }

    useEffect(() => {
        window.$(`#modal-create-delegation-hooks`).on('shown.bs.modal', regenerateTimeAndCode);
        return () => {
            window.$(`#modal-create-delegation-hooks`).unbind('shown.bs.modal', regenerateTimeAndCode);
        }

    }, [])


    const regenerateTimeAndCode = () => {
        let currentTime = formatTime(new Date())
        let code = generateCode("UQVT");
        let result = ValidationHelper.validateName(translate, code, 6, 255);

        setState(state => {
            return {
                ...state,
                delegateDuration: {
                    ...state.delegateDuration,
                    startTime: currentTime,
                },
                delegationName: code,
                delegationNameError: result
            }
        });
    }

    // const regenerateCode = () => {
    //     let code = generateCode("UQVT");
    //     setState((state) => ({
    //         ...state,
    //         delegationName: code,
    //     }));
    //     let result = ValidationHelper.validateName(translate, code, 6, 255);
    //     setState({
    //         ...state,
    //         delegationName: code,
    //         delegationNameError: result
    //     })
    // }

    /**
     * Hàm dùng để lưu thông tin của form và gọi service tạo mới ví dụ
     */
    const save = () => {
        const data = {
            delegationName: delegationName,
            description: description,
            delegateRole: delegateRole,
            delegator: auth.user._id,
            delegatee: delegatee,
            showChooseLinks: showChooseLinks,
            delegationStart: convertDateTimeSave(delegateDuration.startDate, delegateDuration.startTime),
            delegationEnd: delegationEnd != "" ? convertDateTimeSave(delegateDuration.endDate, delegateDuration.endTime) : null,
            delegateLinks: delegateLinks,
            allPrivileges: allPrivileges
        }
        if (isFormValidated() && delegationName) {
            props.createDelegation([data]);
        }
    }

    const chooseLinks = (event) => {
        setState({
            ...state,
            showChooseLinks: event.target.checked,
            allPrivileges: !event.target.checked
        });
    }


    /**
     * Hàm xử lý khi tên ví dụ thay đổi
     * @param {*} e 
     */
    const handleDelegationName = (e) => {
        const { value } = e.target;
        let result = ValidationHelper.validateName(translate, value, 6, 255);

        setState({
            ...state,
            delegationName: value,
            delegationNameError: result
        })
    }


    /**
     * Hàm xử lý khi mô tả ví dụ thay đổi
     * @param {*} e 
     */
    const handleDelegationDescription = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            description: value
        });
    }


    const handleDelegateRole = (value) => {
        validateDelegateRole(value[0], true);
        // let currentRole = role.list.filter(role => role._id == value[0])
        // console.log(value[0])
        // console.log(currentRole)

        // let currentRoleLinks = link.list.filter(link => link.roles.map(role => role.roleId._id) == value || currentRole.parents.map(p => p._id).contains(link.roles.map(role => role.roleId._id)))
        // console.log(currentRoleLinks)
    }

    const handleDelegatee = (value) => {
        validateDelegatee(value[0], true);
    }


    const validateDelegateRole = (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate('manage_delegation.no_blank_delegate_role');
        }
        if (willUpdateState) {
            setState({
                ...state,
                delegateRole: value,
                errorDelegateRole: msg,
            })
        }
        return msg === undefined;
    }

    const validateDelegatee = (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate('manage_delegation.no_blank_delegatee');
        }
        if (willUpdateState) {
            setState({
                ...state,
                delegatee: value,
                errorDelegatee: msg,
            })
        }
        return msg === undefined;
    }

    const handleChangeTaskStartDate = (value) => {
        validateTaskStartDate(value, true);
    }
    const validateTaskStartDate = (value, willUpdateState = true) => {
        let { translate } = props;
        const { delegateDuration } = state;
        let msg = DelegationFormValidator.validateTaskStartDate(value, delegateDuration.endDate, translate);
        let startDate = convertDateTime(value, delegateDuration.startTime);
        let endDate = convertDateTime(delegateDuration.endDate, delegateDuration.endTime);

        if (startDate > endDate) {
            msg = translate('task.task_management.add_err_end_date');
        }
        if (willUpdateState) {
            setState({
                ...state,
                delegateDuration: {
                    ...state.delegateDuration,
                    startDate: value,
                    errorOnStartDate: msg,
                },
                delegationStart: startDate,
            })
            delegateDuration.startDate = value;
            delegateDuration.errorOnStartDate = msg;
            if (!msg && delegateDuration.endDate) {
                setState({
                    ...state,
                    delegateDuration: {
                        ...state.delegateDuration,
                        errorOnEndDate: msg
                    }
                })
            }
        }
        return msg === undefined;
    }

    const handleStartTimeChange = (value) => {
        let { translate } = props;
        let startDate = convertDateTime(state.delegateDuration.startDate, value);
        let endDate = convertDateTime(state.delegateDuration.endDate, state.delegateDuration.endTime);
        let err, resetErr;

        if (value.trim() === "") {
            err = translate('task.task_management.add_err_empty_end_date');
        }
        else if (startDate > endDate) {
            err = translate('task.task_management.add_err_end_date');
            resetErr = undefined;
        }
        setState({
            ...state,
            delegateDuration: {
                ...state.delegateDuration,
                startTime: value,
                errorOnStartDate: err,
                errorOnEndDate: resetErr,
            },
            delegationStart: startDate,
        });
    }

    const handleEndTimeChange = (value) => {
        let { translate } = props;
        let startDate = convertDateTime(state.delegateDuration.startDate, state.delegateDuration.startTime);
        let endDate = convertDateTime(state.delegateDuration.endDate, value);
        let err, resetErr;

        // if (value.trim() === "") {
        //     err = translate('task.task_management.add_err_empty_end_date');
        // }
        // else
        if (startDate > endDate) {
            err = translate('task.task_management.add_err_end_date');
            resetErr = undefined;
        }
        setState({
            ...state,
            delegateDuration: {
                ...state.delegateDuration,
                endTime: value,
                errorOnEndDate: err,
                errorOnStartDate: resetErr,
            },
            delegationEnd: endDate
        })
    }

    const handleChangeTaskEndDate = (value) => {
        validateTaskEndDate(value, true);
    }

    const validateTaskEndDate = (value, willUpdateState = true) => {
        let { translate } = props;
        const { delegateDuration } = state
        let msg = DelegationFormValidator.validateDelegationEndDate(delegateDuration.startDate, value, translate);
        let endDate = convertDateTime(value, delegateDuration.endTime);
        console.log(endDate);
        if (willUpdateState) {
            setState({
                ...state,
                delegateDuration: {
                    ...state.delegateDuration,
                    endDate: value,
                    errorOnEndDate: msg,
                }
            })
            delegateDuration.endDate = value;
            delegateDuration.errorOnEndDate = msg;
            if (!msg && delegateDuration.startDate) {
                setState({
                    ...state,
                    delegateDuration: {
                        ...delegateDuration,
                        errorOnStartDate: msg
                    }
                });
            }
        }
        setState({
            ...state,
            delegationEnd: endDate
        })
        return msg === undefined;
    }

    const handleDelegateLinksChange = (value) => {
        if (value.length === 0) {
            value = null
        }

        setState({
            ...state,
            delegateLinks: value
        })
    }

    const convertDateTime = (date, time) => {
        let splitter = date.split("-");
        let strDateTime = `${splitter[2]}/${splitter[1]}/${splitter[0]} ${time}`;
        return dayjs(strDateTime).format('YYYY/MM/DD HH:mm:ss');
    }

    const convertDateTimeSave = (date, time) => {
        let splitter = date.split("-");
        let strDateTime = `${splitter[2]}/${splitter[1]}/${splitter[0]} ${time}`;
        return new Date(strDateTime);
    }

    // convert ISODate to String hh:mm AM/PM
    const formatTime = (date) => {
        return dayjs(date).format("h:mm A");
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-create-delegation-hooks" isLoading={delegation.isLoading}
                formID="form-create-delegation-hooks"
                title={translate('manage_delegation.add_role_delegation_title')}
                msg_success={translate('manage_delegation.add_success')}
                msg_failure={translate('manage_delegation.add_fail')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={50}
                maxWidth={500}
            >
                <form id="form-create-delegation-hooks" onSubmit={() => save(translate('manage_delegation.add_success'))}>
                    {/* 
                    <div className="row form-group">
                            <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${delegateDuration.errorOnStartDate === undefined ? "" : "has-error"}`}>
                                <label className="control-label">{translate('task.task_management.start_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`datepicker1-${id}-${props.id}`}
                                    dateFormat="day-month-year"
                                    value={delegateDuration.startDate}
                                    onChange={handleChangeTaskStartDate}
                                />
                                < TimePicker
                                    id={`time-picker-1-${id}-${props.id}`}
                                    refs={`time-picker-1-${id}-${props.id}`}
                                    value={delegateDuration.startTime}
                                    onChange={handleStartTimeChange}
                                />
                                <ErrorLabel content={delegateDuration.errorOnStartDate} />
                            </div>
                            <div className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 ${delegateDuration.errorOnEndDate === undefined ? "" : "has-error"}`}>
                                <label className="control-label">{translate('task.task_management.end_date')}<span className="text-red">*</span></label>
                                <DatePicker
                                    id={`datepicker2-${id}-${props.id}`}
                                    value={delegateDuration.endDate}
                                    onChange={handleChangeTaskEndDate}
                                />
                                < TimePicker
                                    id={`time-picker-2-${id}-${props.id}`}
                                    refs={`time-picker-2-${id}-${props.id}`}
                                    value={delegateDuration.endTime}
                                    onChange={handleEndTimeChange}
                                />
                                <ErrorLabel content={delegateDuration.errorOnEndDate} />
                            </div>
                        </div> */}
                    <div className="row form-group">
                        {/* Tên ủy quyền*/}
                        <div style={{ marginBottom: "0px" }} className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group ${delegationNameError.status ? "" : "has-error"}`}>
                            <label>{translate('manage_delegation.delegationName')}<span className="text-red">*</span></label>
                            <input type="text" className="form-control" value={delegationName} onChange={handleDelegationName}></input>
                            <ErrorLabel content={delegationNameError.message} />
                        </div>
                        {/* Mô tả ủy quyền */}
                        <div style={{ marginBottom: "0px" }} className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group`}>
                            <label>{translate('manage_delegation.delegation_description')}</label>
                            <input type="text" className="form-control" value={description} onChange={handleDelegationDescription}></input>
                        </div>
                    </div>

                    <div className="row form-group">
                        {/* Chọn vai trò*/}
                        <div style={{ marginBottom: "0px" }} className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group ${errorDelegateRole === undefined ? "" : "has-error"}`}>
                            <label>{translate('manage_delegation.delegate_role')}<span className="text-red">*</span></label>
                            <SelectBox
                                id="select-delegate-role-create"
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={
                                    auth.user.roles.filter(role => {
                                        return role.roleId && role.roleId.name !== 'Super Admin'
                                    }).map(role => { return { value: role && role.roleId ? role.roleId._id : null, text: role && role.roleId ? role.roleId.name : "" } })
                                }
                                onChange={handleDelegateRole}
                                multiple={false}
                                options={{ placeholder: translate('manage_delegation.choose_delegate_role') }}
                            />
                            <ErrorLabel content={errorDelegateRole} />
                        </div>
                        {/* Chọn người nhận */}
                        <div style={{ marginBottom: "0px" }} className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group ${errorDelegatee === undefined ? "" : "has-error"}`}>
                            <label>{translate('manage_delegation.delegate_receiver')}<span className="text-red">*</span></label>
                            <SelectBox
                                id="select-delegate-receiver-create"
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={
                                    user.list.filter(user => user._id != auth.user._id).map(user => { return { value: user ? user._id : null, text: user ? `${user.name} - ${user.email}` : "" } })
                                }
                                onChange={handleDelegatee}
                                multiple={false}
                                options={{ placeholder: translate('manage_delegation.choose_delegatee') }}
                            />
                            <ErrorLabel content={errorDelegatee} />
                        </div>
                    </div>

                    <div className="row form-group">
                        <div style={{ marginBottom: "0px" }} className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group ${delegateDuration.errorOnStartDate === undefined ? "" : "has-error"}`}>
                            <label className="control-label">{translate('manage_delegation.start_date')}<span className="text-red">*</span></label>
                            <DatePicker
                                id={`datepicker1`}
                                dateFormat="day-month-year"
                                value={delegateDuration.startDate}
                                onChange={handleChangeTaskStartDate}
                            />
                            <TimePicker
                                id={`time-picker-1`}
                                refs={`time-picker-1`}
                                value={delegateDuration.startTime}
                                onChange={handleStartTimeChange}
                            />
                            <ErrorLabel content={delegateDuration.errorOnStartDate} />
                        </div>
                        <div style={{ marginBottom: "0px" }} className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group ${delegateDuration.errorOnEndDate === undefined ? "" : "has-error"}`}>
                            <label className="control-label">{translate('manage_delegation.end_date')}</label>
                            <DatePicker
                                id={`datepicker2`}
                                value={delegateDuration.endDate}
                                onChange={handleChangeTaskEndDate}
                            />
                            < TimePicker
                                id={`time-picker-2`}
                                refs={`time-picker-2`}
                                value={delegateDuration.endTime}
                                onChange={handleEndTimeChange}
                            />
                            <ErrorLabel content={delegateDuration.errorOnEndDate} />
                        </div>
                    </div>

                    <div className="row form-group">
                        <div className={`col-lg-12 col-md-12 col-ms-12 col-xs-12`}>
                            <form style={{ marginBottom: '5px' }}>
                                <input type="checkbox" id="delegateLinks" name="delegateLinks" onChange={chooseLinks} />
                                <label htmlFor="delegateLinks">&nbsp;{translate('manage_delegation.choose_links')}</label>
                            </form>

                            {showChooseLinks &&

                                <SelectMulti id={`multiSelectDelegateLinks`} multiple="multiple"
                                    options={{ nonSelectedText: translate('manage_delegation.choose_delegate_links'), allSelectedText: translate('manage_delegation.select_all_links') }}
                                    onChange={handleDelegateLinksChange}
                                    value={delegateLinks ? delegateLinks : []}
                                    items={
                                        link.list.filter().map(link => { return { value: link ? link._id : null, text: link ? `${link.url} - ${link.category} (${link.description})` : "" } })

                                    }
                                >
                                </SelectMulti>

                            }
                        </div>
                    </div>


                    {/* <div className={`form-group ${delegationNameError.status ? "" : "has-error"}`}>
                        <label>{translate('manage_delegation.delegationName')}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" value={delegationName} onChange={handleDelegationName}></input>
                        <ErrorLabel content={delegationNameError.message} />
                    </div> */}

                    {/* Mô tả ví dụ */}
                    {/* <div className={`form-group`}>
                        <label>{translate('manage_delegation.delegation_description')}</label>
                        <input type="text" className="form-control" value={description} onChange={handleDelegationDescription}></input>
                    </div> */}
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const { auth, user, link, role, delegation } = state;
    return { auth, user, delegation, link, role }
}

const actions = {
    createDelegation: DelegationActions.createDelegation,
    getDelegations: DelegationActions.getDelegations
}

const connectedDelegationCreateForm = connect(mapState, actions)(withTranslate(DelegationCreateForm));
export { connectedDelegationCreateForm as DelegationCreateForm };