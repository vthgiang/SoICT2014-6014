export const AutomaticTaskPointCalculator = {
    calcAutoPoint
}

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

function calcAutoPoint(data) {
    let { task, date, progress, info } = data;

    let splitter = date.split('-');
    let progressTask = (progress !== null && progress !== undefined) ? progress : undefined;
    let evaluationsDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
    let startDate = new Date(task.startDate);
    let endDate = new Date(task.endDate);

    let totalDays = endDate.getTime() - startDate.getTime() + 86400000;
    let daysUsed = evaluationsDate.getTime() - startDate.getTime() + 86400000;
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

    if ((numberOfPassedActions === 0 && numberOfFailedActions === 0) || a === 0) {
        numberOfPassedActions = 1;
        numberOfFailedActions = 0;
    }

    let pen = 0;
    pen = !a ? 0 : (numberOfFailedActions / (numberOfFailedActions + numberOfPassedActions));

    // Tổng số điểm của các hoạt động
    let reduceAction = actionRating.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    reduceAction = reduceAction > 0 ? reduceAction : 0;

    let averageActionRating = !a ? 10 : reduceAction / a; // a = 0 thì avg mặc định là 10
    let autoHasActionInfo = progress / (daysUsed / totalDays) - 0.5 * (10 - (averageActionRating)) * 10;
    let automaticPoint = 0;

    console.log('avgRating', averageActionRating);

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
            automaticPoint = eval(formula);
        }
    }
    else {
        let formula;
        if (!task.taskTemplate && !task.process) { // Công việc không theo mẫu và ko theo quy trình
            // automaticPoint = a ? autoHasActionInfo : autoDependOnDay;
            formula = task.formula;

            formula = formula.replace(/daysOverdue/g, `(${daysOverdue})`);
            formula = formula.replace(/totalDays/g, `(${totalDays})`);
            formula = formula.replace(/daysUsed/g, `(${daysUsed})`);
            formula = formula.replace(/averageActionRating/g, `(${averageActionRating})`);
            formula = formula.replace(/numberOfFailedActions/g, `(${numberOfFailedActions})`);
            formula = formula.replace(/numberOfPassedActions/g, `(${numberOfPassedActions})`);
            formula = formula.replace(/progress/g, `(${progressTask})`);
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


        console.log('form2', formula);
        automaticPoint = eval(formula);
    }

    // automaticPoint = ( !isNaN(automaticPoint) && automaticPoint > 0 ) ? automaticPoint : 0;
    return Math.round(Math.min(automaticPoint, 100));
}
