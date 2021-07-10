import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { getStorage } from '../../../../config';
import { DatePicker, DialogModal, ErrorLabel, SelectBox, TimePicker } from '../../../../common-components/index';
import { performTaskAction } from '../redux/actions';
import { ModalShowAutoPointInfo } from './modalShowAutoPointInfo';
import { managerKpiActions } from '../../../kpi/employee/management/redux/actions';
import { AutomaticTaskPointCalculator } from './automaticTaskPointCalculator';
import moment from 'moment'

function EvaluateByConsultedEmployee(props) {
    const { translate, user, KPIPersonalManager } = props;
    const { task, perform, role } = props;
    const [state, setState] = useState(initState(props.date))

    function initState(date) {
        let data = getData(date);
        return {
            isEval: props.isEval,
            info: data.info,
            task: data.task,
            date: data.date,
            startDate: data.startDate,
            endDate: data.endDate,
            startTime: data.startTime,
            endTime: data.endTime,
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
            userId: data.userId,
        }
    }

    const { id, endTime, startTime, isEval, autoPoint, oldAutoPoint, endDate, startDate, evaluatingMonth, point,
        errorOnEndDate, errorOnMonth, errorOnStartDate, errorOnPoint, evaluations, progress, info, showAutoPointInfo, dentaDate, kpi, unit, userId } = state;

    useEffect(() => {
        if (props.date) {
            props.getAllKpiSetsOrganizationalUnitByMonth(userId, unit, props.date);
        }
    }, [])


    if (props.id !== state.id) {
        setState({
            ...state,
            id: props.id,
            errorOnEndDate: undefined, // Khi nhận thuộc tính mới, cần lưu ý reset lại các gợi ý nhắc lỗi, nếu không các lỗi cũ sẽ hiển thị lại
            errorOnStartDate: undefined,
            errorOnMonth: undefined,
            errorOnPoint: undefined,
            errorOnInfoDate: undefined,
            errorOnProgress: undefined,
            errorOnInfoBoolean: undefined,
            errorOnTextInfo: undefined,
            errorOnNumberInfo: undefined
        })
    }

    useEffect(() => {
        let data = getData(props.date);
        if (props.date) {
            props.getAllKpiSetsOrganizationalUnitByMonth(userId, unit, props.date);
        }

        setState({
            ...state,
            id: props.id,
            isEval: props.isEval,
            info: data.info,
            task: data.task,
            date: data.date,
            startDate: data.startDate,
            endDate: data.endDate,
            startTime: data.startTime,
            endTime: data.endTime,
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
        })
    }, [id])

    useEffect(() => {
        let data = getData(props.date);
        setState({
            ...state,
            kpi: data.kpi
        })
    }, [JSON.stringify(props.KPIPersonalManager.kpiSets)])


    function handleSortMonthEval(evaluations) {
        // sắp xếp đánh giá theo thứ tự tháng
        const sortedEvaluations = evaluations?.sort((a, b) => new Date(b.evaluatingMonth) - new Date(a.evaluatingMonth));
        return sortedEvaluations;
    }

    function getPreviousEvaluation(task, date) {
        let evaluations = task.evaluations;
        let sortedEvaluations = handleSortMonthEval(evaluations);

        let evalMonth = moment(date, 'DD-MM-YYYY').endOf("month").toDate();
        for (let i in sortedEvaluations) {
            let eva = sortedEvaluations[i];
            if (new Date(eva?.evaluatingMonth) <= evalMonth) {
                return eva;
            }
        }
        return null;
    }

    // hàm lấy dữ liệu khởi tạo
    function getData(dateParams, evaluatingMonthParam) {
        const { user, KPIPersonalManager } = props;
        let { task } = props;
        let userId = getStorage("userId");
        let unit;
        if (user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
            unit = user.organizationalUnitsOfUser[0]._id;
        }

        if (dateParams) {
            let progress = task.progress;
            let evaluation, prevEval;
            let date = dateParams;
            let endDate = dateParams;
            let startDateTask = task.startDate;
            let prevDate = formatDate(startDateTask);

            let startTime = formatTime(new Date(startDateTask));
            let endTime = formatTime(new Date());

            let dentaDate = 0;

            let cloneKpi = []
            if (KPIPersonalManager && KPIPersonalManager.kpiSets) {
                cloneKpi = (KPIPersonalManager.kpiSets.kpis.filter(e => (e.type === 2)).map(x => { return x._id }));
            }

            let splitter = dateParams.split("-");
            if (evaluatingMonthParam) {
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

            evaluation = task.evaluations.find(e => (monthOfEval === new Date(e.evaluatingMonth).getMonth() && yearOfEval === new Date(e.evaluatingMonth).getFullYear()));
            prevEval = getPreviousEvaluation(task, dateParams);

            if (prevEval) {
                prevDate = formatDate(prevEval.endDate);
                startTime = formatTime(prevEval.endDate);
            }
            let automaticPoint = (evaluation && evaluation.results.length !== 0) ? evaluation.results[0].automaticPoint : undefined;

            let point = undefined;
            if (evaluation) {
                let res = evaluation.results.find(e => (String(e.employee._id) === String(userId) && String(e.role) === "consulted"));
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
                progress = evaluation.progress;
            }

            let infoEval = evaluation ? evaluation.taskInformations : [];
            let info = {};

            for (let i in infoEval) {

                if (infoEval[i].type === "date") {
                    if (infoEval[i].value) {
                        info[`${infoEval[i].code}`] = {
                            value: formatDate(infoEval[i].value),
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
                }
                else {
                    if (infoEval[i].value || infoEval[i].value === 0) {
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
                endDate = formatDate(evaluation.endDate);
                startDate = formatDate(evaluation.startDate);
                startTime = formatTime(evaluation.startDate);
                endTime = formatTime(evaluation.endDate);
            }

            let taskInfo = {
                task: task,
                progress: progress,
                date: endDate,
                time: endTime,
                info: info,
            };

            let calcAuto = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo);
            if (isNaN(calcAuto)) calcAuto = undefined
            if (calcAuto < 0) calcAuto = 0;

            dentaDate = Math.round(((new Date()).getTime() - dateOfEval.getTime()) / (1000 * 3600 * 24));

            return {
                info: info,
                userId: userId,
                task: task,
                date: date,
                startDate: startDate,
                endDate: endDate,
                startTime: startTime,
                endTime: endTime,
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
        else return {
            info: {},
            userId: userId,
            task: task,
            unit: unit,
            kpi: [],
        }
    }

    // hàm check null undefined
    const checkNullUndefined = (x) => {
        if (x === null || x === undefined) {
            return false;
        }
        else return true;
    }

    // Function format ngày hiện tại thành dạnh dd-mm-yyyy
    function formatDate(date) {
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
    const validatePoint = (value) => {
        let { translate } = props;
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
    const handleChangePoint = (e) => {
        let value = parseInt(e.target.value);
        setState({
            ...state,
            point: value,
            errorOnPoint: validatePoint(value)
        })
    }

    // hàm thay đổi kpi
    const handleKpiChange = (value) => {
        setState({
            ...state,
            kpi: value
        });
    }

    // hàm cập nhật đơn vị
    const handleChangeUnit = (value) => {
        setState({
            ...state,
            unit: value[0],
            kpi: [],
        });
        props.getAllKpiSetsOrganizationalUnitByMonth(state.userId, value[0], state.date);
    }

    // show modal autopoint
    const handleShowAutomaticPointInfo = async () => {
        await setState(state => {
            return {
                ...state,
                showAutoPointInfo: 1
            }
        });
        window.$(`#modal-automatic-point-info`).modal('show');
    }


    // convert ISODate to String hh:mm AM/PM
    function formatTime(date) {
        var d = new Date(date);
        let time = moment(d).format("hh:mm");
        let suffix = " AM";
        if (d.getHours() >= 12 && d.getHours() <= 23) {
            suffix = " PM";
        }
        return time + suffix;
    }

    const validateDateTime = (evaluatingMonth, startDate, startTime, endDate, endTime, type) => {
        let { translate } = props;
        let { isEval, storedEvaluatingMonth, task } = state;

        // init data
        let msg;
        let endOfMonth = moment(evaluatingMonth, 'MM-YYYY').endOf("month").toDate();
        let startOfMonth = moment(evaluatingMonth, 'MM-YYYY').startOf("month").toDate();
        let monthOfEval = startOfMonth.getMonth();
        let yearOfEval = startOfMonth.getFullYear();

        // convert ISO date
        let startDateISO = convertDateTime(startDate, startTime);
        let endDateISO = convertDateTime(endDate, endTime);

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
    const handleStartDateChange = (value) => {
        let { translate } = props;
        let { evaluatingMonth, endDate, startDate, endTime, startTime } = state;

        let err = validateDateTime(evaluatingMonth, value, startTime, endDate, endTime, "start");
        setState({
            ...state,
            startDate: value,
            errorOnStartDate: err,
        });
    }

    // hàm cập nhật ngày đánh giá hiện tại
    const handleEndDateChange = (value) => {
        // indexReRender = indexReRender + 1;
        let { translate } = props;

        let { evaluatingMonth, endDate, startDate, endTime, startTime } = state;

        let err = validateDateTime(evaluatingMonth, startDate, startTime, value, endTime, "end");

        let data = getData(value, state.storedEvaluatingMonth);

        let automaticPoint = data.automaticPoint;
        let taskInfo = {
            task: data.task,
            progress: state.progress,
            date: value,
            time: state.endTime,
            info: state.info,
        };

        automaticPoint = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo);
        if (isNaN(automaticPoint)) automaticPoint = undefined
        if (automaticPoint < 0) automaticPoint = 0;

        setState({
            ...state,
            endDate: value,
            autoPoint: automaticPoint,
            oldAutoPoint: data.automaticPoint,
            errorOnEndDate: err,
            indexReRender: state.indexReRender + 1,
        });
    }

    const handleStartTimeChange = (value) => {
        let { translate } = props;
        let { evaluatingMonth, endDate, startDate, endTime, startTime } = state;

        let err = validateDateTime(evaluatingMonth, startDate, value, endDate, endTime, "start");

        setState({
            ...state,
            startTime: value,
            errorOnStartDate: err,
        });
    }

    const handleEndTimeChange = (value) => {
        let { translate } = props;

        let { evaluatingMonth, endDate, startDate, endTime, startTime } = state;

        let err = validateDateTime(evaluatingMonth, startDate, startTime, endDate, value, "end");

        let data = getData(value, state.storedEvaluatingMonth);

        let automaticPoint = data.automaticPoint;
        let taskInfo = {
            task: data.task,
            progress: state.progress,
            date: state.endDate,
            time: value,
            info: state.info,
        };

        automaticPoint = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo);
        if (isNaN(automaticPoint)) automaticPoint = undefined
        if (automaticPoint < 0) automaticPoint = 0;

        setState({
            ...state,
            endTime: value,
            autoPoint: automaticPoint,
            oldAutoPoint: data.automaticPoint,
            errorOnEndDate: err,
        });
    }

    const convertDateTime = (date, time) => {
        let splitter = date.split("-");
        let strDateTime = `${splitter[2]}/${splitter[1]}/${splitter[0]} ${time}`;
        return new Date(strDateTime);
    }

    // hàm cập nhật tháng đánh giá
    function handleMonthOfEvaluationChange(value) {
        // indexReRender = indexReRender + 1;
        let { translate } = props;
        let { evaluatingMonth, task, userId, endDate, startDate, endTime, startTime } = state;
        let evalDate = moment(value, 'MM-YYYY').endOf('month').format('DD-MM-YYYY');
        let err
        //  = validateDateTime(value, startDate, startTime, evalDate, endDate, "end");

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

        let data = getData(evalDate, evalDate);
        props.getAllKpiSetsOrganizationalUnitByMonth(userId, state.unit, evalDate);

        let automaticPoint = data.autoPoint;
        let taskInfo = {
            task: data.task,
            progress: data.progress,
            date: evalDate,
            time: data.endTime,
            info: data.info,
        };

        automaticPoint = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo);
        if (isNaN(automaticPoint)) automaticPoint = undefined
        if (automaticPoint < 0) automaticPoint = 0;

        setState({
            ...state,
            kpi: [],
            evaluatingMonth: value,
            storedEvaluatingMonth: evalDate,
            endDate: evalDate,
            startDate: data.startDate,
            startTime: data.startTime,
            endTime: data.endTime,
            autoPoint: automaticPoint,
            oldAutoPoint: data.automaticPoint,
            errorOnEndDate: err,
            errorOnMonth: errMonth,
            indexReRender: state.indexReRender + 1,

            info: data.info,
            date: data.date,
            progress: data.progress,
            evaluations: data.evaluations,
            point: data.point,
            dentaDate: data.dentaDate,
        });
        if (!errMonth) {
            props.handleChangeMonthEval({ evaluatingMonth: value, date: evalDate, id: state.id });
        }
    }

    const getStartTask = async () => {
        let { translate } = props;
        let { task } = state;
        let start = task?.startDate;
        let startDate = formatDate(new Date(start));
        let startTime = formatTime(new Date(start));

        let { evaluatingMonth, endDate, endTime, idUser } = state;
        let err = validateDateTime(evaluatingMonth, startDate, startTime, endDate, endTime, "start");

        setState({
            ...state,
            errorOnStartDate: err,
            startDate: startDate,
            startTime: startTime,
            indexReRender: state.indexReRender + 1,
        });
    }

    const getEndTask = () => {
        let { translate } = props;
        let { task } = state;
        let end = task?.endDate;
        let endDate = formatDate(new Date(end));
        let endTime = formatTime(new Date(end));

        let { evaluatingMonth, startDate, startTime, userId } = state;

        let err = validateDateTime(evaluatingMonth, startDate, startTime, endDate, endTime, "end");

        let data = getData(endDate, state.storedEvaluatingMonth);

        let automaticPoint = data.automaticPoint;
        let taskInfo = {
            task: data.task,
            progress: state.progress,
            date: endDate,
            time: endTime,
            info: state.info,
        };

        automaticPoint = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo);
        if (isNaN(automaticPoint)) automaticPoint = undefined
        if (automaticPoint < 0) automaticPoint = 0;

        setState({
            ...state,
            errorOnEndDate: err,
            endDate: endDate,
            endTime: endTime,
            autoPoint: automaticPoint,
            oldAutoPoint: data.automaticPoint,
            indexReRender: state.indexReRender + 1,
        });
    }

    // hàm validate submit
    const isFormValidated = () => {
        let { evaluatingMonth, point, errorOnPoint, errorOnEndDate, errorOnMonth, errorOnStartDate } = state;
        return (evaluatingMonth && evaluatingMonth.trim() !== "" && point !== undefined && errorOnPoint === undefined && errorOnStartDate === undefined && errorOnEndDate === undefined && errorOnMonth === undefined) ? true : false;
    }

    // hàm submit
    const save = async () => {
        let taskId;
        taskId = state.task._id;
        let startDateTask = convertDateTime(state.startDate, state.startTime);
        let endDateTask = convertDateTime(state.endDate, state.endTime);
        let data = {
            user: getStorage("userId"),
            role: "consulted",
            unit: state.unit,
            kpi: state.kpi,

            employeePoint: state.point,

            evaluatingMonth: state.storedEvaluatingMonth,
            startDate: startDateTask,
            endDate: endDateTask,

            automaticPoint: state.autoPoint
        }

        await props.evaluateTaskByConsultedEmployees(data, taskId);
        // props.handleChangeDataStatus(1); // 1 = DATA_STATUS.QUERYING
        setState({
            ...state,
            oldAutoPoint: state.autoPoint,
        });
        props.handleChangeShowEval(state.id);
        props.handleChangeEnableAddItem(state.id);
    }

    // hàm kiểm tra thông báo
    const checkNote = () => {
        let { date } = props;
        let splitter = date.split("-");
        let isoDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        let now = new Date();

        if (now.getMonth() === isoDate.getMonth() && now.getFullYear() === isoDate.getFullYear()) {
            return false;
        }
        return true
    }

    let listUnits = [];
    if (user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
        listUnits = user.organizationalUnitsOfUser.map(x => { return { value: x._id, text: x.name } });
    }

    let checkNoteMonth;
    // checkNoteMonth = checkNote();

    let disabled = false;
    // if (checkNoteMonth && (dentaDate > 7)) {
    //     disabled = true;
    // }
    let disableSubmit = !isFormValidated();

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
                            <button disabled={disabled || disableSubmit} className="btn btn-success" onClick={save}>{translate('task.task_management.btn_save_eval')}</button>
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
                                        onChange={handleMonthOfEvaluationChange}
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
                                    <label>
                                        {translate('task.task_management.eval_from')}<span className="text-red">*</span>
                                        <span className="pull-right" style={{ fontWeight: "normal", marginLeft: 10 }}>
                                            <a style={{ cursor: "pointer" }} onClick={() => getStartTask()}>Lấy thời điểm bắt đầu công việc</a>
                                        </span>
                                    </label>
                                    <DatePicker
                                        id={`start_date_${id}_${perform}`}
                                        value={startDate}
                                        onChange={handleStartDateChange}
                                        disabled={disabled}
                                    />
                                    < TimePicker
                                        id={`time-picker-1-start-time-${id}-${perform}-${props.id}`}
                                        value={startTime}
                                        onChange={handleStartTimeChange}
                                    />
                                    <ErrorLabel content={errorOnStartDate} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className={`form-group ${errorOnEndDate === undefined ? "" : "has-error"}`}>
                                    <label>
                                        {translate('task.task_management.eval_to')}<span className="text-red">*</span>
                                        <span className="pull-right" style={{ fontWeight: "normal", marginLeft: 10 }}>
                                            <a style={{ cursor: "pointer" }} onClick={() => getEndTask()}>Lấy thời điểm kết thúc công việc</a>
                                        </span>
                                    </label>
                                    <DatePicker
                                        id={`create_date_${id}_${perform}`}
                                        value={endDate}
                                        onChange={handleEndDateChange}
                                        disabled={disabled}
                                    />
                                    < TimePicker
                                        id={`time-picker-2-end-time-${id}-${perform}-${props.id}`}
                                        value={endTime}
                                        onChange={handleEndTimeChange}
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
                                    onChange={handleChangeUnit}
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
                                    onChange={handleKpiChange}
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
                                onChange={handleChangePoint}
                                value={checkNullUndefined(point) ? point : ''}
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
                                                    <a style={{ cursor: "pointer" }} onClick={() => handleShowAutomaticPointInfo()}>
                                        {checkNullUndefined(autoPoint) ? autoPoint : translate('task.task_management.detail_not_calc_auto_point')}
                                    </a>
                                </strong>
                                <div>
                                    <strong>{translate('task.task_management.detail_auto_on_system')}: &nbsp;</strong>
                                    <a style={{ color: "black" }}>
                                        {checkNullUndefined(oldAutoPoint) ? oldAutoPoint : translate('task.task_management.detail_not_calc_auto_point')}
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
                                                                <div><span style={{ fontWeight: "bold" }}>{info.name}</span>:&nbsp;&nbsp;&nbsp;{(info.value !== null && info.value !== undefined) ? formatDate(info.value) : translate('task.task_management.not_eval')}</div>
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
                    time={endTime}
                    info={info}
                    autoPoint={autoPoint}
                />
            }
        </React.Fragment>
    );
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
