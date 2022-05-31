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
        detailInfo: [],
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
        let array = [];
        let description = '';
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
                    workAssignment: [...workAssignment, { nameField: "", workAssignmentStaffs: array, description: "" }],
                })
            }
        } else {
            setState({
                ...state,
                workAssignment: [...workAssignment, { nameField: "", workAssignmentStaffs: array, description: "" }],
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
                errorOnDescriptionPosition: message ? className : null,
                workAssignment: workAssignment
            });
        }
        return message === undefined;
    }

    const handleChangeWorkAssignmentStaffsValue = (value, index) => {
        validateWorkAssignmentStaffs(value, index);
    }
    const validateWorkAssignmentStaffs = async (value, index, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, value);

        if (willUpdateState) {
            var { workAssignment } = state;
            workAssignment[index].workAssignmentStaffs = value;
            await setState({
                ...state,
                errorOnValue: message,
                errorOnValuePosition: message ? index : null,
                workAssignment: workAssignment
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
        setState(state => {
            return {
                ...state,
                newTask: {
                    ...state.newTask,
                    startTime: currentTime,
                }
            }
        });
    }

    useEffect(() => {
        window.$(`#stock-work-assignment-modal`).on('shown.bs.modal', regenerateTime);
        return () => {
            window.$(`#stock-work-assignment-modal`).unbind('shown.bs.modal', regenerateTime)
        }
    }, [])


    const handleChangeTaskStartDate = (value) => {
        validateTaskStartDate(value, true);
    }
    const validateTaskStartDate = (value, willUpdateState = true) => {
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
                errorOnStartDate: msg,
            })
            state.startDate = value;
            state.errorOnStartDate = msg;
            if (!msg && state.endDate) {
                setState({
                    ...state,
                    errorOnEndDate: msg
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
            errorOnStartDate: err,
            errorOnEndDate: resetErr,
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
            errorOnEndDate: err,
            errorOnStartDate: resetErr,
        })
    }

    const handleChangeTaskEndDate = (value) => {
        validateTaskEndDate(value, true);
    }

    const validateTaskEndDate = (value, willUpdateState = true) => {
        let { translate } = props;
        let msg = TaskFormValidator.validateTaskEndDate(state.startDate, value, translate);
        if (willUpdateState) {
            setState({
                ...state,
                endDate: value,
                errorOnEndDate: msg,
            })
            state.endDate = value;
            state.errorOnEndDate = msg;
            if (!msg && state.startDate) {
                setState({
                    ...state,
                    errorOnStartDate: msg
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

    const handleChangeTime = (time, type, index) => {
        validateTime(time, type, index);
    }

    const validateTime = async (time, type, index, willUpdateState = true) => {
        let { message } = ValidationHelper.validateEmpty(props.translate, time);
        if (willUpdateState) {
            var { workAssignment } = state;
            workAssignment[index] = { ...workAssignment[index], [type]: time };
            setState({
                ...state,
                errorOnTime: message,
                errorOnTimePosition: message ? index : null,
                workAssignment: workAssignment
            });
        }
        return message === undefined;
    }

    /*Lịch*/

    const handleZoomChange = (zoom) => {
        setState({
            ...state,
            currentZoom: zoom
        });
    }

    const isFormValidated = () => {
        const { status } = state;
        // let result = ;
        // validateType(state.type, false) &&
        // validateStock(state.fromStock, false) &&
        // validateApprover(state.approver, false) &&
        // validatePartner(state.supplier, false) &&
        // validateAccountables(state.accountables, false) &&
        // // validateQualityControlStaffs(state.qualityControlStaffs, false) &&
        // validateResponsibles(state.responsibles, false)
        // if (status === '2') {
        //     result = result &&
        //         checkAllLots();
        // }
        return true;
    }

    const save = async () => {
        const { billId, approvers, listQualityControlStaffs, responsibles, accountables } = state;
        const { group } = props;

        // if (arrayId && arrayId.length > 0) {
        //     await props.deleteLot(arrayId);
        // }

        await props.editBill(billId, {
            approvers: approvers,
            qualityControlStaffs: listQualityControlStaffs,
            responsibles: responsibles,
            accountables: accountables,
        })
    }

    const { translate } = props;
    const { billId, approver, accountables, accountants, startDate, endDate, startTime, endTime, errorOnStartDate, errorOnEndDate, errorPeopleInCharge, errorAccountants, errorAccountables, currentZoom, errorOnNameFieldPosition, errorOnNameField, errorOnValue, errorOnValuePosition, workAssignment } = state;
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
                                        value={approver}
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
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <label>{"Ngày bắt đầu"}<span className="text-red"> * </span></label>
                                    <DatePicker
                                        id={`startDatePicker`}
                                        dateFormat="day-month-year"
                                        value={startDate}
                                        onChange={handleChangeTaskStartDate}
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
                                <ErrorLabel content={errorOnStartDate} />
                            </div>
                            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                                    <label>{"Ngày kết thúc"}<span className="text-red"> * </span></label>
                                    <DatePicker
                                        id={`endDatePicker`}
                                        dateFormat="day-month-year"
                                        value={endDate}
                                        onChange={handleChangeTaskEndDate}
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
                                <ErrorLabel content={errorOnEndDate} />
                            </div>
                        </fieldset>
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{"Danh sách phân công người thực hiện"}</legend>
                            <div className="col-xs-12">
                                <div className="form-group">
                                    <p type="button" className="btn btn-success" onClick={handleAddWorkAssignment}>Thêm công việc mới</p>
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
                                                        {x.type !== 'default' ? <a onClick={() => delete_function(index)}><p className='text-red'>- Xóa tùy chọn</p></a> : ''}
                                                    </td>
                                                    <td>
                                                        {x.type == 'default' ? <p>{x.description}</p> : <textarea className="form-control" type="text" value={x.description} name="description" style={{ width: "100%" }} onChange={(e) => handleChangeDescription(e, index)} />}
                                                    </td>
                                                    <td style={{ width: '90%' }}>
                                                        <div className={`form-group ${(parseInt(errorOnValuePosition) === 0 && errorOnValue) ? "has-error" : ""}`}>
                                                            <SelectBox
                                                                id={`select-responsibles-person-${index}`}
                                                                className="form-control select2"
                                                                style={{ width: "100%" }}
                                                                value={x.workAssignmentStaffs}
                                                                items={dataApprover}
                                                                onChange={(e) => handleChangeWorkAssignmentStaffsValue(e, index)}
                                                                multiple={true}
                                                            />
                                                            {(parseInt(errorOnValuePosition) === 0 && errorOnValue) && <ErrorLabel content={errorOnValue} />}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <DatePicker
                                                            id={`startDatePicker-${index}`}
                                                            dateFormat="day-month-year"
                                                            value={x.startDate}
                                                            onChange={(e) => handleChangeTime(e, 'startDate', index)}
                                                        />
                                                        <TimePicker
                                                            id={`startTimePicker-${index}`}
                                                            refs={`startTimePicker-${index}`}
                                                            value={x.startTime}
                                                            onChange={(e) => handleChangeTime(e, 'startTime', index)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <DatePicker
                                                            id={`endDatePicker-${index}`}
                                                            dateFormat="day-month-year"
                                                            value={x.endDate}
                                                            onChange={(e) => handleChangeTime(e, 'endDate', index)}
                                                        />
                                                        <TimePicker
                                                            id={`endTimePicker-${index}`}
                                                            refs={`endTimePicker-${index}`}
                                                            value={x.endTime}
                                                            onChange={(e) => handleChangeTime(e, 'endTime', index)}
                                                        />
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
                        <Gantt
                            ganttId="gantt-chart"
                            ganttData={''}
                            zoom={currentZoom}
                            status={''}
                            count={''}
                            line={''}
                            unit={''}
                            onZoomChange={handleZoomChange}
                        // attachEvent={attachEvent}
                        />
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
