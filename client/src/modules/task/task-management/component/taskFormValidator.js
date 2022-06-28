var mexp = require('math-expression-evaluator');
export const TaskFormValidator = {
    validateTaskStartDate,
    validateTaskEndDate,
    validateTimeEst,
    validateCostEst,
    validateFormula
}


/**
 * @param {*} value Định dạng: dd-mm-yyyy
 */
function validateTaskStartDate(startDate, endDate, translate) {
    let msg = undefined;

    if (startDate.trim() === "") {
        msg = translate('task.task_management.add_err_empty_start_date');
    } else if (endDate !== "") {
        msg = _validateTaskDate(startDate, endDate, translate);
    }
    return msg;
}

/**
 * @param {*} startDate Định dạng: dd-mm-yyyy
 * @param {*} endDate Định dạng: dd-mm-yyyy
 */
function validateTaskEndDate(startDate, endDate, translate) {
    let msg = undefined;

    if (endDate.trim() === "") {
        msg = translate('task.task_management.add_err_empty_end_date');
    } else if (startDate !== "") {
        msg = _validateTaskDate(startDate, endDate, translate);
    }
    return msg;
}

/**
 * Hàm tiện ích kiểm tra ngày bắt đầu phải trước ngày kết thúc
 * @param {*} startDate ngày bắt đầu
 * @param {*} endDate ngày kết thúc
 */
function _validateTaskDate(startDate, endDate, translate) {
    let msg = undefined;
    var pattern = /(\d{2})\-(\d{2})\-(\d{4})/;

    var startDate = new Date(startDate.replace(pattern, '$3-$2-$1'));
    var endDate = new Date(endDate.replace(pattern, '$3-$2-$1'));
    if (startDate > endDate) {
        msg = translate('task.task_management.add_err_end_date');
    }
    return msg;
}

/**
 * Hàm tiện ích kiểm tra thời gian ước lượng
 * @param {*} value giá trị kiểm tra
 */
function validateTimeEst(value, translate, mustBeLower = true, compareNumber = Infinity) {
    let msg = undefined;
    if (!value || Number(value) < 0 || (Number(value) - 2) < 0) {
        msg = translate('project.task_management.add_err_time_cost');
    }
    else if ((mustBeLower && Number(value) >= compareNumber)) {
        msg = 'Thời gian ước lượng thoả hiệp phải bé hơn Thời gian ước lượng';
    }
    return msg;
}

/**
 * Hàm tiện ích kiểm tra chi phí ước lượng
 * @param {*} value giá trị kiểm tra
 */
function validateCostEst(value, translate) {
    let msg = undefined;
    if (!value || Number(value) < 0) {
        msg = translate('project.task_management.add_err_time_cost');
    }
    return msg;
}

const calculateExpression = (expression) => {
    try {
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
        console.log('point', point);

        return point;
    } catch (err) {
        return null;
    }
}

function validateFormula(value) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Công thức tính không được để trống";
    } else {
        let formula = value;

        // thay các biến bằng giá trị
        formula = formula.replace(/averagePoint/g, `(1)`);
        formula = formula.replace(/numberOfTaskInprocess/g, `(1)`);


        // thay tất cả các biến có dạng p0, p1, p2,... 1
        for (let i = 0; i < 100; i++) {
            let stringToGoIntoTheRegex = 'p' + i;
            let regex = new RegExp(stringToGoIntoTheRegex, "g");
            formula = formula.replace(regex, 1);
        }

        let automaticPoint;
        automaticPoint = calculateExpression(formula);
        if (typeof automaticPoint !== "number") {
            msg = "Công thức không hợp lệ. Hãy kiểm tra lại các toán tử và toán hạng của công thức."
        }
    }
    return msg;
}