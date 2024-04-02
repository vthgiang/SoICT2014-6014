var mexp = require('math-expression-evaluator');

export const CalculateVehicleCost = {
    result
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

        return point;
    }catch(err){
        return null;
    }
}

function result(formulaParam, vehicleCost) {
    let formula = formulaParam;
    let mes;
    let averageFeeTransport = 0;
    let vehicleCostData = vehicleCost.costList;

    vehicleCostData.forEach((cost) => {
        if (cost.code == "XANG") {
            averageFeeTransport = cost.cost * vehicleCost.averageGasConsume;
        } else {
            formula = formula.replaceAll(cost.code, `(${cost.cost})`);
        }
    });

    let automaticPoint;
    formula.replaceAll("XANG", '');
    automaticPoint = calculateExpression(formula);

    return {
        fixedCost: automaticPoint,
        operationCost: averageFeeTransport
    }
}