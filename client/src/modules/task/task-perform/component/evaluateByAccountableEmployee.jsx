import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { getStorage } from '../../../../config';
import { ErrorLabel, DatePicker, SelectBox, QuillEditor, TimePicker } from '../../../../common-components/index';
import { performTaskAction } from '../redux/actions';
import { managerKpiActions } from '../../../kpi/employee/management/redux/actions';
import { TaskInformationForm } from './taskInformationForm';
import { AutomaticTaskPointCalculator } from './automaticTaskPointCalculator';
import { ModalShowAutoPointInfo } from './modalShowAutoPointInfo';
import moment from 'moment';
import Swal from 'sweetalert2';

var currentTask;

class EvaluateByAccountableEmployee extends Component {
    constructor(props) {
        super(props);

        let { date, id, isEval } = this.props;
        let data = this.getData(date);
        currentTask = data;
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };

        this.state = {
            // id: id,
            isEval: isEval,
            errorInfo: {},
            errorApprovedPoint: {},
            errorContribute: {},
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
            startDate: data.startDate,
            endDate: data.endDate,
            startTime: data.startTime,
            endTime: data.endTime,
            evaluatingMonth: data.evaluatingMonth,
            storedEvaluatingMonth: data.storedEvaluatingMonth,
            checkSave: data.checkSave,
            prevDate: data.prevDate,
            dentaDate: data.dentaDate,
            indexReRender: 0,
            hasAccountable: data.hasAccountable,
            evaluation: data.evaluation,

            kpi: data.kpi,
            unit: data.unit,
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE,
        }
    }

    componentDidMount() {
        let { userId, unit } = this.state;
        let { date } = this.props;
        let defaultDepartment = unit;

        this.props.getAllKpiSetsOrganizationalUnitByMonth(userId, defaultDepartment, date);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                // id: nextProps.id,

                errorOnStartDate: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
                errorOnEndDate: undefined,
                errorOnMonth: undefined,
                errorOnPoint: undefined,
                errorOnProgress: undefined,
                errorInfo: {},
                errorApprovedPoint: {},
                errorContribute: {},
                errSumContribution: undefined,
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
            let { task, userId, unit } = this.state;
            let department = unit;
            let date = nextProps.date;
            this.props.getAllKpiSetsOrganizationalUnitByMonth(userId, department, date);
            let data = this.getData(date);

            this.setState(state => {
                return {
                    ...state,
                    id: nextProps.id,
                    isEval: nextProps.isEval,
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
                    startTime: data.startTime,
                    endTime: data.endTime,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    evaluatingMonth: data.evaluatingMonth,
                    storedEvaluatingMonth: data.storedEvaluatingMonth,
                    checkSave: data.checkSave,
                    prevDate: data.prevDate,
                    dentaDate: data.dentaDate,
                    errorOnProgress: undefined,
                    indexReRender: state.indexReRender + 1,

                    kpi: data.kpi,
                    unit: data.unit,

                    dataStatus: this.DATA_STATUS.QUERYING,
                    evaluation: data.evaluation,
                }
            });
            return false;
        }
        if (this.state.dataStatus === this.DATA_STATUS.QUERYING) {
            if (!(nextProps.KPIPersonalManager && nextProps.KPIPersonalManager.kpiSets)) {
                return true;
            } else {
                let date = nextProps.date;
                let data = this.getData(date);
                console.log('quangdzuyen\n\n\n', nextProps.KPIPersonalManager.kpiSets, data);
                this.setState(state => {
                    return {
                        ...state,
                        kpi: data.kpi,
                        dataStatus: this.DATA_STATUS.FINISHED,
                    }
                });
                return false;
            }
        }
        return true;
    }

    handleSortMonthEval = (evaluations) => {
        // sắp xếp đánh giá theo thứ tự tháng
        const sortedEvaluations = evaluations?.sort((a, b) => new Date(b.evaluatingMonth) - new Date(a.evaluatingMonth));
        return sortedEvaluations;
    }

    getPreviousEvaluation = (task, date) => {
        let evaluations = task.evaluations;
        let sortedEvaluations = this.handleSortMonthEval(evaluations);

        let evalMonth = moment(date, 'DD-MM-YYYY').endOf("month").toDate();
        for(let i in sortedEvaluations){
            let eva = sortedEvaluations[i];
            console.log('new Date(eva?.evaluatingMonth) < evalMonth', new Date(eva?.evaluatingMonth) < evalMonth, new Date(eva?.evaluatingMonth) , evalMonth);
            if(new Date(eva?.evaluatingMonth) <= evalMonth) {
                return eva;
            }
        }
        return null;
    } 

    /**
     * Hàm xử lý dữ liệu khởi tạo
     *  @dateParam : để truyền vào thông tin ngày đánh giá. khi khởi tạo thì đang cho giá trị storedEvaluateMonth = endDate nên chỉ cần truyền vào 1 tham số này
     *  @evaluatingMonth : giá trị tháng đánh giá. Truyền vào khi thay đổi tháng đánh giá, hoặc thay đổi ngày đánh giá lần này (endDate)
     * */
    getData = (dateParam, evaluatingMonthParam) => {
        const { user, KPIPersonalManager } = this.props;
        let { task, hasAccountable } = this.props;
        let idUser = getStorage("userId");
        let checkSave = false;
        let date = dateParam;
        let endDate = dateParam;
        let startDateTask = task.startDate;
        let prevDate = this.formatDate(startDateTask);

        let startTime = this.formatTime(new Date(startDateTask));
        let endTime = this.formatTime(new Date());

        let dentaDate = 0;
        let evaluations, prevEval;

        let splitter = dateParam.split("-");
        if (evaluatingMonthParam) {
            splitter = evaluatingMonthParam.split("-");
            console.log('splitter', splitter);
        }

        let evaluatingMonth = `${splitter[1]}-${splitter[2]}`;
        let storedEvaluatingMonth = moment(evaluatingMonth, 'MM-YYYY').endOf("month").format('DD-MM-YYYY')
        let dateOfEval = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        let dateOfPrevEval = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        var newMonth = dateOfPrevEval.getMonth() - 1;
        if (newMonth < 0) {
            newMonth += 12;
            dateOfPrevEval.setYear(dateOfPrevEval.getFullYear() - 1);
        }
        dateOfPrevEval.setDate(15);
        dateOfPrevEval.setMonth(newMonth);

        let monthOfEval = dateOfEval.getMonth();
        let monthOfPrevEval = dateOfPrevEval.getMonth();
        let yearOfEval = dateOfEval.getFullYear();
        let yearOfPrevEval = dateOfPrevEval.getFullYear();

        evaluations = task.evaluations.find(e => (monthOfEval === new Date(e.evaluatingMonth).getMonth() && yearOfEval === new Date(e.evaluatingMonth).getFullYear()));
        // prevEval = task.evaluations.find(e => ((monthOfPrevEval) === new Date(e.evaluatingMonth).getMonth() && yearOfPrevEval === new Date(e.evaluatingMonth).getFullYear()));
        prevEval = this.getPreviousEvaluation(task, dateParam);
        if (prevEval) {
            prevDate = this.formatDate(prevEval.endDate);
            startTime = this.formatTime(prevEval.endDate);
        } 
        // else {
        //     let strPrevMonth = `${monthOfPrevEval + 1}-${yearOfPrevEval}`
        //     // trong TH k có đánh giá tháng trước, so sánh tháng trước với tháng start date
        //     if (!((yearOfPrevEval === new Date(startDateTask).getFullYear() && monthOfPrevEval < new Date(startDateTask).getMonth()) // bắt đầu tháng bất kì khác tháng 1
        //         || (yearOfPrevEval < new Date(startDateTask).getFullYear()) // TH bắt đầu là tháng 1 - chọn đánh giá tháng 1
        //     )) {
        //         prevDate = moment(strPrevMonth, 'MM-YYYY').endOf("month").format('DD-MM-YYYY');
        //         startTime = "12:00 AM";
        //     }
        // }
        let automaticPoint = (evaluations && evaluations.results.length !== 0) ? evaluations.results[0].automaticPoint : undefined;
        let progress = evaluations ? evaluations.progress : 0;

        let unit;
        if (user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
            unit = user.organizationalUnitsOfUser[0]._id;
        }
        let cloneKpi = []
        if (hasAccountable === true && KPIPersonalManager && KPIPersonalManager.kpiSets) {
            cloneKpi = (KPIPersonalManager.kpiSets.kpis.filter(e => (e.type === 1)).map(x => { return x._id }));
        }

        let info = {};

        let infoEval = task.taskInformations;
        for (let i in infoEval) {

            if (infoEval[i].type === "set_of_values") {
                let splitSetOfValues = infoEval[i].extra.split('\n');
                info[`${infoEval[i].code}`] = {
                    value: [splitSetOfValues[0]],
                    code: infoEval[i].code,
                    type: infoEval[i].type
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
                    role: "responsible",
                    target: "Point"
                }
                results[`contributeResponsible${task.responsibleEmployees[i]._id}`] = {
                    value: undefined,
                    employee: task.responsibleEmployees[i]._id,
                    role: "responsible",
                    target: "Contribution"
                }
            }
        }
        for (let i in task.consultedEmployees) {
            if (inactiveEmp.indexOf(task.consultedEmployees[i]._id) === -1) {
                results[`approvedPointConsulted${task.consultedEmployees[i]._id}`] = {
                    value: undefined,
                    employee: task.consultedEmployees[i]._id,
                    role: "consulted",
                    target: "Point"
                }
                results[`contributeConsulted${task.consultedEmployees[i]._id}`] = {
                    value: undefined,
                    employee: task.consultedEmployees[i]._id,
                    role: "consulted",
                    target: "Contribution"
                }
            }
        }
        for (let i in task.accountableEmployees) {
            if (inactiveEmp.indexOf(task.accountableEmployees[i]._id) === -1) {
                results[`approvedPoint${task.accountableEmployees[i]._id}`] = {
                    value: undefined,
                    employee: task.accountableEmployees[i]._id,
                    role: "accountable",
                    target: "Point"
                }
                results[`contributeAccountable${task.accountableEmployees[i]._id}`] = {
                    value: undefined,
                    employee: task.accountableEmployees[i]._id,
                    role: "accountable",
                    target: "Contribution"
                }
            }
        }

        if (evaluations) {
            if (evaluations.results.length !== 0) {
                let role = "accountable";
                if (!hasAccountable) {
                    role = "responsible";
                }

                let tmp = evaluations.results.find(e => (String(e.employee._id) === String(idUser) && String(e.role) === role));
                if (tmp) {
                    if (tmp.organizationalUnit) {
                        unit = tmp.organizationalUnit._id;
                    };
                    let kpi = tmp.kpis;
                    cloneKpi = [];
                    for (let i in kpi) {
                        cloneKpi.push(kpi[i]._id);
                    }
                }


                let listResult = evaluations.results;
                for (let i in listResult) {
                    if (listResult[i].role === "responsible") {
                        empPoint[`responsible${listResult[i].employee._id}`] = listResult[i].employeePoint ? listResult[i].employeePoint : undefined;
                        results[`approvedPointResponsible${listResult[i].employee._id}`] = {
                            value: listResult[i].approvedPoint ? listResult[i].approvedPoint : undefined,
                            employee: listResult[i].employee._id,
                            role: "responsible",
                            target: "Point"
                        }
                        results[`contributeResponsible${listResult[i].employee._id}`] = {
                            value: listResult[i].contribution ? listResult[i].contribution : undefined,
                            employee: listResult[i].employee._id,
                            role: "responsible",
                            target: "Contribution"
                        }
                    }
                    else if (listResult[i].role === "consulted") {
                        empPoint[`consulted${listResult[i].employee._id}`] = listResult[i].employeePoint ? listResult[i].employeePoint : undefined;
                        results[`approvedPointConsulted${listResult[i].employee._id}`] = {
                            value: listResult[i].approvedPoint ? listResult[i].approvedPoint : undefined,
                            employee: listResult[i].employee._id,
                            role: "consulted",
                            target: "Point"
                        }
                        results[`contributeConsulted${listResult[i].employee._id}`] = {
                            value: listResult[i].contribution ? listResult[i].contribution : undefined,
                            employee: listResult[i].employee._id,
                            role: "consulted",
                            target: "Contribution"
                        }
                    }
                    else if (listResult[i].role === "accountable") {
                        empPoint[`accountable${listResult[i].employee._id}`] = listResult[i].employeePoint ? listResult[i].employeePoint : undefined;
                        results[`approvedPoint${listResult[i].employee._id}`] = {
                            value: listResult[i].approvedPoint ? listResult[i].approvedPoint : undefined,
                            employee: listResult[i].employee._id,
                            role: "accountable",
                            target: "Point"
                        }
                        results[`contributeAccountable${listResult[i].employee._id}`] = {
                            value: listResult[i].contribution ? listResult[i].contribution : undefined,
                            employee: listResult[i].employee._id,
                            role: "accountable",
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

                    if (infoEval[i].type === "date") {
                        if (infoEval[i].value) {
                            info[`${infoEval[i].code}`] = {
                                value: this.formatDate(infoEval[i].value),
                                code: infoEval[i].code,
                                type: infoEval[i].type
                            }
                        }
                        else {
                            info[`${infoEval[i].code}`] = {
                                // value: this.formatDate(Date.now()),
                                code: infoEval[i].code,
                                type: infoEval[i].type
                            }
                        }
                    }
                    else if (infoEval[i].type === "set_of_values") {
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

        let startDate = prevDate;
        if (evaluations) {
            endDate = this.formatDate(evaluations.endDate);
            startDate = this.formatDate(evaluations.startDate);
            startTime = this.formatTime(evaluations.startDate);
            endTime = this.formatTime(evaluations.endDate);
        }

        let taskInfo = {
            task: task,
            progress: progress,
            date: date,
            time: endTime,
            info: info,
        };

        let calcAuto = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo);
        if (isNaN(calcAuto)) calcAuto = undefined;
        if (calcAuto < 0) calcAuto = 0;

        dentaDate = Math.round(((new Date()).getTime() - dateOfEval.getTime()) / (1000 * 3600 * 24));

        return {
            info: info,
            date: date,
            startDate: startDate,
            endDate: endDate,
            startTime: startTime,
            endTime: endTime,
            evaluatingMonth: evaluatingMonth,
            storedEvaluatingMonth: storedEvaluatingMonth,
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
            unit: unit,
            kpi: cloneKpi,
            hasAccountable: hasAccountable,
            evaluation: evaluations,
        }
    }

    // hàm lấy thông tin từ thông tin công việc hiện tại
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

        evaluation = task.evaluations.find(e => (monthOfEval === new Date(e.evaluatingMonth).getMonth() && yearOfEval === new Date(e.evaluatingMonth).getFullYear()));
        let automaticPoint = (evaluation && evaluation.results.length !== 0) ? evaluation.results[0].automaticPoint : undefined;
        let infoTask = task.taskInformations;

        for (let i in infoTask) {
            if (infoTask[i].type === "date") {
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
            else if (infoTask[i].type === "set_of_values") {
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
            date: this.state.endDate,
            time: this.state.endTime,
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
        let data = this.getInfo(this.state.storedEvaluatingMonth);
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

    // hàm cập nhật điểm tự đánh giá
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

    // hàm cập nhật progress
    handleChangeProgress = async (e) => {
        let { translate } = this.props;
        let msg;
        let value = parseInt(e.target.value);
        if (value < 0 || value > 100) {
            msg = translate('task.task_perform.modal_approve_task.err_range');
        }
        await this.setState(state => {
            return {
                ...state,
                progress: value,
                errorOnProgress: msg,
            }
        })
        await this.handleChangeAutoPoint();
    }

    // hàm tính điểm tự dộng
    calcAutomaticPoint = () => {
        let taskInfo = {
            task: this.state.task,
            progress: this.state.progress,
            date: this.state.endDate,
            time: this.state.endTime,
            info: this.state.info,
        };

        let automaticPoint = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo);
        if (isNaN(automaticPoint)) automaticPoint = undefined

        return automaticPoint;
    }

    // hàm cập nhật điểm tự động
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

    validateEvaluateContribute = (value) => {
        let { translate } = this.props;
        let msg = undefined;
        let sum = this.calcSumContribution();
        if (value < 0 || value > 100) {
            msg = translate('task.task_perform.modal_approve_task.err_range');
        }
        return msg;
    }

    validateSumContribute = () => {
        let { translate } = this.props;
        let msg = undefined;
        let res = this.calcSumContribution();
        console.log('res', res);
        if (res.sum > 100) {
            msg = translate('task.task_perform.modal_approve_task.err_contribute');
        }
        else if (res.checkAllEvalContribution && res.sum < 100) {
            msg = translate('task.task_perform.modal_approve_task.err_not_enough_contribute');
            // msg = "ko đủ 100 %"
        }
        return msg;
    }

    // hàm tính tổng phần trăm đóng góp hiện tại ->> để validate
    calcSumContribution = () => {
        let { results, task } = this.state;
        let sum = 0;
        let numOfContributor = 0;
        let checkAllEvalContribution = false;

        let numOfMember = 0;
        numOfMember = task.accountableEmployees.length + task.responsibleEmployees.length + task.consultedEmployees.length;

        for (let i in results) {
            if (results[i].target === "Contribution") {
                if (results[i].value) {
                    sum = sum + results[i].value;
                    numOfContributor = numOfContributor + 1;
                }
            }
        }

        if (numOfContributor === numOfMember) {
            checkAllEvalContribution = true;
        }

        return { sum, checkAllEvalContribution };
    }

    // begin: các hàm cập nhật đóng góp và điểm phê duyệt
    handleChangeAccountablePoint = async (e, id) => {
        let value = parseInt(e.target.value);
        let name = e.target.name
        await this.setState(state => {
            state.results[`${name}`] = {
                value: value,
                employee: id,
                role: "accountable",
                target: "Point"
            }
            if (id === state.userId) state.empPoint[`accountable${id}`] = value;
            state.errorApprovedPoint[`accountable${id}`] = this.validateEvaluateResult(value);
            return {
                ...state,
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
                role: "accountable",
                target: "Contribution"
            }
            state.errorContribute[`accountable${id}`] = this.validateEvaluateContribute(value);
            return {
                ...state,
                errSumContribution: this.validateSumContribute(),
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
                role: "responsible",
                target: "Point"
            }
            if (this.props.hasAccountable === false && id === state.userId) state.empPoint[`responsible${id}`] = value;
            state.errorApprovedPoint[`responsible${id}`] = this.validateEvaluateResult(value);
            return {
                ...state,
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
                role: "responsible",
                target: "Contribution"
            }
            state.errorContribute[`responsible${id}`] = this.validateEvaluateContribute(value);
            return {
                ...state,
                errSumContribution: this.validateSumContribute(),
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
                role: "consulted",
                target: "Point"
            }
            state.errorApprovedPoint[`consulted${id}`] = this.validateEvaluateResult(value);
            return {
                ...state,
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
                role: "consulted",
                target: "Contribution"
            }
            state.errorContribute[`consulted${id}`] = this.validateEvaluateContribute(value);
            return {
                ...state,
                errSumContribution: this.validateSumContribute(),
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
    // -->end

    // hàm cập nhật thông tin số
    handleChangeNumberInfo = async (e) => {
        let value = parseInt(e.target.value);
        let name = e.target.name;
        await this.setState(state => {
            state.info[`${name}`] = {
                value: value,
                code: name,
                type: 'number'
            }
            state.errorInfo[name] = this.validateNumberInfo(value);
            return {
                ...state,
            }
        })
        await this.handleChangeAutoPoint();
    }

    // hàm cập nhật ttin văn bản
    handleChangeTextInfo = async (e) => {
        let value = e.target.value;
        let name = e.target.name;
        await this.setState(state => {
            state.info[`${name}`] = {
                value: value,
                code: name,
                type: 'text'
            }
            state.errorInfo[name] = this.validateTextInfo(value);
            return {
                ...state,
            }
        })
    }


    // hàm validate thoogn tin ngày tháng
    handleInfoDateChange = (value, code) => {
        this.setState(state => {
            state.info[`${code}`] = {
                value: value,
                code: code,
                type: 'date'
            }
            state.errorInfo[code] = this.validateDate(value);
            return {
                ...state,
            }
        });
    }

    // hàm validate ttin boolean
    handleInfoBooleanChange = (event) => {
        let { name, value } = event.target;
        this.setState(state => {
            state.info[`${name}`] = {
                value: value,
                code: name,
                type: 'boolean'
            }
            return {
                ...state,
            }
        });
    }

    // hàm validate ngày tháng
    validateDate = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let msg = undefined;
        if (value.trim() === "") {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }

        return msg;
    }

    // hàm validate ttin van bản
    validateTextInfo = (value) => {
        let { translate } = this.props;
        let msg = undefined;
        if (value === "") {
            // msg = translate('task.task_perform.modal_approve_task.err_empty')
        }
        return msg;
    }

    // hàm validate số
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

    // hàm cập nhật ttin số
    validateNumberInfo = (value) => {
        let { translate } = this.props;
        let msg = undefined;

        if (isNaN(value)) {
            // msg = translate('task.task_perform.modal_approve_task.err_empty');
        }
        return msg;
    }


    validateInfoBoolean = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let msg = undefined;
        if (value.indexOf("") !== -1) {
            // msg = translate('task.task_perform.modal_approve_task.err_empty');
        }

        return msg;
    }


    // hàm cập nhật thông tin tập giá trị
    handleSetOfValueChange = async (value, code) => {
        console.log('valSet', value);
        this.setState(state => {
            state.info[`${code}`] = {
                value: value,
                code: code,
                type: 'set_of_values'
            }
            return {
                ...state,
            }
        });
    }

    // hàm cập nhật tùy chọn trạng thái lấy thông tin công việc
    handleChangeSaveInfo = async (e) => {
        let { checked } = e.target;
        await this.setState(state => {
            return {
                ...state,
                checkSave: checked,
            }
        });
    }

    // hàm cập nhật trạng thái
    handleStatusChange = (value) => {
        console.log('valStatus', value);
        this.setState(state => {
            return {
                ...state,
                status: value
            }
        });
    }


    // hàm thay đổi kpi
    handleKpiChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                kpi: value
            }
        });
    }

    // hàm cập nhật đơn vị
    handleChangeUnit = (value) => {
        this.setState(state => {
            return {
                ...state,
                unit: value[0],
                kpi: [],
            }
        });
        this.props.getAllKpiSetsOrganizationalUnitByMonth(this.state.userId, value[0], this.state.storedEvaluatingMonth);
    }

    // convert ISODate to String hh:mm AM/PM
    formatTime(date) {
        var d = new Date(date);
        let time = moment(d).format("hh:mm");
        let suffix = " AM";
        if (d.getHours() >= 12 && d.getHours() <= 23) {
            suffix = " PM";
        }
        return time + suffix;
    }

    validateDateTime = (evaluatingMonth, startDate, startTime, endDate, endTime, type) => {
        let { translate } = this.props;
        let { isEval, storedEvaluatingMonth, task } = this.state;

        // init data
        let msg;
        let endOfMonth = moment(evaluatingMonth, 'MM-YYYY').endOf("month").toDate();
        let startOfMonth = moment(evaluatingMonth, 'MM-YYYY').startOf("month").toDate();
        let monthOfEval = startOfMonth.getMonth();
        let yearOfEval = startOfMonth.getFullYear();

        // convert ISO date
        let startDateISO = this.convertDateTime(startDate, startTime);
        let endDateISO = this.convertDateTime(endDate, endTime);

        // tìm đánh giá tháng này
        let monthOfEvalStart = startDateISO.getMonth();
        let yearOfEvalStart = startDateISO.getFullYear();
        let monthOfEvalEnd = endDateISO.getMonth();
        let yearOfEvalEnd = endDateISO.getFullYear();
        let tmpStart = task.evaluations.find(e => (monthOfEvalStart === new Date(e.evaluatingMonth).getMonth() && yearOfEvalStart === new Date(e.evaluatingMonth).getFullYear()));
        let tmpEnd = task.evaluations.find(e => (monthOfEvalEnd === new Date(e.evaluatingMonth).getMonth() && yearOfEvalEnd === new Date(e.evaluatingMonth).getFullYear()));

        // kiểm tra sâu rỗng 
        if (startDate.trim() === "" || startTime.trim() === "" || endDate.trim() === "" || endTime.trim() === "") {
            msg = translate('task.task_management.add_err_empty_end_date');
        }
        // kiểm tra ngày bắt đầu so với ngày kết thúc
        else if (startDateISO > endDateISO) {
            msg = translate('task.task_management.add_err_end_date');
        }
        else if (type === "start") {
            // kiểm tra điều kiện trong tháng đánh giá
            if (startDateISO > endOfMonth) {
                console.log('startDateISO > endOfMonth');
                msg = 'Khoảng đánh giá phải chứa tháng đánh giá'
            }

            // kiểm tra ngày đánh giá so với các ngày khác
            else if (tmpStart) {
                if (!(monthOfEval === new Date(tmpStart.evaluatingMonth).getMonth() && yearOfEval === new Date(tmpStart.evaluatingMonth).getFullYear())) {
                    if (startDateISO < new Date(tmpStart.endDate)) {
                        msg = 'Ngày đánh giá tháng này không được đè lên ngày đánh giá của tháng khác';
                    }
                }
            }
        }
        else if (type === "end") {
            if (endDateISO < startOfMonth) {
                console.log('endDateISO < startOfMonth');
                msg = 'Khoảng đánh giá phải chứa tháng đánh giá'
            }

            // kiểm tra ngày đánh giá so với các ngày khác
            else if (tmpEnd) {
                if (!(monthOfEval === new Date(tmpEnd.evaluatingMonth).getMonth() && yearOfEval === new Date(tmpEnd.evaluatingMonth).getFullYear())) {
                    if (endDateISO > new Date(tmpEnd.startDate)) {
                        msg = 'Ngày đánh giá tháng này không được đè lên ngày đánh giá của tháng khác';
                    }
                }
            }
        }

        return msg;
    }

    // hàm cập nhật ngày đánh giá từ
    handleStartDateChange = (value) => {
        let { translate } = this.props;
        let { evaluatingMonth, endDate, startDate, endTime, startTime } = this.state;

        let err = this.validateDateTime(evaluatingMonth, value, startTime, endDate, endTime, "start");

        this.setState(state => {
            return {
                ...state,
                startDate: value,
                errorOnStartDate: err,
                indexReRender: state.indexReRender + 1,
            }
        });
    }

    // hàm cập nhật ngày đánh giá hiện tại
    handleEndDateChange = (value) => {
        let { translate } = this.props;

        let { evaluatingMonth, endDate, startDate, endTime, startTime, userId } = this.state;

        let err = this.validateDateTime(evaluatingMonth, startDate, startTime, value, endTime, "end");

        let data = this.getData(value, this.state.storedEvaluatingMonth);
        // this.props.getAllKpiSetsOrganizationalUnitByMonth(userId, unit, value);

        let automaticPoint = data.automaticPoint;
        let taskInfo = {
            task: data.task,
            progress: this.state.progress,
            date: value,
            time: this.state.endTime,
            info: this.state.info,
        };

        automaticPoint = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo);
        if (isNaN(automaticPoint)) automaticPoint = undefined
        if (automaticPoint < 0) automaticPoint = 0;

        this.setState(state => {
            return {
                ...state,
                errorOnEndDate: err,
                endDate: value,
                // empPoint: data.empPoint,
                autoPoint: automaticPoint,
                oldAutoPoint: data.automaticPoint,
                indexReRender: state.indexReRender + 1,
            }
        });

    }

    handleStartTimeChange = (value) => {
        let { translate } = this.props;
        let { evaluatingMonth, endDate, startDate, endTime, startTime } = this.state;

        let err = this.validateDateTime(evaluatingMonth, startDate, value, endDate, endTime, "start");

        this.setState(state => {
            return {
                ...state,
                startTime: value,
                errorOnStartDate: err,
            }
        });
    }

    handleEndTimeChange = (value) => {
        let { translate } = this.props;

        let { evaluatingMonth, endDate, startDate, endTime, startTime } = this.state;

        let err = this.validateDateTime(evaluatingMonth, startDate, startTime, endDate, value, "end");

        let data = this.getData(value, this.state.storedEvaluatingMonth);

        let automaticPoint = data.automaticPoint;
        let taskInfo = {
            task: data.task,
            progress: this.state.progress,
            date: this.state.endDate,
            time: value,
            info: this.state.info,
        };

        automaticPoint = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo);
        if (isNaN(automaticPoint)) automaticPoint = undefined
        if (automaticPoint < 0) automaticPoint = 0;

        this.setState(state => {
            return {
                ...state,
                endTime: value,
                autoPoint: automaticPoint,
                errorOnEndDate: err,
                oldAutoPoint: data.automaticPoint,
                indexReRender: state.indexReRender + 1,
            }
        });
    }

    convertDateTime = (date, time) => {
        let splitter = date.split("-");
        let strDateTime = `${splitter[2]}-${splitter[1]}-${splitter[0]} ${time}`;
        return new Date(strDateTime);
    }

    // hàm cập nhật tháng đánh giá
    handleMonthOfEvaluationChange = (value) => {
        // indexReRender = indexReRender + 1;
        let { translate } = this.props;
        let { userId, evaluatingMonth, task, endDate, startDate, endTime, startTime } = this.state;
        let evalDate = moment(value, 'MM-YYYY').endOf('month').format('DD-MM-YYYY');
        let err = this.validateDateTime(value, startDate, startTime, evalDate, endDate, "end");

        let startDateTask = new Date(task.startDate);
        let endDateTask = new Date(task.endDate);

        let splitter = evalDate.split('-');
        let dateValue = new Date(splitter[2], splitter[1] - 1, splitter[0]);

        // validate tháng đánh giá
        let errMonth;

        let monthOfEval = dateValue.getMonth();
        let yearOfEval = dateValue.getFullYear();

        let tmp = task.evaluations.find(e => (monthOfEval === new Date(e.evaluatingMonth).getMonth() && yearOfEval === new Date(e.evaluatingMonth).getFullYear()));

        if (tmp) {
            errMonth = "Tháng này đã có đánh giá";
        }
        // validate tháng đánh giá phải trong thời gian làm việc.
        // đưa về cùng ngày - giờ để so sánh tháng năm
        dateValue.setDate(15);
        startDateTask.setDate(15);
        endDateTask.setDate(15);
        dateValue.setHours(0);
        startDateTask.setHours(0);
        endDateTask.setHours(0);
        // tính hiệu giữa ngày đánh giá so với ngày bắt đầu và ngày kết thúc của công việc
        let dst2 = (dateValue.getTime() - startDateTask.getTime()); // < 0 -> err // denta start task
        let det2 = (endDateTask.getTime() - dateValue.getTime()); // < 0 -> err // denta end task

        if (dst2 < 0) {
            errMonth = "Tháng đánh giá phải lớn hơn hoặc bằng tháng bắt đầu";
        } else if (det2 < 0) {
            // errMonth = "Tháng đánh giá phải nhỏ hơn hoặc bằng tháng kết thúc";
        }

        let data = this.getData(evalDate, evalDate);
        this.props.getAllKpiSetsOrganizationalUnitByMonth(userId, this.state.unit, evalDate);

        let automaticPoint = data.automaticPoint;
        let taskInfo = {
            task: data.task,
            progress: this.state.progress,
            date: evalDate,
            time: this.state.endTime,
            info: this.state.info,
        };

        automaticPoint = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo);
        if (isNaN(automaticPoint)) automaticPoint = undefined
        if (automaticPoint < 0) automaticPoint = 0;

        this.setState(state => {
            return {
                ...state,
                kpi: [],
                evaluatingMonth: value,
                storedEvaluatingMonth: evalDate,
                endDate: evalDate,
                startDate: data.startDate,
                autoPoint: automaticPoint,
                oldAutoPoint: data.automaticPoint,
                empPoint: data.empPoint,
                errorOnDate: err,
                errorOnMonth: errMonth,
                indexReRender: state.indexReRender + 1,
            }
        });
        if (!errMonth) {
            this.props.handleChangeMonthEval({ evaluatingMonth: value, date: evalDate, id: this.state.id });
        }
    }

    getEndTask = async () => {
        let { task } = this.state;
        let end = task?.endDate;
        let endDate = this.formatDate(new Date(end));
        let endTime = this.formatTime(new Date(end));
        this.setState({ endDate: endDate, endTime:endTime });
    }

    validateDate = (value, willUpdateState = true) => {
        let { translate } = this.props;
        let msg = undefined;
        if (value.trim() === "") {
            // msg = translate('task.task_perform.modal_approve_task.err_empty');
        }

        return msg;
    }

    // hàm validate submit
    isFormValidated = () => {
        const { errorOnMonth, errorOnDate, errorOnEndDate, errorOnStartDate, errorOnPoint, errorOnAccountablePoint, errorOnAccountableContribution, errorOnMyPoint,
            errorOnProgress, errorOnInfoDate, errorOnInfoBoolean, errorOnNumberInfo, errorOnTextInfo, errorApprovedPoint, errorContribute, errSumContribution } = this.state;
        let { info, results, empPoint, progress, } = this.state;

        let checkErrorContribute = true;
        let checkErrorApprovedPoint = true;

        if (Object.keys(errorApprovedPoint).length === 0) {

        }
        for (let i in errorApprovedPoint) {
            if (errorApprovedPoint[i]) {
                checkErrorApprovedPoint = false;
                break;
            }
        }

        for (let i in errorContribute) {
            if (errorContribute[i]) {
                checkErrorContribute = false;
                break;
            }
        }

        return checkErrorApprovedPoint && checkErrorContribute && (errorOnStartDate === undefined && errorOnEndDate === undefined && errorOnMonth === undefined && errorOnDate === undefined && errorOnPoint === undefined
            && errorOnInfoDate === undefined && errorOnAccountablePoint === undefined && errorOnProgress === undefined
            && errorOnAccountableContribution === undefined && errorOnMyPoint === undefined && errSumContribution === undefined
            && errorOnInfoBoolean === undefined && errorOnNumberInfo === undefined && errorOnTextInfo === undefined) ? true : false;
    }

    // hàm hiển thị modal show autopoint
    handleShowAutomaticPointInfo = async () => {
        await this.setState(state => {
            return {
                ...state,
                showAutoPointInfo: 1
            }
        });
        window.$(`#modal-automatic-point-info`).modal('show');

    }

    // format vai trò multi language
    formatRole = (data) => {
        const { translate } = this.props;
        if (data === "consulted") return translate('task.task_management.consulted');
        if (data === "accountable") return translate('task.task_management.accountable');
        if (data === "responsible") return translate('task.task_management.responsible');
    }

    // hàm ghi lại lich sử đánh giá
    handleAddTaskLog = () => {
        let title = '';
        let description = '';

        let { endDate, autoPoint, progress, status, results } = this.state;

        if (endDate !== currentTask.endDate ||
            autoPoint !== currentTask.automaticPoint ||
            status !== currentTask.statusOptions ||
            JSON.stringify(results) !== JSON.stringify(currentTask.results)
        ) {
            title = title + 'Chỉnh sửa thông tin đánh giá theo vai trò người thực hiện';

            if (endDate !== currentTask.endDate) {
                description = description + 'Ngày đánh giá mới: ' + endDate;
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

                        if (results[`approvedPoint${currentTask.task.accountableEmployees[i]._id}`].value !== currentTask.results[`approvedPoint${currentTask.task.accountableEmployees[i]._id}`].value) {
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

    // format tháng
    formatMonth(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [month, year].join('-');
    }

    checkHasEval = (date, performtasks) => {
        let splitter = date.split("-");
        let dateOfEval = new Date(splitter[2], splitter[1] - 1, splitter[0]);

        let monthOfEval = dateOfEval.getMonth();
        let yearOfEval = dateOfEval.getFullYear();

        let taskId, evaluation;
        taskId = performtasks.task?._id;
        evaluation = performtasks.task?.evaluations.find(e => (monthOfEval === new Date(e.evaluatingMonth).getMonth() && yearOfEval === new Date(e.evaluatingMonth).getFullYear()));

        if (evaluation) return true;
        return false;
    }

    // hàm delete 
    deleteEval = async () => {
        let { translate, date, performtasks } = this.props;
        let { storedEvaluatingMonth } = this.state;
        Swal.fire({
            title: translate('task.task_management.delete_eval_title'),
            type: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: translate('general.yes'),
            cancelButtonText: translate('general.no'),
        }).then(async (res) => {
            if (res.value) {
                let splitter = storedEvaluatingMonth.split("-");
                let dateOfEval = new Date(splitter[2], splitter[1] - 1, splitter[0]);

                let monthOfEval = dateOfEval.getMonth();
                let yearOfEval = dateOfEval.getFullYear();

                // Xóa Evaluation
                let taskId, evaluation, evaluationId;
                taskId = performtasks.task?._id;
                evaluation = performtasks.task?.evaluations.find(e => (monthOfEval === new Date(e.evaluatingMonth).getMonth() && yearOfEval === new Date(e.evaluatingMonth).getFullYear()));
                evaluationId = evaluation?._id;

                await this.props.deleteEvaluation(taskId, evaluationId);
                this.props.addTaskLog({
                    createdAt: Date.now(),
                    creator: getStorage("userId"),
                    title: `Xóa đánh giá công việc tháng ${this.formatMonth(new Date())}`,
                    description: ``,
                }, taskId);
                this.props.handleChangeDataStatus(1); // 1 = DATA_STATUS.QUERYING
            }
        });
    }

    // hàm submit
    save = async () => {
        let taskId;
        taskId = this.state.task._id;
        let startDateTask = this.convertDateTime(this.state.startDate, this.state.startTime);
        let endDateTask = this.convertDateTime(this.state.endDate, this.state.endTime);
        let data = {
            user: getStorage("userId"),
            progress: this.state.progress,
            automaticPoint: this.state.autoPoint,
            role: "accountable",
            status: this.state.status,
            hasAccountable: this.state.hasAccountable,

            evaluatingMonth: this.state.storedEvaluatingMonth,
            // date: this.state.date,
            startDate: startDateTask,
            endDate: endDateTask,
            // startDate: this.state.startDate,
            // endDate: this.state.endDate,

            info: this.state.info,
            results: this.state.results,
            checkSave: this.state.checkSave,

            kpi: this.state.kpi,
            unit: this.state.unit,
        }

        await this.props.evaluateTaskByAccountableEmployees(data, taskId);

        this.handleAddTaskLog();

        this.setState(state => {
            return {
                ...state,
                oldAutoPoint: state.autoPoint,
            }
        });
        // this.props.handleChangeDataStatus(1); // 1 = DATA_STATUS.QUERYING
        this.props.handleChangeShowEval(this.state.id);
    }

    // hàm kiểm tra thông báo
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

    // hàm kiểm tra NULL, UNDEFINED
    checkNullUndefined = (x) => {
        if (x === null || x === undefined) {
            return false;
        }
        else return true;
    }

    render() {
        const { translate, user, KPIPersonalManager, performtasks } = this.props;
        const { isEval, startDate, endDate, endTime, startTime, storedEvaluatingMonth, evaluatingMonth, task, date, status, oldAutoPoint, autoPoint, errorOnDate, errorOnMonth, showAutoPointInfo, dentaDate, prevDate, info, results, empPoint, progress,
            errorInfo, errorOnStartDate, errorOnEndDate, errorApprovedPoint, errorContribute, errSumContribution, indexReRender, unit, kpi, evaluation } = this.state;
        const { id, perform, role, hasAccountable } = this.props;

        console.log('quang acc', this.state);
        let listKpi = [];
        if (KPIPersonalManager && KPIPersonalManager.kpiSets) {
            listKpi = KPIPersonalManager.kpiSets.kpis;
            console.log('quanydsd', listKpi);
        }
        console.log('listKPI', listKpi);

        let listUnits = [];
        if (user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
            listUnits = user.organizationalUnitsOfUser.map(x => { return { value: x._id, text: x.name } });
        }

        let taskActions = task.taskActions;
        let splitter = date.split('-');
        let evaluationsDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        let actionsNotRating = taskActions.filter(item => (
            item.rating === -1 &&
            new Date(item.createdAt).getMonth() === evaluationsDate.getMonth()
            && new Date(item.createdAt).getFullYear() === evaluationsDate.getFullYear()
        ))

        let statusArr = [
            { value: "inprocess", text: translate('task.task_management.inprocess') },
            { value: "wait_for_approval", text: translate('task.task_management.wait_for_approval') },
            { value: "finished", text: translate('task.task_management.finished') },
            { value: "delayed", text: translate('task.task_management.delayed') },
            { value: "canceled", text: translate('task.task_management.canceled') }
        ];

        let checkNoteMonth;
        // checkNoteMonth = this.checkNote();

        let disabled = false;
        // if (checkNoteMonth && (dentaDate > 7)) {
        //     disabled = true;
        // }
        let disableSubmit = !this.isFormValidated();

        return (
            <React.Fragment>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div>
                        {/* Thông báo về thời gian đánh giá */}
                        <div>
                            {checkNoteMonth && (dentaDate <= 7 && dentaDate > 0) && <p style={{ color: "red" }}>{translate('task.task_management.note_eval')}:&nbsp;&nbsp; {8 - dentaDate}</p>}
                            {checkNoteMonth && (dentaDate > 7) && <p style={{ color: "red" }}>{translate('task.task_management.note_not_eval')}</p>}
                        </div>
                        {/* Nút lưu */}
                        { // !(checkNoteMonth && (dentaDate > 7)) &&
                            <div className='pull-right'>
                                {/* disabled={disabled || disableSubmit} id !== 'new' && */}
                                {(this.checkHasEval(storedEvaluatingMonth, performtasks) && !errorOnMonth && role === "accountable") && <button style={{ marginRight: '5px' }} className="btn btn-danger" onClick={this.deleteEval}>{translate('task.task_management.delete_eval')}</button>}
                                <button disabled={disabled || disableSubmit} className="btn btn-success" onClick={this.save}>{translate('task.task_management.btn_save_eval')}</button>
                            </div>
                        }
                    </div>



                    <div className="body-evaluation" style={{ height: "calc(100vh - 186px)", overflow: "auto" }}>
                        {/* Đánh giá từ ngày ... đến ngày ... */}
                        <form id="form-evaluate-task-by-accountable">
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">{translate('task.task_management.detail_general_info')}</legend>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className={`form-group ${errorOnMonth === undefined ? "" : "has-error"}`}>
                                            <label>Tháng đánh giá<span className="text-red">*</span></label>
                                            <DatePicker
                                                id={`create_month_${id}_${perform}`}
                                                value={evaluatingMonth}
                                                onChange={this.handleMonthOfEvaluationChange}
                                                disabled={isEval}
                                                dateFormat={"month-year"}
                                            />
                                            <ErrorLabel content={errorOnMonth} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    {/* ngày đánh giá tháng trc hoặc ngày bắt đầu làm việc */}
                                    <div className="col-md-6">
                                        <div className={`form-group ${errorOnStartDate === undefined ? "" : "has-error"}`}>
                                            <label>{translate('task.task_management.eval_from')}<span className="text-red">*</span></label>
                                            <DatePicker
                                                id={`start_date_${id}_${perform}`}
                                                value={startDate}
                                                onChange={this.handleStartDateChange}
                                                disabled={disabled}
                                            />
                                            < TimePicker
                                                id={`time-picker-1-start-time-${id}-${perform}-${this.props.id}`}
                                                value={startTime}
                                                onChange={this.handleStartTimeChange}
                                            />
                                            <ErrorLabel content={errorOnStartDate} />
                                        </div>
                                    </div>
                                    {/* ngày đánh giá */}
                                    <div className={`form-group col-md-6 ${errorOnEndDate === undefined ? "" : "has-error"}`}>
                                        <label>
                                            {translate('task.task_management.eval_to')}<span className="text-red">*</span>
                                            <span className="pull-right" style={{ fontWeight: "normal", marginLeft: 10 }}>
                                                <a style={{ cursor: "pointer" }} onClick={() => this.getEndTask()}>Lấy thời điểm kết thúc công việc</a>
                                            </span>
                                        </label>
                                        <DatePicker
                                            id={`end_date_${perform}-${id}`}
                                            value={endDate}
                                            onChange={this.handleEndDateChange}
                                            disabled={disabled}
                                        />
                                        < TimePicker
                                            id={`time-picker-2-end-time-${id}-${perform}-${this.props.id}`}
                                            value={endTime}
                                            onChange={this.handleEndTimeChange}
                                        />
                                        <ErrorLabel content={errorOnEndDate} />
                                    </div>
                                </div>
                                {
                                    // Trạng thái công việc
                                    <div className="form-group">
                                        <label>{translate('task.task_management.detail_status')}</label>
                                        {
                                            <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                                id={`select-priority-task-${perform}-${role}`}
                                                className="form-control select2"
                                                style={{ width: "100%" }}
                                                items={statusArr}
                                                onChange={this.handleStatusChange}
                                                multiple={false}
                                                value={status[0]}
                                                disabled={disabled}
                                            />
                                        }
                                    </div>
                                }
                                {/* Đơn vị đánh giá */}
                                <div className="form-group">
                                    <label>{translate('task.task_management.unit_evaluate')}</label>
                                    {
                                        <SelectBox
                                            id={`select-organizational-unit-evaluate-${perform}-${role}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={listUnits}
                                            onChange={this.handleChangeUnit}
                                            multiple={false}
                                            value={unit}
                                            disabled={disabled}
                                        />
                                    }
                                </div>

                                {/* Liên kết KPI */}
                                <div className="form-group">
                                    <label>{translate('task.task_management.detail_kpi')}</label>
                                    {
                                        <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu -${indexReRender}
                                            id={`select-kpi-personal-evaluate-${perform}-${role}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={
                                                hasAccountable ? ((KPIPersonalManager && KPIPersonalManager.kpiSets) ?
                                                    (KPIPersonalManager.kpiSets.kpis.filter(e => (e.type === 1)).map(x => { return { value: x._id, text: x.name } }))
                                                    : []) :
                                                    ((KPIPersonalManager && KPIPersonalManager.kpiSets) ?
                                                        (KPIPersonalManager.kpiSets.kpis.filter(e => (e.type === 0)).map(x => { return { value: x._id, text: x.name } }))
                                                        : [])
                                            }
                                            onChange={this.handleKpiChange}
                                            multiple={true}
                                            value={kpi}
                                            disabled={disabled}
                                        />
                                    }
                                </div>
                            </fieldset>

                            {/* Thông tin đánh giá công việc */}
                            <div>
                                <TaskInformationForm
                                    legendText={translate('task.task_management.info_eval_month')}
                                    task={task && task}
                                    evaluationInfo={evaluation ? evaluation : task}

                                    handleChangeProgress={this.handleChangeProgress}
                                    handleInfoBooleanChange={this.handleInfoBooleanChange}
                                    handleInfoDateChange={this.handleInfoDateChange}
                                    handleSetOfValueChange={this.handleSetOfValueChange}
                                    handleChangeNumberInfo={this.handleChangeNumberInfo}
                                    handleChangeTextInfo={this.handleChangeTextInfo}
                                    handleChangeSaveInfo={this.handleChangeSaveInfo}
                                    updateInfo={this.updateInfo}

                                    indexReRender={indexReRender}

                                    role={role}
                                    perform={perform}
                                    id={id}
                                    value={this.state}
                                    disabled={disabled}
                                />

                            </div>


                            <div>
                                {/* Thông tin điểm tự động */}
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('task.task_management.auto_point_field')}</legend>
                                    <div style={{ lineHeight: "3" }}>
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
                                            {
                                                actionsNotRating.length === 0 ? translate('task.task_management.no_action') :
                                                    actionsNotRating.map((item, index) => (
                                                        <div>
                                                            <span key={index}>
                                                                ({index + 1})&nbsp;&nbsp;
                                                            <QuillEditor
                                                                    id={`evaluateByAccountable${item._id}`}
                                                                    quillValueDefault={item.description}
                                                                    isText={true}
                                                                />
                                                            </span>
                                                        </div>
                                                    ))
                                            }
                                        </div>
                                    </div>
                                    { // modal thông tin điểm tự động
                                        showAutoPointInfo === 1 &&
                                        <ModalShowAutoPointInfo
                                            task={task}
                                            progress={progress}
                                            date={endDate}
                                            info={info}
                                            time={endTime}
                                            autoPoint={autoPoint}
                                        />
                                    }
                                </fieldset>

                                {/* Phần chấm điểm phê duyệt */}
                                <fieldset className="scheduler-border">
                                    <legend className="scheduler-border">{translate('task.task_management.evaluate_member')}</legend>

                                    {
                                        <table className="table table-striped table-hover">
                                            <tr style={{ verticalAlign: "top" }}>
                                                <th><div className="form-group"><label>{translate('task.task_management.name_employee')}</label></div></th>
                                                <th><div className="form-group"><label>{translate('task.task_management.role_employee')}</label></div></th>
                                                <th><div className="form-group"><label>{translate('task.task_management.detail_emp_point')}</label></div></th>
                                                <th>
                                                    <label>% {translate('task.task_management.contribution')} (0 - 100)</label>
                                                    <div style={{ fontWeight: "normal" }} className={`form-group ${errSumContribution === undefined ? "" : "has-error"}`}>
                                                        <ErrorLabel content={errSumContribution ? errSumContribution : ''} />
                                                    </div>
                                                </th>
                                                <th><div className="form-group"><label>{translate('task.task_management.acc_evaluate')} (0 - 100)</label></div></th>
                                            </tr>

                                            { // Chấm điểm phê duyệt cho người thực hiện
                                                task && task.responsibleEmployees.map((item, index) =>
                                                (task.inactiveEmployees.indexOf(item._id) === -1 &&
                                                    <tr key={index} style={{ verticalAlign: "top" }}>
                                                        <td><div style={{ marginTop: 10 }}>{item.name}</div></td>
                                                        <td><div style={{ marginTop: 10 }}>{this.formatRole('responsible')}</div></td>
                                                        <td><div style={{ marginTop: 10 }}>{this.checkNullUndefined(empPoint[`responsible${item._id}`]) ? empPoint[`responsible${item._id}`] : translate('task.task_management.not_eval')}</div></td>
                                                        <td style={{ padding: 5 }}>
                                                            <div className={errorContribute[`responsible${item._id}`] === undefined ? "form-group" : "form-group has-error"}>
                                                                <input className='form-control'
                                                                    value={this.checkNullUndefined(results[`contributeResponsible${item._id}`]?.value) ? results[`contributeResponsible${item._id}`].value : ''}
                                                                    type="number" name={`contributeResponsible${item._id}`} placeholder={"% " + translate('task.task_management.contribution')}
                                                                    onChange={(e) => this.handleChangeResponsibleContribution(e, item._id)}
                                                                    disabled={disabled}
                                                                />
                                                                <ErrorLabel content={errorContribute ? errorContribute[`responsible${item._id}`] : ''} />
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: 5 }}>
                                                            <div className={errorApprovedPoint[`responsible${item._id}`] === undefined ? "form-group" : "form-group has-error"}>
                                                                <input className='form-control' type="number"
                                                                    value={this.checkNullUndefined(results[`approvedPointResponsible${item._id}`]?.value) ? results[`approvedPointResponsible${item._id}`].value : ''}
                                                                    name={`approvedPointResponsible${item._id}`} placeholder={translate('task.task_management.detail_acc_point')}
                                                                    onChange={(e) => this.handleChangeApprovedPointForResponsible(e, item._id)}
                                                                    disabled={disabled}
                                                                />
                                                                <ErrorLabel content={errorApprovedPoint ? errorApprovedPoint[`responsible${item._id}`] : ''} />
                                                            </div>

                                                        </td>
                                                    </tr>
                                                )

                                                )
                                            }
                                            { // Chấm điểm phê duyệt cho người tư vấn
                                                task && task.consultedEmployees.map((item, index) =>
                                                (task.inactiveEmployees.indexOf(item._id) === -1 &&
                                                    <tr key={index} style={{ verticalAlign: "top" }}>
                                                        <td><div style={{ marginTop: 10 }}>{item.name}</div></td>
                                                        <td><div style={{ marginTop: 10 }}>{this.formatRole('consulted')}</div></td>
                                                        <td><div style={{ marginTop: 10 }}>{this.checkNullUndefined(empPoint[`consulted${item._id}`]) ? empPoint[`consulted${item._id}`] : translate('task.task_management.not_eval')}</div></td>
                                                        <td style={{ padding: 5 }}>
                                                            <div className={errorContribute[`consulted${item._id}`] === undefined ? "form-group" : "form-group has-error"}>
                                                                <input className='form-control' type="number"
                                                                    value={this.checkNullUndefined(results[`contributeConsulted${item._id}`]?.value) ? results[`contributeConsulted${item._id}`].value : ''}
                                                                    name={`contributeConsulted${item._id}`} placeholder={"% " + translate('task.task_management.contribution')}
                                                                    onChange={(e) => this.handleChangeConsultedContribution(e, item._id)}
                                                                    disabled={disabled}
                                                                />
                                                                <ErrorLabel content={errorContribute ? errorContribute[`consulted${item._id}`] : ''} />
                                                            </div>

                                                        </td>
                                                        <td style={{ padding: 5 }}>
                                                            <div className={errorApprovedPoint[`consulted${item._id}`] === undefined ? "form-group" : "form-group has-error"}>
                                                                <input className='form-control' type="number"
                                                                    value={this.checkNullUndefined(results[`approvedPointConsulted${item._id}`]?.value) ? results[`approvedPointConsulted${item._id}`].value : ''}
                                                                    name={`approvedPointConsulted${item._id}`} placeholder={translate('task.task_management.detail_acc_point')}
                                                                    onChange={(e) => this.handleChangeApprovedPointForConsulted(e, item._id)}
                                                                    disabled={disabled}
                                                                />
                                                                <ErrorLabel content={errorApprovedPoint ? errorApprovedPoint[`consulted${item._id}`] : ''} />
                                                            </div>

                                                        </td>
                                                    </tr>
                                                )

                                                )
                                            }
                                            { // Chấm điểm phê duyệt cho người phê duyệt
                                                task && task.accountableEmployees.map((item, index) =>
                                                (task.inactiveEmployees.indexOf(item._id) === -1 &&
                                                    <tr key={index} style={{ verticalAlign: "top" }}>
                                                        <td><div style={{ marginTop: 10 }}>{item.name}</div></td>
                                                        <td><div style={{ marginTop: 10 }}>{this.formatRole('accountable')}</div></td>
                                                        <td><div style={{ marginTop: 10 }}><p id={`accountablePoint${item._id}`}>{this.checkNullUndefined(empPoint[`accountable${item._id}`]) ? empPoint[`accountable${item._id}`] : translate('task.task_management.not_eval')}</p></div></td>
                                                        <td style={{ padding: 5 }}>
                                                            <div className={errorContribute[`accountable${item._id}`] === undefined ? "form-group" : "form-group has-error"}>
                                                                <input className='form-control' type="number"
                                                                    value={this.checkNullUndefined(results[`contributeAccountable${item._id}`]?.value) ? results[`contributeAccountable${item._id}`].value : ''}
                                                                    name={`contributeAccountable${item._id}`} placeholder={"% " + translate('task.task_management.contribution')}
                                                                    onChange={(e) => this.handleChangeAccountableContribution(e, item._id)}
                                                                    disabled={disabled}
                                                                />
                                                                <ErrorLabel content={errorContribute ? errorContribute[`accountable${item._id}`] : ''} />
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: 5 }}>
                                                            <div className={errorApprovedPoint[`accountable${item._id}`] === undefined ? "form-group" : "form-group has-error"}>
                                                                <input className="form-control" type="number"
                                                                    value={this.checkNullUndefined(results[`approvedPoint${item._id}`]?.value) ? results[`approvedPoint${item._id}`].value : ''}
                                                                    name={`approvedPoint${item._id}`} placeholder={translate('task.task_management.detail_acc_point')}
                                                                    onChange={(e) => this.handleChangeAccountablePoint(e, item._id)}
                                                                    disabled={disabled}
                                                                />
                                                                <ErrorLabel content={errorApprovedPoint ? errorApprovedPoint[`accountable${item._id}`] : ''} />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                                )
                                            }
                                        </table>
                                    }
                                </fieldset>
                            </div>
                        </form>

                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapState = (state) => {
    const { tasks, performtasks, KPIPersonalManager, user } = state;
    return { tasks, performtasks, KPIPersonalManager, user };
}
const getState = {
    addTaskLog: performTaskAction.addTaskLog,
    deleteEvaluation: performTaskAction.deleteEvaluation,
    evaluateTaskByAccountableEmployees: performTaskAction.evaluateTaskByAccountableEmployees,
    getAllKpiSetsOrganizationalUnitByMonth: managerKpiActions.getAllKpiSetsOrganizationalUnitByMonth,
}

const evaluateByAccountableEmployee = connect(mapState, getState)(withTranslate(EvaluateByAccountableEmployee));
export { evaluateByAccountableEmployee as EvaluateByAccountableEmployee }
