import moment from 'moment';
import Swal from 'sweetalert2';
import { getDurationWithoutSatSun } from '../../../project/component/projects/functionHelper';
var mexp = require('math-expression-evaluator'); // native js package

export const AutomaticTaskPointCalculator = {
    calcAutoPoint,
    calcProjectAutoPoint,
    getAmountOfWeekDaysInMonth,
    calcProjectTaskMemberAutoPoint,
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
        // console.log( "m-exp", mexp.eval("2+5/ 0 ", [token1]));
        // console.log( "m-exp", mexp.eval(expression, [token1]));
        let point = mexp.eval(expression, [token1]);
        console.log('point-calculateExpression', point);

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

    let actionRating = actions.map(action => action.rating);

    let numberOfPassedActions = actions.filter(act => act.rating >= 5).length;
    let numberOfFailedActions = actions.filter(act => act.rating < 5).length;

    // Tổng số hoạt động
    let a = 0;
    a = actionRating.length;

    // if ((numberOfPassedActions === 0 && numberOfFailedActions === 0) || a === 0) {
    //     numberOfPassedActions = 1;
    //     numberOfFailedActions = 0;
    // }

    let pen = 0;
    pen = !a ? 0 : (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions));

    // Tổng số điểm của các hoạt động
    let reduceAction = actionRating.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    reduceAction = reduceAction > 0 ? reduceAction : 0;

    let averageActionRating = !a ? 10 : reduceAction / a; // a = 0 thì avg mặc định là 10
    let autoHasActionInfo = progress / (daysUsed / totalDays) - 0.5 * (10 - (averageActionRating)) * 10;
    let automaticPoint = 0;

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
            formula = formula.replace(/numberOfFailedActions/g, `(${numberOfFailedActions})`);
            formula = formula.replace(/numberOfPassedActions/g, `(${numberOfPassedActions})`);
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
            formula = formula.replace(/numberOfFailedActions/g, `(${numberOfFailedActions})`);
            formula = formula.replace(/numberOfPassedActions/g, `(${numberOfPassedActions})`);
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
            formula = formula.replace(/numberOfFailedActions/g, `(${numberOfFailedActions})`);
            formula = formula.replace(/numberOfPassedActions/g, `(${numberOfPassedActions})`);
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
    // console.log('estDuration---------------------', estDuration)
    let realCost = estimateAssetCost;
    for (let actorItem of actorsWithSalary) {
        const weight = responsibleEmployees.find(responsibleItem => responsibleItem.id === actorItem.userId) ? 0.8 : 0.2;
        for (let timeSheetItem of timesheetLogs) {
            if (actorItem.userId === timeSheetItem.creator.id) {
                realCost += timeSheetItem.duration / MILISECS_TO_DAYS * (projectDetail?.unitTime === 'hours' ? 8 : 1) * weight
                    * actorItem.salary / weekDays / (projectDetail?.unitTime === 'hours' ? 8 : 1);
            }
        }
    }
    const earnedValue = Number(progressTask) / 100 * Number(estimateNormalCost);
    const plannedValue = Number(estDuration) / Number(realDuration) * 100 * Number(estimateNormalCost);
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
    const { timesheetLogs, startDate, endDate, actorsWithSalary, responsibleEmployees, estimateAssetCost, accountableEmployees } = task;
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
    // console.log('estDuration', estDuration)
    // console.log('currentActor.salary', currentActor.salary)
    // console.log('weekDays', weekDays)
    // console.log(projectDetail?.unitTime === 'hours' ? 8 : 1)
    const estCost = estDuration * currentActor.salary / weekDays / (projectDetail?.unitTime === 'hours' ? 8 : 1);
    // console.log('estCost', estCost)
    const progressTask = progress;
    let realDuration = 0;
    if (timesheetLogs && timesheetLogs.length > 0) {
        for (let timeSheetItem of timesheetLogs) {
            realDuration += timeSheetItem.duration / MILISECS_TO_DAYS * (projectDetail?.unitTime === 'hours' ? 8 : 1);
        }
    }
    // console.log('realDuration', realDuration)
    let realCost = 0;
    for (let timeSheetItem of timesheetLogs) {
        if (userId === timeSheetItem.creator.id) {
            realCost += timeSheetItem.duration / MILISECS_TO_DAYS * (projectDetail?.unitTime === 'hours' ? 8 : 1) * weight
                * currentActor.salary / weekDays / (projectDetail?.unitTime === 'hours' ? 8 : 1);
        }
    }
    // console.log('realCost', realCost)
    const earnedValue = Number(progressTask) / 100 * Number(estCost);
    const plannedValue = Number(estDuration) / Number(realDuration) * 100 * Number(estCost);
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
