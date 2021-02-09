import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { getStorage } from '../../../../config';
import { DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../common-components/index';
import { performTaskAction } from '../redux/actions';
import { ModalShowAutoPointInfo } from './modalShowAutoPointInfo';
import { managerKpiActions } from '../../../kpi/employee/management/redux/actions';
import { AutomaticTaskPointCalculator } from './automaticTaskPointCalculator';
import moment from 'moment'

class EvaluateByConsultedEmployee extends Component {
    constructor(props) {
        super(props);

        let { date, id, isEval } = this.props;
        let data = this.getData(date);
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };

        this.state = {
            // id: id,
            isEval: isEval,
            info: data.info,
            task: data.task,
            date: data.date,
            startDate: data.startDate,
            endDate: data.endDate,
            evaluatingMonth: data.evaluatingMonth,
            storedEvaluatingMonth: data.storedEvaluatingMonth,
            progress: data.progress,
            evaluations: data.evaluations,
            autoPoint: data.calcAuto,
            oldAutoPoint: data.automaticPoint,
            point: data.point,
            dentaDate: data.dentaDate,
            unit: data.unit,
            kpi: data.kpi,
            idUser: data.idUser,
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE,
        }
    }

    componentDidMount() {
        let { idUser, unit } = this.state;
        let { date } = this.props;
        let defaultDepartment = unit;

        this.props.getAllKpiSetsOrganizationalUnitByMonth(idUser, defaultDepartment, date);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                // id: nextProps.id,

                errorOnEndDate: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
                errorOnStartDate: undefined,
                errorOnMonth: undefined,
                errorOnPoint: undefined,
                errorOnInfoDate: undefined,
                errorOnProgress: undefined,
                errorOnInfoBoolean: undefined,
                errorOnTextInfo: undefined,
                errorOnNumberInfo: undefined
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps.id !== this.state.id) {
            let { task, idUser, unit } = this.state;
            let department = unit;
            let date = nextProps.date;
            this.props.getAllKpiSetsOrganizationalUnitByMonth(idUser, department, date);

            let data = this.getData(date);

            this.setState(state => {
                return {
                    ...state,
                    id: nextProps.id,
                    isEval: nextProps.isEval,
                    info: data.info,
                    task: data.task,
                    date: data.date,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    evaluatingMonth: data.evaluatingMonth,
                    storedEvaluatingMonth: data.storedEvaluatingMonth,
                    progress: data.progress,
                    evaluations: data.evaluations,
                    autoPoint: data.calcAuto,
                    oldAutoPoint: data.automaticPoint, // oldAutoPoint
                    point: data.point,
                    dentaDate: data.dentaDate,
                    unit: data.unit,
                    kpi: data.kpi,
                    dataStatus: this.DATA_STATUS.QUERYING,
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
                console.log('quangdz\n\n\n', nextProps.KPIPersonalManager.kpiSets, data);
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

    // hàm lấy dữ liệu khởi tạo
    getData = (dateParams, evaluatingMonthParam) => {
        const { user, KPIPersonalManager } = this.props;
        let { task } = this.props;
        let idUser = getStorage("userId");

        let progress = task.progress;
        let evaluation, prevEval;
        let date = dateParams;
        let endDate = dateParams;
        let startDateTask = task.startDate;
        let prevDate = this.formatDate(startDateTask);
        let dentaDate = 0;
        let unit;
        if (user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
            unit = user.organizationalUnitsOfUser[0]._id;
        }

        // this.props.getAllKpiSetsOrganizationalUnitByMonth(idUser, unit, date);

        let cloneKpi = []
        if (KPIPersonalManager && KPIPersonalManager.kpiSets) {
            cloneKpi = (KPIPersonalManager.kpiSets.kpis.filter(e => (e.type === 2)).map(x => { return x._id }));
        }

        let splitter = dateParams.split("-");
        if(evaluatingMonthParam) {
            splitter = evaluatingMonthParam.split("-");
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

        // let dateOfEval = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        // let monthOfEval = dateOfEval.getMonth();
        // let yearOfEval = dateOfEval.getFullYear();
        // evaluation = task.evaluations.find(e => (monthOfEval === new Date(e.date).getMonth() && yearOfEval === new Date(e.date).getFullYear()));

        evaluation = task.evaluations.find(e => (monthOfEval === new Date(e.evaluatingMonth).getMonth() && yearOfEval === new Date(e.evaluatingMonth).getFullYear()));

        prevEval = task.evaluations.find(e => ((monthOfPrevEval) === new Date(e.evaluatingMonth).getMonth() && yearOfPrevEval === new Date(e.evaluatingMonth).getFullYear()));
        if (prevEval) {
            prevDate = this.formatDate(prevEval.endDate);
        } else {
            let strPrevMonth = `${monthOfPrevEval + 1}-${yearOfPrevEval}`
            // trong TH k có đánh giá tháng trước, so sánh tháng trước với tháng start date
            if (!((yearOfPrevEval === new Date(startDateTask).getFullYear() && monthOfPrevEval < new Date(startDateTask).getMonth()) // bắt đầu tháng bất kì khác tháng 1
                || (yearOfPrevEval < new Date(startDateTask).getFullYear()) // TH bắt đầu là tháng 1 - chọn đánh giá tháng 1
            )) {
                prevDate = moment(strPrevMonth, 'MM-YYYY').endOf("month").format('DD-MM-YYYY');
            }
        }
        let automaticPoint = (evaluation && evaluation.results.length !== 0) ? evaluation.results[0].automaticPoint : undefined;

        let point = undefined;
        if (evaluation) {
            let res = evaluation.results.find(e => (String(e.employee._id) === String(idUser) && String(e.role) === "consulted"));
            if (res) {
                point = res.employeePoint ? res.employeePoint : undefined;
                if (res.organizationalUnit) {
                    unit = res.organizationalUnit._id;
                };
                let kpi = res.kpis;

                cloneKpi = []

                for (let i in kpi) {
                    cloneKpi.push(kpi[i]._id);
                }

                point = res.employeePoint ? res.employeePoint : undefined;

            }
            // date = this.formatDate(evaluations.date);
            progress = evaluation.progress;
        }

        let infoEval = evaluation ? evaluation.taskInformations : [];
        let info = {};

        for (let i in infoEval) {

            if (infoEval[i].type === "date") {
                if (infoEval[i].value) {
                    info[`${infoEval[i].code}`] = {
                        value: this.formatDate(infoEval[i].value),
                        code: infoEval[i].code,
                        type: infoEval[i].type
                    }
                }
                // else if (!infoEval[i].filledByAccountableEmployeesOnly) {
                //     info[`${infoEval[i].code}`] = {
                //         // value: this.formatDate(Date.now()),
                //         code: infoEval[i].code,
                //         type: infoEval[i].type
                //     }
                // }
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
                // else if (!infoEval[i].filledByAccountableEmployeesOnly) {
                //     info[`${infoEval[i].code}`] = {
                //         value: [splitSetOfValues[0]],
                //         code: infoEval[i].code,
                //         type: infoEval[i].type
                //     }
                // }
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

        let startDate = prevDate;
        if (evaluation) {
            endDate = this.formatDate(new Date(evaluation.endDate));
            startDate = this.formatDate(new Date(evaluation.startDate));
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

        return {
            info: info,
            idUser: idUser,
            task: task,
            date: date,
            startDate: startDate,
            endDate: endDate,
            evaluatingMonth: evaluatingMonth,
            storedEvaluatingMonth: storedEvaluatingMonth,
            progress: progress,
            calcAuto: calcAuto,
            evaluations: evaluation,
            automaticPoint: automaticPoint,
            point: point,
            dentaDate: dentaDate,
            unit: unit,
            kpi: cloneKpi,
        }
    }

    // hàm check null undefined
    checkNullUndefined = (x) => {
        if (x === null || x === undefined) {
            return false;
        }
        else return true;
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

    // hàm validate điểm tự đnahs giá
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

    // cập nhật điểm tự đánh giá
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
        this.props.getAllKpiSetsOrganizationalUnitByMonth(this.state.idUser, value[0], this.state.date);
    }

    // show modal autopoint
    handleShowAutomaticPointInfo = async () => {
        await this.setState(state => {
            return {
                ...state,
                showAutoPointInfo: 1
            }
        });
        window.$(`#modal-automatic-point-info`).modal('show');
    }

    // hàm cập nhật ngày đánh giá từ
    handleStartDateChange = (value) => {
        // indexReRender = indexReRender + 1;
        let { translate } = this.props;
        let { idUser, task, evaluatingMonth } = this.state;

        // let endOfMonth = new moment().endOf("month").toDate();
        let endOfMonth = moment(evaluatingMonth, 'MM-YYYY').endOf("month").toDate();
        let startOfMonth = moment(evaluatingMonth, 'MM-YYYY').startOf("month").toDate();

        let startDate = new Date(task.startDate);
        let endDate = new Date(task.endDate);

        let splitter = value.split('-');
        let dateValue = new Date(splitter[2], splitter[1] - 1, splitter[0]);

        // tính hiệu giữa ngày đánh giá so với ngày bắt đầu của tháng, ngày kết thúc của tháng
        let de = (endOfMonth.getTime() - dateValue.getTime()); // < 0 -> err
        let ds = (dateValue.getTime() - startOfMonth.getTime()); // < 0 -> err

        // đưa về cùng giờ để so sánh ngày tháng năm
        dateValue.setHours(0);
        startDate.setHours(0);
        // tính hiệu giữa ngày đánh giá so với ngày bắt đầu và ngày kết thúc của công việc
        let dst = (dateValue.getTime() - startDate.getTime()); // < 0 -> err
        let det = (endDate.getTime() - dateValue.getTime()); // < 0 -> err

        let err;
        if (value.trim() === "") {
            err = translate('task.task_perform.modal_approve_task.err_empty');
        }
        else if (dst < 0) {
            err = translate('task.task_management.err_eval_start');
        }
        else if (ds < 0) {
            err = translate('task.task_management.err_eval_on_month');
        }
        this.setState(state => {
            return {
                ...state,
                startDate: value,
                errorOnStartDate: err,
            }
        });
    }

    // hàm cập nhật ngày đánh giá hiện tại
    handleEndDateChange = (value) => {
        // indexReRender = indexReRender + 1;
        let { translate } = this.props;
        let { idUser, task, evaluatingMonth } = this.state;

        // let endOfMonth = new moment().endOf("month").toDate();
        let endOfMonth = moment(evaluatingMonth, 'MM-YYYY').endOf("month").toDate();
        let startOfMonth = moment(evaluatingMonth, 'MM-YYYY').startOf("month").toDate();

        let startDate = new Date(task.startDate);
        let endDate = new Date(task.endDate);

        let splitter = value.split('-');
        let dateValue = new Date(splitter[2], splitter[1] - 1, splitter[0]);

        // tính hiệu giữa ngày đánh giá so với ngày bắt đầu của tháng, ngày kết thúc của tháng
        let de = (endOfMonth.getTime() - dateValue.getTime()); // < 0 -> err
        let ds = (dateValue.getTime() - startOfMonth.getTime()); // < 0 -> err

        // đưa về cùng giờ để so sánh ngày tháng năm
        dateValue.setHours(0);
        startDate.setHours(0);
        // tính hiệu giữa ngày đánh giá so với ngày bắt đầu và ngày kết thúc của công việc
        let dst = (dateValue.getTime() - startDate.getTime()); // < 0 -> err
        let det = (endDate.getTime() - dateValue.getTime()); // < 0 -> err

        let err;
        if (value.trim() === "") {
            err = translate('task.task_perform.modal_approve_task.err_empty');
        }
        else if (dst < 0) {
            err = translate('task.task_management.err_eval_start');
        }
        else if (ds < 0) {
            err = translate('task.task_management.err_eval_on_month');
        }

        let data = this.getData(value, this.state.storedEvaluatingMonth);
        // this.props.getAllKpiSetsOrganizationalUnitByMonth(idUser, this.state.unit, value);

        let automaticPoint = data.automaticPoint;
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
                endDate: value,
                autoPoint: automaticPoint,
                oldAutoPoint: data.automaticPoint,
                errorOnEndDate: err,
                indexReRender: state.indexReRender + 1,
            }
        });
    }

    // hàm cập nhật tháng đánh giá
    handleMonthOfEvaluationChange = (value) => {
        // indexReRender = indexReRender + 1;
        let { translate } = this.props;
        let { idUser, task } = this.state;
        let evalDate = moment(value, 'MM-YYYY').endOf('month').format('DD-MM-YYYY');

        let startDate = new Date(task.startDate);
        let endDate = new Date(task.endDate);

        let splitter = evalDate.split('-');
        let dateValue = new Date(splitter[2], splitter[1] - 1, splitter[0]);

        // đưa về cùng giờ để so sánh ngày tháng năm
        dateValue.setHours(0);
        startDate.setHours(0);
        // tính hiệu giữa ngày đánh giá so với ngày bắt đầu và ngày kết thúc của công việc
        let dst = (dateValue.getTime() - startDate.getTime()); // < 0 -> err // denta start task
        let det = (endDate.getTime() - dateValue.getTime()); // < 0 -> err // denta end task

        // validate ngày đánh giá
        let err;
        if (evalDate.trim() === "") {
            err = translate('task.task_perform.modal_approve_task.err_empty');
        }
        else if (dst < 0) {
            err = translate('task.task_management.err_eval_start');
        }

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
        startDate.setDate(15);
        endDate.setDate(15);
        dateValue.setHours(0);
        startDate.setHours(0);
        endDate.setHours(0);
        // tính hiệu giữa ngày đánh giá so với ngày bắt đầu và ngày kết thúc của công việc
        let dst2 = (dateValue.getTime() - startDate.getTime()); // < 0 -> err // denta start task
        let det2 = (endDate.getTime() - dateValue.getTime()); // < 0 -> err // denta end task

        console.log('dateValue.getTime() - startDate.getTime()', dateValue, startDate);
        if(dst2 < 0) {
            errMonth = "Tháng đánh giá phải lớn hơn hoặc bằng tháng bắt đầu";
        } else if(det2 < 0) {
            // errMonth = "Tháng đánh giá phải nhỏ hơn hoặc bằng tháng kết thúc";
        }

        let data = this.getData(evalDate, evalDate);
        this.props.getAllKpiSetsOrganizationalUnitByMonth(idUser, this.state.unit, evalDate);

        let automaticPoint = data.autoPoint;
        let taskInfo = {
            task: data.task,
            progress: this.state.progress,
            date: evalDate,
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
                oldAutoPoint: data.autoPoint,
                errorOnDate: err,
                errorOnMonth: errMonth,
                indexReRender: state.indexReRender + 1,
            }
        });
        if (!errMonth) {
            this.props.handleChangeMonthEval({ evaluatingMonth: value, date: evalDate });
        }
    }

    // hàm validate submit
    isFormValidated = () => {
        let { point, errorOnPoint } = this.state;
        return (point !== undefined && errorOnPoint === undefined) ? true : false;
    }

    // hàm submit
    save = async () => {
        let taskId;
        taskId = this.state.task._id;
        let data = {
            user: getStorage("userId"),
            role: "consulted",
            unit: this.state.unit,
            kpi: this.state.kpi,

            employeePoint: this.state.point,

            // date: this.formatDate(Date.now()),
            
            evaluatingMonth: this.state.storedEvaluatingMonth,
            // date: this.state.date,
            startDate: this.state.startDate,
            endDate: this.state.endDate,

            automaticPoint: this.state.autoPoint
        }

        await this.props.evaluateTaskByConsultedEmployees(data, taskId);
        // this.props.handleChangeDataStatus(1); // 1 = DATA_STATUS.QUERYING
        this.setState(state => {
            return {
                ...state,
                oldAutoPoint: state.autoPoint,
            }
        });
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

    render() {
        const { translate, user, KPIPersonalManager } = this.props;
        const { id, isEval, autoPoint, oldAutoPoint, endDate, startDate, evaluatingMonth, point, errorOnEndDate, errorOnMonth, errorOnStartDate, errorOnPoint, evaluations, progress, date, info, showAutoPointInfo, dentaDate, kpi, unit, } = this.state;
        let { task, perform, role } = this.props;

        let listUnits = [];
        if (user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
            listUnits = user.organizationalUnitsOfUser.map(x => { return { value: x._id, text: x.name } });
        }

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
                    <div className="row">
                        {/* Thông báo thời gian đánh giá */}
                        <div className='col-md-8'>
                            {checkNoteMonth && (dentaDate <= 7 && dentaDate > 0) && <p style={{ color: "red" }}>{translate('task.task_management.note_eval')}:&nbsp;&nbsp; {8 - dentaDate}</p>}
                            {checkNoteMonth && (dentaDate > 7) && <p style={{ color: "red" }}>{translate('task.task_management.note_not_eval')}</p>}
                        </div>
                        {/* nút lưu */}
                        {!(checkNoteMonth && (dentaDate > 7)) &&
                            <div style={{ justifyContent: "flex-end", display: "flex" }} className='col-md-4'>
                                <button disabled={disabled || disableSubmit} className="btn btn-success" onClick={this.save}>{translate('task.task_management.btn_save_eval')}</button>
                            </div>
                        }
                    </div>
                    <form id="form-evaluate-task-by-consulted" className="body-evaluation" style={{ height: "calc(100vh - 186px)", overflow: "auto" }}>
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
                                <div className="col-md-6">
                                    <div className={`form-group ${errorOnStartDate === undefined ? "" : "has-error"}`}>
                                        <label>{translate('task.task_management.eval_from')}<span className="text-red">*</span></label>
                                        <DatePicker
                                            id={`start_date_${id}_${perform}`}
                                            value={startDate}
                                            onChange={this.handleStartDateChange}
                                            disabled={disabled}
                                        />
                                        <ErrorLabel content={errorOnStartDate} />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className={`form-group ${errorOnEndDate === undefined ? "" : "has-error"}`}>
                                        <label>{translate('task.task_management.eval_to')}<span className="text-red">*</span></label>
                                        <DatePicker
                                            id={`create_date_${id}_${perform}`}
                                            value={endDate}
                                            onChange={this.handleEndDateChange}
                                            disabled={disabled}
                                        // || (checkNoteMonth && (dentaDate <= 20 && dentaDate > 0))
                                        />
                                        <ErrorLabel content={errorOnEndDate} />
                                    </div>
                                </div>
                            </div>

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
                                    <SelectBox // id cố định nên chỉ render SelectBox khi items đã có dữ liệu
                                        id={`select-kpi-personal-evaluate-${perform}-${role}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={
                                            (KPIPersonalManager && KPIPersonalManager.kpiSets) ?
                                                (KPIPersonalManager.kpiSets.kpis.filter(e => (e.type === 2)).map(x => { return { value: x._id, text: x.name } }))
                                                : []
                                        }
                                        onChange={this.handleKpiChange}
                                        multiple={true}
                                        value={kpi}
                                        disabled={disabled}
                                    />
                                }
                            </div>
                            {/* Điểm tự đánh giá */}
                            <div className={`form-group ${errorOnPoint === undefined ? "" : "has-error"}`}>
                                <label>{translate('task.task_management.detail_emp_point')}  (0 - 100) <span style={{ color: "red" }}>*</span></label>
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

                        {/* Thông tin điểm tự động */}
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('task.task_management.auto_point_field')}</legend>
                            {(evaluations && evaluations.results.length !== 0) ?
                                <div style={{ lineHeight: 2.8 }}>
                                    <strong>{translate('task.task_management.detail_auto_point')}: &nbsp;
                                                        <a style={{ cursor: "pointer" }} onClick={() => this.handleShowAutomaticPointInfo()}>
                                            {this.checkNullUndefined(autoPoint) ? autoPoint : translate('task.task_management.detail_not_calc_auto_point')}
                                        </a>
                                    </strong>
                                    <div>
                                        <strong>{translate('task.task_management.detail_auto_on_system')}: &nbsp;</strong>
                                        <a style={{ color: "black" }}>
                                            {this.checkNullUndefined(oldAutoPoint) ? oldAutoPoint : translate('task.task_management.detail_not_calc_auto_point')}
                                        </a>
                                    </div>
                                    {
                                        evaluations.results.map((res, index) => {
                                            if (res.role === "responsible") {
                                                return <div key={index} >
                                                    <span style={{ fontWeight: "bold" }}>{translate('task.task_management.detail_emp_point_of')} {res.employee.name}</span>:&nbsp;&nbsp;&nbsp;{res.employeePoint}
                                                </div>
                                            }
                                        })
                                    }
                                </div> : <div><p style={{ color: "red", fontWeight: "bold" }}>{translate('task.task_management.responsible_not_eval')} </p></div>
                            }
                        </fieldset>

                        {/* Thông tin công việc */}
                        <br />
                        <fieldset className="scheduler-border">
                            <legend className="scheduler-border">{translate('task.task_management.info_eval_month')}</legend>
                            <div style={{ lineHeight: 2.8 }}>
                                {/* % tiến độ */}
                                <div><span style={{ fontWeight: "bold" }}>{translate('task.task_management.detail_progress')}:&nbsp;&nbsp;&nbsp;</span>{(evaluations?.progress !== null && evaluations?.progress !== undefined) ? `${evaluations?.progress}%` : translate('task.task_management.not_eval')}</div>

                                {/* Các thông tin khác */}
                                {
                                    evaluations ?
                                        <div>
                                            {(evaluations.taskInformations.length !== 0) &&
                                                <div>
                                                    {
                                                        evaluations.taskInformations.map((info, index) => {
                                                            if (info.type === "Date") {
                                                                return <div key={index}>
                                                                    <div><span style={{ fontWeight: "bold" }}>{info.name}</span>:&nbsp;&nbsp;&nbsp;{(info.value !== null && info.value !== undefined) ? this.formatDate(info.value) : translate('task.task_management.not_eval')}</div>
                                                                </div>
                                                            }
                                                            else return <div key={index}>
                                                                <div><span style={{ fontWeight: "bold" }}>{info.name}</span>:&nbsp;&nbsp;&nbsp;{(info.value !== null && info.value !== undefined) ? info.value : translate('task.task_management.not_eval')}</div>
                                                            </div>
                                                        })
                                                    }
                                                </div>
                                            }
                                        </div> : <div><p style={{ color: "red", fontWeight: "bold" }}>{translate('task.task_management.not_eval_on_month')} </p></div>
                                }
                            </div>
                        </fieldset>
                    </form>

                </div>

                { // modal hiển thị thông tin điểm tự động
                    showAutoPointInfo === 1 &&
                    <ModalShowAutoPointInfo
                        task={task}
                        progress={progress}
                        date={endDate}
                        info={info}
                        autoPoint={autoPoint}
                    />
                }
            </React.Fragment>
        );
    }
}

const mapState = (state) => {
    const { tasks, performtasks, KPIPersonalManager, user } = state;
    return { tasks, performtasks, KPIPersonalManager, user };
}
const getState = {
    evaluateTaskByConsultedEmployees: performTaskAction.evaluateTaskByConsultedEmployees,
    getAllKpiSetsOrganizationalUnitByMonth: managerKpiActions.getAllKpiSetsOrganizationalUnitByMonth,
}

const evaluateByConsultedEmployee = connect(mapState, getState)(withTranslate(EvaluateByConsultedEmployee));
export { evaluateByConsultedEmployee as EvaluateByConsultedEmployee }
