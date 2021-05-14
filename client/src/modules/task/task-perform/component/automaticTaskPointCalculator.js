import moment from 'moment';
import Swal from 'sweetalert2';
import { getDurationWithoutSatSun, MILISECS_TO_HOURS } from '../../../project/component/projects/functionHelper';
var mexp = require('math-expression-evaluator'); // native js package

export const AutomaticTaskPointCalculator = {
    calcAutoPoint,
    calcProjectAutoPoint,
    getAmountOfWeekDaysInMonth,
    calcProjectTaskMemberAutoPoint,
    calcProjectTaskPoint,
    calcProjectMemberPoint,
    convertIndexPointToNormalPoint,
}

const MILISECS_TO_DAYS = 86400000;

// Replaces all instances of the given substring.
String.prototype.replaceAll = function (
    strTarget, // The substring you want to replace
    strSubString // The string you want to replace in.
) {
    let strText = this;
    let intIndexOfMatch = strText.indexOf(strTarget);

    while (intIndexOfMatch != -1) { // có thể bị lặp vô hạn vì có trường hợp thay x = x
        strText = strText.replace(strTarget, strSubString)
        intIndexOfMatch = strText.indexOf(strTarget);
    }

    return (strText);
}

const calculateExpression = (expression) => {
    try {
        // let point = eval(expression);

        let token1 = {
            type: 2,
            token: "/",
            show: "/",
            value: function (f1, f2) {
                if (f2 === 0) return 0;
                else
                    return f1 / f2;
            }
        }

        let point = mexp.eval(expression, [token1]);
        return point;
    } catch (err) {
        return null;
    }
}

const convertDateTime = (date, time) => {
    if (date) {
        let splitter = date.split("-");
        let strDateTime = `${splitter[2]}-${splitter[1]}-${splitter[0]} ${time}`;
        return new Date(strDateTime);
    } else {
        return new Date();
    }

}

