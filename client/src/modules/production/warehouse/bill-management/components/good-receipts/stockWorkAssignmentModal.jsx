import React, { useState, useEffect } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, SelectBox, ErrorLabel, Gantt, DatePicker, TimePicker } from '../../../../../../common-components';
import { LotActions } from '../../../inventory-management/redux/actions';
import { BillActions } from '../../redux/actions';
import './goodReceipt.css'
import 'react-calendar-timeline/lib/Timeline.css'
import ValidationHelper from '../../../../../../helpers/validationHelper';
import { TaskFormValidator } from '../../../../../task/task-management/component/taskFormValidator';
import dayjs from "dayjs";
import GanttCalendar from '../genaral/GanttCalendar';

function StockWorkAssignmentModal(props) {

    // convert ISODate to String dd-mm-yyyy
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

    const DEFALT_WORK_ASSIGNMENT = [
        {
            nameField: "Công việc vận chuyển", workAssignmentStaffs: [], startDate: formatDate((new Date()).toISOString()), startTime: "", endDate: formatDate((new Date()).toISOString()), endTime: "05:30 PM", type: 'default', description: 'Vận chuyển hàng hóa đến đúng vị trí'
        },
        {
            nameField: "Công việc kiểm định chất lượng", workAssignmentStaffs: [], startDate: formatDate((new Date()).toISOString()), startTime: "", endDate: formatDate((new Date()).toISOString()), endTime: "05:30 PM", type: 'default', description: `unpack, kiểm tra số lượng và chất lượng. Phân loại hàng hóa theo danh mục. Đối chiếu, packing. Ghi chú thay đổi`
        },
        {
            nameField: "Đánh lô hàng hóa", workAssignmentStaffs: [], startDate: formatDate((new Date()).toISOString()), startTime: "", endDate: formatDate((new Date()).toISOString()), endTime: "05:30 PM", type: 'default', description: 'Đánh mã số lô hàng cho hàng hóa khi nhập'
        },
        {
            nameField: "Xếp hàng hóa vào vị trí lưu trữ", workAssignmentStaffs: [], startDate: formatDate((new Date()).toISOString()), startTime: "", endDate: formatDate((new Date()).toISOString()), endTime: "05:30 PM", type: 'default', description: 'Xếp hàng đến vị trí lưu trữ trong kho'
        },
    ]

    const [state, setState] = useState({
        userId: localStorage.getItem("userId"),
        currentZoom: props.translate('system_admin.system_setting.backup.date'),
        workAssignment: DEFALT_WORK_ASSIGNMENT,
        startDate: formatDate((new Date()).toISOString()),
        endDate: formatDate((new Date()).toISOString()),
        startTime: '',
        endTime: '05:30 PM',
    })

    const getApprover = () => {
        const { user, translate } = props;
        let ApproverArr = [{ value: [], text: translate('manage_warehouse.bill_management.choose_approver') }];

        user.list.map(item => {
            ApproverArr.push({
                value: item._id,
                text: item.name
            })
        })

        return ApproverArr;
    }

    /* Người quản lý*/

    const handlePeopleInChargeChange = (value) => {
        let peopleInCharge = value;
        validatePeopleInCharge(peopleInCharge, true);
    };

    const validatePeopleInCharge = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate("manage_warehouse.bill_management.validate_approver");
        }
        if (willUpdateState) {
            setState({
                ...state,
                peopleInCharge: value,
                errorPeopleInCharge: msg,
            });
        }
        return msg === undefined;
    };

    /*Người giám sát*/

    const handleAccountablesChange = (value) => {
        let accountables = value;
        validateAccountables(accountables, true);
    }

    const validateAccountables = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate('manage_warehouse.bill_management.validate_approver')
        }
        if (willUpdateState) {
            setState({
                ...state,
                accountables: value,
                errorAccountables: msg,
            })
        }
        return msg === undefined;
    }

    /*Kế toán*/

    const handleAccountantsChange = (value) => {
        let accountants = value;
        validateAccountants(accountants, true);
    }

    const validateAccountants = (value, willUpdateState = true) => {
        let msg = undefined;
        const { translate } = props;
        if (!value) {
            msg = translate('manage_warehouse.bill_management.validate_approver')
        }
        if (willUpdateState) {
            setState({
                ...state,
                accountants: value,
                errorAccountants: msg,
            })
        }
        return msg === undefined;
    }

    /*Phần xử lý liên quan đến việc thêm công việc mới*/

    const handleAddWorkAssignment = () => {
        var { workAssignment } = state;
        let currentTime = formatTime(new Date())
        let array = [];
        if (workAssignment.length !== 0) {
            let result;
            for (let n in workAssignment) {
                result = validateNameField(workAssignment[n].nameField, n);
                if (!result) {
                    validateNameField(workAssignment[n].nameField, n);
                    break;
                }
            }
            if (result) {
                setState({
                    ...state,
                    workAssignment: [...workAssignment, { nameField: "", workAssignmentStaffs: array, description: "", startDate: formatDate((new Date()).toISOString()), startTime: currentTime, endDate: formatDate((new Date()).toISOString()), endTime: "05:30 PM" }],
                })
            }
        } else {
            setState({
                ...state,
                workAssignment: [...workAssignment, { nameField: "", workAssignmentStaffs: array, description: "", startDate: formatDate((new Date()).toISOString()), startTime: currentTime, endDate: formatDate((new Date()).toISOString()), endTime: "05:30 PM" }],
            })
        }

    }

    const delete_function = (index) => {
        var { workAssignment } = state;
        workAssignment.splice(index, 1);
        if (workAssignment.length !== 0) {
            for (let n in workAssignment) {
                validateNameField(workAssignment[n].nameField, n);
                // validateValue(workAssignment[n].value, n)
            }
        } else {
            setState({
                ...state,
                workAssignment: workAssignment,
                errorOnValue: undefined,
                errorOnNameField: undefined
            })
        }
    };

    const handleChangeNameField = (e, index) => {
        var { value } = e.target;
        validateNameField(value, index);
    }
    const validateNameField = (value, className, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            var { workAssignment } = state;
            workAssignment[className] = { ...workAssignment[className], nameField: value }
            setState({
                ...state,
                errorOnNameField: message,
                errorOnNameFieldPosition: message ? className : null,
                workAssignment: workAssignment
            });
        }
        return message === undefined;
    }

    const handleChangeDescription = (e, index) => {
        var { value } = e.target;
        validateDescription(value, index);
    }

    const validateDescription = (value, className, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            var { workAssignment } = state;
            workAssignment[className] = { ...workAssignment[className], description: value }
            setState({
                ...state,
                errorOnDescription: message,
                workAssignment: workAssignment
            });
        }
        return message === undefined;
    }

    const handleChangeWorkAssignmentStaffsValue = (value, index) => {
        validateWorkAssignmentStaffs(value, index);
    }
    const validateWorkAssignmentStaffs = (value, index, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            let { workAssignment } = state;
            workAssignment[index] = { ...workAssignment[index], workAssignmentStaffs: value, errorworkAssignmentStaffs: message };
            setState({
                ...state,
                workAssignment: workAssignment,
            });
        }
        return message === undefined;
    }


    /* Phần xử lý liên quan đến thời gian công việc*/

    const convertDateTime = (date, time) => {
        let splitter = date.split("-");
        let strDateTime = `${splitter[2]}/${splitter[1]}/${splitter[0]} ${time}`;
        return dayjs(strDateTime).format('YYYY/MM/DD HH:mm:ss');
    }

    // convert ISODate to String hh:mm AM/PM
    const formatTime = (date) => {
        return dayjs(date).format("h:mm A");
    }

    // Đặt lại thời gian
    const regenerateTime = () => {
        let currentTime = formatTime(new Date())
        let { workAssignment } = state;
        workAssignment.forEach(item => {
            item.startTime = currentTime;
        });
        setState({
            ...state,
            startTime: currentTime,
            workAssignment: workAssignment
        });
    }

    useEffect(() => {
        window.$(`#stock-work-assignment-modal`).on('shown.bs.modal', regenerateTime);
        return () => {
            window.$(`#stock-work-assignment-modal`).unbind('shown.bs.modal', regenerateTime)
        }
    }, [])


    const handleChangeStartDate = (value) => {
        validateStartDate(value, true);
    }
    const validateStartDate = (value, willUpdateState = true) => {
        let { translate } = props;
        let msg = TaskFormValidator.validateTaskStartDate(value, state.endDate, translate);
        let startDate = convertDateTime(value, state.startTime);
        let endDate = convertDateTime(state.endDate, state.endTime);
        if (startDate > endDate) {
            msg = translate('task.task_management.add_err_end_date');
        }
        if (willUpdateState) {
            setState({
                ...state,
                startDate: value,
                errorOnStartDateAll: msg,
            })
            state.startDate = value;
            state.errorOnStartDateAll = msg;
            if (!msg && state.endDate) {
                setState({
                    ...state,
                    errorOnEndDateAll: msg
                })
            }
        }
        return msg === undefined;
    }

    const handleStartTimeChange = (value) => {
        let { translate } = props;
        let startDate = convertDateTime(state.startDate, value);
        let endDate = convertDateTime(state.endDate, state.endTime);
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
            startTime: value,
            errorOnStartDateAll: err,
            errorOnEndDateAll: resetErr,
        });
    }

    const handleEndTimeChange = (value) => {
        let { translate } = props;
        let startDate = convertDateTime(state.startDate, state.startTime);
        let endDate = convertDateTime(state.endDate, value);
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
            endTime: value,
            errorOnEndDateAll: err,
            errorOnStartDateAll: resetErr,
        })
    }

    const handleChangeEndDate = (value) => {
        validateEndDate(value, true);
    }

    const validateEndDate = (value, willUpdateState = true) => {
        let { translate } = props;
        let msg = TaskFormValidator.validateTaskEndDate(state.startDate, value, translate);
        if (willUpdateState) {
            setState({
                ...state,
                endDate: value,
                errorOnEndDateAll: msg,
            })
            state.endDate = value;
            state.errorOnEndDateAll = msg;
            if (!msg && state.startDate) {
                setState({
                    ...state,
                    errorOnStartDateAll: msg
                });
            }
        }
        return msg === undefined;
    }

    // Phần thời gian chi tiết

    const handleChangeTaskStartDate = (value, index) => {
        validateTaskStartDate(value, index, true);
    }
    const validateTaskStartDate = (value, index, willUpdateState = true) => {
        let { translate } = props;
        let { workAssignment } = state;
        let msg = TaskFormValidator.validateTaskStartDate(value, state.workAssignment[index].endDate, translate);
        let startDate = convertDateTime(value, state.workAssignment[index].startTime);
        let endDate = convertDateTime(state.workAssignment[index].endDate, state.workAssignment[index].endTime);
        let startDateAll = convertDateTime(state.startDate, state.startTime);
        if (startDate > endDate) {
            msg = translate('task.task_management.add_err_end_date');
        }
        if (startDate < startDateAll) {
            msg = "Thời gian bắt đầu phải lớn hơn thời gian bắt đầu của công việc";
        }
        if (willUpdateState) {
            workAssignment[index] = { ...workAssignment[index], startDate: value, errorOnStartDate: msg };
            setState({
                ...state,
                workAssignment: workAssignment,
            })
            state.workAssignment[index].startDate = value;
            state.workAssignment[index].errorOnStartDate = msg;
            if (!msg && state.endDate) {
                workAssignment[index] = { ...workAssignment[index], errorOnEndDate: msg };
                setState({
                    ...state,
                    workAssignment: workAssignment
                })
            }
        }
        return msg === undefined;
    }

    const handleTaskStartTimeChange = (value, index) => {
        let { translate } = props;
        let { workAssignment } = state;
        let startDate = convertDateTime(state.workAssignment[index].startDate, value);
        let endDate = convertDateTime(state.workAssignment[index].endDate, state.workAssignment[index].endTime);
        let startDateAll = convertDateTime(state.startDate, state.startTime);
        let err, resetErr;

        if (value.trim() === "") {
            err = translate('task.task_management.add_err_empty_end_date');
        }
        else if (startDate > endDate) {
            err = translate('task.task_management.add_err_end_date');
            resetErr = undefined;
        } else if (startDate < startDateAll) {
            err = "Thời gian bắt đầu phải lớn hơn thời gian bắt đầu của công việc";
            ;
            resetErr = undefined;
        }
        workAssignment[index] = { ...workAssignment[index], startTime: value, errorOnStartDate: err, errorOnEndDate: resetErr };
        setState({
            ...state,
            workAssignment: workAssignment,
        });
    }

    const handleTaskEndTimeChange = (value, index) => {
        let { translate } = props;
        let { workAssignment } = state;
        let startDate = convertDateTime(state.workAssignment[index].startDate, state.workAssignment[index].startTime);
        let endDate = convertDateTime(state.workAssignment[index].endDate, value);
        let endDateAll = convertDateTime(state.endDate, state.endTime);
        let err, resetErr;

        if (value.trim() === "") {
            err = translate('task.task_management.add_err_empty_end_date');
        }
        else if (startDate > endDate) {
            err = translate('task.task_management.add_err_end_date');
            resetErr = undefined;
        } else if (endDate > endDateAll) {
            err = translate('task.task_management.add_err_end_date');
            resetErr = undefined;
        }
        workAssignment[index] = { ...workAssignment[index], endTime: value, errorOnEndDate: err, errorOnStartDate: resetErr };
        setState({
            ...state,
            workAssignment: workAssignment,
        })
    }

    const handleChangeTaskEndDate = (value, index) => {
        validateTaskEndDate(value, index, true);
    }

    const validateTaskEndDate = (value, index, willUpdateState = true) => {
        let { translate } = props;
        let { workAssignment } = state;
        let endDateAll = convertDateTime(state.endDate, state.endTime);
        let msg = TaskFormValidator.validateTaskEndDate(state.workAssignment[index].startDate, value, translate);
        let endDate = convertDateTime(value, state.workAssignment[index].endTime);
        if (endDate > endDateAll) {
            msg = "Ngày kết thúc phải nhỏ hơn ngày kết thúc của công việc";
        }
        if (willUpdateState) {
            workAssignment[index] = { ...workAssignment[index], endDate: value, errorOnEndDate: msg };
            setState({
                ...state,
                workAssignment: workAssignment,
            })
            state.workAssignment[index].endDate = value;
            state.workAssignment[index].errorOnEndDate = msg;
            if (!msg && state.startDate) {
                workAssignment[index] = { ...workAssignment[index], errorOnStartDate: msg };
                setState({
                    ...state,
                    workAssignment: workAssignment
                });
            }
        }
        return msg === undefined;
    }


    // useEffect(() => {
    //     if (props.billId !== state.billId || props.oldStatus !== state.oldStatus) {
    //         let approver = [];
    //         let qualityControlStaffs = [];
    //         let responsibles = [];
    //         let accountables = [];
    //         if (props.approvers && props.approvers.length > 0) {
    //             for (let i = 0; i < props.approvers.length; i++) {
    //                 approver = [...approver, props.approvers[i].approver._id];
    //             }

    //         }

    //         if (props.listQualityControlStaffs && props.listQualityControlStaffs.length > 0) {
    //             for (let i = 0; i < props.listQualityControlStaffs.length; i++) {
    //                 qualityControlStaffs = [...qualityControlStaffs, props.listQualityControlStaffs[i].staff._id];
    //             }

    //         }

    //         if (props.responsibles && props.responsibles.length > 0) {
    //             for (let i = 0; i < props.responsibles.length; i++) {
    //                 responsibles = [...responsibles, props.responsibles[i]._id];
    //             }

    //         }

    //         if (props.accountables && props.accountables.length > 0) {
    //             for (let i = 0; i < props.accountables.length; i++) {
    //                 accountables = [...accountables, props.accountables[i]._id];
    //             }

    //         }
    //         state.good.quantity = 0;
    //         state.good.good = '';
    //         state.good.description = '';
    //         state.good.lots = [];

    //         if (props.type === "1") {
    //             props.getGoodsByType({ type: "material" });
    //         } else if (props.type === "2") {
    //             props.getGoodsByType({ type: "product" });
    //         }

    //         setState({
    //             ...state,
    //             billId: props.billId,
    //             code: props.code,
    //             fromStock: props.fromStock,
    //             status: props.status,
    //             oldStatus: props.oldStatus,
    //             group: props.group,
    //             type: props.type,
    //             users: props.users,
    //             creator: props.creator,
    //             approvers: props.approvers,
    //             approver: approver,
    //             qualityControlStaffs: qualityControlStaffs,
    //             listQualityControlStaffs: props.listQualityControlStaffs,
    //             responsibles: responsibles,
    //             accountables: accountables,
    //             description: props.description,
    //             supplier: props.supplier,
    //             manufacturingMill: props.manufacturingMillId,
    //             name: props.name,
    //             phone: props.phone,
    //             email: props.email,
    //             address: props.address,
    //             listGood: props.listGood,
    //             oldGoods: props.listGood,
    //             editInfo: false,
    //             errorStock: undefined,
    //             errorType: undefined,
    //             errorApprover: undefined,
    //             errorCustomer: undefined,
    //             errorQualityControlStaffs: undefined,
    //             errorAccountables: undefined,
    //             errorResponsibles: undefined

    //         })
    //     }
    // }, [props.billId, props.oldStatus])

    const validateTask = () => {
        let { workAssignment } = state;
        let count = 0;
        workAssignment.forEach((item, index) => {
            if (!validateTaskStartDate(item.startDate, index, false)
                || !validateTaskEndDate(item.endDate, index, false)
                || !validateWorkAssignmentStaffs(item.workAssignmentStaffs, index, false)
                || !validateNameField(item.nameField, index, false)
                || !validateDescription(item.description, index, false)) {
                count++;
            }
        })
        return count === 0;
    }

    const isFormValidated = () => {
        let { peopleInCharge, accountables, accountants, startDate, endDate } = state;
        let result = validateAccountables(accountables, false) &&
            validateAccountants(accountants, false) &&
            validatePeopleInCharge(peopleInCharge, false) &&
            validateStartDate(startDate, false) &&
            validateEndDate(endDate, false) &&
            validateTask();
        return result;
    }

    useEffect(() => {
        if (isFormValidated()) {
            let data = [
                {
                    nameField: "Quản lý", workAssignmentStaffs: state.peopleInCharge, startDate: state.startDate, startTime: state.startTime, endDate: state.endDate, endTime: state.endTime
                },
                {
                    nameField: "Giám sát", workAssignmentStaffs: state.accountables, startDate: state.startDate, startTime: state.startTime, endDate: state.endDate, endTime: state.endTime
                },
                {
                    nameField: "Kế toán", workAssignmentStaffs: state.accountants, startDate: state.startDate, startTime: state.startTime, endDate: state.endDate, endTime: state.endTime
                },
            ]
            const newArray = data.concat(state.workAssignment);
            setState({
                ...state,
                dataCalendar: newArray
            })
        }
    }, [isFormValidated()])

    const save = async () => {
        const { billId, approvers, listQualityControlStaffs, responsibles, accountables } = state;
        const { group } = props;

        await props.editBill(billId, {
            // approvers: approvers,
            qualityControlStaffs: listQualityControlStaffs,
            responsibles: responsibles,
            accountables: accountables,
        })
    }

    const { translate } = props;
    const { billId, peopleInCharge, accountables, accountants, startDate, endDate, startTime, endTime, errorOnStartDateAll,
        errorOnEndDateAll, errorPeopleInCharge, errorAccountants, errorAccountables, dataCalendar, errorOnNameFieldPosition, errorOnNameField, workAssignment } = state;
    const dataApprover = getApprover();
    console.log(state);
    return (
        <React.Fragment>
            <DialogModal
                modalID={`stock-work-assignment-modal`}
                formID={`stock-work-assignment-modal`}
                title={'Phân công công việc'}
                msg_success={translate('manage_warehouse.bill_management.add_success')}
                msg_failure={translate('manage_warehouse.bill_management.add_faile')}
                disableSubmit={!isFormValidated()}
                func={save}
                size={75}
            >
                <form id={`stock-work-assignment-modal`}>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{"Danh sách người quản lý, giám sát, thời gian làm việc"}</legend>
                            <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                <div className={`form-group ${!errorPeopleInCharge ? "" : "has-error"}`}>
                                    <label>{"Người quản lý"}<span className="text-red"> * </span></label>
                                    <SelectBox
                                        id={`select-people-in-charge-${billId}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={peopleInCharge}
                                        items={dataApprover}
                                        onChange={handlePeopleInChargeChange}
                                        multiple={true}
                                    />
                                    <ErrorLabel content={errorPeopleInCharge} />
                                </div>

                            </div>
                            <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                <div className={`form-group ${!errorAccountables ? "" : "has-error"}`}>
                                    <label>{"Người giám sát"}<span className="text-red"> * </span></label>
                                    <SelectBox
                                        id={`select-accountables-${billId}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={accountables}
                                        items={dataApprover}
                                        onChange={handleAccountablesChange}
                                        multiple={true}
                                    />
                                    <ErrorLabel content={errorAccountables} />
                                </div>
                            </div>
                            <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                <div className={`form-group ${!errorAccountants ? "" : "has-error"}`}>
                                    <label>{"Kế toán"}<span className="text-red"> * </span></label>
                                    <SelectBox
                                        id={`select-accountants`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        value={accountants}
                                        items={dataApprover}
                                        onChange={handleAccountantsChange}
                                        multiple={true}
                                    />
                                    <ErrorLabel content={errorAccountants} />
                                </div>
                            </div>
                            <div className="col-xs-12">
                                <label>{"Thời gian hoàn thành công việc"}<span className="text-red"> * </span></label>
                            </div>
                            <div className={`col-xs-12 col-sm-6 col-md-6 col-lg-6 ${!errorOnStartDateAll ? "" : "has-error"}`}>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <label>{"Ngày bắt đầu"}<span className="text-red"> * </span></label>
                                    <DatePicker
                                        id={`startDatePicker`}
                                        dateFormat="day-month-year"
                                        value={startDate}
                                        onChange={handleChangeStartDate}
                                    />
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <label>{"Thời gian bắt đầu"}<span className="text-red"> * </span></label>
                                    < TimePicker
                                        id={`startTimePicker`}
                                        refs={`startTimePicker`}
                                        value={startTime}
                                        onChange={handleStartTimeChange}
                                    />
                                </div>
                                <ErrorLabel content={errorOnStartDateAll} />
                            </div>
                            <div className={`col-xs-12 col-sm-6 col-md-6 col-lg-6 ${!errorOnEndDateAll ? "" : "has-error"}`}>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <label>{"Ngày kết thúc"}<span className="text-red"> * </span></label>
                                    <DatePicker
                                        id={`endDatePicker`}
                                        dateFormat="day-month-year"
                                        value={endDate}
                                        onChange={handleChangeEndDate}
                                    />
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <label>{"Thời gian kết thúc"}<span className="text-red"> * </span></label>
                                    < TimePicker
                                        id={`endTimePicker`}
                                        refs={`endTimePicker`}
                                        value={endTime}
                                        onChange={handleEndTimeChange}
                                    />
                                </div>
                                <ErrorLabel content={errorOnEndDateAll} />
                            </div>
                        </fieldset>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{"Danh sách phân công người thực hiện"}</legend>
                            <div className="col-xs-12">
                                <div className="form-group">
                                    <p type="button" className="btn btn-success" onClick={handleAddWorkAssignment}>{"Thêm công việc mới"}</p>
                                    <p style={{ float: "right" }} type="button" className="btn btn-primary">{"Phân công tự động"}</p>
                                </div>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>{"Tên hoạt động"}</th>
                                            <th>{"Mô tả"}</th>
                                            <th>{"Người thực hiện"}</th>
                                            <th>{"Thời gian bắt đầu"}</th>
                                            <th>{"Thời gian kết thúc"}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            workAssignment.map((x, index) => {
                                                return <tr key={index}>
                                                    <td>
                                                        <div className={`form-group ${(parseInt(errorOnNameFieldPosition) === index && errorOnNameField) ? "has-error" : ""}`}>
                                                            {x.type !== 'default' ? <input className="form-control" type="text" value={x.nameField} name="nameField" style={{ width: "100%" }} onChange={(e) => handleChangeNameField(e, index)} /> : <span>{x.nameField}</span>}
                                                            {(parseInt(errorOnNameFieldPosition) === index && errorOnNameField) && <ErrorLabel content={errorOnNameField} />}
                                                        </div>
                                                        {x.type !== 'default' ? <a onClick={() => delete_function(index)}><p className='text-red'>{"Xóa công việc"}</p></a> : ''}
                                                    </td>
                                                    <td>
                                                        {x.type == 'default' ? <p>{x.description}</p> : <textarea className="form-control" type="text" value={x.description} name="description" style={{ width: "100%" }} onChange={(e) => handleChangeDescription(e, index)} />}
                                                    </td>
                                                    <td style={{ width: '90%' }}>

                                                        <div className={`form-group ${!x.errorworkAssignmentStaffs ? "" : "has-error"}`}>
                                                            <SelectBox
                                                                id={`select-responsibles-person-${index}`}
                                                                className="form-control select2"
                                                                style={{ width: "100%" }}
                                                                value={x.workAssignmentStaffs}
                                                                items={dataApprover}
                                                                onChange={(e) => handleChangeWorkAssignmentStaffsValue(e, index)}
                                                                multiple={true}
                                                            />
                                                            <ErrorLabel content={x.errorworkAssignmentStaffs} />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className={` ${!x.errorOnStartDate ? "" : "has-error"}`}>
                                                            <DatePicker
                                                                id={`startDatePicker-${index}`}
                                                                dateFormat="day-month-year"
                                                                value={x.startDate}
                                                                onChange={(e) => handleChangeTaskStartDate(e, index)}
                                                            />
                                                            <TimePicker
                                                                id={`startTimePicker-${index}`}
                                                                refs={`startTimePicker-${index}`}
                                                                value={x.startTime}
                                                                onChange={(e) => handleTaskStartTimeChange(e, index)}
                                                            />
                                                            <ErrorLabel content={x.errorOnStartDate} />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className={` ${!x.errorOnEndDate ? "" : "has-error"}`}>
                                                            <DatePicker
                                                                id={`endDatePicker-${index}`}
                                                                dateFormat="day-month-year"
                                                                value={x.endDate}
                                                                onChange={(e) => handleChangeTaskEndDate(e, index)}
                                                            />
                                                            <TimePicker
                                                                id={`endTimePicker-${index}`}
                                                                refs={`endTimePicker-${index}`}
                                                                value={x.endTime}
                                                                onChange={(e) => handleTaskEndTimeChange(e, index)}
                                                            />
                                                            <ErrorLabel content={x.errorOnEndDate} />
                                                        </div>
                                                    </td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </fieldset>
                    </div>

                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <GanttCalendar dataCalendar={dataCalendar} />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    createOrUpdateLots: LotActions.createOrUpdateLots,
    editBill: BillActions.editBill,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(StockWorkAssignmentModal));
