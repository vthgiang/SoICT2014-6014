import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../common-components/index';
import { performTaskAction } from '../redux/actions';
import { managerKpiActions } from '../../../kpi/employee/management/redux/actions';
import { TaskInformationForm } from './taskInformationForm';
import { AutomaticTaskPointCalculator } from './automaticTaskPointCalculator';
import { ModalShowAutoPointInfo } from './modalShowAutoPointInfo';
import { getStorage } from '../../../../config';
import moment from 'moment'

var currentTask;
// var indexReRender = 0;
class EvaluateByResponsibleEmployee extends Component {
    constructor(props) {

        super(props);
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };

        // let date = this.formatDate(new Date());
        let { date, evaluation, id } = this.props;
        let data = this.getData(date);

        this.state = {
            errorInfo: {},
            id: id,
            calcInfo: {},
            task: data.task,
            idUser: data.idUser,
            info: data.info,
            autoPoint: data.calcAuto,
            oldAutoPoint: data.autoPoint,
            date: data.date,
            kpi: data.kpi,
            point: data.point,
            progress: data.progress,
            checkSave: data.checkSave,
            prevDate: data.prevDate,
            dentaDate: data.dentaDate,
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE,
            indexReRender: 0,
        }

        currentTask = data;
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
                errorInfo: {},
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        let { task, idUser, dataStatus } = this.state;
        if (nextProps.id !== this.state.id) {
            let department = task.organizationalUnit._id;
            let date = nextProps.date;
            let data = this.getData(date);
            this.props.getAllKpiSetsOrganizationalUnitByMonth(idUser, department, date);

            this.setState(state => {
                return {
                    ...state,
                    // errorInfo: {},
                    // errorOnProgress: undefined,
                    id: nextProps.id,
                    task: data.task,
                    info: data.info,
                    autoPoint: data.calcAuto,
                    oldAutoPoint: data.autoPoint,
                    date: date,
                    kpi: data.kpi,
                    point: data.point,
                    progress: data.progress,
                    checkSave: data.checkSave,
                    prevDate: data.prevDate,
                    dentaDate: data.dentaDate,
                    indexReRender: state.indexReRender + 1,
                }
            });
            return false;
        }

