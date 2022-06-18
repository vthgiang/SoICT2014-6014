import React, { useState, useEffect } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect } from 'react-redux';
import { DialogModal, SelectBox, ErrorLabel, Gantt, DatePicker, TimePicker } from '../../../../../../common-components';
import { LotActions } from '../../../inventory-management/redux/actions';
import { BillActions } from '../../redux/actions';
import ValidationHelper from '../../../../../../helpers/validationHelper';
import { TaskFormValidator } from '../../../../../task/task-management/component/taskFormValidator';
import dayjs from "dayjs";
import GanttCalendar from './GanttCalendar';
import { UserActions } from "../../../../../super-admin/user/redux/actions";
import { dataWorkAssignment } from './config.js';

function StockWorkAssignment(props) {

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
    let dataWorkAssignments = [];
    switch (props.group) {
        case "1":
            dataWorkAssignments = dataWorkAssignment.goodReceiptData(props.code);
            break;
        case "2":
            dataWorkAssignments = dataWorkAssignment.goodIssueData(props.code);
            break;
        case "3":
            dataWorkAssignments = dataWorkAssignment.goodReturnData(props.code);
    }

    const [state, setState] = useState({
        userId: localStorage.getItem("userId"),
        currentZoom: props.translate('system_admin.system_setting.backup.date'),
        workAssignment: dataWorkAssignments,
        startDate: formatDate((new Date()).toISOString()),
        endDate: formatDate((new Date()).toISOString()),
        startTime: '',
        endTime: '11:59 PM',
        dataCalendarStatus: 0,
        dataCalendarOldStatus: 0,
        counter: 0,
        isOpenCalendarChart: false,
        isHaveDataStep2: 0,
        name: "",
        email: "",
        address: "",
        phone: "",
        priority: 3,
    })

    function getUnique(arr, index) {

        const unique = arr
            .map(e => e[index])
            .map((e, i, final) => final.indexOf(e) === i && i)
            .filter(e => arr[e]).map(e => arr[e]);

        return unique;
    }

    const getEmployees = () => {
        const { user, translate } = props;
        let { userdepartments } = user;

        if (userdepartments) {
            let list = [{ value: [], text: translate('manage_warehouse.bill_management.choose_employees') }];
            const { deputyManagers, employees, managers } = userdepartments
            let keyManagers = managers ? Object.keys(managers) : [];
            let keyDeputyManagers = deputyManagers ?  Object.keys(deputyManagers) : [];
            let keyEmployees = employees ? Object.keys(employees) : [];
            if (managers[keyManagers[0]]) {
                list = managers[keyManagers[0]].members.map(category => { return { value: category._id, text: category.name } });
            }
            if (deputyManagers[keyDeputyManagers[0]]) {
                list = list.concat(deputyManagers[keyDeputyManagers[0]].members.map(category => { return { value: category._id, text: category.name } }));
            }
            if (employees[keyEmployees[0]]) {
                list = list.concat(employees[keyEmployees[0]].members.map(category => { return { value: category._id, text: category.name } }));
            }
            return getUnique(list, 'value');
        }
    }

    // Độ ưu tiên

    const handleChangeTaskPriority = (event) => {
        console.log(event.target.value);
        setState({
            ...state,
            priority: event.target.value
        });
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
            msg = translate("manage_warehouse.bill_management.validate_choose_employees");
        }
        if (willUpdateState) {
            setState({
                ...state,
                peopleInCharge: value,
                errorPeopleInCharge: msg,
                counter: isFormValidated() ? state.counter + 1 : state.counter
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
            msg = translate('manage_warehouse.bill_management.validate_choose_employees')
        }
        if (willUpdateState) {
            setState({
                ...state,
                accountables: value,
                errorAccountables: msg,
                counter: isFormValidated() ? state.counter + 1 : state.counter
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
            msg = translate('manage_warehouse.bill_management.validate_choose_employees')
        }
        if (willUpdateState) {
            setState({
                ...state,
                accountants: value,
                errorAccountants: msg,
                counter: isFormValidated() ? state.counter + 1 : state.counter
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
                    workAssignment: [...workAssignment, { nameField: "", workAssignmentStaffs: array, description: "", startDate: formatDate((new Date()).toISOString()), startTime: currentTime, endDate: formatDate((new Date()).toISOString()), endTime: "11:59 PM" }],
                })
            }
        } else {
            setState({
                ...state,
                workAssignment: [...workAssignment, { nameField: "", workAssignmentStaffs: array, description: "", startDate: formatDate((new Date()).toISOString()), startTime: currentTime, endDate: formatDate((new Date()).toISOString()), endTime: "11:59 PM" }],
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
                errorOnNameField: undefined,
                counter: isFormValidated() ? state.counter + 1 : state.counter
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
                workAssignment: workAssignment,
                counter: isFormValidated() ? state.counter + 1 : state.counter
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
            // let array = findFullUserInfor(value);
            workAssignment[index] = { ...workAssignment[index], workAssignmentStaffs: value, errorworkAssignmentStaffs: message };
            setState({
                ...state,
                workAssignment: workAssignment,
                counter: isFormValidated() ? state.counter + 1 : state.counter
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
            workAssignment: workAssignment,
            counter: isFormValidated() ? state.counter + 1 : state.counter
        });
    }

    useEffect(() => {
        let currentRole = localStorage.getItem("currentRole")
        props.getAllUserSameDepartment(currentRole)
        regenerateTime();
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
                counter: isFormValidated() ? state.counter + 1 : state.counter
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
            counter: isFormValidated() ? state.counter + 1 : state.counter
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
            counter: isFormValidated() ? state.counter + 1 : state.counter
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
                counter: isFormValidated() ? state.counter + 1 : state.counter

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
                    workAssignment: workAssignment,
                    counter: isFormValidated() ? state.counter + 1 : state.counter

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
            counter: isFormValidated() ? state.counter + 1 : state.counter
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
            counter: isFormValidated() ? state.counter + 1 : state.counter
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
                    workAssignment: workAssignment,
                    counter: isFormValidated() ? state.counter + 1 : state.counter
                });
            }
        }
        return msg === undefined;
    }

    // Phần người giao hàng

    const handleTranferInformationChange = async (e, name) => {
        let value = e.target.value;
        setState({
            ...state,
            [name]: value,
        });
        await props.onTranferInformationChange(name, value)
    };

    // Phần dữ liệu

    if (props.isHaveDataStep2 !== state.isHaveDataStep2) {
        setState({
            ...state,
            peopleInCharge: props.peopleInCharge,
            accountables: props.accountables,
            accountants: props.accountants,
            startTime: props.startTime,
            endTime: props.endTime,
            startDate: props.startDate,
            endDate: props.endDate,
            workAssignment: props.workAssignment,
            isHaveDataStep2: props.isHaveDataStep2,
            priority: props.priority,
        });
    }

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

    const handleOpenCalendarChart = () => {
        if (isFormValidated()) {
            let groupText = '';
            switch (props.group) {
                case "1":
                    groupText = 'nhập kho';
                    break;
                case "2":
                    groupText = 'xuất kho';
                    break;
                case "3":
                    groupText = 'trả hàng';
                    break;
            }

            let data = [
                {
                    nameField: "Công việc " + groupText + " phiếu: " + props.code, workAssignmentStaffs: state.peopleInCharge, startDate: state.startDate, startTime: state.startTime, endDate: state.endDate, endTime: state.endTime
                },
                {
                    nameField: "Giám sát quá trình " + groupText + " phiếu: " + props.code, workAssignmentStaffs: state.accountables, startDate: state.startDate, startTime: state.startTime, endDate: state.endDate, endTime: state.endTime
                },
                {
                    nameField: "Kế toán " + groupText + " phiếu: " + props.code, workAssignmentStaffs: state.accountants, startDate: state.startDate, startTime: state.startTime, endDate: state.endDate, endTime: state.endTime
                },
            ]
            props.onDataChange(data, state, state.priority);
            const newArray = data.concat(state.workAssignment);
            setState({
                ...state,
                dataCalendar: newArray,
                counter: state.counter + 1,
                isOpenCalendarChart: true
            })
        }
    }
    const { translate, name, phone, email, address } = props;
    const { billId, peopleInCharge, accountables, accountants, startDate, endDate, startTime, endTime, errorOnStartDateAll,
        errorOnEndDateAll, errorPeopleInCharge, errorAccountants, errorAccountables, dataCalendar, errorOnNameFieldPosition,
        errorOnNameField, workAssignment, counter, isOpenCalendarChart, priority } = state;

    const dataEmployees = getEmployees();
    return (
        <React.Fragment>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">{"Danh sách người quản lý, giám sát, thời gian làm việc"}</legend>
                    <div className={'row'}>
                        {/* Độ ưu tiên công việc */}
                        <div className="col-lg-4 col-md-4 col-ms-12 col-xs-12 form-group">
                            <label className="control-label">{translate('task.task_management.detail_priority')}<span className="text-red">*</span></label>
                            <select className="form-control" value={priority} onChange={handleChangeTaskPriority}>
                                <option value={5}>{translate('task.task_management.urgent')}</option>
                                <option value={4}>{translate('task.task_management.high')}</option>
                                <option value={3}>{translate('task.task_management.standard')}</option>
                                <option value={2}>{translate('task.task_management.average')}</option>
                                <option value={1}>{translate('task.task_management.low')}</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                        <div className={`form-group ${!errorPeopleInCharge ? "" : "has-error"}`}>
                            <label>{"Người quản lý"}<span className="text-red"> * </span></label>
                            <SelectBox
                                id={`select-people-in-charge-${billId}`}
                                className="form-control select2"
                                style={{ width: "100%" }}
                                value={peopleInCharge}
                                items={dataEmployees}
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
                                items={dataEmployees}
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
                                items={dataEmployees}
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
                                dateFormat="year-month-day"
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
                                dateFormat="year-month-day"
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
                                                        items={dataEmployees}
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
                                                        dateFormat="year-month-day"
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
                                                        dateFormat="year-month-day"
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
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">{"Biểu đồ lịch công việc"}</legend>
                    <button type="button" disabled={!isFormValidated()} className="btn btn-info" onClick={handleOpenCalendarChart}>{!isOpenCalendarChart ? "Xem biểu đồ công việc" : 'Làm mới biểu đồ'}</button>
                    {isOpenCalendarChart && <GanttCalendar dataChart={dataCalendar} counter={counter} />}
                </fieldset>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">{translate("manage_warehouse.bill_management.receiver")}</legend>
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className={`form-group`}>
                            <label>
                                {translate("manage_warehouse.bill_management.name")}
                            </label>
                            <input type="text" className="form-control" value={name} onChange={(e) => handleTranferInformationChange(e, 'name')} />
                        </div>
                        <div className={`form-group`}>
                            <label>
                                {translate("manage_warehouse.bill_management.phone")}
                            </label>
                            <input type="number" className="form-control" value={phone} onChange={(e) => handleTranferInformationChange(e, 'phone',)} />
                        </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <div className={`form-group`}>
                            <label>
                                {translate("manage_warehouse.bill_management.email")}
                            </label>
                            <input type="text" className="form-control" value={email} onChange={(e) => handleTranferInformationChange(e, 'email')} />
                        </div>
                        <div className={`form-group`}>
                            <label>
                                {translate("manage_warehouse.bill_management.address")}
                            </label>
                            <input type="text" className="form-control" value={address} onChange={(e) => handleTranferInformationChange(e, 'address')} />
                        </div>
                    </div>
                </fieldset>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    createOrUpdateLots: LotActions.createOrUpdateLots,
    editBill: BillActions.editBill,
    getAllUserSameDepartment: UserActions.getAllUserSameDepartment,

}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(StockWorkAssignment));