function calcAutoPoint(data) {
    let { task, date, time, progress, info } = data;

    // let splitter = date.split('-');
    let progressTask = (progress !== null && progress !== undefined) ? progress : undefined;
    // let evaluationsDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
    let evaluationsDate = convertDateTime(date, time);
    let startDate = new Date(task.startDate);
    let endDate = new Date(task.endDate);

    let totalDays = endDate.getTime() - startDate.getTime(); // + 86400000 === + 1 ngày -> do công việc làm theo giờ, nên tính theo giờ, vì thế k cần cộng 1 ngày nữa 
    let daysUsed = evaluationsDate.getTime() - startDate.getTime(); // + 86400000
    let daysOverdue = (daysUsed - totalDays > 0) ? daysUsed - totalDays : 0;


    // chuyển về đơn vị ngày
    totalDays = totalDays / 86400000;
    daysUsed = daysUsed / 86400000;
    daysOverdue = daysOverdue / 86400000;

    if (daysUsed <= 0) daysUsed = 0.5;

    // Tính điểm theo độ trễ ngày tương đối
    let autoDependOnDay = progressTask / (daysUsed / totalDays); // tiến độ thực tế / tiến độ lí thuyết

    // Các hoạt động (chỉ lấy những hoạt động đã đánh giá)
    let taskActions = task.taskActions;
    let actions = taskActions.filter(item => (
        item.rating !== -1 &&
        new Date(item.createdAt).getMonth() === evaluationsDate.getMonth()
        && new Date(item.createdAt).getFullYear() === evaluationsDate.getFullYear()
    ))

    // Tổng số hoạt động
    let a = 0;
    a = actions.length;

    // Tổng số điểm của các hoạt động * độ quan trọng từng hoạt động
    let reduceAction = {
        rating: 0,
        actionImportanceLevel: 0
    }
    actions.map((item) => {
        reduceAction.rating = reduceAction?.rating + item?.rating * item?.actionImportanceLevel
        reduceAction.actionImportanceLevel = reduceAction?.actionImportanceLevel + item?.actionImportanceLevel
    });

    reduceAction.rating = reduceAction?.rating > 0 ? reduceAction.rating : 0;
    reduceAction.actionImportanceLevel = reduceAction?.actionImportanceLevel > 0 ? reduceAction.actionImportanceLevel : 10 * a;

    let averageActionRating = !a ? 10 : reduceAction.rating / reduceAction.actionImportanceLevel; // a = 0 thì avg mặc định là 10
    let autoHasActionInfo = progress / (daysUsed / totalDays) - 0.5 * (10 - (averageActionRating)) * 10;
    let automaticPoint = 0;
    let sumRatingOfFailedActions = 0, sumRatingOfAllActions = 0;

    actions.map((item) => {
        if (item.rating < 5) {
            sumRatingOfFailedActions = sumRatingOfFailedActions + item.rating * item.actionImportanceLevel
        }
        sumRatingOfAllActions = sumRatingOfAllActions + item.rating * item.actionImportanceLevel
    });

    if (!task.formula) {
        if (task.taskTemplate === null || task.taskTemplate === undefined) { // Công việc không theo mẫu
            automaticPoint = a ? autoHasActionInfo : autoDependOnDay;
        }
        else { // Công việc theo mẫu
            let formula = task.taskTemplate.formula;
            let taskInformations = info;

            // thay các biến bằng giá trị
            formula = formula.replace(/daysOverdue/g, `(${daysOverdue})`);
            formula = formula.replace(/totalDays/g, `(${totalDays})`);
            formula = formula.replace(/daysUsed/g, `(${daysUsed})`);
            formula = formula.replace(/averageActionRating/g, `(${averageActionRating})`);
            formula = formula.replace(/sumRatingOfFailedActions/g, `${sumRatingOfFailedActions}`);
            formula = formula.replace(/sumRatingOfAllActions/g, `${sumRatingOfAllActions}`);
            formula = formula.replace(/progress/g, `(${progressTask})`);

            // thay mã code bằng giá trị(chỉ dùng cho kiểu số)
            for (let i in taskInformations) {
                if (taskInformations[i].type === 'number') {
                    let stringToGoIntoTheRegex = `${taskInformations[i].code}`;
                    let regex = new RegExp(stringToGoIntoTheRegex, "g");
                    formula = formula.replace(regex, `(${taskInformations[i].value})`);
                }
            }

            // thay tất cả các biến có dạng p0, p1, p2,... còn lại thành undefined, để nếu không có giá trị thì sẽ trả về NaN, tránh được lỗi undefined
            for (let i = 0; i < 100; i++) {
                let stringToGoIntoTheRegex = 'p' + i;
                let regex = new RegExp(stringToGoIntoTheRegex, "g");
                formula = formula.replace(regex, undefined);
            }

            // automaticPoint = 1;
            automaticPoint = calculateExpression(formula);
        }
    }
    else {
        let formula;
        if (!task.taskTemplate && !task.process) { // Công việc không theo mẫu và ko theo quy trình
            // automaticPoint = a ? autoHasActionInfo : autoDependOnDay;
            formula = task.formula;
            let taskInformations = info;

            formula = formula.replace(/daysOverdue/g, `(${daysOverdue})`);
            formula = formula.replace(/totalDays/g, `(${totalDays})`);
            formula = formula.replace(/daysUsed/g, `(${daysUsed})`);
            formula = formula.replace(/averageActionRating/g, `(${averageActionRating})`);
            formula = formula.replace(/sumRatingOfFailedActions/g, `${sumRatingOfFailedActions}`);
            formula = formula.replace(/sumRatingOfAllActions/g, `${sumRatingOfAllActions}`);
            formula = formula.replace(/progress/g, `(${progressTask})`);

            // thay mã code bằng giá trị(chỉ dùng cho kiểu số)
            for (let i in taskInformations) {
                if (taskInformations[i].type === 'number') {
                    let stringToGoIntoTheRegex = `${taskInformations[i].code}`;
                    let regex = new RegExp(stringToGoIntoTheRegex, "g");
                    formula = formula.replace(regex, `(${taskInformations[i].value})`);
                }
            }

            // thay tất cả các biến có dạng p0, p1, p2,... còn lại thành undefined, để nếu không có giá trị thì sẽ trả về NaN, tránh được lỗi undefined
            for (let i = 0; i < 100; i++) {
                let stringToGoIntoTheRegex = 'p' + i;
                let regex = new RegExp(stringToGoIntoTheRegex, "g");
                formula = formula.replace(regex, undefined);
            }
        }
        else {
            formula = task.formula
            let taskInformations = info;

            // thay các biến bằng giá trị
            formula = formula.replace(/daysOverdue/g, `(${daysOverdue})`);
            formula = formula.replace(/totalDays/g, `(${totalDays})`);
            formula = formula.replace(/daysUsed/g, `(${daysUsed})`);
            formula = formula.replace(/averageActionRating/g, `(${averageActionRating})`);
            formula = formula.replace(/sumRatingOfFailedActions/g, `${sumRatingOfFailedActions}`);
            formula = formula.replace(/sumRatingOfAllActions/g, `${sumRatingOfAllActions}`);
            formula = formula.replace(/progress/g, `(${progressTask})`);

            // thay mã code bằng giá trị(chỉ dùng cho kiểu số)
            for (let i in taskInformations) {
                if (taskInformations[i].type === 'number') {
                    let stringToGoIntoTheRegex = `${taskInformations[i].code}`;
                    let regex = new RegExp(stringToGoIntoTheRegex, "g");
                    formula = formula.replace(regex, `(${taskInformations[i].value})`);
                }
            }

            // thay tất cả các biến có dạng p0, p1, p2,... còn lại thành undefined, để nếu không có giá trị thì sẽ trả về NaN, tránh được lỗi undefined
            for (let i = 0; i < 100; i++) {
                let stringToGoIntoTheRegex = 'p' + i;
                let regex = new RegExp(stringToGoIntoTheRegex, "g");
                formula = formula.replace(regex, undefined);
            }
        }

        automaticPoint = calculateExpression(formula);
    }

    return Math.round(Math.min(automaticPoint, 100));
}