        // if(dataStatus === this.DATA_STATUS.QUERYING){
        //     this.setState(state=>{
        //         return {
        //             ...state,
        //             dataStatus: this.DATA_STATUS.FINISHED,
        //         }
        //     });
        //     return true;
        // }
        return true;
    }

    //  Hàm xử lý dữ liệu khởi tạo
    getData = (dateParam) => {
        let idUser = getStorage("userId");
        let checkSave = false;
        let { task } = this.props;
        let date = dateParam;
        let prevDate = this.formatDate(task.startDate);
        let dentaDate = 0;
        let evaluation, prevEval;

        let splitter = dateParam.split("-");
        let dateOfEval = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        let dateOfPrevEval = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        var newMonth = dateOfPrevEval.getMonth() - 1;
        if (newMonth < 0) {
            newMonth += 12;
            dateOfPrevEval.setYear(dateOfPrevEval.getYear() - 1);
        }
        dateOfPrevEval.setMonth(newMonth);

        let monthOfEval = dateOfEval.getMonth();
        let monthOfPrevEval = dateOfPrevEval.getMonth();
        let yearOfEval = dateOfEval.getFullYear();
        let yearOfPrevEval = dateOfPrevEval.getFullYear();

        evaluation = task.evaluations.find(e => (monthOfEval === new Date(e.date).getMonth() && yearOfEval === new Date(e.date).getFullYear()));

        prevEval = task.evaluations.find(e => ((monthOfPrevEval) === new Date(e.date).getMonth() && yearOfPrevEval === new Date(e.date).getFullYear()));
        if (prevEval) {
            prevDate = this.formatDate(prevEval.date);
        }
        let automaticPoint = (evaluation && evaluation.results.length !== 0) ? evaluation.results[0].automaticPoint : undefined;

        // let date = this.formatDate(new Date());
        // if (this.props.perform === "stop") {
        //     date = this.formatDate(new Date());
        // }
        // else if (this.props.perform === "evaluate") {
        //     date = moment().endOf("month").format('DD-MM-YYYY');
        // }

        let point = undefined;
        let info = {};
        let cloneKpi = [];

        let infoTask = task.taskInformations;
        for (let i in infoTask) {
            if (infoTask[i].type === "Date") {
                if (infoTask[i].value) {
                    info[`${infoTask[i].code}`] = {
                        // value: undefined,
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
                        // value: undefined,
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
                        // value: undefined,
                        code: infoTask[i].code,
                        type: infoTask[i].type
                    }
                }
            }
        }

        // let progress = task.progress;
        let progress;
        if (evaluation) {
            progress = evaluation.progress;
            if (evaluation.results.length !== 0) {
                let res = evaluation.results.find(e => (String(e.employee._id) === String(idUser) && String(e.role) === "Responsible"));
                if (res) point = res.employeePoint ? res.employeePoint : undefined;
            }
            let infoEval = evaluation.taskInformations;
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
                        else if (!infoEval[i].filledByAccountableEmployeesOnly) {
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
                        else if (!infoEval[i].filledByAccountableEmployeesOnly) {
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
            //         date = this.formatDate(evaluation.date);
            //     }
            //     else date = this.formatDate(new Date());
            // }
            // else if (this.props.perform === "evaluate") {

            //     date = this.formatDate(evaluation.date);

            // }

            let tmp = evaluation.kpis.find(e => (String(e.employee._id) === String(idUser)));
            if (tmp) {
                let kpi = tmp.kpis;

                for (let i in kpi) {
                    cloneKpi.push(kpi[i]._id);
                }
            }
        }

        let taskInfo = {
            task: task,
            progress: progress,
            date: date,
            info: info,
        };

        let calcAuto = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo);
        if (isNaN(calcAuto)) calcAuto = undefined
        if (calcAuto < 0) calcAuto = 0;

        dentaDate = Math.round(((new Date()).getTime() - dateOfEval.getTime()) / (1000 * 3600 * 24));
        console.log('denta', dentaDate);

        return {
            task: task,
            idUser: idUser,
            kpi: cloneKpi,
            info: info,
            autoPoint: automaticPoint,
            point: point,
            date: date,
            progress: progress,
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
        if (calcAuto < 0) calcAuto = 0;

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
        // indexReRender = indexReRender + 1;
        let data = this.getInfo(this.state.date);
        await this.setState(state => {
            return {
                ...state,

                info: data.info,
                autoPoint: data.calcAuto,
                oldAutoPoint: data.autoPoint,
                progress: data.progress,
                checkSave: data.checkSave,
                indexReRender: state.indexReRender + 1,
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

    componentDidMount() {
        let { task, idUser } = this.state;
        let { date } = this.props;
        let department = task.organizationalUnit._id;

        this.props.getAllKpiSetsOrganizationalUnitByMonth(idUser, department, date);
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

    handleKpiChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                kpi: value
            }
        });
    }

    handleDateChange = (value) => {
        // indexReRender = indexReRender + 1;
        let { translate } = this.props; 
        let { idUser, task } = this.state;

        let endOfMonth = new moment().endOf("month").toDate();
        let startOfMonth = new moment().startOf("month").toDate();
        
        let startDate = new Date(task.startDate);
        let endDate = new Date(task.endDate);

        let splitter = value.split('-');
        let dateValue = new Date(splitter[2], splitter[1]-1, splitter[0]);

        let de = (endOfMonth.getTime() - dateValue.getTime()); // < 0 -> err
        let ds = (dateValue.getTime() - startOfMonth.getTime()); // < 0 -> err

        let dst = (dateValue.getTime() - startDate.getTime()); // < 0 -> err
        let det = (endDate.getTime() - dateValue.getTime()); // < 0 -> err

        let err;
        if (value.trim() === "") {
            err = translate('task.task_perform.modal_approve_task.err_empty');
        }
        else if (dst < 0) {
            err = translate('task.task_management.err_eval_start');
        }
        else if (de < 0 || ds < 0){
            err = translate('task.task_management.err_eval_on_month');
        }

        let data = this.getData(value);
        this.props.getAllKpiSetsOrganizationalUnitByMonth(idUser, task.organizationalUnit._id, value);

        let automaticPoint = data.autoPoint;
        let taskInfo = {
            task: data.task,
            progress: this.state.progress,
            date: value,
            info: this.state.info,
        };

        automaticPoint = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo);
        if (isNaN(automaticPoint)) automaticPoint = undefined
        if (automaticPoint < 0) automaticPoint = 0;

        this.setState(state => {
            return {
                ...state,
                date: value,
                // info: data.info,
                // kpi: data.kpi,
                autoPoint: automaticPoint,
                // point: data.point,
                oldAutoPoint: data.autoPoint,
                // progress: data.progress,
                // checkSave: data.checkSave,
                errorOnDate: err,
                // errorInfo: {},
                // errorOnProgress: undefined,
                indexReRender: state.indexReRender + 1,
            }
        });
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

    handleChangeNumberInfo = async (e) => {
        let value = parseInt(e.target.value);
        let name = e.target.name;
        await this.setState(state => {
            state.info[`${name}`] = {
                value: value,
                code: name,
                type: 'Number'
            }
            state.errorInfo[name] = this.validateNumberInfo(value);
            return {
                ...state,
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
            state.errorInfo[name] = this.validateTextInfo(value);
            return {
                ...state,
            }
        })
    }

    handleInfoDateChange = (value, code) => {
        console.log('value', value);
        this.setState(state => {
            state.info[`${code}`] = {
                value: value,
                code: code,
                type: 'Date'
            }
            state.errorInfo[code] = this.validateDate(value);
            return {
                ...state,
            }
        });
    }

    handleSetOfValueChange = async (value, code) => {
        console.log('value', value);

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


    validateInfoBoolean = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let msg = undefined;
        if (value.indexOf("") !== -1) {
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

    validateNumberInfo = (value) => {
        let { translate } = this.props;
        let msg = undefined;

        if (isNaN(value)) {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }
        return msg;
    }

    validateDate = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let msg = undefined;
        if (value.trim() === "") {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
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

    isFormValidated = () => {
        const { errorOnDate, errorOnPoint, errorOnProgress, errorOnInfoDate, errorOnTextInfo, errorOnNumberInfo } = this.state;
        var { info } = this.state;

        var check = true;
        for (let i in info) {
            if (info[i].value === undefined) {
                check = false;
                break;
            }
        }
        return (errorOnDate === undefined && errorOnPoint === undefined && errorOnProgress === undefined
            && errorOnInfoDate === undefined && errorOnTextInfo === undefined && errorOnNumberInfo === undefined) ? true : false;
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

    handleShowAutomaticPointInfo = async () => {
        await this.setState(state => {
            return {
                ...state,
                showAutoPointInfo: 1
            }
        });
        window.$(`#modal-automatic-point-info`).modal('show');
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

    formatRole = (data) => {
        const { translate } = this.props;
        if (data === "Consulted") return translate('task.task_management.consulted');
        if (data === "Accountable") return translate('task.task_management.accountable');
        if (data === "Responsible") return translate('task.task_management.responsible');
    }

    handleAddTaskLog = () => {
        let title = '';
        let description = '';

        let { date, kpi, progress, autoPoint, point } = this.state;

        if (date !== currentTask.date ||
            JSON.stringify(kpi) !== JSON.stringify(currentTask.kpi) ||
            autoPoint !== currentTask.autoPoint ||
            point !== currentTask.point
        ) {
            title = title + 'Chỉnh sửa thông tin đánh giá theo vai trò người thực hiện';

            if (date !== currentTask.date) {
                description = description + 'Ngày đánh giá mới: ' + date;
            }

            if (JSON.stringify(kpi) !== JSON.stringify(currentTask.kpi)) {
                const { KPIPersonalManager } = this.props;
                let listKpi = [];
                if (KPIPersonalManager && KPIPersonalManager.kpiSets) listKpi = KPIPersonalManager.kpiSets.kpis;

                let newKpi = [];
                for (const element of kpi) {
                    let a = listKpi.filter(item => item._id === element);
                    newKpi.push(a[0].name);
                }

                description = description === '' ? description + 'Liên kết tới các KPI mới: ' + JSON.stringify(newKpi) : description + '. ' + 'Liên kết tới các KPI mới: ' + JSON.stringify(newKpi);
            }

            if (autoPoint !== currentTask.autoPoint) {
                description = description === '' ? description + 'Điểm chấm tự động mới: ' + autoPoint : description + '. ' + 'Điểm chấm tự động mới: ' + autoPoint;
            }

            if (point !== currentTask.point) {
                description = description === '' ? description + 'Điểm tự đánh giá mới: ' + point : description + '. ' + 'Điểm tự đánh giá mới: ' + point;
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

    save = async () => {
        let taskId;
        taskId = this.state.task._id;
        let data = {
            user: getStorage("userId"),
            progress: this.state.progress,
            automaticPoint: this.state.autoPoint,
            employeePoint: this.state.point,
            role: "Responsible",

            kpi: this.state.kpi ? this.state.kpi : [],
            date: this.state.date,
            info: this.state.info,
            checkSave: this.state.checkSave,
        }

        console.log('data', data, taskId);
        this.props.evaluateTaskByResponsibleEmployees(data, taskId);

        this.handleAddTaskLog();

        this.setState(state=>{
            return {
                ...state,
                oldAutoPoint: state.autoPoint,
            }
        });
    }

//  kiểm tra có phải đánh giá này là của tháng hiện tại hay ko
    checkNote = () => {
        let { date } = this.props;
        let splitter = date.split("-");
        let isoDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        let now = new Date ();

        if(now.getMonth() === isoDate.getMonth() && now.getFullYear() === isoDate.getFullYear()) {
            return false; // là tháng hiện tại
        }
        return true // khác tháng hiện tại
    }

    checkNullUndefined = (x) => {
        if( x === null || x === undefined ) {
            return false;
        }
        else return true;
    }

    render() {
        const { translate, KPIPersonalManager } = this.props;
        const { progress, info, task, point, oldAutoPoint, autoPoint, date, kpi, showAutoPointInfo, dentaDate, prevDate, indexReRender } = this.state;
        const { errorOnDate, errorOnPoint } = this.state;
        const { role, id, perform } = this.props;

        let listKpi = [];
        if (KPIPersonalManager && KPIPersonalManager.kpiSets) listKpi = KPIPersonalManager.kpiSets.kpis;

        let taskActions = task.taskActions;
        let splitter = date.split('-');
        let evaluationsDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        let actionsNotRating = taskActions.filter(item => (
            item.rating === -1 &&
            new Date(item.createdAt).getMonth() === evaluationsDate.getMonth()
            && new Date(item.createdAt).getFullYear() === evaluationsDate.getFullYear()
        ))

        let checkNoteMonth;
        checkNoteMonth = this.checkNote();

        let disabled = false;
        if (checkNoteMonth && (dentaDate > 7)) {
            disabled = true;
        }

        let disableSubmit = !this.isFormValidated();

        return (
            <React.Fragment>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div>
                        {/* Thông báo về thời gian đánh giá */}
                        <div>
                            {checkNoteMonth && (dentaDate <= 7 && dentaDate > 0) && <p style={{color: "red"}}>{translate('task.task_management.note_eval')}{8 - dentaDate}.</p>}
                            {checkNoteMonth && (dentaDate > 7) && <p style={{color: "red"}}>{translate('task.task_management.note_not_eval')}</p>}
                        </div>

                        {/* Nút lưu */}
                        {!(checkNoteMonth && (dentaDate > 7)) &&
                        <div className="pull-right">
                            {/* <button disabled={disabled} style={{ marginRight: "5px" }} className="btn btn-primary" onClick={this.updateInfo}>{translate('task.task_management.btn_get_info')}</button> */}
                            <button disabled={disabled || disableSubmit} className="btn btn-success" onClick={this.save}>{translate('task.task_management.btn_save_eval')}</button>
                        </div>
                        }
                    </div>

                    
                    <div>
                        {/* Đánh giá từ ngày ... đến ngày ... */}
                        <form id={`form-evaluate-task-by-${role}`}>
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('task.task_management.detail_general_info')}</legend>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>{translate('task.task_management.eval_from')}</label>
                                            <DatePicker
                                                id={`start_date_${id}_${perform}`}
                                                value={prevDate}
                                                disabled={true}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className={`form-group ${errorOnDate === undefined ? "" : "has-error"}`}>
                                            <label>{translate('task.task_management.eval_to')}:<span className="text-red">*</span></label>
                                            <DatePicker
                                                id={`create_date_${id}_${perform}`}
                                                value={date}
                                                onChange={this.handleDateChange}
                                                disabled={disabled} 
                                                // || (checkNoteMonth && (dentaDate <= 20 && dentaDate > 0))
                                            />
                                            <ErrorLabel content={errorOnDate} />
                                        </div>
                                    </div>
                                </div>

                                {/* Liên kết KPI */}
                                <div className="form-group">
                                    <label>{translate('task.task_management.detail_kpi')}:</label>
                                    {
                                        <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                            id={`select-kpi-personal-evaluate-${perform}-${role}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={((KPIPersonalManager && KPIPersonalManager.kpiSets) ? KPIPersonalManager.kpiSets.kpis : []).map(x => { return { value: x._id, text: x.name } })}
                                            onChange={this.handleKpiChange}
                                            multiple={true}
                                            value={kpi}
                                            disabled={disabled} 
                                        />
                                    }
                                </div>

                                {/* Điểm tự đánh giá */}
                                <div className={`form-group ${errorOnPoint === undefined ? "" : "has-error"}`}>
                                    <label>{translate('task.task_management.detail_emp_point')} (<span style={{ color: "red" }}>*</span>)</label>
                                    <input
                                        className="form-control"
                                        type="number"
                                        name="point"
                                        placeholder={translate('task.task_management.enter_emp_point')}
                                        onChange={this.handleChangePoint}
                                        value={this.checkNullUndefined(point) ? point : ''}
                                        disabled={disabled}
                                    />
                                    <ErrorLabel content={errorOnPoint} />
                                </div>
                            </fieldset>

                            {/* Thông tin công việc */}
                            <div>
                                <TaskInformationForm
                                    legendText={translate('task.task_management.info_eval_month')}
                                    task={task && task}

                                    handleChangeProgress={this.handleChangeProgress}
                                    handleInfoBooleanChange={this.handleInfoBooleanChange}
                                    handleInfoDateChange={this.handleInfoDateChange}
                                    handleSetOfValueChange={this.handleSetOfValueChange}
                                    handleChangeNumberInfo={this.handleChangeNumberInfo}
                                    handleChangeTextInfo={this.handleChangeTextInfo}
                                    handleChangeSaveInfo={this.handleChangeSaveInfo}
                                    updateInfo={this.updateInfo}

                                    indexReRender={indexReRender}

                                    disabled={disabled} 
                                    role={role}
                                    perform={perform}
                                    id={id}
                                    value={this.state}
                                />
                            </div>

                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('task.task_management.auto_point_field')}</legend>
                                <div style={{lineHeight: "3"}}>
                                    <div>
                                        <strong>{translate('task.task_management.detail_auto_point')}: &nbsp;</strong>
                                        <a style={{ cursor: "pointer" }} id={`autoPoint-${perform}`} onClick={() => this.handleShowAutomaticPointInfo()}>
                                            {this.checkNullUndefined(autoPoint) ? autoPoint : translate('task.task_management.detail_not_calc_auto_point')}
                                        </a>
                                    </div>
                                    <div>
                                        <strong>{translate('task.task_management.detail_auto_on_system')}: &nbsp;</strong>
                                        <a style={{ color: "black" }}>
                                            {this.checkNullUndefined(oldAutoPoint) ? oldAutoPoint : translate('task.task_management.detail_not_calc_auto_point')}
                                        </a>
                                    </div>
                                    <div>
                                        <strong>{translate('task.task_management.action_not_rating')}:&nbsp;&nbsp;</strong>
                                        {actionsNotRating.length === 0 ? translate('task.task_management.no_action') :
                                            actionsNotRating.length === 1 ? translate('task.task_management.no_action') :
                                                actionsNotRating.map((item, index) => {
                                                    let seperator = index !== 0 ? ", " : "";
                                                    return <span key={index}>
                                                        {seperator}&nbsp;&nbsp;({index + 1}) {item.description}
                                                    </span>
                                                })
                                        }
                                    </div>
                                </div>
                                {
                                    showAutoPointInfo === 1 &&
                                    <ModalShowAutoPointInfo
                                        task={task}
                                        progress={progress}
                                        date={date}
                                        info={info}
                                        autoPoint={autoPoint}
                                    />
                                }
                            </fieldset>
                        </form>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapState = (state) => {
    const { tasks, performtasks, kpimembers, KPIPersonalManager } = state;
    return { tasks, performtasks, kpimembers, KPIPersonalManager };
}
const getState = {
    getAllKpiSetsOrganizationalUnitByMonth: managerKpiActions.getAllKpiSetsOrganizationalUnitByMonth,
    evaluateTaskByResponsibleEmployees: performTaskAction.evaluateTaskByResponsibleEmployees,
    addTaskLog: performTaskAction.addTaskLog,
}

const evaluateByResponsibleEmployee = connect(mapState, getState)(withTranslate(EvaluateByResponsibleEmployee));
export { evaluateByResponsibleEmployee as EvaluateByResponsibleEmployee }
