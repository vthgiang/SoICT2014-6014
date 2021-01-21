import { VALIDATOR } from '../../../../helpers/validator';
var mexp = require('math-expression-evaluator'); // native js package

export const TaskTemplateFormValidator = {
    validateTaskTemplateUnit,
    validateTaskTemplateRead,
    validateTaskTemplateName,
    validateTaskTemplateDescription,
    validateTaskTemplateFormula,
    validateActionName,
    validateActionDescription,
    validateInfoName,
    validateInfoDescription,
    validateInfoSetOfValues,
    validateTaskTemplateNumberOfDaysTaken,
}

const calculateExpression = (expression) => {
    try{
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
    }catch(err){
        return null;
    }
}

function validateTaskTemplateUnit(value) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Cần chọn đơn vị";
    }
    return msg;
}

function validateTaskTemplateRead(value) {
    let msg = undefined;
    if (value.length === 0) {
        msg = "Cần chỉ rõ người được xem mẫu công việc";
    }
    return msg;
}

function validateTaskTemplateName(value) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Tên không được để trống";
    } else if (!VALIDATOR.isValidName(value)) {
        msg = "Tên không chứa ký tự đặc biệt";
    }
    return msg;
}

function validateTaskTemplateDescription(value) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Mô tả không được để trống";
    }
    return msg;
}

function validateTaskTemplateFormula(value) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Công thức tính không được để trống";
    } else {
        let formula = value;

        // thay các biến bằng giá trị
        formula = formula.replace(/daysOverdue/g, `(1)`);
        formula = formula.replace(/totalDays/g, `(1)`);
        formula = formula.replace(/daysUsed/g, `(1)`);
        formula = formula.replace(/averageActionRating/g, `(1)`);
        formula = formula.replace(/numberOfFailedActions/g, `(1)`);
        formula = formula.replace(/numberOfPassedActions/g, `(1)`);
        formula = formula.replace(/progress/g, `(1)`);

        // thay tất cả các biến có dạng p0, p1, p2,... 1
        for (let i = 0; i < 100; i++) {
            let stringToGoIntoTheRegex = 'p' + i;
            let regex = new RegExp(stringToGoIntoTheRegex, "g");
            formula = formula.replace(regex, 1);
        }

        let automaticPoint;
        automaticPoint = calculateExpression(formula);
        console.log('formula', formula, automaticPoint, typeof automaticPoint);
        if (typeof automaticPoint !== "number") {
            msg = "Công thức không hợp lệ. Hãy kiểm tra lại các toán tử và toán hạng của công thức."
        }
    }
    return msg;
}

function validateTaskTemplateNumberOfDaysTaken(value) {
    let msg = undefined;
    let parseValue = parseInt(value);
    console.log('val', value);
    if (parseValue <= 0) {
        msg = "Số ngày thực hiện dự kiến phải lớn hơn 0";
    }
    // else if (value.trim() === ""){
    //     msg = "Số ngày hoàn thành công việc dự kiến không được để trống";
    // }
    return msg;
}

function validateActionName(value) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Tên không được để trống";
    }
    return msg;
}

function validateActionDescription(value) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Mô tả không được để trống";
    }
    return msg;
}

function validateInfoName(value) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Tên không được để trống";
    }
    return msg;
}

function validateInfoDescription(value) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Mô tả không được để trống";
    }
    return msg;
}

function validateInfoSetOfValues(value) {
    let msg = undefined;
    if (value.trim() === "") {
        msg = "Tập giá trị không được để trống";
    }
    return msg;
}