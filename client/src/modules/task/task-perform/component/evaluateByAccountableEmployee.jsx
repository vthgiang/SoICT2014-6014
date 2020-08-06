import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { getStorage } from '../../../../config';
import { DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../common-components/index';
import { performTaskAction } from '../redux/actions';
import { TaskInformationForm } from './taskInformationForm';
import { AutomaticTaskPointCalculator } from './automaticTaskPointCalculator';
import { ModalShowAutoPointInfo } from './modalShowAutoPointInfo';
import moment from 'moment';

var currentTask;

class EvaluateByAccountableEmployee extends Component {
    constructor(props) {
        super(props);

        let { date, id } = this.props;
        let data = this.getData(date);
        currentTask = data;

        this.state = {
            id: id,
            task: data.task,
            userId: data.userId,
            info: data.info,
            results: data.results,
            empPoint: data.empPoint,
            status: data.statusOptions,
            progress: data.progress,
            autoPoint: data.calcAuto,
            oldAutoPoint: data.automaticPoint,
            date: data.date,
            checkSave: data.checkSave,
            prevDate: data.prevDate,
            dentaDate: data.dentaDate,
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,

                errorOnDate: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
                errorOnPoint: undefined,
                errorOnInfoDate: undefined,
                errorOnProgress: undefined,
                errorOnInfoBoolean: undefined,
                errorOnTextInfo: undefined,
                errorOnNumberInfo: undefined,
                errorOnAccountablePoint: undefined,
                errorOnAccountableContribution: undefined,
                errorOnMyPoint: undefined
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.id !== this.state.id) {
            let { task, idUser } = this.state;
            let department = task.organizationalUnit._id;
            let date = nextProps.date;
            let data = this.getData(date);

            this.setState(state => {
                return {
                    ...state,
                    id: nextProps.id,
                    task: data.task,
                    userId: data.userId,
                    info: data.info,
                    results: data.results,
                    empPoint: data.empPoint,
                    status: data.statusOptions,
                    progress: data.progress,
                    autoPoint: data.calcAuto,
                    oldAutoPoint: data.automaticPoint,
                    date: data.date,
                    checkSave: data.checkSave,
                    prevDate: data.prevDate,
                    dentaDate: data.dentaDate,
                }
            });
            return false;
        }
        else return true;
    }

    getData = (dateParam) => {
        let idUser = getStorage("userId");
        let checkSave = false;
        let { task } = this.props;
        let date = dateParam;
        let prevDate = this.formatDate(task.startDate);
        let dentaDate = 0;
        let evaluations, prevEval;

        let splitter = dateParam.split("-");
        let dateOfEval = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        let dateOfPrevEval = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        var newMonth = dateOfPrevEval.getMonth() - 1;
        if (newMonth < 0) {
            newMonth += 12;
            dateOfPrevEval.setYear(dateOfPrevEval.getYear() - 1);
        }
        dateOfPrevEval.setMonth(newMonth);

        console.log('date', dateOfEval, dateOfPrevEval);
        let monthOfEval = dateOfEval.getMonth();
        let monthOfPrevEval = dateOfPrevEval.getMonth();
        let yearOfEval = dateOfEval.getFullYear();
        let yearOfPrevEval = dateOfPrevEval.getFullYear();

        evaluations = task.evaluations.find(e => (monthOfEval === new Date(e.date).getMonth() && yearOfEval === new Date(e.date).getFullYear()));
        prevEval = task.evaluations.find(e => ((monthOfPrevEval) === new Date(e.date).getMonth() && yearOfPrevEval === new Date(e.date).getFullYear()));
        if (prevEval) {
            prevDate = this.formatDate(prevEval.date);
        }
        let automaticPoint = (evaluations && evaluations.results.length !== 0) ? evaluations.results[0].automaticPoint : undefined;
        let progress = evaluations ? evaluations.progress : task.progress;

        // let date = this.formatDate(new Date());
        // if (this.props.perform === "stop") { // nếu dừng thì cho ngày là ngày hiện tại
        //     date = this.formatDate(new Date());
        // }
        // else if (this.props.perform === "evaluate") { // nếu đánh giá thì cho ngày đánh giá là cuối tháng
        //     date = moment().endOf("month").format('DD-MM-YYYY');
        // }
        let info = {};

        let infoEval = task.taskInformations;
        for (let i in infoEval) {

            if (infoEval[i].type === "Date") {
                if (infoEval[i].value) {
                    info[`${infoEval[i].code}`] = {
                        // value: this.formatDate(infoEval[i].value),
                        code: infoEval[i].code,
                        type: infoEval[i].type
                    }
                }
                else {
                    info[`${infoEval[i].code}`] = {
                        value: this.formatDate(Date.now()),
                        code: infoEval[i].code,
                        type: infoEval[i].type
                    }
                }
            }
            else if (infoEval[i].type === "SetOfValues") {
                let splitSetOfValues = infoEval[i].extra.split('\n');
                if (infoEval[i].value) {
                    info[`${infoEval[i].code}`] = {
                        // value: [infoEval[i].value],
                        code: infoEval[i].code,
                        type: infoEval[i].type
                    }
                }
                else {
                    info[`${infoEval[i].code}`] = {
                        value: [splitSetOfValues[0]],
                        code: infoEval[i].code,
                        type: infoEval[i].type
                    }
                }
            }
            else {
                if (infoEval[i].value) {
                    info[`${infoEval[i].code}`] = {
                        // value: infoEval[i].value,
                        code: infoEval[i].code,
                        type: infoEval[i].type
                    }
                }
            }
        }

        let empPoint = {}, results = {};
        let inactiveEmp = task.inactiveEmployees.map(e => e._id);

        for (let i in task.responsibleEmployees) {
            if (inactiveEmp.indexOf(task.responsibleEmployees[i]._id) === -1) {
                results[`approvedPointResponsible${task.responsibleEmployees[i]._id}`] = {
                    value: undefined,
                    employee: task.responsibleEmployees[i]._id,
                    role: "Responsible",
                    target: "Point"
                }
                results[`contributeResponsible${task.responsibleEmployees[i]._id}`] = {
                    value: undefined,
                    employee: task.responsibleEmployees[i]._id,
                    role: "Responsible",
                    target: "Contribution"
                }
            }
        }
        for (let i in task.consultedEmployees) {
            if (inactiveEmp.indexOf(task.consultedEmployees[i]._id) === -1) {
                results[`approvedPointConsulted${task.consultedEmployees[i]._id}`] = {
                    value: undefined,
                    employee: task.consultedEmployees[i]._id,
                    role: "Consulted",
                    target: "Point"
                }
                results[`contributeConsulted${task.consultedEmployees[i]._id}`] = {
                    value: undefined,
                    employee: task.consultedEmployees[i]._id,
                    role: "Consulted",
                    target: "Contribution"
                }
            }
        }
        for (let i in task.accountableEmployees) {
            if (inactiveEmp.indexOf(task.accountableEmployees[i]._id) === -1) {
                results[`approvedPoint${task.accountableEmployees[i]._id}`] = {
                    value: undefined,
                    employee: task.accountableEmployees[i]._id,
                    role: "Accountable",
                    target: "Point"
                }
                results[`contributeAccountable${task.accountableEmployees[i]._id}`] = {
                    value: undefined,
                    employee: task.accountableEmployees[i]._id,
                    role: "Accountable",
                    target: "Contribution"
                }
            }
        }

        if (evaluations) {
            if (evaluations.results.length !== 0) {
                let listResult = evaluations.results;
                for (let i in listResult) {
                    if (listResult[i].role === "Responsible") {
                        empPoint[`responsible${listResult[i].employee._id}`] = listResult[i].employeePoint ? listResult[i].employeePoint : undefined;
                        results[`approvedPointResponsible${listResult[i].employee._id}`] = {
                            value: listResult[i].approvedPoint ? listResult[i].approvedPoint : undefined,
                            employee: listResult[i].employee._id,
                            role: "Responsible",
                            target: "Point"
                        }
                        results[`contributeResponsible${listResult[i].employee._id}`] = {
                            value: listResult[i].contribution ? listResult[i].contribution : undefined,
                            employee: listResult[i].employee._id,
                            role: "Responsible",
                            target: "Contribution"
                        }
                    }
                    else if (listResult[i].role === "Consulted") {
                        empPoint[`consulted${listResult[i].employee._id}`] = listResult[i].employeePoint ? listResult[i].employeePoint : undefined;
                        results[`approvedPointConsulted${listResult[i].employee._id}`] = {
                            value: listResult[i].approvedPoint ? listResult[i].approvedPoint : undefined,
                            employee: listResult[i].employee._id,
                            role: "Consulted",
                            target: "Point"
                        }
                        results[`contributeConsulted${listResult[i].employee._id}`] = {
                            value: listResult[i].contribution ? listResult[i].contribution : undefined,
                            employee: listResult[i].employee._id,
                            role: "Consulted",
                            target: "Contribution"
                        }
                    }
                    else if (listResult[i].role === "Accountable") {
                        empPoint[`accountable${listResult[i].employee._id}`] = listResult[i].employeePoint ? listResult[i].employeePoint : undefined;
                        results[`approvedPoint${listResult[i].employee._id}`] = {
                            value: listResult[i].approvedPoint ? listResult[i].approvedPoint : undefined,
                            employee: listResult[i].employee._id,
                            role: "Accountable",
                            target: "Point"
                        }
                        results[`contributeAccountable${listResult[i].employee._id}`] = {
                            value: listResult[i].contribution ? listResult[i].contribution : undefined,
                            employee: listResult[i].employee._id,
                            role: "Accountable",
                            target: "Contribution"
                        }
                    }
                }
            }


            let infoEval = evaluations.taskInformations;
            let chkHasInfo = false;
            for (let i in infoEval) {
                if (infoEval[i].value !== undefined) {
                    chkHasInfo = true;
                    break;
                }
            }

            if (chkHasInfo) {
                for (let i in infoEval) {

                    if (infoEval[i].type === "Date") {
                        if (infoEval[i].value) {
                            info[`${infoEval[i].code}`] = {
                                value: this.formatDate(infoEval[i].value),
                                code: infoEval[i].code,
                                type: infoEval[i].type
                            }
                        }
                        else {
                            info[`${infoEval[i].code}`] = {
                                value: this.formatDate(Date.now()),
                                code: infoEval[i].code,
                                type: infoEval[i].type
                            }
                        }
                    }
                    else if (infoEval[i].type === "SetOfValues") {
                        let splitSetOfValues = infoEval[i].extra.split('\n');
                        if (infoEval[i].value) {
                            info[`${infoEval[i].code}`] = {
                                value: [infoEval[i].value],
                                code: infoEval[i].code,
                                type: infoEval[i].type
                            }
                        }
                        else {
                            info[`${infoEval[i].code}`] = {
                                value: [splitSetOfValues[0]],
                                code: infoEval[i].code,
                                type: infoEval[i].type
                            }
                        }
                    }
                    else {
                        if (infoEval[i].value) {
                            info[`${infoEval[i].code}`] = {
                                value: infoEval[i].value,
                                code: infoEval[i].code,
                                type: infoEval[i].type
                            }
                        }
                    }
                }

            }
            // if (this.props.perform === "stop") {
            //     if (chkHasInfo) {
            //         date = this.formatDate(evaluations.date);
            //     }
            //     else date = this.formatDate(new Date());
            // }
            // else if (this.props.perform === "evaluate") {
            //     date = this.formatDate(evaluations.date);

            // }
        }

        let statusOptions = []; statusOptions.push(task && task.status);

        let taskInfo = {
            task: task,
            progress: progress,
            date: date,
            info: info,
        };

        let calcAuto = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo);
        if (isNaN(calcAuto)) calcAuto = undefined

        dentaDate = Math.round(((new Date()).getTime() - dateOfEval.getTime()) / (1000 * 3600 * 24));

        return {
            info: info,
            date: date,
            progress: progress,
            task: task,
            userId: idUser,
            empPoint: empPoint,
            results: results,
            automaticPoint: automaticPoint,
            statusOptions: statusOptions,
            calcAuto: calcAuto,
            checkSave: checkSave,
            prevDate: prevDate,
            dentaDate: dentaDate,
        }
    }


    getInfo = (dateParam) => {
        let info = {};
        let checkSave = false;

        let date = dateParam;
        let evaluation;
        let task = this.props.task;
        let splitter = dateParam.split("-");
        let dateOfEval = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        let monthOfEval = dateOfEval.getMonth();
        let yearOfEval = dateOfEval.getFullYear();

        evaluation = task.evaluations.find(e => (monthOfEval === new Date(e.date).getMonth() && yearOfEval === new Date(e.date).getFullYear()));
        let automaticPoint = (evaluation && evaluation.results.length !== 0) ? evaluation.results[0].automaticPoint : undefined;
        let infoTask = task.taskInformations;

        for (let i in infoTask) {
            if (infoTask[i].type === "Date") {
                if (infoTask[i].value) {
                    info[`${infoTask[i].code}`] = {
                        value: this.formatDate(infoTask[i].value),
                        code: infoTask[i].code,
                        type: infoTask[i].type
                    }
                }
                else if (!infoTask[i].filledByAccountableEmployeesOnly) {
                    info[`${infoTask[i].code}`] = {
                        value: this.formatDate(Date.now()),
                        code: infoTask[i].code,
                        type: infoTask[i].type
                    }
                }
            }
            else if (infoTask[i].type === "SetOfValues") {
                let splitSetOfValues = infoTask[i].extra.split('\n');
                if (infoTask[i].value) {
                    info[`${infoTask[i].code}`] = {
                        value: [infoTask[i].value],
                        code: infoTask[i].code,
                        type: infoTask[i].type
                    }
                }
                else if (!infoTask[i].filledByAccountableEmployeesOnly) {
                    info[`${infoTask[i].code}`] = {
                        value: [splitSetOfValues[0]],
                        code: infoTask[i].code,
                        type: infoTask[i].type
                    }
                }
            }
            else {
                if (infoTask[i].value) {
                    info[`${infoTask[i].code}`] = {
                        value: infoTask[i].value,
                        code: infoTask[i].code,
                        type: infoTask[i].type
                    }
                }
            }
        }

        let progress = task.progress;

        let taskInfo = {
            task: task,
            progress: progress,
            date: date,
            info: info,
        };

        let calcAuto = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo);
        if (isNaN(calcAuto)) calcAuto = undefined

        return {
            info: info,
            autoPoint: automaticPoint,
            progress: progress,
            calcAuto: calcAuto,
            checkSave: checkSave,
        }
    }

    // hàm cập nhật thông tin 
    updateInfo = async () => {
        let data = this.getInfo(this.state.date);
        await this.setState(state => {
            return {
                ...state,
                info: data.info,
                autoPoint: data.calcAuto,
                oldAutoPoint: data.autoPoint,
                progress: data.progress,
                checkSave: data.checkSave,
            }
        });
    }


    // Function format ngày hiện tại thành dạnh dd-mm-yyyy
    formatDate = (date) => {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }

    handleChangePoint = async (e) => {
        let value = parseInt(e.target.value);
        await this.setState(state => {
            return {
                ...state,
                point: value,
                errorOnPoint: this.validatePoint(value)
            }
        })
    }

    handleChangeProgress = async (e) => {
        let value = parseInt(e.target.value);
        await this.setState(state => {
            return {
                ...state,
                progress: value,
                errorOnProgress: this.validatePoint(value)
            }
        })
        await this.handleChangeAutoPoint();
    }

    calcAutomaticPoint = () => {
        let taskInfo = {
            task: this.state.task,
            progress: this.state.progress,
            date: this.state.date,
            info: this.state.info,
        };

        let automaticPoint = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo);
        if (isNaN(automaticPoint)) automaticPoint = undefined

        return automaticPoint;
    }

    handleChangeAutoPoint = async () => {
        let automaticPoint = this.calcAutomaticPoint();
        if (automaticPoint < 0) {
            automaticPoint = 0;
        };
        await this.setState(state => {
            return {
                ...state,
                autoPoint: automaticPoint,
                showAutoPointInfo: undefined
            }
        });
    }

    validateEvaluateResult = (value) => {
        let { translate } = this.props;
        let msg = undefined;
        if (value < 0 || value > 100) {
            msg = translate('task.task_perform.modal_approve_task.err_range');
        }
        return msg;
    }

    handleChangeAccountablePoint = async (e, id) => {
        let value = parseInt(e.target.value);
        let name = e.target.name
        await this.setState(state => {
            state.results[`${name}`] = {
                value: value,
                employee: id,
                role: "Accountable",
                target: "Point"
            }
            state.empPoint[`accountable${id}`] = value;
            return {
                ...state,
                errorOnAccountablePoint: this.validateEvaluateResult(value)
            }
        })
    }

    handleChangeAccountableContribution = async (e, id) => {
        let value = parseInt(e.target.value);
        let name = e.target.name;
        await this.setState(state => {
            state.results[`${name}`] = {
                value: value,
                employee: id,
                role: "Accountable",
                target: "Contribution"
            }
            return {
                ...state,
                errorOnAccountableContribution: this.validateEvaluateResult(value)
            }
        })
    }

    handleChangeApprovedPointForResponsible = async (e, id) => {
        let value = parseInt(e.target.value);
        let name = e.target.name
        await this.setState(state => {
            state.results[`${name}`] = {
                value: isNaN(value) ? undefined : value,
                employee: id,
                role: "Responsible",
                target: "Point"
            }
            return {
                ...state,
                errorOnAccountablePoint: this.validateEvaluateResult(value)
            }
        })
    }

    handleChangeResponsibleContribution = async (e, id) => {
        let value = parseInt(e.target.value);
        let name = e.target.name;
        await this.setState(state => {
            state.results[`${name}`] = {
                value: isNaN(value) ? undefined : value,
                employee: id,
                role: "Responsible",
                target: "Contribution"
            }
            return {
                ...state,
                errorOnAccountableContribution: this.validateEvaluateResult(value)
            }
        })
    }

    handleChangeApprovedPointForConsulted = async (e, id) => {
        let value = parseInt(e.target.value);
        let name = e.target.name
        await this.setState(state => {
            state.results[`${name}`] = {
                value: value,
                employee: id,
                role: "Consulted",
                target: "Point"
            }
            return {
                ...state,
                errorOnAccountablePoint: this.validateEvaluateResult(value)
            }
        })
    }

    handleChangeConsultedContribution = async (e, id) => {
        let value = parseInt(e.target.value);
        let name = e.target.name;
        await this.setState(state => {
            state.results[`${name}`] = {
                value: value,
                employee: id,
                role: "Consulted",
                target: "Contribution"
            }
            return {
                ...state,
                errorOnAccountableContribution: this.validateEvaluateResult(value)
            }
        })
    }

    handleChangeMyPoint = async (e) => {
        let value = parseInt(e.target.value);
        await this.setState(state => {
            return {
                ...state,
                myPoint: value,
                errorOnMyPoint: this.validatePoint(value)
            }
        })
    }

    onContributeChange = async (e, id) => {
        let { name, value } = e.target;
        await this.setState(state => {
            state.results[`${name}`] = {
                value: value,
                employee: id,
            }
            return {
                ...state,
            }
        });
    }

    onApprovedPointChange = async (e, id) => {
        let { name, value } = e.target;
        await this.setState(state => {
            state.results[`${name}`] = {
                value: value,
                employee: id,
            }
            return {
                ...state,
            }
        });
    }

    handleChangeNumberInfo = async (e) => {
        let value = parseInt(e.target.value);
        let name = e.target.name;
        await this.setState(state => {
            state.info[`${name}`] = {
                value: value,
                code: name,
                type: 'Number'
            }
            return {
                ...state,
                errorOnNumberInfo: this.validateNumberInfo(value)
            }
        })
        await this.handleChangeAutoPoint();
    }

    handleChangeTextInfo = async (e) => {
        let value = e.target.value;
        let name = e.target.name;
        await this.setState(state => {
            state.info[`${name}`] = {
                value: value,
                code: name,
                type: 'Text'
            }
            return {
                ...state,
                errorOnTextInfo: this.validateTextInfo(value)
            }
        })
    }

    handleInfoDateChange = (value, code) => {
        this.setState(state => {
            state.info[`${code}`] = {
                value: value,
                code: code,
                type: 'Date'
            }
            return {
                ...state,
                errorOnInfoDate: this.validateDate(value),
            }
        });
    }


    handleInfoBooleanChange = (event) => {
        let { name, value } = event.target;
        this.setState(state => {
            state.info[`${name}`] = {
                value: value,
                code: name,
                type: 'Boolean'
            }
            return {
                ...state,
            }
        });
    }

    validateDate = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let msg = undefined;
        if (value.trim() === "") {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }

        return msg;
    }

    validateTextInfo = (value) => {
        let { translate } = this.props;
        let msg = undefined;
        if (value === "") {
            msg = translate('task.task_perform.modal_approve_task.err_empty')
        }
        return msg;
    }

    validatePoint = (value) => {
        let { translate } = this.props;
        let msg = undefined;
        if (value < 0 || value > 100) {
            msg = translate('task.task_perform.modal_approve_task.err_range');
        }
        if (isNaN(value)) {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }
        return msg;
    }

    validateNumberInfo = (value) => {
        let { translate } = this.props;
        let msg = undefined;

        if (isNaN(value)) {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }
        return msg;
    }


    validateInfoBoolean = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let msg = undefined;
        if (value.indexOf("") !== -1) {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }

        return msg;
    }



    handleSetOfValueChange = async (value, code) => {
        this.setState(state => {
            state.info[`${code}`] = {
                value: value,
                code: code,
                type: 'SetOfValues'
            }
            return {
                ...state,
            }
        });
    }

    handleChangeSaveInfo = async (e) => {
        let { checked } = e.target;
        await this.setState(state => {
            return {
                ...state,
                checkSave: checked,
            }
        });
    }

    handleStatusChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                status: value
            }
        });
    }

    handleDateChange = (value) => {
        let data = this.getData(value);

        let automaticPoint = data.automaticPoint;
        let taskInfo = {
            task: data.task,
            progress: data.progress,
            date: value,
            info: data.info,
        };

        automaticPoint = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo);
        if (isNaN(automaticPoint)) automaticPoint = undefined

        this.setState(state => {
            return {
                ...state,
                errorOnDate: this.validateDate(value),
                date: value,
                info: data.info,
                results: data.results,
                status: data.statusOptions,
                empPoint: data.empPoint,
                autoPoint: automaticPoint,
                task: data.task,
                userId: data.userId,
                progress: data.progress,
                oldAutoPoint: data.automaticPoint,
                checkSave: data.checkSave,
            }
        });

    }
    validateDate = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let msg = undefined;
        if (value.trim() === "") {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }

        return msg;
    }

    isFormValidated = () => {
        const { errorOnDate, errorOnPoint, errorOnAccountablePoint, errorOnAccountableContribution, errorOnMyPoint,
            errorOnProgress, errorOnInfoDate, errorOnInfoBoolean, errorOnNumberInfo, errorOnTextInfo } = this.state;
        var { info } = this.state;

        var check = true;
        for (let i in info) {
            if (info[i].value === undefined) {
                check = false;
                break;
            }
        }
        return (errorOnDate === undefined && errorOnPoint === undefined && errorOnProgress === undefined
            && errorOnInfoDate === undefined && errorOnAccountablePoint === undefined
            && errorOnAccountableContribution === undefined && errorOnMyPoint === undefined
            && errorOnInfoBoolean === undefined && errorOnNumberInfo === undefined && errorOnTextInfo === undefined) ? true : false;
    }

    handleShowAutomaticPointInfo = async () => {
        await this.setState(state => {
            return {
                ...state,
                showAutoPointInfo: 1
            }
        });
        window.$(`#modal-automatic-point-info`).modal('show');

    }

    formatRole = (data) => {
        const { translate } = this.props;
        if (data === "Consulted") return translate('task.task_management.consulted');
        if (data === "Accountable") return translate('task.task_management.accountable');
        if (data === "Responsible") return translate('task.task_management.responsible');
    }

    handleAddTaskLog = () => {
        let title = '';
        let description = '';

        let { date, autoPoint, progress, status, results } = this.state;

        if (date !== currentTask.date ||
            autoPoint !== currentTask.automaticPoint ||
            status !== currentTask.statusOptions ||
            JSON.stringify(results) !== JSON.stringify(currentTask.results)
        ) {
            title = title + 'Chỉnh sửa thông tin đánh giá theo vai trò người thực hiện';

            if (date !== currentTask.date) {
                description = description + 'Ngày đánh giá mới: ' + date;
            }

            if (JSON.stringify(results) !== JSON.stringify(currentTask.results)) {
                let inactiveEmp = currentTask.task.inactiveEmployees.map(e => e._id);

                for (let i in currentTask.task.responsibleEmployees) {
                    if (inactiveEmp.indexOf(currentTask.task.responsibleEmployees[i]._id) === -1) {
                        if (results[`approvedPointResponsible${currentTask.task.responsibleEmployees[i]._id}`].value !== currentTask.results[`approvedPointResponsible${currentTask.task.responsibleEmployees[i]._id}`].value) {
                            description = description === '' ? description + `Điểm đánh giá mới cho ${currentTask.task.responsibleEmployees[i].name}: ` + results[`approvedPointResponsible${currentTask.task.responsibleEmployees[i]._id}`].value : description + '. ' + `Điểm đánh giá mới cho ${currentTask.task.responsibleEmployees[i].name}: ` + results[`approvedPointResponsible${currentTask.task.responsibleEmployees[i]._id}`].value;
                        }

                        if (results[`contributeResponsible${currentTask.task.responsibleEmployees[i]._id}`].value !== currentTask.results[`contributeResponsible${currentTask.task.responsibleEmployees[i]._id}`].value) {
                            description = description === '' ? description + `% đóng góp mới cho ${currentTask.task.responsibleEmployees[i].name}: ` + results[`contributeResponsible${currentTask.task.responsibleEmployees[i]._id}`].value : description + '. ' + `% đóng góp mới cho ${currentTask.task.responsibleEmployees[i].name}: ` + results[`contributeResponsible${currentTask.task.responsibleEmployees[i]._id}`].value;
                        }
                    }
                }

                for (let i in currentTask.task.consultedEmployees) {
                    if (inactiveEmp.indexOf(currentTask.task.consultedEmployees[i]._id) === -1) {
                        if (results[`approvedPointConsulted${currentTask.task.consultedEmployees[i]._id}`].value !== currentTask.results[`approvedPointConsulted${currentTask.task.consultedEmployees[i]._id}`].value) {
                            description = description === '' ? description + `Điểm đánh giá mới cho ${currentTask.task.consultedEmployees[i].name}: ` + results[`approvedPointConsulted${currentTask.task.consultedEmployees[i]._id}`].value : description + '. ' + `Điểm đánh giá mới cho ${currentTask.task.consultedEmployees[i].name}: ` + results[`approvedPointConsulted${currentTask.task.consultedEmployees[i]._id}`].value;
                        }

                        if (results[`approvedPointConsulted${currentTask.task.consultedEmployees[i]._id}`].value !== currentTask.results[`approvedPointConsulted${currentTask.task.consultedEmployees[i]._id}`].value) {
                            description = description === '' ? description + `% đóng góp mới cho ${currentTask.task.consultedEmployees[i].name}: ` + results[`approvedPointConsulted${currentTask.task.consultedEmployees[i]._id}`].value : description + '. ' + `% đóng góp mới cho ${currentTask.task.consultedEmployees[i].name}: ` + results[`approvedPointConsulted${currentTask.task.consultedEmployees[i]._id}`].value;
                        }
                    }
                }

                for (let i in currentTask.task.accountableEmployees) {
                    if (inactiveEmp.indexOf(currentTask.task.accountableEmployees[i]._id) === -1) {
                        if (results[`approvedPoint${currentTask.task.accountableEmployees[i]._id}`].value !== currentTask.results[`approvedPoint${currentTask.task.accountableEmployees[i]._id}`].value) {
                            description = description === '' ? description + `Điểm đánh giá mới cho ${currentTask.task.accountableEmployees[i].name}: ` + results[`approvedPoint${currentTask.task.accountableEmployees[i]._id}`].value : description + '. ' + `Điểm đánh giá mới cho ${currentTask.task.accountableEmployees[i].name}: ` + results[`approvedPoint${currentTask.task.accountableEmployees[i]._id}`].value;
                        }

                        if (results[`approvedPoint${currentTask.task.consultedEmployees[i]._id}`].value !== currentTask.results[`approvedPoint${currentTask.task.consultedEmployees[i]._id}`].value) {
                            description = description === '' ? description + `% đóng góp mới cho ${currentTask.task.accountableEmployees[i].name}: ` + results[`approvedPoint${currentTask.task.accountableEmployees[i]._id}`].value : description + '. ' + `% đóng góp mới cho ${currentTask.task.accountableEmployees[i].name}: ` + results[`approvedPoint${currentTask.task.accountableEmployees[i]._id}`].value;
                        }
                    }
                }
            }

            if (autoPoint !== currentTask.automaticPoint) {
                description = description === '' ? description + 'Điểm chấm tự động mới: ' + autoPoint : description + '. ' + 'Điểm chấm tự động mới: ' + autoPoint;
            }

            if (status !== currentTask.statusOptions) {
                description = description === '' ? description + 'Trạng thái công việc mới: ' + status : description + '. ' + 'Trạng thái công việc mới: ' + status;
            }
        }

        if (currentTask.task.progress !== progress) {
            title = title === '' ? title + 'Chỉnh sửa thông tin công việc' : title + '. ' + 'Chỉnh sửa thông tin công việc';
            description = description === '' ? description + 'Mức độ hoàn thành mới: ' + progress + "%" : description + '. ' + 'Mức độ hoàn thành mới: ' + progress + "%";
        }

        if (title !== '' || description !== '') {
            this.props.addTaskLog({
                createdAt: Date.now(),
                creator: getStorage("userId"),
                title: title,
                description: description,
            }, this.state.task._id)
        }

    }

    save = () => {
        let taskId;
        taskId = this.state.task._id;
        let data = {
            user: getStorage("userId"),
            progress: this.state.progress,
            automaticPoint: this.state.autoPoint !== 0 ? this.state.autoPoint : parseInt(this.state.progress),
            role: "Accountable",
            status: this.state.status,

            date: this.state.date,

            info: this.state.info,
            results: this.state.results,
            checkSave: this.state.checkSave,
        }

        this.handleAddTaskLog();

        this.props.evaluateTaskByAccountableEmployees(data, taskId);
    }

    checkNote = () => {
        let { date } = this.props;
        let splitter = date.split("-");
        let isoDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        let now = new Date();

        if (now.getMonth() === isoDate.getMonth() && now.getFullYear() === isoDate.getFullYear()) {
            return false;
        }
        return true
    }

    render() {
        const { translate } = this.props;
        const { task, date, status, oldAutoPoint, autoPoint, errorOnDate, showAutoPointInfo, dentaDate, prevDate } = this.state;

        let taskActions = task.taskActions;
        let splitter = date.split('-');
        let evaluationsDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        let actionsNotRating = taskActions.filter(item => (
            item.rating === -1 &&
            new Date(item.createdAt).getMonth() === evaluationsDate.getMonth()
            && new Date(item.createdAt).getFullYear() === evaluationsDate.getFullYear()
        ))

        let statusArr = [
            { value: "Inprocess", text: translate('task.task_management.inprocess') },
            { value: "WaitForApproval", text: translate('task.task_management.wait_for_approval') },
            { value: "Finished", text: translate('task.task_management.finished') },
            { value: "Delayed", text: translate('task.task_management.delayed') },
            { value: "Canceled", text: translate('task.task_management.canceled') }
        ];

        let checkNoteMonth;
        checkNoteMonth = this.checkNote();

        return (
            <React.Fragment>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {/* <div style={{ justifyContent: "flex-end", display: "flex" }}>
                        <button style={{ marginRight: "5px" }} className="btn btn-primary" onClick={this.updateInfo}>{`Lấy thông tin`}</button>
                        <button className="btn btn-success" onClick={this.save}>{`Lưu đánh giá`}</button>
                    </div> */}
                    <div className="row">
                        <div className='col-md-8'>
                            {checkNoteMonth && (dentaDate <= 7 && dentaDate > 0) && <p style={{ color: "red" }}>Bạn còn {8 - dentaDate} ngày để chỉnh sửa đánh giá.</p>}
                            {checkNoteMonth && (dentaDate > 7) && <p style={{ color: "red" }}>Bạn không thể chỉnh sửa đánh giá nữa vì đã quá 7 ngày sau lần đánh giá cuối cùng.</p>}
                        </div>
                        {!(checkNoteMonth && (dentaDate > 7)) &&
                            <div style={{ justifyContent: "flex-end", display: "flex" }} className='col-md-4'>
                                <button style={{ marginRight: "5px" }} className="btn btn-primary" onClick={this.updateInfo}>{`Lấy thông tin`}</button>
                                <button className="btn btn-success" onClick={this.save}>{`Lưu đánh giá`}</button>
                            </div>
                        }
                    </div>
                    <div>

                        <form id="form-evaluate-task-by-accountable">
                            <div className="row">
                                <div className="col-md-6">
                                    <strong>Đánh giá từ ngày: </strong> <br />&nbsp;{prevDate}
                                </div>
                                <div className={`form-group col-md-6 ${errorOnDate === undefined ? "" : "has-error"}`}>
                                    <label>{translate('task.task_management.evaluate_date')}:<span className="text-red">*</span></label>
                                    <DatePicker
                                        id={`create_date_${this.props.perform}-${this.props.id}`}
                                        value={date}
                                        onChange={this.handleDateChange}
                                    />
                                    <ErrorLabel content={errorOnDate} />
                                </div>
                            </div>
                            {
                                (this.props.perform === "stop") &&
                                <div className="form-group">
                                    <label>{translate('task.task_management.detail_status')}:</label>
                                    {
                                        <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                            id={`select-priority-task-${this.props.perform}-${this.props.role}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={statusArr}
                                            onChange={this.handleStatusChange}
                                            multiple={false}
                                            value={status}
                                        />
                                    }
                                </div>
                            }

                            <div>
                                <TaskInformationForm
                                    task={task && task}

                                    handleChangeProgress={this.handleChangeProgress}
                                    handleInfoBooleanChange={this.handleInfoBooleanChange}
                                    handleInfoDateChange={this.handleInfoDateChange}
                                    handleSetOfValueChange={this.handleSetOfValueChange}
                                    handleChangeNumberInfo={this.handleChangeNumberInfo}
                                    handleChangeTextInfo={this.handleChangeTextInfo}
                                    handleChangeSaveInfo={this.handleChangeSaveInfo}

                                    role={this.props.role}
                                    perform={this.props.perform}
                                    id={this.props.id}
                                    value={this.state}
                                />

                            </div>
                            <div>
                                <strong>{translate('task.task_management.detail_auto_point')}: &nbsp;
                            <a style={{ cursor: "pointer" }} id={`autoPoint-${this.props.perform}`} onClick={() => this.handleShowAutomaticPointInfo()}>
                                        {autoPoint !== undefined ? autoPoint : translate('task.task_management.detail_not_calc_auto_point')}
                                    </a>
                                </strong>
                                <br />
                                <br />
                                <strong>{translate('task.task_management.detail_auto_on_system')}: &nbsp;
                            <a style={{ color: "black" }}>
                                        {oldAutoPoint ? oldAutoPoint : translate('task.task_management.detail_not_auto_on_system')}
                                    </a>
                                </strong>
                                <br />
                                <br />
                                <strong>{translate('task.task_management.action_not_rating')}: &nbsp; </strong>
                                <ul>
                                    {actionsNotRating.length === 0 ? <li>{translate('task.task_management.no_action')}</li> :
                                        actionsNotRating.map((item, key) => {
                                            return <li key={key}>
                                                {item.description}
                                            </li>
                                        })
                                    }
                                </ul>

                                {
                                    showAutoPointInfo === 1 &&
                                    <ModalShowAutoPointInfo
                                        task={this.state.task}
                                        progress={this.state.progress}
                                        date={this.state.date}
                                        info={this.state.info}
                                        autoPoint={autoPoint}
                                    />
                                }
                                <br />
                                <strong>{translate('task.task_management.evaluate_member')}: </strong>
                                <br />
                                <br />
                                {
                                    <table className="table table-striped table-hover">
                                        <tr>
                                            <th>{translate('task.task_management.name_employee')}</th>
                                            <th>{translate('task.task_management.role_employee')}</th>
                                            <th>{translate('task.task_management.detail_emp_point')}</th>
                                            <th>% {translate('task.task_management.contribution')}</th>
                                            <th>{translate('task.task_management.acc_evaluate')}</th>
                                        </tr>

                                        {
                                            task && task.responsibleEmployees.map((item, index) =>
                                                (task.inactiveEmployees.indexOf(item._id) === -1 &&
                                                    <tr key={index}>
                                                        <td>{item.name}</td>
                                                        <td>{this.formatRole('Responsible')}</td>
                                                        <td>{this.state.empPoint[`responsible${item._id}`] ? this.state.empPoint[`responsible${item._id}`] : translate('task.task_management.not_eval')}</td>
                                                        <td style={{ padding: 5 }}>
                                                            <input className="form-control"
                                                                value={this.state.results[`contributeResponsible${item._id}`]?.value ? this.state.results[`contributeResponsible${item._id}`].value : ''}
                                                                type="number" name={`contributeResponsible${item._id}`} placeholder={"%" + translate('task.task_management.contribution')}
                                                                onChange={(e) => this.handleChangeResponsibleContribution(e, item._id)}
                                                            />
                                                        </td>
                                                        <td style={{ padding: 5 }}>
                                                            <input className="form-control" type="number"
                                                                value={this.state.results[`approvedPointResponsible${item._id}`]?.value ? this.state.results[`approvedPointResponsible${item._id}`].value : ''}
                                                                name={`approvedPointResponsible${item._id}`} placeholder={translate('task.task_management.detail_acc_point')}
                                                                onChange={(e) => this.handleChangeApprovedPointForResponsible(e, item._id)}
                                                            />
                                                        </td>
                                                    </tr>
                                                )

                                            )
                                        }
                                        {
                                            task && task.consultedEmployees.map((item, index) =>
                                                (task.inactiveEmployees.indexOf(item._id) === -1 &&
                                                    <tr key={index}>
                                                        <td>{item.name}</td>
                                                        <td>{this.formatRole('Consulted')}</td>
                                                        <td>{this.state.empPoint[`consulted${item._id}`] ? this.state.empPoint[`consulted${item._id}`] : translate('task.task_management.not_eval')}</td>
                                                        <td style={{ padding: 5 }}>
                                                            <input className="form-control" type="number"
                                                                value={this.state.results[`contributeConsulted${item._id}`]?.value ? this.state.results[`contributeConsulted${item._id}`].value : ''}
                                                                name={`contributeConsulted${item._id}`} placeholder={"%" + translate('task.task_management.contribution')}
                                                                onChange={(e) => this.handleChangeConsultedContribution(e, item._id)}
                                                            />
                                                        </td>
                                                        <td style={{ padding: 5 }}>
                                                            <input className={`form-control`} type="number"
                                                                value={this.state.results[`approvedPointConsulted${item._id}`]?.value ? this.state.results[`approvedPointConsulted${item._id}`].value : ''}
                                                                name={`approvedPointConsulted${item._id}`} placeholder={translate('task.task_management.detail_acc_point')}
                                                                onChange={(e) => this.handleChangeApprovedPointForConsulted(e, item._id)}
                                                            />
                                                        </td>
                                                    </tr>
                                                )

                                            )
                                        }
                                        {
                                            task && task.accountableEmployees.map((item, index) =>
                                                (task.inactiveEmployees.indexOf(item._id) === -1 &&
                                                    <tr key={index}>
                                                        <td>{item.name}</td>
                                                        <td>{this.formatRole('Accountable')}</td>
                                                        <td><p id={`accountablePoint${item._id}`}>{this.state.empPoint[`accountable${item._id}`] ? this.state.empPoint[`accountable${item._id}`] : translate('task.task_management.not_eval')}</p></td>
                                                        <td style={{ padding: 5 }}>
                                                            <input className="form-control" type="number"
                                                                value={this.state.results[`contributeAccountable${item._id}`]?.value ? this.state.results[`contributeAccountable${item._id}`].value : ''}
                                                                name={`contributeAccountable${item._id}`} placeholder={"%" + translate('task.task_management.contribution')}
                                                                onChange={(e) => this.handleChangeAccountableContribution(e, item._id)}
                                                            />
                                                        </td>
                                                        <td style={{ padding: 5 }}>
                                                            <input className="form-control" type="number"
                                                                value={this.state.results[`approvedPoint${item._id}`]?.value ? this.state.results[`approvedPoint${item._id}`].value : ''}
                                                                name={`approvedPoint${item._id}`} placeholder={translate('task.task_management.detail_acc_point')}
                                                                onChange={(e) => this.handleChangeAccountablePoint(e, item._id)}
                                                            />
                                                        </td>
                                                    </tr>
                                                )

                                            )
                                        }
                                    </table>
                                }
                            </div>
                        </form>

                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapState = (state) => {
    const { tasks, performtasks } = state;
    return { tasks, performtasks };
}
const getState = {
    addTaskLog: performTaskAction.addTaskLog,
    evaluateTaskByAccountableEmployees: performTaskAction.evaluateTaskByAccountableEmployees,
}

const evaluateByAccountableEmployee = connect(mapState, getState)(withTranslate(EvaluateByAccountableEmployee));
export { evaluateByAccountableEmployee as EvaluateByAccountableEmployee }
