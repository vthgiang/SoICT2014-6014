import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';
import { AutomaticTaskPointCalculator } from './automaticTaskPointCalculator';
import moment from 'moment'

var mexp = require('math-expression-evaluator');

function ModalShowAutoPointInfo(props) {
    const [state, setState] = useState({})

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

    const convertDateTime = (date, time) => {
        if (date) {
            let splitter = date.split("-");
            let strDateTime = `${splitter[2]}-${splitter[1]}-${splitter[0]} ${time}`;
            return new Date(strDateTime);
        } else {
            return new Date();
        }
    }

    // convert ISODate to String hh:mm AM/PM
    const formatTime = (date) => {
        var d = new Date(date);
        let time = moment(d).format("DD-MM-YYYY hh:mm A");
        return time;
    }
    const { translate } = props;
    const { task, progress, date, time, info, autoPoint } = props; // props from parent component

    console.log('props', props);
    let progressTask = (progress === undefined || progress === "") ? undefined : progress;
    let taskInformations = task.taskInformations;
    // let splitter = date.split('-');
    // let evaluationsDate = new Date(splitter[2], splitter[1] - 1, splitter[0]);
    let evaluationsDate = convertDateTime(date, time);
    let startDate = new Date(task.startDate);
    let endDate = new Date(task.endDate);
    let totalDays = endDate.getTime() - startDate.getTime(); // + 86400000 === + 1 ngày -> do công việc làm theo giờ, nên tính theo giờ, vì thế k cần cộng 1 ngày nữa 
    let daysUsed = evaluationsDate.getTime() - startDate.getTime(); // + 86400000;
    let daysOverdue = (daysUsed - totalDays > 0) ? daysUsed - totalDays : 0;

    console.log('daysUsed 1', daysUsed);
    // chuyển về đơn vị ngày
    totalDays = totalDays / 86400000;
    daysUsed = daysUsed / 86400000;
    daysOverdue = daysOverdue / 86400000;

    console.log('daysUsed 2', daysUsed);
    if (daysUsed <= 0) daysUsed = 0.5;

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
    let a = actionRating.length;

    let noteNotHasFailedAndPassedAction = '';
    // if ((numberOfPassedActions === 0 && numberOfFailedActions === 0) || a === 0) {
    //     numberOfPassedActions = 1;
    //     numberOfFailedActions = 0;
    //     noteNotHasFailedAndPassedAction = translate('task.task_management.explain_not_has_failed_and_passed_action');
    // }

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
    let avgActionNote = !a && translate('task.task_management.explain_avg_rating');
    // let actionNote = !a && translate('task.task_management.explain_avg_rating');

    let formula = task.taskTemplate && task.taskTemplate.formula,
        checkFormulaHasAverageActionRating = false,
        checkFormulaHasFailedAction = false,
        checkFormulaHasPassedAction = false,
        checkFormulaHasDaysOverdue = false,
        checkFormulaHasTotalDays = false,
        checkFormulaHasDaysUsed = false,
        checkFormulaHasProgress = false;

    if (!task.taskTemplate && !task.process) { // Công việc không theo mẫu
        // automaticPoint = a ? autoHasActionInfo : autoDependOnDay;
        formula = task.formula;
        let taskInformations = info;

        if (formula.includes("daysOverdue")) checkFormulaHasDaysOverdue = true;
        if (formula.includes("totalDays")) checkFormulaHasTotalDays = true;
        if (formula.includes("daysUsed")) checkFormulaHasDaysUsed = true;
        if (formula.includes("progress")) checkFormulaHasProgress = true;
        if (formula.includes("numberOfFailedActions")) checkFormulaHasFailedAction = true;
        if (formula.includes("numberOfPassedActions")) checkFormulaHasPassedAction = true;
        if (formula.includes("averageActionRating")) checkFormulaHasAverageActionRating = true;

        formula = formula.replace(/daysOverdue/g, `(${daysOverdue})`);
        formula = formula.replace(/totalDays/g, `(${totalDays})`);
        formula = formula.replace(/daysUsed/g, `(${daysUsed})`);
        formula = formula.replace(/averageActionRating/g, `(${averageActionRating})`);
        formula = formula.replace(/numberOfFailedActions/g, `(${numberOfFailedActions})`);
        formula = formula.replace(/numberOfPassedActions/g, `(${numberOfPassedActions})`);
        formula = formula.replace(/progress/g, `(${progressTask})`);

        // automaticPoint = eval(formula);
        // thay mã code bằng giá trị(chỉ dùng cho kiểu số)
        for (let i in taskInformations) {
            if (taskInformations[i].type === 'number') {
                let stringToGoIntoTheRegex = `${taskInformations[i].code}`;
                let regex = new RegExp(stringToGoIntoTheRegex, "g");
                formula = formula.replace(regex, `${taskInformations[i].value}`);
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
        formula = task.formula;
        let taskInformations = info;

        if (formula.includes("daysOverdue")) checkFormulaHasDaysOverdue = true;
        if (formula.includes("totalDays")) checkFormulaHasTotalDays = true;
        if (formula.includes("daysUsed")) checkFormulaHasDaysUsed = true;
        if (formula.includes("progress")) checkFormulaHasProgress = true;
        if (formula.includes("numberOfFailedActions")) checkFormulaHasFailedAction = true;
        if (formula.includes("numberOfPassedActions")) checkFormulaHasPassedAction = true;
        if (formula.includes("averageActionRating")) checkFormulaHasAverageActionRating = true;

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
                formula = formula.replace(regex, `${taskInformations[i].value}`);
            }
        }

        // thay tất cả các biến có dạng p0, p1, p2,... còn lại thành undefined, để nếu không có giá trị thì sẽ trả về NaN, tránh được lỗi undefined
        for (let i = 0; i < 100; i++) {
            let stringToGoIntoTheRegex = 'p' + i;
            let regex = new RegExp(stringToGoIntoTheRegex, "g");
            formula = formula.replace(regex, undefined);
        }
    }

    let taskInfo = {
        task: task,
        progress: progressTask,
        date: date,
        time: time,
        info: info,
    };

    let automaticPoint = AutomaticTaskPointCalculator.calcAutoPoint(taskInfo);
    console.log('auto', automaticPoint);
    if (isNaN(automaticPoint)) automaticPoint = undefined
    let calcAuto = automaticPoint;

    let result;
    if (calcAuto < 0) {
        result = `${calcAuto} ${translate('task.task_management.explain')}`;
    }
    else if (calcAuto >= 0) {
        result = calcAuto
    }
    else {
        result = translate('task.task_management.calc_nan');
    }

    return (
        <React.Fragment>
            <DialogModal
                size="50"
                modalID={`modal-automatic-point-info`}
                formID="form-automatic-point-info"
                title={translate('task.task_management.calc_form')}
                hasSaveButton={false}
                hasNote={false}
            >
                {(task.taskTemplate) &&
                    <div>
                        <p><strong>{translate('task.task_management.calc_formula')}: </strong>{task.formula}</p>
                        <p>{translate('task.task_management.calc_where')}: </p>
                        <ul style={{ lineHeight: 2.3 }}>
                            {checkFormulaHasProgress && <li>progress - {translate('task.task_management.calc_progress')}: {progressTask === undefined ? translate('task.task_management.calc_no_value') : `${progress}(%)`}</li>}
                            {checkFormulaHasAverageActionRating && <li>averageActionRating - {translate('task.task_management.calc_average_action_rating')}: {averageActionRating} {!a && `(${avgActionNote})`}</li>}
                            {checkFormulaHasFailedAction && <li>numberOfFailedActions - {translate('task.task_management.calc_failed_action_rating')}: {numberOfFailedActions}</li>}
                            {checkFormulaHasPassedAction && <li>numberOfPassedActions - {translate('task.task_management.calc_passed_action_rating')}: {numberOfPassedActions}{`${noteNotHasFailedAndPassedAction}`}</li>}
                            {checkFormulaHasTotalDays && <li>totalDays - {translate('task.task_management.calc_total_day')}: {totalDays} ({translate('task.task_management.calc_days')})</li>}
                            {checkFormulaHasDaysUsed && <li>daysUsed - {translate('task.task_management.calc_day_used')}: {daysUsed} ({translate('task.task_management.calc_days')})</li>}
                            {checkFormulaHasDaysOverdue && <li>daysOverdue - {translate('task.task_management.calc_overdue_date')}: {daysOverdue} ({translate('task.task_management.calc_days')})</li>}
                            {
                                taskInformations && taskInformations.map((e, index) => {
                                    if (e.type === 'number') {
                                        return <li key={index}>{e.code} - {e.name}: {(info[`${e.code}`] && info[`${e.code}`].value) ? info[`${e.code}`].value : translate('task.task_management.calc_no_value')}</li>
                                    }
                                })
                            }
                        </ul>
                        <p><strong>{translate('task.task_management.calc_new_formula')}: </strong>{formula} = {result}</p>
                    </div>
                }
                {(task.taskTemplate === null || task.taskTemplate === undefined) &&
                    <div>
                        <p><strong>{translate('task.task_management.calc_formula')}: </strong> {task.formula} </p>
                        <p>{translate('task.task_management.calc_where')}: </p>
                        <ul style={{ lineHeight: 2.3 }}>
                            {/* <li>progress - {translate('task.task_management.calc_progress')}: {progressTask === undefined ? translate('task.task_management.calc_no_value') : `${progress}(%)`}</li> */}
                            {checkFormulaHasProgress && <li>progress - {translate('task.task_management.calc_progress')}: {progressTask === undefined ? translate('task.task_management.calc_no_value') : `${progress}(%)`}</li>}
                            {checkFormulaHasAverageActionRating && <li>averageActionRating - {translate('task.task_management.calc_average_action_rating')}: {averageActionRating} {!a && `(${avgActionNote})`}</li>}
                            {checkFormulaHasFailedAction && <li>numberOfFailedActions - {translate('task.task_management.calc_failed_action_rating')}: {numberOfFailedActions}</li>}
                            {checkFormulaHasPassedAction && <li>numberOfPassedActions - {translate('task.task_management.calc_passed_action_rating')}: {numberOfPassedActions}{`${noteNotHasFailedAndPassedAction}`}</li>}
                            {checkFormulaHasTotalDays && <li>totalDays - {translate('task.task_management.calc_total_day')}: {totalDays} ({translate('task.task_management.calc_days')})</li>}
                            {checkFormulaHasDaysUsed && <li>daysUsed - {translate('task.task_management.calc_day_used')}: {daysUsed} ({translate('task.task_management.calc_days')})</li>}
                            {checkFormulaHasDaysOverdue && <li>daysOverdue - {translate('task.task_management.calc_overdue_date')}: {daysOverdue} ({translate('task.task_management.calc_days')})</li>}
                            {
                                taskInformations && taskInformations.map((e, index) => {
                                    if (e.type === 'number') {
                                        return <li key={index}>{e.code} - {e.name}: {(info[`${e.code}`] && info[`${e.code}`].value) ? info[`${e.code}`].value : translate('task.task_management.calc_no_value')}</li>
                                    }
                                })
                            }
                        </ul>
                        <p><strong>{translate('task.task_management.calc_new_formula')}: </strong> {formula} = {result}</p>
                        {/* {progressTask}/({daysUsed}/{totalDays}) - {0.5}*({10}-{averageActionRating})*{10} */}
                    </div>
                }

            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const { tasks } = state;
    return { tasks };
}

const modalShowAutoPointInfo = connect(mapState, null)(withTranslate(ModalShowAutoPointInfo));
export { modalShowAutoPointInfo as ModalShowAutoPointInfo }