function getAmountOfWeekDaysInMonth(date) {
    let result = 0;
    for (var i = 1; i < 6; i++) {
        date.date(1);
        var dif = (7 + (i - date.weekday())) % 7 + 1;
        result += Math.floor((date.daysInMonth() - dif) / 7) + 1;
    }
    return result;
}

function convertIndexPointToNormalPoint(indexPoint) {
    if (!indexPoint || indexPoint === Infinity || Number.isNaN(indexPoint) || indexPoint < 0.5) return 0;
    else if (indexPoint >= 0.5 && indexPoint < 0.75) return 40;
    else if (indexPoint >= 0.75 && indexPoint < 1) return 60;
    else if (indexPoint >= 1 && indexPoint < 1.25) return 80;
    else if (indexPoint >= 1.25 && indexPoint < 1.5) return 90;
    else return 100;
}

function calcProjectTaskPoint(data, getCalcPointsOnly = true) {
    // console.log('\n--------------');
    const { task, progress, projectDetail, currentTaskActualCost, info } = data;
    const { timesheetLogs, estimateNormalCost, startDate, endDate, actorsWithSalary, responsibleEmployees, estimateAssetCost, accountableEmployees } = task;
    /***************** Yếu tố tiến độ **********************/
    const usedDuration = getDurationWithoutSatSun(task.startDate, moment().format(), 'milliseconds');
    const totalDuration = task.estimateNormalTime;
    const schedulePerformanceIndex = (Number(progress) / 100) / (usedDuration / totalDuration);
    const taskTimePoint = convertIndexPointToNormalPoint(schedulePerformanceIndex) * (task?.timeWeight || 0.25);
    // console.log('taskTimePoint', taskTimePoint)
    /***************** Yếu tố chất lượng **********************/
    // Các hoạt động (chỉ lấy những hoạt động đã đánh giá của người phê duyệt)
    let actionsHasRating = task.taskActions.filter(item => (
        item.rating && item.rating !== -1
    ))
    let sumRatingOfPassedActions = 0, sumRatingOfAllActions = 0;
    actionsHasRating.length > 0 && actionsHasRating.map((item) => {
        const currentActionImportanceLevel = item.actionImportanceLevel && item.actionImportanceLevel > 0 ? item.actionImportanceLevel : 10;
        if (item.rating >= 5) {
            sumRatingOfPassedActions = sumRatingOfPassedActions + item.rating * currentActionImportanceLevel;
        }
        sumRatingOfAllActions = sumRatingOfAllActions + item.rating * currentActionImportanceLevel;
    });
    const taskQualityPoint = sumRatingOfAllActions === 0
        ? 0
        : [(sumRatingOfPassedActions / sumRatingOfAllActions) * 100] * (task?.qualityWeight || 0.25);
    // console.log('taskQualityPoint', taskQualityPoint)
    /***************** Yếu tố chi phí **********************/
    let actualCost = 0;
    if (currentTaskActualCost) actualCost = Number(currentTaskActualCost);
    else if (task?.actualCost) actualCost = Number(task.actualCost);
    const costPerformanceIndex = ((Number(progress) / 100) * estimateNormalCost) / (actualCost);
    const taskCostPoint = convertIndexPointToNormalPoint(costPerformanceIndex) * (task?.costWeight || 0.25);
    // console.log('taskCostPoint', taskCostPoint)
    /***************** Yếu tố chuyên cần **********************/
    let totalTimeLogs = 0;
    if (timesheetLogs && timesheetLogs.length > 0) {
        for (let timeSheetItem of timesheetLogs) {
            totalTimeLogs += timeSheetItem.duration;
        }
    }
    const taskDilligencePoint = Math.min((totalTimeLogs / totalDuration) * 100 * (task?.dilligenceWeight || 0.25), 100);
    // console.log('taskDilligencePoint', taskDilligencePoint)
    let autoTaskPoint = 0;
    let formula;
    if (task.formulaProjectTask) {
        formula = task.formulaProjectTask;
        const taskInformations = info;

        formula = formula.replace(/taskTimePoint/g, `(${taskTimePoint})`);
        formula = formula.replace(/taskQualityPoint/g, `(${taskQualityPoint})`);
        formula = formula.replace(/taskCostPoint/g, `(${taskCostPoint})`);
        formula = formula.replace(/taskDilligencePoint/g, `(${taskDilligencePoint})`);

        // thay mã code bằng giá trị(chỉ dùng cho kiểu số)
        for (let i in taskInformations) {
            if (taskInformations[i].type === 'number') {
                let stringToGoIntoTheRegex = `${taskInformations[i].code}`;
                let regex = new RegExp(stringToGoIntoTheRegex, "g");
                formula = formula.replace(regex, `(${taskInformations[i].value})`);
            }
        }

        // thay tất cả các biến có dạng p0, p1, p2,... còn lại thành undefined, để nếu không có giá trị thì sẽ trả về NaN, tránh được lỗi undefined
        for (let i = 0; i < 100; i++) {
            let stringToGoIntoTheRegex = 'p' + i;
            let regex = new RegExp(stringToGoIntoTheRegex, "g");
            formula = formula.replace(regex, undefined);
        }
        autoTaskPoint = calculateExpression(formula);
    } else {
        autoTaskPoint = taskTimePoint + taskQualityPoint + taskCostPoint + taskDilligencePoint;
    }

    if (getCalcPointsOnly) return autoTaskPoint;
    return {
        usedDuration,
        totalDuration,
        schedulePerformanceIndex,
        actionsHasRating,
        sumRatingOfPassedActions,
        sumRatingOfAllActions,
        estimateNormalCost,
        actualCost,
        costPerformanceIndex,
        totalTimeLogs,
        taskTimePoint,
        taskQualityPoint,
        taskCostPoint,
        taskDilligencePoint,
        autoTaskPoint,
    }
}

