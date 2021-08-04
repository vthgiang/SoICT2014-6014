import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { getStorage } from '../../../../config';
import { ErrorLabel, DatePicker, SelectBox, QuillEditor, TimePicker, ShowMoreShowLess } from '../../../../common-components/index';
import { performTaskAction } from '../redux/actions';
import { managerKpiActions } from '../../../kpi/employee/management/redux/actions';
import { TaskInformationForm } from './taskInformationForm';
import { AutomaticTaskPointCalculator } from './automaticTaskPointCalculator';
import { ModalShowAutoPointInfo } from './modalShowAutoPointInfo';
import moment from 'moment';
import Swal from 'sweetalert2';

var currentTask;

function EvaluateByAccountableEmployee(props) {
    const { translate, user, KPIPersonalManager, performtasks } = props;
    const { id, perform, role, hasAccountable } = props;

    const [state, setState] = useState(initState(props.date))
    const [progress, setProgress] = useState(initState(props.date).progress)
    const [errorOnProgress, setErrorOnProgress] = useState(undefined)

    function initState(date) {
        let data = getData(date)

        return {
            isEval: props.isEval,
            errorInfo: {},
            errorApprovedPoint: {},
            errorContribute: {},
            task: data.task,
            userId: data.userId,
            info: data.info,
            results: data.results,
            empPoint: data.empPoint,
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
        }
    }
    const { isEval, startDate, endDate, endTime, startTime, storedEvaluatingMonth, evaluatingMonth, task, date, oldAutoPoint, autoPoint, errorOnDate, errorOnMonth, showAutoPointInfo, dentaDate, prevDate, info, results, empPoint,
        errorInfo, errorOnStartDate, errorOnEndDate, errorApprovedPoint, errorContribute, errSumContribution, indexReRender, unit, kpi, evaluation, userId
    } = state;

    useEffect(() => {
        if (props.date) {
            props.getAllKpiSetsOrganizationalUnitByMonth(userId, unit, props.date);
        }
    }, [])

    // Nếu props.id thay đổi thì cập nhật lai state
    if (props.id !== state.id) {
        setState({
            ...state,
            id: props.id,
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
        })
        setErrorOnProgress(undefined)
    }

    // Sau khi cập nhật id mới, cập nhật lại state
    useEffect(() => {
        let data = getData(props.date);
        if (props.date) {
            props.getAllKpiSetsOrganizationalUnitByMonth(userId, unit, props.date);
        }

        setState({
            ...state,
            id: id,
            isEval: props.isEval,
            task: data.task,
            userId: data.userId,
            info: data.info,
            results: data.results,
            empPoint: data.empPoint,
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

            evaluation: data.evaluation,
        })
        setProgress(data.progress)
        setErrorOnProgress(undefined)
    }, [id, props.task])

    // Cập nhật state.kpi khi có kết quả truy vấn mới
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

    /**
     * Hàm xử lý dữ liệu khởi tạo
     *  @dateParam : để truyền vào thông tin ngày đánh giá. khi khởi tạo thì đang cho giá trị storedEvaluateMonth = endDate nên chỉ cần truyền vào 1 tham số này
     *  @evaluatingMonth : giá trị tháng đánh giá. Truyền vào khi thay đổi tháng đánh giá, hoặc thay đổi ngày đánh giá lần này (endDate)
     * */
    function getData(dateParam, evaluatingMonthParam) {
        const { user, KPIPersonalManager } = props;
        let { task, hasAccountable } = props;
        let idUser = getStorage("userId");
        let unit;
        if (user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
            unit = user.organizationalUnitsOfUser[0]._id;
        }

        let statusOptions = []; statusOptions.push(task && task.status);
        if (dateParam) {
            let checkSave = false;
            let date = dateParam;
            let endDate = dateParam;
            let startDateTask = task.startDate;
            let prevDate = formatDate(startDateTask);

            let startTime = formatTime(new Date(startDateTask));
            let endTime = formatTime(new Date());

            let dentaDate = 0;
            let evaluations, prevEval;

            let splitter = dateParam.split("-");
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

            evaluations = task.evaluations.find(e => (monthOfEval === new Date(e.evaluatingMonth).getMonth() && yearOfEval === new Date(e.evaluatingMonth).getFullYear()));
            // prevEval = task.evaluations.find(e => ((monthOfPrevEval) === new Date(e.evaluatingMonth).getMonth() && yearOfPrevEval === new Date(e.evaluatingMonth).getFullYear()));
            prevEval = getPreviousEvaluation(task, dateParam);
            if (prevEval) {
                prevDate = formatDate(prevEval.endDate);
                startTime = formatTime(prevEval.endDate);
            }
            let automaticPoint = (evaluations && evaluations.results.length !== 0) ? evaluations.results[0].automaticPoint : undefined;
            let progress = evaluations ? evaluations.progress : 0;

            let cloneKpi = []
            if (hasAccountable === true && KPIPersonalManager && KPIPersonalManager.kpiSets) {
                cloneKpi = (KPIPersonalManager.kpiSets.kpis.filter(e => (e.type === 1)).map(x => { return x._id }));
            }

            let info = {};

            let infoEval = task.taskInformations;
            for (let i in infoEval) {
                if (infoEval[i].type === "date") {
                    if (infoEval[i].value) {
                        info[`${infoEval[i].code}`] = {
                            value: formatDate(infoEval[i].value),
                            code: infoEval[i].code,
                            type: infoEval[i].type
                        }
                    }
                    else {
                        info[`${infoEval[i].code}`] = {
                            // value: formatDate(Date.now()),
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
                    if (infoEval[i].value || infoEval[i].value === 0) {
                        info[`${infoEval[i].code}`] = {
                            value: infoEval[i].value,
                            code: infoEval[i].code,
                            type: infoEval[i].type
                        }
                    }
                }
            }

            let empPoint = {}, results = {}, endDateEval, timesheetLogs = [], duration = 0;
            let inactiveEmp = task.inactiveEmployees.map(e => e._id);

            // if (dateParam.toString().includes("-")) {
            //     endDateEval = convertDateTime(dateParam, state?.endTime);
            // } else {
            //     endDateEval = convertDateTime(state?.endDate, dateParam)
            // }

            if (task?.timesheetLogs?.length > 0) {
                timesheetLogs = task.timesheetLogs.filter(item => {
                    let startDateEval = evaluations?.startDate ? new Date(evaluations.startDate) : convertDateTime(prevDate, startTime)
                    let startedAt = item?.startedAt && new Date(item?.startedAt)
                    let stoppedAt = item?.stoppedAt && new Date(item?.stoppedAt)

                    if (item?.acceptLog
                        && (
                            (startedAt?.getTime() >= startDateEval?.getTime() && startedAt?.getTime() <= endDateEval?.getTime())
                            || (stoppedAt?.getTime() >= startDateEval?.getTime() && stoppedAt?.getTime() <= endDateEval?.getTime())
                        )
                    ) {
                        return true;
                    } else {
                        return false
                    }
                }).map(item => {
                    duration += item?.duration
                    return item
                })
            }

            for (let i in task.responsibleEmployees) {
                if (inactiveEmp.indexOf(task.responsibleEmployees[i]._id) === -1) {
                    let durationResponsible = 0
                    timesheetLogs?.length > 0 && timesheetLogs.filter(item => {
                        if (item?.acceptLog
                            && item?.creator?._id === task.responsibleEmployees[i]._id
                        ) {
                            return true
                        } else {
                            return false
                        }
                    }).map(item => {
                        durationResponsible += item?.duration
                    })

                    results[`approvedPointResponsible${task.responsibleEmployees[i]._id}`] = {
                        value: undefined,
                        employee: task.responsibleEmployees[i]._id,
                        role: "responsible",
                        target: "Point"
                    }
                    results[`contributeResponsible${task.responsibleEmployees[i]._id}`] = {
                        value: duration ? Number((durationResponsible / duration * 100).toFixed(0)) : 0,
                        employee: task.responsibleEmployees[i]._id,
                        role: "responsible",
                        target: "Contribution"
                    }
                }
            }
            for (let i in task.accountableEmployees) {
                if (inactiveEmp.indexOf(task.accountableEmployees[i]._id) === -1) {
                    let durationAccountable = 0
                    timesheetLogs.filter(item => {
                        if (item?.acceptLog
                            && item?.creator?._id === task.accountableEmployees[i]._id
                        ) {
                            return true
                        } else {
                            return false
                        }
                    }).map(item => {
                        durationAccountable += item?.duration
                    })

                    results[`approvedPoint${task.accountableEmployees[i]._id}`] = {
                        value: undefined,
                        employee: task.accountableEmployees[i]._id,
                        role: "accountable",
                        target: "Point"
                    }

                    let valueContribute = results[`contributeResponsible${task.accountableEmployees[i]._id}`]
                        ? 0
                        : (duration ? Number((durationAccountable / duration * 100).toFixed(0)) : 0)
                    results[`contributeAccountable${task.accountableEmployees[i]._id}`] = {
                        value: valueContribute,
                        employee: task.accountableEmployees[i]._id,
                        role: "accountable",
                        target: "Contribution"
                    }
                }
            }
            for (let i in task.consultedEmployees) {
                if (inactiveEmp.indexOf(task.consultedEmployees[i]._id) === -1) {
                    let durationConsulted = 0
                    timesheetLogs.filter(item => {
                        if (item?.acceptLog
                            && item?.creator?._id === task.consultedEmployees[i]._id
                        ) {
                            return true
                        } else {
                            return false
                        }
                    }).map(item => {
                        durationConsulted += item?.duration
                    })

                    results[`approvedPointConsulted${task.consultedEmployees[i]._id}`] = {
                        value: undefined,
                        employee: task.consultedEmployees[i]._id,
                        role: "consulted",
                        target: "Point"
                    }

                    let valueContribute = results[`contributeResponsible${task.consultedEmployees[i]._id}`] || results[`contributeAccountable${task.consultedEmployees[i]._id}`]
                        ? 0
                        : (duration ? Number((durationConsulted / duration * 100).toFixed(0)) : 0)
                    results[`contributeConsulted${task.consultedEmployees[i]._id}`] = {
                        value: valueContribute,
                        employee: task.consultedEmployees[i]._id,
                        role: "consulted",
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
                                    value: formatDate(infoEval[i].value),
                                    code: infoEval[i].code,
                                    type: infoEval[i].type
                                }
                            }
                            else {
                                info[`${infoEval[i].code}`] = {
                                    // value: formatDate(Date.now()),
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
                            if (infoEval[i].value || infoEval[i].value === 0) {
                                info[`${infoEval[i].code}`] = {
                                    value: infoEval[i].value,
                                    code: infoEval[i].code,
                                    type: infoEval[i].type
                                }
                            }
                        }
                    }

                }
            }


            let startDate = prevDate;
            if (evaluations) {
                endDate = formatDate(evaluations.endDate);
                startDate = formatDate(evaluations.startDate);
                startTime = formatTime(evaluations.startDate);
                endTime = formatTime(evaluations.endDate);
            }

            let taskInfo = {
                task: task,
                progress: progress,
                date: endDate,
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
        } else return {
            task: task,
            hasAccountable: hasAccountable,
            unit: unit,
            userId: idUser,
            statusOptions: statusOptions,
            info: {},
            empPoint: {},
            results: {},
            kpi: [],
        }
    }

    // hàm lấy thông tin từ thông tin công việc hiện tại
    const getInfo = (dateParam) => {
        let info = {};
        let checkSave = false;

        let date = dateParam;
        if (date) {
            let evaluation;
            let task = props.task;
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
                            value: formatDate(infoTask[i].value),
                            code: infoTask[i].code,
                            type: infoTask[i].type
                        }
                    }
                    else if (!infoTask[i].filledByAccountableEmployeesOnly) {
                        info[`${infoTask[i].code}`] = {
                            value: formatDate(Date.now()),
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
                    if (infoTask[i].value || infoTask[i].value === 0) {
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
                date: state.endDate,
                time: state.endTime,
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
        } else return {
            info: {},
            checkSave: checkSave,
        }
    }

    // hàm cập nhật thông tin 
    const updateInfo = async () => {
        let data = getInfo(state.storedEvaluatingMonth);
        setState({
            ...state,
            info: data.info,
            autoPoint: data.calcAuto,
            oldAutoPoint: data.autoPoint,
            progress: data.progress,
            checkSave: data.checkSave,
            indexReRender: state.indexReRender + 1,
        });
        setProgress(data.progress)
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

    // hàm cập nhật điểm tự đánh giá
    const handleChangePoint = async (e) => {
        let value = parseInt(e.target.value);
        await setState({
            ...state,
            point: value,
            errorOnPoint: validatePoint(value)
        })
    }

    // hàm cập nhật progress
    const handleChangeProgress = async (e) => {
        let { translate } = props;
        let msg;
        let value = parseInt(e.target.value);
        if (value < 0 || value > 100) {
            msg = translate('task.task_perform.modal_approve_task.err_range');
        }

        setProgress(value)
        setErrorOnProgress(msg)

        let taskInfo = {
            task: state.task,
            progress: value,
            date: state.endDate,
            time: state.endTime,
            info: state.info,
        };
        let automaticPoint = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo);
        if (isNaN(automaticPoint)) automaticPoint = undefined
        if (automaticPoint < 0) {
            automaticPoint = 0;
        };
        setState({
            ...state,
            autoPoint: automaticPoint,
            showAutoPointInfo: undefined
        });


    }

    // hàm cập nhật điểm tự động
    const handleChangeAutoPoint = async () => {
        let taskInfo = {
            task: state.task,
            progress: progress,
            date: state.endDate,
            time: state.endTime,
            info: state.info,
        };
        let automaticPoint = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo);
        if (isNaN(automaticPoint)) automaticPoint = undefined
        if (automaticPoint < 0) {
            automaticPoint = 0;
        };
        setState({
            ...state,
            autoPoint: automaticPoint,
            showAutoPointInfo: undefined
        });
    }

    const validateEvaluateResult = (value) => {
        let { translate } = props;
        let msg = undefined;
        if (value < 0 || value > 100) {
            msg = translate('task.task_perform.modal_approve_task.err_range');
        }
        return msg;
    }

    const validateEvaluateContribute = (value) => {
        let { translate } = props;
        let msg = undefined;
        let sum = calcSumContribution();
        if (value < 0 || value > 100) {
            msg = translate('task.task_perform.modal_approve_task.err_range');
        }
        return msg;
    }

    const validateSumContribute = () => {
        let { translate } = props;
        let msg = undefined;
        let res = calcSumContribution();
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
    const calcSumContribution = () => {
        let { results, task } = state;
        let sum = 0;
        let numOfContributor = 0;
        let checkAllEvalContribution = false;

        let numOfMember = 0;
        numOfMember = task?.accountableEmployees?.length + task?.responsibleEmployees?.length + task?.consultedEmployees?.length;

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
    const handleChangeAccountablePoint = async (e, id) => {
        let value = parseInt(e.target.value);
        let name = e.target.name
        await setState(state => {
            state.results[`${name}`] = {
                value: value,
                employee: id,
                role: "accountable",
                target: "Point"
            }
            if (id === state.userId) state.empPoint[`accountable${id}`] = value;
            state.errorApprovedPoint[`accountable${id}`] = validateEvaluateResult(value);
            return {
                ...state,
            }
        })
    }

    const handleChangeAccountableContribution = async (e, id) => {
        let value = parseInt(e.target.value);
        let name = e.target.name;
        await setState(state => {
            state.results[`${name}`] = {
                value: value,
                employee: id,
                role: "accountable",
                target: "Contribution"
            }
            state.errorContribute[`accountable${id}`] = validateEvaluateContribute(value);
            return {
                ...state,
                errSumContribution: validateSumContribute(),
            }
        })
    }

    const handleChangeApprovedPointForResponsible = async (e, id) => {
        let value = parseInt(e.target.value);
        let name = e.target.name
        await setState(state => {
            state.results[`${name}`] = {
                value: isNaN(value) ? undefined : value,
                employee: id,
                role: "responsible",
                target: "Point"
            }
            if (props.hasAccountable === false && id === state.userId) state.empPoint[`responsible${id}`] = value;
            state.errorApprovedPoint[`responsible${id}`] = validateEvaluateResult(value);
            return {
                ...state,
            }
        })
    }

    const handleChangeResponsibleContribution = async (e, id) => {
        let value = parseInt(e.target.value);
        let name = e.target.name;
        await setState(state => {
            state.results[`${name}`] = {
                value: isNaN(value) ? undefined : value,
                employee: id,
                role: "responsible",
                target: "Contribution"
            }
            state.errorContribute[`responsible${id}`] = validateEvaluateContribute(value);
            return {
                ...state,
                errSumContribution: validateSumContribute(),
            }
        })
    }

    const handleChangeApprovedPointForConsulted = async (e, id) => {
        let value = parseInt(e.target.value);
        let name = e.target.name
        await setState(state => {
            state.results[`${name}`] = {
                value: value,
                employee: id,
                role: "consulted",
                target: "Point"
            }
            state.errorApprovedPoint[`consulted${id}`] = validateEvaluateResult(value);
            return {
                ...state,
            }
        })
    }

    const handleChangeConsultedContribution = async (e, id) => {
        let value = parseInt(e.target.value);
        let name = e.target.name;
        await setState(state => {
            state.results[`${name}`] = {
                value: value,
                employee: id,
                role: "consulted",
                target: "Contribution"
            }
            state.errorContribute[`consulted${id}`] = validateEvaluateContribute(value);
            return {
                ...state,
                errSumContribution: validateSumContribute(),
            }
        })
    }

    const handleChangeMyPoint = async (e) => {
        let value = parseInt(e.target.value);
        await setState({
            ...state,
            myPoint: value,
            errorOnMyPoint: validatePoint(value)
        })
    }

    const onContributeChange = async (e, id) => {
        let { name, value } = e.target;
        await setState(state => {
            state.results[`${name}`] = {
                value: value,
                employee: id,
            }
            return {
                ...state,
            }
        });
    }

    const onApprovedPointChange = async (e, id) => {
        let { name, value } = e.target;
        await setState(state => {
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
    const handleChangeNumberInfo = async (e) => {
        let value = parseInt(e.target.value);
        let name = e.target.name;
        await setState(state => {
            state.info[`${name}`] = {
                value: value,
                code: name,
                type: 'number'
            }
            state.errorInfo[name] = validateNumberInfo(value);
            return {
                ...state,
            }
        })
        await handleChangeAutoPoint();
    }

    // hàm cập nhật ttin văn bản
    const handleChangeTextInfo = async (e) => {
        let value = e.target.value;
        let name = e.target.name;
        await setState(state => {
            state.info[`${name}`] = {
                value: value,
                code: name,
                type: 'text'
            }
            state.errorInfo[name] = validateTextInfo(value);
            return {
                ...state,
            }
        })
    }


    // hàm validate thoogn tin ngày tháng
    const handleInfoDateChange = (value, code) => {
        setState(state => {
            state.info[`${code}`] = {
                value: value,
                code: code,
                type: 'date'
            }
            state.errorInfo[code] = validateDate(value);
            return {
                ...state,
            }
        });
    }

    // hàm validate ttin boolean
    const handleInfoBooleanChange = (event) => {
        let { name, value } = event.target;
        setState(state => {
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
    const validateDate = (value, willUpdateState = true) => {
        let { translate } = props;
        let msg = undefined;
        if (value.trim() === "") {
            msg = translate('task.task_perform.modal_approve_task.err_empty');
        }

        return msg;
    }

    // hàm validate ttin van bản
    const validateTextInfo = (value) => {
        let { translate } = props;
        let msg = undefined;
        if (value === "") {
            // msg = translate('task.task_perform.modal_approve_task.err_empty')
        }
        return msg;
    }

    // hàm validate số
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

    // hàm cập nhật ttin số
    const validateNumberInfo = (value) => {
        let { translate } = props;
        let msg = undefined;

        if (isNaN(value)) {
            // msg = translate('task.task_perform.modal_approve_task.err_empty');
        }
        return msg;
    }


    const validateInfoBoolean = (value) => {
        let { translate } = props;
        let msg = undefined;
        if (value.indexOf("") !== -1) {
            // msg = translate('task.task_perform.modal_approve_task.err_empty');
        }

        return msg;
    }


    // hàm cập nhật thông tin tập giá trị
    const handleSetOfValueChange = async (value, code) => {
        setState(state => {
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
    const handleChangeSaveInfo = async (e) => {
        let { checked } = e.target;
        await setState({
            ...state,
            checkSave: checked,
        });
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
            kpi: []
        });
        props.getAllKpiSetsOrganizationalUnitByMonth(state.userId, value[0], state.storedEvaluatingMonth);
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
            indexReRender: state.indexReRender + 1,
        });
    }

    // hàm cập nhật ngày đánh giá hiện tại
    const handleEndDateChange = (value) => {
        let { translate } = props;

        let { evaluatingMonth, endDate, startDate, endTime, startTime, userId } = state;

        let err = validateDateTime(evaluatingMonth, startDate, startTime, value, endTime, "end");

        let data = getData(value, state.storedEvaluatingMonth);
        // props.getAllKpiSetsOrganizationalUnitByMonth(userId, unit, value);

        let automaticPoint = data.automaticPoint;
        let taskInfo = {
            task: data.task,
            progress: progress,
            date: value,
            time: state.endTime,
            info: state.info,
        };

        automaticPoint = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo);
        if (isNaN(automaticPoint)) automaticPoint = undefined
        if (automaticPoint < 0) automaticPoint = 0;

        setState({
            ...state,
            errorOnEndDate: err,
            endDate: value,
            // empPoint: data.empPoint,
            autoPoint: automaticPoint,
            oldAutoPoint: data.automaticPoint,
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
            progress: progress,
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
            errorOnEndDate: err,
            oldAutoPoint: data.automaticPoint,
            indexReRender: state.indexReRender + 1,
        });
    }

    function convertDateTime(date, time) {
        let splitter = date?.split("-");
        let strDateTime = `${splitter[2]}/${splitter[1]}/${splitter[0]} ${time}`;
        return new Date(strDateTime);
    }

    // hàm cập nhật tháng đánh giá
    function handleMonthOfEvaluationChange(value) {
        // indexReRender = indexReRender + 1;
        let { translate } = props;
        let { userId, evaluatingMonth, task, endDate, startDate, endTime, startTime } = state;
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

        let automaticPoint = data.automaticPoint;
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
            empPoint: data.empPoint,
            results: data.results,
            errorOnDate: err,
            errorOnMonth: errMonth,
            indexReRender: state.indexReRender + 1,

            info: data.info,
            progress: data.progress,
            date: data.date,
            checkSave: data.checkSave,
            prevDate: data.prevDate,
            dentaDate: data.dentaDate,
            evaluation: data.evaluation,
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
    const getEndTask = async () => {
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
            progress: progress,
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
        const { evaluatingMonth, errorOnMonth, errorOnDate, errorOnEndDate, errorOnStartDate, errorOnPoint, errorOnAccountablePoint, errorOnAccountableContribution, errorOnMyPoint,
            errorOnInfoDate, errorOnInfoBoolean, errorOnNumberInfo, errorOnTextInfo, errorApprovedPoint, errorContribute, errSumContribution } = state;
        let { info, results, empPoint, progress, } = state;

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

        return evaluatingMonth && evaluatingMonth.trim() !== "" && checkErrorApprovedPoint && checkErrorContribute && (errorOnStartDate === undefined && errorOnEndDate === undefined && errorOnMonth === undefined && errorOnDate === undefined && errorOnPoint === undefined
            && errorOnInfoDate === undefined && errorOnAccountablePoint === undefined && errorOnProgress === undefined
            && errorOnAccountableContribution === undefined && errorOnMyPoint === undefined && errSumContribution === undefined
            && errorOnInfoBoolean === undefined && errorOnNumberInfo === undefined && errorOnTextInfo === undefined) ? true : false;
    }

    // hàm hiển thị modal show autopoint
    const handleShowAutomaticPointInfo = async () => {
        await setState({
            ...state,
            showAutoPointInfo: 1
        });
        window.$(`#modal-automatic-point-info`).modal('show');

    }

    // format vai trò multi language
    const formatRole = (data) => {
        const { translate } = props;
        if (data === "consulted") return translate('task.task_management.consulted');
        if (data === "accountable") return translate('task.task_management.accountable');
        if (data === "responsible") return translate('task.task_management.responsible');
    }

    // format tháng
    const formatMonth = (date) => {
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

    const checkHasEval = (date, performtasks) => {
        let monthOfEval;
        let yearOfEval;
        if (date) {
            let splitter = date.split("-");
            let dateOfEval = new Date(splitter[2], splitter[1] - 1, splitter[0]);

            monthOfEval = dateOfEval.getMonth();
            yearOfEval = dateOfEval.getFullYear();
        }

        let taskId, evaluation;
        taskId = performtasks.task?._id;
        evaluation = performtasks.task?.evaluations.find(e => (monthOfEval === new Date(e.evaluatingMonth).getMonth() && yearOfEval === new Date(e.evaluatingMonth).getFullYear()));

        if (evaluation) return true;
        return false;
    }

    // hàm delete 
    const deleteEval = async () => {
        let { translate, date, performtasks } = props;
        let { storedEvaluatingMonth } = state;
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

                await props.deleteEvaluation(taskId, evaluationId);
                props.handleChangeDataStatus(1); // 1 = DATA_STATUS.QUERYING
            }
        });
    }

    // hàm submit
    const save = async () => {
        let taskId;
        taskId = state.task._id;
        let startDateTask = convertDateTime(state.startDate, state.startTime);
        let endDateTask = convertDateTime(state.endDate, state.endTime);
        let data = {
            user: getStorage("userId"),
            progress: progress,
            automaticPoint: state.autoPoint,
            role: "accountable",
            hasAccountable: state.hasAccountable,

            evaluatingMonth: state.storedEvaluatingMonth,
            // date: state.date,
            startDate: startDateTask,
            endDate: endDateTask,
            // startDate: state.startDate,
            // endDate: state.endDate,

            info: state.info,
            results: state.results,
            checkSave: state.checkSave,

            kpi: state.kpi,
            unit: state.unit,
        }

        await props.evaluateTaskByAccountableEmployees(data, taskId);

        setState({
            ...state,
            oldAutoPoint: state.autoPoint,
        });
        // props.handleChangeDataStatus(1); // 1 = DATA_STATUS.QUERYING
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

    // hàm kiểm tra NULL, UNDEFINED
    const checkNullUndefined = (x) => {
        if (x === null || x === undefined) {
            return false;
        }
        else return true;
    }

    let listKpi = [];
    if (KPIPersonalManager && KPIPersonalManager.kpiSets) {
        listKpi = KPIPersonalManager.kpiSets.kpis;
    }

    let listUnits = [];
    if (user.organizationalUnitsOfUser && user.organizationalUnitsOfUser.length > 0) {
        listUnits = user.organizationalUnitsOfUser.map(x => { return { value: x._id, text: x.name } });
    }

    let taskActions = task.taskActions;
    let actionsNotRating;
    if (date) {
        let splitter = date.split('-');
        let evaluationsDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
        actionsNotRating = taskActions.filter(item => (
            item.rating === -1 &&
            new Date(item.createdAt).getMonth() === evaluationsDate.getMonth()
            && new Date(item.createdAt).getFullYear() === evaluationsDate.getFullYear()
        ))
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
                            {(checkHasEval(storedEvaluatingMonth, performtasks) && !errorOnMonth && role === "accountable") && <button style={{ marginRight: '5px' }} className="btn btn-danger" onClick={deleteEval}>{translate('task.task_management.delete_eval')}</button>}
                            <button disabled={disabled || disableSubmit} className="btn btn-success" onClick={save}>{translate('task.task_management.btn_save_eval')}</button>
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
                                            onChange={handleMonthOfEvaluationChange}
                                            disabled={isEval}
                                            dateFormat={"month-year"}
                                        />
                                        <ErrorLabel content={errorOnMonth} />
                                    </div>
                                </div>
                            </div>
                            {evaluatingMonth &&
                                <div className="row">
                                    {/* ngày đánh giá tháng trc hoặc ngày bắt đầu làm việc */}
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
                                    {/* ngày đánh giá */}
                                    <div className={`form-group col-md-6 ${errorOnEndDate === undefined ? "" : "has-error"}`}>
                                        <label>
                                            {translate('task.task_management.eval_to')}<span className="text-red">*</span>
                                            <span className="pull-right" style={{ fontWeight: "normal", marginLeft: 10 }}>
                                                <a style={{ cursor: "pointer" }} onClick={() => getEndTask()}>Lấy thời điểm kết thúc công việc</a>
                                            </span>
                                        </label>
                                        <DatePicker
                                            id={`end_date_${perform}-${id}`}
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
                                        onChange={handleKpiChange}
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

                                handleChangeProgress={handleChangeProgress}
                                handleInfoBooleanChange={handleInfoBooleanChange}
                                handleInfoDateChange={handleInfoDateChange}
                                handleSetOfValueChange={handleSetOfValueChange}
                                handleChangeNumberInfo={handleChangeNumberInfo}
                                handleChangeTextInfo={handleChangeTextInfo}
                                handleChangeSaveInfo={handleChangeSaveInfo}
                                updateInfo={updateInfo}

                                indexReRender={indexReRender}

                                role={role}
                                perform={perform}
                                id={id}
                                value={state}
                                progress={progress}
                                errorOnProgress={errorOnProgress}
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
                                        <a style={{ cursor: "pointer" }} id={`autoPoint-${perform}`} onClick={() => handleShowAutomaticPointInfo()}>
                                            {checkNullUndefined(autoPoint) ? autoPoint : translate('task.task_management.detail_not_calc_auto_point')}
                                        </a>
                                    </div>
                                    <div>
                                        <strong>{translate('task.task_management.detail_auto_on_system')}: &nbsp;</strong>
                                        <a style={{ color: "black" }}>
                                            {checkNullUndefined(oldAutoPoint) ? oldAutoPoint : translate('task.task_management.detail_not_calc_auto_point')}
                                        </a>
                                    </div>
                                    <div>
                                        <strong>{translate('task.task_management.action_not_rating')}:&nbsp;&nbsp;</strong>
                                        {
                                            actionsNotRating?.length === 0 ? translate('task.task_management.no_action') :
                                                <ShowMoreShowLess
                                                    id={`actionsNotRating${id}`}
                                                    styleShowMoreLess={{ display: "inline-block", marginBottom: 15, marginTop: 15 }}
                                                >
                                                    {actionsNotRating?.map((item, index) => (
                                                        <div className={`item-box ${index > 3 ? "hide-component" : ""}`}>
                                                            <span key={index}>
                                                                ({index + 1})&nbsp;&nbsp;
                                                                <QuillEditor
                                                                    id={`evaluateByAccountable${item._id}${props.id}`}
                                                                    quillValueDefault={item.description}
                                                                    isText={true}
                                                                />
                                                            </span>
                                                        </div>
                                                    ))}
                                                </ShowMoreShowLess>
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
                                    <table className="table table-striped table-hover not-sort">
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

                                        {//Chấm điểm phê duyệt cho người thực hiện
                                            task && task.responsibleEmployees.map((item, index) =>
                                            (task.inactiveEmployees.indexOf(item._id) === -1 &&
                                                <tr key={index} style={{ verticalAlign: "top" }}>
                                                    <td><div style={{ marginTop: 10 }}>{item.name}</div></td>
                                                    <td><div style={{ marginTop: 10 }}>{formatRole('responsible')}</div></td>
                                                    <td><div style={{ marginTop: 10 }}>{checkNullUndefined(empPoint[`responsible${item._id}`]) ? empPoint[`responsible${item._id}`] : translate('task.task_management.not_eval')}</div></td>
                                                    <td style={{ padding: 5 }}>
                                                        <div className={errorContribute[`responsible${item._id}`] === undefined ? "form-group" : "form-group has-error"}>
                                                            <input className='form-control'
                                                                value={checkNullUndefined(results[`contributeResponsible${item._id}`]?.value) ? results[`contributeResponsible${item._id}`].value : ''}
                                                                type="number" name={`contributeResponsible${item._id}`} placeholder={"% " + translate('task.task_management.contribution')}
                                                                onChange={(e) => handleChangeResponsibleContribution(e, item._id)}
                                                                disabled={disabled}
                                                            />
                                                            <ErrorLabel content={errorContribute ? errorContribute[`responsible${item._id}`] : ''} />
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: 5 }}>
                                                        <div className={errorApprovedPoint[`responsible${item._id}`] === undefined ? "form-group" : "form-group has-error"}>
                                                            <input className='form-control' type="number"
                                                                value={checkNullUndefined(results[`approvedPointResponsible${item._id}`]?.value) ? results[`approvedPointResponsible${item._id}`].value : ''}
                                                                name={`approvedPointResponsible${item._id}`} placeholder={translate('task.task_management.detail_acc_point')}
                                                                onChange={(e) => handleChangeApprovedPointForResponsible(e, item._id)}
                                                                disabled={disabled}
                                                            />
                                                            <ErrorLabel content={errorApprovedPoint ? errorApprovedPoint[`responsible${item._id}`] : ''} />
                                                        </div>

                                                    </td>
                                                </tr>
                                            )

                                            )
                                        }

                                        {// Chấm điểm phê duyệt cho người tư vấn
                                            task && task.consultedEmployees && task.consultedEmployees.map((item, index) =>
                                            (task.inactiveEmployees.indexOf(item._id) === -1 &&
                                                <tr key={index} style={{ verticalAlign: "top" }}>
                                                    <td><div style={{ marginTop: 10 }}>{item.name}</div></td>
                                                    <td><div style={{ marginTop: 10 }}>{formatRole('consulted')}</div></td>
                                                    <td><div style={{ marginTop: 10 }}>{checkNullUndefined(empPoint[`consulted${item._id}`]) ? empPoint[`consulted${item._id}`] : translate('task.task_management.not_eval')}</div></td>
                                                    <td style={{ padding: 5 }}>
                                                        <div className={errorContribute[`consulted${item._id}`] === undefined ? "form-group" : "form-group has-error"}>
                                                            <input className='form-control' type="number"
                                                                value={checkNullUndefined(results[`contributeConsulted${item._id}`]?.value) ? results[`contributeConsulted${item._id}`].value : ''}
                                                                name={`contributeConsulted${item._id}`} placeholder={"% " + translate('task.task_management.contribution')}
                                                                onChange={(e) => handleChangeConsultedContribution(e, item._id)}
                                                                disabled={disabled}
                                                            />
                                                            <ErrorLabel content={errorContribute ? errorContribute[`consulted${item._id}`] : ''} />
                                                        </div>

                                                    </td>
                                                    <td style={{ padding: 5 }}>
                                                        <div className={errorApprovedPoint[`consulted${item._id}`] === undefined ? "form-group" : "form-group has-error"}>
                                                            <input className='form-control' type="number"
                                                                value={checkNullUndefined(results[`approvedPointConsulted${item._id}`]?.value) ? results[`approvedPointConsulted${item._id}`].value : ''}
                                                                name={`approvedPointConsulted${item._id}`} placeholder={translate('task.task_management.detail_acc_point')}
                                                                onChange={(e) => handleChangeApprovedPointForConsulted(e, item._id)}
                                                                disabled={disabled}
                                                            />
                                                            <ErrorLabel content={errorApprovedPoint ? errorApprovedPoint[`consulted${item._id}`] : ''} />
                                                        </div>

                                                    </td>
                                                </tr>
                                            )

                                            )
                                        }

                                        {// Chấm điểm phê duyệt cho người phê duyệt
                                            task && task.accountableEmployees.map((item, index) =>
                                            (task.inactiveEmployees.indexOf(item._id) === -1 &&
                                                <tr key={index} style={{ verticalAlign: "top" }}>
                                                    <td><div style={{ marginTop: 10 }}>{item.name}</div></td>
                                                    <td><div style={{ marginTop: 10 }}>{formatRole('accountable')}</div></td>
                                                    <td><div style={{ marginTop: 10 }}><p id={`accountablePoint${item._id}`}>{checkNullUndefined(empPoint[`accountable${item._id}`]) ? empPoint[`accountable${item._id}`] : translate('task.task_management.not_eval')}</p></div></td>
                                                    <td style={{ padding: 5 }}>
                                                        <div className={errorContribute[`accountable${item._id}`] === undefined ? "form-group" : "form-group has-error"}>
                                                            <input className='form-control' type="number"
                                                                value={checkNullUndefined(results[`contributeAccountable${item._id}`]?.value) ? results[`contributeAccountable${item._id}`].value : ''}
                                                                name={`contributeAccountable${item._id}`} placeholder={"% " + translate('task.task_management.contribution')}
                                                                onChange={(e) => handleChangeAccountableContribution(e, item._id)}
                                                                disabled={disabled}
                                                            />
                                                            <ErrorLabel content={errorContribute ? errorContribute[`accountable${item._id}`] : ''} />
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: 5 }}>
                                                        <div className={errorApprovedPoint[`accountable${item._id}`] === undefined ? "form-group" : "form-group has-error"}>
                                                            <input
                                                                className="form-control"
                                                                type="number"
                                                                value={checkNullUndefined(results[`approvedPoint${item._id}`]?.value) ? results[`approvedPoint${item._id}`].value : ''}
                                                                name={`approvedPoint${item._id}`}
                                                                placeholder={translate('task.task_management.detail_acc_point')}
                                                                onChange={(e) => handleChangeAccountablePoint(e, item._id)}
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

const mapState = (state) => {
    const { tasks, performtasks, KPIPersonalManager, user } = state;
    return { tasks, performtasks, KPIPersonalManager, user };
}
const getState = {
    deleteEvaluation: performTaskAction.deleteEvaluation,
    evaluateTaskByAccountableEmployees: performTaskAction.evaluateTaskByAccountableEmployees,
    getAllKpiSetsOrganizationalUnitByMonth: managerKpiActions.getAllKpiSetsOrganizationalUnitByMonth,
}

const evaluateByAccountableEmployee = connect(mapState, getState)(withTranslate(EvaluateByAccountableEmployee));
export { evaluateByAccountableEmployee as EvaluateByAccountableEmployee }
