import React, { useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { customAxisC3js } from '../../../../helpers/customAxisC3js';

import c3 from 'c3';
import 'c3/c3.css';

function DistributionOfEmployeeKpiChart(props) {
    const { translate, createKpiUnit, organizationalUnitKPI } = props;
    const chartRef = useRef(null);

    useEffect(() => {
        multiLineChart(organizationalUnitKPI);
    })

    /** Thiết lập object độ quan trọng của nhân viên */
    const setEmployeeImportance = () => {
        let currentKpi, employeeImportances, objectEmployeeImportance = {};

        if (createKpiUnit) {
            currentKpi = createKpiUnit.currentKPI;
        }
        if (currentKpi) {
            employeeImportances = currentKpi.employeeImportances;
            if (employeeImportances && employeeImportances.length !== 0) {
                employeeImportances.map(item => {
                    objectEmployeeImportance[item?.employee?._id] = item?.importance;
                })
            }
        }

        return objectEmployeeImportance;
    }

    /** Thiết lập dữ liệu biểu đồ */
    const setDataMultiChart = (organizationalUnitKPI) => {
        let dataChartAnalysis = [translate('kpi.organizational_unit.statistics.weight_analysis_employee')], dataChartDefault = [translate('kpi.organizational_unit.statistics.weight_established')], xs = ['x'];
        let objectEmployeeImportance;

        objectEmployeeImportance = setEmployeeImportance();

        if (organizationalUnitKPI && organizationalUnitKPI.length !== 0) {
            organizationalUnitKPI.map(unitKpi => {
                let totalPoint = 0, totalImportance = 0, average;
                if (unitKpi && unitKpi.listEmployeeKpi && unitKpi.listEmployeeKpi.length !== 0) {
                    unitKpi.listEmployeeKpi.map(employeeKpi => {
                        if (employeeKpi.creator && employeeKpi.creator[0] && objectEmployeeImportance[employeeKpi.creator[0]]) {
                            totalPoint = totalPoint + employeeKpi.weight * objectEmployeeImportance[employeeKpi.creator[0]];
                            totalImportance = totalImportance + objectEmployeeImportance[employeeKpi.creator[0]]
                        }
                    })
                }

                if (totalImportance === 0) {
                    average = 0;
                } else {
                    average = Math.round(Number(totalPoint / totalImportance) * 1000) / 1000;
                }

                xs = [...xs, unitKpi.name];
                dataChartAnalysis = [...dataChartAnalysis, average];
                dataChartDefault = [...dataChartDefault, unitKpi.weight];
            })
        }

        return {
            xs: xs,
            dataChart: [
                dataChartDefault,
                dataChartAnalysis
            ]
        }
    }

    /** Xóa biểu đồ cũ */
    const removePreviousChart = (chart) => {
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    /** Render biểu đồ */
    const multiLineChart = (organizationalUnitKPI) => {
        removePreviousChart(chartRef.current);

        let dataChart, xs;
        let dataChartTemp = setDataMultiChart(organizationalUnitKPI);
        if (dataChartTemp) {
            dataChart = dataChartTemp.dataChart;
            xs = dataChartTemp.xs;
        }

        let chart = c3.generate({
            bindto: chartRef.current,

            padding: {
                top: 20,
                bottom: 50,
                right: 20
            },

            data: {
                columns: dataChart,
            },

            axis: {
                x: {
                    type: 'category',
                    tick: {
                        format: function (index) {
                            let result = customAxisC3js('chartRef', xs.filter((item, index) => index > 0), index);
                            return result;
                        }
                    }
                },

                y: {
                    label: {
                        text: translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.weight'),
                        position: 'outer-right'
                    }
                }
            },

            tooltip: {
                format: {
                    title: function (d) {
                        if (xs && xs.length > 1)
                            return xs[d + 1];
                    }
                }
            }
        })
    }

    let currentKpi, organizationalUnitKpiLoading;

    if (createKpiUnit) {
        currentKpi = createKpiUnit.currentKPI;
        organizationalUnitKpiLoading = createKpiUnit.organizationalUnitKpiLoading;
    }


    return (
        <React.Fragment>
            {currentKpi ?
                <div id="chartRef" ref={chartRef}></div>
                : organizationalUnitKpiLoading && <section>{translate('kpi.organizational_unit.dashboard.no_data')}</section>
            }
        </React.Fragment>
    )
}

function mapState(state) {
    const { createKpiUnit } = state;
    return { createKpiUnit };
}
const actions = {

}

const connectedDistributionOfEmployeeKpiChart = connect(mapState, actions)(withTranslate(DistributionOfEmployeeKpiChart));
export { connectedDistributionOfEmployeeKpiChart as DistributionOfEmployeeKpiChart }