function calcProjectMemberPoint(data, getCalcPointsOnly = true) {
    // console.log('\n--------------');
    const { task, progress, projectDetail, currentMemberActualCost, info, userId } = data;
    const { timesheetLogs, estimateNormalCost, startDate, endDate, actorsWithSalary, responsibleEmployees, estimateAssetCost, accountableEmployees, estimateNormalTime } = task;
    /***************** Yếu tố tiến độ **********************/
    const usedDuration = getDurationWithoutSatSun(task.startDate, moment().format(), 'milliseconds');
    const totalDuration = task.estimateNormalTime;
    const schedulePerformanceIndex = (Number(progress) / 100) / (usedDuration / totalDuration);
    const memberTimePoint = convertIndexPointToNormalPoint(schedulePerformanceIndex) * (task?.timeWeight || 0.25);
    // console.log('memberTimePoint', memberTimePoint)
    /***************** Yếu tố chất lượng **********************/
    // Các hoạt động (chỉ lấy những hoạt động đã đánh giá của người phê duyệt)
    let actionsHasRating = task.taskActions.filter(item => (
        item.rating && item.rating !== -1
    ))
    let sumRatingOfPassedActions = 0, sumRatingOfAllActions = 0;
    actionsHasRating.length > 0 && actionsHasRating.map((item) => {
        const currentActionImportanceLevel = item.actionImportanceLevel && item.actionImportanceLevel > 0 ? item.actionImportanceLevel : 10;
        if (item.rating >= 5) {
            sumRatingOfPassedActions = sumRatingOfPassedActions + item.rating * currentActionImportanceLevel;
        }
        sumRatingOfAllActions = sumRatingOfAllActions + item.rating * currentActionImportanceLevel;
    });
    const memberQualityPoint = sumRatingOfAllActions === 0
        ? 0
        : [(sumRatingOfPassedActions / sumRatingOfAllActions) * 100] * (task?.qualityWeight || 0.25);
    // console.log('memberQualityPoint', memberQualityPoint)
    /***************** Yếu tố chi phí **********************/
    let actualCost = 0;
    if (currentMemberActualCost) actualCost = Number(currentMemberActualCost);
    // Tìm lương và trọng số thành viên đó
    let estimateNormalMemberCost = 0;
    const currentEmployee = actorsWithSalary.find((actorSalaryItem) => {
        return String(actorSalaryItem.userId) === String(userId)
    });
    if (currentEmployee) {
        estimateNormalMemberCost = Number(currentEmployee.salary) * Number(currentEmployee.weight / 100) * totalDuration
            / (projectDetail.unitTime === 'days' ? MILISECS_TO_DAYS : MILISECS_TO_HOURS);
    }
    const costPerformanceIndex = ((Number(progress) / 100) * estimateNormalMemberCost) / (actualCost);
    const memberCostPoint = convertIndexPointToNormalPoint(costPerformanceIndex) * (task?.costWeight || 0.25);
    // console.log('memberCostPoint', memberCostPoint)
    /***************** Yếu tố chuyên cần **********************/
    let totalTimeLogs = 0;
    for (let timeSheetItem of timesheetLogs) {
        if (String(userId) === String(timeSheetItem.creator.id)) {
            totalTimeLogs += timeSheetItem.duration;
        }
    }
    const memberDilligencePoint = Math.min((totalTimeLogs / totalDuration) * 100 * (task?.dilligenceWeight || 0.25), 100);
    // console.log('memberDilligencePoint', memberDilligencePoint)
    let autoMemberPoint = 0;
    let formula;
    if (task.formulaProjectMember) {
        formula = task.formulaProjectMember;
        const taskInformations = info;

        formula = formula.replace(/memberTimePoint/g, `(${memberTimePoint})`);
        formula = formula.replace(/memberQualityPoint/g, `(${memberQualityPoint})`);
        formula = formula.replace(/memberCostPoint/g, `(${memberCostPoint})`);
        formula = formula.replace(/memberDilligencePoint/g, `(${memberDilligencePoint})`);

        // thay mã code bằng giá trị(chỉ dùng cho kiểu số)
        for (let i in taskInformations) {
            if (taskInformations[i].type === 'number') {
                let stringToGoIntoTheRegex = `${taskInformations[i].code}`;
                let regex = new RegExp(stringToGoIntoTheRegex, "g");
                formula = formula.replace(regex, `(${taskInformations[i].value})`);
            }
        }

        // thay tất cả các biến có dạng p0, p1, p2,... còn lại thành undefined, để nếu không có giá trị thì sẽ trả về NaN, tránh được lỗi undefined
        for (let i = 0; i < 100; i++) {
            let stringToGoIntoTheRegex = 'p' + i;
            let regex = new RegExp(stringToGoIntoTheRegex, "g");
            formula = formula.replace(regex, undefined);
        }
        autoMemberPoint = calculateExpression(formula);
    } else {
        autoMemberPoint = memberTimePoint + memberQualityPoint + memberCostPoint + memberDilligencePoint;
    }

    if (getCalcPointsOnly) return autoMemberPoint;
    return {
        usedDuration,
        totalDuration,
        schedulePerformanceIndex,
        actionsHasRating,
        sumRatingOfPassedActions,
        sumRatingOfAllActions,
        estimateNormalMemberCost,
        actualCost,
        costPerformanceIndex,
        totalTimeLogs,
        memberTimePoint,
        memberQualityPoint,
        memberCostPoint,
        memberDilligencePoint,
        autoMemberPoint,
    }
}

