// const mexp = require('math-expression-evaluator')
import Mexp from 'math-expression-evaluator'

const calculateExpression = (expression) => {
  try {
    const token1 = {
      type: 2,
      token: '/',
      show: '/',
      value(f1, f2) {
        if (f2 === 0) return 0
        return f1 / f2
      }
    }
    const point = Mexp.eval(expression, [token1])

    return point
  } catch (err) {
    return null
  }
}

function result(formulaParam, vehicleCost) {
  let formula = formulaParam
  let averageFeeTransport = 0
  const vehicleCostData = vehicleCost.costList

  vehicleCostData.forEach((cost) => {
    if (cost.code === 'XANG') {
      averageFeeTransport = cost.cost * vehicleCost.averageGasConsume
    } else {
      formula = formula.replaceAll(cost.code, `(${cost.cost})`)
    }
  })
  formula.replaceAll('XANG', '')
  const automaticPoint = calculateExpression(formula)

  return {
    fixedCost: automaticPoint,
    operationCost: averageFeeTransport
  }
}

export const CalculateVehicleCost = {
  result
}
