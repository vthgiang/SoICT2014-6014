import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ButtonModal, DialogModal, ErrorLabel, SelectBox, DatePicker, TimePicker, SelectMulti } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../helpers/validationHelper';
import { DelegationActions } from '../redux/actions';
import { UserActions } from '../../../super-admin/user/redux/actions';
import { DelegationFormValidator } from './delegationFormValidator';
import './selectLink.css'
import dayjs from "dayjs";
import { generateCode } from "../../../../helpers/generateCode";
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import { getStorage } from '../../../../config';
import { PolicyActions } from '../../../super-admin/policy-delegation/redux/actions';


function DelegationEditForm(props) {

    const [state, setState] = useState({
        validLinks: [],
        unitMembers: [],
        selectDelegateRole: true,
        delegationNameError: {
            message: undefined,
            status: true
        },
        errorOnDelegateLinks: undefined,
        delegateDuration: {
            startDate: "",
            endDate: "",
            startTime: "",
            endTime: "",
            errorOnStartDate: undefined,
            errorOnEndDate: undefined,
        },

    })

    useEffect(() => {
        if (props.delegationID !== state.delegationID) {
            setState({
                ...state,
                delegationID: props.delegationID,
                delegationName: props.delegationName,
                description: props.description,
                delegator: props.delegator._id,
                delegatee: props.delegatee._id,
                delegatePrivileges: props.delegatePrivileges,
                delegateType: props.delegateType,
                delegateRole: props.delegateRole._id,
                delegateTask: props.delegateTask,
                status: props.status,
                allPrivileges: props.allPrivileges,
                delegateDuration: {
                    startDate: formatDate(props.startDate),
                    endDate: props.endDate ? formatDate(props.endDate) : "",
                    startTime: formatTime(props.startDate),
                    endTime: props.endDate ? formatTime(props.endDate) : "11:59 PM",
                    errorOnStartDate: undefined,
                    errorOnEndDate: undefined,
                },
                revokedDate: props.revokedDate,
                revokeReason: props.revokeReason,
                showChooseLinks: props.showChooseLinks,
                showChooseRevoke: props.showChooseRevoke,
                delegatePolicy: props.delegatePolicy._id,
                delegateLinks: !props.allPrivileges ? props.delegatePrivileges.map(pri => pri.resourceId._id) : null,
                validLinks: link.list.filter(link => link.roles.filter(role => role.policies.length > 0).length == 0 && link.roles.map(role => role.roleId._id).some(r => role.list.filter(role => role._id == props.delegateRole._id.toString())[0].parents.map(p => p._id).concat(props.delegateRole._id.toString()).includes(r))).sort((a, b) => a.category > b.category ? 1 : -1),
                logs: props.logs
            });
            window.$('#delegateLinksEdit').prop("checked", props.showChooseLinks);
            window.$('#delegateRevokeEdit').prop("checked", props.showChooseRevoke);
            // validateDelegateRole(props.delegateRole._id, true)
        }
    }, [props.delegationID])


    const { delegationID, delegationName, description, delegationNameError, delegateRole, delegatee, delegateDuration, showChooseLinks, showChooseRevoke, errorDelegateRole, errorDelegatee, delegateLinks, allPrivileges, delegationEnd, validLinks, selectDelegateRole, errorOnDelegateLinks, unitMembers, delegatePolicy, errorDelegatePolicy } = state;

    const { translate, delegation, auth, user, policyDelegation, role, link } = props;


    /**
     * Hàm dùng để kiểm tra xem form đã được validate hay chưa
     */
    const isFormValidated = () => {
        if (!delegationNameError.status || !validateDelegateRole(state.delegateRole, false) || !validateDelegatee(state.delegatee, false) || (showChooseRevoke && !ValidationHelper.validateEmpty(translate, delegateDuration.endDate).status)
            || !ValidationHelper.validateEmpty(translate, delegateDuration.startDate).status || !validateDelegatePolicy(state.delegatePolicy, false) || (showChooseLinks && delegateLinks == null)) {
            return false;
        }
        return true;
    }

    useEffect(() => {
        props.getPolicies();
    }, [])

    // Nhận giá trị từ component cha

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
            delegateLinks: showChooseLinks ? delegateLinks.concat(validLinks.filter(link => link.url == "/home" || link.url == "/notifications").map(l => l._id)) : null,
            allPrivileges: (!showChooseLinks) ? true : validLinks.length - 2 == delegateLinks.length,
            delegatePolicy: delegatePolicy
        }
        if (isFormValidated() && delegationName) {
            return props.editDelegation(delegationID, data);
        }
    }

    const chooseLinks = (event) => {
        setState({
            ...state,
            showChooseLinks: event.target.checked,
            allPrivileges: !event.target.checked,
            errorOnDelegateLinks: undefined,
        });
    }

    const chooseRevoke = (event) => {
        setState({
            ...state,
            showChooseRevoke: event.target.checked,
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

    // DS toàn bộ user theo cơ cấu tổ chức
    // useEffect(() => {
    //     props.getAllUserInAllUnitsOfCompany();
    // }, [])

    // DS toàn bộ user thuộc department và children department

    let usersInUnitsOfCompany;
    if (user && user.usersInUnitsOfCompany) {
        console.log("user")
        usersInUnitsOfCompany = user.usersInUnitsOfCompany;
        if (delegateRole != "") {
            let selectedRoleUnit = user.organizationalUnitsOfUser.find(item =>
                item.managers.find(manager => manager === delegateRole) === delegateRole
                || item.deputyManagers.find(deputyManager => deputyManager === delegateRole) === delegateRole
                || item.employees.find(employee => employee === delegateRole) === delegateRole);


            usersInUnitsOfCompany = usersInUnitsOfCompany.filter(unit => unit.id == selectedRoleUnit._id || unit.parent == selectedRoleUnit._id)
            // console.log(delegateRole)
            // console.log(role.list.filter(role => role._id === delegateRole))
            // if (delegateRole) {
            //     let selectedRoleAndParents = role.list.filter(role => role._id == delegateRole.toString())[0].parents.map(p => p._id).concat(delegateRole)
            //     let linksOfDelegateRole = link.list.filter(link => link.roles.filter(role => role.policies.length > 0).length == 0 && link.roles.map(role => role.roleId._id).some(r => selectedRoleAndParents.includes(r)))
            //     setState({
            //         validLinks: linksOfDelegateRole.sort((a, b) => a.category > b.category ? 1 : -1)
            //     })
            // }

        }

    }


    console.log(usersInUnitsOfCompany)
    let allUnitsMember = getEmployeeSelectBoxItems(usersInUnitsOfCompany);
    console.log(allUnitsMember)


    const handleDelegateRole = (value) => {
        validateDelegateRole(value[0], true);
    }

    const handleDelegatee = (value) => {
        validateDelegatee(value[0], true);
    }

    const handleDelegatePolicy = (value) => {
        validateDelegatePolicy(value[0], true);
    }

    const validateDelegatePolicy = (value, willUpdateState) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate('manage_delegation.no_blank_delegate_policy');
        }
        if (willUpdateState) {
            setState({
                ...state,
                delegatePolicy: value,
                errorDelegatePolicy: msg,
            })
        }
        return msg === undefined;
    }

    const validateDelegateRole = (value, willUpdateState) => {
        let msg = undefined;

        const { translate } = props;
        if (!value) {
            msg = translate('manage_delegation.no_blank_delegate_role');
        }
        if (willUpdateState) {
            // Array id delegate role và parents
            let selectedRoleAndParents = role.list.filter(role => role._id == value)[0]?.parents.map(p => p._id).concat(value)

            // console.log(role.list.filter(role => role._id == value)[0].parents.map(p => p._id))
            // console.log(selectedRoleAndParents)
            // console.log(link.list.filter(link => link.roles.map(role => role.roleId._id).some(r => selectedRoleAndParents.includes(r))))

            // Lọc link ko có policies
            let linksOfDelegateRole = link.list.filter(link => link.roles.filter(role => role.policies.length > 0).length == 0 && link.roles.map(role => role.roleId._id).some(r => selectedRoleAndParents?.includes(r)))

            console.log(linksOfDelegateRole)
            setState({
                ...state,
                delegateRole: value,
                errorDelegateRole: msg,
                validLinks: linksOfDelegateRole.sort((a, b) => a.category > b.category ? 1 : -1),
                delegatee: "",
                // unitMembers: unitMems,
                selectDelegateRole: true
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

        if (startDate >= endDate) {
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
        else if (startDate >= endDate) {
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
        if (startDate >= endDate) {
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
        let startDate = convertDateTime(delegateDuration.startDate, delegateDuration.startTime);

        if (startDate >= endDate) {
            msg = translate('task.task_management.add_err_end_date');
        }
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
        let msg = undefined;
        if (showChooseLinks && value.length === 0) {
            value = null;
            msg = translate("manage_delegation.not_select_link")
        }


        setState({
            ...state,
            delegateLinks: value,
            errorOnDelegateLinks: msg
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

    const formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [day, month, year].join('-');
    }

    console.log(state)

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-edit-delegation-hooks-Role`} isLoading={delegation.isLoading}
                formID="form-edit-delegation-hooks"
                title={translate('manage_delegation.edit_role_delegation_title')}
                msg_success={translate('manage_delegation.add_success')}
                msg_failure={translate('manage_delegation.add_fail')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={50}
            >
                <form id="form-edit-delegation-hooks" onSubmit={() => save(translate('manage_delegation.add_success'))}>

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
                                id="select-delegate-role-edit"
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={
                                    auth.user.roles.filter(role => {
                                        return role.roleId && role.roleId.name !== 'Super Admin' && role.roleId.type.name !== 'Root' && (!role.delegation || role.delegation.length == 0)
                                    }).map(role => { return { value: role && role.roleId ? role.roleId._id : null, text: role && role.roleId ? role.roleId.name : "" } })
                                }
                                onChange={handleDelegateRole}
                                multiple={false}
                                value={
                                    delegateRole
                                }
                                options={{ placeholder: translate('manage_delegation.choose_delegate_role') }}

                            />
                            <ErrorLabel content={errorDelegateRole} />
                        </div>

                        {/* Chọn người nhận */}
                        <div style={{ marginBottom: "0px" }} className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group ${errorDelegatee === undefined ? "" : "has-error"}`}>
                            <label>{translate('manage_delegation.delegate_receiver')}<span className="text-red">*</span></label>
                            {allUnitsMember &&
                                <SelectBox
                                    id="select-delegate-receiver-edit"
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        allUnitsMember.map(unit =>
                                            unit = { text: unit.text, value: unit.value.filter(user => user.value != auth.user._id) }
                                        )
                                    }
                                    onChange={handleDelegatee}
                                    multiple={false}
                                    value={delegatee}
                                    options={{ placeholder: translate('manage_delegation.choose_delegatee') }}

                                />
                            }
                            <ErrorLabel content={errorDelegatee} />
                        </div>

                    </div>
                    {selectDelegateRole &&
                        <div className="row form-group">
                            <div className={`col-lg-12 col-md-12 col-ms-12 col-xs-12 ${errorOnDelegateLinks === undefined ? "" : "has-error"}`}>
                                <div className="row">
                                    <div className={`col-lg-6 col-md-6 col-ms-6 col-xs-6`}>
                                        <form style={{ marginBottom: '5px' }}>
                                            <input type="checkbox" id="delegateLinksEdit" name="delegateLinks" onChange={chooseLinks} />
                                            <label htmlFor="delegateLinksEdit">&nbsp;{translate('manage_delegation.choose_links')}</label>
                                        </form>
                                    </div>
                                    <div className={`col-lg-6 col-md-6 col-ms-6 col-xs-6`}>
                                        <form style={{ marginBottom: '5px' }}>
                                            <input type="checkbox" id="delegateRevokeEdit" name="delegateRevoke" onChange={chooseRevoke} />
                                            <label htmlFor="delegateRevokeEdit">&nbsp;{translate('manage_delegation.choose_revoke')}</label>
                                        </form>
                                    </div>
                                </div>


                                {showChooseLinks &&

                                    <SelectMulti id={`multiSelectDelegateLinksEdit`} multiple="multiple"
                                        options={{ nonSelectedText: translate('manage_delegation.choose_delegate_links'), allSelectedText: translate('manage_delegation.select_all_links'), enableFilter: true }}
                                        onChange={handleDelegateLinksChange}
                                        value={delegateLinks ? delegateLinks : []}
                                        items={
                                            validLinks.filter(link => link.url != "/home" && link.url != "/notifications").map(link => { return { value: link ? link._id : null, text: link ? `${link.category} - ${link.url} - ${link.description}` : "" } })
                                        }
                                    >
                                    </SelectMulti>

                                }
                                <ErrorLabel content={errorOnDelegateLinks} />

                            </div>
                        </div>

                    }

                    <div className="row form-group">
                        <div style={{ marginBottom: "0px" }} className={`${showChooseRevoke ? "col-lg-6 col-md-6" : "col-lg-12 col-md-12"} col-ms-12 col-xs-12 form-group ${delegateDuration.errorOnStartDate === undefined ? "" : "has-error"}`}>
                            <label className="control-label">{translate('manage_delegation.start_date')}<span className="text-red">*</span></label>
                            <DatePicker
                                id={`datepicker1edit`}
                                dateFormat="day-month-year"
                                value={delegateDuration.startDate}
                                onChange={handleChangeTaskStartDate}
                                pastDate={false}
                            />
                            <TimePicker
                                id={`time-picker-1edit`}
                                refs={`time-picker-1`}
                                value={delegateDuration.startTime}
                                onChange={handleStartTimeChange}
                                minuteStep={30}
                            />
                            <ErrorLabel content={delegateDuration.errorOnStartDate} />
                        </div>
                        {showChooseRevoke &&
                            <div style={{ marginBottom: "0px" }} className={`col-lg-6 col-md-6 col-ms-12 col-xs-12 form-group ${delegateDuration.errorOnEndDate === undefined ? "" : "has-error"}`}>
                                <label className="control-label">{translate('manage_delegation.end_date')}</label>
                                <DatePicker
                                    id={`datepicker2edit`}
                                    value={delegateDuration.endDate}
                                    onChange={handleChangeTaskEndDate}
                                    pastDate={false}
                                />
                                < TimePicker
                                    id={`time-picker-2edit`}
                                    refs={`time-picker-2`}
                                    value={delegateDuration.endTime}
                                    onChange={handleEndTimeChange}
                                    minuteStep={30}
                                />
                                <ErrorLabel content={delegateDuration.errorOnEndDate} />
                            </div>}
                    </div>

                    <div className="row form-group">
                        {/* Chọn chính sách ủy quyền*/}
                        <div style={{ marginBottom: "0px" }} className={`col-lg-12 col-md-12 col-ms-12 col-xs-12 form-group ${errorDelegatePolicy === undefined ? "" : "has-error"}`}>
                            <label>{translate('manage_delegation.delegate_policy')}<span className="text-red">*</span></label>
                            <SelectBox
                                id="select-delegate-policy-edit"
                                className="form-control select2"
                                style={{ width: "100%" }}
                                items={
                                    policyDelegation.lists.map(policy => { return { value: policy ? policy._id : null, text: policy ? policy.policyName : "" } })
                                }
                                value={
                                    delegatePolicy
                                }
                                onChange={handleDelegatePolicy}
                                multiple={false}
                                options={{ placeholder: translate('manage_delegation.choose_delegate_policy') }}
                            />
                            <ErrorLabel content={errorDelegatePolicy} />
                        </div>
                    </div>

                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const { auth, user, policyDelegation, link, role, delegation } = state;
    return { auth, user, policyDelegation, delegation, link, role }
}

const actions = {
    createDelegation: DelegationActions.createDelegation,
    editDelegation: DelegationActions.editDelegation,
    getDelegations: DelegationActions.getDelegations,
    getAllUserInAllUnitsOfCompany: UserActions.getAllUserInAllUnitsOfCompany,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    getPolicies: PolicyActions.getPolicies,

}

const connectedDelegationEditForm = connect(mapState, actions)(withTranslate(DelegationEditForm));
export { connectedDelegationEditForm as DelegationEditForm };