function calcProjectAutoPoint(data, getCalcPointsOnly = true) {
    const { task, progress, projectDetail } = data;
    const { timesheetLogs, estimateNormalCost, startDate, endDate, actorsWithSalary, responsibleEmployees, estimateAssetCost, accountableEmployees } = task;
    const weekDays = getAmountOfWeekDaysInMonth(moment(startDate));
    let autoCalPointProject = undefined;
    let estDuration = 0
    estDuration = getDurationWithoutSatSun(startDate, endDate, projectDetail?.unitTime);
    const estCost = estimateNormalCost;
    const progressTask = progress;
    let realDuration = 0;
    if (timesheetLogs && timesheetLogs.length > 0) {
        for (let timeSheetItem of timesheetLogs) {
            realDuration += timeSheetItem.duration / MILISECS_TO_DAYS * (projectDetail?.unitTime === 'hours' ? 8 : 1);
        }
    }

    let realCost = estimateAssetCost;
    for (let actorItem of actorsWithSalary) {
        for (let timeSheetItem of timesheetLogs) {
            if (actorItem.userId === timeSheetItem.creator.id) {
                realCost += timeSheetItem.duration / MILISECS_TO_DAYS * (projectDetail?.unitTime === 'hours' ? 8 : 1)
                    * actorItem.salary / weekDays * (projectDetail?.unitTime === 'hours' ? 8 : 1);
            }
        }
    }
    const earnedValue = Number(progressTask) / 100 * Number(estimateNormalCost);
    // Tính plannedValue dựa vào thời gian đã trôi qua
    const diffFromStartToEnd = getDurationWithoutSatSun(startDate, endDate, projectDetail?.unitTime);
    const diffFromStartToNow = getDurationWithoutSatSun(startDate, moment().format(), projectDetail?.unitTime) < 0 ? 0 : getDurationWithoutSatSun(startDate, moment().format(), projectDetail?.unitTime);
    const plannedValue = (diffFromStartToNow / diffFromStartToEnd > 1 ? 1 : diffFromStartToNow / diffFromStartToEnd) * Number(estimateNormalCost);

    const actualCost = realCost;
    const costPerformanceIndex = earnedValue / actualCost;

    if (actualCost <= estimateAssetCost || costPerformanceIndex === undefined || costPerformanceIndex === Infinity) autoCalPointProject = undefined;
    else if (realDuration === 0 || costPerformanceIndex < 0.5) autoCalPointProject = 0;
    else if (costPerformanceIndex >= 0.5 && costPerformanceIndex < 0.75) autoCalPointProject = 40;
    else if (costPerformanceIndex >= 0.75 && costPerformanceIndex < 1) autoCalPointProject = 60;
    else if (costPerformanceIndex >= 1 && costPerformanceIndex < 1.25) autoCalPointProject = 80;
    else if (costPerformanceIndex >= 1.25 && costPerformanceIndex < 1.5) autoCalPointProject = 90;
    else autoCalPointProject = 100;

    if (getCalcPointsOnly) return autoCalPointProject;
    return {
        estimateAssetCost,
        estCost,
        estDuration,
        realCost,
        realDuration,
        progressTask,
        earnedValue,
        plannedValue,
        actualCost,
        costPerformanceIndex,
        autoCalPointProject,
    }
}

