var mexp = require('math-expression-evaluator'); // native js package

export const KpiTemplateFormValidator = {
    validateKpiTemplateFormula,
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


function validateKpiTemplateFormula(value) {
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