function calcProjectTaskMemberAutoPoint(data, getCalcPointsOnly = true) {
    const { task, progress, projectDetail, userId } = data;
    const { timesheetLogs, startDate, endDate, actorsWithSalary, responsibleEmployees, estimateAssetCost, accountableEmployees, estimateNormalTime, estimateNormalCost } = task;
    const weekDays = getAmountOfWeekDaysInMonth(moment(startDate));
    // Tính trọng số của userId trong task đó
    let weight = 0;
    const responsibleEmployeesFlatten = responsibleEmployees.map(resItem => String(resItem.id));
    const accountableEmployeesFlatten = accountableEmployees.map(accItem => String(accItem.id));
    if (responsibleEmployeesFlatten.includes(String(userId))) {
        weight = 0.8 / responsibleEmployeesFlatten.length;  // Trọng số phải đi kèm với số người
    } else {
        weight = 0.2 / accountableEmployeesFlatten.length;  // Trọng số phải đi kèm với số người
    }
    let autoCalPointProject = undefined;
    let estDuration = getDurationWithoutSatSun(startDate, endDate, projectDetail?.unitTime) * weight;
    const currentActor = actorsWithSalary.find(item => String(userId) === String(item.userId));
    // estCost là ngân sách - chi phí ước lượng cho task
    const estCost = estDuration * currentActor.salary / weekDays / (projectDetail?.unitTime === 'hours' ? 8 : 1);
    const progressTask = progress;
    let realDuration = 0;
    if (timesheetLogs && timesheetLogs.length > 0) {
        for (let timeSheetItem of timesheetLogs) {
            realDuration += timeSheetItem.duration / MILISECS_TO_DAYS * (projectDetail?.unitTime === 'hours' ? 8 : 1);
        }
    }

    let realCost = 0;
    for (let timeSheetItem of timesheetLogs) {
        if (userId === timeSheetItem.creator.id) {
            realCost += timeSheetItem.duration / MILISECS_TO_DAYS * (projectDetail?.unitTime === 'hours' ? 8 : 1)
                * currentActor.salary / weekDays * (projectDetail?.unitTime === 'hours' ? 8 : 1);
        }
    }

    const earnedValue = Number(progressTask) / 100 * Number(estCost);
    // Tính plannedValue dựa vào thời gian đã trôi qua
    const diffFromStartToEnd = getDurationWithoutSatSun(startDate, endDate, projectDetail?.unitTime);
    const diffFromStartToNow = getDurationWithoutSatSun(startDate, moment().format(), projectDetail?.unitTime) < 0 ? 0 : getDurationWithoutSatSun(startDate, moment().format(), projectDetail?.unitTime);
    const plannedValue = (diffFromStartToNow / diffFromStartToEnd > 1 ? 1 : diffFromStartToNow / diffFromStartToEnd) * Number(estCost);

    const actualCost = realCost;
    const costPerformanceIndex = earnedValue / actualCost;

    if (actualCost === 0 || costPerformanceIndex === undefined || costPerformanceIndex === Infinity) autoCalPointProject = undefined;
    else if (realDuration === 0 || costPerformanceIndex < 0.5) autoCalPointProject = 0;
    else if (costPerformanceIndex >= 0.5 && costPerformanceIndex < 0.75) autoCalPointProject = 40;
    else if (costPerformanceIndex >= 0.75 && costPerformanceIndex < 1) autoCalPointProject = 60;
    else if (costPerformanceIndex >= 1 && costPerformanceIndex < 1.25) autoCalPointProject = 80;
    else if (costPerformanceIndex >= 1.25 && costPerformanceIndex < 1.5) autoCalPointProject = 90;
    else autoCalPointProject = 100;

    if (getCalcPointsOnly) return autoCalPointProject;
    return {
        estCost,
        estDuration,
        realCost,
        realDuration,
        progressTask,
        earnedValue,
        plannedValue,
        actualCost,
        costPerformanceIndex,
        autoCalPointProject,
    };
}
